import {
  Links,
  Meta,
  Outlet,
  Scripts,
  useLocation,
  useMatches,
} from "@remix-run/react";

import { withSentry } from "@sentry/remix";
import * as Sentry from '@sentry/remix';
import { useEffect } from 'react';

Sentry.init({
  dsn: 'https://9736cd89fad569a4016ba7ce0d2a79c0@o4506956365430784.ingest.us.sentry.io/4507062370107392',
  tracesSampleRate: 1,
  // debug: true,
  integrations: [
    Sentry.browserTracingIntegration({
      useEffect,
      useLocation,
      useMatches,
    }),
  ]
});

function App() {
  return (
    <html>
      <head>
        <link
          rel="icon"
          href="data:image/x-icon;base64,AA"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <h1>Hello world!</h1>
        <Outlet />

        <Scripts />
      </body>
    </html>
  );
}

export default withSentry(App);
