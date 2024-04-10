import { Links, Meta, Outlet, Scripts, useRouteError } from "@remix-run/react";
import { withSentry, captureRemixErrorBoundaryError } from "@sentry/remix";
import classes from './style.module.css'

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
        <div className={classes.grid  + ' ' + classes['grid-cols-2'] + ' ' + classes['gap-4']}>
          <div className={classes.red}>Hello</div>
          <div>World</div>
          <div>Goodnight</div>
          <div>Moon</div>
        </div>
        <Outlet />
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
