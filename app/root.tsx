import { withSentry, captureRemixErrorBoundaryError } from "@sentry/remix";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import styles from "./styles/shared.css?url";
import {HabitsProvider} from './providers/habits';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
];
function App() {
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
              <Link className={'font-medium text-blue-600 dark:text-blue-500 hover:underline'} to="/login">Login</Link>
            </div>
          </div>
        </div>
        <div className={'grid grid-cols-3'}>
          <div />
          <div>
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
