import{r as ae,w as ne,M as oe,L as ie,O as ue,S as se}from"./performance-DWHxMUNt.js";var Er={exports:{}},x={};/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(){var yr=ae,k=Symbol.for("react.element"),mr=Symbol.for("react.portal"),_=Symbol.for("react.fragment"),N=Symbol.for("react.strict_mode"),B=Symbol.for("react.profiler"),G=Symbol.for("react.provider"),z=Symbol.for("react.context"),T=Symbol.for("react.forward_ref"),A=Symbol.for("react.suspense"),F=Symbol.for("react.suspense_list"),C=Symbol.for("react.memo"),D=Symbol.for("react.lazy"),Rr=Symbol.for("react.offscreen"),H=Symbol.iterator,_r="@@iterator";function Tr(r){if(r===null||typeof r!="object")return null;var e=H&&r[H]||r[_r];return typeof e=="function"?e:null}var b=yr.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;function f(r){{for(var e=arguments.length,t=new Array(e>1?e-1:0),a=1;a<e;a++)t[a-1]=arguments[a];Cr("error",r,t)}}function Cr(r,e,t){{var a=b.ReactDebugCurrentFrame,i=a.getStackAddendum();i!==""&&(e+="%s",t=t.concat([i]));var u=t.map(function(o){return String(o)});u.unshift("Warning: "+e),Function.prototype.apply.call(console[r],console,u)}}var wr=!1,Sr=!1,jr=!1,Or=!1,Pr=!1,K;K=Symbol.for("react.module.reference");function xr(r){return!!(typeof r=="string"||typeof r=="function"||r===_||r===B||Pr||r===N||r===A||r===F||Or||r===Rr||wr||Sr||jr||typeof r=="object"&&r!==null&&(r.$$typeof===D||r.$$typeof===C||r.$$typeof===G||r.$$typeof===z||r.$$typeof===T||r.$$typeof===K||r.getModuleId!==void 0))}function kr(r,e,t){var a=r.displayName;if(a)return a;var i=e.displayName||e.name||"";return i!==""?t+"("+i+")":t}function X(r){return r.displayName||"Context"}function d(r){if(r==null)return null;if(typeof r.tag=="number"&&f("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."),typeof r=="function")return r.displayName||r.name||null;if(typeof r=="string")return r;switch(r){case _:return"Fragment";case mr:return"Portal";case B:return"Profiler";case N:return"StrictMode";case A:return"Suspense";case F:return"SuspenseList"}if(typeof r=="object")switch(r.$$typeof){case z:var e=r;return X(e)+".Consumer";case G:var t=r;return X(t._context)+".Provider";case T:return kr(r,r.render,"ForwardRef");case C:var a=r.displayName||null;return a!==null?a:d(r.type)||"Memo";case D:{var i=r,u=i._payload,o=i._init;try{return d(o(u))}catch{return null}}}return null}var g=Object.assign,m=0,q,J,Z,Q,rr,er,tr;function ar(){}ar.__reactDisabledLog=!0;function Ar(){{if(m===0){q=console.log,J=console.info,Z=console.warn,Q=console.error,rr=console.group,er=console.groupCollapsed,tr=console.groupEnd;var r={configurable:!0,enumerable:!0,value:ar,writable:!0};Object.defineProperties(console,{info:r,log:r,warn:r,error:r,group:r,groupCollapsed:r,groupEnd:r})}m++}}function Fr(){{if(m--,m===0){var r={configurable:!0,enumerable:!0,writable:!0};Object.defineProperties(console,{log:g({},r,{value:q}),info:g({},r,{value:J}),warn:g({},r,{value:Z}),error:g({},r,{value:Q}),group:g({},r,{value:rr}),groupCollapsed:g({},r,{value:er}),groupEnd:g({},r,{value:tr})})}m<0&&f("disabledDepth fell below zero. This is a bug in React. Please file an issue.")}}var I=b.ReactCurrentDispatcher,W;function w(r,e,t){{if(W===void 0)try{throw Error()}catch(i){var a=i.stack.trim().match(/\n( *(at )?)/);W=a&&a[1]||""}return`
`+W+r}}var Y=!1,S;{var Dr=typeof WeakMap=="function"?WeakMap:Map;S=new Dr}function nr(r,e){if(!r||Y)return"";{var t=S.get(r);if(t!==void 0)return t}var a;Y=!0;var i=Error.prepareStackTrace;Error.prepareStackTrace=void 0;var u;u=I.current,I.current=null,Ar();try{if(e){var o=function(){throw Error()};if(Object.defineProperty(o.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(o,[])}catch(p){a=p}Reflect.construct(r,[],o)}else{try{o.call()}catch(p){a=p}r.call(o.prototype)}}else{try{throw Error()}catch(p){a=p}r()}}catch(p){if(p&&a&&typeof p.stack=="string"){for(var n=p.stack.split(`
`),c=a.stack.split(`
`),s=n.length-1,l=c.length-1;s>=1&&l>=0&&n[s]!==c[l];)l--;for(;s>=1&&l>=0;s--,l--)if(n[s]!==c[l]){if(s!==1||l!==1)do if(s--,l--,l<0||n[s]!==c[l]){var v=`
`+n[s].replace(" at new "," at ");return r.displayName&&v.includes("<anonymous>")&&(v=v.replace("<anonymous>",r.displayName)),typeof r=="function"&&S.set(r,v),v}while(s>=1&&l>=0);break}}}finally{Y=!1,I.current=u,Fr(),Error.prepareStackTrace=i}var y=r?r.displayName||r.name:"",br=y?w(y):"";return typeof r=="function"&&S.set(r,br),br}function Ir(r,e,t){return nr(r,!1)}function Wr(r){var e=r.prototype;return!!(e&&e.isReactComponent)}function j(r,e,t){if(r==null)return"";if(typeof r=="function")return nr(r,Wr(r));if(typeof r=="string")return w(r);switch(r){case A:return w("Suspense");case F:return w("SuspenseList")}if(typeof r=="object")switch(r.$$typeof){case T:return Ir(r.render);case C:return j(r.type,e,t);case D:{var a=r,i=a._payload,u=a._init;try{return j(u(i),e,t)}catch{}}}return""}var O=Object.prototype.hasOwnProperty,or={},ir=b.ReactDebugCurrentFrame;function P(r){if(r){var e=r._owner,t=j(r.type,r._source,e?e.type:null);ir.setExtraStackFrame(t)}else ir.setExtraStackFrame(null)}function Yr(r,e,t,a,i){{var u=Function.call.bind(O);for(var o in r)if(u(r,o)){var n=void 0;try{if(typeof r[o]!="function"){var c=Error((a||"React class")+": "+t+" type `"+o+"` is invalid; it must be a function, usually from the `prop-types` package, but received `"+typeof r[o]+"`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");throw c.name="Invariant Violation",c}n=r[o](e,o,a,t,null,"SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED")}catch(s){n=s}n&&!(n instanceof Error)&&(P(i),f("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).",a||"React class",t,o,typeof n),P(null)),n instanceof Error&&!(n.message in or)&&(or[n.message]=!0,P(i),f("Failed %s type: %s",t,n.message),P(null))}}}var $r=Array.isArray;function $(r){return $r(r)}function Mr(r){{var e=typeof Symbol=="function"&&Symbol.toStringTag,t=e&&r[Symbol.toStringTag]||r.constructor.name||"Object";return t}}function Lr(r){try{return ur(r),!1}catch{return!0}}function ur(r){return""+r}function sr(r){if(Lr(r))return f("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.",Mr(r)),ur(r)}var R=b.ReactCurrentOwner,Vr={key:!0,ref:!0,__self:!0,__source:!0},lr,fr,M;M={};function Ur(r){if(O.call(r,"ref")){var e=Object.getOwnPropertyDescriptor(r,"ref").get;if(e&&e.isReactWarning)return!1}return r.ref!==void 0}function Nr(r){if(O.call(r,"key")){var e=Object.getOwnPropertyDescriptor(r,"key").get;if(e&&e.isReactWarning)return!1}return r.key!==void 0}function Br(r,e){if(typeof r.ref=="string"&&R.current&&e&&R.current.stateNode!==e){var t=d(R.current.type);M[t]||(f('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref',d(R.current.type),r.ref),M[t]=!0)}}function Gr(r,e){{var t=function(){lr||(lr=!0,f("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)",e))};t.isReactWarning=!0,Object.defineProperty(r,"key",{get:t,configurable:!0})}}function zr(r,e){{var t=function(){fr||(fr=!0,f("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)",e))};t.isReactWarning=!0,Object.defineProperty(r,"ref",{get:t,configurable:!0})}}var Hr=function(r,e,t,a,i,u,o){var n={$$typeof:k,type:r,key:e,ref:t,props:o,_owner:u};return n._store={},Object.defineProperty(n._store,"validated",{configurable:!1,enumerable:!1,writable:!0,value:!1}),Object.defineProperty(n,"_self",{configurable:!1,enumerable:!1,writable:!1,value:a}),Object.defineProperty(n,"_source",{configurable:!1,enumerable:!1,writable:!1,value:i}),Object.freeze&&(Object.freeze(n.props),Object.freeze(n)),n};function Kr(r,e,t,a,i){{var u,o={},n=null,c=null;t!==void 0&&(sr(t),n=""+t),Nr(e)&&(sr(e.key),n=""+e.key),Ur(e)&&(c=e.ref,Br(e,i));for(u in e)O.call(e,u)&&!Vr.hasOwnProperty(u)&&(o[u]=e[u]);if(r&&r.defaultProps){var s=r.defaultProps;for(u in s)o[u]===void 0&&(o[u]=s[u])}if(n||c){var l=typeof r=="function"?r.displayName||r.name||"Unknown":r;n&&Gr(o,l),c&&zr(o,l)}return Hr(r,n,c,i,a,R.current,o)}}var L=b.ReactCurrentOwner,cr=b.ReactDebugCurrentFrame;function E(r){if(r){var e=r._owner,t=j(r.type,r._source,e?e.type:null);cr.setExtraStackFrame(t)}else cr.setExtraStackFrame(null)}var V;V=!1;function U(r){return typeof r=="object"&&r!==null&&r.$$typeof===k}function vr(){{if(L.current){var r=d(L.current.type);if(r)return`

Check the render method of \``+r+"`."}return""}}function Xr(r){{if(r!==void 0){var e=r.fileName.replace(/^.*[\\\/]/,""),t=r.lineNumber;return`

Check your code at `+e+":"+t+"."}return""}}var dr={};function qr(r){{var e=vr();if(!e){var t=typeof r=="string"?r:r.displayName||r.name;t&&(e=`

Check the top-level render call using <`+t+">.")}return e}}function pr(r,e){{if(!r._store||r._store.validated||r.key!=null)return;r._store.validated=!0;var t=qr(e);if(dr[t])return;dr[t]=!0;var a="";r&&r._owner&&r._owner!==L.current&&(a=" It was passed a child from "+d(r._owner.type)+"."),E(r),f('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.',t,a),E(null)}}function hr(r,e){{if(typeof r!="object")return;if($(r))for(var t=0;t<r.length;t++){var a=r[t];U(a)&&pr(a,e)}else if(U(r))r._store&&(r._store.validated=!0);else if(r){var i=Tr(r);if(typeof i=="function"&&i!==r.entries)for(var u=i.call(r),o;!(o=u.next()).done;)U(o.value)&&pr(o.value,e)}}}function Jr(r){{var e=r.type;if(e==null||typeof e=="string")return;var t;if(typeof e=="function")t=e.propTypes;else if(typeof e=="object"&&(e.$$typeof===T||e.$$typeof===C))t=e.propTypes;else return;if(t){var a=d(e);Yr(t,r.props,"prop",a,r)}else if(e.PropTypes!==void 0&&!V){V=!0;var i=d(e);f("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?",i||"Unknown")}typeof e.getDefaultProps=="function"&&!e.getDefaultProps.isReactClassApproved&&f("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.")}}function Zr(r){{for(var e=Object.keys(r.props),t=0;t<e.length;t++){var a=e[t];if(a!=="children"&&a!=="key"){E(r),f("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.",a),E(null);break}}r.ref!==null&&(E(r),f("Invalid attribute `ref` supplied to `React.Fragment`."),E(null))}}function gr(r,e,t,a,i,u){{var o=xr(r);if(!o){var n="";(r===void 0||typeof r=="object"&&r!==null&&Object.keys(r).length===0)&&(n+=" You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");var c=Xr(i);c?n+=c:n+=vr();var s;r===null?s="null":$(r)?s="array":r!==void 0&&r.$$typeof===k?(s="<"+(d(r.type)||"Unknown")+" />",n=" Did you accidentally export a JSX literal instead of a component?"):s=typeof r,f("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s",s,n)}var l=Kr(r,e,t,i,u);if(l==null)return l;if(o){var v=e.children;if(v!==void 0)if(a)if($(v)){for(var y=0;y<v.length;y++)hr(v[y],r);Object.freeze&&Object.freeze(v)}else f("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");else hr(v,r)}return r===_?Zr(l):Jr(l),l}}function Qr(r,e,t){return gr(r,e,t,!0)}function re(r,e,t){return gr(r,e,t,!1)}var ee=re,te=Qr;x.Fragment=_,x.jsx=ee,x.jsxs=te})();Er.exports=x;var h=Er.exports;function le(){return h.jsxs("html",{children:[h.jsxs("head",{children:[h.jsx("link",{rel:"icon",href:"data:image/x-icon;base64,AA"}),h.jsx(oe,{}),h.jsx(ie,{})]}),h.jsxs("body",{children:[h.jsx("h1",{children:"Hello world!"}),h.jsx(ue,{}),h.jsx(se,{})]})]})}const ce=ne(le);export{ce as default};
