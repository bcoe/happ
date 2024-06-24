import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

import { useLocation, useMatches } from '@remix-run/react';
import * as Sentry from '@sentry/remix';
import { useEffect } from 'react';

Sentry.init({
  debug: true,
  dsn: 'https://9736cd89fad569a4016ba7ce0d2a79c0@o4506956365430784.ingest.us.sentry.io/4507062370107392',
  tracesSampleRate: 1,
  integrations: [
    Sentry.browserTracingIntegration({
      useEffect,
      useLocation,
      useMatches,
    }),
  ]
});

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});


// In app promotion.