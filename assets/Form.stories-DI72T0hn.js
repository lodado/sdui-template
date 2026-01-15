import{j as R}from"./jsx-runtime-CV-d8Z6U.js";/* empty css               */import{R as F,r as er}from"./iframe-4wv0QjTe.js";import{T as ye}from"./TextField-BbtZpTE5.js";import{u as Tt,b as tr,S as rr,T as sr,D as nr,a as ue}from"./Text-CUOypVkr.js";import{B as ir}from"./ButtonContainer-C1_iceBo.js";import"./preload-helper-ggYluGXI.js";import"./index-LzdNk5us.js";import"./types-C_8bWqUB.js";var ve=e=>e.type==="checkbox",oe=e=>e instanceof Date,$=e=>e==null;const Nt=e=>typeof e=="object";var L=e=>!$(e)&&!Array.isArray(e)&&Nt(e)&&!oe(e),At=e=>L(e)&&e.target?ve(e.target)?e.target.checked:e.target.value:e,ar=e=>e.substring(0,e.search(/\.\d+(\.|$)/))||e,Ct=(e,r)=>e.has(ar(r)),or=e=>{const r=e.constructor&&e.constructor.prototype;return L(r)&&r.hasOwnProperty("isPrototypeOf")},We=typeof window<"u"&&typeof window.HTMLElement<"u"&&typeof document<"u";function P(e){if(e instanceof Date)return new Date(e);const r=typeof FileList<"u"&&e instanceof FileList;if(We&&(e instanceof Blob||r))return e;const t=Array.isArray(e);if(!t&&!(L(e)&&or(e)))return e;const s=t?[]:Object.create(Object.getPrototypeOf(e));for(const o in e)Object.prototype.hasOwnProperty.call(e,o)&&(s[o]=P(e[o]));return s}var Ee=e=>/^\w*$/.test(e),k=e=>e===void 0,He=e=>Array.isArray(e)?e.filter(Boolean):[],$e=e=>He(e.replace(/["|']|\]/g,"").split(/\.|\[/)),m=(e,r,t)=>{if(!r||!L(e))return t;const s=(Ee(r)?[r]:$e(r)).reduce((o,i)=>$(o)?o:o[i],e);return k(s)||s===e?k(e[r])?t:e[r]:s},K=e=>typeof e=="boolean",W=e=>typeof e=="function",A=(e,r,t)=>{let s=-1;const o=Ee(r)?[r]:$e(r),i=o.length,l=i-1;for(;++s<i;){const u=o[s];let b=t;if(s!==l){const g=e[u];b=L(g)||Array.isArray(g)?g:isNaN(+o[s+1])?{}:[]}if(u==="__proto__"||u==="constructor"||u==="prototype")return;e[u]=b,e=e[u]}};const Ne={BLUR:"blur",FOCUS_OUT:"focusout",CHANGE:"change"},Q={onBlur:"onBlur",onChange:"onChange",onSubmit:"onSubmit",onTouched:"onTouched",all:"all"},ne={max:"max",min:"min",maxLength:"maxLength",minLength:"minLength",pattern:"pattern",required:"required",validate:"validate"},Ze=F.createContext(null);Ze.displayName="HookFormContext";const ke=()=>F.useContext(Ze),lr=e=>{const{children:r,...t}=e;return F.createElement(Ze.Provider,{value:t},r)};var Et=(e,r,t,s=!0)=>{const o={defaultValues:r._defaultValues};for(const i in e)Object.defineProperty(o,i,{get:()=>{const l=i;return r._proxyFormState[l]!==Q.all&&(r._proxyFormState[l]=!s||Q.all),t&&(t[l]=!0),e[l]}});return o};const Ke=typeof window<"u"?F.useLayoutEffect:F.useEffect;function dr(e){const r=ke(),{control:t=r.control,disabled:s,name:o,exact:i}=e||{},[l,u]=F.useState(t._formState),b=F.useRef({isDirty:!1,isLoading:!1,dirtyFields:!1,touchedFields:!1,validatingFields:!1,isValidating:!1,isValid:!1,errors:!1});return Ke(()=>t._subscribe({name:o,formState:b.current,exact:i,callback:g=>{!s&&u({...t._formState,...g})}}),[o,s,i]),F.useEffect(()=>{b.current.isValid&&t._setValid(!0)},[t]),F.useMemo(()=>Et(l,t,b.current,!1),[l,t])}var G=e=>typeof e=="string",Be=(e,r,t,s,o)=>G(e)?(s&&r.watch.add(e),m(t,e,o)):Array.isArray(e)?e.map(i=>(s&&r.watch.add(i),m(t,i))):(s&&(r.watchAll=!0),t),Ue=e=>$(e)||!Nt(e);function ee(e,r,t=new WeakSet){if(Ue(e)||Ue(r))return Object.is(e,r);if(oe(e)&&oe(r))return Object.is(e.getTime(),r.getTime());const s=Object.keys(e),o=Object.keys(r);if(s.length!==o.length)return!1;if(t.has(e)||t.has(r))return!0;t.add(e),t.add(r);for(const i of s){const l=e[i];if(!o.includes(i))return!1;if(i!=="ref"){const u=r[i];if(oe(l)&&oe(u)||L(l)&&L(u)||Array.isArray(l)&&Array.isArray(u)?!ee(l,u,t):!Object.is(l,u))return!1}}return!0}function ur(e){const r=ke(),{control:t=r.control,name:s,defaultValue:o,disabled:i,exact:l,compute:u}=e||{},b=F.useRef(o),g=F.useRef(u),C=F.useRef(void 0),h=F.useRef(t),x=F.useRef(s);g.current=u;const[v,O]=F.useState(()=>{const _=t._getWatch(s,b.current);return g.current?g.current(_):_}),E=F.useCallback(_=>{const S=Be(s,t._names,_||t._formValues,!1,b.current);return g.current?g.current(S):S},[t._formValues,t._names,s]),I=F.useCallback(_=>{if(!i){const S=Be(s,t._names,_||t._formValues,!1,b.current);if(g.current){const H=g.current(S);ee(H,C.current)||(O(H),C.current=H)}else O(S)}},[t._formValues,t._names,i,s]);Ke(()=>((h.current!==t||!ee(x.current,s))&&(h.current=t,x.current=s,I()),t._subscribe({name:s,formState:{values:!0},exact:l,callback:_=>{I(_.values)}})),[t,l,s,I]),F.useEffect(()=>t._removeUnmounted());const q=h.current!==t,w=x.current,U=F.useMemo(()=>{if(i)return null;const _=!q&&!ee(w,s);return q||_?E():null},[i,q,s,w,E]);return U!==null?U:v}function cr(e){const r=ke(),{name:t,disabled:s,control:o=r.control,shouldUnregister:i,defaultValue:l,exact:u=!0}=e,b=Ct(o._names.array,t),g=F.useMemo(()=>m(o._formValues,t,m(o._defaultValues,t,l)),[o,t,l]),C=ur({control:o,name:t,defaultValue:g,exact:u}),h=dr({control:o,name:t,exact:u}),x=F.useRef(e),v=F.useRef(void 0),O=F.useRef(o.register(t,{...e.rules,value:C,...K(e.disabled)?{disabled:e.disabled}:{}}));x.current=e;const E=F.useMemo(()=>Object.defineProperties({},{invalid:{enumerable:!0,get:()=>!!m(h.errors,t)},isDirty:{enumerable:!0,get:()=>!!m(h.dirtyFields,t)},isTouched:{enumerable:!0,get:()=>!!m(h.touchedFields,t)},isValidating:{enumerable:!0,get:()=>!!m(h.validatingFields,t)},error:{enumerable:!0,get:()=>m(h.errors,t)}}),[h,t]),I=F.useCallback(_=>O.current.onChange({target:{value:At(_),name:t},type:Ne.CHANGE}),[t]),q=F.useCallback(()=>O.current.onBlur({target:{value:m(o._formValues,t),name:t},type:Ne.BLUR}),[t,o._formValues]),w=F.useCallback(_=>{const S=m(o._fields,t);S&&S._f&&_&&(S._f.ref={focus:()=>W(_.focus)&&_.focus(),select:()=>W(_.select)&&_.select(),setCustomValidity:H=>W(_.setCustomValidity)&&_.setCustomValidity(H),reportValidity:()=>W(_.reportValidity)&&_.reportValidity()})},[o._fields,t]),U=F.useMemo(()=>({name:t,value:C,...K(s)||h.disabled?{disabled:h.disabled||s}:{},onChange:I,onBlur:q,ref:w}),[t,s,h.disabled,I,q,w,C]);return F.useEffect(()=>{const _=o._options.shouldUnregister||i,S=v.current;S&&S!==t&&!b&&o.unregister(S),o.register(t,{...x.current.rules,...K(x.current.disabled)?{disabled:x.current.disabled}:{}});const H=(re,se)=>{const te=m(o._fields,re);te&&te._f&&(te._f.mount=se)};if(H(t,!0),_){const re=P(m(o._options.defaultValues,t,x.current.defaultValue));A(o._defaultValues,t,re),k(m(o._formValues,t))&&A(o._formValues,t,re)}return!b&&o.register(t),v.current=t,()=>{(b?_&&!o._state.action:_)?o.unregister(t):H(t,!1)}},[t,o,b,i]),F.useEffect(()=>{o._setDisabledField({disabled:s,name:t})},[s,t,o]),F.useMemo(()=>({field:U,formState:h,fieldState:E}),[U,h,E])}const fr=e=>e.render(cr(e));var Ge=(e,r,t,s,o)=>r?{...t[e],types:{...t[e]&&t[e].types?t[e].types:{},[s]:o||!0}}:{},be=e=>Array.isArray(e)?e:[e],ft=()=>{let e=[];return{get observers(){return e},next:o=>{for(const i of e)i.next&&i.next(o)},subscribe:o=>(e.push(o),{unsubscribe:()=>{e=e.filter(i=>i!==o)}}),unsubscribe:()=>{e=[]}}};function kt(e,r){const t={};for(const s in e)if(e.hasOwnProperty(s)){const o=e[s],i=r[s];if(o&&L(o)&&i){const l=kt(o,i);L(l)&&(t[s]=l)}else e[s]&&(t[s]=i)}return t}var X=e=>L(e)&&!Object.keys(e).length,Je=e=>e.type==="file",Ae=e=>{if(!We)return!1;const r=e?e.ownerDocument:0;return e instanceof(r&&r.defaultView?r.defaultView.HTMLElement:HTMLElement)},Rt=e=>e.type==="select-multiple",Ye=e=>e.type==="radio",mr=e=>Ye(e)||ve(e),Ie=e=>Ae(e)&&e.isConnected;function pr(e,r){const t=r.slice(0,-1).length;let s=0;for(;s<t;)e=k(e)?s++:e[r[s++]];return e}function yr(e){for(const r in e)if(e.hasOwnProperty(r)&&!k(e[r]))return!1;return!0}function j(e,r){const t=Array.isArray(r)?r:Ee(r)?[r]:$e(r),s=t.length===1?e:pr(e,t),o=t.length-1,i=t[o];return s&&delete s[i],o!==0&&(L(s)&&X(s)||Array.isArray(s)&&yr(s))&&j(e,t.slice(0,-1)),e}var hr=e=>{for(const r in e)if(W(e[r]))return!0;return!1};function Ot(e){return Array.isArray(e)||L(e)&&!hr(e)}function ze(e,r={}){for(const t in e){const s=e[t];Ot(s)?(r[t]=Array.isArray(s)?[]:{},ze(s,r[t])):k(s)||(r[t]=!0)}return r}function de(e,r,t){t||(t=ze(r));for(const s in e){const o=e[s];if(Ot(o))k(r)||Ue(t[s])?t[s]=ze(o,Array.isArray(o)?[]:{}):de(o,$(r)?{}:r[s],t[s]);else{const i=r[s];t[s]=!ee(o,i)}}return t}const mt={value:!1,isValid:!1},pt={value:!0,isValid:!0};var Pt=e=>{if(Array.isArray(e)){if(e.length>1){const r=e.filter(t=>t&&t.checked&&!t.disabled).map(t=>t.value);return{value:r,isValid:!!r.length}}return e[0].checked&&!e[0].disabled?e[0].attributes&&!k(e[0].attributes.value)?k(e[0].value)||e[0].value===""?pt:{value:e[0].value,isValid:!0}:pt:mt}return mt},jt=(e,{valueAsNumber:r,valueAsDate:t,setValueAs:s})=>k(e)?e:r?e===""?NaN:e&&+e:t&&G(e)?new Date(e):s?s(e):e;const yt={isValid:!1,value:null};var Lt=e=>Array.isArray(e)?e.reduce((r,t)=>t&&t.checked&&!t.disabled?{isValid:!0,value:t.value}:r,yt):yt;function ht(e){const r=e.ref;return Je(r)?r.files:Ye(r)?Lt(e.refs).value:Rt(r)?[...r.selectedOptions].map(({value:t})=>t):ve(r)?Pt(e.refs).value:jt(k(r.value)?e.ref.value:r.value,e)}var br=(e,r,t,s)=>{const o={};for(const i of e){const l=m(r,i);l&&A(o,i,l._f)}return{criteriaMode:t,names:[...e],fields:o,shouldUseNativeValidation:s}},Ce=e=>e instanceof RegExp,he=e=>k(e)?e:Ce(e)?e.source:L(e)?Ce(e.value)?e.value.source:e.value:e,bt=e=>({isOnSubmit:!e||e===Q.onSubmit,isOnBlur:e===Q.onBlur,isOnChange:e===Q.onChange,isOnAll:e===Q.all,isOnTouch:e===Q.onTouched});const gt="AsyncFunction";var gr=e=>!!e&&!!e.validate&&!!(W(e.validate)&&e.validate.constructor.name===gt||L(e.validate)&&Object.values(e.validate).find(r=>r.constructor.name===gt)),vr=e=>e.mount&&(e.required||e.min||e.max||e.maxLength||e.minLength||e.pattern||e.validate),vt=(e,r,t)=>!t&&(r.watchAll||r.watch.has(e)||[...r.watch].some(s=>e.startsWith(s)&&/^\.\w+/.test(e.slice(s.length))));const ge=(e,r,t,s)=>{for(const o of t||Object.keys(e)){const i=m(e,o);if(i){const{_f:l,...u}=i;if(l){if(l.refs&&l.refs[0]&&r(l.refs[0],o)&&!s)return!0;if(l.ref&&r(l.ref,l.name)&&!s)return!0;if(ge(u,r))break}else if(L(u)&&ge(u,r))break}}};function Ft(e,r,t){const s=m(e,t);if(s||Ee(t))return{error:s,name:t};const o=t.split(".");for(;o.length;){const i=o.join("."),l=m(r,i),u=m(e,i);if(l&&!Array.isArray(l)&&t!==i)return{name:t};if(u&&u.type)return{name:i,error:u};if(u&&u.root&&u.root.type)return{name:`${i}.root`,error:u.root};o.pop()}return{name:t}}var Fr=(e,r,t,s)=>{t(e);const{name:o,...i}=e;return X(i)||Object.keys(i).length>=Object.keys(r).length||Object.keys(i).find(l=>r[l]===(!s||Q.all))},xr=(e,r,t)=>!e||!r||e===r||be(e).some(s=>s&&(t?s===r:s.startsWith(r)||r.startsWith(s))),wr=(e,r,t,s,o)=>o.isOnAll?!1:!t&&o.isOnTouch?!(r||e):(t?s.isOnBlur:o.isOnBlur)?!e:(t?s.isOnChange:o.isOnChange)?e:!0,_r=(e,r)=>!He(m(e,r)).length&&j(e,r),Vr=(e,r,t)=>{const s=be(m(e,t));return A(s,"root",r[t]),A(e,t,s),e};function xt(e,r,t="validate"){if(G(e)||Array.isArray(e)&&e.every(G)||K(e)&&!e)return{type:t,message:G(e)?e:"",ref:r}}var le=e=>L(e)&&!Ce(e)?e:{value:e,message:""},wt=async(e,r,t,s,o,i)=>{const{ref:l,refs:u,required:b,maxLength:g,minLength:C,min:h,max:x,pattern:v,validate:O,name:E,valueAsNumber:I,mount:q}=e._f,w=m(t,E);if(!q||r.has(E))return{};const U=u?u[0]:l,_=V=>{o&&U.reportValidity&&(U.setCustomValidity(K(V)?"":V||""),U.reportValidity())},S={},H=Ye(l),re=ve(l),se=H||re,te=(I||Je(l))&&k(l.value)&&k(w)||Ae(l)&&l.value===""||w===""||Array.isArray(w)&&!w.length,J=Ge.bind(null,E,s,S),Fe=(V,D,M,B=ne.maxLength,Y=ne.minLength)=>{const Z=V?D:M;S[E]={type:V?B:Y,message:Z,ref:l,...J(V?B:Y,Z)}};if(i?!Array.isArray(w)||!w.length:b&&(!se&&(te||$(w))||K(w)&&!w||re&&!Pt(u).isValid||H&&!Lt(u).isValid)){const{value:V,message:D}=G(b)?{value:!!b,message:b}:le(b);if(V&&(S[E]={type:ne.required,message:D,ref:U,...J(ne.required,D)},!s))return _(D),S}if(!te&&(!$(h)||!$(x))){let V,D;const M=le(x),B=le(h);if(!$(w)&&!isNaN(w)){const Y=l.valueAsNumber||w&&+w;$(M.value)||(V=Y>M.value),$(B.value)||(D=Y<B.value)}else{const Y=l.valueAsDate||new Date(w),Z=pe=>new Date(new Date().toDateString()+" "+pe),fe=l.type=="time",me=l.type=="week";G(M.value)&&w&&(V=fe?Z(w)>Z(M.value):me?w>M.value:Y>new Date(M.value)),G(B.value)&&w&&(D=fe?Z(w)<Z(B.value):me?w<B.value:Y<new Date(B.value))}if((V||D)&&(Fe(!!V,M.message,B.message,ne.max,ne.min),!s))return _(S[E].message),S}if((g||C)&&!te&&(G(w)||i&&Array.isArray(w))){const V=le(g),D=le(C),M=!$(V.value)&&w.length>+V.value,B=!$(D.value)&&w.length<+D.value;if((M||B)&&(Fe(M,V.message,D.message),!s))return _(S[E].message),S}if(v&&!te&&G(w)){const{value:V,message:D}=le(v);if(Ce(V)&&!w.match(V)&&(S[E]={type:ne.pattern,message:D,ref:l,...J(ne.pattern,D)},!s))return _(D),S}if(O){if(W(O)){const V=await O(w,t),D=xt(V,U);if(D&&(S[E]={...D,...J(ne.validate,D.message)},!s))return _(D.message),S}else if(L(O)){let V={};for(const D in O){if(!X(V)&&!s)break;const M=xt(await O[D](w,t),U,D);M&&(V={...M,...J(D,M.message)},_(M.message),s&&(S[E]=V))}if(!X(V)&&(S[E]={ref:U,...V},!s))return S}}return _(!0),S};const Sr={mode:Q.onSubmit,reValidateMode:Q.onChange,shouldFocusError:!0};function Dr(e={}){let r={...Sr,...e},t={submitCount:0,isDirty:!1,isReady:!1,isLoading:W(r.defaultValues),isValidating:!1,isSubmitted:!1,isSubmitting:!1,isSubmitSuccessful:!1,isValid:!1,touchedFields:{},dirtyFields:{},validatingFields:{},errors:r.errors||{},disabled:r.disabled||!1},s={},o=L(r.defaultValues)||L(r.values)?P(r.defaultValues||r.values)||{}:{},i=r.shouldUnregister?{}:P(o),l={action:!1,mount:!1,watch:!1,keepIsValid:!1},u={mount:new Set,disabled:new Set,unMount:new Set,array:new Set,watch:new Set},b,g=0;const C={isDirty:!1,dirtyFields:!1,validatingFields:!1,touchedFields:!1,isValidating:!1,isValid:!1,errors:!1},h={...C};let x={...h};const v={array:ft(),state:ft()},O=r.criteriaMode===Q.all,E=n=>a=>{clearTimeout(g),g=setTimeout(n,a)},I=async n=>{if(!l.keepIsValid&&!r.disabled&&(h.isValid||x.isValid||n)){let a;r.resolver?(a=X((await se()).errors),q()):a=await J(s,!0),a!==t.isValid&&v.state.next({isValid:a})}},q=(n,a)=>{!r.disabled&&(h.isValidating||h.validatingFields||x.isValidating||x.validatingFields)&&((n||Array.from(u.mount)).forEach(d=>{d&&(a?A(t.validatingFields,d,a):j(t.validatingFields,d))}),v.state.next({validatingFields:t.validatingFields,isValidating:!X(t.validatingFields)}))},w=(n,a=[],d,p,f=!0,c=!0)=>{if(p&&d&&!r.disabled){if(l.action=!0,c&&Array.isArray(m(s,n))){const y=d(m(s,n),p.argA,p.argB);f&&A(s,n,y)}if(c&&Array.isArray(m(t.errors,n))){const y=d(m(t.errors,n),p.argA,p.argB);f&&A(t.errors,n,y),_r(t.errors,n)}if((h.touchedFields||x.touchedFields)&&c&&Array.isArray(m(t.touchedFields,n))){const y=d(m(t.touchedFields,n),p.argA,p.argB);f&&A(t.touchedFields,n,y)}(h.dirtyFields||x.dirtyFields)&&(t.dirtyFields=de(o,i)),v.state.next({name:n,isDirty:V(n,a),dirtyFields:t.dirtyFields,errors:t.errors,isValid:t.isValid})}else A(i,n,a)},U=(n,a)=>{A(t.errors,n,a),v.state.next({errors:t.errors})},_=n=>{t.errors=n,v.state.next({errors:t.errors,isValid:!1})},S=(n,a,d,p)=>{const f=m(s,n);if(f){const c=m(i,n,k(d)?m(o,n):d);k(c)||p&&p.defaultChecked||a?A(i,n,a?c:ht(f._f)):B(n,c),l.mount&&!l.action&&I()}},H=(n,a,d,p,f)=>{let c=!1,y=!1;const T={name:n};if(!r.disabled){if(!d||p){(h.isDirty||x.isDirty)&&(y=t.isDirty,t.isDirty=T.isDirty=V(),c=y!==T.isDirty);const N=ee(m(o,n),a);y=!!m(t.dirtyFields,n),N?j(t.dirtyFields,n):A(t.dirtyFields,n,!0),T.dirtyFields=t.dirtyFields,c=c||(h.dirtyFields||x.dirtyFields)&&y!==!N}if(d){const N=m(t.touchedFields,n);N||(A(t.touchedFields,n,d),T.touchedFields=t.touchedFields,c=c||(h.touchedFields||x.touchedFields)&&N!==d)}c&&f&&v.state.next(T)}return c?T:{}},re=(n,a,d,p)=>{const f=m(t.errors,n),c=(h.isValid||x.isValid)&&K(a)&&t.isValid!==a;if(r.delayError&&d?(b=E(()=>U(n,d)),b(r.delayError)):(clearTimeout(g),b=null,d?A(t.errors,n,d):j(t.errors,n)),(d?!ee(f,d):f)||!X(p)||c){const y={...p,...c&&K(a)?{isValid:a}:{},errors:t.errors,name:n};t={...t,...y},v.state.next(y)}},se=async n=>(q(n,!0),await r.resolver(i,r.context,br(n||u.mount,s,r.criteriaMode,r.shouldUseNativeValidation))),te=async n=>{const{errors:a}=await se(n);if(q(n),n)for(const d of n){const p=m(a,d);p?A(t.errors,d,p):j(t.errors,d)}else t.errors=a;return a},J=async(n,a,d={valid:!0})=>{for(const p in n){const f=n[p];if(f){const{_f:c,...y}=f;if(c){const T=u.array.has(c.name),N=f._f&&gr(f._f);N&&h.validatingFields&&q([c.name],!0);const z=await wt(f,u.disabled,i,O,r.shouldUseNativeValidation&&!a,T);if(N&&h.validatingFields&&q([c.name]),z[c.name]&&(d.valid=!1,a||e.shouldUseNativeValidation))break;!a&&(m(z,c.name)?T?Vr(t.errors,z,c.name):A(t.errors,c.name,z[c.name]):j(t.errors,c.name))}!X(y)&&await J(y,a,d)}}return d.valid},Fe=()=>{for(const n of u.unMount){const a=m(s,n);a&&(a._f.refs?a._f.refs.every(d=>!Ie(d)):!Ie(a._f.ref))&&Pe(n)}u.unMount=new Set},V=(n,a)=>!r.disabled&&(n&&a&&A(i,n,a),!ee(tt(),o)),D=(n,a,d)=>Be(n,u,{...l.mount?i:k(a)?o:G(n)?{[n]:a}:a},d,a),M=n=>He(m(l.mount?i:o,n,r.shouldUnregister?m(o,n,[]):[])),B=(n,a,d={})=>{const p=m(s,n);let f=a;if(p){const c=p._f;c&&(!c.disabled&&A(i,n,jt(a,c)),f=Ae(c.ref)&&$(a)?"":a,Rt(c.ref)?[...c.ref.options].forEach(y=>y.selected=f.includes(y.value)):c.refs?ve(c.ref)?c.refs.forEach(y=>{(!y.defaultChecked||!y.disabled)&&(Array.isArray(f)?y.checked=!!f.find(T=>T===y.value):y.checked=f===y.value||!!f)}):c.refs.forEach(y=>y.checked=y.value===f):Je(c.ref)?c.ref.value="":(c.ref.value=f,c.ref.type||v.state.next({name:n,values:P(i)})))}(d.shouldDirty||d.shouldTouch)&&H(n,f,d.shouldTouch,d.shouldDirty,!0),d.shouldValidate&&pe(n)},Y=(n,a,d)=>{for(const p in a){if(!a.hasOwnProperty(p))return;const f=a[p],c=n+"."+p,y=m(s,c);(u.array.has(n)||L(f)||y&&!y._f)&&!oe(f)?Y(c,f,d):B(c,f,d)}},Z=(n,a,d={})=>{const p=m(s,n),f=u.array.has(n),c=P(a);A(i,n,c),f?(v.array.next({name:n,values:P(i)}),(h.isDirty||h.dirtyFields||x.isDirty||x.dirtyFields)&&d.shouldDirty&&v.state.next({name:n,dirtyFields:de(o,i),isDirty:V(n,c)})):p&&!p._f&&!$(c)?Y(n,c,d):B(n,c,d),vt(n,u)?v.state.next({...t,name:n,values:P(i)}):v.state.next({name:l.mount?n:void 0,values:P(i)})},fe=async n=>{l.mount=!0;const a=n.target;let d=a.name,p=!0;const f=m(s,d),c=N=>{p=Number.isNaN(N)||oe(N)&&isNaN(N.getTime())||ee(N,m(i,d,N))},y=bt(r.mode),T=bt(r.reValidateMode);if(f){let N,z;const ae=a.type?ht(f._f):At(n),ie=n.type===Ne.BLUR||n.type===Ne.FOCUS_OUT,Jt=!vr(f._f)&&!r.resolver&&!m(t.errors,d)&&!f._f.deps||wr(ie,m(t.touchedFields,d),t.isSubmitted,T,y),qe=vt(d,u,ie);A(i,d,ae),ie?(!a||!a.readOnly)&&(f._f.onBlur&&f._f.onBlur(n),b&&b(0)):f._f.onChange&&f._f.onChange(n);const Me=H(d,ae,ie),Yt=!X(Me)||qe;if(!ie&&v.state.next({name:d,type:n.type,values:P(i)}),Jt)return(h.isValid||x.isValid)&&(r.mode==="onBlur"?ie&&I():ie||I()),Yt&&v.state.next({name:d,...qe?{}:Me});if(!ie&&qe&&v.state.next({...t}),r.resolver){const{errors:ut}=await se([d]);if(q([d]),c(ae),p){const Qt=Ft(t.errors,s,d),ct=Ft(ut,s,Qt.name||d);N=ct.error,d=ct.name,z=X(ut)}}else q([d],!0),N=(await wt(f,u.disabled,i,O,r.shouldUseNativeValidation))[d],q([d]),c(ae),p&&(N?z=!1:(h.isValid||x.isValid)&&(z=await J(s,!0)));p&&(f._f.deps&&(!Array.isArray(f._f.deps)||f._f.deps.length>0)&&pe(f._f.deps),re(d,z,N,Me))}},me=(n,a)=>{if(m(t.errors,a)&&n.focus)return n.focus(),1},pe=async(n,a={})=>{let d,p;const f=be(n);if(r.resolver){const c=await te(k(n)?n:f);d=X(c),p=n?!f.some(y=>m(c,y)):d}else n?(p=(await Promise.all(f.map(async c=>{const y=m(s,c);return await J(y&&y._f?{[c]:y}:y)}))).every(Boolean),!(!p&&!t.isValid)&&I()):p=d=await J(s);return v.state.next({...!G(n)||(h.isValid||x.isValid)&&d!==t.isValid?{}:{name:n},...r.resolver||!n?{isValid:d}:{},errors:t.errors}),a.shouldFocus&&!p&&ge(s,me,n?f:u.mount),p},tt=(n,a)=>{let d={...l.mount?i:o};return a&&(d=kt(a.dirtyFields?t.dirtyFields:t.touchedFields,d)),k(n)?d:G(n)?m(d,n):n.map(p=>m(d,p))},rt=(n,a)=>({invalid:!!m((a||t).errors,n),isDirty:!!m((a||t).dirtyFields,n),error:m((a||t).errors,n),isValidating:!!m(t.validatingFields,n),isTouched:!!m((a||t).touchedFields,n)}),Xt=n=>{n&&be(n).forEach(a=>j(t.errors,a)),v.state.next({errors:n?t.errors:{}})},st=(n,a,d)=>{const p=(m(s,n,{_f:{}})._f||{}).ref,f=m(t.errors,n)||{},{ref:c,message:y,type:T,...N}=f;A(t.errors,n,{...N,...a,ref:p}),v.state.next({name:n,errors:t.errors,isValid:!1}),d&&d.shouldFocus&&p&&p.focus&&p.focus()},Wt=(n,a)=>W(n)?v.state.subscribe({next:d=>"values"in d&&n(D(void 0,a),d)}):D(n,a,!0),nt=n=>v.state.subscribe({next:a=>{xr(n.name,a.name,n.exact)&&Fr(a,n.formState||h,Gt,n.reRenderRoot)&&n.callback({values:{...i},...t,...a,defaultValues:o})}}).unsubscribe,Ht=n=>(l.mount=!0,x={...x,...n.formState},nt({...n,formState:{...C,...n.formState}})),Pe=(n,a={})=>{for(const d of n?be(n):u.mount)u.mount.delete(d),u.array.delete(d),a.keepValue||(j(s,d),j(i,d)),!a.keepError&&j(t.errors,d),!a.keepDirty&&j(t.dirtyFields,d),!a.keepTouched&&j(t.touchedFields,d),!a.keepIsValidating&&j(t.validatingFields,d),!r.shouldUnregister&&!a.keepDefaultValue&&j(o,d);v.state.next({values:P(i)}),v.state.next({...t,...a.keepDirty?{isDirty:V()}:{}}),!a.keepIsValid&&I()},it=({disabled:n,name:a})=>{(K(n)&&l.mount||n||u.disabled.has(a))&&(n?u.disabled.add(a):u.disabled.delete(a))},je=(n,a={})=>{let d=m(s,n);const p=K(a.disabled)||K(r.disabled);return A(s,n,{...d||{},_f:{...d&&d._f?d._f:{ref:{name:n}},name:n,mount:!0,...a}}),u.mount.add(n),d?it({disabled:K(a.disabled)?a.disabled:r.disabled,name:n}):S(n,!0,a.value),{...p?{disabled:a.disabled||r.disabled}:{},...r.progressive?{required:!!a.required,min:he(a.min),max:he(a.max),minLength:he(a.minLength),maxLength:he(a.maxLength),pattern:he(a.pattern)}:{},name:n,onChange:fe,onBlur:fe,ref:f=>{if(f){je(n,a),d=m(s,n);const c=k(f.value)&&f.querySelectorAll&&f.querySelectorAll("input,select,textarea")[0]||f,y=mr(c),T=d._f.refs||[];if(y?T.find(N=>N===c):c===d._f.ref)return;A(s,n,{_f:{...d._f,...y?{refs:[...T.filter(Ie),c,...Array.isArray(m(o,n))?[{}]:[]],ref:{type:c.type,name:n}}:{ref:c}}}),S(n,!1,void 0,c)}else d=m(s,n,{}),d._f&&(d._f.mount=!1),(r.shouldUnregister||a.shouldUnregister)&&!(Ct(u.array,n)&&l.action)&&u.unMount.add(n)}}},Le=()=>r.shouldFocusError&&ge(s,me,u.mount),$t=n=>{K(n)&&(v.state.next({disabled:n}),ge(s,(a,d)=>{const p=m(s,d);p&&(a.disabled=p._f.disabled||n,Array.isArray(p._f.refs)&&p._f.refs.forEach(f=>{f.disabled=p._f.disabled||n}))},0,!1))},at=(n,a)=>async d=>{let p;d&&(d.preventDefault&&d.preventDefault(),d.persist&&d.persist());let f=P(i);if(v.state.next({isSubmitting:!0}),r.resolver){const{errors:c,values:y}=await se();q(),t.errors=c,f=P(y)}else await J(s);if(u.disabled.size)for(const c of u.disabled)j(f,c);if(j(t.errors,"root"),X(t.errors)){v.state.next({errors:{}});try{await n(f,d)}catch(c){p=c}}else a&&await a({...t.errors},d),Le(),setTimeout(Le);if(v.state.next({isSubmitted:!0,isSubmitting:!1,isSubmitSuccessful:X(t.errors)&&!p,submitCount:t.submitCount+1,errors:t.errors}),p)throw p},Zt=(n,a={})=>{m(s,n)&&(k(a.defaultValue)?Z(n,P(m(o,n))):(Z(n,a.defaultValue),A(o,n,P(a.defaultValue))),a.keepTouched||j(t.touchedFields,n),a.keepDirty||(j(t.dirtyFields,n),t.isDirty=a.defaultValue?V(n,P(m(o,n))):V()),a.keepError||(j(t.errors,n),h.isValid&&I()),v.state.next({...t}))},ot=(n,a={})=>{const d=n?P(n):o,p=P(d),f=X(n),c=f?o:p;if(a.keepDefaultValues||(o=d),!a.keepValues){if(a.keepDirtyValues){const y=new Set([...u.mount,...Object.keys(de(o,i))]);for(const T of Array.from(y)){const N=m(t.dirtyFields,T),z=m(i,T),ae=m(c,T);N&&!k(z)?A(c,T,z):!N&&!k(ae)&&Z(T,ae)}}else{if(We&&k(n))for(const y of u.mount){const T=m(s,y);if(T&&T._f){const N=Array.isArray(T._f.refs)?T._f.refs[0]:T._f.ref;if(Ae(N)){const z=N.closest("form");if(z){z.reset();break}}}}if(a.keepFieldsRef)for(const y of u.mount)Z(y,m(c,y));else s={}}i=r.shouldUnregister?a.keepDefaultValues?P(o):{}:P(c),v.array.next({values:{...c}}),v.state.next({values:{...c}})}u={mount:a.keepDirtyValues?u.mount:new Set,unMount:new Set,array:new Set,disabled:new Set,watch:new Set,watchAll:!1,focus:""},l.mount=!h.isValid||!!a.keepIsValid||!!a.keepDirtyValues||!r.shouldUnregister&&!X(c),l.watch=!!r.shouldUnregister,l.keepIsValid=!!a.keepIsValid,l.action=!1,a.keepErrors||(t.errors={}),v.state.next({submitCount:a.keepSubmitCount?t.submitCount:0,isDirty:f?!1:a.keepDirty?t.isDirty:!!(a.keepDefaultValues&&!ee(n,o)),isSubmitted:a.keepIsSubmitted?t.isSubmitted:!1,dirtyFields:f?{}:a.keepDirtyValues?a.keepDefaultValues&&i?de(o,i):t.dirtyFields:a.keepDefaultValues&&n?de(o,n):a.keepDirty?t.dirtyFields:{},touchedFields:a.keepTouched?t.touchedFields:{},errors:a.keepErrors?t.errors:{},isSubmitSuccessful:a.keepIsSubmitSuccessful?t.isSubmitSuccessful:!1,isSubmitting:!1,defaultValues:o})},lt=(n,a)=>ot(W(n)?n(i):n,{...r.resetOptions,...a}),Kt=(n,a={})=>{const d=m(s,n),p=d&&d._f;if(p){const f=p.refs?p.refs[0]:p.ref;f.focus&&setTimeout(()=>{f.focus(),a.shouldSelect&&W(f.select)&&f.select()})}},Gt=n=>{t={...t,...n}},dt={control:{register:je,unregister:Pe,getFieldState:rt,handleSubmit:at,setError:st,_subscribe:nt,_runSchema:se,_updateIsValidating:q,_focusError:Le,_getWatch:D,_getDirty:V,_setValid:I,_setFieldArray:w,_setDisabledField:it,_setErrors:_,_getFieldArray:M,_reset:ot,_resetDefaultValues:()=>W(r.defaultValues)&&r.defaultValues().then(n=>{lt(n,r.resetOptions),v.state.next({isLoading:!1})}),_removeUnmounted:Fe,_disableForm:$t,_subjects:v,_proxyFormState:h,get _fields(){return s},get _formValues(){return i},get _state(){return l},set _state(n){l=n},get _defaultValues(){return o},get _names(){return u},set _names(n){u=n},get _formState(){return t},get _options(){return r},set _options(n){r={...r,...n}}},subscribe:Ht,trigger:pe,register:je,handleSubmit:at,watch:Wt,setValue:Z,getValues:tt,reset:lt,resetField:Zt,clearErrors:Xt,unregister:Pe,setError:st,setFocus:Kt,getFieldState:rt};return{...dt,formControl:dt}}function Tr(e={}){const r=F.useRef(void 0),t=F.useRef(void 0),[s,o]=F.useState({isDirty:!1,isValidating:!1,isLoading:W(e.defaultValues),isSubmitted:!1,isSubmitting:!1,isSubmitSuccessful:!1,isValid:!1,submitCount:0,dirtyFields:{},touchedFields:{},validatingFields:{},errors:e.errors||{},disabled:e.disabled||!1,isReady:!1,defaultValues:W(e.defaultValues)?void 0:e.defaultValues});if(!r.current)if(e.formControl)r.current={...e.formControl,formState:s},e.defaultValues&&!W(e.defaultValues)&&e.formControl.reset(e.defaultValues,e.resetOptions);else{const{formControl:l,...u}=Dr(e);r.current={...u,formState:s}}const i=r.current.control;return i._options=e,Ke(()=>{const l=i._subscribe({formState:i._proxyFormState,callback:()=>o({...i._formState}),reRenderRoot:!0});return o(u=>({...u,isReady:!0})),i._formState.isReady=!0,l},[i]),F.useEffect(()=>i._disableForm(e.disabled),[i,e.disabled]),F.useEffect(()=>{e.mode&&(i._options.mode=e.mode),e.reValidateMode&&(i._options.reValidateMode=e.reValidateMode)},[i,e.mode,e.reValidateMode]),F.useEffect(()=>{e.errors&&(i._setErrors(e.errors),i._focusError())},[i,e.errors]),F.useEffect(()=>{e.shouldUnregister&&i._subjects.state.next({values:i._getWatch()})},[i,e.shouldUnregister]),F.useEffect(()=>{if(i._proxyFormState.isDirty){const l=i._getDirty();l!==s.isDirty&&i._subjects.state.next({isDirty:l})}},[i,s.isDirty]),F.useEffect(()=>{var l;e.values&&!ee(e.values,t.current)?(i._reset(e.values,{keepFieldsRef:!0,...i._options.resetOptions}),!((l=i._options.resetOptions)===null||l===void 0)&&l.keepIsValid||i._setValid(),t.current=e.values,o(u=>({...u}))):i._resetDefaultValues()},[i,e.values]),F.useEffect(()=>{i._state.mount||(i._setValid(),i._state.mount=!0),i._state.watch&&(i._state.watch=!1,i._subjects.state.next({...i._formState})),i._removeUnmounted()}),r.current.formState=Et(s,i),r.current}const _t=(e,r,t)=>{if(e&&"reportValidity"in e){const s=m(t,r);e.setCustomValidity(s&&s.message||""),e.reportValidity()}},Xe=(e,r)=>{for(const t in r.fields){const s=r.fields[t];s&&s.ref&&"reportValidity"in s.ref?_t(s.ref,t,e):s&&s.refs&&s.refs.forEach(o=>_t(o,t,e))}},Vt=(e,r)=>{r.shouldUseNativeValidation&&Xe(e,r);const t={};for(const s in e){const o=m(r.fields,s),i=Object.assign(e[s]||{},{ref:o&&o.ref});if(Nr(r.names||Object.keys(e),s)){const l=Object.assign({},m(t,s));A(l,"root",i),A(t,s,l)}else A(t,s,i)}return t},Nr=(e,r)=>{const t=St(r);return e.some(s=>St(s).match(`^${t}\\.\\d+`))};function St(e){return e.replace(/\]|\[/g,"")}function qt(e,r,t){function s(u,b){if(u._zod||Object.defineProperty(u,"_zod",{value:{def:b,constr:l,traits:new Set},enumerable:!1}),u._zod.traits.has(e))return;u._zod.traits.add(e),r(u,b);const g=l.prototype,C=Object.keys(g);for(let h=0;h<C.length;h++){const x=C[h];x in u||(u[x]=g[x].bind(u))}}const o=t?.Parent??Object;class i extends o{}Object.defineProperty(i,"name",{value:e});function l(u){var b;const g=t?.Parent?new i:this;s(g,u),(b=g._zod).deferred??(b.deferred=[]);for(const C of g._zod.deferred)C();return g}return Object.defineProperty(l,"init",{value:s}),Object.defineProperty(l,Symbol.hasInstance,{value:u=>t?.Parent&&u instanceof t.Parent?!0:u?._zod?.traits?.has(e)}),Object.defineProperty(l,"name",{value:e}),l}class Ar extends Error{constructor(){super("Encountered Promise during synchronous parse. Use .parseAsync() instead.")}}const Cr={};function Mt(e){return Cr}function Er(e,r){return typeof r=="bigint"?r.toString():r}const It="captureStackTrace"in Error?Error.captureStackTrace:(...e)=>{};function xe(e){return typeof e=="string"?e:e?.message}function Bt(e,r,t){const s={...e,path:e.path??[]};if(!e.message){const o=xe(e.inst?._zod.def?.error?.(e))??xe(r?.error?.(e))??xe(t.customError?.(e))??xe(t.localeError?.(e))??"Invalid input";s.message=o}return delete s.inst,delete s.continue,r?.reportInput||delete s.input,s}const Ut=(e,r)=>{e.name="$ZodError",Object.defineProperty(e,"_zod",{value:e._zod,enumerable:!1}),Object.defineProperty(e,"issues",{value:r,enumerable:!1}),e.message=JSON.stringify(r,Er,2),Object.defineProperty(e,"toString",{value:()=>e.message,enumerable:!1})},kr=qt("$ZodError",Ut),zt=qt("$ZodError",Ut,{Parent:Error}),Rr=e=>(r,t,s,o)=>{const i=s?Object.assign(s,{async:!1}):{async:!1},l=r._zod.run({value:t,issues:[]},i);if(l instanceof Promise)throw new Ar;if(l.issues.length){const u=new(o?.Err??e)(l.issues.map(b=>Bt(b,i,Mt())));throw It(u,o?.callee),u}return l.value},Or=Rr(zt),Pr=e=>async(r,t,s,o)=>{const i=s?Object.assign(s,{async:!0}):{async:!0};let l=r._zod.run({value:t,issues:[]},i);if(l instanceof Promise&&(l=await l),l.issues.length){const u=new(o?.Err??e)(l.issues.map(b=>Bt(b,i,Mt())));throw It(u,o?.callee),u}return l.value},jr=Pr(zt);function Dt(e,r){try{var t=e()}catch(s){return r(s)}return t&&t.then?t.then(void 0,r):t}function Lr(e,r){for(var t={};e.length;){var s=e[0],o=s.code,i=s.message,l=s.path.join(".");if(!t[l])if("unionErrors"in s){var u=s.unionErrors[0].errors[0];t[l]={message:u.message,type:u.code}}else t[l]={message:i,type:o};if("unionErrors"in s&&s.unionErrors.forEach(function(C){return C.errors.forEach(function(h){return e.push(h)})}),r){var b=t[l].types,g=b&&b[s.code];t[l]=Ge(l,r,t,o,g?[].concat(g,s.message):s.message)}e.shift()}return t}function qr(e,r){for(var t={};e.length;){var s=e[0],o=s.code,i=s.message,l=s.path.join(".");if(!t[l])if(s.code==="invalid_union"&&s.errors.length>0){var u=s.errors[0][0];t[l]={message:u.message,type:u.code}}else t[l]={message:i,type:o};if(s.code==="invalid_union"&&s.errors.forEach(function(C){return C.forEach(function(h){return e.push(h)})}),r){var b=t[l].types,g=b&&b[s.code];t[l]=Ge(l,r,t,o,g?[].concat(g,s.message):s.message)}e.shift()}return t}function Mr(e,r,t){if(t===void 0&&(t={}),(function(s){return"_def"in s&&typeof s._def=="object"&&"typeName"in s._def})(e))return function(s,o,i){try{return Promise.resolve(Dt(function(){return Promise.resolve(e[t.mode==="sync"?"parse":"parseAsync"](s,r)).then(function(l){return i.shouldUseNativeValidation&&Xe({},i),{errors:{},values:t.raw?Object.assign({},s):l}})},function(l){if((function(u){return Array.isArray(u?.issues)})(l))return{values:{},errors:Vt(Lr(l.errors,!i.shouldUseNativeValidation&&i.criteriaMode==="all"),i)};throw l}))}catch(l){return Promise.reject(l)}};if((function(s){return"_zod"in s&&typeof s._zod=="object"})(e))return function(s,o,i){try{return Promise.resolve(Dt(function(){return Promise.resolve((t.mode==="sync"?Or:jr)(e,s,r)).then(function(l){return i.shouldUseNativeValidation&&Xe({},i),{errors:{},values:t.raw?Object.assign({},s):l}})},function(l){if((function(u){return u instanceof kr})(l))return{values:{},errors:Vt(qr(l.issues,!i.shouldUseNativeValidation&&i.criteriaMode==="all"),i)};throw l}))}catch(l){return Promise.reject(l)}};throw new Error("Invalid input: not a Zod schema")}const Ir=er.createContext(null),Re=({name:e,label:r,helpMessage:t,required:s=!1,disabled:o=!1,type:i,placeholder:l,inputProps:u={},...b})=>{const{control:g,formState:{errors:C}}=ke(),h=e,x=C[h],v=x?.message;return R.jsx(fr,{control:g,name:h,render:({field:O})=>R.jsx(ye,{...b,error:!!x,errorMessage:v,helpMessage:t,required:s,disabled:o,children:R.jsxs(ye.Wrapper,{children:[r&&R.jsx(ye.Label,{children:r}),R.jsx(ye.Input,{...u,...O,type:i??u?.type??"text",placeholder:l??u?.placeholder,value:O.value??"",onChange:E=>{O.onChange(E),u?.onChange&&u.onChange(E)},onBlur:E=>{O.onBlur(),u?.onBlur&&u.onBlur(E)}}),R.jsx(ye.HelpMessage,{})]})})})};Re.displayName="Form.Field";const Qe=({id:e})=>{const{attributes:r}=Tt({nodeId:e}),t=r?.name,s=r?.label,o=r?.helpMessage,i=r?.required,l=r?.disabled,u=r?.type,b=r?.placeholder,g=r?.inputProps,C=r?.className;return t?R.jsx(Re,{name:t,label:s,helpMessage:o,required:i,disabled:l,type:u,placeholder:b,inputProps:g,className:C}):(console.warn(`FormField with id "${e}" is missing name attribute`),null)};Qe.displayName="FormFieldContainer";Qe.__docgenInfo={description:"",methods:[],displayName:"FormFieldContainer",props:{id:{required:!0,tsType:{name:"string"},description:""}}};Re.__docgenInfo={description:`FormField Component

@description
Form field component that integrates TextField with react-hook-form.
Automatically handles validation, error display, and form state.

@example
\`\`\`tsx
<Form.Field
  name="email"
  label="Email"
  required
  inputProps={{
    type: 'email',
    placeholder: 'Enter your email',
  }}
/>
\`\`\``,methods:[],displayName:"Form.Field",props:{name:{required:!0,tsType:{name:"intersection",raw:"keyof TFieldValues & string",elements:[{name:"TFieldValues"},{name:"string"}]},description:"Field name in form values"},label:{required:!1,tsType:{name:"string"},description:"Field label"},helpMessage:{required:!1,tsType:{name:"string"},description:"Help message (displayed when no error)"},required:{required:!1,tsType:{name:"boolean"},description:"Required field indicator",defaultValue:{value:"false",computed:!1}},disabled:{required:!1,tsType:{name:"boolean"},description:"Disabled state",defaultValue:{value:"false",computed:!1}},inputProps:{required:!1,tsType:{name:"Partial",elements:[{name:"Omit",elements:[{name:"ReactComponentPropsWithoutRef",raw:"React.ComponentPropsWithoutRef<typeof import('../../shared/ui/textfield').TextField.Input>",elements:[{name:"import('../../shared/ui/textfield').TextField.Input"}]},{name:"union",raw:"'value' | 'name' | 'ref' | 'id'",elements:[{name:"literal",value:"'value'"},{name:"literal",value:"'name'"},{name:"literal",value:"'ref'"},{name:"literal",value:"'id'"}]}],raw:`Omit<
  React.ComponentPropsWithoutRef<typeof import('../../shared/ui/textfield').TextField.Input>,
  'value' | 'name' | 'ref' | 'id'
>`}],raw:`Partial<
  Omit<
    React.ComponentPropsWithoutRef<typeof import('../../shared/ui/textfield').TextField.Input>,
    'value' | 'name' | 'ref' | 'id'
  >
>`},description:"TextField Input props (onChange/onBlur are merged with form handlers)",defaultValue:{value:"{}",computed:!1}},type:{required:!1,tsType:{name:"union",raw:"'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'",elements:[{name:"literal",value:"'text'"},{name:"literal",value:"'email'"},{name:"literal",value:"'password'"},{name:"literal",value:"'number'"},{name:"literal",value:"'tel'"},{name:"literal",value:"'url'"},{name:"literal",value:"'search'"}]},description:"Input type (shorthand for inputProps.type)"},placeholder:{required:!1,tsType:{name:"string"},description:"Placeholder text (shorthand for inputProps.placeholder)"},className:{required:!1,tsType:{name:"string"},description:"Additional CSS classes passed to TextField root"}}};const Br=new Map;function Ur(e){return Br.get(e)}const Oe=({schema:e,onSubmit:r,children:t,className:s,...o})=>{const i=e?Mr(e):void 0,l=Tr({mode:"onSubmit",reValidateMode:"onChange",...o,resolver:i}),u=l.handleSubmit(async g=>{await r(g)},g=>{}),b=F.useMemo(()=>({formMethods:l}),[l]);return R.jsx(Ir.Provider,{value:b,children:R.jsx(lr,{...l,children:R.jsx("form",{onSubmit:u,className:s,noValidate:!0,children:typeof t=="function"?t(l):t})})})};Oe.displayName="Form";const zr=Object.assign(Oe,{Field:Re}),et=({id:e,parentPath:r=[]})=>{const{childrenIds:t,attributes:s}=Tt({nodeId:e}),{renderChildren:o}=tr({nodeId:e,parentPath:r}),i=s?.schema,l=s?.schemaName,u=l?Ur(l):void 0,b=i||u;s?.onSubmit;const h=s?.onSubmitHandler||(async O=>{}),x=s?.className,v=s?.formOptions;return R.jsx(Oe,{schema:b,onSubmit:h,className:x,...v,children:o(t)})};et.displayName="FormContainer";Oe.__docgenInfo={description:`Form Root Component

@description
Form component that integrates react-hook-form with zod validation.
Provides form methods via FormProvider and custom FormContext.

@example
\`\`\`tsx
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

<Form
  schema={schema}
  onSubmit={(data) => console.log(data)}
>
  <Form.Field name="email" label="Email" required />
  <Form.Field name="password" label="Password" type="password" required />
  <button type="submit">Submit</button>
</Form>
\`\`\``,methods:[],displayName:"Form",props:{schema:{required:!1,tsType:{name:"z.ZodType",elements:[{name:"any"},{name:"any"},{name:"any"}],raw:"z.ZodType<any, any, any>"},description:"Zod schema for validation"},onSubmit:{required:!0,tsType:{name:"signature",type:"function",raw:"(data: TFieldValues) => void | Promise<void>",signature:{arguments:[{type:{name:"TFieldValues"},name:"data"}],return:{name:"union",raw:"void | Promise<void>",elements:[{name:"void"},{name:"Promise",elements:[{name:"void"}],raw:"Promise<void>"}]}}},description:"Form submission handler"},children:{required:!0,tsType:{name:"union",raw:"React.ReactNode | ((methods: UseFormReturn<TFieldValues, TContext>) => React.ReactNode)",elements:[{name:"ReactReactNode",raw:"React.ReactNode"},{name:"unknown"}]},description:"Form children (can access form methods via FormProvider)"},className:{required:!1,tsType:{name:"string"},description:"Additional CSS classes"}},composes:["Omit"]};et.__docgenInfo={description:"",methods:[],displayName:"FormContainer",props:{id:{required:!0,tsType:{name:"string"},description:""},parentPath:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:"",defaultValue:{value:"[]",computed:!1}}}};function ce(){return{Form:(e,r)=>R.jsx(et,{id:e,parentPath:r}),Div:(e,r)=>R.jsx(nr,{id:e,parentPath:r}),FormField:e=>R.jsx(Qe,{id:e}),Button:(e,r)=>R.jsx(ir,{id:e,parentPath:r}),Text:e=>R.jsx(sr,{id:e}),Span:e=>R.jsx(rr,{id:e})}}const es={title:"Features/UI/Form",component:zr,tags:["autodocs"],parameters:{docs:{description:{component:`
## Overview

The **Form** component integrates **react-hook-form** with **zod** to provide comprehensive form validation with excellent developer experience.

## Key Features

### Form State Management
- ✅ **react-hook-form** for efficient state handling
- ✅ Minimal re-renders
- ✅ Optimized performance

### Validation
- ✅ **zod** schema-based validation
- ✅ Type-safe form data
- ✅ Custom validation rules
- ✅ Cross-field validation support

### Integration
- ✅ Works seamlessly with **TextField** component
- ✅ Consistent UI and validation experience
- ✅ Automatic error handling

## Flexibility

The Form component supports:
- **Schema-based** validation (recommended)
- **Schema-less** forms (for simple cases)

## Use Cases

- Login/registration forms
- User profile forms
- Data entry forms
- Multi-step forms
        `}}}},we={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"form-container",type:"Div",attributes:{className:"w-[340px]"},children:[{id:"form",type:"Form",attributes:{},children:[{id:"form-fields-container",type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:"form-field-email",type:"FormField",attributes:{name:"email",label:"로그인",type:"text",required:!0,disabled:!1}},{id:"form-field-password",type:"FormField",attributes:{name:"password",label:"비밀번호",type:"password",required:!0,disabled:!1}},{id:"submit-button",type:"Button",state:{buttonStyle:"filled",buttonType:"primary",size:"L"},attributes:{type:"submit",className:"w-full"},children:[{id:"submit-button-text",type:"Span",state:{text:"로그인"}}]}]}]}]}]}};return R.jsx(ue,{document:e,components:ce()})},parameters:{docs:{description:{story:"A basic form example demonstrating the core functionality. The form uses a zod schema to validate email and password fields. When validation fails, error messages are automatically displayed below the corresponding fields. The form only submits when all validations pass."}}}},_e={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"form-container",type:"Div",attributes:{className:"w-[340px]"},children:[{id:"form",type:"Form",attributes:{},children:[{id:"form-fields-container",type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:"form-field-name",type:"FormField",attributes:{name:"name",label:"이름",type:"text",placeholder:"홍길동",required:!0,disabled:!1}},{id:"form-field-email",type:"FormField",attributes:{name:"email",label:"이메일",type:"email",placeholder:"example@email.com",required:!0,disabled:!1}},{id:"form-field-password",type:"FormField",attributes:{name:"password",label:"비밀번호",type:"password",placeholder:"8자 이상 입력",required:!0,disabled:!1}},{id:"form-field-confirmPassword",type:"FormField",attributes:{name:"confirmPassword",label:"비밀번호 확인",type:"password",placeholder:"비밀번호 재입력",required:!0,disabled:!1}},{id:"submit-button",type:"Button",state:{buttonStyle:"filled",buttonType:"primary",size:"L"},attributes:{type:"submit",className:"w-full"},children:[{id:"submit-button-text",type:"Span",state:{text:"회원가입"}}]}]}]}]}]}};return R.jsx(ue,{document:e,components:ce()})},parameters:{docs:{description:{story:"A registration form example that demonstrates cross-field validation. The form validates that the password and confirm password fields match using zod's refine method. This shows how to implement complex validation rules that depend on multiple fields."}}}},Ve={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"form-container",type:"Div",attributes:{className:"w-[340px]"},children:[{id:"form",type:"Form",attributes:{},children:[{id:"form-fields-container",type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:"form-field-username",type:"FormField",attributes:{name:"username",label:"사용자명",type:"text",placeholder:"username",required:!0,disabled:!1,helpMessage:"3자 이상의 영문, 숫자, 언더스코어를 사용할 수 있습니다"}},{id:"form-field-email",type:"FormField",attributes:{name:"email",label:"이메일",type:"email",placeholder:"example@email.com",required:!0,disabled:!1,helpMessage:"로그인 및 알림에 사용됩니다"}},{id:"submit-button",type:"Button",state:{buttonStyle:"filled",buttonType:"primary",size:"L"},attributes:{type:"submit",className:"w-full"},children:[{id:"submit-button-text",type:"Span",state:{text:"제출"}}]}]}]}]}]}};return R.jsx(ue,{document:e,components:ce()})},parameters:{docs:{description:{story:"Demonstrates how to add help messages to form fields. Help messages provide additional context and guidance to users about what to enter in each field. Help messages are displayed below the input field and remain visible even when the field is in an error state."}}}},Se={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"form-container",type:"Div",attributes:{className:"w-[340px]"},children:[{id:"form",type:"Form",attributes:{},children:[{id:"form-fields-container",type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:"form-field-email",type:"FormField",attributes:{name:"email",label:"이메일",type:"text",placeholder:"example@email.com",required:!1,disabled:!1}},{id:"form-field-password",type:"FormField",attributes:{name:"password",label:"비밀번호",type:"password",placeholder:"비밀번호 입력",required:!1,disabled:!1}},{id:"submit-button",type:"Button",state:{buttonStyle:"filled",buttonType:"primary",size:"L"},attributes:{type:"submit",className:"w-full"},children:[{id:"submit-button-text",type:"Span",state:{text:"제출"}}]}]}]}]}]}};return R.jsx(ue,{document:e,components:ce()})},parameters:{docs:{description:{story:"Shows how to use the Form component without a validation schema. In this mode, the form collects data without performing any validation. This is useful for simple forms where validation is handled server-side or when you need maximum flexibility."}}}},De={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"form-container",type:"Div",attributes:{className:"w-[340px]"},children:[{id:"form",type:"Form",attributes:{},children:[{id:"form-fields-container",type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:"form-field-phone",type:"FormField",attributes:{name:"phone",label:"전화번호",type:"text",placeholder:"010-1234-5678",required:!0,disabled:!1,helpMessage:"010-XXXX-XXXX 형식으로 입력해주세요"}},{id:"form-field-age",type:"FormField",attributes:{name:"age",label:"나이",type:"number",placeholder:"18",required:!0,disabled:!1}},{id:"submit-button",type:"Button",state:{buttonStyle:"filled",buttonType:"primary",size:"L"},attributes:{type:"submit",className:"w-full"},children:[{id:"submit-button-text",type:"Span",state:{text:"제출"}}]}]}]}]}]}};return R.jsx(ue,{document:e,components:ce()})},parameters:{docs:{description:{story:"Demonstrates custom validation rules using zod. The phone field uses a regex pattern to validate Korean phone number format (010-XXXX-XXXX), and the age field uses a refine method to check that the value is between 18 and 100. This shows how to implement domain-specific validation rules beyond basic type checking."}}}},Te={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"form-container",type:"Div",attributes:{className:"w-[340px]"},children:[{id:"form",type:"Form",attributes:{},children:[{id:"form-fields-container",type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:"form-field-email",type:"FormField",attributes:{name:"email",label:"이메일",disabled:!0,inputProps:{defaultValue:"user@example.com"}}},{id:"form-field-username",type:"FormField",attributes:{name:"username",label:"사용자명",placeholder:"사용자명 입력",required:!0}},{id:"submit-button",type:"Button",state:{buttonStyle:"filled",buttonType:"primary",size:"L"},attributes:{type:"submit",className:"w-full"},children:[{id:"submit-button-text",type:"Span",state:{text:"제출"}}]}]}]}]}]}};return R.jsx(ue,{document:e,components:ce()})},parameters:{docs:{description:{story:"Shows how to include disabled fields in a form. Disabled fields are read-only and cannot be edited by users. They are useful for displaying pre-filled information that shouldn't be changed, such as user email addresses in profile forms. Disabled fields are still included in the form submission."}}}};we.parameters={...we.parameters,docs:{...we.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100'
        },
        children: [{
          id: 'form-container',
          type: 'Div',
          attributes: {
            className: 'w-[340px]'
          },
          children: [{
            id: 'form',
            type: 'Form',
            attributes: {},
            children: [{
              id: 'form-fields-container',
              type: 'Div',
              attributes: {
                className: 'flex flex-col gap-4'
              },
              children: [{
                id: 'form-field-email',
                type: 'FormField',
                attributes: {
                  name: 'email',
                  label: '로그인',
                  type: 'text',
                  required: true,
                  disabled: false
                }
              }, {
                id: 'form-field-password',
                type: 'FormField',
                attributes: {
                  name: 'password',
                  label: '비밀번호',
                  type: 'password',
                  required: true,
                  disabled: false
                }
              }, {
                id: 'submit-button',
                type: 'Button',
                state: {
                  buttonStyle: 'filled',
                  buttonType: 'primary',
                  size: 'L'
                },
                attributes: {
                  type: 'submit',
                  className: 'w-full'
                },
                children: [{
                  id: 'submit-button-text',
                  type: 'Span',
                  state: {
                    text: '로그인'
                  }
                }]
              }]
            }]
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getFormComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic form example demonstrating the core functionality. The form uses a zod schema to validate email and password fields. When validation fails, error messages are automatically displayed below the corresponding fields. The form only submits when all validations pass.'
      }
    }
  }
}`,...we.parameters?.docs?.source}}};_e.parameters={..._e.parameters,docs:{..._e.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100'
        },
        children: [{
          id: 'form-container',
          type: 'Div',
          attributes: {
            className: 'w-[340px]'
          },
          children: [{
            id: 'form',
            type: 'Form',
            attributes: {},
            children: [{
              id: 'form-fields-container',
              type: 'Div',
              attributes: {
                className: 'flex flex-col gap-4'
              },
              children: [{
                id: 'form-field-name',
                type: 'FormField',
                attributes: {
                  name: 'name',
                  label: '이름',
                  type: 'text',
                  placeholder: '홍길동',
                  required: true,
                  disabled: false
                }
              }, {
                id: 'form-field-email',
                type: 'FormField',
                attributes: {
                  name: 'email',
                  label: '이메일',
                  type: 'email',
                  placeholder: 'example@email.com',
                  required: true,
                  disabled: false
                }
              }, {
                id: 'form-field-password',
                type: 'FormField',
                attributes: {
                  name: 'password',
                  label: '비밀번호',
                  type: 'password',
                  placeholder: '8자 이상 입력',
                  required: true,
                  disabled: false
                }
              }, {
                id: 'form-field-confirmPassword',
                type: 'FormField',
                attributes: {
                  name: 'confirmPassword',
                  label: '비밀번호 확인',
                  type: 'password',
                  placeholder: '비밀번호 재입력',
                  required: true,
                  disabled: false
                }
              }, {
                id: 'submit-button',
                type: 'Button',
                state: {
                  buttonStyle: 'filled',
                  buttonType: 'primary',
                  size: 'L'
                },
                attributes: {
                  type: 'submit',
                  className: 'w-full'
                },
                children: [{
                  id: 'submit-button-text',
                  type: 'Span',
                  state: {
                    text: '회원가입'
                  }
                }]
              }]
            }]
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getFormComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: "A registration form example that demonstrates cross-field validation. The form validates that the password and confirm password fields match using zod's refine method. This shows how to implement complex validation rules that depend on multiple fields."
      }
    }
  }
}`,..._e.parameters?.docs?.source}}};Ve.parameters={...Ve.parameters,docs:{...Ve.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100'
        },
        children: [{
          id: 'form-container',
          type: 'Div',
          attributes: {
            className: 'w-[340px]'
          },
          children: [{
            id: 'form',
            type: 'Form',
            attributes: {},
            children: [{
              id: 'form-fields-container',
              type: 'Div',
              attributes: {
                className: 'flex flex-col gap-4'
              },
              children: [{
                id: 'form-field-username',
                type: 'FormField',
                attributes: {
                  name: 'username',
                  label: '사용자명',
                  type: 'text',
                  placeholder: 'username',
                  required: true,
                  disabled: false,
                  helpMessage: '3자 이상의 영문, 숫자, 언더스코어를 사용할 수 있습니다'
                }
              }, {
                id: 'form-field-email',
                type: 'FormField',
                attributes: {
                  name: 'email',
                  label: '이메일',
                  type: 'email',
                  placeholder: 'example@email.com',
                  required: true,
                  disabled: false,
                  helpMessage: '로그인 및 알림에 사용됩니다'
                }
              }, {
                id: 'submit-button',
                type: 'Button',
                state: {
                  buttonStyle: 'filled',
                  buttonType: 'primary',
                  size: 'L'
                },
                attributes: {
                  type: 'submit',
                  className: 'w-full'
                },
                children: [{
                  id: 'submit-button-text',
                  type: 'Span',
                  state: {
                    text: '제출'
                  }
                }]
              }]
            }]
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getFormComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how to add help messages to form fields. Help messages provide additional context and guidance to users about what to enter in each field. Help messages are displayed below the input field and remain visible even when the field is in an error state.'
      }
    }
  }
}`,...Ve.parameters?.docs?.source}}};Se.parameters={...Se.parameters,docs:{...Se.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100'
        },
        children: [{
          id: 'form-container',
          type: 'Div',
          attributes: {
            className: 'w-[340px]'
          },
          children: [{
            id: 'form',
            type: 'Form',
            attributes: {},
            children: [{
              id: 'form-fields-container',
              type: 'Div',
              attributes: {
                className: 'flex flex-col gap-4'
              },
              children: [{
                id: 'form-field-email',
                type: 'FormField',
                attributes: {
                  name: 'email',
                  label: '이메일',
                  type: 'text',
                  placeholder: 'example@email.com',
                  required: false,
                  disabled: false
                }
              }, {
                id: 'form-field-password',
                type: 'FormField',
                attributes: {
                  name: 'password',
                  label: '비밀번호',
                  type: 'password',
                  placeholder: '비밀번호 입력',
                  required: false,
                  disabled: false
                }
              }, {
                id: 'submit-button',
                type: 'Button',
                state: {
                  buttonStyle: 'filled',
                  buttonType: 'primary',
                  size: 'L'
                },
                attributes: {
                  type: 'submit',
                  className: 'w-full'
                },
                children: [{
                  id: 'submit-button-text',
                  type: 'Span',
                  state: {
                    text: '제출'
                  }
                }]
              }]
            }]
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getFormComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how to use the Form component without a validation schema. In this mode, the form collects data without performing any validation. This is useful for simple forms where validation is handled server-side or when you need maximum flexibility.'
      }
    }
  }
}`,...Se.parameters?.docs?.source}}};De.parameters={...De.parameters,docs:{...De.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100'
        },
        children: [{
          id: 'form-container',
          type: 'Div',
          attributes: {
            className: 'w-[340px]'
          },
          children: [{
            id: 'form',
            type: 'Form',
            attributes: {},
            children: [{
              id: 'form-fields-container',
              type: 'Div',
              attributes: {
                className: 'flex flex-col gap-4'
              },
              children: [{
                id: 'form-field-phone',
                type: 'FormField',
                attributes: {
                  name: 'phone',
                  label: '전화번호',
                  type: 'text',
                  placeholder: '010-1234-5678',
                  required: true,
                  disabled: false,
                  helpMessage: '010-XXXX-XXXX 형식으로 입력해주세요'
                }
              }, {
                id: 'form-field-age',
                type: 'FormField',
                attributes: {
                  name: 'age',
                  label: '나이',
                  type: 'number',
                  placeholder: '18',
                  required: true,
                  disabled: false
                }
              }, {
                id: 'submit-button',
                type: 'Button',
                state: {
                  buttonStyle: 'filled',
                  buttonType: 'primary',
                  size: 'L'
                },
                attributes: {
                  type: 'submit',
                  className: 'w-full'
                },
                children: [{
                  id: 'submit-button-text',
                  type: 'Span',
                  state: {
                    text: '제출'
                  }
                }]
              }]
            }]
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getFormComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates custom validation rules using zod. The phone field uses a regex pattern to validate Korean phone number format (010-XXXX-XXXX), and the age field uses a refine method to check that the value is between 18 and 100. This shows how to implement domain-specific validation rules beyond basic type checking.'
      }
    }
  }
}`,...De.parameters?.docs?.source}}};Te.parameters={...Te.parameters,docs:{...Te.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100'
        },
        children: [{
          id: 'form-container',
          type: 'Div',
          attributes: {
            className: 'w-[340px]'
          },
          children: [{
            id: 'form',
            type: 'Form',
            attributes: {},
            children: [{
              id: 'form-fields-container',
              type: 'Div',
              attributes: {
                className: 'flex flex-col gap-4'
              },
              children: [{
                id: 'form-field-email',
                type: 'FormField',
                attributes: {
                  name: 'email',
                  label: '이메일',
                  disabled: true,
                  inputProps: {
                    defaultValue: 'user@example.com'
                  }
                }
              }, {
                id: 'form-field-username',
                type: 'FormField',
                attributes: {
                  name: 'username',
                  label: '사용자명',
                  placeholder: '사용자명 입력',
                  required: true
                }
              }, {
                id: 'submit-button',
                type: 'Button',
                state: {
                  buttonStyle: 'filled',
                  buttonType: 'primary',
                  size: 'L'
                },
                attributes: {
                  type: 'submit',
                  className: 'w-full'
                },
                children: [{
                  id: 'submit-button-text',
                  type: 'Span',
                  state: {
                    text: '제출'
                  }
                }]
              }]
            }]
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getFormComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: "Shows how to include disabled fields in a form. Disabled fields are read-only and cannot be edited by users. They are useful for displaying pre-filled information that shouldn't be changed, such as user email addresses in profile forms. Disabled fields are still included in the form submission."
      }
    }
  }
}`,...Te.parameters?.docs?.source}}};const ts=["Basic","RegistrationForm","WithHelpMessages","WithoutSchema","CustomValidation","DisabledFields"];export{we as Basic,De as CustomValidation,Te as DisabledFields,_e as RegistrationForm,Ve as WithHelpMessages,Se as WithoutSchema,ts as __namedExportsOrder,es as default};
