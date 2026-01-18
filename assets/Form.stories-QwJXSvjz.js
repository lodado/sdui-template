import{j}from"./jsx-runtime-ByZOKGhl.js";/* empty css               */import{R as $,r as Rr}from"./iframe-C6gHqnx-.js";import{T as Ve}from"./TextField-KHkdE__B.js";import{u as Ir,b as Zn,S as Nn,T as An,D as Vn,a as be,E as jn}from"./Text-Cc0p3dYf.js";import{B as Cn}from"./ButtonContainer-BO-Lz7bx.js";import"./preload-helper-ggYluGXI.js";import"./index-BE1xsiQq.js";import"./Button-9qKtdaDm.js";import"./index-DfU3qPeL.js";import"./types-lBip4we0.js";var Me=e=>e.type==="checkbox",Fe=e=>e instanceof Date,ne=e=>e==null;const Ur=e=>typeof e=="object";var B=e=>!ne(e)&&!Array.isArray(e)&&Ur(e)&&!Fe(e),Lr=e=>B(e)&&e.target?Me(e.target)?e.target.checked:e.target.value:e,Rn=e=>e.substring(0,e.search(/\.\d+(\.|$)/))||e,Mr=(e,t)=>e.has(Rn(t)),In=e=>{const t=e.constructor&&e.constructor.prototype;return B(t)&&t.hasOwnProperty("isPrototypeOf")},Zt=typeof window<"u"&&typeof window.HTMLElement<"u"&&typeof document<"u";function M(e){if(e instanceof Date)return new Date(e);const t=typeof FileList<"u"&&e instanceof FileList;if(Zt&&(e instanceof Blob||t))return e;const r=Array.isArray(e);if(!r&&!(B(e)&&In(e)))return e;const n=r?[]:Object.create(Object.getPrototypeOf(e));for(const s in e)Object.prototype.hasOwnProperty.call(e,s)&&(n[s]=M(e[s]));return n}var ut=e=>/^\w*$/.test(e),C=e=>e===void 0,Nt=e=>Array.isArray(e)?e.filter(Boolean):[],At=e=>Nt(e.replace(/["|']|\]/g,"").split(/\.|\[/)),v=(e,t,r)=>{if(!t||!B(e))return r;const n=(ut(t)?[t]:At(t)).reduce((s,i)=>ne(s)?s:s[i],e);return C(n)||n===e?C(e[t])?r:e[t]:n},oe=e=>typeof e=="boolean",re=e=>typeof e=="function",N=(e,t,r)=>{let n=-1;const s=ut(t)?[t]:At(t),i=s.length,o=i-1;for(;++n<i;){const a=s[n];let l=r;if(n!==o){const f=e[a];l=B(f)||Array.isArray(f)?f:isNaN(+s[n+1])?{}:[]}if(a==="__proto__"||a==="constructor"||a==="prototype")return;e[a]=l,e=e[a]}};const rt={BLUR:"blur",FOCUS_OUT:"focusout",CHANGE:"change"},de={onBlur:"onBlur",onChange:"onChange",onSubmit:"onSubmit",onTouched:"onTouched",all:"all"},ye={max:"max",min:"min",maxLength:"maxLength",minLength:"minLength",pattern:"pattern",required:"required",validate:"validate"},Vt=$.createContext(null);Vt.displayName="HookFormContext";const lt=()=>$.useContext(Vt),Un=e=>{const{children:t,...r}=e;return $.createElement(Vt.Provider,{value:r},t)};var qr=(e,t,r,n=!0)=>{const s={defaultValues:t._defaultValues};for(const i in e)Object.defineProperty(s,i,{get:()=>{const o=i;return t._proxyFormState[o]!==de.all&&(t._proxyFormState[o]=!n||de.all),r&&(r[o]=!0),e[o]}});return s};const jt=typeof window<"u"?$.useLayoutEffect:$.useEffect;function Ln(e){const t=lt(),{control:r=t.control,disabled:n,name:s,exact:i}=e||{},[o,a]=$.useState(r._formState),l=$.useRef({isDirty:!1,isLoading:!1,dirtyFields:!1,touchedFields:!1,validatingFields:!1,isValidating:!1,isValid:!1,errors:!1});return jt(()=>r._subscribe({name:s,formState:l.current,exact:i,callback:f=>{!n&&a({...r._formState,...f})}}),[s,n,i]),$.useEffect(()=>{l.current.isValid&&r._setValid(!0)},[r]),$.useMemo(()=>qr(o,r,l.current,!1),[o,r])}var ie=e=>typeof e=="string",xt=(e,t,r,n,s)=>ie(e)?(n&&t.watch.add(e),v(r,e,s)):Array.isArray(e)?e.map(i=>(n&&t.watch.add(i),v(r,i))):(n&&(t.watchAll=!0),r),$t=e=>ne(e)||!Ur(e);function fe(e,t,r=new WeakSet){if($t(e)||$t(t))return Object.is(e,t);if(Fe(e)&&Fe(t))return Object.is(e.getTime(),t.getTime());const n=Object.keys(e),s=Object.keys(t);if(n.length!==s.length)return!1;if(r.has(e)||r.has(t))return!0;r.add(e),r.add(t);for(const i of n){const o=e[i];if(!s.includes(i))return!1;if(i!=="ref"){const a=t[i];if(Fe(o)&&Fe(a)||B(o)&&B(a)||Array.isArray(o)&&Array.isArray(a)?!fe(o,a,r):!Object.is(o,a))return!1}}return!0}function Mn(e){const t=lt(),{control:r=t.control,name:n,defaultValue:s,disabled:i,exact:o,compute:a}=e||{},l=$.useRef(s),f=$.useRef(a),_=$.useRef(void 0),p=$.useRef(r),g=$.useRef(n);f.current=a;const[h,E]=$.useState(()=>{const F=r._getWatch(n,l.current);return f.current?f.current(F):F}),x=$.useCallback(F=>{const S=xt(n,r._names,F||r._formValues,!1,l.current);return f.current?f.current(S):S},[r._formValues,r._names,n]),U=$.useCallback(F=>{if(!i){const S=xt(n,r._names,F||r._formValues,!1,l.current);if(f.current){const Y=f.current(S);fe(Y,_.current)||(E(Y),_.current=Y)}else E(S)}},[r._formValues,r._names,i,n]);jt(()=>((p.current!==r||!fe(g.current,n))&&(p.current=r,g.current=n,U()),r._subscribe({name:n,formState:{values:!0},exact:o,callback:F=>{U(F.values)}})),[r,o,n,U]),$.useEffect(()=>r._removeUnmounted());const L=p.current!==r,P=g.current,V=$.useMemo(()=>{if(i)return null;const F=!L&&!fe(P,n);return L||F?x():null},[i,L,n,P,x]);return V!==null?V:h}function qn(e){const t=lt(),{name:r,disabled:n,control:s=t.control,shouldUnregister:i,defaultValue:o,exact:a=!0}=e,l=Mr(s._names.array,r),f=$.useMemo(()=>v(s._formValues,r,v(s._defaultValues,r,o)),[s,r,o]),_=Mn({control:s,name:r,defaultValue:f,exact:a}),p=Ln({control:s,name:r,exact:a}),g=$.useRef(e),h=$.useRef(void 0),E=$.useRef(s.register(r,{...e.rules,value:_,...oe(e.disabled)?{disabled:e.disabled}:{}}));g.current=e;const x=$.useMemo(()=>Object.defineProperties({},{invalid:{enumerable:!0,get:()=>!!v(p.errors,r)},isDirty:{enumerable:!0,get:()=>!!v(p.dirtyFields,r)},isTouched:{enumerable:!0,get:()=>!!v(p.touchedFields,r)},isValidating:{enumerable:!0,get:()=>!!v(p.validatingFields,r)},error:{enumerable:!0,get:()=>v(p.errors,r)}}),[p,r]),U=$.useCallback(F=>E.current.onChange({target:{value:Lr(F),name:r},type:rt.CHANGE}),[r]),L=$.useCallback(()=>E.current.onBlur({target:{value:v(s._formValues,r),name:r},type:rt.BLUR}),[r,s._formValues]),P=$.useCallback(F=>{const S=v(s._fields,r);S&&S._f&&F&&(S._f.ref={focus:()=>re(F.focus)&&F.focus(),select:()=>re(F.select)&&F.select(),setCustomValidity:Y=>re(F.setCustomValidity)&&F.setCustomValidity(Y),reportValidity:()=>re(F.reportValidity)&&F.reportValidity()})},[s._fields,r]),V=$.useMemo(()=>({name:r,value:_,...oe(n)||p.disabled?{disabled:p.disabled||n}:{},onChange:U,onBlur:L,ref:P}),[r,n,p.disabled,U,L,P,_]);return $.useEffect(()=>{const F=s._options.shouldUnregister||i,S=h.current;S&&S!==r&&!l&&s.unregister(S),s.register(r,{...g.current.rules,...oe(g.current.disabled)?{disabled:g.current.disabled}:{}});const Y=(ue,he)=>{const me=v(s._fields,ue);me&&me._f&&(me._f.mount=he)};if(Y(r,!0),F){const ue=M(v(s._options.defaultValues,r,g.current.defaultValue));N(s._defaultValues,r,ue),C(v(s._formValues,r))&&N(s._formValues,r,ue)}return!l&&s.register(r),h.current=r,()=>{(l?F&&!s._state.action:F)?s.unregister(r):Y(r,!1)}},[r,s,l,i]),$.useEffect(()=>{s._setDisabledField({disabled:n,name:r})},[n,r,s]),$.useMemo(()=>({field:V,formState:p,fieldState:x}),[V,p,x])}const Bn=e=>e.render(qn(e));var Ct=(e,t,r,n,s)=>t?{...r[e],types:{...r[e]&&r[e].types?r[e].types:{},[n]:s||!0}}:{},Re=e=>Array.isArray(e)?e:[e],ir=()=>{let e=[];return{get observers(){return e},next:s=>{for(const i of e)i.next&&i.next(s)},subscribe:s=>(e.push(s),{unsubscribe:()=>{e=e.filter(i=>i!==s)}}),unsubscribe:()=>{e=[]}}};function Br(e,t){const r={};for(const n in e)if(e.hasOwnProperty(n)){const s=e[n],i=t[n];if(s&&B(s)&&i){const o=Br(s,i);B(o)&&(r[n]=o)}else e[n]&&(r[n]=i)}return r}var te=e=>B(e)&&!Object.keys(e).length,Rt=e=>e.type==="file",nt=e=>{if(!Zt)return!1;const t=e?e.ownerDocument:0;return e instanceof(t&&t.defaultView?t.defaultView.HTMLElement:HTMLElement)},Jr=e=>e.type==="select-multiple",It=e=>e.type==="radio",Jn=e=>It(e)||Me(e),kt=e=>nt(e)&&e.isConnected;function Xn(e,t){const r=t.slice(0,-1).length;let n=0;for(;n<r;)e=C(e)?n++:e[t[n++]];return e}function Wn(e){for(const t in e)if(e.hasOwnProperty(t)&&!C(e[t]))return!1;return!0}function q(e,t){const r=Array.isArray(t)?t:ut(t)?[t]:At(t),n=r.length===1?e:Xn(e,r),s=r.length-1,i=r[s];return n&&delete n[i],s!==0&&(B(n)&&te(n)||Array.isArray(n)&&Wn(n))&&q(e,r.slice(0,-1)),e}var Kn=e=>{for(const t in e)if(re(e[t]))return!0;return!1};function Xr(e){return Array.isArray(e)||B(e)&&!Kn(e)}function Et(e,t={}){for(const r in e){const n=e[r];Xr(n)?(t[r]=Array.isArray(n)?[]:{},Et(n,t[r])):C(n)||(t[r]=!0)}return t}function Pe(e,t,r){r||(r=Et(t));for(const n in e){const s=e[n];if(Xr(s))C(t)||$t(r[n])?r[n]=Et(s,Array.isArray(s)?[]:{}):Pe(s,ne(t)?{}:t[n],r[n]);else{const i=t[n];r[n]=!fe(s,i)}}return r}const ar={value:!1,isValid:!1},cr={value:!0,isValid:!0};var Wr=e=>{if(Array.isArray(e)){if(e.length>1){const t=e.filter(r=>r&&r.checked&&!r.disabled).map(r=>r.value);return{value:t,isValid:!!t.length}}return e[0].checked&&!e[0].disabled?e[0].attributes&&!C(e[0].attributes.value)?C(e[0].value)||e[0].value===""?cr:{value:e[0].value,isValid:!0}:cr:ar}return ar},Kr=(e,{valueAsNumber:t,valueAsDate:r,setValueAs:n})=>C(e)?e:t?e===""?NaN:e&&+e:r&&ie(e)?new Date(e):n?n(e):e;const ur={isValid:!1,value:null};var Hr=e=>Array.isArray(e)?e.reduce((t,r)=>r&&r.checked&&!r.disabled?{isValid:!0,value:r.value}:t,ur):ur;function lr(e){const t=e.ref;return Rt(t)?t.files:It(t)?Hr(e.refs).value:Jr(t)?[...t.selectedOptions].map(({value:r})=>r):Me(t)?Wr(e.refs).value:Kr(C(t.value)?e.ref.value:t.value,e)}var Hn=(e,t,r,n)=>{const s={};for(const i of e){const o=v(t,i);o&&N(s,i,o._f)}return{criteriaMode:r,names:[...e],fields:s,shouldUseNativeValidation:n}},st=e=>e instanceof RegExp,je=e=>C(e)?e:st(e)?e.source:B(e)?st(e.value)?e.value.source:e.value:e,dr=e=>({isOnSubmit:!e||e===de.onSubmit,isOnBlur:e===de.onBlur,isOnChange:e===de.onChange,isOnAll:e===de.all,isOnTouch:e===de.onTouched});const fr="AsyncFunction";var Gn=e=>!!e&&!!e.validate&&!!(re(e.validate)&&e.validate.constructor.name===fr||B(e.validate)&&Object.values(e.validate).find(t=>t.constructor.name===fr)),Yn=e=>e.mount&&(e.required||e.min||e.max||e.maxLength||e.minLength||e.pattern||e.validate),mr=(e,t,r)=>!r&&(t.watchAll||t.watch.has(e)||[...t.watch].some(n=>e.startsWith(n)&&/^\.\w+/.test(e.slice(n.length))));const Ie=(e,t,r,n)=>{for(const s of r||Object.keys(e)){const i=v(e,s);if(i){const{_f:o,...a}=i;if(o){if(o.refs&&o.refs[0]&&t(o.refs[0],s)&&!n)return!0;if(o.ref&&t(o.ref,o.name)&&!n)return!0;if(Ie(a,t))break}else if(B(a)&&Ie(a,t))break}}};function pr(e,t,r){const n=v(e,r);if(n||ut(r))return{error:n,name:r};const s=r.split(".");for(;s.length;){const i=s.join("."),o=v(t,i),a=v(e,i);if(o&&!Array.isArray(o)&&r!==i)return{name:r};if(a&&a.type)return{name:i,error:a};if(a&&a.root&&a.root.type)return{name:`${i}.root`,error:a.root};s.pop()}return{name:r}}var Qn=(e,t,r,n)=>{r(e);const{name:s,...i}=e;return te(i)||Object.keys(i).length>=Object.keys(t).length||Object.keys(i).find(o=>t[o]===(!n||de.all))},es=(e,t,r)=>!e||!t||e===t||Re(e).some(n=>n&&(r?n===t:n.startsWith(t)||t.startsWith(n))),ts=(e,t,r,n,s)=>s.isOnAll?!1:!r&&s.isOnTouch?!(t||e):(r?n.isOnBlur:s.isOnBlur)?!e:(r?n.isOnChange:s.isOnChange)?e:!0,rs=(e,t)=>!Nt(v(e,t)).length&&q(e,t),ns=(e,t,r)=>{const n=Re(v(e,r));return N(n,"root",t[r]),N(e,r,n),e};function hr(e,t,r="validate"){if(ie(e)||Array.isArray(e)&&e.every(ie)||oe(e)&&!e)return{type:r,message:ie(e)?e:"",ref:t}}var Ee=e=>B(e)&&!st(e)?e:{value:e,message:""},yr=async(e,t,r,n,s,i)=>{const{ref:o,refs:a,required:l,maxLength:f,minLength:_,min:p,max:g,pattern:h,validate:E,name:x,valueAsNumber:U,mount:L}=e._f,P=v(r,x);if(!L||t.has(x))return{};const V=a?a[0]:o,F=O=>{s&&V.reportValidity&&(V.setCustomValidity(oe(O)?"":O||""),V.reportValidity())},S={},Y=It(o),ue=Me(o),he=Y||ue,me=(U||Rt(o))&&C(o.value)&&C(P)||nt(o)&&o.value===""||P===""||Array.isArray(P)&&!P.length,ae=Ct.bind(null,x,n,S),qe=(O,T,J,H=ye.maxLength,le=ye.minLength)=>{const se=O?T:J;S[x]={type:O?H:le,message:se,ref:o,...ae(O?H:le,se)}};if(i?!Array.isArray(P)||!P.length:l&&(!he&&(me||ne(P))||oe(P)&&!P||ue&&!Wr(a).isValid||Y&&!Hr(a).isValid)){const{value:O,message:T}=ie(l)?{value:!!l,message:l}:Ee(l);if(O&&(S[x]={type:ye.required,message:T,ref:V,...ae(ye.required,T)},!n))return F(T),S}if(!me&&(!ne(p)||!ne(g))){let O,T;const J=Ee(g),H=Ee(p);if(!ne(P)&&!isNaN(P)){const le=o.valueAsNumber||P&&+P;ne(J.value)||(O=le>J.value),ne(H.value)||(T=le<H.value)}else{const le=o.valueAsDate||new Date(P),se=Ae=>new Date(new Date().toDateString()+" "+Ae),Ze=o.type=="time",Ne=o.type=="week";ie(J.value)&&P&&(O=Ze?se(P)>se(J.value):Ne?P>J.value:le>new Date(J.value)),ie(H.value)&&P&&(T=Ze?se(P)<se(H.value):Ne?P<H.value:le<new Date(H.value))}if((O||T)&&(qe(!!O,J.message,H.message,ye.max,ye.min),!n))return F(S[x].message),S}if((f||_)&&!me&&(ie(P)||i&&Array.isArray(P))){const O=Ee(f),T=Ee(_),J=!ne(O.value)&&P.length>+O.value,H=!ne(T.value)&&P.length<+T.value;if((J||H)&&(qe(J,O.message,T.message),!n))return F(S[x].message),S}if(h&&!me&&ie(P)){const{value:O,message:T}=Ee(h);if(st(O)&&!P.match(O)&&(S[x]={type:ye.pattern,message:T,ref:o,...ae(ye.pattern,T)},!n))return F(T),S}if(E){if(re(E)){const O=await E(P,r),T=hr(O,V);if(T&&(S[x]={...T,...ae(ye.validate,T.message)},!n))return F(T.message),S}else if(B(E)){let O={};for(const T in E){if(!te(O)&&!n)break;const J=hr(await E[T](P,r),V,T);J&&(O={...J,...ae(T,J.message)},F(J.message),n&&(S[x]=O))}if(!te(O)&&(S[x]={ref:V,...O},!n))return S}}return F(!0),S};const ss={mode:de.onSubmit,reValidateMode:de.onChange,shouldFocusError:!0};function os(e={}){let t={...ss,...e},r={submitCount:0,isDirty:!1,isReady:!1,isLoading:re(t.defaultValues),isValidating:!1,isSubmitted:!1,isSubmitting:!1,isSubmitSuccessful:!1,isValid:!1,touchedFields:{},dirtyFields:{},validatingFields:{},errors:t.errors||{},disabled:t.disabled||!1},n={},s=B(t.defaultValues)||B(t.values)?M(t.defaultValues||t.values)||{}:{},i=t.shouldUnregister?{}:M(s),o={action:!1,mount:!1,watch:!1,keepIsValid:!1},a={mount:new Set,disabled:new Set,unMount:new Set,array:new Set,watch:new Set},l,f=0;const _={isDirty:!1,dirtyFields:!1,validatingFields:!1,touchedFields:!1,isValidating:!1,isValid:!1,errors:!1},p={..._};let g={...p};const h={array:ir(),state:ir()},E=t.criteriaMode===de.all,x=c=>u=>{clearTimeout(f),f=setTimeout(c,u)},U=async c=>{if(!o.keepIsValid&&!t.disabled&&(p.isValid||g.isValid||c)){let u;t.resolver?(u=te((await he()).errors),L()):u=await ae(n,!0),u!==r.isValid&&h.state.next({isValid:u})}},L=(c,u)=>{!t.disabled&&(p.isValidating||p.validatingFields||g.isValidating||g.validatingFields)&&((c||Array.from(a.mount)).forEach(d=>{d&&(u?N(r.validatingFields,d,u):q(r.validatingFields,d))}),h.state.next({validatingFields:r.validatingFields,isValidating:!te(r.validatingFields)}))},P=(c,u=[],d,w,b=!0,y=!0)=>{if(w&&d&&!t.disabled){if(o.action=!0,y&&Array.isArray(v(n,c))){const z=d(v(n,c),w.argA,w.argB);b&&N(n,c,z)}if(y&&Array.isArray(v(r.errors,c))){const z=d(v(r.errors,c),w.argA,w.argB);b&&N(r.errors,c,z),rs(r.errors,c)}if((p.touchedFields||g.touchedFields)&&y&&Array.isArray(v(r.touchedFields,c))){const z=d(v(r.touchedFields,c),w.argA,w.argB);b&&N(r.touchedFields,c,z)}(p.dirtyFields||g.dirtyFields)&&(r.dirtyFields=Pe(s,i)),h.state.next({name:c,isDirty:O(c,u),dirtyFields:r.dirtyFields,errors:r.errors,isValid:r.isValid})}else N(i,c,u)},V=(c,u)=>{N(r.errors,c,u),h.state.next({errors:r.errors})},F=c=>{r.errors=c,h.state.next({errors:r.errors,isValid:!1})},S=(c,u,d,w)=>{const b=v(n,c);if(b){const y=v(i,c,C(d)?v(s,c):d);C(y)||w&&w.defaultChecked||u?N(i,c,u?y:lr(b._f)):H(c,y),o.mount&&!o.action&&U()}},Y=(c,u,d,w,b)=>{let y=!1,z=!1;const D={name:c};if(!t.disabled){if(!d||w){(p.isDirty||g.isDirty)&&(z=r.isDirty,r.isDirty=D.isDirty=O(),y=z!==D.isDirty);const Z=fe(v(s,c),u);z=!!v(r.dirtyFields,c),Z?q(r.dirtyFields,c):N(r.dirtyFields,c,!0),D.dirtyFields=r.dirtyFields,y=y||(p.dirtyFields||g.dirtyFields)&&z!==!Z}if(d){const Z=v(r.touchedFields,c);Z||(N(r.touchedFields,c,d),D.touchedFields=r.touchedFields,y=y||(p.touchedFields||g.touchedFields)&&Z!==d)}y&&b&&h.state.next(D)}return y?D:{}},ue=(c,u,d,w)=>{const b=v(r.errors,c),y=(p.isValid||g.isValid)&&oe(u)&&r.isValid!==u;if(t.delayError&&d?(l=x(()=>V(c,d)),l(t.delayError)):(clearTimeout(f),l=null,d?N(r.errors,c,d):q(r.errors,c)),(d?!fe(b,d):b)||!te(w)||y){const z={...w,...y&&oe(u)?{isValid:u}:{},errors:r.errors,name:c};r={...r,...z},h.state.next(z)}},he=async c=>(L(c,!0),await t.resolver(i,t.context,Hn(c||a.mount,n,t.criteriaMode,t.shouldUseNativeValidation))),me=async c=>{const{errors:u}=await he(c);if(L(c),c)for(const d of c){const w=v(u,d);w?N(r.errors,d,w):q(r.errors,d)}else r.errors=u;return u},ae=async(c,u,d={valid:!0})=>{for(const w in c){const b=c[w];if(b){const{_f:y,...z}=b;if(y){const D=a.array.has(y.name),Z=b._f&&Gn(b._f);Z&&p.validatingFields&&L([y.name],!0);const Q=await yr(b,a.disabled,i,E,t.shouldUseNativeValidation&&!u,D);if(Z&&p.validatingFields&&L([y.name]),Q[y.name]&&(d.valid=!1,u||e.shouldUseNativeValidation))break;!u&&(v(Q,y.name)?D?ns(r.errors,Q,y.name):N(r.errors,y.name,Q[y.name]):q(r.errors,y.name))}!te(z)&&await ae(z,u,d)}}return d.valid},qe=()=>{for(const c of a.unMount){const u=v(n,c);u&&(u._f.refs?u._f.refs.every(d=>!kt(d)):!kt(u._f.ref))&&_t(c)}a.unMount=new Set},O=(c,u)=>!t.disabled&&(c&&u&&N(i,c,u),!fe(Kt(),s)),T=(c,u,d)=>xt(c,a,{...o.mount?i:C(u)?s:ie(c)?{[c]:u}:u},d,u),J=c=>Nt(v(o.mount?i:s,c,t.shouldUnregister?v(s,c,[]):[])),H=(c,u,d={})=>{const w=v(n,c);let b=u;if(w){const y=w._f;y&&(!y.disabled&&N(i,c,Kr(u,y)),b=nt(y.ref)&&ne(u)?"":u,Jr(y.ref)?[...y.ref.options].forEach(z=>z.selected=b.includes(z.value)):y.refs?Me(y.ref)?y.refs.forEach(z=>{(!z.defaultChecked||!z.disabled)&&(Array.isArray(b)?z.checked=!!b.find(D=>D===z.value):z.checked=b===z.value||!!b)}):y.refs.forEach(z=>z.checked=z.value===b):Rt(y.ref)?y.ref.value="":(y.ref.value=b,y.ref.type||h.state.next({name:c,values:M(i)})))}(d.shouldDirty||d.shouldTouch)&&Y(c,b,d.shouldTouch,d.shouldDirty,!0),d.shouldValidate&&Ae(c)},le=(c,u,d)=>{for(const w in u){if(!u.hasOwnProperty(w))return;const b=u[w],y=c+"."+w,z=v(n,y);(a.array.has(c)||B(b)||z&&!z._f)&&!Fe(b)?le(y,b,d):H(y,b,d)}},se=(c,u,d={})=>{const w=v(n,c),b=a.array.has(c),y=M(u);N(i,c,y),b?(h.array.next({name:c,values:M(i)}),(p.isDirty||p.dirtyFields||g.isDirty||g.dirtyFields)&&d.shouldDirty&&h.state.next({name:c,dirtyFields:Pe(s,i),isDirty:O(c,y)})):w&&!w._f&&!ne(y)?le(c,y,d):H(c,y,d),mr(c,a)?h.state.next({...r,name:c,values:M(i)}):h.state.next({name:o.mount?c:void 0,values:M(i)})},Ze=async c=>{o.mount=!0;const u=c.target;let d=u.name,w=!0;const b=v(n,d),y=Z=>{w=Number.isNaN(Z)||Fe(Z)&&isNaN(Z.getTime())||fe(Z,v(i,d,Z))},z=dr(t.mode),D=dr(t.reValidateMode);if(b){let Z,Q;const ze=u.type?lr(b._f):Lr(c),ge=c.type===rt.BLUR||c.type===rt.FOCUS_OUT,On=!Yn(b._f)&&!t.resolver&&!v(r.errors,d)&&!b._f.deps||ts(ge,v(r.touchedFields,d),r.isSubmitted,D,z),Ft=mr(d,a,ge);N(i,d,ze),ge?(!u||!u.readOnly)&&(b._f.onBlur&&b._f.onBlur(c),l&&l(0)):b._f.onChange&&b._f.onChange(c);const St=Y(d,ze,ge),Tn=!te(St)||Ft;if(!ge&&h.state.next({name:d,type:c.type,values:M(i)}),On)return(p.isValid||g.isValid)&&(t.mode==="onBlur"?ge&&U():ge||U()),Tn&&h.state.next({name:d,...Ft?{}:St});if(!ge&&Ft&&h.state.next({...r}),t.resolver){const{errors:sr}=await he([d]);if(L([d]),y(ze),w){const Dn=pr(r.errors,n,d),or=pr(sr,n,Dn.name||d);Z=or.error,d=or.name,Q=te(sr)}}else L([d],!0),Z=(await yr(b,a.disabled,i,E,t.shouldUseNativeValidation))[d],L([d]),y(ze),w&&(Z?Q=!1:(p.isValid||g.isValid)&&(Q=await ae(n,!0)));w&&(b._f.deps&&(!Array.isArray(b._f.deps)||b._f.deps.length>0)&&Ae(b._f.deps),ue(d,Q,Z,St))}},Ne=(c,u)=>{if(v(r.errors,u)&&c.focus)return c.focus(),1},Ae=async(c,u={})=>{let d,w;const b=Re(c);if(t.resolver){const y=await me(C(c)?c:b);d=te(y),w=c?!b.some(z=>v(y,z)):d}else c?(w=(await Promise.all(b.map(async y=>{const z=v(n,y);return await ae(z&&z._f?{[y]:z}:z)}))).every(Boolean),!(!w&&!r.isValid)&&U()):w=d=await ae(n);return h.state.next({...!ie(c)||(p.isValid||g.isValid)&&d!==r.isValid?{}:{name:c},...t.resolver||!c?{isValid:d}:{},errors:r.errors}),u.shouldFocus&&!w&&Ie(n,Ne,c?b:a.mount),w},Kt=(c,u)=>{let d={...o.mount?i:s};return u&&(d=Br(u.dirtyFields?r.dirtyFields:r.touchedFields,d)),C(c)?d:ie(c)?v(d,c):c.map(w=>v(d,w))},Ht=(c,u)=>({invalid:!!v((u||r).errors,c),isDirty:!!v((u||r).dirtyFields,c),error:v((u||r).errors,c),isValidating:!!v(r.validatingFields,c),isTouched:!!v((u||r).touchedFields,c)}),Fn=c=>{c&&Re(c).forEach(u=>q(r.errors,u)),h.state.next({errors:c?r.errors:{}})},Gt=(c,u,d)=>{const w=(v(n,c,{_f:{}})._f||{}).ref,b=v(r.errors,c)||{},{ref:y,message:z,type:D,...Z}=b;N(r.errors,c,{...Z,...u,ref:w}),h.state.next({name:c,errors:r.errors,isValid:!1}),d&&d.shouldFocus&&w&&w.focus&&w.focus()},Sn=(c,u)=>re(c)?h.state.subscribe({next:d=>"values"in d&&c(T(void 0,u),d)}):T(c,u,!0),Yt=c=>h.state.subscribe({next:u=>{es(c.name,u.name,c.exact)&&Qn(u,c.formState||p,Pn,c.reRenderRoot)&&c.callback({values:{...i},...r,...u,defaultValues:s})}}).unsubscribe,kn=c=>(o.mount=!0,g={...g,...c.formState},Yt({...c,formState:{..._,...c.formState}})),_t=(c,u={})=>{for(const d of c?Re(c):a.mount)a.mount.delete(d),a.array.delete(d),u.keepValue||(q(n,d),q(i,d)),!u.keepError&&q(r.errors,d),!u.keepDirty&&q(r.dirtyFields,d),!u.keepTouched&&q(r.touchedFields,d),!u.keepIsValidating&&q(r.validatingFields,d),!t.shouldUnregister&&!u.keepDefaultValue&&q(s,d);h.state.next({values:M(i)}),h.state.next({...r,...u.keepDirty?{isDirty:O()}:{}}),!u.keepIsValid&&U()},Qt=({disabled:c,name:u})=>{(oe(c)&&o.mount||c||a.disabled.has(u))&&(c?a.disabled.add(u):a.disabled.delete(u))},wt=(c,u={})=>{let d=v(n,c);const w=oe(u.disabled)||oe(t.disabled);return N(n,c,{...d||{},_f:{...d&&d._f?d._f:{ref:{name:c}},name:c,mount:!0,...u}}),a.mount.add(c),d?Qt({disabled:oe(u.disabled)?u.disabled:t.disabled,name:c}):S(c,!0,u.value),{...w?{disabled:u.disabled||t.disabled}:{},...t.progressive?{required:!!u.required,min:je(u.min),max:je(u.max),minLength:je(u.minLength),maxLength:je(u.maxLength),pattern:je(u.pattern)}:{},name:c,onChange:Ze,onBlur:Ze,ref:b=>{if(b){wt(c,u),d=v(n,c);const y=C(b.value)&&b.querySelectorAll&&b.querySelectorAll("input,select,textarea")[0]||b,z=Jn(y),D=d._f.refs||[];if(z?D.find(Z=>Z===y):y===d._f.ref)return;N(n,c,{_f:{...d._f,...z?{refs:[...D.filter(kt),y,...Array.isArray(v(s,c))?[{}]:[]],ref:{type:y.type,name:c}}:{ref:y}}}),S(c,!1,void 0,y)}else d=v(n,c,{}),d._f&&(d._f.mount=!1),(t.shouldUnregister||u.shouldUnregister)&&!(Mr(a.array,c)&&o.action)&&a.unMount.add(c)}}},zt=()=>t.shouldFocusError&&Ie(n,Ne,a.mount),xn=c=>{oe(c)&&(h.state.next({disabled:c}),Ie(n,(u,d)=>{const w=v(n,d);w&&(u.disabled=w._f.disabled||c,Array.isArray(w._f.refs)&&w._f.refs.forEach(b=>{b.disabled=w._f.disabled||c}))},0,!1))},er=(c,u)=>async d=>{let w;d&&(d.preventDefault&&d.preventDefault(),d.persist&&d.persist());let b=M(i);if(h.state.next({isSubmitting:!0}),t.resolver){const{errors:y,values:z}=await he();L(),r.errors=y,b=M(z)}else await ae(n);if(a.disabled.size)for(const y of a.disabled)q(b,y);if(q(r.errors,"root"),te(r.errors)){h.state.next({errors:{}});try{await c(b,d)}catch(y){w=y}}else u&&await u({...r.errors},d),zt(),setTimeout(zt);if(h.state.next({isSubmitted:!0,isSubmitting:!1,isSubmitSuccessful:te(r.errors)&&!w,submitCount:r.submitCount+1,errors:r.errors}),w)throw w},$n=(c,u={})=>{v(n,c)&&(C(u.defaultValue)?se(c,M(v(s,c))):(se(c,u.defaultValue),N(s,c,M(u.defaultValue))),u.keepTouched||q(r.touchedFields,c),u.keepDirty||(q(r.dirtyFields,c),r.isDirty=u.defaultValue?O(c,M(v(s,c))):O()),u.keepError||(q(r.errors,c),p.isValid&&U()),h.state.next({...r}))},tr=(c,u={})=>{const d=c?M(c):s,w=M(d),b=te(c),y=b?s:w;if(u.keepDefaultValues||(s=d),!u.keepValues){if(u.keepDirtyValues){const z=new Set([...a.mount,...Object.keys(Pe(s,i))]);for(const D of Array.from(z)){const Z=v(r.dirtyFields,D),Q=v(i,D),ze=v(y,D);Z&&!C(Q)?N(y,D,Q):!Z&&!C(ze)&&se(D,ze)}}else{if(Zt&&C(c))for(const z of a.mount){const D=v(n,z);if(D&&D._f){const Z=Array.isArray(D._f.refs)?D._f.refs[0]:D._f.ref;if(nt(Z)){const Q=Z.closest("form");if(Q){Q.reset();break}}}}if(u.keepFieldsRef)for(const z of a.mount)se(z,v(y,z));else n={}}i=t.shouldUnregister?u.keepDefaultValues?M(s):{}:M(y),h.array.next({values:{...y}}),h.state.next({values:{...y}})}a={mount:u.keepDirtyValues?a.mount:new Set,unMount:new Set,array:new Set,disabled:new Set,watch:new Set,watchAll:!1,focus:""},o.mount=!p.isValid||!!u.keepIsValid||!!u.keepDirtyValues||!t.shouldUnregister&&!te(y),o.watch=!!t.shouldUnregister,o.keepIsValid=!!u.keepIsValid,o.action=!1,u.keepErrors||(r.errors={}),h.state.next({submitCount:u.keepSubmitCount?r.submitCount:0,isDirty:b?!1:u.keepDirty?r.isDirty:!!(u.keepDefaultValues&&!fe(c,s)),isSubmitted:u.keepIsSubmitted?r.isSubmitted:!1,dirtyFields:b?{}:u.keepDirtyValues?u.keepDefaultValues&&i?Pe(s,i):r.dirtyFields:u.keepDefaultValues&&c?Pe(s,c):u.keepDirty?r.dirtyFields:{},touchedFields:u.keepTouched?r.touchedFields:{},errors:u.keepErrors?r.errors:{},isSubmitSuccessful:u.keepIsSubmitSuccessful?r.isSubmitSuccessful:!1,isSubmitting:!1,defaultValues:s})},rr=(c,u)=>tr(re(c)?c(i):c,{...t.resetOptions,...u}),En=(c,u={})=>{const d=v(n,c),w=d&&d._f;if(w){const b=w.refs?w.refs[0]:w.ref;b.focus&&setTimeout(()=>{b.focus(),u.shouldSelect&&re(b.select)&&b.select()})}},Pn=c=>{r={...r,...c}},nr={control:{register:wt,unregister:_t,getFieldState:Ht,handleSubmit:er,setError:Gt,_subscribe:Yt,_runSchema:he,_updateIsValidating:L,_focusError:zt,_getWatch:T,_getDirty:O,_setValid:U,_setFieldArray:P,_setDisabledField:Qt,_setErrors:F,_getFieldArray:J,_reset:tr,_resetDefaultValues:()=>re(t.defaultValues)&&t.defaultValues().then(c=>{rr(c,t.resetOptions),h.state.next({isLoading:!1})}),_removeUnmounted:qe,_disableForm:xn,_subjects:h,_proxyFormState:p,get _fields(){return n},get _formValues(){return i},get _state(){return o},set _state(c){o=c},get _defaultValues(){return s},get _names(){return a},set _names(c){a=c},get _formState(){return r},get _options(){return t},set _options(c){t={...t,...c}}},subscribe:kn,trigger:Ae,register:wt,handleSubmit:er,watch:Sn,setValue:se,getValues:Kt,reset:rr,resetField:$n,clearErrors:Fn,unregister:_t,setError:Gt,setFocus:En,getFieldState:Ht};return{...nr,formControl:nr}}function is(e={}){const t=$.useRef(void 0),r=$.useRef(void 0),[n,s]=$.useState({isDirty:!1,isValidating:!1,isLoading:re(e.defaultValues),isSubmitted:!1,isSubmitting:!1,isSubmitSuccessful:!1,isValid:!1,submitCount:0,dirtyFields:{},touchedFields:{},validatingFields:{},errors:e.errors||{},disabled:e.disabled||!1,isReady:!1,defaultValues:re(e.defaultValues)?void 0:e.defaultValues});if(!t.current)if(e.formControl)t.current={...e.formControl,formState:n},e.defaultValues&&!re(e.defaultValues)&&e.formControl.reset(e.defaultValues,e.resetOptions);else{const{formControl:o,...a}=os(e);t.current={...a,formState:n}}const i=t.current.control;return i._options=e,jt(()=>{const o=i._subscribe({formState:i._proxyFormState,callback:()=>s({...i._formState}),reRenderRoot:!0});return s(a=>({...a,isReady:!0})),i._formState.isReady=!0,o},[i]),$.useEffect(()=>i._disableForm(e.disabled),[i,e.disabled]),$.useEffect(()=>{e.mode&&(i._options.mode=e.mode),e.reValidateMode&&(i._options.reValidateMode=e.reValidateMode)},[i,e.mode,e.reValidateMode]),$.useEffect(()=>{e.errors&&(i._setErrors(e.errors),i._focusError())},[i,e.errors]),$.useEffect(()=>{e.shouldUnregister&&i._subjects.state.next({values:i._getWatch()})},[i,e.shouldUnregister]),$.useEffect(()=>{if(i._proxyFormState.isDirty){const o=i._getDirty();o!==n.isDirty&&i._subjects.state.next({isDirty:o})}},[i,n.isDirty]),$.useEffect(()=>{var o;e.values&&!fe(e.values,r.current)?(i._reset(e.values,{keepFieldsRef:!0,...i._options.resetOptions}),!((o=i._options.resetOptions)===null||o===void 0)&&o.keepIsValid||i._setValid(),r.current=e.values,s(a=>({...a}))):i._resetDefaultValues()},[i,e.values]),$.useEffect(()=>{i._state.mount||(i._setValid(),i._state.mount=!0),i._state.watch&&(i._state.watch=!1,i._subjects.state.next({...i._formState})),i._removeUnmounted()}),t.current.formState=qr(n,i),t.current}const gr=(e,t,r)=>{if(e&&"reportValidity"in e){const n=v(r,t);e.setCustomValidity(n&&n.message||""),e.reportValidity()}},Pt=(e,t)=>{for(const r in t.fields){const n=t.fields[r];n&&n.ref&&"reportValidity"in n.ref?gr(n.ref,r,e):n&&n.refs&&n.refs.forEach(s=>gr(s,r,e))}},br=(e,t)=>{t.shouldUseNativeValidation&&Pt(e,t);const r={};for(const n in e){const s=v(t.fields,n),i=Object.assign(e[n]||{},{ref:s&&s.ref});if(as(t.names||Object.keys(e),n)){const o=Object.assign({},v(r,n));N(o,"root",i),N(r,n,o)}else N(r,n,i)}return r},as=(e,t)=>{const r=vr(t);return e.some(n=>vr(n).match(`^${r}\\.\\d+`))};function vr(e){return e.replace(/\]|\[/g,"")}function m(e,t,r){function n(a,l){if(a._zod||Object.defineProperty(a,"_zod",{value:{def:l,constr:o,traits:new Set},enumerable:!1}),a._zod.traits.has(e))return;a._zod.traits.add(e),t(a,l);const f=o.prototype,_=Object.keys(f);for(let p=0;p<_.length;p++){const g=_[p];g in a||(a[g]=f[g].bind(a))}}const s=r?.Parent??Object;class i extends s{}Object.defineProperty(i,"name",{value:e});function o(a){var l;const f=r?.Parent?new i:this;n(f,a),(l=f._zod).deferred??(l.deferred=[]);for(const _ of f._zod.deferred)_();return f}return Object.defineProperty(o,"init",{value:n}),Object.defineProperty(o,Symbol.hasInstance,{value:a=>r?.Parent&&a instanceof r.Parent?!0:a?._zod?.traits?.has(e)}),Object.defineProperty(o,"name",{value:e}),o}class Te extends Error{constructor(){super("Encountered Promise during synchronous parse. Use .parseAsync() instead.")}}class Gr extends Error{constructor(t){super(`Encountered unidirectional transform during encode: ${t}`),this.name="ZodEncodeError"}}const Yr={};function Se(e){return Yr}function Qr(e){const t=Object.values(e).filter(n=>typeof n=="number");return Object.entries(e).filter(([n,s])=>t.indexOf(+n)===-1).map(([n,s])=>s)}function Ot(e,t){return typeof t=="bigint"?t.toString():t}function Ut(e){return{get value(){{const t=e();return Object.defineProperty(this,"value",{value:t}),t}}}}function Lt(e){return e==null}function Mt(e){const t=e.startsWith("^")?1:0,r=e.endsWith("$")?e.length-1:e.length;return e.slice(t,r)}const _r=Symbol("evaluating");function A(e,t,r){let n;Object.defineProperty(e,t,{get(){if(n!==_r)return n===void 0&&(n=_r,n=r()),n},set(s){Object.defineProperty(e,t,{value:s})},configurable:!0})}function xe(e,t,r){Object.defineProperty(e,t,{value:r,writable:!0,enumerable:!0,configurable:!0})}function ve(...e){const t={};for(const r of e){const n=Object.getOwnPropertyDescriptors(r);Object.assign(t,n)}return Object.defineProperties({},t)}function wr(e){return JSON.stringify(e)}function cs(e){return e.toLowerCase().trim().replace(/[^\w\s-]/g,"").replace(/[\s_-]+/g,"-").replace(/^-+|-+$/g,"")}const en="captureStackTrace"in Error?Error.captureStackTrace:(...e)=>{};function ot(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)}const us=Ut(()=>{if(typeof navigator<"u"&&navigator?.userAgent?.includes("Cloudflare"))return!1;try{const e=Function;return new e(""),!0}catch{return!1}});function Ue(e){if(ot(e)===!1)return!1;const t=e.constructor;if(t===void 0||typeof t!="function")return!0;const r=t.prototype;return!(ot(r)===!1||Object.prototype.hasOwnProperty.call(r,"isPrototypeOf")===!1)}function tn(e){return Ue(e)?{...e}:Array.isArray(e)?[...e]:e}const ls=new Set(["string","number","symbol"]);function dt(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function _e(e,t,r){const n=new e._zod.constr(t??e._zod.def);return(!t||r?.parent)&&(n._zod.parent=e),n}function k(e){const t=e;if(!t)return{};if(typeof t=="string")return{error:()=>t};if(t?.message!==void 0){if(t?.error!==void 0)throw new Error("Cannot specify both `message` and `error` params");t.error=t.message}return delete t.message,typeof t.error=="string"?{...t,error:()=>t.error}:t}function ds(e){return Object.keys(e).filter(t=>e[t]._zod.optin==="optional"&&e[t]._zod.optout==="optional")}function fs(e,t){const r=e._zod.def,n=r.checks;if(n&&n.length>0)throw new Error(".pick() cannot be used on object schemas containing refinements");const i=ve(e._zod.def,{get shape(){const o={};for(const a in t){if(!(a in r.shape))throw new Error(`Unrecognized key: "${a}"`);t[a]&&(o[a]=r.shape[a])}return xe(this,"shape",o),o},checks:[]});return _e(e,i)}function ms(e,t){const r=e._zod.def,n=r.checks;if(n&&n.length>0)throw new Error(".omit() cannot be used on object schemas containing refinements");const i=ve(e._zod.def,{get shape(){const o={...e._zod.def.shape};for(const a in t){if(!(a in r.shape))throw new Error(`Unrecognized key: "${a}"`);t[a]&&delete o[a]}return xe(this,"shape",o),o},checks:[]});return _e(e,i)}function ps(e,t){if(!Ue(t))throw new Error("Invalid input to extend: expected a plain object");const r=e._zod.def.checks;if(r&&r.length>0){const i=e._zod.def.shape;for(const o in t)if(Object.getOwnPropertyDescriptor(i,o)!==void 0)throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.")}const s=ve(e._zod.def,{get shape(){const i={...e._zod.def.shape,...t};return xe(this,"shape",i),i}});return _e(e,s)}function hs(e,t){if(!Ue(t))throw new Error("Invalid input to safeExtend: expected a plain object");const r=ve(e._zod.def,{get shape(){const n={...e._zod.def.shape,...t};return xe(this,"shape",n),n}});return _e(e,r)}function ys(e,t){const r=ve(e._zod.def,{get shape(){const n={...e._zod.def.shape,...t._zod.def.shape};return xe(this,"shape",n),n},get catchall(){return t._zod.def.catchall},checks:[]});return _e(e,r)}function gs(e,t,r){const s=t._zod.def.checks;if(s&&s.length>0)throw new Error(".partial() cannot be used on object schemas containing refinements");const o=ve(t._zod.def,{get shape(){const a=t._zod.def.shape,l={...a};if(r)for(const f in r){if(!(f in a))throw new Error(`Unrecognized key: "${f}"`);r[f]&&(l[f]=e?new e({type:"optional",innerType:a[f]}):a[f])}else for(const f in a)l[f]=e?new e({type:"optional",innerType:a[f]}):a[f];return xe(this,"shape",l),l},checks:[]});return _e(t,o)}function bs(e,t,r){const n=ve(t._zod.def,{get shape(){const s=t._zod.def.shape,i={...s};if(r)for(const o in r){if(!(o in i))throw new Error(`Unrecognized key: "${o}"`);r[o]&&(i[o]=new e({type:"nonoptional",innerType:s[o]}))}else for(const o in s)i[o]=new e({type:"nonoptional",innerType:s[o]});return xe(this,"shape",i),i}});return _e(t,n)}function Oe(e,t=0){if(e.aborted===!0)return!0;for(let r=t;r<e.issues.length;r++)if(e.issues[r]?.continue!==!0)return!0;return!1}function rn(e,t){return t.map(r=>{var n;return(n=r).path??(n.path=[]),r.path.unshift(e),r})}function Be(e){return typeof e=="string"?e:e?.message}function ke(e,t,r){const n={...e,path:e.path??[]};if(!e.message){const s=Be(e.inst?._zod.def?.error?.(e))??Be(t?.error?.(e))??Be(r.customError?.(e))??Be(r.localeError?.(e))??"Invalid input";n.message=s}return delete n.inst,delete n.continue,t?.reportInput||delete n.input,n}function qt(e){return Array.isArray(e)?"array":typeof e=="string"?"string":"unknown"}function Le(...e){const[t,r,n]=e;return typeof t=="string"?{message:t,code:"custom",input:r,inst:n}:{...t}}const nn=(e,t)=>{e.name="$ZodError",Object.defineProperty(e,"_zod",{value:e._zod,enumerable:!1}),Object.defineProperty(e,"issues",{value:t,enumerable:!1}),e.message=JSON.stringify(t,Ot,2),Object.defineProperty(e,"toString",{value:()=>e.message,enumerable:!1})},Bt=m("$ZodError",nn),ft=m("$ZodError",nn,{Parent:Error});function vs(e,t=r=>r.message){const r={},n=[];for(const s of e.issues)s.path.length>0?(r[s.path[0]]=r[s.path[0]]||[],r[s.path[0]].push(t(s))):n.push(t(s));return{formErrors:n,fieldErrors:r}}function _s(e,t=r=>r.message){const r={_errors:[]},n=s=>{for(const i of s.issues)if(i.code==="invalid_union"&&i.errors.length)i.errors.map(o=>n({issues:o}));else if(i.code==="invalid_key")n({issues:i.issues});else if(i.code==="invalid_element")n({issues:i.issues});else if(i.path.length===0)r._errors.push(t(i));else{let o=r,a=0;for(;a<i.path.length;){const l=i.path[a];a===i.path.length-1?(o[l]=o[l]||{_errors:[]},o[l]._errors.push(t(i))):o[l]=o[l]||{_errors:[]},o=o[l],a++}}};return n(e),r}const mt=e=>(t,r,n,s)=>{const i=n?Object.assign(n,{async:!1}):{async:!1},o=t._zod.run({value:r,issues:[]},i);if(o instanceof Promise)throw new Te;if(o.issues.length){const a=new(s?.Err??e)(o.issues.map(l=>ke(l,i,Se())));throw en(a,s?.callee),a}return o.value},ws=mt(ft),pt=e=>async(t,r,n,s)=>{const i=n?Object.assign(n,{async:!0}):{async:!0};let o=t._zod.run({value:r,issues:[]},i);if(o instanceof Promise&&(o=await o),o.issues.length){const a=new(s?.Err??e)(o.issues.map(l=>ke(l,i,Se())));throw en(a,s?.callee),a}return o.value},zs=pt(ft),ht=e=>(t,r,n)=>{const s=n?{...n,async:!1}:{async:!1},i=t._zod.run({value:r,issues:[]},s);if(i instanceof Promise)throw new Te;return i.issues.length?{success:!1,error:new(e??Bt)(i.issues.map(o=>ke(o,s,Se())))}:{success:!0,data:i.value}},Fs=ht(ft),yt=e=>async(t,r,n)=>{const s=n?Object.assign(n,{async:!0}):{async:!0};let i=t._zod.run({value:r,issues:[]},s);return i instanceof Promise&&(i=await i),i.issues.length?{success:!1,error:new e(i.issues.map(o=>ke(o,s,Se())))}:{success:!0,data:i.value}},Ss=yt(ft),ks=e=>(t,r,n)=>{const s=n?Object.assign(n,{direction:"backward"}):{direction:"backward"};return mt(e)(t,r,s)},xs=e=>(t,r,n)=>mt(e)(t,r,n),$s=e=>async(t,r,n)=>{const s=n?Object.assign(n,{direction:"backward"}):{direction:"backward"};return pt(e)(t,r,s)},Es=e=>async(t,r,n)=>pt(e)(t,r,n),Ps=e=>(t,r,n)=>{const s=n?Object.assign(n,{direction:"backward"}):{direction:"backward"};return ht(e)(t,r,s)},Os=e=>(t,r,n)=>ht(e)(t,r,n),Ts=e=>async(t,r,n)=>{const s=n?Object.assign(n,{direction:"backward"}):{direction:"backward"};return yt(e)(t,r,s)},Ds=e=>async(t,r,n)=>yt(e)(t,r,n),Zs=/^[cC][^\s-]{8,}$/,Ns=/^[0-9a-z]+$/,As=/^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/,Vs=/^[0-9a-vA-V]{20}$/,js=/^[A-Za-z0-9]{27}$/,Cs=/^[a-zA-Z0-9_-]{21}$/,Rs=/^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/,Is=/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,zr=e=>e?new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`):/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,Us=/^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,Ls="^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";function Ms(){return new RegExp(Ls,"u")}const qs=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,Bs=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,Js=/^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,Xs=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,Ws=/^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,sn=/^[A-Za-z0-9_-]*$/,Ks=/^\+[1-9]\d{6,14}$/,on="(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))",Hs=new RegExp(`^${on}$`);function an(e){const t="(?:[01]\\d|2[0-3]):[0-5]\\d";return typeof e.precision=="number"?e.precision===-1?`${t}`:e.precision===0?`${t}:[0-5]\\d`:`${t}:[0-5]\\d\\.\\d{${e.precision}}`:`${t}(?::[0-5]\\d(?:\\.\\d+)?)?`}function Gs(e){return new RegExp(`^${an(e)}$`)}function Ys(e){const t=an({precision:e.precision}),r=["Z"];e.local&&r.push(""),e.offset&&r.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");const n=`${t}(?:${r.join("|")})`;return new RegExp(`^${on}T(?:${n})$`)}const Qs=e=>{const t=e?`[\\s\\S]{${e?.minimum??0},${e?.maximum??""}}`:"[\\s\\S]*";return new RegExp(`^${t}$`)},eo=/^[^A-Z]*$/,to=/^[^a-z]*$/,pe=m("$ZodCheck",(e,t)=>{var r;e._zod??(e._zod={}),e._zod.def=t,(r=e._zod).onattach??(r.onattach=[])}),ro=m("$ZodCheckMaxLength",(e,t)=>{var r;pe.init(e,t),(r=e._zod.def).when??(r.when=n=>{const s=n.value;return!Lt(s)&&s.length!==void 0}),e._zod.onattach.push(n=>{const s=n._zod.bag.maximum??Number.POSITIVE_INFINITY;t.maximum<s&&(n._zod.bag.maximum=t.maximum)}),e._zod.check=n=>{const s=n.value;if(s.length<=t.maximum)return;const o=qt(s);n.issues.push({origin:o,code:"too_big",maximum:t.maximum,inclusive:!0,input:s,inst:e,continue:!t.abort})}}),no=m("$ZodCheckMinLength",(e,t)=>{var r;pe.init(e,t),(r=e._zod.def).when??(r.when=n=>{const s=n.value;return!Lt(s)&&s.length!==void 0}),e._zod.onattach.push(n=>{const s=n._zod.bag.minimum??Number.NEGATIVE_INFINITY;t.minimum>s&&(n._zod.bag.minimum=t.minimum)}),e._zod.check=n=>{const s=n.value;if(s.length>=t.minimum)return;const o=qt(s);n.issues.push({origin:o,code:"too_small",minimum:t.minimum,inclusive:!0,input:s,inst:e,continue:!t.abort})}}),so=m("$ZodCheckLengthEquals",(e,t)=>{var r;pe.init(e,t),(r=e._zod.def).when??(r.when=n=>{const s=n.value;return!Lt(s)&&s.length!==void 0}),e._zod.onattach.push(n=>{const s=n._zod.bag;s.minimum=t.length,s.maximum=t.length,s.length=t.length}),e._zod.check=n=>{const s=n.value,i=s.length;if(i===t.length)return;const o=qt(s),a=i>t.length;n.issues.push({origin:o,...a?{code:"too_big",maximum:t.length}:{code:"too_small",minimum:t.length},inclusive:!0,exact:!0,input:n.value,inst:e,continue:!t.abort})}}),gt=m("$ZodCheckStringFormat",(e,t)=>{var r,n;pe.init(e,t),e._zod.onattach.push(s=>{const i=s._zod.bag;i.format=t.format,t.pattern&&(i.patterns??(i.patterns=new Set),i.patterns.add(t.pattern))}),t.pattern?(r=e._zod).check??(r.check=s=>{t.pattern.lastIndex=0,!t.pattern.test(s.value)&&s.issues.push({origin:"string",code:"invalid_format",format:t.format,input:s.value,...t.pattern?{pattern:t.pattern.toString()}:{},inst:e,continue:!t.abort})}):(n=e._zod).check??(n.check=()=>{})}),oo=m("$ZodCheckRegex",(e,t)=>{gt.init(e,t),e._zod.check=r=>{t.pattern.lastIndex=0,!t.pattern.test(r.value)&&r.issues.push({origin:"string",code:"invalid_format",format:"regex",input:r.value,pattern:t.pattern.toString(),inst:e,continue:!t.abort})}}),io=m("$ZodCheckLowerCase",(e,t)=>{t.pattern??(t.pattern=eo),gt.init(e,t)}),ao=m("$ZodCheckUpperCase",(e,t)=>{t.pattern??(t.pattern=to),gt.init(e,t)}),co=m("$ZodCheckIncludes",(e,t)=>{pe.init(e,t);const r=dt(t.includes),n=new RegExp(typeof t.position=="number"?`^.{${t.position}}${r}`:r);t.pattern=n,e._zod.onattach.push(s=>{const i=s._zod.bag;i.patterns??(i.patterns=new Set),i.patterns.add(n)}),e._zod.check=s=>{s.value.includes(t.includes,t.position)||s.issues.push({origin:"string",code:"invalid_format",format:"includes",includes:t.includes,input:s.value,inst:e,continue:!t.abort})}}),uo=m("$ZodCheckStartsWith",(e,t)=>{pe.init(e,t);const r=new RegExp(`^${dt(t.prefix)}.*`);t.pattern??(t.pattern=r),e._zod.onattach.push(n=>{const s=n._zod.bag;s.patterns??(s.patterns=new Set),s.patterns.add(r)}),e._zod.check=n=>{n.value.startsWith(t.prefix)||n.issues.push({origin:"string",code:"invalid_format",format:"starts_with",prefix:t.prefix,input:n.value,inst:e,continue:!t.abort})}}),lo=m("$ZodCheckEndsWith",(e,t)=>{pe.init(e,t);const r=new RegExp(`.*${dt(t.suffix)}$`);t.pattern??(t.pattern=r),e._zod.onattach.push(n=>{const s=n._zod.bag;s.patterns??(s.patterns=new Set),s.patterns.add(r)}),e._zod.check=n=>{n.value.endsWith(t.suffix)||n.issues.push({origin:"string",code:"invalid_format",format:"ends_with",suffix:t.suffix,input:n.value,inst:e,continue:!t.abort})}}),fo=m("$ZodCheckOverwrite",(e,t)=>{pe.init(e,t),e._zod.check=r=>{r.value=t.tx(r.value)}});class mo{constructor(t=[]){this.content=[],this.indent=0,this&&(this.args=t)}indented(t){this.indent+=1,t(this),this.indent-=1}write(t){if(typeof t=="function"){t(this,{execution:"sync"}),t(this,{execution:"async"});return}const n=t.split(`
`).filter(o=>o),s=Math.min(...n.map(o=>o.length-o.trimStart().length)),i=n.map(o=>o.slice(s)).map(o=>" ".repeat(this.indent*2)+o);for(const o of i)this.content.push(o)}compile(){const t=Function,r=this?.args,s=[...(this?.content??[""]).map(i=>`  ${i}`)];return new t(...r,s.join(`
`))}}const po={major:4,minor:3,patch:5},X=m("$ZodType",(e,t)=>{var r;e??(e={}),e._zod.def=t,e._zod.bag=e._zod.bag||{},e._zod.version=po;const n=[...e._zod.def.checks??[]];e._zod.traits.has("$ZodCheck")&&n.unshift(e);for(const s of n)for(const i of s._zod.onattach)i(e);if(n.length===0)(r=e._zod).deferred??(r.deferred=[]),e._zod.deferred?.push(()=>{e._zod.run=e._zod.parse});else{const s=(o,a,l)=>{let f=Oe(o),_;for(const p of a){if(p._zod.def.when){if(!p._zod.def.when(o))continue}else if(f)continue;const g=o.issues.length,h=p._zod.check(o);if(h instanceof Promise&&l?.async===!1)throw new Te;if(_||h instanceof Promise)_=(_??Promise.resolve()).then(async()=>{await h,o.issues.length!==g&&(f||(f=Oe(o,g)))});else{if(o.issues.length===g)continue;f||(f=Oe(o,g))}}return _?_.then(()=>o):o},i=(o,a,l)=>{if(Oe(o))return o.aborted=!0,o;const f=s(a,n,l);if(f instanceof Promise){if(l.async===!1)throw new Te;return f.then(_=>e._zod.parse(_,l))}return e._zod.parse(f,l)};e._zod.run=(o,a)=>{if(a.skipChecks)return e._zod.parse(o,a);if(a.direction==="backward"){const f=e._zod.parse({value:o.value,issues:[]},{...a,skipChecks:!0});return f instanceof Promise?f.then(_=>i(_,o,a)):i(f,o,a)}const l=e._zod.parse(o,a);if(l instanceof Promise){if(a.async===!1)throw new Te;return l.then(f=>s(f,n,a))}return s(l,n,a)}}A(e,"~standard",()=>({validate:s=>{try{const i=Fs(e,s);return i.success?{value:i.data}:{issues:i.error?.issues}}catch{return Ss(e,s).then(o=>o.success?{value:o.data}:{issues:o.error?.issues})}},vendor:"zod",version:1}))}),Jt=m("$ZodString",(e,t)=>{X.init(e,t),e._zod.pattern=[...e?._zod.bag?.patterns??[]].pop()??Qs(e._zod.bag),e._zod.parse=(r,n)=>{if(t.coerce)try{r.value=String(r.value)}catch{}return typeof r.value=="string"||r.issues.push({expected:"string",code:"invalid_type",input:r.value,inst:e}),r}}),R=m("$ZodStringFormat",(e,t)=>{gt.init(e,t),Jt.init(e,t)}),ho=m("$ZodGUID",(e,t)=>{t.pattern??(t.pattern=Is),R.init(e,t)}),yo=m("$ZodUUID",(e,t)=>{if(t.version){const n={v1:1,v2:2,v3:3,v4:4,v5:5,v6:6,v7:7,v8:8}[t.version];if(n===void 0)throw new Error(`Invalid UUID version: "${t.version}"`);t.pattern??(t.pattern=zr(n))}else t.pattern??(t.pattern=zr());R.init(e,t)}),go=m("$ZodEmail",(e,t)=>{t.pattern??(t.pattern=Us),R.init(e,t)}),bo=m("$ZodURL",(e,t)=>{R.init(e,t),e._zod.check=r=>{try{const n=r.value.trim(),s=new URL(n);t.hostname&&(t.hostname.lastIndex=0,t.hostname.test(s.hostname)||r.issues.push({code:"invalid_format",format:"url",note:"Invalid hostname",pattern:t.hostname.source,input:r.value,inst:e,continue:!t.abort})),t.protocol&&(t.protocol.lastIndex=0,t.protocol.test(s.protocol.endsWith(":")?s.protocol.slice(0,-1):s.protocol)||r.issues.push({code:"invalid_format",format:"url",note:"Invalid protocol",pattern:t.protocol.source,input:r.value,inst:e,continue:!t.abort})),t.normalize?r.value=s.href:r.value=n;return}catch{r.issues.push({code:"invalid_format",format:"url",input:r.value,inst:e,continue:!t.abort})}}}),vo=m("$ZodEmoji",(e,t)=>{t.pattern??(t.pattern=Ms()),R.init(e,t)}),_o=m("$ZodNanoID",(e,t)=>{t.pattern??(t.pattern=Cs),R.init(e,t)}),wo=m("$ZodCUID",(e,t)=>{t.pattern??(t.pattern=Zs),R.init(e,t)}),zo=m("$ZodCUID2",(e,t)=>{t.pattern??(t.pattern=Ns),R.init(e,t)}),Fo=m("$ZodULID",(e,t)=>{t.pattern??(t.pattern=As),R.init(e,t)}),So=m("$ZodXID",(e,t)=>{t.pattern??(t.pattern=Vs),R.init(e,t)}),ko=m("$ZodKSUID",(e,t)=>{t.pattern??(t.pattern=js),R.init(e,t)}),xo=m("$ZodISODateTime",(e,t)=>{t.pattern??(t.pattern=Ys(t)),R.init(e,t)}),$o=m("$ZodISODate",(e,t)=>{t.pattern??(t.pattern=Hs),R.init(e,t)}),Eo=m("$ZodISOTime",(e,t)=>{t.pattern??(t.pattern=Gs(t)),R.init(e,t)}),Po=m("$ZodISODuration",(e,t)=>{t.pattern??(t.pattern=Rs),R.init(e,t)}),Oo=m("$ZodIPv4",(e,t)=>{t.pattern??(t.pattern=qs),R.init(e,t),e._zod.bag.format="ipv4"}),To=m("$ZodIPv6",(e,t)=>{t.pattern??(t.pattern=Bs),R.init(e,t),e._zod.bag.format="ipv6",e._zod.check=r=>{try{new URL(`http://[${r.value}]`)}catch{r.issues.push({code:"invalid_format",format:"ipv6",input:r.value,inst:e,continue:!t.abort})}}}),Do=m("$ZodCIDRv4",(e,t)=>{t.pattern??(t.pattern=Js),R.init(e,t)}),Zo=m("$ZodCIDRv6",(e,t)=>{t.pattern??(t.pattern=Xs),R.init(e,t),e._zod.check=r=>{const n=r.value.split("/");try{if(n.length!==2)throw new Error;const[s,i]=n;if(!i)throw new Error;const o=Number(i);if(`${o}`!==i)throw new Error;if(o<0||o>128)throw new Error;new URL(`http://[${s}]`)}catch{r.issues.push({code:"invalid_format",format:"cidrv6",input:r.value,inst:e,continue:!t.abort})}}});function cn(e){if(e==="")return!0;if(e.length%4!==0)return!1;try{return atob(e),!0}catch{return!1}}const No=m("$ZodBase64",(e,t)=>{t.pattern??(t.pattern=Ws),R.init(e,t),e._zod.bag.contentEncoding="base64",e._zod.check=r=>{cn(r.value)||r.issues.push({code:"invalid_format",format:"base64",input:r.value,inst:e,continue:!t.abort})}});function Ao(e){if(!sn.test(e))return!1;const t=e.replace(/[-_]/g,n=>n==="-"?"+":"/"),r=t.padEnd(Math.ceil(t.length/4)*4,"=");return cn(r)}const Vo=m("$ZodBase64URL",(e,t)=>{t.pattern??(t.pattern=sn),R.init(e,t),e._zod.bag.contentEncoding="base64url",e._zod.check=r=>{Ao(r.value)||r.issues.push({code:"invalid_format",format:"base64url",input:r.value,inst:e,continue:!t.abort})}}),jo=m("$ZodE164",(e,t)=>{t.pattern??(t.pattern=Ks),R.init(e,t)});function Co(e,t=null){try{const r=e.split(".");if(r.length!==3)return!1;const[n]=r;if(!n)return!1;const s=JSON.parse(atob(n));return!("typ"in s&&s?.typ!=="JWT"||!s.alg||t&&(!("alg"in s)||s.alg!==t))}catch{return!1}}const Ro=m("$ZodJWT",(e,t)=>{R.init(e,t),e._zod.check=r=>{Co(r.value,t.alg)||r.issues.push({code:"invalid_format",format:"jwt",input:r.value,inst:e,continue:!t.abort})}}),Io=m("$ZodUnknown",(e,t)=>{X.init(e,t),e._zod.parse=r=>r}),Uo=m("$ZodNever",(e,t)=>{X.init(e,t),e._zod.parse=(r,n)=>(r.issues.push({expected:"never",code:"invalid_type",input:r.value,inst:e}),r)});function Fr(e,t,r){e.issues.length&&t.issues.push(...rn(r,e.issues)),t.value[r]=e.value}const Lo=m("$ZodArray",(e,t)=>{X.init(e,t),e._zod.parse=(r,n)=>{const s=r.value;if(!Array.isArray(s))return r.issues.push({expected:"array",code:"invalid_type",input:s,inst:e}),r;r.value=Array(s.length);const i=[];for(let o=0;o<s.length;o++){const a=s[o],l=t.element._zod.run({value:a,issues:[]},n);l instanceof Promise?i.push(l.then(f=>Fr(f,r,o))):Fr(l,r,o)}return i.length?Promise.all(i).then(()=>r):r}});function it(e,t,r,n,s){if(e.issues.length){if(s&&!(r in n))return;t.issues.push(...rn(r,e.issues))}e.value===void 0?r in n&&(t.value[r]=void 0):t.value[r]=e.value}function un(e){const t=Object.keys(e.shape);for(const n of t)if(!e.shape?.[n]?._zod?.traits?.has("$ZodType"))throw new Error(`Invalid element at key "${n}": expected a Zod schema`);const r=ds(e.shape);return{...e,keys:t,keySet:new Set(t),numKeys:t.length,optionalKeys:new Set(r)}}function ln(e,t,r,n,s,i){const o=[],a=s.keySet,l=s.catchall._zod,f=l.def.type,_=l.optout==="optional";for(const p in t){if(a.has(p))continue;if(f==="never"){o.push(p);continue}const g=l.run({value:t[p],issues:[]},n);g instanceof Promise?e.push(g.then(h=>it(h,r,p,t,_))):it(g,r,p,t,_)}return o.length&&r.issues.push({code:"unrecognized_keys",keys:o,input:t,inst:i}),e.length?Promise.all(e).then(()=>r):r}const Mo=m("$ZodObject",(e,t)=>{if(X.init(e,t),!Object.getOwnPropertyDescriptor(t,"shape")?.get){const a=t.shape;Object.defineProperty(t,"shape",{get:()=>{const l={...a};return Object.defineProperty(t,"shape",{value:l}),l}})}const n=Ut(()=>un(t));A(e._zod,"propValues",()=>{const a=t.shape,l={};for(const f in a){const _=a[f]._zod;if(_.values){l[f]??(l[f]=new Set);for(const p of _.values)l[f].add(p)}}return l});const s=ot,i=t.catchall;let o;e._zod.parse=(a,l)=>{o??(o=n.value);const f=a.value;if(!s(f))return a.issues.push({expected:"object",code:"invalid_type",input:f,inst:e}),a;a.value={};const _=[],p=o.shape;for(const g of o.keys){const h=p[g],E=h._zod.optout==="optional",x=h._zod.run({value:f[g],issues:[]},l);x instanceof Promise?_.push(x.then(U=>it(U,a,g,f,E))):it(x,a,g,f,E)}return i?ln(_,f,a,l,n.value,e):_.length?Promise.all(_).then(()=>a):a}}),qo=m("$ZodObjectJIT",(e,t)=>{Mo.init(e,t);const r=e._zod.parse,n=Ut(()=>un(t)),s=g=>{const h=new mo(["shape","payload","ctx"]),E=n.value,x=V=>{const F=wr(V);return`shape[${F}]._zod.run({ value: input[${F}], issues: [] }, ctx)`};h.write("const input = payload.value;");const U=Object.create(null);let L=0;for(const V of E.keys)U[V]=`key_${L++}`;h.write("const newResult = {};");for(const V of E.keys){const F=U[V],S=wr(V),ue=g[V]?._zod?.optout==="optional";h.write(`const ${F} = ${x(V)};`),ue?h.write(`
        if (${F}.issues.length) {
          if (${S} in input) {
            payload.issues = payload.issues.concat(${F}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${S}, ...iss.path] : [${S}]
            })));
          }
        }
        
        if (${F}.value === undefined) {
          if (${S} in input) {
            newResult[${S}] = undefined;
          }
        } else {
          newResult[${S}] = ${F}.value;
        }
        
      `):h.write(`
        if (${F}.issues.length) {
          payload.issues = payload.issues.concat(${F}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${S}, ...iss.path] : [${S}]
          })));
        }
        
        if (${F}.value === undefined) {
          if (${S} in input) {
            newResult[${S}] = undefined;
          }
        } else {
          newResult[${S}] = ${F}.value;
        }
        
      `)}h.write("payload.value = newResult;"),h.write("return payload;");const P=h.compile();return(V,F)=>P(g,V,F)};let i;const o=ot,a=!Yr.jitless,f=a&&us.value,_=t.catchall;let p;e._zod.parse=(g,h)=>{p??(p=n.value);const E=g.value;return o(E)?a&&f&&h?.async===!1&&h.jitless!==!0?(i||(i=s(t.shape)),g=i(g,h),_?ln([],E,g,h,p,e):g):r(g,h):(g.issues.push({expected:"object",code:"invalid_type",input:E,inst:e}),g)}});function Sr(e,t,r,n){for(const i of e)if(i.issues.length===0)return t.value=i.value,t;const s=e.filter(i=>!Oe(i));return s.length===1?(t.value=s[0].value,s[0]):(t.issues.push({code:"invalid_union",input:t.value,inst:r,errors:e.map(i=>i.issues.map(o=>ke(o,n,Se())))}),t)}const Bo=m("$ZodUnion",(e,t)=>{X.init(e,t),A(e._zod,"optin",()=>t.options.some(s=>s._zod.optin==="optional")?"optional":void 0),A(e._zod,"optout",()=>t.options.some(s=>s._zod.optout==="optional")?"optional":void 0),A(e._zod,"values",()=>{if(t.options.every(s=>s._zod.values))return new Set(t.options.flatMap(s=>Array.from(s._zod.values)))}),A(e._zod,"pattern",()=>{if(t.options.every(s=>s._zod.pattern)){const s=t.options.map(i=>i._zod.pattern);return new RegExp(`^(${s.map(i=>Mt(i.source)).join("|")})$`)}});const r=t.options.length===1,n=t.options[0]._zod.run;e._zod.parse=(s,i)=>{if(r)return n(s,i);let o=!1;const a=[];for(const l of t.options){const f=l._zod.run({value:s.value,issues:[]},i);if(f instanceof Promise)a.push(f),o=!0;else{if(f.issues.length===0)return f;a.push(f)}}return o?Promise.all(a).then(l=>Sr(l,s,e,i)):Sr(a,s,e,i)}}),Jo=m("$ZodIntersection",(e,t)=>{X.init(e,t),e._zod.parse=(r,n)=>{const s=r.value,i=t.left._zod.run({value:s,issues:[]},n),o=t.right._zod.run({value:s,issues:[]},n);return i instanceof Promise||o instanceof Promise?Promise.all([i,o]).then(([l,f])=>kr(r,l,f)):kr(r,i,o)}});function Tt(e,t){if(e===t)return{valid:!0,data:e};if(e instanceof Date&&t instanceof Date&&+e==+t)return{valid:!0,data:e};if(Ue(e)&&Ue(t)){const r=Object.keys(t),n=Object.keys(e).filter(i=>r.indexOf(i)!==-1),s={...e,...t};for(const i of n){const o=Tt(e[i],t[i]);if(!o.valid)return{valid:!1,mergeErrorPath:[i,...o.mergeErrorPath]};s[i]=o.data}return{valid:!0,data:s}}if(Array.isArray(e)&&Array.isArray(t)){if(e.length!==t.length)return{valid:!1,mergeErrorPath:[]};const r=[];for(let n=0;n<e.length;n++){const s=e[n],i=t[n],o=Tt(s,i);if(!o.valid)return{valid:!1,mergeErrorPath:[n,...o.mergeErrorPath]};r.push(o.data)}return{valid:!0,data:r}}return{valid:!1,mergeErrorPath:[]}}function kr(e,t,r){const n=new Map;let s;for(const a of t.issues)if(a.code==="unrecognized_keys"){s??(s=a);for(const l of a.keys)n.has(l)||n.set(l,{}),n.get(l).l=!0}else e.issues.push(a);for(const a of r.issues)if(a.code==="unrecognized_keys")for(const l of a.keys)n.has(l)||n.set(l,{}),n.get(l).r=!0;else e.issues.push(a);const i=[...n].filter(([,a])=>a.l&&a.r).map(([a])=>a);if(i.length&&s&&e.issues.push({...s,keys:i}),Oe(e))return e;const o=Tt(t.value,r.value);if(!o.valid)throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(o.mergeErrorPath)}`);return e.value=o.data,e}const Xo=m("$ZodEnum",(e,t)=>{X.init(e,t);const r=Qr(t.entries),n=new Set(r);e._zod.values=n,e._zod.pattern=new RegExp(`^(${r.filter(s=>ls.has(typeof s)).map(s=>typeof s=="string"?dt(s):s.toString()).join("|")})$`),e._zod.parse=(s,i)=>{const o=s.value;return n.has(o)||s.issues.push({code:"invalid_value",values:r,input:o,inst:e}),s}}),Wo=m("$ZodTransform",(e,t)=>{X.init(e,t),e._zod.parse=(r,n)=>{if(n.direction==="backward")throw new Gr(e.constructor.name);const s=t.transform(r.value,r);if(n.async)return(s instanceof Promise?s:Promise.resolve(s)).then(o=>(r.value=o,r));if(s instanceof Promise)throw new Te;return r.value=s,r}});function xr(e,t){return e.issues.length&&t===void 0?{issues:[],value:void 0}:e}const dn=m("$ZodOptional",(e,t)=>{X.init(e,t),e._zod.optin="optional",e._zod.optout="optional",A(e._zod,"values",()=>t.innerType._zod.values?new Set([...t.innerType._zod.values,void 0]):void 0),A(e._zod,"pattern",()=>{const r=t.innerType._zod.pattern;return r?new RegExp(`^(${Mt(r.source)})?$`):void 0}),e._zod.parse=(r,n)=>{if(t.innerType._zod.optin==="optional"){const s=t.innerType._zod.run(r,n);return s instanceof Promise?s.then(i=>xr(i,r.value)):xr(s,r.value)}return r.value===void 0?r:t.innerType._zod.run(r,n)}}),Ko=m("$ZodExactOptional",(e,t)=>{dn.init(e,t),A(e._zod,"values",()=>t.innerType._zod.values),A(e._zod,"pattern",()=>t.innerType._zod.pattern),e._zod.parse=(r,n)=>t.innerType._zod.run(r,n)}),Ho=m("$ZodNullable",(e,t)=>{X.init(e,t),A(e._zod,"optin",()=>t.innerType._zod.optin),A(e._zod,"optout",()=>t.innerType._zod.optout),A(e._zod,"pattern",()=>{const r=t.innerType._zod.pattern;return r?new RegExp(`^(${Mt(r.source)}|null)$`):void 0}),A(e._zod,"values",()=>t.innerType._zod.values?new Set([...t.innerType._zod.values,null]):void 0),e._zod.parse=(r,n)=>r.value===null?r:t.innerType._zod.run(r,n)}),Go=m("$ZodDefault",(e,t)=>{X.init(e,t),e._zod.optin="optional",A(e._zod,"values",()=>t.innerType._zod.values),e._zod.parse=(r,n)=>{if(n.direction==="backward")return t.innerType._zod.run(r,n);if(r.value===void 0)return r.value=t.defaultValue,r;const s=t.innerType._zod.run(r,n);return s instanceof Promise?s.then(i=>$r(i,t)):$r(s,t)}});function $r(e,t){return e.value===void 0&&(e.value=t.defaultValue),e}const Yo=m("$ZodPrefault",(e,t)=>{X.init(e,t),e._zod.optin="optional",A(e._zod,"values",()=>t.innerType._zod.values),e._zod.parse=(r,n)=>(n.direction==="backward"||r.value===void 0&&(r.value=t.defaultValue),t.innerType._zod.run(r,n))}),Qo=m("$ZodNonOptional",(e,t)=>{X.init(e,t),A(e._zod,"values",()=>{const r=t.innerType._zod.values;return r?new Set([...r].filter(n=>n!==void 0)):void 0}),e._zod.parse=(r,n)=>{const s=t.innerType._zod.run(r,n);return s instanceof Promise?s.then(i=>Er(i,e)):Er(s,e)}});function Er(e,t){return!e.issues.length&&e.value===void 0&&e.issues.push({code:"invalid_type",expected:"nonoptional",input:e.value,inst:t}),e}const ei=m("$ZodCatch",(e,t)=>{X.init(e,t),A(e._zod,"optin",()=>t.innerType._zod.optin),A(e._zod,"optout",()=>t.innerType._zod.optout),A(e._zod,"values",()=>t.innerType._zod.values),e._zod.parse=(r,n)=>{if(n.direction==="backward")return t.innerType._zod.run(r,n);const s=t.innerType._zod.run(r,n);return s instanceof Promise?s.then(i=>(r.value=i.value,i.issues.length&&(r.value=t.catchValue({...r,error:{issues:i.issues.map(o=>ke(o,n,Se()))},input:r.value}),r.issues=[]),r)):(r.value=s.value,s.issues.length&&(r.value=t.catchValue({...r,error:{issues:s.issues.map(i=>ke(i,n,Se()))},input:r.value}),r.issues=[]),r)}}),ti=m("$ZodPipe",(e,t)=>{X.init(e,t),A(e._zod,"values",()=>t.in._zod.values),A(e._zod,"optin",()=>t.in._zod.optin),A(e._zod,"optout",()=>t.out._zod.optout),A(e._zod,"propValues",()=>t.in._zod.propValues),e._zod.parse=(r,n)=>{if(n.direction==="backward"){const i=t.out._zod.run(r,n);return i instanceof Promise?i.then(o=>Je(o,t.in,n)):Je(i,t.in,n)}const s=t.in._zod.run(r,n);return s instanceof Promise?s.then(i=>Je(i,t.out,n)):Je(s,t.out,n)}});function Je(e,t,r){return e.issues.length?(e.aborted=!0,e):t._zod.run({value:e.value,issues:e.issues},r)}const ri=m("$ZodReadonly",(e,t)=>{X.init(e,t),A(e._zod,"propValues",()=>t.innerType._zod.propValues),A(e._zod,"values",()=>t.innerType._zod.values),A(e._zod,"optin",()=>t.innerType?._zod?.optin),A(e._zod,"optout",()=>t.innerType?._zod?.optout),e._zod.parse=(r,n)=>{if(n.direction==="backward")return t.innerType._zod.run(r,n);const s=t.innerType._zod.run(r,n);return s instanceof Promise?s.then(Pr):Pr(s)}});function Pr(e){return e.value=Object.freeze(e.value),e}const ni=m("$ZodCustom",(e,t)=>{pe.init(e,t),X.init(e,t),e._zod.parse=(r,n)=>r,e._zod.check=r=>{const n=r.value,s=t.fn(n);if(s instanceof Promise)return s.then(i=>Or(i,r,n,e));Or(s,r,n,e)}});function Or(e,t,r,n){if(!e){const s={code:"custom",input:r,inst:n,path:[...n._zod.def.path??[]],continue:!n._zod.def.abort};n._zod.def.params&&(s.params=n._zod.def.params),t.issues.push(Le(s))}}var Tr;class si{constructor(){this._map=new WeakMap,this._idmap=new Map}add(t,...r){const n=r[0];return this._map.set(t,n),n&&typeof n=="object"&&"id"in n&&this._idmap.set(n.id,t),this}clear(){return this._map=new WeakMap,this._idmap=new Map,this}remove(t){const r=this._map.get(t);return r&&typeof r=="object"&&"id"in r&&this._idmap.delete(r.id),this._map.delete(t),this}get(t){const r=t._zod.parent;if(r){const n={...this.get(r)??{}};delete n.id;const s={...n,...this._map.get(t)};return Object.keys(s).length?s:void 0}return this._map.get(t)}has(t){return this._map.has(t)}}function oi(){return new si}(Tr=globalThis).__zod_globalRegistry??(Tr.__zod_globalRegistry=oi());const Ce=globalThis.__zod_globalRegistry;function ii(e,t){return new e({type:"string",...k(t)})}function ai(e,t){return new e({type:"string",format:"email",check:"string_format",abort:!1,...k(t)})}function Dr(e,t){return new e({type:"string",format:"guid",check:"string_format",abort:!1,...k(t)})}function ci(e,t){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,...k(t)})}function ui(e,t){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v4",...k(t)})}function li(e,t){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v6",...k(t)})}function di(e,t){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v7",...k(t)})}function fi(e,t){return new e({type:"string",format:"url",check:"string_format",abort:!1,...k(t)})}function mi(e,t){return new e({type:"string",format:"emoji",check:"string_format",abort:!1,...k(t)})}function pi(e,t){return new e({type:"string",format:"nanoid",check:"string_format",abort:!1,...k(t)})}function hi(e,t){return new e({type:"string",format:"cuid",check:"string_format",abort:!1,...k(t)})}function yi(e,t){return new e({type:"string",format:"cuid2",check:"string_format",abort:!1,...k(t)})}function gi(e,t){return new e({type:"string",format:"ulid",check:"string_format",abort:!1,...k(t)})}function bi(e,t){return new e({type:"string",format:"xid",check:"string_format",abort:!1,...k(t)})}function vi(e,t){return new e({type:"string",format:"ksuid",check:"string_format",abort:!1,...k(t)})}function _i(e,t){return new e({type:"string",format:"ipv4",check:"string_format",abort:!1,...k(t)})}function wi(e,t){return new e({type:"string",format:"ipv6",check:"string_format",abort:!1,...k(t)})}function zi(e,t){return new e({type:"string",format:"cidrv4",check:"string_format",abort:!1,...k(t)})}function Fi(e,t){return new e({type:"string",format:"cidrv6",check:"string_format",abort:!1,...k(t)})}function Si(e,t){return new e({type:"string",format:"base64",check:"string_format",abort:!1,...k(t)})}function ki(e,t){return new e({type:"string",format:"base64url",check:"string_format",abort:!1,...k(t)})}function xi(e,t){return new e({type:"string",format:"e164",check:"string_format",abort:!1,...k(t)})}function $i(e,t){return new e({type:"string",format:"jwt",check:"string_format",abort:!1,...k(t)})}function Ei(e,t){return new e({type:"string",format:"datetime",check:"string_format",offset:!1,local:!1,precision:null,...k(t)})}function Pi(e,t){return new e({type:"string",format:"date",check:"string_format",...k(t)})}function Oi(e,t){return new e({type:"string",format:"time",check:"string_format",precision:null,...k(t)})}function Ti(e,t){return new e({type:"string",format:"duration",check:"string_format",...k(t)})}function Di(e){return new e({type:"unknown"})}function Zi(e,t){return new e({type:"never",...k(t)})}function fn(e,t){return new ro({check:"max_length",...k(t),maximum:e})}function at(e,t){return new no({check:"min_length",...k(t),minimum:e})}function mn(e,t){return new so({check:"length_equals",...k(t),length:e})}function Ni(e,t){return new oo({check:"string_format",format:"regex",...k(t),pattern:e})}function Ai(e){return new io({check:"string_format",format:"lowercase",...k(e)})}function Vi(e){return new ao({check:"string_format",format:"uppercase",...k(e)})}function ji(e,t){return new co({check:"string_format",format:"includes",...k(t),includes:e})}function Ci(e,t){return new uo({check:"string_format",format:"starts_with",...k(t),prefix:e})}function Ri(e,t){return new lo({check:"string_format",format:"ends_with",...k(t),suffix:e})}function De(e){return new fo({check:"overwrite",tx:e})}function Ii(e){return De(t=>t.normalize(e))}function Ui(){return De(e=>e.trim())}function Li(){return De(e=>e.toLowerCase())}function Mi(){return De(e=>e.toUpperCase())}function qi(){return De(e=>cs(e))}function Bi(e,t,r){return new e({type:"array",element:t,...k(r)})}function Ji(e,t,r){return new e({type:"custom",check:"custom",fn:t,...k(r)})}function Xi(e){const t=Wi(r=>(r.addIssue=n=>{if(typeof n=="string")r.issues.push(Le(n,r.value,t._zod.def));else{const s=n;s.fatal&&(s.continue=!1),s.code??(s.code="custom"),s.input??(s.input=r.value),s.inst??(s.inst=t),s.continue??(s.continue=!t._zod.def.abort),r.issues.push(Le(s))}},e(r.value,r)));return t}function Wi(e,t){const r=new pe({check:"custom",...k(t)});return r._zod.check=e,r}function pn(e){let t=e?.target??"draft-2020-12";return t==="draft-4"&&(t="draft-04"),t==="draft-7"&&(t="draft-07"),{processors:e.processors??{},metadataRegistry:e?.metadata??Ce,target:t,unrepresentable:e?.unrepresentable??"throw",override:e?.override??(()=>{}),io:e?.io??"output",counter:0,seen:new Map,cycles:e?.cycles??"ref",reused:e?.reused??"inline",external:e?.external??void 0}}function K(e,t,r={path:[],schemaPath:[]}){var n;const s=e._zod.def,i=t.seen.get(e);if(i)return i.count++,r.schemaPath.includes(e)&&(i.cycle=r.path),i.schema;const o={schema:{},count:1,cycle:void 0,path:r.path};t.seen.set(e,o);const a=e._zod.toJSONSchema?.();if(a)o.schema=a;else{const _={...r,schemaPath:[...r.schemaPath,e],path:r.path};if(e._zod.processJSONSchema)e._zod.processJSONSchema(t,o.schema,_);else{const g=o.schema,h=t.processors[s.type];if(!h)throw new Error(`[toJSONSchema]: Non-representable type encountered: ${s.type}`);h(e,t,g,_)}const p=e._zod.parent;p&&(o.ref||(o.ref=p),K(p,t,_),t.seen.get(p).isParent=!0)}const l=t.metadataRegistry.get(e);return l&&Object.assign(o.schema,l),t.io==="input"&&ee(e)&&(delete o.schema.examples,delete o.schema.default),t.io==="input"&&o.schema._prefault&&((n=o.schema).default??(n.default=o.schema._prefault)),delete o.schema._prefault,t.seen.get(e).schema}function hn(e,t){const r=e.seen.get(t);if(!r)throw new Error("Unprocessed schema. This is a bug in Zod.");const n=new Map;for(const o of e.seen.entries()){const a=e.metadataRegistry.get(o[0])?.id;if(a){const l=n.get(a);if(l&&l!==o[0])throw new Error(`Duplicate schema id "${a}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);n.set(a,o[0])}}const s=o=>{const a=e.target==="draft-2020-12"?"$defs":"definitions";if(e.external){const p=e.external.registry.get(o[0])?.id,g=e.external.uri??(E=>E);if(p)return{ref:g(p)};const h=o[1].defId??o[1].schema.id??`schema${e.counter++}`;return o[1].defId=h,{defId:h,ref:`${g("__shared")}#/${a}/${h}`}}if(o[1]===r)return{ref:"#"};const f=`#/${a}/`,_=o[1].schema.id??`__schema${e.counter++}`;return{defId:_,ref:f+_}},i=o=>{if(o[1].schema.$ref)return;const a=o[1],{ref:l,defId:f}=s(o);a.def={...a.schema},f&&(a.defId=f);const _=a.schema;for(const p in _)delete _[p];_.$ref=l};if(e.cycles==="throw")for(const o of e.seen.entries()){const a=o[1];if(a.cycle)throw new Error(`Cycle detected: #/${a.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`)}for(const o of e.seen.entries()){const a=o[1];if(t===o[0]){i(o);continue}if(e.external){const f=e.external.registry.get(o[0])?.id;if(t!==o[0]&&f){i(o);continue}}if(e.metadataRegistry.get(o[0])?.id){i(o);continue}if(a.cycle){i(o);continue}if(a.count>1&&e.reused==="ref"){i(o);continue}}}function yn(e,t){const r=e.seen.get(t);if(!r)throw new Error("Unprocessed schema. This is a bug in Zod.");const n=o=>{const a=e.seen.get(o);if(a.ref===null)return;const l=a.def??a.schema,f={...l},_=a.ref;if(a.ref=null,_){n(_);const g=e.seen.get(_),h=g.schema;if(h.$ref&&(e.target==="draft-07"||e.target==="draft-04"||e.target==="openapi-3.0")?(l.allOf=l.allOf??[],l.allOf.push(h)):Object.assign(l,h),Object.assign(l,f),o._zod.parent===_)for(const x in l)x==="$ref"||x==="allOf"||x in f||delete l[x];if(h.$ref)for(const x in l)x==="$ref"||x==="allOf"||x in g.def&&JSON.stringify(l[x])===JSON.stringify(g.def[x])&&delete l[x]}const p=o._zod.parent;if(p&&p!==_){n(p);const g=e.seen.get(p);if(g?.schema.$ref&&(l.$ref=g.schema.$ref,g.def))for(const h in l)h==="$ref"||h==="allOf"||h in g.def&&JSON.stringify(l[h])===JSON.stringify(g.def[h])&&delete l[h]}e.override({zodSchema:o,jsonSchema:l,path:a.path??[]})};for(const o of[...e.seen.entries()].reverse())n(o[0]);const s={};if(e.target==="draft-2020-12"?s.$schema="https://json-schema.org/draft/2020-12/schema":e.target==="draft-07"?s.$schema="http://json-schema.org/draft-07/schema#":e.target==="draft-04"?s.$schema="http://json-schema.org/draft-04/schema#":e.target,e.external?.uri){const o=e.external.registry.get(t)?.id;if(!o)throw new Error("Schema is missing an `id` property");s.$id=e.external.uri(o)}Object.assign(s,r.def??r.schema);const i=e.external?.defs??{};for(const o of e.seen.entries()){const a=o[1];a.def&&a.defId&&(i[a.defId]=a.def)}e.external||Object.keys(i).length>0&&(e.target==="draft-2020-12"?s.$defs=i:s.definitions=i);try{const o=JSON.parse(JSON.stringify(s));return Object.defineProperty(o,"~standard",{value:{...t["~standard"],jsonSchema:{input:ct(t,"input",e.processors),output:ct(t,"output",e.processors)}},enumerable:!1,writable:!1}),o}catch{throw new Error("Error converting schema to JSON.")}}function ee(e,t){const r=t??{seen:new Set};if(r.seen.has(e))return!1;r.seen.add(e);const n=e._zod.def;if(n.type==="transform")return!0;if(n.type==="array")return ee(n.element,r);if(n.type==="set")return ee(n.valueType,r);if(n.type==="lazy")return ee(n.getter(),r);if(n.type==="promise"||n.type==="optional"||n.type==="nonoptional"||n.type==="nullable"||n.type==="readonly"||n.type==="default"||n.type==="prefault")return ee(n.innerType,r);if(n.type==="intersection")return ee(n.left,r)||ee(n.right,r);if(n.type==="record"||n.type==="map")return ee(n.keyType,r)||ee(n.valueType,r);if(n.type==="pipe")return ee(n.in,r)||ee(n.out,r);if(n.type==="object"){for(const s in n.shape)if(ee(n.shape[s],r))return!0;return!1}if(n.type==="union"){for(const s of n.options)if(ee(s,r))return!0;return!1}if(n.type==="tuple"){for(const s of n.items)if(ee(s,r))return!0;return!!(n.rest&&ee(n.rest,r))}return!1}const Ki=(e,t={})=>r=>{const n=pn({...r,processors:t});return K(e,n),hn(n,e),yn(n,e)},ct=(e,t,r={})=>n=>{const{libraryOptions:s,target:i}=n??{},o=pn({...s??{},target:i,io:t,processors:r});return K(e,o),hn(o,e),yn(o,e)},Hi={guid:"uuid",url:"uri",datetime:"date-time",json_string:"json-string",regex:""},Gi=(e,t,r,n)=>{const s=r;s.type="string";const{minimum:i,maximum:o,format:a,patterns:l,contentEncoding:f}=e._zod.bag;if(typeof i=="number"&&(s.minLength=i),typeof o=="number"&&(s.maxLength=o),a&&(s.format=Hi[a]??a,s.format===""&&delete s.format,a==="time"&&delete s.format),f&&(s.contentEncoding=f),l&&l.size>0){const _=[...l];_.length===1?s.pattern=_[0].source:_.length>1&&(s.allOf=[..._.map(p=>({...t.target==="draft-07"||t.target==="draft-04"||t.target==="openapi-3.0"?{type:"string"}:{},pattern:p.source}))])}},Yi=(e,t,r,n)=>{r.not={}},Qi=(e,t,r,n)=>{},ea=(e,t,r,n)=>{const s=e._zod.def,i=Qr(s.entries);i.every(o=>typeof o=="number")&&(r.type="number"),i.every(o=>typeof o=="string")&&(r.type="string"),r.enum=i},ta=(e,t,r,n)=>{if(t.unrepresentable==="throw")throw new Error("Custom types cannot be represented in JSON Schema")},ra=(e,t,r,n)=>{if(t.unrepresentable==="throw")throw new Error("Transforms cannot be represented in JSON Schema")},na=(e,t,r,n)=>{const s=r,i=e._zod.def,{minimum:o,maximum:a}=e._zod.bag;typeof o=="number"&&(s.minItems=o),typeof a=="number"&&(s.maxItems=a),s.type="array",s.items=K(i.element,t,{...n,path:[...n.path,"items"]})},sa=(e,t,r,n)=>{const s=r,i=e._zod.def;s.type="object",s.properties={};const o=i.shape;for(const f in o)s.properties[f]=K(o[f],t,{...n,path:[...n.path,"properties",f]});const a=new Set(Object.keys(o)),l=new Set([...a].filter(f=>{const _=i.shape[f]._zod;return t.io==="input"?_.optin===void 0:_.optout===void 0}));l.size>0&&(s.required=Array.from(l)),i.catchall?._zod.def.type==="never"?s.additionalProperties=!1:i.catchall?i.catchall&&(s.additionalProperties=K(i.catchall,t,{...n,path:[...n.path,"additionalProperties"]})):t.io==="output"&&(s.additionalProperties=!1)},oa=(e,t,r,n)=>{const s=e._zod.def,i=s.inclusive===!1,o=s.options.map((a,l)=>K(a,t,{...n,path:[...n.path,i?"oneOf":"anyOf",l]}));i?r.oneOf=o:r.anyOf=o},ia=(e,t,r,n)=>{const s=e._zod.def,i=K(s.left,t,{...n,path:[...n.path,"allOf",0]}),o=K(s.right,t,{...n,path:[...n.path,"allOf",1]}),a=f=>"allOf"in f&&Object.keys(f).length===1,l=[...a(i)?i.allOf:[i],...a(o)?o.allOf:[o]];r.allOf=l},aa=(e,t,r,n)=>{const s=e._zod.def,i=K(s.innerType,t,n),o=t.seen.get(e);t.target==="openapi-3.0"?(o.ref=s.innerType,r.nullable=!0):r.anyOf=[i,{type:"null"}]},ca=(e,t,r,n)=>{const s=e._zod.def;K(s.innerType,t,n);const i=t.seen.get(e);i.ref=s.innerType},ua=(e,t,r,n)=>{const s=e._zod.def;K(s.innerType,t,n);const i=t.seen.get(e);i.ref=s.innerType,r.default=JSON.parse(JSON.stringify(s.defaultValue))},la=(e,t,r,n)=>{const s=e._zod.def;K(s.innerType,t,n);const i=t.seen.get(e);i.ref=s.innerType,t.io==="input"&&(r._prefault=JSON.parse(JSON.stringify(s.defaultValue)))},da=(e,t,r,n)=>{const s=e._zod.def;K(s.innerType,t,n);const i=t.seen.get(e);i.ref=s.innerType;let o;try{o=s.catchValue(void 0)}catch{throw new Error("Dynamic catch values are not supported in JSON Schema")}r.default=o},fa=(e,t,r,n)=>{const s=e._zod.def,i=t.io==="input"?s.in._zod.def.type==="transform"?s.out:s.in:s.out;K(i,t,n);const o=t.seen.get(e);o.ref=i},ma=(e,t,r,n)=>{const s=e._zod.def;K(s.innerType,t,n);const i=t.seen.get(e);i.ref=s.innerType,r.readOnly=!0},gn=(e,t,r,n)=>{const s=e._zod.def;K(s.innerType,t,n);const i=t.seen.get(e);i.ref=s.innerType};function Zr(e,t){try{var r=e()}catch(n){return t(n)}return r&&r.then?r.then(void 0,t):r}function pa(e,t){for(var r={};e.length;){var n=e[0],s=n.code,i=n.message,o=n.path.join(".");if(!r[o])if("unionErrors"in n){var a=n.unionErrors[0].errors[0];r[o]={message:a.message,type:a.code}}else r[o]={message:i,type:s};if("unionErrors"in n&&n.unionErrors.forEach(function(_){return _.errors.forEach(function(p){return e.push(p)})}),t){var l=r[o].types,f=l&&l[n.code];r[o]=Ct(o,t,r,s,f?[].concat(f,n.message):n.message)}e.shift()}return r}function ha(e,t){for(var r={};e.length;){var n=e[0],s=n.code,i=n.message,o=n.path.join(".");if(!r[o])if(n.code==="invalid_union"&&n.errors.length>0){var a=n.errors[0][0];r[o]={message:a.message,type:a.code}}else r[o]={message:i,type:s};if(n.code==="invalid_union"&&n.errors.forEach(function(_){return _.forEach(function(p){return e.push(p)})}),t){var l=r[o].types,f=l&&l[n.code];r[o]=Ct(o,t,r,s,f?[].concat(f,n.message):n.message)}e.shift()}return r}function ya(e,t,r){if(r===void 0&&(r={}),(function(n){return"_def"in n&&typeof n._def=="object"&&"typeName"in n._def})(e))return function(n,s,i){try{return Promise.resolve(Zr(function(){return Promise.resolve(e[r.mode==="sync"?"parse":"parseAsync"](n,t)).then(function(o){return i.shouldUseNativeValidation&&Pt({},i),{errors:{},values:r.raw?Object.assign({},n):o}})},function(o){if((function(a){return Array.isArray(a?.issues)})(o))return{values:{},errors:br(pa(o.errors,!i.shouldUseNativeValidation&&i.criteriaMode==="all"),i)};throw o}))}catch(o){return Promise.reject(o)}};if((function(n){return"_zod"in n&&typeof n._zod=="object"})(e))return function(n,s,i){try{return Promise.resolve(Zr(function(){return Promise.resolve((r.mode==="sync"?ws:zs)(e,n,t)).then(function(o){return i.shouldUseNativeValidation&&Pt({},i),{errors:{},values:r.raw?Object.assign({},n):o}})},function(o){if((function(a){return a instanceof Bt})(o))return{values:{},errors:br(ha(o.issues,!i.shouldUseNativeValidation&&i.criteriaMode==="all"),i)};throw o}))}catch(o){return Promise.reject(o)}};throw new Error("Invalid input: not a Zod schema")}const bn=Rr.createContext(null);function ga(){const e=Rr.useContext(bn);if(!e)throw new Error("useFormContext must be used within Form component");return e}const vn=new Map;function ba(e,t){vn.set(e,t)}function va(e){return vn.get(e)}function _a(e){if("shape"in e){const t=e.shape;if(t&&typeof t=="object")return Object.keys(t)}if("_def"in e&&typeof e._def=="object"&&e._def!==null){const t=e._def;if("schema"in t&&t.schema){const r=t.schema;if("shape"in r){const n=r.shape;if(n&&typeof n=="object")return Object.keys(n)}}}return[]}const bt=({name:e,label:t,helpMessage:r,required:n=!1,disabled:s=!1,type:i,placeholder:o,inputProps:a={},...l})=>{const{control:f,formState:{errors:_}}=lt(),p=e,g=_[p],h=g?.message;return j.jsx(Bn,{control:f,name:p,render:({field:E})=>j.jsx(Ve,{...l,error:!!g,errorMessage:h,helpMessage:r,required:n,disabled:s,children:j.jsxs(Ve.Wrapper,{children:[t&&j.jsx(Ve.Label,{children:t}),j.jsx(Ve.Input,{...a,...E,type:i??a?.type??"text",placeholder:o??a?.placeholder,value:E.value??"",onChange:x=>{E.onChange(x),a?.onChange&&a.onChange(x)},onBlur:x=>{E.onBlur(),a?.onBlur&&a.onBlur(x)}}),j.jsx(Ve.HelpMessage,{})]})})})};bt.displayName="Form.Field";const Xt=({id:e})=>{const{attributes:t}=Ir({nodeId:e}),r=ga();if(!t?.name)return console.warn(`FormField with id "${e}" is missing name attribute`),null;const n=t.name;if(r.schema){const E=_a(r.schema);if(E.length>0&&!E.includes(n))throw new Error(`FormField with name "${n}" (id: "${e}") is not defined in the form schema. Expected fields: ${E.join(", ")}`)}const{name:s,label:i,helpMessage:o,required:a,disabled:l,type:f,placeholder:_,inputProps:p,className:g,...h}=t;return j.jsx(bt,{name:n,label:i,helpMessage:o,required:a,disabled:l,type:f,placeholder:_,inputProps:p,className:g,...h})};Xt.displayName="FormFieldContainer";Xt.__docgenInfo={description:"",methods:[],displayName:"FormFieldContainer",props:{id:{required:!0,tsType:{name:"string"},description:""}}};bt.__docgenInfo={description:`FormField Component

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
>`},description:"TextField Input props (onChange/onBlur are merged with form handlers)",defaultValue:{value:"{}",computed:!1}},type:{required:!1,tsType:{name:"union",raw:"'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'",elements:[{name:"literal",value:"'text'"},{name:"literal",value:"'email'"},{name:"literal",value:"'password'"},{name:"literal",value:"'number'"},{name:"literal",value:"'tel'"},{name:"literal",value:"'url'"},{name:"literal",value:"'search'"}]},description:"Input type (shorthand for inputProps.type)"},placeholder:{required:!1,tsType:{name:"string"},description:"Placeholder text (shorthand for inputProps.placeholder)"},className:{required:!1,tsType:{name:"string"},description:"Additional CSS classes passed to TextField root"}}};const vt=({schema:e,onSubmit:t,children:r,className:n,...s})=>{const i=e?ya(e):void 0,o=is({mode:"onSubmit",reValidateMode:"onChange",...s,resolver:i}),a=o.handleSubmit(async f=>{await t(f)},f=>{}),l=$.useMemo(()=>({formMethods:o,schema:e}),[o,e]);return j.jsx(bn.Provider,{value:l,children:j.jsx(Un,{...o,children:j.jsx("form",{onSubmit:a,className:n,noValidate:!0,children:typeof r=="function"?r(o):r})})})};vt.displayName="Form";const wa=Object.assign(vt,{Field:bt}),Wt=({id:e,parentPath:t=[]})=>{const{childrenIds:r,attributes:n}=Ir({nodeId:e}),{renderChildren:s}=Zn({nodeId:e,parentPath:t}),i=n?.schema,o=n?.schemaName,a=o?va(o):void 0,l=i||a;n?.onSubmit;const p=n?.onSubmitHandler||(async E=>{}),g=n?.className,h=n?.formOptions;return j.jsx(vt,{schema:l,onSubmit:p,className:g,...h,children:s(r)})};Wt.displayName="FormContainer";vt.__docgenInfo={description:`Form Root Component

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
\`\`\``,methods:[],displayName:"Form",props:{schema:{required:!1,tsType:{name:"z.ZodType",elements:[{name:"any"},{name:"any"},{name:"any"}],raw:"z.ZodType<any, any, any>"},description:"Zod schema for validation"},onSubmit:{required:!0,tsType:{name:"signature",type:"function",raw:"(data: TFieldValues) => void | Promise<void>",signature:{arguments:[{type:{name:"TFieldValues"},name:"data"}],return:{name:"union",raw:"void | Promise<void>",elements:[{name:"void"},{name:"Promise",elements:[{name:"void"}],raw:"Promise<void>"}]}}},description:"Form submission handler"},children:{required:!0,tsType:{name:"union",raw:"React.ReactNode | ((methods: UseFormReturn<TFieldValues, TContext>) => React.ReactNode)",elements:[{name:"ReactReactNode",raw:"React.ReactNode"},{name:"unknown"}]},description:"Form children (can access form methods via FormProvider)"},className:{required:!1,tsType:{name:"string"},description:"Additional CSS classes"}},composes:["Omit"]};Wt.__docgenInfo={description:"",methods:[],displayName:"FormContainer",props:{id:{required:!0,tsType:{name:"string"},description:""},parentPath:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:"",defaultValue:{value:"[]",computed:!1}}}};function we(e){return e&&Object.entries(e).forEach(([t,r])=>{ba(t,r)}),{Form:(t,r)=>j.jsx(Wt,{id:t,parentPath:r}),Div:(t,r)=>j.jsx(Vn,{id:t,parentPath:r}),FormField:t=>j.jsx(Xt,{id:t}),Button:(t,r)=>j.jsx(Cn,{id:t,parentPath:r}),Text:t=>j.jsx(An,{id:t}),Span:t=>j.jsx(Nn,{id:t})}}const za=m("ZodISODateTime",(e,t)=>{xo.init(e,t),I.init(e,t)});function Fa(e){return Ei(za,e)}const Sa=m("ZodISODate",(e,t)=>{$o.init(e,t),I.init(e,t)});function ka(e){return Pi(Sa,e)}const xa=m("ZodISOTime",(e,t)=>{Eo.init(e,t),I.init(e,t)});function $a(e){return Oi(xa,e)}const Ea=m("ZodISODuration",(e,t)=>{Po.init(e,t),I.init(e,t)});function Pa(e){return Ti(Ea,e)}const Oa=(e,t)=>{Bt.init(e,t),e.name="ZodError",Object.defineProperties(e,{format:{value:r=>_s(e,r)},flatten:{value:r=>vs(e,r)},addIssue:{value:r=>{e.issues.push(r),e.message=JSON.stringify(e.issues,Ot,2)}},addIssues:{value:r=>{e.issues.push(...r),e.message=JSON.stringify(e.issues,Ot,2)}},isEmpty:{get(){return e.issues.length===0}}})},ce=m("ZodError",Oa,{Parent:Error}),Ta=mt(ce),Da=pt(ce),Za=ht(ce),Na=yt(ce),Aa=ks(ce),Va=xs(ce),ja=$s(ce),Ca=Es(ce),Ra=Ps(ce),Ia=Os(ce),Ua=Ts(ce),La=Ds(ce),W=m("ZodType",(e,t)=>(X.init(e,t),Object.assign(e["~standard"],{jsonSchema:{input:ct(e,"input"),output:ct(e,"output")}}),e.toJSONSchema=Ki(e,{}),e.def=t,e.type=t.type,Object.defineProperty(e,"_def",{value:t}),e.check=(...r)=>e.clone(ve(t,{checks:[...t.checks??[],...r.map(n=>typeof n=="function"?{_zod:{check:n,def:{check:"custom"},onattach:[]}}:n)]}),{parent:!0}),e.with=e.check,e.clone=(r,n)=>_e(e,r,n),e.brand=()=>e,e.register=((r,n)=>(r.add(e,n),e)),e.parse=(r,n)=>Ta(e,r,n,{callee:e.parse}),e.safeParse=(r,n)=>Za(e,r,n),e.parseAsync=async(r,n)=>Da(e,r,n,{callee:e.parseAsync}),e.safeParseAsync=async(r,n)=>Na(e,r,n),e.spa=e.safeParseAsync,e.encode=(r,n)=>Aa(e,r,n),e.decode=(r,n)=>Va(e,r,n),e.encodeAsync=async(r,n)=>ja(e,r,n),e.decodeAsync=async(r,n)=>Ca(e,r,n),e.safeEncode=(r,n)=>Ra(e,r,n),e.safeDecode=(r,n)=>Ia(e,r,n),e.safeEncodeAsync=async(r,n)=>Ua(e,r,n),e.safeDecodeAsync=async(r,n)=>La(e,r,n),e.refine=(r,n)=>e.check(Nc(r,n)),e.superRefine=r=>e.check(Ac(r)),e.overwrite=r=>e.check(De(r)),e.optional=()=>Vr(e),e.exactOptional=()=>wc(e),e.nullable=()=>jr(e),e.nullish=()=>Vr(jr(e)),e.nonoptional=r=>$c(e,r),e.array=()=>dc(e),e.or=r=>pc([e,r]),e.and=r=>yc(e,r),e.transform=r=>Cr(e,vc(r)),e.default=r=>Sc(e,r),e.prefault=r=>xc(e,r),e.catch=r=>Pc(e,r),e.pipe=r=>Cr(e,r),e.readonly=()=>Dc(e),e.describe=r=>{const n=e.clone();return Ce.add(n,{description:r}),n},Object.defineProperty(e,"description",{get(){return Ce.get(e)?.description},configurable:!0}),e.meta=(...r)=>{if(r.length===0)return Ce.get(e);const n=e.clone();return Ce.add(n,r[0]),n},e.isOptional=()=>e.safeParse(void 0).success,e.isNullable=()=>e.safeParse(null).success,e.apply=r=>r(e),e)),_n=m("_ZodString",(e,t)=>{Jt.init(e,t),W.init(e,t),e._zod.processJSONSchema=(n,s,i)=>Gi(e,n,s);const r=e._zod.bag;e.format=r.format??null,e.minLength=r.minimum??null,e.maxLength=r.maximum??null,e.regex=(...n)=>e.check(Ni(...n)),e.includes=(...n)=>e.check(ji(...n)),e.startsWith=(...n)=>e.check(Ci(...n)),e.endsWith=(...n)=>e.check(Ri(...n)),e.min=(...n)=>e.check(at(...n)),e.max=(...n)=>e.check(fn(...n)),e.length=(...n)=>e.check(mn(...n)),e.nonempty=(...n)=>e.check(at(1,...n)),e.lowercase=n=>e.check(Ai(n)),e.uppercase=n=>e.check(Vi(n)),e.trim=()=>e.check(Ui()),e.normalize=(...n)=>e.check(Ii(...n)),e.toLowerCase=()=>e.check(Li()),e.toUpperCase=()=>e.check(Mi()),e.slugify=()=>e.check(qi())}),Ma=m("ZodString",(e,t)=>{Jt.init(e,t),_n.init(e,t),e.email=r=>e.check(ai(qa,r)),e.url=r=>e.check(fi(Ba,r)),e.jwt=r=>e.check($i(ic,r)),e.emoji=r=>e.check(mi(Ja,r)),e.guid=r=>e.check(Dr(Nr,r)),e.uuid=r=>e.check(ci(Xe,r)),e.uuidv4=r=>e.check(ui(Xe,r)),e.uuidv6=r=>e.check(li(Xe,r)),e.uuidv7=r=>e.check(di(Xe,r)),e.nanoid=r=>e.check(pi(Xa,r)),e.guid=r=>e.check(Dr(Nr,r)),e.cuid=r=>e.check(hi(Wa,r)),e.cuid2=r=>e.check(yi(Ka,r)),e.ulid=r=>e.check(gi(Ha,r)),e.base64=r=>e.check(Si(nc,r)),e.base64url=r=>e.check(ki(sc,r)),e.xid=r=>e.check(bi(Ga,r)),e.ksuid=r=>e.check(vi(Ya,r)),e.ipv4=r=>e.check(_i(Qa,r)),e.ipv6=r=>e.check(wi(ec,r)),e.cidrv4=r=>e.check(zi(tc,r)),e.cidrv6=r=>e.check(Fi(rc,r)),e.e164=r=>e.check(xi(oc,r)),e.datetime=r=>e.check(Fa(r)),e.date=r=>e.check(ka(r)),e.time=r=>e.check($a(r)),e.duration=r=>e.check(Pa(r))});function G(e){return ii(Ma,e)}const I=m("ZodStringFormat",(e,t)=>{R.init(e,t),_n.init(e,t)}),qa=m("ZodEmail",(e,t)=>{go.init(e,t),I.init(e,t)}),Nr=m("ZodGUID",(e,t)=>{ho.init(e,t),I.init(e,t)}),Xe=m("ZodUUID",(e,t)=>{yo.init(e,t),I.init(e,t)}),Ba=m("ZodURL",(e,t)=>{bo.init(e,t),I.init(e,t)}),Ja=m("ZodEmoji",(e,t)=>{vo.init(e,t),I.init(e,t)}),Xa=m("ZodNanoID",(e,t)=>{_o.init(e,t),I.init(e,t)}),Wa=m("ZodCUID",(e,t)=>{wo.init(e,t),I.init(e,t)}),Ka=m("ZodCUID2",(e,t)=>{zo.init(e,t),I.init(e,t)}),Ha=m("ZodULID",(e,t)=>{Fo.init(e,t),I.init(e,t)}),Ga=m("ZodXID",(e,t)=>{So.init(e,t),I.init(e,t)}),Ya=m("ZodKSUID",(e,t)=>{ko.init(e,t),I.init(e,t)}),Qa=m("ZodIPv4",(e,t)=>{Oo.init(e,t),I.init(e,t)}),ec=m("ZodIPv6",(e,t)=>{To.init(e,t),I.init(e,t)}),tc=m("ZodCIDRv4",(e,t)=>{Do.init(e,t),I.init(e,t)}),rc=m("ZodCIDRv6",(e,t)=>{Zo.init(e,t),I.init(e,t)}),nc=m("ZodBase64",(e,t)=>{No.init(e,t),I.init(e,t)}),sc=m("ZodBase64URL",(e,t)=>{Vo.init(e,t),I.init(e,t)}),oc=m("ZodE164",(e,t)=>{jo.init(e,t),I.init(e,t)}),ic=m("ZodJWT",(e,t)=>{Ro.init(e,t),I.init(e,t)}),ac=m("ZodUnknown",(e,t)=>{Io.init(e,t),W.init(e,t),e._zod.processJSONSchema=(r,n,s)=>Qi()});function Ar(){return Di(ac)}const cc=m("ZodNever",(e,t)=>{Uo.init(e,t),W.init(e,t),e._zod.processJSONSchema=(r,n,s)=>Yi(e,r,n)});function uc(e){return Zi(cc,e)}const lc=m("ZodArray",(e,t)=>{Lo.init(e,t),W.init(e,t),e._zod.processJSONSchema=(r,n,s)=>na(e,r,n,s),e.element=t.element,e.min=(r,n)=>e.check(at(r,n)),e.nonempty=r=>e.check(at(1,r)),e.max=(r,n)=>e.check(fn(r,n)),e.length=(r,n)=>e.check(mn(r,n)),e.unwrap=()=>e.element});function dc(e,t){return Bi(lc,e,t)}const fc=m("ZodObject",(e,t)=>{qo.init(e,t),W.init(e,t),e._zod.processJSONSchema=(r,n,s)=>sa(e,r,n,s),A(e,"shape",()=>t.shape),e.keyof=()=>gc(Object.keys(e._zod.def.shape)),e.catchall=r=>e.clone({...e._zod.def,catchall:r}),e.passthrough=()=>e.clone({...e._zod.def,catchall:Ar()}),e.loose=()=>e.clone({...e._zod.def,catchall:Ar()}),e.strict=()=>e.clone({...e._zod.def,catchall:uc()}),e.strip=()=>e.clone({...e._zod.def,catchall:void 0}),e.extend=r=>ps(e,r),e.safeExtend=r=>hs(e,r),e.merge=r=>ys(e,r),e.pick=r=>fs(e,r),e.omit=r=>ms(e,r),e.partial=(...r)=>gs(wn,e,r[0]),e.required=(...r)=>bs(zn,e,r[0])});function $e(e,t){const r={type:"object",shape:e??{},...k(t)};return new fc(r)}const mc=m("ZodUnion",(e,t)=>{Bo.init(e,t),W.init(e,t),e._zod.processJSONSchema=(r,n,s)=>oa(e,r,n,s),e.options=t.options});function pc(e,t){return new mc({type:"union",options:e,...k(t)})}const hc=m("ZodIntersection",(e,t)=>{Jo.init(e,t),W.init(e,t),e._zod.processJSONSchema=(r,n,s)=>ia(e,r,n,s)});function yc(e,t){return new hc({type:"intersection",left:e,right:t})}const Dt=m("ZodEnum",(e,t)=>{Xo.init(e,t),W.init(e,t),e._zod.processJSONSchema=(n,s,i)=>ea(e,n,s),e.enum=t.entries,e.options=Object.values(t.entries);const r=new Set(Object.keys(t.entries));e.extract=(n,s)=>{const i={};for(const o of n)if(r.has(o))i[o]=t.entries[o];else throw new Error(`Key ${o} not found in enum`);return new Dt({...t,checks:[],...k(s),entries:i})},e.exclude=(n,s)=>{const i={...t.entries};for(const o of n)if(r.has(o))delete i[o];else throw new Error(`Key ${o} not found in enum`);return new Dt({...t,checks:[],...k(s),entries:i})}});function gc(e,t){const r=Array.isArray(e)?Object.fromEntries(e.map(n=>[n,n])):e;return new Dt({type:"enum",entries:r,...k(t)})}const bc=m("ZodTransform",(e,t)=>{Wo.init(e,t),W.init(e,t),e._zod.processJSONSchema=(r,n,s)=>ra(e,r),e._zod.parse=(r,n)=>{if(n.direction==="backward")throw new Gr(e.constructor.name);r.addIssue=i=>{if(typeof i=="string")r.issues.push(Le(i,r.value,t));else{const o=i;o.fatal&&(o.continue=!1),o.code??(o.code="custom"),o.input??(o.input=r.value),o.inst??(o.inst=e),r.issues.push(Le(o))}};const s=t.transform(r.value,r);return s instanceof Promise?s.then(i=>(r.value=i,r)):(r.value=s,r)}});function vc(e){return new bc({type:"transform",transform:e})}const wn=m("ZodOptional",(e,t)=>{dn.init(e,t),W.init(e,t),e._zod.processJSONSchema=(r,n,s)=>gn(e,r,n,s),e.unwrap=()=>e._zod.def.innerType});function Vr(e){return new wn({type:"optional",innerType:e})}const _c=m("ZodExactOptional",(e,t)=>{Ko.init(e,t),W.init(e,t),e._zod.processJSONSchema=(r,n,s)=>gn(e,r,n,s),e.unwrap=()=>e._zod.def.innerType});function wc(e){return new _c({type:"optional",innerType:e})}const zc=m("ZodNullable",(e,t)=>{Ho.init(e,t),W.init(e,t),e._zod.processJSONSchema=(r,n,s)=>aa(e,r,n,s),e.unwrap=()=>e._zod.def.innerType});function jr(e){return new zc({type:"nullable",innerType:e})}const Fc=m("ZodDefault",(e,t)=>{Go.init(e,t),W.init(e,t),e._zod.processJSONSchema=(r,n,s)=>ua(e,r,n,s),e.unwrap=()=>e._zod.def.innerType,e.removeDefault=e.unwrap});function Sc(e,t){return new Fc({type:"default",innerType:e,get defaultValue(){return typeof t=="function"?t():tn(t)}})}const kc=m("ZodPrefault",(e,t)=>{Yo.init(e,t),W.init(e,t),e._zod.processJSONSchema=(r,n,s)=>la(e,r,n,s),e.unwrap=()=>e._zod.def.innerType});function xc(e,t){return new kc({type:"prefault",innerType:e,get defaultValue(){return typeof t=="function"?t():tn(t)}})}const zn=m("ZodNonOptional",(e,t)=>{Qo.init(e,t),W.init(e,t),e._zod.processJSONSchema=(r,n,s)=>ca(e,r,n,s),e.unwrap=()=>e._zod.def.innerType});function $c(e,t){return new zn({type:"nonoptional",innerType:e,...k(t)})}const Ec=m("ZodCatch",(e,t)=>{ei.init(e,t),W.init(e,t),e._zod.processJSONSchema=(r,n,s)=>da(e,r,n,s),e.unwrap=()=>e._zod.def.innerType,e.removeCatch=e.unwrap});function Pc(e,t){return new Ec({type:"catch",innerType:e,catchValue:typeof t=="function"?t:()=>t})}const Oc=m("ZodPipe",(e,t)=>{ti.init(e,t),W.init(e,t),e._zod.processJSONSchema=(r,n,s)=>fa(e,r,n,s),e.in=t.in,e.out=t.out});function Cr(e,t){return new Oc({type:"pipe",in:e,out:t})}const Tc=m("ZodReadonly",(e,t)=>{ri.init(e,t),W.init(e,t),e._zod.processJSONSchema=(r,n,s)=>ma(e,r,n,s),e.unwrap=()=>e._zod.def.innerType});function Dc(e){return new Tc({type:"readonly",innerType:e})}const Zc=m("ZodCustom",(e,t)=>{ni.init(e,t),W.init(e,t),e._zod.processJSONSchema=(r,n,s)=>ta(e,r)});function Nc(e,t={}){return Ji(Zc,e,t)}function Ac(e){return Xi(e)}const Wc={title:"Features/UI/Form",component:wa,tags:["autodocs"],parameters:{docs:{description:{component:`
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
        `}}}},We={render:()=>{const e={loginForm:$e({email:G().min(1,"Please enter your email").email("Please enter a valid email"),password:G().min(8,"Password must be at least 8 characters")})},t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"form-container",type:"Div",attributes:{className:"w-[340px]"},children:[{id:"form",type:"Form",attributes:{schemaName:"loginForm"},children:[{id:"form-fields-container",type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:"form-field-email",type:"FormField",attributes:{name:"email",label:"Email",type:"email",placeholder:"example@email.com",required:!0,disabled:!1}},{id:"form-field-password",type:"FormField",attributes:{name:"password",label:"Password",type:"password",placeholder:"Enter at least 8 characters",required:!0,disabled:!1}},{id:"submit-button",type:"Button",state:{buttonStyle:"filled",buttonType:"primary",size:"L"},attributes:{type:"submit",className:"w-full"},children:[{id:"submit-button-text",type:"Span",state:{text:"Login"}}]}]}]}]}]}};return j.jsx(be,{document:t,components:we(e)})},parameters:{docs:{description:{story:"A basic form example demonstrating zod schema validation. The form uses a zod schema to validate email and password fields. When validation fails, error messages are automatically displayed below the corresponding fields. The form only submits when all validations pass. Try submitting with invalid data to see validation errors."}}}},Ke={render:()=>{const e={registrationForm:$e({name:G().min(2,"Name must be at least 2 characters"),email:G().min(1,"Please enter your email").email("Please enter a valid email"),password:G().min(8,"Password must be at least 8 characters"),confirmPassword:G().min(1,"Please confirm your password")}).refine(r=>r.password===r.confirmPassword,{message:"Passwords do not match",path:["confirmPassword"]})},t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"form-container",type:"Div",attributes:{className:"w-[340px]"},children:[{id:"form",type:"Form",attributes:{schemaName:"registrationForm"},children:[{id:"form-fields-container",type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:"form-field-name",type:"FormField",attributes:{name:"name",label:"Name",type:"text",placeholder:"John Doe",required:!0,disabled:!1}},{id:"form-field-email",type:"FormField",attributes:{name:"email",label:"Email",type:"email",placeholder:"example@email.com",required:!0,disabled:!1}},{id:"form-field-password",type:"FormField",attributes:{name:"password",label:"Password",type:"password",placeholder:"Enter at least 8 characters",required:!0,disabled:!1}},{id:"form-field-confirmPassword",type:"FormField",attributes:{name:"confirmPassword",label:"Confirm Password",type:"password",placeholder:"Re-enter password",required:!0,disabled:!1}},{id:"submit-button",type:"Button",state:{buttonStyle:"filled",buttonType:"primary",size:"L"},attributes:{type:"submit",className:"w-full"},children:[{id:"submit-button-text",type:"Span",state:{text:"Sign Up"}}]}]}]}]}]}};return j.jsx(be,{document:t,components:we(e)})},parameters:{docs:{description:{story:"A registration form example that demonstrates cross-field validation using zod's refine method. The form validates that the password and confirm password fields match. When passwords don't match, an error is displayed on the confirmPassword field. This shows how to implement complex validation rules that depend on multiple fields."}}}},He={render:()=>{const e={userForm:$e({username:G().min(3,"Username must be at least 3 characters").regex(/^[a-zA-Z0-9_]+$/,"Only letters, numbers, and underscores are allowed"),email:G().min(1,"Please enter your email").email("Please enter a valid email")})},t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"form-container",type:"Div",attributes:{className:"w-[340px]"},children:[{id:"form",type:"Form",attributes:{schemaName:"userForm"},children:[{id:"form-fields-container",type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:"form-field-username",type:"FormField",attributes:{name:"username",label:"Username",type:"text",placeholder:"username",required:!0,disabled:!1,helpMessage:"Use at least 3 characters: letters, numbers, and underscores"}},{id:"form-field-email",type:"FormField",attributes:{name:"email",label:"Email",type:"email",placeholder:"example@email.com",required:!0,disabled:!1,helpMessage:"Used for login and notifications"}},{id:"submit-button",type:"Button",state:{buttonStyle:"filled",buttonType:"primary",size:"L"},attributes:{type:"submit",className:"w-full"},children:[{id:"submit-button-text",type:"Span",state:{text:"Submit"}}]}]}]}]}]}};return j.jsx(be,{document:t,components:we(e)})},parameters:{docs:{description:{story:"Demonstrates how to add help messages to form fields with zod validation. Help messages provide additional context and guidance to users about what to enter in each field. Help messages are displayed below the input field and remain visible even when the field is in an error state. The username field uses regex validation to ensure only alphanumeric characters and underscores are allowed."}}}},Ge={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"form-container",type:"Div",attributes:{className:"w-[340px]"},children:[{id:"form",type:"Form",attributes:{},children:[{id:"form-fields-container",type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:"form-field-email",type:"FormField",attributes:{name:"email",label:"Email",type:"text",placeholder:"example@email.com",required:!1,disabled:!1}},{id:"form-field-password",type:"FormField",attributes:{name:"password",label:"Password",type:"password",placeholder:"Enter password",required:!1,disabled:!1}},{id:"submit-button",type:"Button",state:{buttonStyle:"filled",buttonType:"primary",size:"L"},attributes:{type:"submit",className:"w-full"},children:[{id:"submit-button-text",type:"Span",state:{text:"Submit"}}]}]}]}]}]}};return j.jsx(be,{document:e,components:we()})},parameters:{docs:{description:{story:"Shows how to use the Form component without a validation schema. In this mode, the form collects data without performing any validation. This is useful for simple forms where validation is handled server-side or when you need maximum flexibility."}}}},Ye={render:()=>{const e={customForm:$e({phone:G().min(1,"Please enter your phone number").regex(/^010-\d{4}-\d{4}$/,"Please enter in format 010-XXXX-XXXX"),age:G().min(1,"Please enter your age").refine(r=>{const n=Number(r);return!Number.isNaN(n)&&n>=18&&n<=100},{message:"Age must be between 18 and 100"})})},t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"form-container",type:"Div",attributes:{className:"w-[340px]"},children:[{id:"form",type:"Form",attributes:{schemaName:"customForm"},children:[{id:"form-fields-container",type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:"form-field-phone",type:"FormField",attributes:{name:"phone",label:"Phone Number",type:"text",placeholder:"010-1234-5678",required:!0,disabled:!1,helpMessage:"Please enter in format 010-XXXX-XXXX"}},{id:"form-field-age",type:"FormField",attributes:{name:"age",label:"Age",type:"number",placeholder:"18",required:!0,disabled:!1}},{id:"submit-button",type:"Button",state:{buttonStyle:"filled",buttonType:"primary",size:"L"},attributes:{type:"submit",className:"w-full"},children:[{id:"submit-button-text",type:"Span",state:{text:"Submit"}}]}]}]}]}]}};return j.jsx(be,{document:t,components:we(e)})},parameters:{docs:{description:{story:"Demonstrates custom validation rules using zod. The phone field uses a regex pattern to validate Korean phone number format (010-XXXX-XXXX), and the age field uses a refine method to check that the value is between 18 and 100. This shows how to implement domain-specific validation rules beyond basic type checking."}}}},Qe={render:()=>{const e={profileForm:$e({email:G().email("Please enter a valid email"),username:G().min(3,"Username must be at least 3 characters")})},t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"form-container",type:"Div",attributes:{className:"w-[340px]"},children:[{id:"form",type:"Form",attributes:{schemaName:"profileForm"},children:[{id:"form-fields-container",type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:"form-field-email",type:"FormField",attributes:{name:"email",label:"Email",type:"email",placeholder:"example@email.com",required:!0,disabled:!1}},{id:"form-field-username",type:"FormField",attributes:{name:"username",label:"Username",type:"text",placeholder:"username",required:!0,disabled:!1}},{id:"submit-button",type:"Button",state:{buttonStyle:"filled",buttonType:"primary",size:"L"},attributes:{type:"submit",className:"w-full"},children:[{id:"submit-button-text",type:"Span",state:{text:"Submit"}}]}]}]}]}]}};return j.jsx(be,{document:t,components:we(e)})},parameters:{docs:{description:{story:"Demonstrates how to use schema names with getFormComponents. Schemas are registered via getFormComponents parameter, and the form references them using schemaName attribute. This approach is useful when you want to reuse schemas across multiple forms or when schemas are defined separately from the form document."}}}},et={render:()=>{const e={profileForm:$e({email:G().email("Please enter a valid email"),username:G().min(3,"Username must be at least 3 characters")})},t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"form-container",type:"Div",attributes:{className:"w-[340px]"},children:[{id:"form",type:"Form",attributes:{schemaName:"profileForm"},children:[{id:"form-fields-container",type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:"form-field-email",type:"FormField",attributes:{name:"email",label:"Email",disabled:!0,inputProps:{defaultValue:"user@example.com"}}},{id:"form-field-username",type:"FormField",attributes:{name:"username",label:"Username",placeholder:"Enter username",required:!0}},{id:"submit-button",type:"Button",state:{buttonStyle:"filled",buttonType:"primary",size:"L"},attributes:{type:"submit",className:"w-full"},children:[{id:"submit-button-text",type:"Span",state:{text:"Submit"}}]}]}]}]}]}};return j.jsx(be,{document:t,components:we(e)})},parameters:{docs:{description:{story:"Shows how to include disabled fields in a form with zod validation. Disabled fields are read-only and cannot be edited by users. They are useful for displaying pre-filled information that shouldn't be changed, such as user email addresses in profile forms. Disabled fields are still included in the form submission and validated according to the schema."}}}},tt={render:()=>{const e={loginForm:$e({email:G().min(1,"Please enter your email").email("Please enter a valid email"),password:G().min(8,"Password must be at least 8 characters")})},t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"form-container",type:"Div",attributes:{className:"w-[340px]"},children:[{id:"form",type:"Form",attributes:{schemaName:"loginForm"},children:[{id:"form-fields-container",type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:"form-field-email",type:"FormField",attributes:{name:"email",label:"Email",type:"email",placeholder:"example@email.com",required:!0,disabled:!1}},{id:"form-field-password",type:"FormField",attributes:{name:"password",label:"Password",type:"password",placeholder:"Enter at least 8 characters",required:!0,disabled:!1}},{id:"form-field-username",type:"FormField",attributes:{name:"username",label:"Username",type:"text",placeholder:"username",required:!0,disabled:!1}},{id:"submit-button",type:"Button",state:{buttonStyle:"filled",buttonType:"primary",size:"L"},attributes:{type:"submit",className:"w-full"},children:[{id:"submit-button-text",type:"Span",state:{text:"Login"}}]}]}]}]}]}};return j.jsx(jn,{children:j.jsx(be,{document:t,components:we(e)})})},parameters:{docs:{description:{story:'Demonstrates runtime validation when FormField names do not match the schema. The schema only defines "email" and "password" fields, but the form includes a "username" field that is not in the schema. This will throw an error and display it in the ErrorBoundary: "FormField with name "username" is not defined in the form schema. Expected fields: email, password". This helps catch mismatches between schema definitions and form fields during development.'}}}};We.parameters={...We.parameters,docs:{...We.parameters?.docs,source:{originalSource:`{
  render: () => {
    // Define zod schema for login form validation
    const schemas = {
      loginForm: z.object({
        // min(1) should come before email() to show custom message for empty fields
        email: z.string().min(1, 'Please enter your email').email('Please enter a valid email'),
        password: z.string().min(8, 'Password must be at least 8 characters')
      })
    };

    // Type-safe: Extract field names from schema
    // type LoginFields = ExtractSchemaFields<typeof schemas, 'loginForm'> // "email" | "password"
    // FormField's name can be validated with this type (full type safety is difficult at runtime since it's JSON)

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
            attributes: {
              schemaName: 'loginForm'
            },
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
                  label: 'Email',
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
                  label: 'Password',
                  type: 'password',
                  placeholder: 'Enter at least 8 characters',
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
                    text: 'Login'
                  }
                }]
              }]
            }]
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getFormComponents(schemas)} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic form example demonstrating zod schema validation. The form uses a zod schema to validate email and password fields. When validation fails, error messages are automatically displayed below the corresponding fields. The form only submits when all validations pass. Try submitting with invalid data to see validation errors.'
      }
    }
  }
}`,...We.parameters?.docs?.source}}};Ke.parameters={...Ke.parameters,docs:{...Ke.parameters?.docs,source:{originalSource:`{
  render: () => {
    // Define zod schema with cross-field validation
    const schemas = {
      registrationForm: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),
        // min(1) should come before email() to show custom message for empty fields
        email: z.string().min(1, 'Please enter your email').email('Please enter a valid email'),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string().min(1, 'Please confirm your password')
      }).refine(data => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'] // Display error on confirmPassword field
      })
    };
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
            attributes: {
              schemaName: 'registrationForm'
            },
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
                  label: 'Name',
                  type: 'text',
                  placeholder: 'John Doe',
                  required: true,
                  disabled: false
                }
              }, {
                id: 'form-field-email',
                type: 'FormField',
                attributes: {
                  name: 'email',
                  label: 'Email',
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
                  label: 'Password',
                  type: 'password',
                  placeholder: 'Enter at least 8 characters',
                  required: true,
                  disabled: false
                }
              }, {
                id: 'form-field-confirmPassword',
                type: 'FormField',
                attributes: {
                  name: 'confirmPassword',
                  label: 'Confirm Password',
                  type: 'password',
                  placeholder: 'Re-enter password',
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
                    text: 'Sign Up'
                  }
                }]
              }]
            }]
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getFormComponents(schemas)} />;
  },
  parameters: {
    docs: {
      description: {
        story: "A registration form example that demonstrates cross-field validation using zod's refine method. The form validates that the password and confirm password fields match. When passwords don't match, an error is displayed on the confirmPassword field. This shows how to implement complex validation rules that depend on multiple fields."
      }
    }
  }
}`,...Ke.parameters?.docs?.source}}};He.parameters={...He.parameters,docs:{...He.parameters?.docs,source:{originalSource:`{
  render: () => {
    // Define zod schema with custom validation rules
    const schemas = {
      userForm: z.object({
        username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores are allowed'),
        // min(1) should come before email() to show custom message for empty fields
        email: z.string().min(1, 'Please enter your email').email('Please enter a valid email')
      })
    };
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
            attributes: {
              schemaName: 'userForm'
            },
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
                  label: 'Username',
                  type: 'text',
                  placeholder: 'username',
                  required: true,
                  disabled: false,
                  helpMessage: 'Use at least 3 characters: letters, numbers, and underscores'
                }
              }, {
                id: 'form-field-email',
                type: 'FormField',
                attributes: {
                  name: 'email',
                  label: 'Email',
                  type: 'email',
                  placeholder: 'example@email.com',
                  required: true,
                  disabled: false,
                  helpMessage: 'Used for login and notifications'
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
                    text: 'Submit'
                  }
                }]
              }]
            }]
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getFormComponents(schemas)} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how to add help messages to form fields with zod validation. Help messages provide additional context and guidance to users about what to enter in each field. Help messages are displayed below the input field and remain visible even when the field is in an error state. The username field uses regex validation to ensure only alphanumeric characters and underscores are allowed.'
      }
    }
  }
}`,...He.parameters?.docs?.source}}};Ge.parameters={...Ge.parameters,docs:{...Ge.parameters?.docs,source:{originalSource:`{
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
                  label: 'Email',
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
                  label: 'Password',
                  type: 'password',
                  placeholder: 'Enter password',
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
                    text: 'Submit'
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
}`,...Ge.parameters?.docs?.source}}};Ye.parameters={...Ye.parameters,docs:{...Ye.parameters?.docs,source:{originalSource:`{
  render: () => {
    // Define zod schema with custom validation rules
    const schemas = {
      customForm: z.object({
        phone: z.string().min(1, 'Please enter your phone number').regex(/^010-\\d{4}-\\d{4}$/, 'Please enter in format 010-XXXX-XXXX'),
        age: z.string().min(1, 'Please enter your age').refine(val => {
          const num = Number(val);
          return !Number.isNaN(num) && num >= 18 && num <= 100;
        }, {
          message: 'Age must be between 18 and 100'
        })
      })
    };
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
            attributes: {
              schemaName: 'customForm'
            },
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
                  label: 'Phone Number',
                  type: 'text',
                  placeholder: '010-1234-5678',
                  required: true,
                  disabled: false,
                  helpMessage: 'Please enter in format 010-XXXX-XXXX'
                }
              }, {
                id: 'form-field-age',
                type: 'FormField',
                attributes: {
                  name: 'age',
                  label: 'Age',
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
                    text: 'Submit'
                  }
                }]
              }]
            }]
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getFormComponents(schemas)} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates custom validation rules using zod. The phone field uses a regex pattern to validate Korean phone number format (010-XXXX-XXXX), and the age field uses a refine method to check that the value is between 18 and 100. This shows how to implement domain-specific validation rules beyond basic type checking.'
      }
    }
  }
}`,...Ye.parameters?.docs?.source}}};Qe.parameters={...Qe.parameters,docs:{...Qe.parameters?.docs,source:{originalSource:`{
  render: () => {
    // Define schemas and register them via getFormComponents
    const schemas = {
      profileForm: z.object({
        email: z.string().email('Please enter a valid email'),
        username: z.string().min(3, 'Username must be at least 3 characters')
      })
    };
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
            attributes: {
              schemaName: 'profileForm' // Reference by schema name
            },
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
                  label: 'Email',
                  type: 'email',
                  placeholder: 'example@email.com',
                  required: true,
                  disabled: false
                }
              }, {
                id: 'form-field-username',
                type: 'FormField',
                attributes: {
                  name: 'username',
                  label: 'Username',
                  type: 'text',
                  placeholder: 'username',
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
                    text: 'Submit'
                  }
                }]
              }]
            }]
          }]
        }]
      }
    };
    // Pass schemas to getFormComponents to register them
    return <SduiLayoutRenderer document={document} components={getFormComponents(schemas)} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how to use schema names with getFormComponents. Schemas are registered via getFormComponents parameter, and the form references them using schemaName attribute. This approach is useful when you want to reuse schemas across multiple forms or when schemas are defined separately from the form document.'
      }
    }
  }
}`,...Qe.parameters?.docs?.source}}};et.parameters={...et.parameters,docs:{...et.parameters?.docs,source:{originalSource:`{
  render: () => {
    // Define schema for profile form with disabled email field
    const schemas = {
      profileForm: z.object({
        email: z.string().email('Please enter a valid email'),
        username: z.string().min(3, 'Username must be at least 3 characters')
      })
    };
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
            attributes: {
              schemaName: 'profileForm'
            },
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
                  label: 'Email',
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
                  label: 'Username',
                  placeholder: 'Enter username',
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
                    text: 'Submit'
                  }
                }]
              }]
            }]
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getFormComponents(schemas)} />;
  },
  parameters: {
    docs: {
      description: {
        story: "Shows how to include disabled fields in a form with zod validation. Disabled fields are read-only and cannot be edited by users. They are useful for displaying pre-filled information that shouldn't be changed, such as user email addresses in profile forms. Disabled fields are still included in the form submission and validated according to the schema."
      }
    }
  }
}`,...et.parameters?.docs?.source}}};tt.parameters={...tt.parameters,docs:{...tt.parameters?.docs,source:{originalSource:`{
  render: () => {
    // Define zod schema with only email and password
    const schemas = {
      loginForm: z.object({
        // min(1) should come before email() to show custom message for empty fields
        email: z.string().min(1, 'Please enter your email').email('Please enter a valid email'),
        password: z.string().min(8, 'Password must be at least 8 characters')
      })
    };
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
            attributes: {
              schemaName: 'loginForm'
            },
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
                  label: 'Email',
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
                  label: 'Password',
                  type: 'password',
                  placeholder: 'Enter at least 8 characters',
                  required: true,
                  disabled: false
                }
              }, {
                id: 'form-field-username',
                type: 'FormField',
                attributes: {
                  name: 'username',
                  label: 'Username',
                  type: 'text',
                  placeholder: 'username',
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
                    text: 'Login'
                  }
                }]
              }]
            }]
          }]
        }]
      }
    };
    return <ErrorBoundary>
        <SduiLayoutRenderer document={document} components={getFormComponents(schemas)} />
      </ErrorBoundary>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates runtime validation when FormField names do not match the schema. The schema only defines "email" and "password" fields, but the form includes a "username" field that is not in the schema. This will throw an error and display it in the ErrorBoundary: "FormField with name "username" is not defined in the form schema. Expected fields: email, password". This helps catch mismatches between schema definitions and form fields during development.'
      }
    }
  }
}`,...tt.parameters?.docs?.source}}};const Kc=["Basic","RegistrationForm","WithHelpMessages","WithoutSchema","CustomValidation","WithSchemaName","DisabledFields","SchemaMismatch"];export{We as Basic,Ye as CustomValidation,et as DisabledFields,Ke as RegistrationForm,tt as SchemaMismatch,He as WithHelpMessages,Qe as WithSchemaName,Ge as WithoutSchema,Kc as __namedExportsOrder,Wc as default};
