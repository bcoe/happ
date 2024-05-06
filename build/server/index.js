;
!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "8edc5f46-cd6f-4cd0-827e-24654da979be", e._sentryDebugIdIdentifier = "sentry-dbid-8edc5f46-cd6f-4cd0-827e-24654da979be");
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
import { PureComponent, useState, useEffect, Suspense } from "react";
import "dotenv/config";
import { createClient } from "redis";
import RedisStore from "connect-redis";
import session from "express-session";
import { FaThList, FaTrashAlt, FaGoogle } from "react-icons/fa";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";
import { useSensors, useSensor, PointerSensor, TouchSensor, KeyboardSensor, DndContext, closestCenter } from "@dnd-kit/core";
import { useSortable, sortableKeyboardCoordinates, SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RxDragHandleHorizontal } from "react-icons/rx";
import { OAuth2Client } from "google-auth-library";
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
const styles = "/assets/shared-DgbdRuRi.css";
var _global = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
_global.SENTRY_RELEASE = { id: "c53afed45a7876062352ce3e55565e5fbae132c6" };
const HabitsContext = React.createContext(null);
function HabitsProvider({ children }) {
  const [habits, setHabits] = React.useState([]);
  const [empty, setEmpty] = React.useState(false);
  const set = (habits2) => {
    setHabits([...habits2]);
    setEmpty(!habits2.length);
    return {};
  };
  const create = async (name) => {
    await fetch("/v1/habits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name })
    });
  };
  const toggle = async (id) => {
    const habit = habits.find((h) => {
      if (h.id === id)
        return true;
    });
    if (!habit)
      return;
    await fetch("/v1/habits-daily", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        habit_id: habit.habit_id,
        status: !habit.status,
        date: habit.date
      })
    });
  };
  const move = async (oldIndex, newIndex) => {
    await fetch("/v1/habits/array-move", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        oldIndex,
        newIndex
      })
    });
  };
  const load = async () => {
    const resp = await fetch("/v1/habits-daily");
    const habits2 = await resp.json();
    habits2.map((h) => {
      h.id = h.habit_id;
    });
    set(habits2);
  };
  const value = { habits, empty, load, set, create, toggle, move };
  return /* @__PURE__ */ jsx(HabitsContext.Provider, { value, children });
}
function useHabits() {
  return React.useContext(HabitsContext);
}
const MetricsContext = React.createContext(null);
function MetricsProvider({ children }) {
  const [metrics, setMetrics] = React.useState({ daily: [] });
  const set = (metrics2) => {
    setMetrics(metrics2);
    return {};
  };
  const load = async () => {
    const resp = await fetch("/v1/metrics");
    const m = await resp.json();
    set({ daily: m.map((item) => {
      const date = new Date(item.date).toISOString().split("T")[0];
      return {
        name: date,
        completed: item.habits_completed / item.total_habits_for_day
      };
    }) });
  };
  const value = { metrics, load, set };
  return /* @__PURE__ */ jsx(MetricsContext.Provider, { value, children });
}
function useMetrics() {
  return React.useContext(MetricsContext);
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
const loader$3 = async ({ request }) => {
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
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Link, { to: "/", children: /* @__PURE__ */ jsx(FaThList, { className: "ml-8 mt-1" }) }) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Link, { className: "font-medium text-blue-600 dark:text-blue-500 hover:underline", to: "/habits", children: "Habits" }) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Link, { className: "font-medium text-blue-600 dark:text-blue-500 hover:underline", to: "/metrics", children: "Metrics" }) }),
        isLoggedIn2 && /* @__PURE__ */ jsx("div", { className: "text-right col-span-7", children: /* @__PURE__ */ jsx("a", { className: "font-medium text-blue-600 dark:text-blue-500 hover:underline", href: "/v1/logout", children: "Logout" }) }),
        !isLoggedIn2 && /* @__PURE__ */ jsx("div", { className: "text-right col-span-7", children: /* @__PURE__ */ jsx(Link, { className: "font-medium text-blue-600 dark:text-blue-500 hover:underline", to: "/login", children: "Login" }) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-9", children: [
        /* @__PURE__ */ jsx("div", {}),
        /* @__PURE__ */ jsx("div", { className: "col-span-7", children: /* @__PURE__ */ jsx(HabitsProvider, { children: /* @__PURE__ */ jsx(MetricsProvider, { children: /* @__PURE__ */ jsx(Outlet, {}) }) }) }),
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
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
const toPercent = (decimal) => `${(decimal * 100).toFixed(0)}%`;
const tooltipFormatter = (value) => toPercent(value);
class HabitAreaChart extends PureComponent {
  render() {
    return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(
      AreaChart,
      {
        width: 500,
        height: 400,
        data: this.props.data,
        margin: {
          top: 10,
          right: 30,
          left: 0,
          bottom: 0
        },
        children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "name" }),
          /* @__PURE__ */ jsx(YAxis, { tickFormatter: toPercent }),
          /* @__PURE__ */ jsx(Tooltip, { formatter: tooltipFormatter }),
          /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "completed", stroke: "#8884d8", fill: "#8884d8" })
        ]
      }
    ) });
  }
}
async function loader$2({ request }) {
  await requireUserId(request);
  return {};
}
function Login$1() {
  const metrics = useMetrics();
  const [initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    if (!initialLoad)
      return;
    setInitialLoad(false);
    metrics.load();
  }, [metrics]);
  return /* @__PURE__ */ jsxs("div", { className: "bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-center", children: "Habit completion by day" }),
    /* @__PURE__ */ jsx("div", { className: "m-4 h-56", children: /* @__PURE__ */ jsx(HabitAreaChart, { data: metrics.metrics.daily }) })
  ] });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Login$1,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const screen = "/assets/screen-01-BO3lyBWu.png";
function Index() {
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2", children: [
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("img", { src: screen }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-10", children: /* @__PURE__ */ jsxs("blockquote", { className: "text-xl italic font-semibold text-gray-900 dark:text-white", children: [
      /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-gray-400 dark:text-gray-600 mb-4", "aria-hidden": "true", xmlns: "http://www.w3.org/2000/svg", fill: "currentColor", viewBox: "0 0 18 14", children: /* @__PURE__ */ jsx("path", { d: "M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" }) }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-400", children: "HabitTrack.me lets you track daily habits that you'd like to make a part of your routine. Its metrics allow you to see if you're meeting your goals week over week." })
    ] }) })
  ] });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index
}, Symbol.toStringTag, { value: "Module" }));
function HabitListItem(props) {
  const habits = useHabits();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: props.id, disabled: props.disabled });
  async function handleChange(event) {
    event.preventDefault();
    await habits.toggle(props.id);
    await habits.load();
  }
  async function handleDelete() {
    console.info(props.id);
  }
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12", ref: setNodeRef, style, ...attributes, children: [
    /* @__PURE__ */ jsx("div", { className: "col-span-11 bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow habit-item disable-touch", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12", children: [
      /* @__PURE__ */ jsx("div", { ...listeners, children: props.disabled ? "" : /* @__PURE__ */ jsx(RxDragHandleHorizontal, { className: "mt-2" }) }),
      /* @__PURE__ */ jsx("div", { className: "col-span-10 mt-0.5", children: props.name }),
      /* @__PURE__ */ jsx("div", { className: "text-right", children: /* @__PURE__ */ jsx("input", { type: "checkbox", checked: props.status, onChange: handleChange, className: "w-4 h-4 mt-2" }) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "col-span-1", children: props.disabled ? "" : /* @__PURE__ */ jsx("button", { onClick: handleDelete, children: /* @__PURE__ */ jsx(FaTrashAlt, { className: "mt-3 ml-3" }) }) })
  ] });
}
async function loader$1({ request }) {
  await requireUserId(request);
  return {};
}
function Habits() {
  const habits = useHabits();
  const [initialLoad, setInitialLoad] = useState(true);
  const [sorting, setSorting] = useState(false);
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
    habits.load();
    setInitialLoad(false);
  }, [initialLoad, habits]);
  async function createDailyHabit(e) {
    e.preventDefault();
    const name = e.target.name.value;
    await habits.create(name);
    await habits.load();
    e.target.reset();
  }
  function handleChange(event) {
    setSorting(!sorting);
  }
  async function handleDragEnd(event) {
    const { active, over } = event;
    const oldIndex = habits.habits.findIndex((item) => item.habit_id === active.id);
    const newIndex = habits.habits.findIndex((item) => item.habit_id === over.id);
    if (newIndex > oldIndex) {
      if (newIndex >= habits.habits.length) {
        habits.habits.length - 1;
      }
    }
    if (oldIndex !== newIndex) {
      habits.set(arrayMove(habits.habits, oldIndex, newIndex));
      await habits.move(oldIndex, newIndex);
      await habits.load();
    }
  }
  return /* @__PURE__ */ jsx(Suspense, { children: /* @__PURE__ */ jsxs(Await, { resolve: habits, children: [
    habits.empty ? /* @__PURE__ */ jsxs("div", { className: "border-dashed border-2 border-slate-100 grid grid-cols-3 p-10", children: [
      /* @__PURE__ */ jsx("div", {}),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("p", { children: [
        "You have not yet created your first daily habit. Enter a daily habit that you would like to start keeping into the text box below and click",
        /* @__PURE__ */ jsx("span", { className: "text-xs	bg-blue-500 ml-2 text-white font-bold py-1 px-2 rounded", children: "Add Habit" })
      ] }) }),
      /* @__PURE__ */ jsx("div", {})
    ] }) : "",
    /* @__PURE__ */ jsx(
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
            children: habits.habits.map((habit) => /* @__PURE__ */ jsx(HabitListItem, { name: habit.name, id: habit.habit_id, status: habit.status, disabled: !sorting }, habit.habit_id))
          }
        )
      }
    ),
    sorting || habits.empty ? /* @__PURE__ */ jsxs("form", { onSubmit: createDailyHabit, className: "grid grid-cols-6 mt-3 w-11/12", children: [
      /* @__PURE__ */ jsx("div", {}),
      /* @__PURE__ */ jsx("div", { className: "col-span-4", children: /* @__PURE__ */ jsx("input", { autoComplete: "off", name: "name", type: "text", className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" }) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("input", { type: "submit", value: "Add Habit", className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" }) })
    ] }) : "",
    /* @__PURE__ */ jsxs("label", { className: "mt-3 inline-flex items-center cursor-pointer", children: [
      /* @__PURE__ */ jsx("input", { type: "checkbox", value: "", className: "sr-only peer", checked: sorting || habits.empty, onChange: handleChange }),
      /* @__PURE__ */ jsx("div", { className: "relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" }),
      /* @__PURE__ */ jsx("span", { className: "ms-3 text-sm font-medium text-gray-900 dark:text-gray-300", children: "Add / sort habits" })
    ] })
  ] }) });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
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
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Login,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-pHrvyN9K.js", "imports": ["/assets/jsx-runtime-CKQyCzpV.js", "/assets/index-DQPK0XfS.js", "/assets/components-Ksei8bJt.js", "/assets/performance-ED7MkbMs.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-BF1nzoo8.js", "imports": ["/assets/jsx-runtime-CKQyCzpV.js", "/assets/index-DQPK0XfS.js", "/assets/components-Ksei8bJt.js", "/assets/performance-ED7MkbMs.js", "/assets/habits-CoJB1GUe.js", "/assets/metrics-DLau6FOZ.js", "/assets/index-BwfpGmH1.js"], "css": [] }, "routes/metrics": { "id": "routes/metrics", "parentId": "root", "path": "metrics", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/metrics-eYqsaVNN.js", "imports": ["/assets/jsx-runtime-CKQyCzpV.js", "/assets/index-DQPK0XfS.js", "/assets/metrics-DLau6FOZ.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-BVJzXbK8.js", "imports": ["/assets/jsx-runtime-CKQyCzpV.js"], "css": [] }, "routes/habits": { "id": "routes/habits", "parentId": "root", "path": "habits", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/habits-D2T-tKaX.js", "imports": ["/assets/jsx-runtime-CKQyCzpV.js", "/assets/components-Ksei8bJt.js", "/assets/index-BwfpGmH1.js", "/assets/habits-CoJB1GUe.js"], "css": [] }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/login-DkjZjYxt.js", "imports": ["/assets/jsx-runtime-CKQyCzpV.js", "/assets/index-BwfpGmH1.js", "/assets/components-Ksei8bJt.js"], "css": [] } }, "url": "/assets/manifest-7989d1e0.js", "version": "7989d1e0" };
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
  "routes/metrics": {
    id: "routes/metrics",
    parentId: "root",
    path: "metrics",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route2
  },
  "routes/habits": {
    id: "routes/habits",
    parentId: "root",
    path: "habits",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route4
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
