import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { createRequestHandler } from '@remix-run/express';

import { createClient } from 'redis';
import express from 'express';
import knex from 'knex';
import RedisStore from 'connect-redis';
import session from 'express-session';

const isTestEnvironment = process.env.NODE_ENV === 'test';
const isDevEnvironment = process.env.NODE_ENV === 'development';
const app = express();

const viteDevServer = isDevEnvironment
  ? await import('vite').then((vite) => vite.createServer({
    server: { middlewareMode: true },
  })) : null;

const build = viteDevServer
  ? () => viteDevServer.ssrLoadModule(
    'virtual:remix/server-build',
  )
  : await import('../build/server/index.js');

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
    connection: {
      connectionString: process.env.DATABASE_URL,
       ssl: { rejectUnauthorized: false },
    },
  });
  redisClient = createClient({
    url: process.env.REDIS_URL,
  });
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: `happ:${process.env.NODE_ENV}`,
  });
  redisClient.connect();

  app.use(
    viteDevServer
      ? viteDevServer.middlewares
      : express.static('build/client'),
  );
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

  // Serve react site.
  app.all('/', createRequestHandler({ build }));
  app.all('/sentry-example-page', createRequestHandler({ build }));
  app.get('/@tailwind%20base;@tailwind%20components;@tailwind%20utilities',createRequestHandler({ build }))
  // The error handler must be registered before any other error
  // middleware and after all controllers
  if (!isTestEnvironment) {
    app.use(Sentry.Handlers.errorHandler());
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
