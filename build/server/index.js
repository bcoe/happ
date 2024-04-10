;
!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "0c64ab80-c4a3-42fd-b902-5ff4d3108a1f", e._sentryDebugIdIdentifier = "sentry-dbid-0c64ab80-c4a3-42fd-b902-5ff4d3108a1f");
  } catch (e2) {
  }
}();
import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer, Meta, Links, Outlet, Scripts, useRouteError } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { withSentry, captureRemixErrorBoundaryError } from "@sentry/remix";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isBotRequest(request.headers.get("user-agent")) ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function isBotRequest(userAgent) {
  if (!userAgent) {
    return false;
  }
  if ("isbot" in isbotModule && typeof isbotModule.isbot === "function") {
    return isbotModule.isbot(userAgent);
  }
  if ("default" in isbotModule && typeof isbotModule.default === "function") {
    return isbotModule.default(userAgent);
  }
  return false;
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const flex = "_flex_qs33a_1";
const grid = "_grid_qs33a_1";
const border = "_border_qs33a_1";
const red = "_red_qs33a_5";
const classes = {
  flex,
  grid,
  "grid-cols-2": "_grid-cols-2_qs33a_1",
  "gap-4": "_gap-4_qs33a_1",
  border,
  red
};
var _global = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
_global.SENTRY_RELEASE = { id: "5b4d0443b8c49486fac555e1421c1ca7d62990bc" };
function App() {
  return /* @__PURE__ */ jsxs("html", { children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx(
        "link",
        {
          rel: "icon",
          href: "data:image/x-icon;base64,AA"
        }
      ),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsxs("div", { className: classes.grid + " " + classes["grid-cols-2"] + " " + classes["gap-4"], children: [
        /* @__PURE__ */ jsx("div", { className: classes.red, children: "Hello" }),
        /* @__PURE__ */ jsx("div", { children: "World" }),
        /* @__PURE__ */ jsx("div", { children: "Goodnight" }),
        /* @__PURE__ */ jsx("div", { children: "Moon" })
      ] }),
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const ErrorBoundary = () => {
  const error = useRouteError();
  captureRemixErrorBoundaryError(error);
  return /* @__PURE__ */ jsx("div", { children: "Something went wrong" });
};
const root = withSentry(App);
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  default: root
}, Symbol.toStringTag, { value: "Module" }));
function SentryExamplePage() {
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs(
    "main",
    {
      style: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      },
      children: [
        /* @__PURE__ */ jsx("h1", { style: { fontSize: "4rem", margin: "14px 0" }, children: /* @__PURE__ */ jsx(
          "svg",
          {
            style: {
              height: "1em"
            },
            xmlns: "http://www.w3.org/2000/svg",
            viewBox: "0 0 200 44",
            children: /* @__PURE__ */ jsx(
              "path",
              {
                fill: "currentColor",
                d: "M124.32,28.28,109.56,9.22h-3.68V34.77h3.73V15.19l15.18,19.58h3.26V9.22h-3.73ZM87.15,23.54h13.23V20.22H87.14V12.53h14.93V9.21H83.34V34.77h18.92V31.45H87.14ZM71.59,20.3h0C66.44,19.06,65,18.08,65,15.7c0-2.14,1.89-3.59,4.71-3.59a12.06,12.06,0,0,1,7.07,2.55l2-2.83a14.1,14.1,0,0,0-9-3c-5.06,0-8.59,3-8.59,7.27,0,4.6,3,6.19,8.46,7.52C74.51,24.74,76,25.78,76,28.11s-2,3.77-5.09,3.77a12.34,12.34,0,0,1-8.3-3.26l-2.25,2.69a15.94,15.94,0,0,0,10.42,3.85c5.48,0,9-2.95,9-7.51C79.75,23.79,77.47,21.72,71.59,20.3ZM195.7,9.22l-7.69,12-7.64-12h-4.46L186,24.67V34.78h3.84V24.55L200,9.22Zm-64.63,3.46h8.37v22.1h3.84V12.68h8.37V9.22H131.08ZM169.41,24.8c3.86-1.07,6-3.77,6-7.63,0-4.91-3.59-8-9.38-8H154.67V34.76h3.8V25.58h6.45l6.48,9.2h4.44l-7-9.82Zm-10.95-2.5V12.6h7.17c3.74,0,5.88,1.77,5.88,4.84s-2.29,4.86-5.84,4.86Z M29,2.26a4.67,4.67,0,0,0-8,0L14.42,13.53A32.21,32.21,0,0,1,32.17,40.19H27.55A27.68,27.68,0,0,0,12.09,17.47L6,28a15.92,15.92,0,0,1,9.23,12.17H4.62A.76.76,0,0,1,4,39.06l2.94-5a10.74,10.74,0,0,0-3.36-1.9l-2.91,5a4.54,4.54,0,0,0,1.69,6.24A4.66,4.66,0,0,0,4.62,44H19.15a19.4,19.4,0,0,0-8-17.31l2.31-4A23.87,23.87,0,0,1,23.76,44H36.07a35.88,35.88,0,0,0-16.41-31.8l4.67-8a.77.77,0,0,1,1.05-.27c.53.29,20.29,34.77,20.66,35.17a.76.76,0,0,1-.68,1.13H40.6q.09,1.91,0,3.81h4.78A4.59,4.59,0,0,0,50,39.43a4.49,4.49,0,0,0-.62-2.28Z"
              }
            )
          }
        ) }),
        /* @__PURE__ */ jsx("p", { children: "Get started by sending us a sample error:" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            style: {
              padding: "12px",
              cursor: "pointer",
              backgroundColor: "#AD6CAA",
              borderRadius: "4px",
              border: "none",
              color: "white",
              fontSize: "14px",
              margin: "18px"
            },
            onClick: () => {
              throw new Error("Sentry Example Frontend Error");
            },
            children: "Throw error!"
          }
        ),
        /* @__PURE__ */ jsxs("p", { children: [
          "Next, look for the error on the",
          " ",
          /* @__PURE__ */ jsx("a", { href: "https://daily-habits-ben-coe-test-orga.sentry.io/issues/?project=4507062370107392", children: "Issues Page" }),
          "."
        ] }),
        /* @__PURE__ */ jsxs("p", { style: { marginTop: "24px" }, children: [
          "For more information, see",
          " ",
          /* @__PURE__ */ jsx("a", { href: "https://docs.sentry.io/platforms/javascript/guides/remix/", children: "https://docs.sentry.io/platforms/javascript/guides/remix/" })
        ] })
      ]
    }
  ) });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SentryExamplePage
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-C0XkGrIg.js", "imports": ["/assets/jsx-runtime-B7D1OI9o.js", "/assets/performance-zG4ZgcbI.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-WmQETsoC.js", "imports": ["/assets/jsx-runtime-B7D1OI9o.js", "/assets/performance-zG4ZgcbI.js"], "css": ["/assets/root-BoVzlXBv.css"] }, "routes/sentry-example-page": { "id": "routes/sentry-example-page", "parentId": "root", "path": "sentry-example-page", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/sentry-example-page-1to5oMbg.js", "imports": ["/assets/jsx-runtime-B7D1OI9o.js"], "css": [] } }, "url": "/assets/manifest-39ae8410.js", "version": "39ae8410" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": false, "v3_relativeSplatPath": false, "v3_throwAbortReason": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/sentry-example-page": {
    id: "routes/sentry-example-page",
    parentId: "root",
    path: "sentry-example-page",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
//# sourceMappingURL=index.js.map
