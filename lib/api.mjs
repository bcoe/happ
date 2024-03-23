import * as Sentry from "@sentry/node"
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import express from "express";
import knex from 'knex';

const isTestEnvironment = process.env.NODE_ENV === 'test';

const app = express();
let db; // DB will be set when server connects.

if (!isTestEnvironment) {
  Sentry.init({
    debug: true,
    dsn: "https://e8c6953f82f7bdadbab491d4fb2c8caf@o4506956365430784.ingest.us.sentry.io/4506956389416960",
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

app.get('/me', async function (_req, res) {
  const user = await db.select('name').from('users');
  res.send(JSON.stringify(user));
})

// All your controllers should live here
app.get("/", function rootHandler(_req, res) {
  res.end("Hello world!");
});

// The error handler must be registered before any other error middleware and after all controllers
if (!isTestEnvironment) {
  app.use(Sentry.Handlers.errorHandler());
}

// Optional fallthrough error handler
app.use(function onError(_err, _req, res, _next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

export async function listen(port) {
  // Avoid connecting to database until server is
  // actually bootstrapped (this makes testing easier).
  db = knex({
    client: "pg",
    connection: process.env.PG_CONNECTION_STRING
  });  

  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      return resolve({
        close: async () => {
          db.destroy();
          return new Promise((resolve) => {
            server.close(() => {
              return resolve();
            });
          });
        }
      });
    });  
  });
}
