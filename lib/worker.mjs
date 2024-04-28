import { createClient } from 'redis';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

const isTestEnvironment = process.env.NODE_ENV === 'test';
const READ_INTERVAL = 3000;
export const QUEUE_KEY = 'metrics-jobs';

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

let redisClient;
export async function init() {
  redisClient = createClient({
    url: process.env.REDIS_URL,
  });
  redisClient.connect();
}

export default function consume() {
  setInterval(async () => {
    const jobString = await redisClient.lPop(QUEUE_KEY);
    if (jobString) {
      const job = JSON.parse(jobString);
      const latency = Date.now() - job.timestamp;
      console.info(latency);
      Sentry.continueTrace(
        { sentryTrace: job.traceHeader, baggage: job.baggageHeader },
        (transactionContext) => {
          Sentry.startSpan({
            ...transactionContext,
            name: 'metrics_consumer',
            op: 'queue.task.celery', // queue.task.celery
            attributes: {
              'messaging.destination.name': 'metrics_background',
              'messaging.message.receive.latency': latency,
              'messaging.message.id': job.messageId,
              'messaging.message.retry.count': 0,
            },
          }, async () => new Promise((resolve) => {
            console.info('begin some slow operation');
            setTimeout(resolve, Math.random() * 5000);
          }));
        },
      );
    }
  }, READ_INTERVAL);
}

if (process.argv[2] === 'start') {
  init();
  consume();
}
