import{r as l,i as Q,u as Z,S as q,E as C,A as ee,D as te,a as $,l as re,p as X,b as ne,c as ae,m as oe,d as ie,e as le,f as se,R as de,g as ue,h as ce,j as O,k as fe,n as me}from"./components-D9D8MDEo.js";import{a as U,i as we,s as he,b as _e,c as ye,g as Re}from"./performance-j-rtnWpx.js";(function(){try{var e=typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},t=new Error().stack;t&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[t]="e5dfd87b-fbab-4cec-844e-a28165d17cc2",e._sentryDebugIdIdentifier="sentry-dbid-e5dfd87b-fbab-4cec-844e-a28165d17cc2")}catch{}})();/**
 * @remix-run/react v2.8.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */class pe extends l.Component{constructor(t){super(t),this.state={error:t.error||null,location:t.location}}static getDerivedStateFromError(t){return{error:t}}static getDerivedStateFromProps(t,r){return r.location!==t.location?{error:t.error||null,location:t.location}:{error:t.error||r.error,location:r.location}}render(){return this.state.error?l.createElement(z,{error:this.state.error}):this.props.children}}function z({error:e}){console.error(e);let t=l.createElement("script",{dangerouslySetInnerHTML:{__html:`
        console.log(
          "💿 Hey developer 👋. You can provide a way better UX than this when your app throws errors. Check out https://remix.run/guides/errors for more information."
        );
      `}});if(Q(e))return l.createElement(D,{title:"Unhandled Thrown Response!"},l.createElement("h1",{style:{fontSize:"24px"}},e.status," ",e.statusText),t);let r;if(e instanceof Error)r=e;else{let a=e==null?"Unknown Error":typeof e=="object"&&"toString"in e?e.toString():JSON.stringify(e);r=new Error(a)}return l.createElement(D,{title:"Application Error!"},l.createElement("h1",{style:{fontSize:"24px"}},"Application Error"),l.createElement("pre",{style:{padding:"2rem",background:"hsla(10, 50%, 50%, 0.1)",color:"red",overflow:"auto"}},r.stack),t)}function D({title:e,renderScripts:t,children:r}){var a;let{routeModules:n}=Z();return(a=n.root)!==null&&a!==void 0&&a.Layout?r:l.createElement("html",{lang:"en"},l.createElement("head",null,l.createElement("meta",{charSet:"utf-8"}),l.createElement("meta",{name:"viewport",content:"width=device-width,initial-scale=1,viewport-fit=cover"}),l.createElement("title",null,e)),l.createElement("body",null,l.createElement("main",{style:{fontFamily:"system-ui, sans-serif",padding:"2rem"}},r,t?l.createElement(q,null):null)))}/**
 * @remix-run/react v2.8.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function ve(e){if(!e)return null;let t=Object.entries(e),r={};for(let[a,n]of t)if(n&&n.__type==="RouteErrorResponse")r[a]=new C(n.status,n.statusText,n.data,n.internal===!0);else if(n&&n.__type==="Error"){if(n.__subType){let s=window[n.__subType];if(typeof s=="function")try{let d=new s(n.message);d.stack=n.stack,r[a]=d}catch{}}if(r[a]==null){let s=new Error(n.message);s.stack=n.stack,r[a]=s}}else r[a]=n;return r}/**
 * @remix-run/react v2.8.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function xe(e){return e.headers.get("X-Remix-Catch")!=null}function be(e){return e.headers.get("X-Remix-Error")!=null}function Ee(e){return W(e)&&e.status>=400&&e.headers.get("X-Remix-Error")==null&&e.headers.get("X-Remix-Catch")==null&&e.headers.get("X-Remix-Response")==null}function ge(e){return e.headers.get("X-Remix-Redirect")!=null}function Ce(e){var t;return!!((t=e.headers.get("Content-Type"))!==null&&t!==void 0&&t.match(/text\/remix-deferred/))}function W(e){return e!=null&&typeof e.status=="number"&&typeof e.statusText=="string"&&typeof e.headers=="object"&&typeof e.body<"u"}function Le(e){let t=e;return t&&typeof t=="object"&&typeof t.data=="object"&&typeof t.subscribe=="function"&&typeof t.cancel=="function"&&typeof t.resolveData=="function"}async function Y(e,t,r=0){let a=new URL(e.url);a.searchParams.set("_data",t);let n={signal:e.signal};if(e.method!=="GET"){n.method=e.method;let i=e.headers.get("Content-Type");i&&/\bapplication\/json\b/.test(i)?(n.headers={"Content-Type":i},n.body=JSON.stringify(await e.json())):i&&/\btext\/plain\b/.test(i)?(n.headers={"Content-Type":i},n.body=await e.text()):i&&/\bapplication\/x-www-form-urlencoded\b/.test(i)?n.body=new URLSearchParams(await e.text()):n.body=await e.formData()}r>0&&await new Promise(i=>setTimeout(i,5**r*10));let s=window.__remixRevalidation,d=await fetch(a.href,n).catch(i=>{if(typeof s=="number"&&s===window.__remixRevalidation&&(i==null?void 0:i.name)==="TypeError"&&r<3)return Y(e,t,r+1);throw i});if(be(d)){let i=await d.json(),o=new Error(i.message);return o.stack=i.stack,o}if(Ee(d)){let i=await d.text(),o=new Error(i);return o.stack=void 0,o}return d}const Se="__deferred_promise:";async function ke(e){if(!e)throw new Error("parseDeferredReadableStream requires stream argument");let t,r={};try{let a=Me(e),s=(await a.next()).value;if(!s)throw new Error("no critical data");let d=JSON.parse(s);if(typeof d=="object"&&d!==null)for(let[i,o]of Object.entries(d))typeof o!="string"||!o.startsWith(Se)||(t=t||{},t[i]=new Promise((u,_)=>{r[i]={resolve:c=>{u(c),delete r[i]},reject:c=>{_(c),delete r[i]}}}));return(async()=>{try{for await(let i of a){let[o,...u]=i.split(":"),_=u.join(":"),c=JSON.parse(_);if(o==="data")for(let[h,f]of Object.entries(c))r[h]&&r[h].resolve(f);else if(o==="error")for(let[h,f]of Object.entries(c)){let x=new Error(f.message);x.stack=f.stack,r[h]&&r[h].reject(x)}}for(let[i,o]of Object.entries(r))o.reject(new ee(`Deferred ${i} will never be resolved`))}catch(i){for(let o of Object.values(r))o.reject(i)}})(),new te({...d,...t})}catch(a){for(let n of Object.values(r))n.reject(a);throw a}}async function*Me(e){let t=e.getReader(),r=[],a=[],n=!1,s=new TextEncoder,d=new TextDecoder,i=async()=>{if(a.length>0)return a.shift();for(;!n&&a.length===0;){let u=await t.read();if(u.done){n=!0;break}r.push(u.value);try{let c=d.decode(I(...r)).split(`

`);if(c.length>=2&&(a.push(...c.slice(0,-1)),r=[s.encode(c.slice(-1).join(`

`))]),a.length>0)break}catch{continue}}return a.length>0||r.length>0&&(a=d.decode(I(...r)).split(`

`).filter(_=>_),r=[]),a.shift()},o=await i();for(;o;)yield o,o=await i()}function I(...e){let t=new Uint8Array(e.reduce((a,n)=>a+n.length,0)),r=0;for(let a of e)t.set(a,r),r+=a.length;return t}/**
 * @remix-run/react v2.8.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function De(){return l.createElement(D,{title:"Loading...",renderScripts:!0},l.createElement("script",{dangerouslySetInnerHTML:{__html:`
              console.log(
                "💿 Hey developer 👋. You can provide a way better UX than this " +
                "when your app is running \`clientLoader\` functions on hydration. " +
                "Check out https://remix.run/route/hydrate-fallback for more information."
              );
            `}}))}/**
 * @remix-run/react v2.8.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function J(e){let t={};return Object.values(e).forEach(r=>{let a=r.parentId||"";t[a]||(t[a]=[]),t[a].push(r)}),t}function Ae(e,t,r){let a=G(t),n=t.HydrateFallback&&(!r||e.id==="root")?t.HydrateFallback:e.id==="root"?De:void 0,s=t.ErrorBoundary?t.ErrorBoundary:e.id==="root"?()=>l.createElement(z,{error:ne()}):void 0;return e.id==="root"&&t.Layout?{...a?{element:l.createElement(t.Layout,null,l.createElement(a,null))}:{Component:a},...s?{errorElement:l.createElement(t.Layout,null,l.createElement(s,null))}:{ErrorBoundary:s},...n?{hydrateFallbackElement:l.createElement(t.Layout,null,l.createElement(n,null))}:{HydrateFallback:n}}:{Component:a,ErrorBoundary:s,HydrateFallback:n}}function je(e,t,r,a,n,s){return j(t,r,a,n,s,"",J(t),e)}function E(e,t,r){if(r){let d=`You cannot call ${e==="action"?"serverAction()":"serverLoader()"} in SPA Mode (routeId: "${t.id}")`;throw console.error(d),new C(400,"Bad Request",new Error(d),!0)}let n=`You are trying to call ${e==="action"?"serverAction()":"serverLoader()"} on a route that does not have a server ${e} (routeId: "${t.id}")`;if(e==="loader"&&!t.hasLoader||e==="action"&&!t.hasAction)throw console.error(n),new C(400,"Bad Request",new Error(n),!0)}function k(e,t){let r=e==="clientAction"?"a":"an",a=`Route "${t}" does not have ${r} ${e}, but you are trying to submit to it. To fix this, please add ${r} \`${e}\` function to the route`;throw console.error(a),new C(405,"Method Not Allowed",new Error(a),!0)}function j(e,t,r,a,n,s="",d=J(e),i){return(d[s]||[]).map(o=>{let u=t[o.id];async function _(m){return o.hasLoader?B(m,o):null}async function c(m){if(!o.hasAction)throw k("action",o.id);return B(m,o)}async function h(m){let w=t[o.id],p=w?X(o,w):Promise.resolve();try{return m()}finally{await p}}let f={id:o.id,index:o.index,path:o.path};if(u){var x,L,S;Object.assign(f,{...f,...Ae(o,u,n),handle:u.handle,shouldRevalidate:i?H(o.id,u.shouldRevalidate,i):u.shouldRevalidate});let m=r==null||(x=r.loaderData)===null||x===void 0?void 0:x[o.id],w=r==null||(L=r.errors)===null||L===void 0?void 0:L[o.id],p=i==null&&(((S=u.clientLoader)===null||S===void 0?void 0:S.hydrate)===!0||!o.hasLoader);f.loader=async({request:y,params:v})=>{try{return await h(async()=>($(u,"No `routeModule` available for critical-route loader"),u.clientLoader?u.clientLoader({request:y,params:v,async serverLoader(){if(E("loader",o,n),p){if(w!==void 0)throw w;return m}let T=await _(y);return await g(T)}}):n?null:_(y)))}finally{p=!1}},f.loader.hydrate=V(o,u,n),f.action=({request:y,params:v})=>h(async()=>{if($(u,"No `routeModule` available for critical-route action"),!u.clientAction){if(n)throw k("clientAction",o.id);return c(y)}return u.clientAction({request:y,params:v,async serverAction(){E("action",o,n);let b=await c(y);return await g(b)}})})}else o.hasClientLoader||(f.loader=({request:m})=>h(()=>n?Promise.resolve(null):_(m))),o.hasClientAction||(f.action=({request:m})=>h(()=>{if(n)throw k("clientAction",o.id);return c(m)})),f.lazy=async()=>{let m=await Pe(o,t),w={...m};if(m.clientLoader){let p=m.clientLoader;w.loader=y=>p({...y,async serverLoader(){E("loader",o,n);let v=await _(y.request);return await g(v)}})}if(m.clientAction){let p=m.clientAction;w.action=y=>p({...y,async serverAction(){E("action",o,n);let v=await c(y.request);return await g(v)}})}return i&&(w.shouldRevalidate=H(o.id,m.shouldRevalidate,i)),{...w.loader?{loader:w.loader}:{},...w.action?{action:w.action}:{},hasErrorBoundary:w.hasErrorBoundary,shouldRevalidate:w.shouldRevalidate,handle:w.handle,Component:w.Component,ErrorBoundary:w.ErrorBoundary}};let P=j(e,t,r,a,n,o.id,d,i);return P.length>0&&(f.children=P),f})}function H(e,t,r){let a=!1;return n=>a?t?t(n):n.defaultShouldRevalidate:(a=!0,r.has(e))}async function Pe(e,t){let r=await re(e,t);return await X(e,r),{Component:G(r),ErrorBoundary:r.ErrorBoundary,clientAction:r.clientAction,clientLoader:r.clientLoader,handle:r.handle,links:r.links,meta:r.meta,shouldRevalidate:r.shouldRevalidate}}async function B(e,t){let r=await Y(e,t.id);if(r instanceof Error)throw r;if(ge(r))throw Te(r);if(xe(r))throw r;return Ce(r)&&r.body?await ke(r.body):r}function g(e){if(Le(e))return e.data;if(W(e)){let t=e.headers.get("Content-Type");return t&&/\bapplication\/json\b/.test(t)?e.json():e.text()}return e}function Te(e){let t=parseInt(e.headers.get("X-Remix-Status"),10)||302,r=e.headers.get("X-Remix-Redirect"),a={},n=e.headers.get("X-Remix-Revalidate");n&&(a["X-Remix-Revalidate"]=n);let s=e.headers.get("X-Remix-Reload-Document");return s&&(a["X-Remix-Reload-Document"]=s),ae(r,{status:t,headers:a})}function G(e){if(e.default==null)return;if(!(typeof e.default=="object"&&Object.keys(e.default).length===0))return e.default}function V(e,t,r){return r&&e.id!=="root"||t.clientLoader!=null&&(t.clientLoader.hydrate===!0||e.hasLoader!==!0)}let R,M=!1;let A,Ue=new Promise(e=>{A=e}).catch(()=>{});function $e(e){if(!R){let s=window.__remixContext.url,d=window.location.pathname;if(s!==d&&!window.__remixContext.isSpaMode){let u=`Initial URL (${s}) does not match URL at time of hydration (${d}), reloading page...`;return console.error(u),window.location.reload(),l.createElement(l.Fragment,null)}let i=j(window.__remixManifest.routes,window.__remixRouteModules,window.__remixContext.state,window.__remixContext.future,window.__remixContext.isSpaMode),o;if(!window.__remixContext.isSpaMode){o={...window.__remixContext.state,loaderData:{...window.__remixContext.state.loaderData}};let u=oe(i,window.location);if(u)for(let _ of u){let c=_.route.id,h=window.__remixRouteModules[c],f=window.__remixManifest.routes[c];h&&V(f,h,window.__remixContext.isSpaMode)&&(h.HydrateFallback||!f.hasLoader)?o.loaderData[c]=void 0:f&&!f.hasLoader&&(o.loaderData[c]=null)}o&&o.errors&&(o.errors=ve(o.errors))}R=ie({routes:i,history:le(),basename:window.__remixContext.basename,future:{v7_normalizeFormMethod:!0,v7_fetcherPersist:window.__remixContext.future.v3_fetcherPersist,v7_partialHydration:!0,v7_prependBasename:!0,v7_relativeSplatPath:window.__remixContext.future.v3_relativeSplatPath},hydrationData:o,mapRouteProperties:se}),R.state.initialized&&(M=!0,R.initialize()),R.createRoutesForHMR=je,window.__remixRouter=R,A&&A(R)}let[t,r]=l.useState(window.__remixContext.criticalCss);window.__remixClearCriticalCss=()=>r(void 0);let[a,n]=l.useState(R.state.location);return l.useLayoutEffect(()=>{M||(M=!0,R.initialize())},[]),l.useLayoutEffect(()=>R.subscribe(s=>{s.location!==a&&n(s.location)}),[a]),l.createElement(de.Provider,{value:{manifest:window.__remixManifest,routeModules:window.__remixRouteModules,future:window.__remixContext.future,criticalCss:t,isSpaMode:window.__remixContext.isSpaMode}},l.createElement(pe,{location:a},l.createElement(ue,{router:R,fallbackElement:null,future:{v7_startTransition:!0}})))}var K,F=ce;{var N=F.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;K=function(e,t,r){N.usingClientEntryPoint=!0;try{return F.hydrateRoot(e,t,r)}finally{N.usingClientEntryPoint=!1}}}function Oe(e){const t={...e};U(t,"react"),we(t)}function Ie(e){e.instrumentPageLoad===void 0&&(e.instrumentPageLoad=!0),e.instrumentNavigation===void 0&&(e.instrumentNavigation=!0),he({useEffect:e.useEffect,useLocation:e.useLocation,useMatches:e.useMatches,instrumentNavigation:e.instrumentNavigation});const t=_e({...e,instrumentPageLoad:!1,instrumentNavigation:!1});return{...t,afterAllSetup(r){t.afterAllSetup(r),e.instrumentPageLoad&&ye()}}}function He(e){const t={...e,environment:e.environment||"development"};U(t,"remix",["remix","react"]),Oe(t),Re().setTag("runtime","browser")}He({dsn:"https://9736cd89fad569a4016ba7ce0d2a79c0@o4506956365430784.ingest.us.sentry.io/4507062370107392",tracesSampleRate:1,integrations:[Ie({useEffect:l.useEffect,useLocation:fe,useMatches:me})]});l.startTransition(()=>{K(document,O.jsx(l.StrictMode,{children:O.jsx($e,{})}))});
//# sourceMappingURL=entry.client-B3DUPj5Q.js.map
