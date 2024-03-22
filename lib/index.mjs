import 'dotenv/config';
import * as Sentry from "@sentry/node"
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import express from "express";
// import knex from 'knex';
import pg from 'pg';

const client = new pg.Client({
  connectionString: process.env.PG_CONNECTION_STRING
})
await client.connect()

/*const db = knex({
  client: "pg",
  connection
});*/

const app = express();

Sentry.init({
  dsn: "https://e8c6953f82f7bdadbab491d4fb2c8caf@o4506956365430784.ingest.us.sentry.io/4506956389416960",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    nodeProfilingIntegration(),
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

// All your controllers should live here
app.get("/", function rootHandler(req, res) {
  res.end("Hello world!");
});

app.get('/me', async function (req, res) {
  // const user = await db.select('name').from('users');
  // res.send(JSON.stringify(user));
  const q = await client.query('SELECT * FROM users')
  console.log(q.rows[0]) // Hello world!
  res.send(JSON.stringify(q.rows[0]));
})

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(3000);
