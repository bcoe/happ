import { withSentry, captureRemixErrorBoundaryError } from "@sentry/remix";
import { useEffect, useState } from 'react';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  useRouteError,
} from "@remix-run/react";

// import classes from './style.module.css'

function App() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });

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
          <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>
          Click me
        </button>
        <Scripts />
      </body>
    </html>
  )
}

export const ErrorBoundary = () => {
  const error = useRouteError();
  captureRemixErrorBoundaryError(error);
  return <div>Something went wrong</div>;
};

export default withSentry(App);

