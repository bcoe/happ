
import 'dotenv/config';
import * as Sentry from '@sentry/node';

const isTestEnvironment = process.env.NODE_ENV === 'test';

if (!isTestEnvironment) {
  Sentry.init({
    debug: true,
    environment: process.env.NODE_ENV,
    dsn: 'https://e8c6953f82f7bdadbab491d4fb2c8caf@o4506956365430784.ingest.us.sentry.io/4506956389416960',
    integrations: [
      // enable HTTP calls tracing
      // new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      // new Sentry.Integrations.Express({ app }),
      // nodeProfilingIntegration(),
      // ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
      // new Sentry.Integrations.Postgres(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
  });

  // The request handler must be the first middleware on the app
  // app.use(Sentry.Handlers.requestHandler());

  // TracingHandler creates a trace for every incoming request
  // app.use(Sentry.Handlers.tracingHandler());
}
