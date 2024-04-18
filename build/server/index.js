;
!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "5b6b3737-3a41-4a6f-b98b-3e6b1453741a", e._sentryDebugIdIdentifier = "sentry-dbid-5b6b3737-3a41-4a6f-b98b-3e6b1453741a");
  } catch (e2) {
  }
}();
import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer, Links, Meta, Link, Outlet, Scripts, useRouteError, Await } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { withSentry, captureRemixErrorBoundaryError } from "@sentry/remix";
import * as React from "react";
import { useState, useEffect, Suspense } from "react";
import { useSensors, useSensor, PointerSensor, TouchSensor, KeyboardSensor, DndContext, closestCenter } from "@dnd-kit/core";
import { useSortable, sortableKeyboardCoordinates, SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RxDragHandleHorizontal } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
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
const styles = "/assets/shared-DByhrGWj.css";
var _global = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
_global.SENTRY_RELEASE = { id: "f33cc3be66110bdccd95a1a4edf93a53b8178aff" };
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
const links = () => [
  { rel: "stylesheet", href: styles }
];
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
      /* @__PURE__ */ jsx(Links, {}),
      /* @__PURE__ */ jsx(Meta, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx("div", { className: "header", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-10", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Link, { className: "font-medium text-blue-600 dark:text-blue-500 hover:underline", to: "/habits", children: "Habits" }) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Link, { className: "font-medium text-blue-600 dark:text-blue-500 hover:underline", to: "/login", children: "Login" }) })
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
  links
}, Symbol.toStringTag, { value: "Module" }));
async function requireUserId(request) {
  const userId = "bcoe";
  return userId;
}
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
async function loader({ request }) {
  await requireUserId();
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
  loader
}, Symbol.toStringTag, { value: "Module" }));
function LoginComponent() {
  useNavigate();
  useEffect(() => {
    async function getRedirect() {
      const resp = await fetch("/v1/login");
      const { redirect } = await resp.json();
      window.location.href = redirect;
    }
    getRedirect();
  });
  return /* @__PURE__ */ jsx("div", { children: "Redirecting to Google login..." });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: LoginComponent
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BICFu7-C.js", "imports": ["/assets/index-BS7G0_a2.js", "/assets/components-DxCqp97G.js", "/assets/performance-CvU6eI7P.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-CRNi61PC.js", "imports": ["/assets/index-BS7G0_a2.js", "/assets/components-DxCqp97G.js", "/assets/performance-CvU6eI7P.js", "/assets/habits-DGr9l4Bu.js"], "css": [] }, "routes/habits": { "id": "routes/habits", "parentId": "root", "path": "habits", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/habits-rdZAkgW6.js", "imports": ["/assets/index-BS7G0_a2.js", "/assets/components-DxCqp97G.js", "/assets/habits-DGr9l4Bu.js"], "css": [] }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/login-XgdEjkne.js", "imports": ["/assets/index-BS7G0_a2.js"], "css": [] } }, "url": "/assets/manifest-de0c36ea.js", "version": "de0c36ea" };
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
