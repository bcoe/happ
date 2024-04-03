import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

import { createClient } from 'redis';
import express from 'express';
import knex from 'knex';
import RedisStore from 'connect-redis';
import session from 'express-session';

const isTestEnvironment = process.env.NODE_ENV === 'test';
const app = express();

export const helpers = {
  authenticated(req, res, next) {
    return next();
  },
};

let db; // DB will be set when server connects.
let redisClient;
function init() {
  db = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL,
  });
  redisClient = createClient({
    url: process.env.REDIS_URL,
  });
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: `happ:${process.env.NODE_ENV}`,
  });
  redisClient.connect();

  app.use(express.json());
  app.use(
    session({
      store: redisStore,
      resave: false, // required: force lightweight session keep alive (touch)
      saveUninitialized: false, // recommended: only save session when data exists
      secret: process.env.SESSION_SECRET,
    }),
  );

  if (!isTestEnvironment) {
    Sentry.init({
      debug: true,
      dsn: 'https://e8c6953f82f7bdadbab491d4fb2c8caf@o4506956365430784.ingest.us.sentry.io/4506956389416960',
      integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({ app }),
        nodeProfilingIntegration(),
        // ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
        new Sentry.Integrations.Postgres(),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, //  Capture 100% of the transactions
      // Set sampling rate for profiling - this is relative to tracesSampleRate
      profilesSampleRate: 1.0,
    });

    // The request handler must be the first middleware on the app
    app.use(Sentry.Handlers.requestHandler());

    // TracingHandler creates a trace for every incoming request
    app.use(Sentry.Handlers.tracingHandler());
  }

  app.post('/habits', (req, res, next) => helpers.authenticated(req, res, next), async (req, res) => {
    res.type('json');
    const { name } = req.body;
    if (!name) {
      const status = 422;
      res.status(status).send(JSON.stringify({
        status,
        error: 'missing name',
      }));
    } else {
      const { id } = (await db('habits').insert({
        name,
        user_id: req.userId,
      }, ['id']))[0];
      const status = 201;
      res.status(status).send(JSON.stringify({
        status,
        id,
      }));
    }
  });

  // The error handler must be registered before any other error
  // middleware and after all controllers
  if (!isTestEnvironment) {
    app.use(Sentry.Handlers.errorHandler());
    // Optional fallthrough error handler
    app.use((_err, _req, res) => {
      // The error id is attached to `res.sentry` to be returned
      // and optionally displayed to the user for support.
      res.statusCode = 500;
      res.end(`${res.sentry}\n`);
    });
  }
}

export async function listen(port) {
  init();
  return new Promise((resolve) => {
    const server = app.listen(port, () => resolve({
      close: async () => {
        db.destroy();
        redisClient.disconnect();
        return new Promise((r2) => {
          server.close(() => r2());
        });
      },
    }));
  });
}

export function getDatabase() {
  return db;
}
