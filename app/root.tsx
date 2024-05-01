import React from 'react';
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
import { isLoggedIn } from "./session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];

type LoggedInData = {
  isLoggedIn: boolean;
}

export const loader = async ({request}) => {
  const userId = await isLoggedIn(request);
  return json<LoggedInData>({ isLoggedIn: !!userId });
};

function App() {
  const { isLoggedIn } = useLoaderData<typeof loader>();
  return (
    <html>
      <head>
        <link
          rel="icon"
          href="data:image/x-icon;base64,AA"
        />
        <Links />
        <Meta />
      </head>
      <body>
        <div className={'header'}>
          <div className={'grid grid-cols-10'}>
            <div>
              <Link className={'font-medium text-blue-600 dark:text-blue-500 hover:underline'} to="/habits">Habits</Link>
            </div>
            <div>
              <Link className={'font-medium text-blue-600 dark:text-blue-500 hover:underline'} to="/metrics">Metrics</Link>
            </div>
            {isLoggedIn &&
              <div>
                <a className={'font-medium text-blue-600 dark:text-blue-500 hover:underline'} href="/v1/logout">Logout</a>
              </div>
            }
            {!isLoggedIn &&
              <div>
                <Link className={'font-medium text-blue-600 dark:text-blue-500 hover:underline'} to="/login">Login</Link>
              </div>
            }
          </div>
        </div>
        <div className={'grid grid-cols-9'}>
          <div />
          <div className={'col-span-7'}>
            <HabitsProvider>
              <Outlet />
            </HabitsProvider>
          </div>
          <div />
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
