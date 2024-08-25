;
!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "43c0cc2d-a2e4-4d39-88df-ef06eec54f4e", e._sentryDebugIdIdentifier = "sentry-dbid-43c0cc2d-a2e4-4d39-88df-ef06eec54f4e");
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
import React__default, { useState, useEffect, Suspense } from "react";
import "dotenv/config";
import { createClient } from "redis";
import RedisStore from "connect-redis";
import session from "express-session";
import { FaThList, FaGoogle } from "react-icons/fa";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";
import { useSensors, useSensor, PointerSensor, TouchSensor, KeyboardSensor, DndContext, closestCenter } from "@dnd-kit/core";
import { useSortable, sortableKeyboardCoordinates, SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RxDragHandleHorizontal } from "react-icons/rx";
import { FiEdit } from "react-icons/fi";
import { OAuth2Client } from "google-auth-library";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  let prohibitOutOfOrderStreaming = isBotRequest(request.headers.get("user-agent")) || remixContext.isSpaMode;
  return prohibitOutOfOrderStreaming ? handleBotRequest(
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
const styles = "/assets/shared-BAucGq0X.css";
var _global = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
_global.SENTRY_RELEASE = { id: "ce8e1bda682c9d3f5acc6473e9ddded106370097" };
const NO_DAYS_SET = {
  Mon: false,
  Tue: false,
  Wed: false,
  Thu: false,
  Fri: false,
  Sat: false,
  Sun: false
};
const ALL_DAYS_SET = {
  Mon: true,
  Tue: true,
  Wed: true,
  Thu: true,
  Fri: true,
  Sat: true,
  Sun: true
};
const HabitsContext = React.createContext(null);
function HabitsProvider({
  children
}) {
  const [habits, setHabits] = React.useState([]);
  const [empty, setEmpty] = React.useState(false);
  const [currentDayOfWeek, setCurrentDayOfWeek] = React.useState("");
  const [editing, _setEditing] = React.useState(false);
  const [currentlyEditing, setCurrentlyEditing] = React.useState(void 0);
  const [note, setNote] = React.useState("");
  const set = (habits2) => {
    setHabits([...habits2.habits]);
    setEmpty(!habits2.habits.length);
    setCurrentDayOfWeek(habits2.current_dow);
    return {};
  };
  const create = async (name, days) => {
    let hasDaysSet = false;
    for (const toggle2 of Object.values(days)) {
      if (toggle2)
        hasDaysSet = true;
    }
    await fetch("/v1/habits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        days: hasDaysSet ? days : void 0
      })
    });
  };
  const update = async (id, name, days) => {
    let hasDaysSet = false;
    for (const toggle2 of Object.values(days)) {
      if (toggle2)
        hasDaysSet = true;
    }
    await fetch(`/v1/habits/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        days: hasDaysSet ? days : ALL_DAYS_SET
      })
    });
  };
  const del = async (id) => {
    await fetch(`/v1/habits/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
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
    habits2.habits.map((h) => {
      h.id = h.habit_id;
    });
    set(habits2);
    await loadNote();
  };
  const setEditing = async (editing2, id) => {
    if (id) {
      setCurrentlyEditing(habits.find((h) => {
        return h.id === id;
      }));
    } else {
      setCurrentlyEditing(void 0);
    }
    _setEditing(editing2);
  };
  const createNote = async (note2) => {
    await fetch("/v1/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        note: note2
      })
    });
  };
  const loadNote = async () => {
    const note2 = await fetch("/v1/notes/today", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then((resp) => resp.json()).then((resp) => {
      return resp.note ? resp.note.note : "";
    });
    console.info("setting note", note2);
    setNote(note2);
  };
  const value = {
    habits,
    empty,
    currentDayOfWeek,
    editing,
    setEditing,
    currentlyEditing,
    load,
    set,
    create,
    update,
    del,
    toggle,
    move,
    note,
    createNote,
    loadNote
  };
  return /* @__PURE__ */ jsx(HabitsContext.Provider, { value, "data-sentry-element": "unknown", "data-sentry-component": "HabitsProvider", "data-sentry-source-file": "habits.tsx", children });
}
function useHabits() {
  return React.useContext(HabitsContext);
}
const MetricsContext = React.createContext(null);
function MetricsProvider({
  children
}) {
  const [metrics, setMetrics] = React.useState({
    daily: []
  });
  const [notes, setNotes] = React.useState([]);
  const [selectedDate, setSelectedDate] = React.useState("");
  const [hasFocus, setHasFocus] = React.useState(false);
  const set = (metrics2) => {
    setMetrics(metrics2);
    return {};
  };
  const loadNotes = async () => {
    const resp = await fetch("/v1/notes");
    const n = await resp.json();
    setNotes(n.map((n2) => {
      return {
        note: n2.note,
        date: n2.date,
        highlight: false
      };
    }));
  };
  const load = async () => {
    const resp = await fetch("/v1/metrics");
    const m = await resp.json();
    set({
      daily: m.map((item) => {
        const date = new Date(item.date).toISOString().split("T")[0];
        return {
          name: date,
          completed: item.total_habits_for_day ? item.habits_completed / item.total_habits_for_day : 0
        };
      })
    });
    await loadNotes();
  };
  const maybeSelectRow = async (date) => {
    if (date === selectedDate || hasFocus === false)
      return;
    else
      setSelectedDate(date);
    if (date !== selectedDate) {
      setNotes(notes.map((n) => {
        return {
          note: n.note,
          date: n.date,
          highlight: n.date === date
        };
      }));
    }
  };
  const gotFocus = async () => {
    if (hasFocus === true)
      return;
    setHasFocus(true);
  };
  const lostFocus = async () => {
    if (hasFocus === false)
      return;
    else
      setHasFocus(false);
    setSelectedDate("");
    setNotes(notes.map((n) => {
      return {
        note: n.note,
        date: n.date,
        highlight: false
      };
    }));
  };
  const value = {
    metrics,
    notes,
    load,
    set,
    maybeSelectRow,
    gotFocus,
    lostFocus
  };
  return /* @__PURE__ */ jsx(MetricsContext.Provider, { value, "data-sentry-element": "unknown", "data-sentry-component": "MetricsProvider", "data-sentry-source-file": "metrics.tsx", children });
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
const links = () => [{
  rel: "stylesheet",
  href: styles
}];
const loader$3 = async ({
  request
}) => {
  const userId = await isLoggedIn(request);
  return json({
    isLoggedIn: !!userId
  });
};
function App() {
  const {
    isLoggedIn: isLoggedIn2
  } = useLoaderData();
  return /* @__PURE__ */ jsxs("html", { "data-sentry-component": "App", "data-sentry-source-file": "root.tsx", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("link", { rel: "icon", href: "data:image/x-icon;base64,AA" }),
      /* @__PURE__ */ jsx(Links, { "data-sentry-element": "Links", "data-sentry-source-file": "root.tsx" }),
      /* @__PURE__ */ jsx(Meta, { "data-sentry-element": "Meta", "data-sentry-source-file": "root.tsx" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0", "data-sentry-element": "meta", "data-sentry-source-file": "root.tsx" })
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx("div", { className: "header", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Link, { to: "/", "data-sentry-element": "Link", "data-sentry-source-file": "root.tsx", children: /* @__PURE__ */ jsx(FaThList, { className: "ml-8 mt-1 size-5", "data-sentry-element": "FaThList", "data-sentry-source-file": "root.tsx" }) }) }),
        /* @__PURE__ */ jsx("div", { className: "ml-8", children: /* @__PURE__ */ jsx(Link, { className: "font-medium text-blue-600 dark:text-blue-500 hover:underline", to: "/habits", "data-sentry-element": "Link", "data-sentry-source-file": "root.tsx", children: "Habits" }) }),
        /* @__PURE__ */ jsx("div", { className: "ml-8", children: /* @__PURE__ */ jsx(Link, { className: "font-medium text-blue-600 dark:text-blue-500 hover:underline", to: "/metrics", "data-sentry-element": "Link", "data-sentry-source-file": "root.tsx", children: "Metrics" }) }),
        isLoggedIn2 && /* @__PURE__ */ jsx("div", { className: "text-right w-full", children: /* @__PURE__ */ jsx("a", { className: "font-medium text-blue-600 dark:text-blue-500 hover:underline", href: "/v1/logout", children: "Logout" }) }),
        !isLoggedIn2 && /* @__PURE__ */ jsx("div", { className: "text-right w-full", children: /* @__PURE__ */ jsx(Link, { className: "font-medium text-blue-600 dark:text-blue-500 hover:underline", to: "/login", children: "Login" }) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex w-full", children: [
        /* @__PURE__ */ jsx("div", { className: "lg:w-1/6" }),
        /* @__PURE__ */ jsx("div", { className: "w-full lg:w-4/6", children: /* @__PURE__ */ jsx(HabitsProvider, { "data-sentry-element": "HabitsProvider", "data-sentry-source-file": "root.tsx", children: /* @__PURE__ */ jsx(MetricsProvider, { "data-sentry-element": "MetricsProvider", "data-sentry-source-file": "root.tsx", children: /* @__PURE__ */ jsx(Outlet, {}) }) }) }),
        /* @__PURE__ */ jsx("div", { className: "lg:w-1/6" })
      ] }),
      /* @__PURE__ */ jsx(Scripts, { "data-sentry-element": "Scripts", "data-sentry-source-file": "root.tsx" })
    ] })
  ] });
}
const ErrorBoundary = () => {
  const error = useRouteError();
  captureRemixErrorBoundaryError(error);
  return /* @__PURE__ */ jsx("div", { "data-sentry-component": "ErrorBoundary", "data-sentry-source-file": "root.tsx", children: "Something went wrong" });
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
function HabitAreaChart(props) {
  const metrics = useMetrics();
  function formatLabel(label) {
    requestAnimationFrame(() => {
      metrics.maybeSelectRow(label);
    });
    return label;
  }
  function gotFocus() {
    requestAnimationFrame(() => {
      metrics.gotFocus();
    });
  }
  function lostFocus() {
    requestAnimationFrame(() => {
      metrics.lostFocus();
    });
  }
  return /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", "data-sentry-element": "ResponsiveContainer", "data-sentry-component": "HabitAreaChart", "data-sentry-source-file": "habit-area-chart.tsx", children: /* @__PURE__ */ jsxs(AreaChart, { data: props.data, margin: {
    top: 10,
    right: 30,
    left: 0,
    bottom: 0
  }, onMouseMove: gotFocus, onMouseLeave: lostFocus, "data-sentry-element": "AreaChart", "data-sentry-source-file": "habit-area-chart.tsx", children: [
    /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", "data-sentry-element": "CartesianGrid", "data-sentry-source-file": "habit-area-chart.tsx" }),
    /* @__PURE__ */ jsx(XAxis, { dataKey: "name", "data-sentry-element": "XAxis", "data-sentry-source-file": "habit-area-chart.tsx" }),
    /* @__PURE__ */ jsx(YAxis, { tickFormatter: toPercent, "data-sentry-element": "YAxis", "data-sentry-source-file": "habit-area-chart.tsx" }),
    /* @__PURE__ */ jsx(Tooltip, { formatter: tooltipFormatter, labelFormatter: formatLabel, "data-sentry-element": "Tooltip", "data-sentry-source-file": "habit-area-chart.tsx" }),
    /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "completed", stroke: "#8884d8", fill: "#8884d8", "data-sentry-element": "Area", "data-sentry-source-file": "habit-area-chart.tsx" })
  ] }) });
}
async function loader$2({
  request
}) {
  await requireUserId(request);
  return {};
}
function Metrics() {
  const metrics = useMetrics();
  const [initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    if (!initialLoad)
      return;
    setInitialLoad(false);
    metrics.load();
  }, [metrics]);
  return /* @__PURE__ */ jsxs("div", { className: "bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow", "data-sentry-component": "Metrics", "data-sentry-source-file": "metrics.tsx", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-center", children: "Habit completion by day" }),
    /* @__PURE__ */ jsx("div", { className: "m-4 h-56", children: /* @__PURE__ */ jsx(HabitAreaChart, { data: metrics.metrics.daily, "data-sentry-element": "HabitAreaChart", "data-sentry-source-file": "metrics.tsx" }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 relative overflow-x-auto shadow-md sm:rounded-lg mb-5", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm text-left rtl:text-right text-gray-500", children: [
      /* @__PURE__ */ jsx("thead", { className: "text-xs text-gray-700 uppercase bg-gray-50", children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3", children: "Date" }),
        /* @__PURE__ */ jsx("th", { scope: "col", className: "px-6 py-3", children: "Note" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: metrics.notes.map((note, i) => /* @__PURE__ */ jsxs("tr", { className: `${note.highlight ? "bg-gray-100" : "bg-white"} border-b`, children: [
        /* @__PURE__ */ jsx("th", { scope: "row", className: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap", children: note.date }),
        /* @__PURE__ */ jsx("td", { className: "px-6 py-4 font-medium text-gray-900 whitespace-nowrap", children: note.note })
      ] }, i)) })
    ] }) })
  ] });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Metrics,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const screen = "/assets/screen-01-BO3lyBWu.png";
function Index() {
  return /* @__PURE__ */ jsxs("div", { className: "lg:flex", "data-sentry-component": "Index", "data-sentry-source-file": "_index.tsx", children: [
    /* @__PURE__ */ jsx("div", { className: "lg:w-2/3 sm:full-width", children: /* @__PURE__ */ jsx("img", { src: screen }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-10 lg:w-1/3 sm:full-width m-8 lg:m-1", children: /* @__PURE__ */ jsxs("blockquote", { className: "text-xl italic font-semibold text-gray-900 dark:text-white", children: [
      /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-gray-400 dark:text-gray-600 mb-4", "aria-hidden": "true", xmlns: "http://www.w3.org/2000/svg", fill: "currentColor", viewBox: "0 0 18 14", "data-sentry-element": "svg", "data-sentry-source-file": "_index.tsx", children: /* @__PURE__ */ jsx("path", { d: "M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z", "data-sentry-element": "path", "data-sentry-source-file": "_index.tsx" }) }),
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
  } = useSortable({
    id: props.id,
    disabled: props.disabled
  });
  async function handleChange(event) {
    event.preventDefault();
    await habits.toggle(props.id);
    await habits.load();
  }
  async function handleEdit() {
    habits.setEditing(true, props.id);
  }
  function hideRow() {
    const habitAppliesToDay = !props.days || props.days[habits.currentDayOfWeek];
    return props.disabled === true && habitAppliesToDay === false;
  }
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  return hideRow() ? "" : /* @__PURE__ */ jsx("div", { ref: setNodeRef, style, ...attributes, children: /* @__PURE__ */ jsxs("div", { className: "flex w-full bg-white text-gray-800 py-2 px-4 border border-gray-400 rounded shadow habit-item disable-touch", children: [
    /* @__PURE__ */ jsx("div", { ...listeners, className: "w-8 mr-2", children: props.disabled ? "" : /* @__PURE__ */ jsx(RxDragHandleHorizontal, { className: "mt-1 size-6" }) }),
    /* @__PURE__ */ jsx("div", { className: "w-5/6 mt-0.5", children: props.name }),
    /* @__PURE__ */ jsx("div", { className: "w-1/6 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex w-full", children: [
      /* @__PURE__ */ jsx("div", { className: "w-2/4" }),
      /* @__PURE__ */ jsx("div", { className: "w-2/4", children: props.disabled ? /* @__PURE__ */ jsx("input", { type: "checkbox", name: `habit-${props.id}`, checked: props.status, onChange: handleChange, className: "w-4 h-4 mt-2" }) : /* @__PURE__ */ jsx(FiEdit, { className: "mt-1 size-6", onClick: handleEdit }) })
    ] }) })
  ] }) });
}
const DAY_LOOKUP$1 = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday"
};
function HabitEdit() {
  const habits = useHabits();
  const [id, setId] = React__default.useState("");
  const [name, setName] = React__default.useState("");
  const [days, setDays] = React__default.useState({
    ...NO_DAYS_SET
  });
  function cancel() {
    habits.setEditing(false, void 0);
  }
  async function save(e) {
    e.preventDefault();
    await habits.update(id, name, days);
    await habits.load();
    habits.setEditing(false, void 0);
  }
  async function del() {
    await habits.del(id);
    await habits.load();
    habits.setEditing(false, void 0);
  }
  function toggleDay(e) {
    const toggledDay = !days[e.target.dataset.day];
    setDays((prevDays) => {
      prevDays[e.target.dataset.day] = toggledDay;
      return {
        ...prevDays
      };
    });
  }
  function handleKeyPress(e) {
    if (e.code === "Escape") {
      cancel();
    }
  }
  useEffect(() => {
    if (habits.editing) {
      document.addEventListener("keydown", handleKeyPress);
    } else {
      document.removeEventListener("keydown", handleKeyPress);
    }
    if (habits.editing && habits.currentlyEditing) {
      setId(habits.currentlyEditing.id);
      setName(habits.currentlyEditing.name);
      let allDaysSet = true;
      if (habits.currentlyEditing.days) {
        for (const toggle of Object.values(habits.currentlyEditing.days)) {
          if (!toggle)
            allDaysSet = false;
        }
      }
      if (!allDaysSet) {
        setDays({
          ...habits.currentlyEditing.days
        });
      } else {
        setDays({
          ...NO_DAYS_SET
        });
      }
    }
  }, [habits.editing]);
  return /* @__PURE__ */ jsxs("div", { className: `relative z-10${habits.editing ? " visible" : " invisible"}`, "aria-labelledby": "modal-title", role: "dialog", "aria-modal": "true", "data-sentry-component": "HabitEdit", "data-sentry-source-file": "habit-edit.tsx", children: [
    /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" }),
    /* @__PURE__ */ jsx("form", { onSubmit: save, className: "fixed inset-0 z-10 w-screen overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "flex min-h-full items-baseline justify-center p-4 text-center sm:items-baseline sm:p-0", children: /* @__PURE__ */ jsxs("div", { className: "relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4", children: /* @__PURE__ */ jsxs("div", { className: "sm:flex sm:items-start", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10", children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6 text-gray-800 dark:text-white", "aria-hidden": "true", xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", fill: "none", viewBox: "0 0 24 24", "data-sentry-element": "svg", "data-sentry-source-file": "habit-edit.tsx", children: /* @__PURE__ */ jsx("path", { stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z", "data-sentry-element": "path", "data-sentry-source-file": "habit-edit.tsx" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-base font-semibold leading-6 text-gray-900", id: "modal-title", children: "Edit habit" }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
            /* @__PURE__ */ jsx("input", { autoComplete: "off", name: "name", type: "text", className: "block w-96 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-normal focus:outline-none focus:shadow-outline", value: name, onChange: (e) => setName(e.target.value) }),
            /* @__PURE__ */ jsx("ul", { className: "grid w-full grid-cols-2 gap-2 mt-5", children: Object.keys(days).map((day) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("span", { "data-day": day, onClick: toggleDay, className: `inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center border rounded-lg cursor-pointer text-blue-600 border-blue-600${days[day] ? " text-white bg-blue-500" : " bg-white"}`, children: DAY_LOOKUP$1[day] }) }, day)) })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex bg-gray-50 px-4 py-3 px-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
          /* @__PURE__ */ jsx("button", { type: "submit", className: "mr-1 bg-blue-500 hover:bg-blue-700 mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto text-white", children: "Save" }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: cancel, className: "mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto", children: "Cancel" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-full text-right", children: /* @__PURE__ */ jsx("button", { type: "button", onClick: del, className: "inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto sm:mt-0 sm-ml-0 ml-2 mt-3", children: "Delete" }) })
      ] })
    ] }) }) })
  ] });
}
function CommentBox() {
  const habits = useHabits();
  const [note, setNote] = React__default.useState("");
  const [saving, setSaving] = React__default.useState(false);
  async function createNote(e) {
    e.preventDefault();
    setSaving(true);
    await habits.createNote(note);
    await habits.loadNote();
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
    setSaving(false);
  }
  useEffect(() => {
    setNote(habits.note);
  }, [habits.note]);
  return /* @__PURE__ */ jsxs("div", { className: "mt-8", "data-sentry-component": "CommentBox", "data-sentry-source-file": "comment-box.tsx", children: [
    /* @__PURE__ */ jsx("hr", {}),
    /* @__PURE__ */ jsx("form", { onSubmit: createNote, children: /* @__PURE__ */ jsxs("div", { className: "w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 mt-8", children: [
      /* @__PURE__ */ jsx("div", { className: "px-4 py-2 bg-white rounded-t-lg", children: /* @__PURE__ */ jsx("textarea", { name: "note", rows: 4, className: "peer h-full min-h-[100px] w-full resize-none border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-md font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-gray-900 focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50", placeholder: "Leave a note about today's progress for future reflection.", required: true, value: note, onChange: (e) => setNote(e.target.value) }) }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between px-3 py-2 border-t", children: !saving ? /* @__PURE__ */ jsx("button", { type: "submit", className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-1 mt-1 rounded focus:outline-none focus:shadow-outline", children: "Leave note" }) : /* @__PURE__ */ jsxs("button", { disabled: true, type: "button", className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-1 mt-1 rounded focus:outline-none focus:shadow-outline", children: [
        /* @__PURE__ */ jsxs("svg", { "aria-hidden": "true", role: "status", className: "inline w-4 h-4 me-3 text-white animate-spin", viewBox: "0 0 100 101", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
          /* @__PURE__ */ jsx("path", { d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z", fill: "#E5E7EB" }),
          /* @__PURE__ */ jsx("path", { d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z", fill: "currentColor" })
        ] }),
        "Saving..."
      ] }) })
    ] }) })
  ] });
}
const DAY_LOOKUP = {
  Mon: "Mon",
  Tue: "Tue",
  Wed: "Wed",
  Thu: "Thu",
  Fri: "Fri",
  Sat: "Sat",
  Sun: "Sun"
};
async function loader$1({
  request
}) {
  await requireUserId(request);
  return {};
}
function Habits() {
  const habits = useHabits();
  const [initialLoad, setInitialLoad] = useState(true);
  const [sorting, setSorting] = useState(false);
  const date = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit"
  });
  const [days, setDays] = React__default.useState({
    ...NO_DAYS_SET
  });
  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor), useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates
  }));
  useEffect(() => {
    if (!initialLoad)
      return;
    habits.load();
    setInitialLoad(false);
  });
  useEffect(() => {
    if (habits.empty) {
      setSorting(true);
    }
  }, [habits.empty]);
  useEffect(() => {
    if (sorting) {
      setDays({
        ...NO_DAYS_SET
      });
    }
  }, [sorting]);
  async function createDailyHabit(e) {
    e.preventDefault();
    const name = e.target.name.value;
    await habits.create(name, days);
    await habits.load();
    setDays({
      ...NO_DAYS_SET
    });
    e.target.reset();
  }
  function handleChange(event) {
    setSorting(!sorting);
  }
  async function handleDragEnd(event) {
    const {
      active,
      over
    } = event;
    const oldIndex = habits.habits.findIndex((item) => item.habit_id === active.id);
    const newIndex = habits.habits.findIndex((item) => item.habit_id === over.id);
    if (newIndex > oldIndex) {
      if (newIndex >= habits.habits.length) {
        habits.habits.length - 1;
      }
    }
    if (oldIndex !== newIndex) {
      habits.set({
        habits: arrayMove(habits.habits, oldIndex, newIndex),
        current_dow: habits.currentDayOfWeek
      });
      await habits.move(oldIndex, newIndex);
      await habits.load();
    }
  }
  function toggleDay(e) {
    const toggledDay = !days[e.target.dataset.day];
    setDays((prevDays) => {
      prevDays[e.target.dataset.day] = toggledDay;
      return {
        ...prevDays
      };
    });
  }
  return /* @__PURE__ */ jsx(Suspense, { "data-sentry-element": "Suspense", "data-sentry-component": "Habits", "data-sentry-source-file": "habits.tsx", children: /* @__PURE__ */ jsxs(Await, { resolve: habits, "data-sentry-element": "Await", "data-sentry-source-file": "habits.tsx", children: [
    /* @__PURE__ */ jsx(HabitEdit, { "data-sentry-element": "HabitEdit", "data-sentry-source-file": "habits.tsx" }),
    /* @__PURE__ */ jsx("div", { className: "p-2", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx("h1", { className: "text-1xl font-extrabold mb-1", children: sorting || habits.empty ? "Add / edit habits" : date }) }) }),
    habits.empty ? /* @__PURE__ */ jsx("div", { className: "border-dashed border-2 border-slate-100 grid p-10", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxs("p", { children: [
      "You have not yet created your first daily habit. Enter a daily habit that you would like to start keeping into the text box below and click",
      /* @__PURE__ */ jsx("span", { className: "text-xs	bg-blue-500 ml-2 text-white font-bold py-1 px-2 rounded whitespace-nowrap", children: "Add Habit" })
    ] }) }) }) : "",
    /* @__PURE__ */ jsx(DndContext, { sensors, collisionDetection: closestCenter, onDragEnd: handleDragEnd, "data-sentry-element": "DndContext", "data-sentry-source-file": "habits.tsx", children: /* @__PURE__ */ jsx(SortableContext, { items: habits.habits, strategy: verticalListSortingStrategy, "data-sentry-element": "SortableContext", "data-sentry-source-file": "habits.tsx", children: habits.habits.map((habit) => /* @__PURE__ */ jsx(HabitListItem, { name: habit.name, id: habit.habit_id, status: habit.status, days: habit.days, disabled: !sorting }, habit.habit_id)) }) }),
    sorting || habits.empty ? /* @__PURE__ */ jsxs("form", { onSubmit: createDailyHabit, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex w-full", children: [
        /* @__PURE__ */ jsx("div", { className: "w-4/6 mt-1", children: /* @__PURE__ */ jsx("input", { autoComplete: "off", name: "name", type: "text", className: "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-normal focus:outline-none focus:shadow-outline" }) }),
        /* @__PURE__ */ jsx("input", { type: "submit", value: "Add Habit", className: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-1 mt-1 rounded focus:outline-none focus:shadow-outline w-2/6" })
      ] }),
      /* @__PURE__ */ jsx("ul", { className: "flex w-full", children: Object.keys(days).map((day, i) => /* @__PURE__ */ jsx("li", { "data-day": day, onClick: toggleDay, className: `p-1 ${i === 0 ? "" : "ml-1"} text-sm font-medium text-center border rounded-lg cursor-pointer text-blue-600 border-blue-600${days[day] ? " text-white bg-blue-500" : " bg-white"}`, children: DAY_LOOKUP[day] }, day)) })
    ] }) : "",
    /* @__PURE__ */ jsxs("label", { className: "mt-3 inline-flex items-center cursor-pointer", children: [
      /* @__PURE__ */ jsx("input", { type: "checkbox", name: "toggle-edit", value: "", className: "sr-only peer", checked: sorting || habits.empty, onChange: handleChange }),
      /* @__PURE__ */ jsx("div", { className: "relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" }),
      /* @__PURE__ */ jsx("span", { className: "ms-3 text-base font-medium text-gray-900", children: "Add / edit habits" })
    ] }),
    sorting || habits.empty ? "" : /* @__PURE__ */ jsx(CommentBox, {})
  ] }) });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Habits,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const oAuth2Client = new OAuth2Client(process.env.OAUTH_CLIENT_ID, process.env.OAUTH_CLIENT_SECRET, process.env.OAUTH_REDIRECT);
const loader = async () => {
  const redirect2 = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"]
  });
  return json({
    data: {
      redirect: redirect2
    }
  });
};
function Login() {
  const {
    data
  } = useLoaderData();
  return /* @__PURE__ */ jsx("div", { className: "bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow", "data-sentry-component": "Login", "data-sentry-source-file": "login.tsx", children: /* @__PURE__ */ jsxs(Link, { id: "login-with-google", className: "grid grid-cols-3", to: data.redirect, "data-testid": "google-login", "data-sentry-element": "Link", "data-sentry-source-file": "login.tsx", children: [
    /* @__PURE__ */ jsx("div", { className: "pt-1", children: /* @__PURE__ */ jsx(FaGoogle, { "data-sentry-element": "FaGoogle", "data-sentry-source-file": "login.tsx" }) }),
    /* @__PURE__ */ jsx("div", { className: "text-center", children: "Login with Google" })
  ] }) });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Login,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DVbqcXje.js", "imports": ["/assets/jsx-runtime-CUOzFbf5.js", "/assets/index-DjoB8s-1.js", "/assets/components-UUdORSDQ.js", "/assets/performance-Bb-AzxbL.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-F-euybzy.js", "imports": ["/assets/jsx-runtime-CUOzFbf5.js", "/assets/index-DjoB8s-1.js", "/assets/components-UUdORSDQ.js", "/assets/performance-Bb-AzxbL.js", "/assets/iconBase-pNqM3h5p.js", "/assets/habits-tKhYF_uH.js", "/assets/metrics-DO-2CLz4.js", "/assets/index-aCjqWHo-.js"], "css": [] }, "routes/metrics": { "id": "routes/metrics", "parentId": "root", "path": "metrics", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/metrics-C1wkXQOw.js", "imports": ["/assets/jsx-runtime-CUOzFbf5.js", "/assets/metrics-DO-2CLz4.js", "/assets/index-DjoB8s-1.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-axoun30r.js", "imports": ["/assets/jsx-runtime-CUOzFbf5.js"], "css": [] }, "routes/habits": { "id": "routes/habits", "parentId": "root", "path": "habits", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/habits-DTjRFp_L.js", "imports": ["/assets/jsx-runtime-CUOzFbf5.js", "/assets/components-UUdORSDQ.js", "/assets/iconBase-pNqM3h5p.js", "/assets/habits-tKhYF_uH.js"], "css": [] }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/login-1P1IvJ6x.js", "imports": ["/assets/jsx-runtime-CUOzFbf5.js", "/assets/iconBase-pNqM3h5p.js", "/assets/index-aCjqWHo-.js", "/assets/components-UUdORSDQ.js"], "css": [] } }, "url": "/assets/manifest-0f979977.js", "version": "0f979977" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": false, "v3_relativeSplatPath": false, "v3_throwAbortReason": false, "unstable_singleFetch": false };
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
