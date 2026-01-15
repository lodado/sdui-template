import{j as u,r as it}from"./jsx-runtime-DxbnSXFt.js";/* empty css               */import{a as G,r as ft,R as ve,g as mt}from"./iframe-OK5fRIFX.js";import{u as st,b as gt,d as ht,S as yt,D as ie,a as V}from"./Text-keOb2BbV.js";import{r as vt}from"./index-sDJt2A8t.js";import{o as _t,s as Be,B as Ue}from"./types-8JUuiyf4.js";import"./preload-helper-ggYluGXI.js";import"./index-B-ZdNt7K.js";var se={},We;function X(){if(We)return se;We=1,se._=se._interop_require_default=e;function e(t){return t&&t.__esModule?t:{default:t}}return se}var ae={},Fe;function at(){if(Fe)return ae;Fe=1;function e(n){if(typeof WeakMap!="function")return null;var c=new WeakMap,f=new WeakMap;return(e=function(l){return l?f:c})(n)}ae._=ae._interop_require_wildcard=t;function t(n,c){if(!c&&n&&n.__esModule)return n;if(n===null||typeof n!="object"&&typeof n!="function")return{default:n};var f=e(c);if(f&&f.has(n))return f.get(n);var l={__proto__:null},s=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in n)if(o!=="default"&&Object.prototype.hasOwnProperty.call(n,o)){var y=s?Object.getOwnPropertyDescriptor(n,o):null;y&&(y.get||y.set)?Object.defineProperty(l,o,y):l[o]=n[o]}return l.default=n,f&&f.set(n,l),l}return ae}var _e={},He;function bt(){return He||(He=1,(function(e){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"RouterContext",{enumerable:!0,get:function(){return c}});const c=X()._(G()).default.createContext(null)})(_e)),_e}const Pe=({id:e,parentPath:t=[]})=>{const{childrenIds:n}=st({nodeId:e}),{renderNode:c,currentPath:f}=gt({nodeId:e,parentPath:t}),l=ht(),s=n.join(","),{leftChildren:o,middleChildren:y,rightChildren:b}=ft.useMemo(()=>{const r=[],m=[],d=[];return n.forEach(v=>{try{const _=l.getNodeTypeById(v);_==="TitleLeft"?r.push(v):_==="TitleMiddle"?m.push(v):_==="TitleRight"&&d.push(v)}catch{}}),{leftChildren:r,middleChildren:m,rightChildren:d}},[s,l]);return u.jsx("header",{className:"bg-white relative shrink-0 w-full border-b border-[var(--color-border-default)] flex items-center h-[48px] min-h-[48px] max-h-[48px] px-3 box-content","data-node-id":e,"data-testid":`title-${e}`,children:u.jsxs("div",{className:"w-full flex items-center justify-between relative",children:[o.length>0&&u.jsx("div",{className:"flex items-center gap-3 flex-shrink-0",children:o.map(r=>u.jsx(ve.Fragment,{children:c(r,f)},r))}),y.length>0&&u.jsx("div",{className:"absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center",children:y.map(r=>u.jsx(ve.Fragment,{children:c(r,f)},r))}),b.length>0&&u.jsx("div",{className:"flex items-center gap-2 flex-shrink-0 ml-auto",children:b.map(r=>u.jsx(ve.Fragment,{children:c(r,f)},r))})]})})};Pe.__docgenInfo={description:"",methods:[],displayName:"Title",props:{id:{required:!0,tsType:{name:"string"},description:""},parentPath:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:"",defaultValue:{value:"[]",computed:!1}}}};var be={},xe={},Se={},Ge;function Me(){return Ge||(Ge=1,(function(e){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"warnOnce",{enumerable:!0,get:function(){return t}});let t=n=>{}})(Se)),Se}var Te={},Ve;function xt(){return Ve||(Ve=1,(function(e){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"getImageBlurSvg",{enumerable:!0,get:function(){return t}});function t(n){let{widthInt:c,heightInt:f,blurWidth:l,blurHeight:s,blurDataURL:o,objectFit:y}=n;const b=20,r=l?l*40:c,m=s?s*40:f,d=r&&m?"viewBox='0 0 "+r+" "+m+"'":"",v=d?"none":y==="contain"?"xMidYMid":y==="cover"?"xMidYMid slice":"none";return"%3Csvg xmlns='http://www.w3.org/2000/svg' "+d+"%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='"+b+"'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='"+b+"'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='"+v+"' style='filter: url(%23b);' href='"+o+"'/%3E%3C/svg%3E"}})(Te)),Te}var Ce={},Xe;function Ee(){return Xe||(Xe=1,(function(e){Object.defineProperty(e,"__esModule",{value:!0});function t(f,l){for(var s in l)Object.defineProperty(f,s,{enumerable:!0,get:l[s]})}t(e,{VALID_LOADERS:function(){return n},imageConfigDefault:function(){return c}});const n=["default","imgix","cloudinary","akamai","custom"],c={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/_next/image",loader:"default",loaderFile:"",domains:[],disableStaticImages:!1,minimumCacheTTL:60,formats:["image/webp"],dangerouslyAllowSVG:!1,contentSecurityPolicy:"script-src 'none'; frame-src 'none'; sandbox;",contentDispositionType:"inline",localPatterns:void 0,remotePatterns:[],qualities:void 0,unoptimized:!1}})(Ce)),Ce}var Ye;function ct(){return Ye||(Ye=1,(function(e){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"getImgProps",{enumerable:!0,get:function(){return b}}),Me();const t=xt(),n=Ee();function c(r){return r.default!==void 0}function f(r){return r.src!==void 0}function l(r){return typeof r=="object"&&(c(r)||f(r))}function s(r){return typeof r>"u"?r:typeof r=="number"?Number.isFinite(r)?r:NaN:typeof r=="string"&&/^[0-9]+$/.test(r)?parseInt(r,10):NaN}function o(r,m,d){let{deviceSizes:v,allSizes:_}=r;if(d){const w=/(^|\s)(1?\d?\d)vw/g,P=[];for(let D;D=w.exec(d);D)P.push(parseInt(D[2]));if(P.length){const D=Math.min(...P)*.01;return{widths:_.filter(g=>g>=v[0]*D),kind:"w"}}return{widths:_,kind:"w"}}return typeof m!="number"?{widths:v,kind:"w"}:{widths:[...new Set([m,m*2].map(w=>_.find(P=>P>=w)||_[_.length-1]))],kind:"x"}}function y(r){let{config:m,src:d,unoptimized:v,width:_,quality:N,sizes:w,loader:P}=r;if(v)return{src:d,srcSet:void 0,sizes:void 0};const{widths:D,kind:g}=o(m,_,w),i=D.length-1;return{sizes:!w&&g==="w"?"100vw":w,srcSet:D.map((p,a)=>P({config:m,src:d,quality:N,width:p})+" "+(g==="w"?p:a+1)+g).join(", "),src:P({config:m,src:d,quality:N,width:D[i]})}}function b(r,m){let{src:d,sizes:v,unoptimized:_=!1,priority:N=!1,loading:w,className:P,quality:D,width:g,height:i,fill:p=!1,style:a,overrideSrc:h,onLoad:R,onLoadingComplete:j,placeholder:S="empty",blurDataURL:M,fetchPriority:C,decoding:I="async",layout:q,objectFit:k,objectPosition:Q,lazyBoundary:ne,lazyRoot:Z,...E}=r;const{imgConf:F,showAltText:O,blurComplete:$,defaultLoader:J}=m;let B,T=F||n.imageConfigDefault;if("allSizes"in T)B=T;else{var z;const x=[...T.deviceSizes,...T.imageSizes].sort((A,te)=>A-te),W=T.deviceSizes.sort((A,te)=>A-te),ee=(z=T.qualities)==null?void 0:z.sort((A,te)=>A-te);B={...T,allSizes:x,deviceSizes:W,qualities:ee}}if(typeof J>"u")throw new Error(`images.loaderFile detected but the file is missing default export.
Read more: https://nextjs.org/docs/messages/invalid-images-config`);let L=E.loader||J;delete E.loader,delete E.srcSet;const re="__next_img_default"in L;if(re){if(B.loader==="custom")throw new Error('Image with src "'+d+`" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`)}else{const x=L;L=W=>{const{config:ee,...A}=W;return x(A)}}if(q){q==="fill"&&(p=!0);const x={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}},W={responsive:"100vw",fill:"100vw"},ee=x[q];ee&&(a={...a,...ee});const A=W[q];A&&!v&&(v=A)}let Ne="",U=s(g),H=s(i),Oe,ke;if(l(d)){const x=c(d)?d.default:d;if(!x.src)throw new Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received "+JSON.stringify(x));if(!x.height||!x.width)throw new Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received "+JSON.stringify(x));if(Oe=x.blurWidth,ke=x.blurHeight,M=M||x.blurDataURL,Ne=x.src,!p){if(!U&&!H)U=x.width,H=x.height;else if(U&&!H){const W=U/x.width;H=Math.round(x.height*W)}else if(!U&&H){const W=H/x.height;U=Math.round(x.width*W)}}}d=typeof d=="string"?d:Ne;let ze=!N&&(w==="lazy"||typeof w>"u");(!d||d.startsWith("data:")||d.startsWith("blob:"))&&(_=!0,ze=!1),B.unoptimized&&(_=!0),re&&d.endsWith(".svg")&&!B.dangerouslyAllowSVG&&(_=!0),N&&(C="high");const ut=s(D),oe=Object.assign(p?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:k,objectPosition:Q}:{},O?{}:{color:"transparent"},a),Ae=!$&&S!=="empty"?S==="blur"?'url("data:image/svg+xml;charset=utf-8,'+(0,t.getImageBlurSvg)({widthInt:U,heightInt:H,blurWidth:Oe,blurHeight:ke,blurDataURL:M||"",objectFit:oe.objectFit})+'")':'url("'+S+'")':null;let pt=Ae?{backgroundSize:oe.objectFit||"cover",backgroundPosition:oe.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:Ae}:{};const ye=y({config:B,src:d,unoptimized:_,width:U,quality:ut,sizes:v,loader:L});return{props:{...E,loading:ze?"lazy":w,fetchPriority:C,width:U,height:H,decoding:I,className:P,style:{...oe,...pt},sizes:ye.sizes,srcSet:ye.srcSet,src:h||ye.src},meta:{unoptimized:_,priority:N,placeholder:S,fill:p}}}})(xe)),xe}var ce={exports:{}},de={exports:{}},we={},Je;function St(){return Je||(Je=1,(function(e){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return l}});const t=G(),n=typeof window>"u",c=n?()=>{}:t.useLayoutEffect,f=n?()=>{}:t.useEffect;function l(s){const{headManager:o,reduceComponentsToState:y}=s;function b(){if(o&&o.mountedInstances){const m=t.Children.toArray(Array.from(o.mountedInstances).filter(Boolean));o.updateHead(y(m,s))}}if(n){var r;o==null||(r=o.mountedInstances)==null||r.add(s.children),b()}return c(()=>{var m;return o==null||(m=o.mountedInstances)==null||m.add(s.children),()=>{var d;o==null||(d=o.mountedInstances)==null||d.delete(s.children)}}),c(()=>(o&&(o._pendingUpdate=b),()=>{o&&(o._pendingUpdate=b)})),f(()=>(o&&o._pendingUpdate&&(o._pendingUpdate(),o._pendingUpdate=null),()=>{o&&o._pendingUpdate&&(o._pendingUpdate(),o._pendingUpdate=null)})),null}})(we)),we}var je={},Ke;function Tt(){return Ke||(Ke=1,(function(e){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"AmpStateContext",{enumerable:!0,get:function(){return c}});const c=X()._(G()).default.createContext({})})(je)),je}var Le={},Qe;function Ct(){return Qe||(Qe=1,(function(e){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"HeadManagerContext",{enumerable:!0,get:function(){return c}});const c=X()._(G()).default.createContext({})})(Le)),Le}var De={},Ze;function wt(){return Ze||(Ze=1,(function(e){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"isInAmpMode",{enumerable:!0,get:function(){return t}});function t(n){let{ampFirst:c=!1,hybrid:f=!1,hasQuery:l=!1}=n===void 0?{}:n;return c||f&&l}})(De)),De}var $e;function jt(){return $e||($e=1,(function(e,t){"use client";var n={};Object.defineProperty(t,"__esModule",{value:!0});function c(g,i){for(var p in i)Object.defineProperty(g,p,{enumerable:!0,get:i[p]})}c(t,{default:function(){return D},defaultHead:function(){return d}});const f=X(),l=at(),s=it(),o=l._(G()),y=f._(St()),b=Tt(),r=Ct(),m=wt();Me();function d(g){g===void 0&&(g=!1);const i=[(0,s.jsx)("meta",{charSet:"utf-8"})];return g||i.push((0,s.jsx)("meta",{name:"viewport",content:"width=device-width"})),i}function v(g,i){return typeof i=="string"||typeof i=="number"?g:i.type===o.default.Fragment?g.concat(o.default.Children.toArray(i.props.children).reduce((p,a)=>typeof a=="string"||typeof a=="number"?p:p.concat(a),[])):g.concat(i)}const _=["name","httpEquiv","charSet","itemProp"];function N(){const g=new Set,i=new Set,p=new Set,a={};return h=>{let R=!0,j=!1;if(h.key&&typeof h.key!="number"&&h.key.indexOf("$")>0){j=!0;const S=h.key.slice(h.key.indexOf("$")+1);g.has(S)?R=!1:g.add(S)}switch(h.type){case"title":case"base":i.has(h.type)?R=!1:i.add(h.type);break;case"meta":for(let S=0,M=_.length;S<M;S++){const C=_[S];if(h.props.hasOwnProperty(C))if(C==="charSet")p.has(C)?R=!1:p.add(C);else{const I=h.props[C],q=a[C]||new Set;(C!=="name"||!j)&&q.has(I)?R=!1:(q.add(I),a[C]=q)}}break}return R}}function w(g,i){const{inAmpMode:p}=i;return g.reduce(v,[]).reverse().concat(d(p).reverse()).filter(N()).reverse().map((a,h)=>{const R=a.key||h;if(n.__NEXT_OPTIMIZE_FONTS&&!p&&a.type==="link"&&a.props.href&&["https://fonts.googleapis.com/css","https://use.typekit.net/"].some(j=>a.props.href.startsWith(j))){const j={...a.props||{}};return j["data-href"]=j.href,j.href=void 0,j["data-optimized-fonts"]=!0,o.default.cloneElement(a,j)}return o.default.cloneElement(a,{key:R})})}function P(g){let{children:i}=g;const p=(0,o.useContext)(b.AmpStateContext),a=(0,o.useContext)(r.HeadManagerContext);return(0,s.jsx)(y.default,{reduceComponentsToState:w,headManager:a,inAmpMode:(0,m.isInAmpMode)(p),children:i})}const D=P;(typeof t.default=="function"||typeof t.default=="object"&&t.default!==null)&&typeof t.default.__esModule>"u"&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)})(de,de.exports)),de.exports}var Re={},et;function Lt(){return et||(et=1,(function(e){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"ImageConfigContext",{enumerable:!0,get:function(){return f}});const n=X()._(G()),c=Ee(),f=n.default.createContext(c.imageConfigDefault)})(Re)),Re}var Ie={},tt;function dt(){return tt||(tt=1,(function(e){var t={};Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return f}});const n=75;function c(l){let{config:s,src:o,width:y,quality:b}=l;var r;const m=b||((r=s.qualities)==null?void 0:r.reduce((d,v)=>Math.abs(v-n)<Math.abs(d-n)?v:d))||n;return s.path+"?url="+encodeURIComponent(o)+"&w="+y+"&q="+m+(t.NEXT_DEPLOYMENT_ID?"&dpl="+t.NEXT_DEPLOYMENT_ID:"")}c.__next_img_default=!0;const f=c})(Ie)),Ie}var nt;function Dt(){return nt||(nt=1,(function(e,t){"use client";var n={};Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"Image",{enumerable:!0,get:function(){return g}});const c=X(),f=at(),l=it(),s=f._(G()),o=c._(vt()),y=c._(jt()),b=ct(),r=Ee(),m=Lt();Me();const d=bt(),v=c._(dt()),_=n.__NEXT_IMAGE_OPTS;typeof window>"u"&&(globalThis.__NEXT_IMAGE_IMPORTED=!0);function N(i,p,a,h,R,j,S){const M=i?.src;if(!i||i["data-loaded-src"]===M)return;i["data-loaded-src"]=M,("decode"in i?i.decode():Promise.resolve()).catch(()=>{}).then(()=>{if(!(!i.parentElement||!i.isConnected)){if(p!=="empty"&&R(!0),a?.current){const I=new Event("load");Object.defineProperty(I,"target",{writable:!1,value:i});let q=!1,k=!1;a.current({...I,nativeEvent:I,currentTarget:i,target:i,isDefaultPrevented:()=>q,isPropagationStopped:()=>k,persist:()=>{},preventDefault:()=>{q=!0,I.preventDefault()},stopPropagation:()=>{k=!0,I.stopPropagation()}})}h?.current&&h.current(i)}})}function w(i){return s.use?{fetchPriority:i}:{fetchpriority:i}}const P=(0,s.forwardRef)((i,p)=>{let{src:a,srcSet:h,sizes:R,height:j,width:S,decoding:M,className:C,style:I,fetchPriority:q,placeholder:k,loading:Q,unoptimized:ne,fill:Z,onLoadRef:E,onLoadingCompleteRef:F,setBlurComplete:O,setShowAltText:$,sizesInput:J,onLoad:B,onError:T,...z}=i;return(0,l.jsx)("img",{...z,...w(q),loading:Q,width:S,height:j,decoding:M,"data-nimg":Z?"fill":"1",className:C,style:I,sizes:R,srcSet:h,src:a,ref:(0,s.useCallback)(L=>{p&&(typeof p=="function"?p(L):typeof p=="object"&&(p.current=L)),L&&(T&&(L.src=L.src),L.complete&&N(L,k,E,F,O))},[a,k,E,F,O,T,ne,J,p]),onLoad:L=>{const re=L.currentTarget;N(re,k,E,F,O)},onError:L=>{$(!0),k!=="empty"&&O(!0),T&&T(L)}})});function D(i){let{isAppRouter:p,imgAttributes:a}=i;const h={as:"image",imageSrcSet:a.srcSet,imageSizes:a.sizes,crossOrigin:a.crossOrigin,referrerPolicy:a.referrerPolicy,...w(a.fetchPriority)};return p&&o.default.preload?(o.default.preload(a.src,h),null):(0,l.jsx)(y.default,{children:(0,l.jsx)("link",{rel:"preload",href:a.srcSet?void 0:a.src,...h},"__nimg-"+a.src+a.srcSet+a.sizes)})}const g=(0,s.forwardRef)((i,p)=>{const h=!(0,s.useContext)(d.RouterContext),R=(0,s.useContext)(m.ImageConfigContext),j=(0,s.useMemo)(()=>{var F;const O=_||R||r.imageConfigDefault,$=[...O.deviceSizes,...O.imageSizes].sort((T,z)=>T-z),J=O.deviceSizes.sort((T,z)=>T-z),B=(F=O.qualities)==null?void 0:F.sort((T,z)=>T-z);return{...O,allSizes:$,deviceSizes:J,qualities:B}},[R]),{onLoad:S,onLoadingComplete:M}=i,C=(0,s.useRef)(S);(0,s.useEffect)(()=>{C.current=S},[S]);const I=(0,s.useRef)(M);(0,s.useEffect)(()=>{I.current=M},[M]);const[q,k]=(0,s.useState)(!1),[Q,ne]=(0,s.useState)(!1),{props:Z,meta:E}=(0,b.getImgProps)(i,{defaultLoader:v.default,imgConf:j,blurComplete:q,showAltText:Q});return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(P,{...Z,unoptimized:E.unoptimized,placeholder:E.placeholder,fill:E.fill,onLoadRef:C,onLoadingCompleteRef:I,setBlurComplete:k,setShowAltText:ne,sizesInput:i.sizes,ref:p}),E.priority?(0,l.jsx)(D,{isAppRouter:h,imgAttributes:Z}):null]})});(typeof t.default=="function"||typeof t.default=="object"&&t.default!==null)&&typeof t.default.__esModule>"u"&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)})(ce,ce.exports)),ce.exports}var rt;function Rt(){return rt||(rt=1,(function(e){var t={};Object.defineProperty(e,"__esModule",{value:!0});function n(b,r){for(var m in r)Object.defineProperty(b,m,{enumerable:!0,get:r[m]})}n(e,{default:function(){return y},getImageProps:function(){return o}});const c=X(),f=ct(),l=Dt(),s=c._(dt());function o(b){const{props:r}=(0,f.getImgProps)(b,{defaultLoader:s.default,imgConf:t.__NEXT_IMAGE_OPTS});for(const[m,d]of Object.entries(r))d===void 0&&delete r[m];return{props:r}}const y=l.Image})(be)),be}var qe,ot;function It(){return ot||(ot=1,qe=Rt()),qe}var qt=It();const Pt=mt(qt),Mt=_t({src:Be(),alt:Be()}),lt=({id:e,parentPath:t=[]})=>{const{state:n}=st({nodeId:e,schema:Mt});return n?u.jsx("div",{className:"relative shrink-0 flex items-center h-full","data-node-id":e,"data-testid":`title-logo-${e}`,children:u.jsx(Pt,{src:n.src,alt:n.alt,width:156,height:32,className:"h-[20px] w-auto",style:{width:"auto",height:"20px"}})}):null};lt.__docgenInfo={description:"",methods:[],displayName:"TitleLogo",props:{id:{required:!0,tsType:{name:"string"},description:""},parentPath:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:"",defaultValue:{value:"[]",computed:!1}}}};function Y(){return{Title:e=>u.jsx(Pe,{id:e}),Div:(e,t)=>u.jsx(ie,{id:e,parentPath:t}),TitleLeft:(e,t)=>u.jsx(ie,{id:e,parentPath:t}),TitleMiddle:(e,t)=>u.jsx(ie,{id:e,parentPath:t}),TitleRight:(e,t)=>u.jsx(ie,{id:e,parentPath:t}),TitleLogo:(e,t)=>u.jsx(lt,{id:e,parentPath:t}),Span:e=>u.jsx(yt,{id:e})}}const Ht={title:"Features/UI/Title",component:Pe,tags:["autodocs"],parameters:{docs:{description:{component:"The Title component is a header container that provides a flexible layout structure for application headers. It supports three distinct sections (left, middle, and right) and automatically organizes child components based on their type. The component uses design system tokens for consistent styling and is fully responsive, adapting to different screen sizes."}}}},K=`data:image/svg+xml;base64,${btoa('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14M12 5l7 7-7 7" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>')}`,le={render:()=>{const e={version:"1.0.0",root:{id:"title-root",type:"Title",children:[{id:"title-left",type:"TitleLeft",children:[{id:"logo",type:"TitleLogo",state:{src:K,alt:"Company Logo"}}]}]}};return u.jsx("div",{style:{width:"100%",backgroundColor:"#f0f0f0"},children:u.jsx(V,{document:e,components:Y()})})},parameters:{docs:{description:{story:"A basic Title component with a logo positioned in the left section. The component uses design system tokens for consistent dark background styling."}}}},ue={render:()=>{const e={version:"1.0.0",root:{id:"title-root",type:"Title",children:[{id:"title-left",type:"TitleLeft",children:[{id:"logo",type:"TitleLogo",state:{src:K,alt:"Company Logo"}}]},{id:"title-right",type:"TitleRight",children:[{id:"nav-item-1",type:"Div",attributes:{className:"flex items-center gap-4"},children:[{id:"nav-button-1",type:"Div",attributes:{className:"text-[var(--color-text-default)] cursor-pointer hover:opacity-80"},state:{text:"Home"}},{id:"nav-button-2",type:"Div",attributes:{className:"text-[var(--color-text-default)] cursor-pointer hover:opacity-80"},state:{text:"About"}},{id:"nav-button-3",type:"Div",attributes:{className:"text-[var(--color-text-default)] cursor-pointer hover:opacity-80"},state:{text:"Contact"}}]}]}]}};return u.jsx("div",{style:{width:"100%",backgroundColor:"#f0f0f0"},children:u.jsx(V,{document:e,components:Y()})})},parameters:{docs:{description:{story:"A Title component with a logo in the left section and navigation items in the right section. Demonstrates the three-section layout system."}}}},pe={render:()=>{const e={version:"1.0.0",root:{id:"title-root",type:"Title",children:[{id:"title-left",type:"TitleLeft",children:[{id:"logo",type:"TitleLogo",state:{src:K,alt:"Company Logo"}}]},{id:"title-middle",type:"TitleMiddle",children:[{id:"search-container",type:"Div",attributes:{className:"flex items-center"},children:[{id:"search-text",type:"Div",attributes:{className:"text-[var(--color-text-subtle)] text-sm"},state:{text:"Search..."}}]}]},{id:"title-right",type:"TitleRight",children:[{id:"actions-container",type:"Div",attributes:{className:"flex items-center gap-2"},children:[{id:"action-button-1",type:"Div",attributes:{className:"text-[var(--color-text-default)] cursor-pointer hover:opacity-80"},state:{text:"Sign In"}},{id:"action-button-2",type:"Div",attributes:{className:"text-[var(--color-text-default)] cursor-pointer hover:opacity-80"},state:{text:"Sign Up"}}]}]}]}};return u.jsx("div",{style:{width:"100%",backgroundColor:"#f0f0f0"},children:u.jsx(V,{document:e,components:Y()})})},parameters:{docs:{description:{story:"A complete Title component example using all three sections (left, middle, right). Shows how the component organizes content across the header."}}}},fe={render:()=>{const e={version:"1.0.0",root:{id:"title-root",type:"Title",children:[{id:"title-left",type:"TitleLeft",children:[{id:"logo-secondary",type:"TitleLogo",state:{src:K,alt:"Secondary Logo"}}]}]}};return u.jsx("div",{style:{width:"100%",backgroundColor:"#f0f0f0"},children:u.jsx(V,{document:e,components:Y()})})},parameters:{docs:{description:{story:"Demonstrates how multiple TitleLogo components can be used within the Title component. Each logo is independently configurable."}}}},me={render:()=>{const e={version:"1.0.0",root:{id:"title-root",type:"Title",children:[{id:"title-left",type:"TitleLeft",children:[{id:"logo",type:"TitleLogo",state:{src:K,alt:"Company Logo"}}]},{id:"title-right",type:"TitleRight",children:[{id:"button-container",type:"Div",attributes:{className:"flex items-center gap-2"},children:[]}]}]}},t=({id:f})=>u.jsxs("div",{className:"flex items-center gap-2",children:[u.jsx(Ue,{buttonStyle:"outline",buttonType:"secondary",size:"M",children:"Sign In"}),u.jsx(Ue,{buttonStyle:"filled",buttonType:"primary",size:"M",children:"Sign Up"})]}),n={...Y(),ButtonContainer:()=>u.jsx(t,{id:"button-container"})},c={...e,root:{...e.root,children:[e.root.children[0],{id:"title-right",type:"TitleRight",children:[{id:"button-container",type:"ButtonContainer"}]}]}};return u.jsx("div",{style:{width:"100%",backgroundColor:"#f0f0f0"},children:u.jsx(V,{document:c,components:n})})},parameters:{docs:{description:{story:"Shows how to integrate Button components within the Title component. Demonstrates extending the component map with custom components."}}}},ge={render:()=>{const e={version:"1.0.0",root:{id:"title-root",type:"Title",children:[{id:"title-left",type:"TitleLeft",children:[{id:"logo",type:"TitleLogo",state:{src:K,alt:"Company Logo"}}]},{id:"title-middle",type:"TitleMiddle",children:[{id:"middle-content",type:"Div",attributes:{className:"hidden md:flex items-center text-[var(--color-text-default)]"},state:{text:"Middle Section (visible on medium screens and up)"}}]},{id:"title-right",type:"TitleRight",children:[{id:"right-content",type:"Div",attributes:{className:"flex items-center gap-2"},children:[{id:"mobile-menu",type:"Div",attributes:{className:"md:hidden text-[var(--color-text-default)] cursor-pointer"},state:{text:"☰"}},{id:"desktop-nav",type:"Div",attributes:{className:"hidden md:flex items-center gap-4 text-[var(--color-text-default)]"},children:[{id:"nav-1",type:"Div",attributes:{className:"cursor-pointer hover:opacity-80"},state:{text:"Home"}},{id:"nav-2",type:"Div",attributes:{className:"cursor-pointer hover:opacity-80"},state:{text:"About"}}]}]}]}]}};return u.jsx("div",{style:{width:"100%",backgroundColor:"#f0f0f0"},children:u.jsx(V,{document:e,components:Y()})})},parameters:{docs:{description:{story:"Demonstrates the responsive behavior of the Title component. The component adapts its layout and padding based on screen size using Tailwind CSS breakpoints."}}}},he={render:()=>{const e={version:"1.0.0",root:{id:"title-root",type:"Title",children:[]}};return u.jsx("div",{style:{width:"100%",backgroundColor:"#f0f0f0"},children:u.jsx(V,{document:e,components:Y()})})},parameters:{docs:{description:{story:"An empty Title component demonstrating the base structure and styling without any child components."}}}};le.parameters={...le.parameters,docs:{...le.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'title-root',
        type: 'Title',
        children: [{
          id: 'title-left',
          type: 'TitleLeft',
          children: [{
            id: 'logo',
            type: 'TitleLogo',
            state: {
              src: logoSecondarySvg,
              alt: 'Company Logo'
            }
          }]
        }]
      }
    };
    return <div style={{
      width: '100%',
      backgroundColor: '#f0f0f0'
    }}>
        <SduiLayoutRenderer document={document} components={getTitleComponents()} />
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic Title component with a logo positioned in the left section. The component uses design system tokens for consistent dark background styling.'
      }
    }
  }
}`,...le.parameters?.docs?.source}}};ue.parameters={...ue.parameters,docs:{...ue.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'title-root',
        type: 'Title',
        children: [{
          id: 'title-left',
          type: 'TitleLeft',
          children: [{
            id: 'logo',
            type: 'TitleLogo',
            state: {
              src: logoSecondarySvg,
              alt: 'Company Logo'
            }
          }]
        }, {
          id: 'title-right',
          type: 'TitleRight',
          children: [{
            id: 'nav-item-1',
            type: 'Div',
            attributes: {
              className: 'flex items-center gap-4'
            },
            children: [{
              id: 'nav-button-1',
              type: 'Div',
              attributes: {
                className: 'text-[var(--color-text-default)] cursor-pointer hover:opacity-80'
              },
              state: {
                text: 'Home'
              }
            }, {
              id: 'nav-button-2',
              type: 'Div',
              attributes: {
                className: 'text-[var(--color-text-default)] cursor-pointer hover:opacity-80'
              },
              state: {
                text: 'About'
              }
            }, {
              id: 'nav-button-3',
              type: 'Div',
              attributes: {
                className: 'text-[var(--color-text-default)] cursor-pointer hover:opacity-80'
              },
              state: {
                text: 'Contact'
              }
            }]
          }]
        }]
      }
    };
    return <div style={{
      width: '100%',
      backgroundColor: '#f0f0f0'
    }}>
        <SduiLayoutRenderer document={document} components={getTitleComponents()} />
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'A Title component with a logo in the left section and navigation items in the right section. Demonstrates the three-section layout system.'
      }
    }
  }
}`,...ue.parameters?.docs?.source}}};pe.parameters={...pe.parameters,docs:{...pe.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'title-root',
        type: 'Title',
        children: [{
          id: 'title-left',
          type: 'TitleLeft',
          children: [{
            id: 'logo',
            type: 'TitleLogo',
            state: {
              src: logoSecondarySvg,
              alt: 'Company Logo'
            }
          }]
        }, {
          id: 'title-middle',
          type: 'TitleMiddle',
          children: [{
            id: 'search-container',
            type: 'Div',
            attributes: {
              className: 'flex items-center'
            },
            children: [{
              id: 'search-text',
              type: 'Div',
              attributes: {
                className: 'text-[var(--color-text-subtle)] text-sm'
              },
              state: {
                text: 'Search...'
              }
            }]
          }]
        }, {
          id: 'title-right',
          type: 'TitleRight',
          children: [{
            id: 'actions-container',
            type: 'Div',
            attributes: {
              className: 'flex items-center gap-2'
            },
            children: [{
              id: 'action-button-1',
              type: 'Div',
              attributes: {
                className: 'text-[var(--color-text-default)] cursor-pointer hover:opacity-80'
              },
              state: {
                text: 'Sign In'
              }
            }, {
              id: 'action-button-2',
              type: 'Div',
              attributes: {
                className: 'text-[var(--color-text-default)] cursor-pointer hover:opacity-80'
              },
              state: {
                text: 'Sign Up'
              }
            }]
          }]
        }]
      }
    };
    return <div style={{
      width: '100%',
      backgroundColor: '#f0f0f0'
    }}>
        <SduiLayoutRenderer document={document} components={getTitleComponents()} />
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'A complete Title component example using all three sections (left, middle, right). Shows how the component organizes content across the header.'
      }
    }
  }
}`,...pe.parameters?.docs?.source}}};fe.parameters={...fe.parameters,docs:{...fe.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'title-root',
        type: 'Title',
        children: [{
          id: 'title-left',
          type: 'TitleLeft',
          children: [{
            id: 'logo-secondary',
            type: 'TitleLogo',
            state: {
              src: logoSecondarySvg,
              alt: 'Secondary Logo'
            }
          }]
        }]
      }
    };
    return <div style={{
      width: '100%',
      backgroundColor: '#f0f0f0'
    }}>
        <SduiLayoutRenderer document={document} components={getTitleComponents()} />
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how multiple TitleLogo components can be used within the Title component. Each logo is independently configurable.'
      }
    }
  }
}`,...fe.parameters?.docs?.source}}};me.parameters={...me.parameters,docs:{...me.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'title-root',
        type: 'Title',
        children: [{
          id: 'title-left',
          type: 'TitleLeft',
          children: [{
            id: 'logo',
            type: 'TitleLogo',
            state: {
              src: logoSecondarySvg,
              alt: 'Company Logo'
            }
          }]
        }, {
          id: 'title-right',
          type: 'TitleRight',
          children: [{
            id: 'button-container',
            type: 'Div',
            attributes: {
              className: 'flex items-center gap-2'
            },
            children: []
          }]
        }]
      }
    };

    // Custom component to render buttons
    const ButtonContainer = ({
      id
    }: {
      id: string;
    }) => {
      return <div className="flex items-center gap-2">
          <Button buttonStyle="outline" buttonType="secondary" size="M">
            Sign In
          </Button>
          <Button buttonStyle="filled" buttonType="primary" size="M">
            Sign Up
          </Button>
        </div>;
    };
    const customComponents = {
      ...getTitleComponents(),
      ButtonContainer: () => <ButtonContainer id="button-container" />
    };

    // Update document to use ButtonContainer
    const updatedDocument: SduiLayoutDocument = {
      ...document,
      root: {
        ...document.root,
        children: [document.root.children![0], {
          id: 'title-right',
          type: 'TitleRight',
          children: [{
            id: 'button-container',
            type: 'ButtonContainer'
          }]
        }]
      }
    };
    return <div style={{
      width: '100%',
      backgroundColor: '#f0f0f0'
    }}>
        <SduiLayoutRenderer document={updatedDocument} components={customComponents} />
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how to integrate Button components within the Title component. Demonstrates extending the component map with custom components.'
      }
    }
  }
}`,...me.parameters?.docs?.source}}};ge.parameters={...ge.parameters,docs:{...ge.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'title-root',
        type: 'Title',
        children: [{
          id: 'title-left',
          type: 'TitleLeft',
          children: [{
            id: 'logo',
            type: 'TitleLogo',
            state: {
              src: logoSecondarySvg,
              alt: 'Company Logo'
            }
          }]
        }, {
          id: 'title-middle',
          type: 'TitleMiddle',
          children: [{
            id: 'middle-content',
            type: 'Div',
            attributes: {
              className: 'hidden md:flex items-center text-[var(--color-text-default)]'
            },
            state: {
              text: 'Middle Section (visible on medium screens and up)'
            }
          }]
        }, {
          id: 'title-right',
          type: 'TitleRight',
          children: [{
            id: 'right-content',
            type: 'Div',
            attributes: {
              className: 'flex items-center gap-2'
            },
            children: [{
              id: 'mobile-menu',
              type: 'Div',
              attributes: {
                className: 'md:hidden text-[var(--color-text-default)] cursor-pointer'
              },
              state: {
                text: '☰'
              }
            }, {
              id: 'desktop-nav',
              type: 'Div',
              attributes: {
                className: 'hidden md:flex items-center gap-4 text-[var(--color-text-default)]'
              },
              children: [{
                id: 'nav-1',
                type: 'Div',
                attributes: {
                  className: 'cursor-pointer hover:opacity-80'
                },
                state: {
                  text: 'Home'
                }
              }, {
                id: 'nav-2',
                type: 'Div',
                attributes: {
                  className: 'cursor-pointer hover:opacity-80'
                },
                state: {
                  text: 'About'
                }
              }]
            }]
          }]
        }]
      }
    };
    return <div style={{
      width: '100%',
      backgroundColor: '#f0f0f0'
    }}>
        <SduiLayoutRenderer document={document} components={getTitleComponents()} />
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the responsive behavior of the Title component. The component adapts its layout and padding based on screen size using Tailwind CSS breakpoints.'
      }
    }
  }
}`,...ge.parameters?.docs?.source}}};he.parameters={...he.parameters,docs:{...he.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'title-root',
        type: 'Title',
        children: []
      }
    };
    return <div style={{
      width: '100%',
      backgroundColor: '#f0f0f0'
    }}>
        <SduiLayoutRenderer document={document} components={getTitleComponents()} />
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'An empty Title component demonstrating the base structure and styling without any child components.'
      }
    }
  }
}`,...he.parameters?.docs?.source}}};const Gt=["Basic","WithNavigation","ThreeSections","MultipleLogos","WithButtons","Responsive","Empty"];export{le as Basic,he as Empty,fe as MultipleLogos,ge as Responsive,pe as ThreeSections,me as WithButtons,ue as WithNavigation,Gt as __namedExportsOrder,Ht as default};
