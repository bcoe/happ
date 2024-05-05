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
import {MetricsProvider} from './providers/metrics';
import { isLoggedIn } from "./session.server";
import { FaThList } from "react-icons/fa";

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
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div className={'header'}>
          <div className="flex">
            <div>
              <Link to="/">
                <FaThList className={'ml-8 mt-1 size-5'} />
              </Link>
            </div>
            <div className='ml-8'>
              <Link className={'font-medium text-blue-600 dark:text-blue-500 hover:underline'} to="/habits">Habits</Link>
            </div>
            <div className='ml-8'>
              <Link className={'font-medium text-blue-600 dark:text-blue-500 hover:underline'} to="/metrics">Metrics</Link>
            </div>
            {isLoggedIn &&
              <div className={'text-right w-full'}>
                <a className={'font-medium text-blue-600 dark:text-blue-500 hover:underline'} href="/v1/logout">Logout</a>
              </div>
            }
            {!isLoggedIn &&
              <div className={'text-right w-full'}>
                <Link className={'font-medium text-blue-600 dark:text-blue-500 hover:underline'} to="/login">Login</Link>
              </div>
            }
          </div>
        </div>
        <div className='flex w-full'>
          <div className='lg:w-1/6' />
          <div className={'w-full lg:w-4/6'}>
            <HabitsProvider>
              <MetricsProvider>
                {<Outlet />}
              </MetricsProvider>
            </HabitsProvider>
          </div>
          <div className='lg:w-1/6' />
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
