;
!function() {
  try {
    var e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}, n = new Error().stack;
    n && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[n] = "54147d72-af28-4233-9808-0d12da712b20", e._sentryDebugIdIdentifier = "sentry-dbid-54147d72-af28-4233-9808-0d12da712b20");
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
import { useState } from "react";
import { useSensors, useSensor, PointerSensor, KeyboardSensor, DndContext, closestCenter } from "@dnd-kit/core";
import { useSortable, sortableKeyboardCoordinates, SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RxDragHandleHorizontal } from "react-icons/rx";
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
const grid = "_grid_1nq7q_1";
const transform = "_transform_1nq7q_1";
const rounded = "_rounded_1nq7q_1";
const border = "_border_1nq7q_1";
const shadow = "_shadow_1nq7q_1";
const transition = "_transition_1nq7q_1";
const header = "_header_1nq7q_5";
const classes = {
  "col-span-10": "_col-span-10_1nq7q_1",
  grid,
  transform,
  "grid-cols-12": "_grid-cols-12_1nq7q_1",
  "grid-cols-3": "_grid-cols-3_1nq7q_1",
  rounded,
  border,
  "border-gray-400": "_border-gray-400_1nq7q_1",
  "bg-white": "_bg-white_1nq7q_1",
  "px-4": "_px-4_1nq7q_1",
  "py-2": "_py-2_1nq7q_1",
  "font-semibold": "_font-semibold_1nq7q_1",
  "text-gray-800": "_text-gray-800_1nq7q_1",
  shadow,
  transition,
  header,
  "hover:bg-gray-100": "_hover:bg-gray-100_1nq7q_1"
};
var _global = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
_global.SENTRY_RELEASE = { id: "635f0775f8583d8e528459daf65299ebb5be7035" };
function ttt(text) {
  return text.split(" ").map((text2) => classes[text2]).join(" ");
}
function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform: transform2,
    transition: transition2
  } = useSortable({ id: props.id });
  const style = {
    transform: CSS.Transform.toString(transform2),
    transition: transition2
  };
  return /* @__PURE__ */ jsx("div", { className: ttt("bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"), ref: setNodeRef, style, ...attributes, ...listeners, children: /* @__PURE__ */ jsxs("div", { className: ttt("grid grid-cols-12"), children: [
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(RxDragHandleHorizontal, {}) }),
    /* @__PURE__ */ jsx("div", { className: ttt("col-span-10"), children: props.value }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("input", { type: "checkbox" }) })
  ] }) });
}
function App() {
  const [items, setItems] = useState([{ id: 1, value: "make coffee" }, { id: 2, value: "brush my teeth" }, { id: 3, value: "be rad" }, { id: 4, value: "go climb a mountain" }]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
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
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx("div", { className: ttt("header") }),
      /* @__PURE__ */ jsxs("div", { className: ttt("grid grid-cols-3"), children: [
        /* @__PURE__ */ jsx("div", {}),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          DndContext,
          {
            sensors,
            collisionDetection: closestCenter,
            onDragEnd: handleDragEnd,
            children: /* @__PURE__ */ jsx(
              SortableContext,
              {
                items,
                strategy: verticalListSortingStrategy,
                children: items.map((item) => /* @__PURE__ */ jsx(SortableItem, { value: item.value, id: item.id }, item.id))
              }
            )
          }
        ) }),
        /* @__PURE__ */ jsx("div", {})
      ] }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      setItems((items2) => {
        const oldIndex = items2.findIndex((item) => item.id === active.id);
        const newIndex = items2.findIndex((item) => item.id === over.id);
        return arrayMove(items2, oldIndex, newIndex);
      });
    }
  }
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
const serverManifest = { "entry": { "module": "/assets/entry.client-BBr2LwHM.js", "imports": ["/assets/performance-DtqhxpOn.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-C_MOzUfD.js", "imports": ["/assets/performance-DtqhxpOn.js"], "css": ["/assets/root-CQgxjUUW.css"] } }, "url": "/assets/manifest-885a1d32.js", "version": "885a1d32" };
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
