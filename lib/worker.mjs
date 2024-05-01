import 'dotenv/config';

import { createClient } from 'redis';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import getDB from './helpers/db.mjs';

const isTestEnvironment = process.env.NODE_ENV === 'test';
const READ_INTERVAL = 3000;
const QUEUE_KEY = 'metrics-jobs';

if (!isTestEnvironment) {
  Sentry.init({
    debug: true,
    environment: process.env.NODE_ENV,
    dsn: 'https://e8c6953f82f7bdadbab491d4fb2c8caf@o4506956365430784.ingest.us.sentry.io/4506956389416960',
    integrations: [
      nodeProfilingIntegration(),
      // ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
      new Sentry.Integrations.Postgres(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
  });
}

let db;
let redisClient;
export async function init() {
  redisClient = createClient({
    url: process.env.REDIS_URL,
  });
  redisClient.connect();
  db = getDB();
}

export default function consume() {
  setInterval(async () => {
    const jobString = await redisClient.lPop(QUEUE_KEY);
    if (jobString) {
      const job = JSON.parse(jobString);
      const latency = Date.now() - job.timestamp;
      Sentry.continueTrace(
        { sentryTrace: job.traceHeader, baggage: job.baggageHeader },
        (transactionContext) => {
          Sentry.startSpan({
            ...transactionContext,
            name: 'metrics_consumer',
            op: 'queue.task',
            attributes: {
              'messaging.destination.name': 'metrics_background',
              'messaging.message.receive.latency': latency,
              'messaging.message.id': job.messageId,
              'messaging.message.retry.count': 0,
            },
          }, async () => {
            const dailyBucket = Object.create(null);
            const habits = await db('habits_daily')
              .where('user_id', job.userId)
              .select();
            habits.forEach((habit) => {
              const date = (new Date(habit.date)).toLocaleString('lt', { timeZone: 'America/New_York' }).split(' ')[0];
              dailyBucket[date] ||= {
                user_id: job.userId,
                habits_completed: 0,
                total_habits_for_day: 0,
                date,
              };
              if (habit.status) dailyBucket[date].habits_completed += 1;
              dailyBucket[date].total_habits_for_day += 1;
            });
            await Promise.all(Object.keys(dailyBucket)
              .map(async (key) => db.transaction(async (trx) => {
                const exists = !!(await trx('daily_habit_metrics')
                  .where('date', key)
                  .where('user_id', job.userId)
                  .first());
                if (exists) {
                  await trx('daily_habit_metrics')
                    .where('user_id', job.userId)
                    .where('date', dailyBucket[key].date)
                    .update({
                      habits_completed: dailyBucket[key].habits_completed,
                      total_habits_for_day: dailyBucket[key].total_habits_for_day,
                    });
                } else {
                  await trx('daily_habit_metrics').insert(dailyBucket[key]);
                }
              })));
          });
          Sentry.setContext('trace', {
            status: 'ok',
          });
        },
      );
    }
  }, READ_INTERVAL);
}

if (process.argv[2] === 'start') {
  init();
  consume();
}
