import{r as o,j as g}from"./jsx-runtime-CUOzFbf5.js";(function(){try{var a=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},n=new Error().stack;n&&(a._sentryDebugIds=a._sentryDebugIds||{},a._sentryDebugIds[n]="345ad41a-5126-465a-9107-0a824b82bace",a._sentryDebugIdIdentifier="sentry-dbid-345ad41a-5126-465a-9107-0a824b82bace")}catch{}})();const p=o.createContext(null);function D({children:a}){const[n,d]=o.useState({daily:[]}),[r,c]=o.useState([]),[u,l]=o.useState(""),[i,f]=o.useState(!1),y=t=>(d(t),{}),b=async()=>{const e=await(await fetch("/v1/notes")).json();c(e.map(s=>({note:s.note,date:s.date,highlight:!1})))},h={metrics:n,notes:r,load:async()=>{const e=await(await fetch("/v1/metrics")).json();y({daily:e.map(s=>({name:new Date(s.date).toISOString().split("T")[0],completed:s.total_habits_for_day?s.habits_completed/s.total_habits_for_day:0}))}),await b()},set:y,maybeSelectRow:async t=>{t===u||i===!1||(l(t),t!==u&&c(r.map(e=>({note:e.note,date:e.date,highlight:e.date===t}))))},gotFocus:async()=>{i!==!0&&f(!0)},lostFocus:async()=>{i!==!1&&(f(!1),l(""),c(r.map(t=>({note:t.note,date:t.date,highlight:!1}))))}};return g.jsx(p.Provider,{value:h,"data-sentry-element":"unknown","data-sentry-component":"MetricsProvider","data-sentry-source-file":"metrics.tsx",children:a})}function F(){return o.useContext(p)}export{D as M,F as u};
//# sourceMappingURL=metrics-DO-2CLz4.js.map
