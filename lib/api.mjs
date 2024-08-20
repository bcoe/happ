import { arrayMove } from '@dnd-kit/sortable';
import * as Sentry from '@sentry/node';

import { randomUUID } from 'node:crypto';
import { spanToTraceHeader, getDynamicSamplingContextFromSpan } from '@sentry/core';
import { dynamicSamplingContextToSentryBaggageHeader } from '@sentry/utils';
import { createRequestHandler } from '@remix-run/express';

import cors from 'cors';
import express from 'express';

// Session stuff:
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import session from 'express-session';

import { OAuth2Client } from 'google-auth-library';
import './helpers/instrument.mjs';
import getDB from './helpers/db.mjs';

// import { MongoClient } from 'mongodb';

const isTestEnvironment = process.env.NODE_ENV === 'test';
const isDevEnvironment = process.env.NODE_ENV === 'development';
const app = express();
const viteDevServer = isDevEnvironment
  ? await import('vite').then((vite) => vite.createServer({
    server: { middlewareMode: true },
  })) : null;
const GOOGLE_ACCOUNT_TYPE = 'google';
const CACHED_HABITS_SESSION_KEY = 'cached_habits_daily';
const QUEUE_KEY = 'metrics-jobs';

let build = () => {};
if (!isTestEnvironment) {
  build = viteDevServer
    ? () => viteDevServer.ssrLoadModule(
      'virtual:remix/server-build',
    )
    : await import('../build/server/index.js');
}

let db; // DB will be set when server connects.
let oAuth2Client;
let redisClient;
// let client;

async function getUserSessionForAuthToken(accessToken, req) {
  // Is there a user record associated with this access token:
  const userByAccessToken = await db('users')
    .select('id')
    .where('users.access_token', accessToken);
  if (userByAccessToken.length) {
    const { id } = userByAccessToken[0];
    req.session.userId = id;
  } else {
    // Okay, we seem to have an access token but haven't created a user record yet:
    const profReq = await global.fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const profile = await profReq.json();
    // Check if an entry already exists for this user:
    const usersByEmailAccountType = await db('users')
      .select('id')
      .where('users.account_type', GOOGLE_ACCOUNT_TYPE)
      .where('users.email', profile.email);
    if (usersByEmailAccountType.length === 0) {
      const { id } = (await db('users').insert({
        email: profile.email,
        account_type: GOOGLE_ACCOUNT_TYPE,
        access_token: accessToken,
      }, ['id']))[0];
      req.session.userId = id;
    } else {
      const { id } = usersByEmailAccountType[0];
      req.session.userId = id;
    }
  }
}

export const helpers = {
  async authenticated(req, res, next) {
    req.userId = req.session.userId;

    // TODO FIXME: this will fetch session for every request that only has auth token, i.e. every
    // mobile request - should be cached in e.g. redis
    if (!req.userId && req.headers.authorization) {
      const authToken = req.headers.authorization.substring('Bearer '.length);
      await getUserSessionForAuthToken(authToken, req);
      req.userId = req.session.userId;
    }

    if (!req.userId) {
      const status = 401;
      return res.status(status).send(JSON.stringify({
        status,
        error: 'unauthorized',
      }));
    }
    return next();
  },
};

async function init() {
  // client = new MongoClient(process.env.MONGO_URL);
  // await client.connect();

  db = getDB();
  oAuth2Client = new OAuth2Client(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.OAUTH_REDIRECT,
  );
  app.use(
    viteDevServer
      ? viteDevServer.middlewares
      : express.static('build/client'),
  );
  app.use(cors());
  app.use(express.json());
  const sessionOpts = {
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: process.env.SESSION_SECRET,
  };
  if (!isTestEnvironment) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });
    const redisStore = new RedisStore({
      client: redisClient,
      prefix: `happ:${process.env.NODE_ENV}`,
    });
    redisClient.connect();
    sessionOpts.store = redisStore;
  }
  app.use(session(sessionOpts));

  app.post('/v1/habits', (req, res, next) => helpers.authenticated(req, res, next), async (req, res) => {
    const date = (new Date()).toLocaleString('lt', { timeZone: 'America/New_York' }).split(' ')[0];
    const {
      name, days = {
        Mon: true,
        Tue: true,
        Wed: true,
        Thu: true,
        Fri: true,
        Sat: true,
        Sun: true,
      },
    } = req.body;
    if (!name) {
      const status = 422;
      res.status(status).send(JSON.stringify({
        status,
        error: 'missing name',
      }));
    } else {
      let id;
      await db.transaction(async (txn) => {
        const insertHabitResp = (await txn('habits').insert({
          name,
          user_id: req.userId,
          days,
        }, ['id']))[0];
        id = insertHabitResp.id;
        // Also insert into the daily habits table:
        // TODO: we should make sure we populate the other habits
        // if the habits haven't yet been created for the day.
        await txn('habits_daily').insert({
          date,
          name,
          days,
          user_id: req.userId,
          habit_id: id,
        });
        // Get the maximum position:
        const habits = await txn('habits_active_position')
          .where('user_id', req.userId)
          .first(['sorted_habit_ids']);
        if (habits === undefined) {
          await txn('habits_active_position')
            .insert({
              user_id: req.userId,
              sorted_habit_ids: [id],
            });
        } else {
          await txn('habits_active_position')
            .where('user_id', req.userId)
            .update({
              sorted_habit_ids: [...habits.sorted_habit_ids, id],
            });
        }
      });
      res.type('json');
      const status = 201;
      req.session[CACHED_HABITS_SESSION_KEY] = null;
      res.status(status).send(JSON.stringify({
        status,
        id,
      }));
    }
  });

  app.put('/v1/habits/:id', (req, res, next) => helpers.authenticated(req, res, next), async (req, res) => {
    const { name, days } = req.body;
    const date = (new Date()).toLocaleString('lt', { timeZone: 'America/New_York' }).split(' ')[0];
    if (!name) {
      const status = 422;
      res.status(status).send(JSON.stringify({
        status,
        error: 'missing name',
      }));
    } else {
      await db.transaction(async (txn) => {
        const update = {
          name,
        };
        if (days) update.days = JSON.stringify(days);
        await txn('habits')
          .where('id', req.params.id)
          .update(update);
        await txn('habits_daily')
          .where('habit_id', req.params.id)
          .where('date', date)
          .update(update);
      });
      res.type('json');
      const status = 200;
      req.session[CACHED_HABITS_SESSION_KEY] = null;
      res.status(status).send(JSON.stringify({
        status,
        id: req.params.id,
      }));
    }
  });

  app.delete('/v1/habits/:id', (req, res, next) => helpers.authenticated(req, res, next), async (req, res) => {
    const date = (new Date()).toLocaleString('lt', { timeZone: 'America/New_York' }).split(' ')[0];
    await db.transaction(async (txn) => {
      // Remove from habits, setting 'active'=false, so that we have a record of past
      // habits in this table:
      await txn('habits')
        .where('id', req.params.id)
        .update({
          active: false,
        });
      // For daily habits we just delete:
      await txn('habits_daily')
        .where('habit_id', req.params.id)
        .where('date', date)
        .del();
      // Remove the deleted habit from sort order:
      // TODO: it's fragile that not removing the item from the position list
      // results in exceptions on the frontend, make this logic more resilient.
      const habits = await txn('habits_active_position')
        .where('user_id', req.userId)
        .first(['sorted_habit_ids']);
      if (habits.sorted_habit_ids) {
        await txn('habits_active_position')
          .where('user_id', req.userId)
          .update({
            sorted_habit_ids: habits.sorted_habit_ids.filter((h) => h !== req.params.id),
          });
      }
    });
    res.type('json');
    const status = 200;
    req.session[CACHED_HABITS_SESSION_KEY] = null;
    res.status(status).send(JSON.stringify({
      status,
      id: req.params.id,
    }));
  });

  app.post('/v1/habits/array-move', (req, res, next) => helpers.authenticated(req, res, next), async (req, res) => {
    // const collection = client.db().collection('collection');
    // console.info(await collection.insertOne({ _id: randomUUID(), batman: 'Caped Crusader' }));

    await db.transaction(async (txn) => {
      // Get the maximum position:
      const habits = await txn('habits_active_position')
        .where('user_id', req.userId)
        .first(['sorted_habit_ids']);
      if (habits.sorted_habit_ids) {
        await txn('habits_active_position')
          .where('user_id', req.userId)
          .update({
            sorted_habit_ids: arrayMove(
              habits.sorted_habit_ids,
              req.body.oldIndex,
              req.body.newIndex,
            ),
          });
      }
    });
    const habits = await db('habits_active_position')
      .where('user_id', req.userId)
      .first(['sorted_habit_ids']);
    req.session[CACHED_HABITS_SESSION_KEY] = null;
    res.status(200).send(habits.sorted_habit_ids);
  });

  app.post('/v1/habits-daily', (req, res, next) => helpers.authenticated(req, res, next), async (req, res) => {
    await db('habits_daily')
      .where('user_id', req.userId)
      .where('habit_id', req.body.habit_id)
      .where('date', req.body.date)
      .update({
        status: req.body.status,
      });
    req.session[CACHED_HABITS_SESSION_KEY] = null;
    res.status(200).send({});
  });

  app.get('/v1/habits-daily', (req, res, next) => helpers.authenticated(req, res, next), async (req, res) => {
    let status = 200;
    const dow = (new Date()).toLocaleString('en-GB', { timeZone: 'America/New_York', weekday: 'short' });
    const data = await Sentry.startSpan(
      {
        name: 'fetch cached daily habits',
        op: 'cache.get_item',
      },
      async (span) => {
        const date = (new Date()).toLocaleString('lt', { timeZone: 'America/New_York' }).split(' ')[0];
        // If the daily habits entry was available in cache, return it immediately:
        const cachedValue = req.session[CACHED_HABITS_SESSION_KEY];
        if (span) {
          span.setAttribute('cache.hit', !!cachedValue);
        }
        if (cachedValue && cachedValue.length
            && cachedValue[0] && cachedValue[0].date.includes(date)) {
          span.setAttribute('cache.item_size', JSON.stringify(cachedValue).length);
          return cachedValue;
        }
        let habitsDaily = await db('habits_daily')
          .select(['name', 'status', 'habit_id', 'status', 'date', 'days'])
          .where('habits_daily.date', date)
          .where('habits_daily.user_id', req.userId);
        // If no habits have been created yet for the given day
        // populate for the day.
        if (habitsDaily.length === 0) {
          const habits = await db('habits')
            .select(['name', 'days', 'id'])
            .where('habits.user_id', req.userId)
            .where('habits.active', true);
          // No daily habits have been created yet to copy:
          if (habits.length === 0) {
            return [];
          }
          habitsDaily = habits.map((habit) => ({
            name: habit.name,
            date,
            days: habit.days,
            habit_id: habit.id,
            user_id: req.userId,
            status: false,
          }));
          await db.transaction(async () => {
            status = 201;
            const dbResp = await db('habits_daily').insert(habitsDaily);
            if (dbResp.rowCount !== habitsDaily.length) {
              throw Error('error occurred populating daily habits');
            }
          });
        }
        // Use the positions table to order results:
        const results = [];
        const lookup = Object.create(null);
        habitsDaily.forEach((h) => {
          lookup[h.habit_id] = h;
        });
        const positions = await db('habits_active_position')
          .first('sorted_habit_ids')
          .where('user_id', req.userId);
        if (positions) {
          positions.sorted_habit_ids.forEach((position) => {
            results.push(lookup[position]);
          });
        }
        if (span) {
          span.setAttribute('cache.item_size', JSON.stringify(results).length);
        }
        req.session[CACHED_HABITS_SESSION_KEY] = results;
        return results;
      },
    );
    res.type('json');
    res.status(status).send({
      habits: data,
      current_dow: dow,
    });
  });

  app.get('/v1/callback', async (req, res) => {
    const { tokens: { access_token: accessToken } } = await oAuth2Client.getToken(req.query.code);
    await getUserSessionForAuthToken(accessToken, req);
    res.redirect('/habits');
  });

  app.get('/v1/logout', (req, res, next) => helpers.authenticated(req, res, next), async (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });

  // Create background jobs to process metrics:
  app.post('/v1/metrics', async (req, res) => {
    if (req.body.secret !== process.env.WEBHOOK_SECRET) {
      return res.status(401).send('unauthorized');
    }
    const messageId = randomUUID();
    const userIds = await db('habits_daily')
      .distinct('user_id');
    await Promise.all(userIds.map(async (userId) => {
      await Sentry.startSpan(
        {
          name: 'metrics_producer',
          op: 'queue.publish',
          attributes: {
            'messaging.destination.name': 'metrics_background',
            'messaging.message.id': messageId,
          },
        },
        async (span) => {
          const traceHeader = spanToTraceHeader(span);
          const dynamicSamplingContext = getDynamicSamplingContextFromSpan(span);
          const baggageHeader = dynamicSamplingContextToSentryBaggageHeader(dynamicSamplingContext);

          await redisClient.lPush(QUEUE_KEY, JSON.stringify({
            traceHeader,
            baggageHeader,
            timestamp: Date.now(),
            messageId,
            userId: userId.user_id,
          }));
        },
      );
    }));
    return res.send('ok');
  });

  app.get('/v1/metrics', (req, res, next) => helpers.authenticated(req, res, next), async (req, res) => {
    const status = 200;
    const metrics = await db('daily_habit_metrics')
      .select(['date', 'habits_completed', 'total_habits_for_day'])
      .where('daily_habit_metrics.user_id', req.userId)
      .orderBy('date', 'asc');
    res.type('json');
    res.status(status).send(metrics);
  });

  // Serve react site.
  app.all('*', createRequestHandler({ build }));
  // The error handler must be registered before any other error
  // middleware and after all controllers
  if (!isTestEnvironment) {
    Sentry.setupExpressErrorHandler(app);
  }
}

export async function listen(port) {
  await init();
  return new Promise((resolve) => {
    const server = app.listen(port, () => resolve({
      close: async () => {
        if (db) db.destroy();
        if (redisClient) redisClient.disconnect();
        return new Promise((r2) => {
          server.close(() => r2());
        });
      },
    }));
  });
}

export function getGoogleOAuthClient() {
  return oAuth2Client;
}

export function getDatabase() {
  return db;
}
