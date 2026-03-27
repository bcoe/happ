import React, { useState, useEffect } from 'react';
import { withSentry, captureRemixErrorBoundaryError } from "@sentry/remix";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  useRouteError,
  useLoaderData,
} from "@remix-run/react";
import { json, LinksFunction } from "@remix-run/node";
import styles from "./styles/shared.css?url";
import {HabitsProvider} from './providers/habits';
import {MetricsProvider} from './providers/metrics';
import { isLoggedIn } from "./session.server";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" },
  { rel: "stylesheet", href: styles },
];

type LoggedInData = {
  isLoggedIn: boolean;
}

export const loader = async ({request}) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const staticRoutes = ['/', '/login'];
  const needsAuthCheck = !staticRoutes.includes(pathname);

  let userId = null;
  if (needsAuthCheck) {
    userId = await isLoggedIn(request);
  }

  return json<LoggedInData>({
    isLoggedIn: !!userId
  });
};

function App() {
  const { isLoggedIn } = useLoaderData<typeof loader>();
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(isLoggedIn);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const pathname = url.pathname;

    const staticRoutes = ['/', '/login'];
    if (staticRoutes.includes(pathname)) {
      setAuthChecked(false);
      setUserIsLoggedIn(false);
      return;
    }

    setAuthChecked(true);
    setUserIsLoggedIn(isLoggedIn);
  }, [isLoggedIn]);

  return (
    <html>
      <head>
        <link rel="icon" href="data:image/x-icon;base64,AA" />
        <Links />
        <Meta />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="font-sans">
        <nav className="h-11 flex items-center px-6 border-b border-zinc-800 bg-zinc-950">
          <Link to="/" className="text-sm font-semibold text-zinc-100 tracking-tight mr-8">
            happ
          </Link>
          <div className="flex items-center gap-6">
            <Link className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors" to="/habits">
              Habits
            </Link>
            <Link className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors" to="/metrics">
              Metrics
            </Link>
          </div>
          <div className="ml-auto">
            {authChecked && userIsLoggedIn ? (
              <a className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors" href="/v1/logout">
                Logout
              </a>
            ) : (
              <Link className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors" to="/login">
                Login
              </Link>
            )}
          </div>
        </nav>
        <div className="max-w-2xl mx-auto px-6 py-8">
          <HabitsProvider>
            <MetricsProvider>
              <Outlet />
            </MetricsProvider>
          </HabitsProvider>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export const ErrorBoundary = () => {
  const error = useRouteError();
  captureRemixErrorBoundaryError(error);
  return <div>Something went wrong</div>;
};

export default withSentry(App);
