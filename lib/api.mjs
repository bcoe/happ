import * as Sentry from '@sentry/node';
import { spanToTraceHeader, getDynamicSamplingContextFromSpan } from '@sentry/core';
import { dynamicSamplingContextToSentryBaggageHeader } from '@sentry/utils';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { createRequestHandler } from '@remix-run/express';

import cors from 'cors';
import express from 'express';

// Session stuff:
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import session from 'express-session';

import { OAuth2Client } from 'google-auth-library';
import { QUEUE_KEY } from './worker.mjs';
import getDB from './helpers/db.mjs';

const isTestEnvironment = process.env.NODE_ENV === 'test';
const isDevEnvironment = process.env.NODE_ENV === 'development';
const app = express();
const viteDevServer = isDevEnvironment
  ? await import('vite').then((vite) => vite.createServer({
    server: { middlewareMode: true },
  })) : null;
const GOOGLE_ACCOUNT_TYPE = 'google';

const build = viteDevServer
  ? () => viteDevServer.ssrLoadModule(
    'virtual:remix/server-build',
  )
  : await import('../build/server/index.js');

export const helpers = {
  authenticated(_req, _res, next) {
    return next();
  },
};

let db; // DB will be set when server connects.
let oAuth2Client;
let redisClient;
function init() {
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
  if (!isTestEnvironment) {
    Sentry.init({
      debug: true,
      environment: process.env.NODE_ENV,
      dsn: 'https://e8c6953f82f7bdadbab491d4fb2c8caf@o4506956365430784.ingest.us.sentry.io/4506956389416960',
      integrations: [
        // enable HTTP calls tracing
        // new Sentry.Integrations.Http({ tracing: true }),
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

  app.post('/v1/habits', (req, res, next) => helpers.authenticated(req, res, next), async (req, res) => {
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

  const CACHED_HABITS_SESSION_KEY = 'cached_habits';
  app.get('/v1/habits', (req, res, next) => helpers.authenticated(req, res, next), async (req, res) => {
    const cachedValue = await Sentry.startSpan(
      {
        name: 'fetch cached habits',
        op: 'cache.get_item',
      },
      async (span) => {
        let cachedValue = req.session[CACHED_HABITS_SESSION_KEY];
        const hit = !!cachedValue;
        span.setAttribute('cache.hit', hit);
        console.info(`setAttribute cache.hit`, hit);
        // If the byes size of the item is known:
        // span.setAttribute('cache.item_size', someNumberOfBytes);
        if (hit === false) {
          console.info('perform lookup');
          cachedValue = (await db('habits').select());
          req.session[CACHED_HABITS_SESSION_KEY] = cachedValue;
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 300);
          })
        } else {
          await new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 100);
          })
        }
        return cachedValue;
      },
    );
    res.type('json');
    res.send(cachedValue);
  });

  app.get('/v1/callback', (req, res, next) => helpers.authenticated(req, res, next), async (req, res) => {
    const { tokens: { access_token: accessToken } } = await oAuth2Client.getToken(req.query.code);
    const profReq = await global.fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const profile = await profReq.json();
    // Check if an entry already exists for this user:
    const results = await db('users')
      .select('id')
      .where('users.account_type', GOOGLE_ACCOUNT_TYPE)
      .where('users.email', profile.email);
    if (!results.length) {
      const { id } = (await db('users').insert({
        email: profile.email,
        account_type: GOOGLE_ACCOUNT_TYPE,
      }, ['id']))[0];
      req.session.userId = id;
    } else {
      const { id } = results[0];
      req.session.userId = id;
    }
    res.redirect('/habits');
  });

  app.get('/v1/logout', (req, res, next) => helpers.authenticated(req, res, next), async (req, res) => {
    req.session.destroy();
    res.redirect('/');
  });

  app.get('/v1/metrics', (req, res, next) => helpers.authenticated(req, res, next), async (req, res) => {
    await Sentry.startSpan(
      {
        name: 'enqueue metrics job',
        op: 'queue.submit',
        attributes: {
        },
      },
      async (span) => {
        const traceHeader = spanToTraceHeader(span);
        const dynamicSamplingContext = getDynamicSamplingContextFromSpan(span);
        const baggageHeader = dynamicSamplingContextToSentryBaggageHeader(dynamicSamplingContext);
        console.info('got trace header', traceHeader);
        await redisClient.lPush(QUEUE_KEY, JSON.stringify({
          traceHeader,
          baggageHeader,
        }));
      },
    );
    res.send('ok');
  });

  // Serve react site.
  app.all('*', createRequestHandler({ build }));
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
