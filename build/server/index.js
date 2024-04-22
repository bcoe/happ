;
!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "f59607c4-eeb5-4787-88e7-bde41f45fef1", e._sentryDebugIdIdentifier = "sentry-dbid-f59607c4-eeb5-4787-88e7-bde41f45fef1");
  } catch (e2) {
  }
}();
import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, redirect, json } from "@remix-run/node";
import { RemixServer, useLoaderData, Links, Meta, Link, Outlet, Scripts, useRouteError, Await } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { withSentry, captureRemixErrorBoundaryError } from "@sentry/remix";
import * as React from "react";
import { useState, useEffect, Suspense } from "react";
import "dotenv/config";
import { createClient } from "redis";
import RedisStore from "connect-redis";
import session from "express-session";
import { useSensors, useSensor, PointerSensor, TouchSensor, KeyboardSensor, DndContext, closestCenter } from "@dnd-kit/core";
import { useSortable, sortableKeyboardCoordinates, SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RxDragHandleHorizontal } from "react-icons/rx";
import { OAuth2Client } from "google-auth-library";
import { FaGoogle } from "react-icons/fa";
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
const styles = "/assets/shared-DoINzmaJ.css";
var _global = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
_global.SENTRY_RELEASE = { id: "51d3a55c34f18467202313e9e8c013a1a96a6e91" };
const HabitsContext = React.createContext(null);
const HABITS = [
  {
    id: "abc123",
    name: "Make my morning coffee"
  },
  {
    id: "qwerty",
    name: "Take Finn for a walk"
  }
];
function HabitsProvider({ children }) {
  const [habits, setHabits] = React.useState([]);
  const set = (habits2) => {
    setHabits([...habits2]);
    return {};
  };
  const create = async (type) => {
  };
  const remove = async (prefix, created) => {
  };
  const load = async () => {
    const resp = await fetch("/v1/habits");
    console.info(await resp.json());
    set(HABITS);
  };
  const value = { habits, load, set, create, remove };
  return /* @__PURE__ */ jsx(HabitsContext.Provider, { value, children });
}
function useHabits() {
  return React.useContext(HabitsContext);
}
const isTestEnvironment = process.env.NODE_ENV === "test";
const sessionOpts = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET
};
const sessionPrefix = `happ:${process.env.NODE_ENV}`;
if (!isTestEnvironment) {
  const redisClient = createClient({
    url: process.env.REDIS_URL
  });
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: sessionPrefix
  });
  redisClient.connect();
  redisClient.unref();
  sessionOpts.store = redisStore;
}
const s = session(sessionOpts);
async function isLoggedIn(req) {
  const connectReq = {
    headers: {
      cookie: req.headers.get("cookie")
    },
    url: "/"
  };
  s(connectReq, {}, () => {
  });
  const sess = await new Promise((resolve) => {
    if (!connectReq.sessionID)
      return resolve({});
    if (!connectReq.sessionStore)
      return resolve({});
    connectReq.sessionStore.get(connectReq.sessionID, (err, sess2) => {
      if (err || !sess2)
        return resolve({});
      return resolve(sess2);
    });
  });
  return sess.userId;
}
async function requireUserId(req) {
  if (!await isLoggedIn(req)) {
    throw redirect("/login");
  }
}
const links = () => [
  { rel: "stylesheet", href: styles }
];
const loader$2 = async ({ request }) => {
  const userId = await isLoggedIn(request);
  return json({ isLoggedIn: !!userId });
};
function App() {
  const { isLoggedIn: isLoggedIn2 } = useLoaderData();
  return /* @__PURE__ */ jsxs("html", { children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx(
        "link",
        {
          rel: "icon",
          href: "data:image/x-icon;base64,AA"
        }
      ),
      /* @__PURE__ */ jsx(Links, {}),
      /* @__PURE__ */ jsx(Meta, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx("div", { className: "header", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-10", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Link, { className: "font-medium text-blue-600 dark:text-blue-500 hover:underline", to: "/habits", children: "Habits" }) }),
        isLoggedIn2 && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("a", { className: "font-medium text-blue-600 dark:text-blue-500 hover:underline", href: "/v1/logout", children: "Logout" }) }),
        !isLoggedIn2 && /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Link, { className: "font-medium text-blue-600 dark:text-blue-500 hover:underline", to: "/login", children: "Login" }) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3", children: [
        /* @__PURE__ */ jsx("div", {}),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(HabitsProvider, { children: /* @__PURE__ */ jsx(Outlet, {}) }) }),
        /* @__PURE__ */ jsx("div", {})
      ] }),
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
  default: root,
  links,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
function HabitListItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: props.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  return /* @__PURE__ */ jsx("div", { className: "bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow habit-item", ref: setNodeRef, style, ...attributes, ...listeners, children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12", children: [
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(RxDragHandleHorizontal, {}) }),
    /* @__PURE__ */ jsx("div", { className: "col-span-10", children: props.name }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("input", { type: "checkbox" }) })
  ] }) });
}
async function loader$1({ request }) {
  await requireUserId(request);
  return {};
}
function Habits() {
  const habits = useHabits();
  const [initialLoad, setInitialLoad] = useState(true);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
  useEffect(() => {
    if (!initialLoad)
      return;
    setInitialLoad(false);
    habits.load();
  }, [initialLoad, habits]);
  return /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx("div", { children: "Beep Boop I AM CONTENT" }), children: /* @__PURE__ */ jsx(Await, { resolve: habits, children: /* @__PURE__ */ jsx(
    DndContext,
    {
      sensors,
      collisionDetection: closestCenter,
      onDragEnd: handleDragEnd,
      children: /* @__PURE__ */ jsx(
        SortableContext,
        {
          items: habits.habits,
          strategy: verticalListSortingStrategy,
          children: habits.habits.map((habit) => /* @__PURE__ */ jsx(HabitListItem, { name: habit.name, id: habit.id }, habit.id))
        }
      )
    }
  ) }) });
  function handleDragEnd(event) {
    const { active, over } = event;
    const oldIndex = habits.habits.findIndex((item) => item.id === active.id);
    const newIndex = habits.habits.findIndex((item) => item.id === over.id);
    habits.set(arrayMove(habits.habits, oldIndex, newIndex));
  }
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Habits,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const oAuth2Client = new OAuth2Client(
  process.env.OAUTH_CLIENT_ID,
  process.env.OAUTH_CLIENT_SECRET,
  process.env.OAUTH_REDIRECT
);
const loader = async () => {
  const redirect2 = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  });
  return json({
    data: {
      redirect: redirect2
    }
  });
};
function Login() {
  const { data } = useLoaderData();
  return /* @__PURE__ */ jsx("div", { className: "bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow", children: /* @__PURE__ */ jsxs(Link, { id: "login-with-google", className: "grid grid-cols-3", to: data.redirect, "data-testid": "google-login", children: [
    /* @__PURE__ */ jsx("div", { className: "pt-1", children: /* @__PURE__ */ jsx(FaGoogle, {}) }),
    /* @__PURE__ */ jsx("div", { className: "text-center", children: "Login with Google" })
  ] }) });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Login,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-C9SHmalQ.js", "imports": ["/assets/components-DEkji6Ti.js", "/assets/performance-N4gwM7_P.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-CS9Xsrhw.js", "imports": ["/assets/components-DEkji6Ti.js", "/assets/performance-N4gwM7_P.js", "/assets/habits-CeFELc5u.js"], "css": [] }, "routes/habits": { "id": "routes/habits", "parentId": "root", "path": "habits", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/habits-O2laYCnW.js", "imports": ["/assets/components-DEkji6Ti.js", "/assets/iconBase-OkIvxn1k.js", "/assets/habits-CeFELc5u.js"], "css": [] }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/login-BM6pkR0P.js", "imports": ["/assets/components-DEkji6Ti.js", "/assets/iconBase-OkIvxn1k.js"], "css": [] } }, "url": "/assets/manifest-ad3de768.js", "version": "ad3de768" };
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
  "routes/habits": {
    id: "routes/habits",
    parentId: "root",
    path: "habits",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route2
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
