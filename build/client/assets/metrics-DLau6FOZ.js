import{r as n,j as u}from"./jsx-runtime-CKQyCzpV.js";(function(){try{var e=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},t=new Error().stack;t&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[t]="2984daeb-156c-4eb0-924c-ebb71380246e",e._sentryDebugIdIdentifier="sentry-dbid-2984daeb-156c-4eb0-924c-ebb71380246e")}catch{}})();const c=n.createContext(null);function p({children:e}){const[t,r]=n.useState({daily:[]}),o=a=>(r(a),{}),d={metrics:t,load:async()=>{const i=await(await fetch("/v1/metrics")).json();o({daily:i.map(s=>({name:new Date(s.date).toISOString().split("T")[0],completed:s.habits_completed/s.total_habits_for_day}))})},set:o};return u.jsx(c.Provider,{value:d,children:e})}function y(){return n.useContext(c)}export{p as M,y as u};
//# sourceMappingURL=metrics-DLau6FOZ.js.map
