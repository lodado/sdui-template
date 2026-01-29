import{j as T}from"./jsx-runtime-D2LRXxLP.js";/* empty css               */import{$ as c,e as te,n as ie,g as ce,a as et,b as tt,c as Pe,i as Ne,d as de,f as y,h as ue,j as G,k as nt,l as rt,m as I,o as Te,p as ot,q as De,r as st,t as Oe,u as re,v as oe,w as me,x as C,y as m,z as at,A as R,E as it,F as ct,G as ut,H as pe,_ as lt,I as dt,J as mt,K as pt,L as ft,M as ht,N as yt,O as bt,P as gt,Q as vt,R as _t,T as wt,U as zt,V as St,W as $t,X as Zt,Y as kt,Z as Ft,a0 as xt,a1 as Pt,a2 as Nt,a3 as Ee,a4 as Tt,a5 as E,S as D,s as O,a6 as Dt}from"./sduiComponents-DHxdXZOo.js";import"./iframe-DKnaJEuY.js";import"./preload-helper-ggYluGXI.js";import"./index-Bhtou3Fa.js";const Ot=/^[cC][^\s-]{8,}$/,Et=/^[0-9a-z]+$/,jt=/^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/,It=/^[0-9a-vA-V]{20}$/,At=/^[A-Za-z0-9]{27}$/,Rt=/^[a-zA-Z0-9_-]{21}$/,Ct=/^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/,Ut=/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,fe=e=>e?new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${e}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`):/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/,Lt=/^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/,Jt="^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";function Xt(){return new RegExp(Jt,"u")}const qt=/^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,Bt=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,Mt=/^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/,Wt=/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,Vt=/^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/,je=/^[A-Za-z0-9_-]*$/,Kt=/^\+[1-9]\d{6,14}$/,Ie="(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))",Ht=new RegExp(`^${Ie}$`);function Ae(e){const t="(?:[01]\\d|2[0-3]):[0-5]\\d";return typeof e.precision=="number"?e.precision===-1?`${t}`:e.precision===0?`${t}:[0-5]\\d`:`${t}:[0-5]\\d\\.\\d{${e.precision}}`:`${t}(?::[0-5]\\d(?:\\.\\d+)?)?`}function Gt(e){return new RegExp(`^${Ae(e)}$`)}function Yt(e){const t=Ae({precision:e.precision}),n=["Z"];e.local&&n.push(""),e.offset&&n.push("([+-](?:[01]\\d|2[0-3]):[0-5]\\d)");const r=`${t}(?:${n.join("|")})`;return new RegExp(`^${Ie}T(?:${r})$`)}const Qt=e=>{const t=e?`[\\s\\S]{${e?.minimum??0},${e?.maximum??""}}`:"[\\s\\S]*";return new RegExp(`^${t}$`)},en=/^[^A-Z]*$/,tn=/^[^a-z]*$/,N=c("$ZodCheck",(e,t)=>{var n;e._zod??(e._zod={}),e._zod.def=t,(n=e._zod).onattach??(n.onattach=[])}),nn=c("$ZodCheckMaxLength",(e,t)=>{var n;N.init(e,t),(n=e._zod.def).when??(n.when=r=>{const o=r.value;return!ie(o)&&o.length!==void 0}),e._zod.onattach.push(r=>{const o=r._zod.bag.maximum??Number.POSITIVE_INFINITY;t.maximum<o&&(r._zod.bag.maximum=t.maximum)}),e._zod.check=r=>{const o=r.value;if(o.length<=t.maximum)return;const s=ce(o);r.issues.push({origin:s,code:"too_big",maximum:t.maximum,inclusive:!0,input:o,inst:e,continue:!t.abort})}}),rn=c("$ZodCheckMinLength",(e,t)=>{var n;N.init(e,t),(n=e._zod.def).when??(n.when=r=>{const o=r.value;return!ie(o)&&o.length!==void 0}),e._zod.onattach.push(r=>{const o=r._zod.bag.minimum??Number.NEGATIVE_INFINITY;t.minimum>o&&(r._zod.bag.minimum=t.minimum)}),e._zod.check=r=>{const o=r.value;if(o.length>=t.minimum)return;const s=ce(o);r.issues.push({origin:s,code:"too_small",minimum:t.minimum,inclusive:!0,input:o,inst:e,continue:!t.abort})}}),on=c("$ZodCheckLengthEquals",(e,t)=>{var n;N.init(e,t),(n=e._zod.def).when??(n.when=r=>{const o=r.value;return!ie(o)&&o.length!==void 0}),e._zod.onattach.push(r=>{const o=r._zod.bag;o.minimum=t.length,o.maximum=t.length,o.length=t.length}),e._zod.check=r=>{const o=r.value,a=o.length;if(a===t.length)return;const s=ce(o),i=a>t.length;r.issues.push({origin:s,...i?{code:"too_big",maximum:t.length}:{code:"too_small",minimum:t.length},inclusive:!0,exact:!0,input:r.value,inst:e,continue:!t.abort})}}),ne=c("$ZodCheckStringFormat",(e,t)=>{var n,r;N.init(e,t),e._zod.onattach.push(o=>{const a=o._zod.bag;a.format=t.format,t.pattern&&(a.patterns??(a.patterns=new Set),a.patterns.add(t.pattern))}),t.pattern?(n=e._zod).check??(n.check=o=>{t.pattern.lastIndex=0,!t.pattern.test(o.value)&&o.issues.push({origin:"string",code:"invalid_format",format:t.format,input:o.value,...t.pattern?{pattern:t.pattern.toString()}:{},inst:e,continue:!t.abort})}):(r=e._zod).check??(r.check=()=>{})}),sn=c("$ZodCheckRegex",(e,t)=>{ne.init(e,t),e._zod.check=n=>{t.pattern.lastIndex=0,!t.pattern.test(n.value)&&n.issues.push({origin:"string",code:"invalid_format",format:"regex",input:n.value,pattern:t.pattern.toString(),inst:e,continue:!t.abort})}}),an=c("$ZodCheckLowerCase",(e,t)=>{t.pattern??(t.pattern=en),ne.init(e,t)}),cn=c("$ZodCheckUpperCase",(e,t)=>{t.pattern??(t.pattern=tn),ne.init(e,t)}),un=c("$ZodCheckIncludes",(e,t)=>{N.init(e,t);const n=te(t.includes),r=new RegExp(typeof t.position=="number"?`^.{${t.position}}${n}`:n);t.pattern=r,e._zod.onattach.push(o=>{const a=o._zod.bag;a.patterns??(a.patterns=new Set),a.patterns.add(r)}),e._zod.check=o=>{o.value.includes(t.includes,t.position)||o.issues.push({origin:"string",code:"invalid_format",format:"includes",includes:t.includes,input:o.value,inst:e,continue:!t.abort})}}),ln=c("$ZodCheckStartsWith",(e,t)=>{N.init(e,t);const n=new RegExp(`^${te(t.prefix)}.*`);t.pattern??(t.pattern=n),e._zod.onattach.push(r=>{const o=r._zod.bag;o.patterns??(o.patterns=new Set),o.patterns.add(n)}),e._zod.check=r=>{r.value.startsWith(t.prefix)||r.issues.push({origin:"string",code:"invalid_format",format:"starts_with",prefix:t.prefix,input:r.value,inst:e,continue:!t.abort})}}),dn=c("$ZodCheckEndsWith",(e,t)=>{N.init(e,t);const n=new RegExp(`.*${te(t.suffix)}$`);t.pattern??(t.pattern=n),e._zod.onattach.push(r=>{const o=r._zod.bag;o.patterns??(o.patterns=new Set),o.patterns.add(n)}),e._zod.check=r=>{r.value.endsWith(t.suffix)||r.issues.push({origin:"string",code:"invalid_format",format:"ends_with",suffix:t.suffix,input:r.value,inst:e,continue:!t.abort})}}),mn=c("$ZodCheckOverwrite",(e,t)=>{N.init(e,t),e._zod.check=n=>{n.value=t.tx(n.value)}});class pn{constructor(t=[]){this.content=[],this.indent=0,this&&(this.args=t)}indented(t){this.indent+=1,t(this),this.indent-=1}write(t){if(typeof t=="function"){t(this,{execution:"sync"}),t(this,{execution:"async"});return}const r=t.split(`
`).filter(s=>s),o=Math.min(...r.map(s=>s.length-s.trimStart().length)),a=r.map(s=>s.slice(o)).map(s=>" ".repeat(this.indent*2)+s);for(const s of a)this.content.push(s)}compile(){const t=Function,n=this?.args,o=[...(this?.content??[""]).map(a=>`  ${a}`)];return new t(...n,o.join(`
`))}}const fn={major:4,minor:3,patch:5},v=c("$ZodType",(e,t)=>{var n;e??(e={}),e._zod.def=t,e._zod.bag=e._zod.bag||{},e._zod.version=fn;const r=[...e._zod.def.checks??[]];e._zod.traits.has("$ZodCheck")&&r.unshift(e);for(const o of r)for(const a of o._zod.onattach)a(e);if(r.length===0)(n=e._zod).deferred??(n.deferred=[]),e._zod.deferred?.push(()=>{e._zod.run=e._zod.parse});else{const o=(s,i,u)=>{let l=I(s),d;for(const h of i){if(h._zod.def.when){if(!h._zod.def.when(s))continue}else if(l)continue;const f=s.issues.length,p=h._zod.check(s);if(p instanceof Promise&&u?.async===!1)throw new G;if(d||p instanceof Promise)d=(d??Promise.resolve()).then(async()=>{await p,s.issues.length!==f&&(l||(l=I(s,f)))});else{if(s.issues.length===f)continue;l||(l=I(s,f))}}return d?d.then(()=>s):s},a=(s,i,u)=>{if(I(s))return s.aborted=!0,s;const l=o(i,r,u);if(l instanceof Promise){if(u.async===!1)throw new G;return l.then(d=>e._zod.parse(d,u))}return e._zod.parse(l,u)};e._zod.run=(s,i)=>{if(i.skipChecks)return e._zod.parse(s,i);if(i.direction==="backward"){const l=e._zod.parse({value:s.value,issues:[]},{...i,skipChecks:!0});return l instanceof Promise?l.then(d=>a(d,s,i)):a(l,s,i)}const u=e._zod.parse(s,i);if(u instanceof Promise){if(i.async===!1)throw new G;return u.then(l=>o(l,r,i))}return o(u,r,i)}}y(e,"~standard",()=>({validate:o=>{try{const a=nt(e,o);return a.success?{value:a.data}:{issues:a.error?.issues}}catch{return rt(e,o).then(s=>s.success?{value:s.data}:{issues:s.error?.issues})}},vendor:"zod",version:1}))}),le=c("$ZodString",(e,t)=>{v.init(e,t),e._zod.pattern=[...e?._zod.bag?.patterns??[]].pop()??Qt(e._zod.bag),e._zod.parse=(n,r)=>{if(t.coerce)try{n.value=String(n.value)}catch{}return typeof n.value=="string"||n.issues.push({expected:"string",code:"invalid_type",input:n.value,inst:e}),n}}),b=c("$ZodStringFormat",(e,t)=>{ne.init(e,t),le.init(e,t)}),hn=c("$ZodGUID",(e,t)=>{t.pattern??(t.pattern=Ut),b.init(e,t)}),yn=c("$ZodUUID",(e,t)=>{if(t.version){const r={v1:1,v2:2,v3:3,v4:4,v5:5,v6:6,v7:7,v8:8}[t.version];if(r===void 0)throw new Error(`Invalid UUID version: "${t.version}"`);t.pattern??(t.pattern=fe(r))}else t.pattern??(t.pattern=fe());b.init(e,t)}),bn=c("$ZodEmail",(e,t)=>{t.pattern??(t.pattern=Lt),b.init(e,t)}),gn=c("$ZodURL",(e,t)=>{b.init(e,t),e._zod.check=n=>{try{const r=n.value.trim(),o=new URL(r);t.hostname&&(t.hostname.lastIndex=0,t.hostname.test(o.hostname)||n.issues.push({code:"invalid_format",format:"url",note:"Invalid hostname",pattern:t.hostname.source,input:n.value,inst:e,continue:!t.abort})),t.protocol&&(t.protocol.lastIndex=0,t.protocol.test(o.protocol.endsWith(":")?o.protocol.slice(0,-1):o.protocol)||n.issues.push({code:"invalid_format",format:"url",note:"Invalid protocol",pattern:t.protocol.source,input:n.value,inst:e,continue:!t.abort})),t.normalize?n.value=o.href:n.value=r;return}catch{n.issues.push({code:"invalid_format",format:"url",input:n.value,inst:e,continue:!t.abort})}}}),vn=c("$ZodEmoji",(e,t)=>{t.pattern??(t.pattern=Xt()),b.init(e,t)}),_n=c("$ZodNanoID",(e,t)=>{t.pattern??(t.pattern=Rt),b.init(e,t)}),wn=c("$ZodCUID",(e,t)=>{t.pattern??(t.pattern=Ot),b.init(e,t)}),zn=c("$ZodCUID2",(e,t)=>{t.pattern??(t.pattern=Et),b.init(e,t)}),Sn=c("$ZodULID",(e,t)=>{t.pattern??(t.pattern=jt),b.init(e,t)}),$n=c("$ZodXID",(e,t)=>{t.pattern??(t.pattern=It),b.init(e,t)}),Zn=c("$ZodKSUID",(e,t)=>{t.pattern??(t.pattern=At),b.init(e,t)}),kn=c("$ZodISODateTime",(e,t)=>{t.pattern??(t.pattern=Yt(t)),b.init(e,t)}),Fn=c("$ZodISODate",(e,t)=>{t.pattern??(t.pattern=Ht),b.init(e,t)}),xn=c("$ZodISOTime",(e,t)=>{t.pattern??(t.pattern=Gt(t)),b.init(e,t)}),Pn=c("$ZodISODuration",(e,t)=>{t.pattern??(t.pattern=Ct),b.init(e,t)}),Nn=c("$ZodIPv4",(e,t)=>{t.pattern??(t.pattern=qt),b.init(e,t),e._zod.bag.format="ipv4"}),Tn=c("$ZodIPv6",(e,t)=>{t.pattern??(t.pattern=Bt),b.init(e,t),e._zod.bag.format="ipv6",e._zod.check=n=>{try{new URL(`http://[${n.value}]`)}catch{n.issues.push({code:"invalid_format",format:"ipv6",input:n.value,inst:e,continue:!t.abort})}}}),Dn=c("$ZodCIDRv4",(e,t)=>{t.pattern??(t.pattern=Mt),b.init(e,t)}),On=c("$ZodCIDRv6",(e,t)=>{t.pattern??(t.pattern=Wt),b.init(e,t),e._zod.check=n=>{const r=n.value.split("/");try{if(r.length!==2)throw new Error;const[o,a]=r;if(!a)throw new Error;const s=Number(a);if(`${s}`!==a)throw new Error;if(s<0||s>128)throw new Error;new URL(`http://[${o}]`)}catch{n.issues.push({code:"invalid_format",format:"cidrv6",input:n.value,inst:e,continue:!t.abort})}}});function Re(e){if(e==="")return!0;if(e.length%4!==0)return!1;try{return atob(e),!0}catch{return!1}}const En=c("$ZodBase64",(e,t)=>{t.pattern??(t.pattern=Vt),b.init(e,t),e._zod.bag.contentEncoding="base64",e._zod.check=n=>{Re(n.value)||n.issues.push({code:"invalid_format",format:"base64",input:n.value,inst:e,continue:!t.abort})}});function jn(e){if(!je.test(e))return!1;const t=e.replace(/[-_]/g,r=>r==="-"?"+":"/"),n=t.padEnd(Math.ceil(t.length/4)*4,"=");return Re(n)}const In=c("$ZodBase64URL",(e,t)=>{t.pattern??(t.pattern=je),b.init(e,t),e._zod.bag.contentEncoding="base64url",e._zod.check=n=>{jn(n.value)||n.issues.push({code:"invalid_format",format:"base64url",input:n.value,inst:e,continue:!t.abort})}}),An=c("$ZodE164",(e,t)=>{t.pattern??(t.pattern=Kt),b.init(e,t)});function Rn(e,t=null){try{const n=e.split(".");if(n.length!==3)return!1;const[r]=n;if(!r)return!1;const o=JSON.parse(atob(r));return!("typ"in o&&o?.typ!=="JWT"||!o.alg||t&&(!("alg"in o)||o.alg!==t))}catch{return!1}}const Cn=c("$ZodJWT",(e,t)=>{b.init(e,t),e._zod.check=n=>{Rn(n.value,t.alg)||n.issues.push({code:"invalid_format",format:"jwt",input:n.value,inst:e,continue:!t.abort})}}),Un=c("$ZodUnknown",(e,t)=>{v.init(e,t),e._zod.parse=n=>n}),Ln=c("$ZodNever",(e,t)=>{v.init(e,t),e._zod.parse=(n,r)=>(n.issues.push({expected:"never",code:"invalid_type",input:n.value,inst:e}),n)});function he(e,t,n){e.issues.length&&t.issues.push(...De(n,e.issues)),t.value[n]=e.value}const Jn=c("$ZodArray",(e,t)=>{v.init(e,t),e._zod.parse=(n,r)=>{const o=n.value;if(!Array.isArray(o))return n.issues.push({expected:"array",code:"invalid_type",input:o,inst:e}),n;n.value=Array(o.length);const a=[];for(let s=0;s<o.length;s++){const i=o[s],u=t.element._zod.run({value:i,issues:[]},r);u instanceof Promise?a.push(u.then(l=>he(l,n,s))):he(u,n,s)}return a.length?Promise.all(a).then(()=>n):n}});function Y(e,t,n,r,o){if(e.issues.length){if(o&&!(n in r))return;t.issues.push(...De(n,e.issues))}e.value===void 0?n in r&&(t.value[n]=void 0):t.value[n]=e.value}function Ce(e){const t=Object.keys(e.shape);for(const r of t)if(!e.shape?.[r]?._zod?.traits?.has("$ZodType"))throw new Error(`Invalid element at key "${r}": expected a Zod schema`);const n=st(e.shape);return{...e,keys:t,keySet:new Set(t),numKeys:t.length,optionalKeys:new Set(n)}}function Ue(e,t,n,r,o,a){const s=[],i=o.keySet,u=o.catchall._zod,l=u.def.type,d=u.optout==="optional";for(const h in t){if(i.has(h))continue;if(l==="never"){s.push(h);continue}const f=u.run({value:t[h],issues:[]},r);f instanceof Promise?e.push(f.then(p=>Y(p,n,h,t,d))):Y(f,n,h,t,d)}return s.length&&n.issues.push({code:"unrecognized_keys",keys:s,input:t,inst:a}),e.length?Promise.all(e).then(()=>n):n}const Xn=c("$ZodObject",(e,t)=>{if(v.init(e,t),!Object.getOwnPropertyDescriptor(t,"shape")?.get){const i=t.shape;Object.defineProperty(t,"shape",{get:()=>{const u={...i};return Object.defineProperty(t,"shape",{value:u}),u}})}const r=Pe(()=>Ce(t));y(e._zod,"propValues",()=>{const i=t.shape,u={};for(const l in i){const d=i[l]._zod;if(d.values){u[l]??(u[l]=new Set);for(const h of d.values)u[l].add(h)}}return u});const o=Ne,a=t.catchall;let s;e._zod.parse=(i,u)=>{s??(s=r.value);const l=i.value;if(!o(l))return i.issues.push({expected:"object",code:"invalid_type",input:l,inst:e}),i;i.value={};const d=[],h=s.shape;for(const f of s.keys){const p=h[f],$=p._zod.optout==="optional",w=p._zod.run({value:l[f],issues:[]},u);w instanceof Promise?d.push(w.then(U=>Y(U,i,f,l,$))):Y(w,i,f,l,$)}return a?Ue(d,l,i,u,r.value,e):d.length?Promise.all(d).then(()=>i):i}}),qn=c("$ZodObjectJIT",(e,t)=>{Xn.init(e,t);const n=e._zod.parse,r=Pe(()=>Ce(t)),o=f=>{const p=new pn(["shape","payload","ctx"]),$=r.value,w=P=>{const k=de(P);return`shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`};p.write("const input = payload.value;");const U=Object.create(null);let Ge=0;for(const P of $.keys)U[P]=`key_${Ge++}`;p.write("const newResult = {};");for(const P of $.keys){const k=U[P],x=de(P),Qe=f[P]?._zod?.optout==="optional";p.write(`const ${k} = ${w(P)};`),Qe?p.write(`
        if (${k}.issues.length) {
          if (${x} in input) {
            payload.issues = payload.issues.concat(${k}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${x}, ...iss.path] : [${x}]
            })));
          }
        }
        
        if (${k}.value === undefined) {
          if (${x} in input) {
            newResult[${x}] = undefined;
          }
        } else {
          newResult[${x}] = ${k}.value;
        }
        
      `):p.write(`
        if (${k}.issues.length) {
          payload.issues = payload.issues.concat(${k}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${x}, ...iss.path] : [${x}]
          })));
        }
        
        if (${k}.value === undefined) {
          if (${x} in input) {
            newResult[${x}] = undefined;
          }
        } else {
          newResult[${x}] = ${k}.value;
        }
        
      `)}p.write("payload.value = newResult;"),p.write("return payload;");const Ye=p.compile();return(P,k)=>Ye(f,P,k)};let a;const s=Ne,i=!et.jitless,l=i&&tt.value,d=t.catchall;let h;e._zod.parse=(f,p)=>{h??(h=r.value);const $=f.value;return s($)?i&&l&&p?.async===!1&&p.jitless!==!0?(a||(a=o(t.shape)),f=a(f,p),d?Ue([],$,f,p,h,e):f):n(f,p):(f.issues.push({expected:"object",code:"invalid_type",input:$,inst:e}),f)}});function ye(e,t,n,r){for(const a of e)if(a.issues.length===0)return t.value=a.value,t;const o=e.filter(a=>!I(a));return o.length===1?(t.value=o[0].value,o[0]):(t.issues.push({code:"invalid_union",input:t.value,inst:n,errors:e.map(a=>a.issues.map(s=>re(s,r,oe())))}),t)}const Bn=c("$ZodUnion",(e,t)=>{v.init(e,t),y(e._zod,"optin",()=>t.options.some(o=>o._zod.optin==="optional")?"optional":void 0),y(e._zod,"optout",()=>t.options.some(o=>o._zod.optout==="optional")?"optional":void 0),y(e._zod,"values",()=>{if(t.options.every(o=>o._zod.values))return new Set(t.options.flatMap(o=>Array.from(o._zod.values)))}),y(e._zod,"pattern",()=>{if(t.options.every(o=>o._zod.pattern)){const o=t.options.map(a=>a._zod.pattern);return new RegExp(`^(${o.map(a=>ue(a.source)).join("|")})$`)}});const n=t.options.length===1,r=t.options[0]._zod.run;e._zod.parse=(o,a)=>{if(n)return r(o,a);let s=!1;const i=[];for(const u of t.options){const l=u._zod.run({value:o.value,issues:[]},a);if(l instanceof Promise)i.push(l),s=!0;else{if(l.issues.length===0)return l;i.push(l)}}return s?Promise.all(i).then(u=>ye(u,o,e,a)):ye(i,o,e,a)}}),Mn=c("$ZodIntersection",(e,t)=>{v.init(e,t),e._zod.parse=(n,r)=>{const o=n.value,a=t.left._zod.run({value:o,issues:[]},r),s=t.right._zod.run({value:o,issues:[]},r);return a instanceof Promise||s instanceof Promise?Promise.all([a,s]).then(([u,l])=>be(n,u,l)):be(n,a,s)}});function se(e,t){if(e===t)return{valid:!0,data:e};if(e instanceof Date&&t instanceof Date&&+e==+t)return{valid:!0,data:e};if(me(e)&&me(t)){const n=Object.keys(t),r=Object.keys(e).filter(a=>n.indexOf(a)!==-1),o={...e,...t};for(const a of r){const s=se(e[a],t[a]);if(!s.valid)return{valid:!1,mergeErrorPath:[a,...s.mergeErrorPath]};o[a]=s.data}return{valid:!0,data:o}}if(Array.isArray(e)&&Array.isArray(t)){if(e.length!==t.length)return{valid:!1,mergeErrorPath:[]};const n=[];for(let r=0;r<e.length;r++){const o=e[r],a=t[r],s=se(o,a);if(!s.valid)return{valid:!1,mergeErrorPath:[r,...s.mergeErrorPath]};n.push(s.data)}return{valid:!0,data:n}}return{valid:!1,mergeErrorPath:[]}}function be(e,t,n){const r=new Map;let o;for(const i of t.issues)if(i.code==="unrecognized_keys"){o??(o=i);for(const u of i.keys)r.has(u)||r.set(u,{}),r.get(u).l=!0}else e.issues.push(i);for(const i of n.issues)if(i.code==="unrecognized_keys")for(const u of i.keys)r.has(u)||r.set(u,{}),r.get(u).r=!0;else e.issues.push(i);const a=[...r].filter(([,i])=>i.l&&i.r).map(([i])=>i);if(a.length&&o&&e.issues.push({...o,keys:a}),I(e))return e;const s=se(t.value,n.value);if(!s.valid)throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(s.mergeErrorPath)}`);return e.value=s.data,e}const Wn=c("$ZodEnum",(e,t)=>{v.init(e,t);const n=Te(t.entries),r=new Set(n);e._zod.values=r,e._zod.pattern=new RegExp(`^(${n.filter(o=>ot.has(typeof o)).map(o=>typeof o=="string"?te(o):o.toString()).join("|")})$`),e._zod.parse=(o,a)=>{const s=o.value;return r.has(s)||o.issues.push({code:"invalid_value",values:n,input:s,inst:e}),o}}),Vn=c("$ZodTransform",(e,t)=>{v.init(e,t),e._zod.parse=(n,r)=>{if(r.direction==="backward")throw new Oe(e.constructor.name);const o=t.transform(n.value,n);if(r.async)return(o instanceof Promise?o:Promise.resolve(o)).then(s=>(n.value=s,n));if(o instanceof Promise)throw new G;return n.value=o,n}});function ge(e,t){return e.issues.length&&t===void 0?{issues:[],value:void 0}:e}const Le=c("$ZodOptional",(e,t)=>{v.init(e,t),e._zod.optin="optional",e._zod.optout="optional",y(e._zod,"values",()=>t.innerType._zod.values?new Set([...t.innerType._zod.values,void 0]):void 0),y(e._zod,"pattern",()=>{const n=t.innerType._zod.pattern;return n?new RegExp(`^(${ue(n.source)})?$`):void 0}),e._zod.parse=(n,r)=>{if(t.innerType._zod.optin==="optional"){const o=t.innerType._zod.run(n,r);return o instanceof Promise?o.then(a=>ge(a,n.value)):ge(o,n.value)}return n.value===void 0?n:t.innerType._zod.run(n,r)}}),Kn=c("$ZodExactOptional",(e,t)=>{Le.init(e,t),y(e._zod,"values",()=>t.innerType._zod.values),y(e._zod,"pattern",()=>t.innerType._zod.pattern),e._zod.parse=(n,r)=>t.innerType._zod.run(n,r)}),Hn=c("$ZodNullable",(e,t)=>{v.init(e,t),y(e._zod,"optin",()=>t.innerType._zod.optin),y(e._zod,"optout",()=>t.innerType._zod.optout),y(e._zod,"pattern",()=>{const n=t.innerType._zod.pattern;return n?new RegExp(`^(${ue(n.source)}|null)$`):void 0}),y(e._zod,"values",()=>t.innerType._zod.values?new Set([...t.innerType._zod.values,null]):void 0),e._zod.parse=(n,r)=>n.value===null?n:t.innerType._zod.run(n,r)}),Gn=c("$ZodDefault",(e,t)=>{v.init(e,t),e._zod.optin="optional",y(e._zod,"values",()=>t.innerType._zod.values),e._zod.parse=(n,r)=>{if(r.direction==="backward")return t.innerType._zod.run(n,r);if(n.value===void 0)return n.value=t.defaultValue,n;const o=t.innerType._zod.run(n,r);return o instanceof Promise?o.then(a=>ve(a,t)):ve(o,t)}});function ve(e,t){return e.value===void 0&&(e.value=t.defaultValue),e}const Yn=c("$ZodPrefault",(e,t)=>{v.init(e,t),e._zod.optin="optional",y(e._zod,"values",()=>t.innerType._zod.values),e._zod.parse=(n,r)=>(r.direction==="backward"||n.value===void 0&&(n.value=t.defaultValue),t.innerType._zod.run(n,r))}),Qn=c("$ZodNonOptional",(e,t)=>{v.init(e,t),y(e._zod,"values",()=>{const n=t.innerType._zod.values;return n?new Set([...n].filter(r=>r!==void 0)):void 0}),e._zod.parse=(n,r)=>{const o=t.innerType._zod.run(n,r);return o instanceof Promise?o.then(a=>_e(a,e)):_e(o,e)}});function _e(e,t){return!e.issues.length&&e.value===void 0&&e.issues.push({code:"invalid_type",expected:"nonoptional",input:e.value,inst:t}),e}const er=c("$ZodCatch",(e,t)=>{v.init(e,t),y(e._zod,"optin",()=>t.innerType._zod.optin),y(e._zod,"optout",()=>t.innerType._zod.optout),y(e._zod,"values",()=>t.innerType._zod.values),e._zod.parse=(n,r)=>{if(r.direction==="backward")return t.innerType._zod.run(n,r);const o=t.innerType._zod.run(n,r);return o instanceof Promise?o.then(a=>(n.value=a.value,a.issues.length&&(n.value=t.catchValue({...n,error:{issues:a.issues.map(s=>re(s,r,oe()))},input:n.value}),n.issues=[]),n)):(n.value=o.value,o.issues.length&&(n.value=t.catchValue({...n,error:{issues:o.issues.map(a=>re(a,r,oe()))},input:n.value}),n.issues=[]),n)}}),tr=c("$ZodPipe",(e,t)=>{v.init(e,t),y(e._zod,"values",()=>t.in._zod.values),y(e._zod,"optin",()=>t.in._zod.optin),y(e._zod,"optout",()=>t.out._zod.optout),y(e._zod,"propValues",()=>t.in._zod.propValues),e._zod.parse=(n,r)=>{if(r.direction==="backward"){const a=t.out._zod.run(n,r);return a instanceof Promise?a.then(s=>L(s,t.in,r)):L(a,t.in,r)}const o=t.in._zod.run(n,r);return o instanceof Promise?o.then(a=>L(a,t.out,r)):L(o,t.out,r)}});function L(e,t,n){return e.issues.length?(e.aborted=!0,e):t._zod.run({value:e.value,issues:e.issues},n)}const nr=c("$ZodReadonly",(e,t)=>{v.init(e,t),y(e._zod,"propValues",()=>t.innerType._zod.propValues),y(e._zod,"values",()=>t.innerType._zod.values),y(e._zod,"optin",()=>t.innerType?._zod?.optin),y(e._zod,"optout",()=>t.innerType?._zod?.optout),e._zod.parse=(n,r)=>{if(r.direction==="backward")return t.innerType._zod.run(n,r);const o=t.innerType._zod.run(n,r);return o instanceof Promise?o.then(we):we(o)}});function we(e){return e.value=Object.freeze(e.value),e}const rr=c("$ZodCustom",(e,t)=>{N.init(e,t),v.init(e,t),e._zod.parse=(n,r)=>n,e._zod.check=n=>{const r=n.value,o=t.fn(r);if(o instanceof Promise)return o.then(a=>ze(a,n,r,e));ze(o,n,r,e)}});function ze(e,t,n,r){if(!e){const o={code:"custom",input:n,inst:r,path:[...r._zod.def.path??[]],continue:!r._zod.def.abort};r._zod.def.params&&(o.params=r._zod.def.params),t.issues.push(C(o))}}function or(e,t){return new e({type:"string",...m(t)})}function sr(e,t){return new e({type:"string",format:"email",check:"string_format",abort:!1,...m(t)})}function Se(e,t){return new e({type:"string",format:"guid",check:"string_format",abort:!1,...m(t)})}function ar(e,t){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,...m(t)})}function ir(e,t){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v4",...m(t)})}function cr(e,t){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v6",...m(t)})}function ur(e,t){return new e({type:"string",format:"uuid",check:"string_format",abort:!1,version:"v7",...m(t)})}function lr(e,t){return new e({type:"string",format:"url",check:"string_format",abort:!1,...m(t)})}function dr(e,t){return new e({type:"string",format:"emoji",check:"string_format",abort:!1,...m(t)})}function mr(e,t){return new e({type:"string",format:"nanoid",check:"string_format",abort:!1,...m(t)})}function pr(e,t){return new e({type:"string",format:"cuid",check:"string_format",abort:!1,...m(t)})}function fr(e,t){return new e({type:"string",format:"cuid2",check:"string_format",abort:!1,...m(t)})}function hr(e,t){return new e({type:"string",format:"ulid",check:"string_format",abort:!1,...m(t)})}function yr(e,t){return new e({type:"string",format:"xid",check:"string_format",abort:!1,...m(t)})}function br(e,t){return new e({type:"string",format:"ksuid",check:"string_format",abort:!1,...m(t)})}function gr(e,t){return new e({type:"string",format:"ipv4",check:"string_format",abort:!1,...m(t)})}function vr(e,t){return new e({type:"string",format:"ipv6",check:"string_format",abort:!1,...m(t)})}function _r(e,t){return new e({type:"string",format:"cidrv4",check:"string_format",abort:!1,...m(t)})}function wr(e,t){return new e({type:"string",format:"cidrv6",check:"string_format",abort:!1,...m(t)})}function zr(e,t){return new e({type:"string",format:"base64",check:"string_format",abort:!1,...m(t)})}function Sr(e,t){return new e({type:"string",format:"base64url",check:"string_format",abort:!1,...m(t)})}function $r(e,t){return new e({type:"string",format:"e164",check:"string_format",abort:!1,...m(t)})}function Zr(e,t){return new e({type:"string",format:"jwt",check:"string_format",abort:!1,...m(t)})}function kr(e,t){return new e({type:"string",format:"datetime",check:"string_format",offset:!1,local:!1,precision:null,...m(t)})}function Fr(e,t){return new e({type:"string",format:"date",check:"string_format",...m(t)})}function xr(e,t){return new e({type:"string",format:"time",check:"string_format",precision:null,...m(t)})}function Pr(e,t){return new e({type:"string",format:"duration",check:"string_format",...m(t)})}function Nr(e){return new e({type:"unknown"})}function Tr(e,t){return new e({type:"never",...m(t)})}function Je(e,t){return new nn({check:"max_length",...m(t),maximum:e})}function Q(e,t){return new rn({check:"min_length",...m(t),minimum:e})}function Xe(e,t){return new on({check:"length_equals",...m(t),length:e})}function Dr(e,t){return new sn({check:"string_format",format:"regex",...m(t),pattern:e})}function Or(e){return new an({check:"string_format",format:"lowercase",...m(e)})}function Er(e){return new cn({check:"string_format",format:"uppercase",...m(e)})}function jr(e,t){return new un({check:"string_format",format:"includes",...m(t),includes:e})}function Ir(e,t){return new ln({check:"string_format",format:"starts_with",...m(t),prefix:e})}function Ar(e,t){return new dn({check:"string_format",format:"ends_with",...m(t),suffix:e})}function A(e){return new mn({check:"overwrite",tx:e})}function Rr(e){return A(t=>t.normalize(e))}function Cr(){return A(e=>e.trim())}function Ur(){return A(e=>e.toLowerCase())}function Lr(){return A(e=>e.toUpperCase())}function Jr(){return A(e=>at(e))}function Xr(e,t,n){return new e({type:"array",element:t,...m(n)})}function qr(e,t,n){return new e({type:"custom",check:"custom",fn:t,...m(n)})}function Br(e){const t=Mr(n=>(n.addIssue=r=>{if(typeof r=="string")n.issues.push(C(r,n.value,t._zod.def));else{const o=r;o.fatal&&(o.continue=!1),o.code??(o.code="custom"),o.input??(o.input=n.value),o.inst??(o.inst=t),o.continue??(o.continue=!t._zod.def.abort),n.issues.push(C(o))}},e(n.value,n)));return t}function Mr(e,t){const n=new N({check:"custom",...m(t)});return n._zod.check=e,n}function qe(e){let t=e?.target??"draft-2020-12";return t==="draft-4"&&(t="draft-04"),t==="draft-7"&&(t="draft-07"),{processors:e.processors??{},metadataRegistry:e?.metadata??R,target:t,unrepresentable:e?.unrepresentable??"throw",override:e?.override??(()=>{}),io:e?.io??"output",counter:0,seen:new Map,cycles:e?.cycles??"ref",reused:e?.reused??"inline",external:e?.external??void 0}}function z(e,t,n={path:[],schemaPath:[]}){var r;const o=e._zod.def,a=t.seen.get(e);if(a)return a.count++,n.schemaPath.includes(e)&&(a.cycle=n.path),a.schema;const s={schema:{},count:1,cycle:void 0,path:n.path};t.seen.set(e,s);const i=e._zod.toJSONSchema?.();if(i)s.schema=i;else{const d={...n,schemaPath:[...n.schemaPath,e],path:n.path};if(e._zod.processJSONSchema)e._zod.processJSONSchema(t,s.schema,d);else{const f=s.schema,p=t.processors[o.type];if(!p)throw new Error(`[toJSONSchema]: Non-representable type encountered: ${o.type}`);p(e,t,f,d)}const h=e._zod.parent;h&&(s.ref||(s.ref=h),z(h,t,d),t.seen.get(h).isParent=!0)}const u=t.metadataRegistry.get(e);return u&&Object.assign(s.schema,u),t.io==="input"&&Z(e)&&(delete s.schema.examples,delete s.schema.default),t.io==="input"&&s.schema._prefault&&((r=s.schema).default??(r.default=s.schema._prefault)),delete s.schema._prefault,t.seen.get(e).schema}function Be(e,t){const n=e.seen.get(t);if(!n)throw new Error("Unprocessed schema. This is a bug in Zod.");const r=new Map;for(const s of e.seen.entries()){const i=e.metadataRegistry.get(s[0])?.id;if(i){const u=r.get(i);if(u&&u!==s[0])throw new Error(`Duplicate schema id "${i}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);r.set(i,s[0])}}const o=s=>{const i=e.target==="draft-2020-12"?"$defs":"definitions";if(e.external){const h=e.external.registry.get(s[0])?.id,f=e.external.uri??($=>$);if(h)return{ref:f(h)};const p=s[1].defId??s[1].schema.id??`schema${e.counter++}`;return s[1].defId=p,{defId:p,ref:`${f("__shared")}#/${i}/${p}`}}if(s[1]===n)return{ref:"#"};const l=`#/${i}/`,d=s[1].schema.id??`__schema${e.counter++}`;return{defId:d,ref:l+d}},a=s=>{if(s[1].schema.$ref)return;const i=s[1],{ref:u,defId:l}=o(s);i.def={...i.schema},l&&(i.defId=l);const d=i.schema;for(const h in d)delete d[h];d.$ref=u};if(e.cycles==="throw")for(const s of e.seen.entries()){const i=s[1];if(i.cycle)throw new Error(`Cycle detected: #/${i.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`)}for(const s of e.seen.entries()){const i=s[1];if(t===s[0]){a(s);continue}if(e.external){const l=e.external.registry.get(s[0])?.id;if(t!==s[0]&&l){a(s);continue}}if(e.metadataRegistry.get(s[0])?.id){a(s);continue}if(i.cycle){a(s);continue}if(i.count>1&&e.reused==="ref"){a(s);continue}}}function Me(e,t){const n=e.seen.get(t);if(!n)throw new Error("Unprocessed schema. This is a bug in Zod.");const r=s=>{const i=e.seen.get(s);if(i.ref===null)return;const u=i.def??i.schema,l={...u},d=i.ref;if(i.ref=null,d){r(d);const f=e.seen.get(d),p=f.schema;if(p.$ref&&(e.target==="draft-07"||e.target==="draft-04"||e.target==="openapi-3.0")?(u.allOf=u.allOf??[],u.allOf.push(p)):Object.assign(u,p),Object.assign(u,l),s._zod.parent===d)for(const w in u)w==="$ref"||w==="allOf"||w in l||delete u[w];if(p.$ref)for(const w in u)w==="$ref"||w==="allOf"||w in f.def&&JSON.stringify(u[w])===JSON.stringify(f.def[w])&&delete u[w]}const h=s._zod.parent;if(h&&h!==d){r(h);const f=e.seen.get(h);if(f?.schema.$ref&&(u.$ref=f.schema.$ref,f.def))for(const p in u)p==="$ref"||p==="allOf"||p in f.def&&JSON.stringify(u[p])===JSON.stringify(f.def[p])&&delete u[p]}e.override({zodSchema:s,jsonSchema:u,path:i.path??[]})};for(const s of[...e.seen.entries()].reverse())r(s[0]);const o={};if(e.target==="draft-2020-12"?o.$schema="https://json-schema.org/draft/2020-12/schema":e.target==="draft-07"?o.$schema="http://json-schema.org/draft-07/schema#":e.target==="draft-04"?o.$schema="http://json-schema.org/draft-04/schema#":e.target,e.external?.uri){const s=e.external.registry.get(t)?.id;if(!s)throw new Error("Schema is missing an `id` property");o.$id=e.external.uri(s)}Object.assign(o,n.def??n.schema);const a=e.external?.defs??{};for(const s of e.seen.entries()){const i=s[1];i.def&&i.defId&&(a[i.defId]=i.def)}e.external||Object.keys(a).length>0&&(e.target==="draft-2020-12"?o.$defs=a:o.definitions=a);try{const s=JSON.parse(JSON.stringify(o));return Object.defineProperty(s,"~standard",{value:{...t["~standard"],jsonSchema:{input:ee(t,"input",e.processors),output:ee(t,"output",e.processors)}},enumerable:!1,writable:!1}),s}catch{throw new Error("Error converting schema to JSON.")}}function Z(e,t){const n=t??{seen:new Set};if(n.seen.has(e))return!1;n.seen.add(e);const r=e._zod.def;if(r.type==="transform")return!0;if(r.type==="array")return Z(r.element,n);if(r.type==="set")return Z(r.valueType,n);if(r.type==="lazy")return Z(r.getter(),n);if(r.type==="promise"||r.type==="optional"||r.type==="nonoptional"||r.type==="nullable"||r.type==="readonly"||r.type==="default"||r.type==="prefault")return Z(r.innerType,n);if(r.type==="intersection")return Z(r.left,n)||Z(r.right,n);if(r.type==="record"||r.type==="map")return Z(r.keyType,n)||Z(r.valueType,n);if(r.type==="pipe")return Z(r.in,n)||Z(r.out,n);if(r.type==="object"){for(const o in r.shape)if(Z(r.shape[o],n))return!0;return!1}if(r.type==="union"){for(const o of r.options)if(Z(o,n))return!0;return!1}if(r.type==="tuple"){for(const o of r.items)if(Z(o,n))return!0;return!!(r.rest&&Z(r.rest,n))}return!1}const Wr=(e,t={})=>n=>{const r=qe({...n,processors:t});return z(e,r),Be(r,e),Me(r,e)},ee=(e,t,n={})=>r=>{const{libraryOptions:o,target:a}=r??{},s=qe({...o??{},target:a,io:t,processors:n});return z(e,s),Be(s,e),Me(s,e)},Vr={guid:"uuid",url:"uri",datetime:"date-time",json_string:"json-string",regex:""},Kr=(e,t,n,r)=>{const o=n;o.type="string";const{minimum:a,maximum:s,format:i,patterns:u,contentEncoding:l}=e._zod.bag;if(typeof a=="number"&&(o.minLength=a),typeof s=="number"&&(o.maxLength=s),i&&(o.format=Vr[i]??i,o.format===""&&delete o.format,i==="time"&&delete o.format),l&&(o.contentEncoding=l),u&&u.size>0){const d=[...u];d.length===1?o.pattern=d[0].source:d.length>1&&(o.allOf=[...d.map(h=>({...t.target==="draft-07"||t.target==="draft-04"||t.target==="openapi-3.0"?{type:"string"}:{},pattern:h.source}))])}},Hr=(e,t,n,r)=>{n.not={}},Gr=(e,t,n,r)=>{},Yr=(e,t,n,r)=>{const o=e._zod.def,a=Te(o.entries);a.every(s=>typeof s=="number")&&(n.type="number"),a.every(s=>typeof s=="string")&&(n.type="string"),n.enum=a},Qr=(e,t,n,r)=>{if(t.unrepresentable==="throw")throw new Error("Custom types cannot be represented in JSON Schema")},eo=(e,t,n,r)=>{if(t.unrepresentable==="throw")throw new Error("Transforms cannot be represented in JSON Schema")},to=(e,t,n,r)=>{const o=n,a=e._zod.def,{minimum:s,maximum:i}=e._zod.bag;typeof s=="number"&&(o.minItems=s),typeof i=="number"&&(o.maxItems=i),o.type="array",o.items=z(a.element,t,{...r,path:[...r.path,"items"]})},no=(e,t,n,r)=>{const o=n,a=e._zod.def;o.type="object",o.properties={};const s=a.shape;for(const l in s)o.properties[l]=z(s[l],t,{...r,path:[...r.path,"properties",l]});const i=new Set(Object.keys(s)),u=new Set([...i].filter(l=>{const d=a.shape[l]._zod;return t.io==="input"?d.optin===void 0:d.optout===void 0}));u.size>0&&(o.required=Array.from(u)),a.catchall?._zod.def.type==="never"?o.additionalProperties=!1:a.catchall?a.catchall&&(o.additionalProperties=z(a.catchall,t,{...r,path:[...r.path,"additionalProperties"]})):t.io==="output"&&(o.additionalProperties=!1)},ro=(e,t,n,r)=>{const o=e._zod.def,a=o.inclusive===!1,s=o.options.map((i,u)=>z(i,t,{...r,path:[...r.path,a?"oneOf":"anyOf",u]}));a?n.oneOf=s:n.anyOf=s},oo=(e,t,n,r)=>{const o=e._zod.def,a=z(o.left,t,{...r,path:[...r.path,"allOf",0]}),s=z(o.right,t,{...r,path:[...r.path,"allOf",1]}),i=l=>"allOf"in l&&Object.keys(l).length===1,u=[...i(a)?a.allOf:[a],...i(s)?s.allOf:[s]];n.allOf=u},so=(e,t,n,r)=>{const o=e._zod.def,a=z(o.innerType,t,r),s=t.seen.get(e);t.target==="openapi-3.0"?(s.ref=o.innerType,n.nullable=!0):n.anyOf=[a,{type:"null"}]},ao=(e,t,n,r)=>{const o=e._zod.def;z(o.innerType,t,r);const a=t.seen.get(e);a.ref=o.innerType},io=(e,t,n,r)=>{const o=e._zod.def;z(o.innerType,t,r);const a=t.seen.get(e);a.ref=o.innerType,n.default=JSON.parse(JSON.stringify(o.defaultValue))},co=(e,t,n,r)=>{const o=e._zod.def;z(o.innerType,t,r);const a=t.seen.get(e);a.ref=o.innerType,t.io==="input"&&(n._prefault=JSON.parse(JSON.stringify(o.defaultValue)))},uo=(e,t,n,r)=>{const o=e._zod.def;z(o.innerType,t,r);const a=t.seen.get(e);a.ref=o.innerType;let s;try{s=o.catchValue(void 0)}catch{throw new Error("Dynamic catch values are not supported in JSON Schema")}n.default=s},lo=(e,t,n,r)=>{const o=e._zod.def,a=t.io==="input"?o.in._zod.def.type==="transform"?o.out:o.in:o.out;z(a,t,r);const s=t.seen.get(e);s.ref=a},mo=(e,t,n,r)=>{const o=e._zod.def;z(o.innerType,t,r);const a=t.seen.get(e);a.ref=o.innerType,n.readOnly=!0},We=(e,t,n,r)=>{const o=e._zod.def;z(o.innerType,t,r);const a=t.seen.get(e);a.ref=o.innerType},po=c("ZodISODateTime",(e,t)=>{kn.init(e,t),g.init(e,t)});function fo(e){return kr(po,e)}const ho=c("ZodISODate",(e,t)=>{Fn.init(e,t),g.init(e,t)});function yo(e){return Fr(ho,e)}const bo=c("ZodISOTime",(e,t)=>{xn.init(e,t),g.init(e,t)});function go(e){return xr(bo,e)}const vo=c("ZodISODuration",(e,t)=>{Pn.init(e,t),g.init(e,t)});function _o(e){return Pr(vo,e)}const wo=(e,t)=>{it.init(e,t),e.name="ZodError",Object.defineProperties(e,{format:{value:n=>ut(e,n)},flatten:{value:n=>ct(e,n)},addIssue:{value:n=>{e.issues.push(n),e.message=JSON.stringify(e.issues,pe,2)}},addIssues:{value:n=>{e.issues.push(...n),e.message=JSON.stringify(e.issues,pe,2)}},isEmpty:{get(){return e.issues.length===0}}})},F=c("ZodError",wo,{Parent:Error}),zo=lt(F),So=mt(F),$o=dt(F),Zo=pt(F),ko=ft(F),Fo=ht(F),xo=yt(F),Po=bt(F),No=gt(F),To=vt(F),Do=_t(F),Oo=wt(F),_=c("ZodType",(e,t)=>(v.init(e,t),Object.assign(e["~standard"],{jsonSchema:{input:ee(e,"input"),output:ee(e,"output")}}),e.toJSONSchema=Wr(e,{}),e.def=t,e.type=t.type,Object.defineProperty(e,"_def",{value:t}),e.check=(...n)=>e.clone(Pt(t,{checks:[...t.checks??[],...n.map(r=>typeof r=="function"?{_zod:{check:r,def:{check:"custom"},onattach:[]}}:r)]}),{parent:!0}),e.with=e.check,e.clone=(n,r)=>Nt(e,n,r),e.brand=()=>e,e.register=((n,r)=>(n.add(e,r),e)),e.parse=(n,r)=>zo(e,n,r,{callee:e.parse}),e.safeParse=(n,r)=>$o(e,n,r),e.parseAsync=async(n,r)=>So(e,n,r,{callee:e.parseAsync}),e.safeParseAsync=async(n,r)=>Zo(e,n,r),e.spa=e.safeParseAsync,e.encode=(n,r)=>ko(e,n,r),e.decode=(n,r)=>Fo(e,n,r),e.encodeAsync=async(n,r)=>xo(e,n,r),e.decodeAsync=async(n,r)=>Po(e,n,r),e.safeEncode=(n,r)=>No(e,n,r),e.safeDecode=(n,r)=>To(e,n,r),e.safeEncodeAsync=async(n,r)=>Do(e,n,r),e.safeDecodeAsync=async(n,r)=>Oo(e,n,r),e.refine=(n,r)=>e.check(Zs(n,r)),e.superRefine=n=>e.check(ks(n)),e.overwrite=n=>e.check(A(n)),e.optional=()=>ke(e),e.exactOptional=()=>ms(e),e.nullable=()=>Fe(e),e.nullish=()=>ke(Fe(e)),e.nonoptional=n=>gs(e,n),e.array=()=>ns(e),e.or=n=>ss([e,n]),e.and=n=>is(e,n),e.transform=n=>xe(e,ls(n)),e.default=n=>hs(e,n),e.prefault=n=>bs(e,n),e.catch=n=>_s(e,n),e.pipe=n=>xe(e,n),e.readonly=()=>Ss(e),e.describe=n=>{const r=e.clone();return R.add(r,{description:n}),r},Object.defineProperty(e,"description",{get(){return R.get(e)?.description},configurable:!0}),e.meta=(...n)=>{if(n.length===0)return R.get(e);const r=e.clone();return R.add(r,n[0]),r},e.isOptional=()=>e.safeParse(void 0).success,e.isNullable=()=>e.safeParse(null).success,e.apply=n=>n(e),e)),Ve=c("_ZodString",(e,t)=>{le.init(e,t),_.init(e,t),e._zod.processJSONSchema=(r,o,a)=>Kr(e,r,o);const n=e._zod.bag;e.format=n.format??null,e.minLength=n.minimum??null,e.maxLength=n.maximum??null,e.regex=(...r)=>e.check(Dr(...r)),e.includes=(...r)=>e.check(jr(...r)),e.startsWith=(...r)=>e.check(Ir(...r)),e.endsWith=(...r)=>e.check(Ar(...r)),e.min=(...r)=>e.check(Q(...r)),e.max=(...r)=>e.check(Je(...r)),e.length=(...r)=>e.check(Xe(...r)),e.nonempty=(...r)=>e.check(Q(1,...r)),e.lowercase=r=>e.check(Or(r)),e.uppercase=r=>e.check(Er(r)),e.trim=()=>e.check(Cr()),e.normalize=(...r)=>e.check(Rr(...r)),e.toLowerCase=()=>e.check(Ur()),e.toUpperCase=()=>e.check(Lr()),e.slugify=()=>e.check(Jr())}),Eo=c("ZodString",(e,t)=>{le.init(e,t),Ve.init(e,t),e.email=n=>e.check(sr(jo,n)),e.url=n=>e.check(lr(Io,n)),e.jwt=n=>e.check(Zr(Go,n)),e.emoji=n=>e.check(dr(Ao,n)),e.guid=n=>e.check(Se($e,n)),e.uuid=n=>e.check(ar(J,n)),e.uuidv4=n=>e.check(ir(J,n)),e.uuidv6=n=>e.check(cr(J,n)),e.uuidv7=n=>e.check(ur(J,n)),e.nanoid=n=>e.check(mr(Ro,n)),e.guid=n=>e.check(Se($e,n)),e.cuid=n=>e.check(pr(Co,n)),e.cuid2=n=>e.check(fr(Uo,n)),e.ulid=n=>e.check(hr(Lo,n)),e.base64=n=>e.check(zr(Vo,n)),e.base64url=n=>e.check(Sr(Ko,n)),e.xid=n=>e.check(yr(Jo,n)),e.ksuid=n=>e.check(br(Xo,n)),e.ipv4=n=>e.check(gr(qo,n)),e.ipv6=n=>e.check(vr(Bo,n)),e.cidrv4=n=>e.check(_r(Mo,n)),e.cidrv6=n=>e.check(wr(Wo,n)),e.e164=n=>e.check($r(Ho,n)),e.datetime=n=>e.check(fo(n)),e.date=n=>e.check(yo(n)),e.time=n=>e.check(go(n)),e.duration=n=>e.check(_o(n))});function S(e){return or(Eo,e)}const g=c("ZodStringFormat",(e,t)=>{b.init(e,t),Ve.init(e,t)}),jo=c("ZodEmail",(e,t)=>{bn.init(e,t),g.init(e,t)}),$e=c("ZodGUID",(e,t)=>{hn.init(e,t),g.init(e,t)}),J=c("ZodUUID",(e,t)=>{yn.init(e,t),g.init(e,t)}),Io=c("ZodURL",(e,t)=>{gn.init(e,t),g.init(e,t)}),Ao=c("ZodEmoji",(e,t)=>{vn.init(e,t),g.init(e,t)}),Ro=c("ZodNanoID",(e,t)=>{_n.init(e,t),g.init(e,t)}),Co=c("ZodCUID",(e,t)=>{wn.init(e,t),g.init(e,t)}),Uo=c("ZodCUID2",(e,t)=>{zn.init(e,t),g.init(e,t)}),Lo=c("ZodULID",(e,t)=>{Sn.init(e,t),g.init(e,t)}),Jo=c("ZodXID",(e,t)=>{$n.init(e,t),g.init(e,t)}),Xo=c("ZodKSUID",(e,t)=>{Zn.init(e,t),g.init(e,t)}),qo=c("ZodIPv4",(e,t)=>{Nn.init(e,t),g.init(e,t)}),Bo=c("ZodIPv6",(e,t)=>{Tn.init(e,t),g.init(e,t)}),Mo=c("ZodCIDRv4",(e,t)=>{Dn.init(e,t),g.init(e,t)}),Wo=c("ZodCIDRv6",(e,t)=>{On.init(e,t),g.init(e,t)}),Vo=c("ZodBase64",(e,t)=>{En.init(e,t),g.init(e,t)}),Ko=c("ZodBase64URL",(e,t)=>{In.init(e,t),g.init(e,t)}),Ho=c("ZodE164",(e,t)=>{An.init(e,t),g.init(e,t)}),Go=c("ZodJWT",(e,t)=>{Cn.init(e,t),g.init(e,t)}),Yo=c("ZodUnknown",(e,t)=>{Un.init(e,t),_.init(e,t),e._zod.processJSONSchema=(n,r,o)=>Gr()});function Ze(){return Nr(Yo)}const Qo=c("ZodNever",(e,t)=>{Ln.init(e,t),_.init(e,t),e._zod.processJSONSchema=(n,r,o)=>Hr(e,n,r)});function es(e){return Tr(Qo,e)}const ts=c("ZodArray",(e,t)=>{Jn.init(e,t),_.init(e,t),e._zod.processJSONSchema=(n,r,o)=>to(e,n,r,o),e.element=t.element,e.min=(n,r)=>e.check(Q(n,r)),e.nonempty=n=>e.check(Q(1,n)),e.max=(n,r)=>e.check(Je(n,r)),e.length=(n,r)=>e.check(Xe(n,r)),e.unwrap=()=>e.element});function ns(e,t){return Xr(ts,e,t)}const rs=c("ZodObject",(e,t)=>{qn.init(e,t),_.init(e,t),e._zod.processJSONSchema=(n,r,o)=>no(e,n,r,o),y(e,"shape",()=>t.shape),e.keyof=()=>cs(Object.keys(e._zod.def.shape)),e.catchall=n=>e.clone({...e._zod.def,catchall:n}),e.passthrough=()=>e.clone({...e._zod.def,catchall:Ze()}),e.loose=()=>e.clone({...e._zod.def,catchall:Ze()}),e.strict=()=>e.clone({...e._zod.def,catchall:es()}),e.strip=()=>e.clone({...e._zod.def,catchall:void 0}),e.extend=n=>zt(e,n),e.safeExtend=n=>St(e,n),e.merge=n=>$t(e,n),e.pick=n=>Zt(e,n),e.omit=n=>kt(e,n),e.partial=(...n)=>Ft(Ke,e,n[0]),e.required=(...n)=>xt(He,e,n[0])});function j(e,t){const n={type:"object",shape:e??{},...m(t)};return new rs(n)}const os=c("ZodUnion",(e,t)=>{Bn.init(e,t),_.init(e,t),e._zod.processJSONSchema=(n,r,o)=>ro(e,n,r,o),e.options=t.options});function ss(e,t){return new os({type:"union",options:e,...m(t)})}const as=c("ZodIntersection",(e,t)=>{Mn.init(e,t),_.init(e,t),e._zod.processJSONSchema=(n,r,o)=>oo(e,n,r,o)});function is(e,t){return new as({type:"intersection",left:e,right:t})}const ae=c("ZodEnum",(e,t)=>{Wn.init(e,t),_.init(e,t),e._zod.processJSONSchema=(r,o,a)=>Yr(e,r,o),e.enum=t.entries,e.options=Object.values(t.entries);const n=new Set(Object.keys(t.entries));e.extract=(r,o)=>{const a={};for(const s of r)if(n.has(s))a[s]=t.entries[s];else throw new Error(`Key ${s} not found in enum`);return new ae({...t,checks:[],...m(o),entries:a})},e.exclude=(r,o)=>{const a={...t.entries};for(const s of r)if(n.has(s))delete a[s];else throw new Error(`Key ${s} not found in enum`);return new ae({...t,checks:[],...m(o),entries:a})}});function cs(e,t){const n=Array.isArray(e)?Object.fromEntries(e.map(r=>[r,r])):e;return new ae({type:"enum",entries:n,...m(t)})}const us=c("ZodTransform",(e,t)=>{Vn.init(e,t),_.init(e,t),e._zod.processJSONSchema=(n,r,o)=>eo(e,n),e._zod.parse=(n,r)=>{if(r.direction==="backward")throw new Oe(e.constructor.name);n.addIssue=a=>{if(typeof a=="string")n.issues.push(C(a,n.value,t));else{const s=a;s.fatal&&(s.continue=!1),s.code??(s.code="custom"),s.input??(s.input=n.value),s.inst??(s.inst=e),n.issues.push(C(s))}};const o=t.transform(n.value,n);return o instanceof Promise?o.then(a=>(n.value=a,n)):(n.value=o,n)}});function ls(e){return new us({type:"transform",transform:e})}const Ke=c("ZodOptional",(e,t)=>{Le.init(e,t),_.init(e,t),e._zod.processJSONSchema=(n,r,o)=>We(e,n,r,o),e.unwrap=()=>e._zod.def.innerType});function ke(e){return new Ke({type:"optional",innerType:e})}const ds=c("ZodExactOptional",(e,t)=>{Kn.init(e,t),_.init(e,t),e._zod.processJSONSchema=(n,r,o)=>We(e,n,r,o),e.unwrap=()=>e._zod.def.innerType});function ms(e){return new ds({type:"optional",innerType:e})}const ps=c("ZodNullable",(e,t)=>{Hn.init(e,t),_.init(e,t),e._zod.processJSONSchema=(n,r,o)=>so(e,n,r,o),e.unwrap=()=>e._zod.def.innerType});function Fe(e){return new ps({type:"nullable",innerType:e})}const fs=c("ZodDefault",(e,t)=>{Gn.init(e,t),_.init(e,t),e._zod.processJSONSchema=(n,r,o)=>io(e,n,r,o),e.unwrap=()=>e._zod.def.innerType,e.removeDefault=e.unwrap});function hs(e,t){return new fs({type:"default",innerType:e,get defaultValue(){return typeof t=="function"?t():Ee(t)}})}const ys=c("ZodPrefault",(e,t)=>{Yn.init(e,t),_.init(e,t),e._zod.processJSONSchema=(n,r,o)=>co(e,n,r,o),e.unwrap=()=>e._zod.def.innerType});function bs(e,t){return new ys({type:"prefault",innerType:e,get defaultValue(){return typeof t=="function"?t():Ee(t)}})}const He=c("ZodNonOptional",(e,t)=>{Qn.init(e,t),_.init(e,t),e._zod.processJSONSchema=(n,r,o)=>ao(e,n,r,o),e.unwrap=()=>e._zod.def.innerType});function gs(e,t){return new He({type:"nonoptional",innerType:e,...m(t)})}const vs=c("ZodCatch",(e,t)=>{er.init(e,t),_.init(e,t),e._zod.processJSONSchema=(n,r,o)=>uo(e,n,r,o),e.unwrap=()=>e._zod.def.innerType,e.removeCatch=e.unwrap});function _s(e,t){return new vs({type:"catch",innerType:e,catchValue:typeof t=="function"?t:()=>t})}const ws=c("ZodPipe",(e,t)=>{tr.init(e,t),_.init(e,t),e._zod.processJSONSchema=(n,r,o)=>lo(e,n,r,o),e.in=t.in,e.out=t.out});function xe(e,t){return new ws({type:"pipe",in:e,out:t})}const zs=c("ZodReadonly",(e,t)=>{nr.init(e,t),_.init(e,t),e._zod.processJSONSchema=(n,r,o)=>mo(e,n,r,o),e.unwrap=()=>e._zod.def.innerType});function Ss(e){return new zs({type:"readonly",innerType:e})}const $s=c("ZodCustom",(e,t)=>{rr.init(e,t),_.init(e,t),e._zod.processJSONSchema=(n,r,o)=>Qr(e,n)});function Zs(e,t={}){return qr($s,e,t)}function ks(e){return Br(e)}const Es={title:"Features/UI/Form",component:Tt,tags:["autodocs"],parameters:{docs:{description:{component:`
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
        `}}}},X={render:()=>{const e={loginForm:j({email:S().min(1,"Please enter your email").email("Please enter a valid email"),password:S().min(8,"Password must be at least 8 characters")})},t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"form-container",type:"Div",attributes:{className:"w-[340px]"},children:[{id:"form",type:"Form",attributes:{schemaName:"loginForm"},children:[{id:"form-fields-container",type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:"form-field-email",type:"FormField",attributes:{name:"email",label:"Email",type:"email",placeholder:"example@email.com",required:!0,disabled:!1}},{id:"form-field-password",type:"FormField",attributes:{name:"password",label:"Password",type:"password",placeholder:"Enter at least 8 characters",required:!0,disabled:!1}},{id:"submit-button",type:"Button",state:{buttonStyle:"filled",buttonType:"primary",size:"L"},attributes:{type:"submit",className:"w-full"},children:[{id:"submit-button-text",type:"Span",state:{text:"Login"}}]}]}]}]}]}};return E(e),T.jsx(D,{document:t,components:O})},parameters:{docs:{description:{story:"A basic form example demonstrating zod schema validation. The form uses a zod schema to validate email and password fields. When validation fails, error messages are automatically displayed below the corresponding fields. The form only submits when all validations pass. Try submitting with invalid data to see validation errors."}}}},q={render:()=>{const e={registrationForm:j({name:S().min(2,"Name must be at least 2 characters"),email:S().min(1,"Please enter your email").email("Please enter a valid email"),password:S().min(8,"Password must be at least 8 characters"),confirmPassword:S().min(1,"Please confirm your password")}).refine(n=>n.password===n.confirmPassword,{message:"Passwords do not match",path:["confirmPassword"]})},t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"form-container",type:"Div",attributes:{className:"w-[340px]"},children:[{id:"form",type:"Form",attributes:{schemaName:"registrationForm"},children:[{id:"form-fields-container",type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:"form-field-name",type:"FormField",attributes:{name:"name",label:"Name",type:"text",placeholder:"John Doe",required:!0,disabled:!1}},{id:"form-field-email",type:"FormField",attributes:{name:"email",label:"Email",type:"email",placeholder:"example@email.com",required:!0,disabled:!1}},{id:"form-field-password",type:"FormField",attributes:{name:"password",label:"Password",type:"password",placeholder:"Enter at least 8 characters",required:!0,disabled:!1}},{id:"form-field-confirmPassword",type:"FormField",attributes:{name:"confirmPassword",label:"Confirm Password",type:"password",placeholder:"Re-enter password",required:!0,disabled:!1}},{id:"submit-button",type:"Button",state:{buttonStyle:"filled",buttonType:"primary",size:"L"},attributes:{type:"submit",className:"w-full"},children:[{id:"submit-button-text",type:"Span",state:{text:"Sign Up"}}]}]}]}]}]}};return E(e),T.jsx(D,{document:t,components:O})},parameters:{docs:{description:{story:"A registration form example that demonstrates cross-field validation using zod's refine method. The form validates that the password and confirm password fields match. When passwords don't match, an error is displayed on the confirmPassword field. This shows how to implement complex validation rules that depend on multiple fields."}}}},B={render:()=>{const e={userForm:j({username:S().min(3,"Username must be at least 3 characters").regex(/^[a-zA-Z0-9_]+$/,"Only letters, numbers, and underscores are allowed"),email:S().min(1,"Please enter your email").email("Please enter a valid email")})},t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"form-container",type:"Div",attributes:{className:"w-[340px]"},children:[{id:"form",type:"Form",attributes:{schemaName:"userForm"},children:[{id:"form-fields-container",type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:"form-field-username",type:"FormField",attributes:{name:"username",label:"Username",type:"text",placeholder:"username",required:!0,disabled:!1,helpMessage:"Use at least 3 characters: letters, numbers, and underscores"}},{id:"form-field-email",type:"FormField",attributes:{name:"email",label:"Email",type:"email",placeholder:"example@email.com",required:!0,disabled:!1,helpMessage:"Used for login and notifications"}},{id:"submit-button",type:"Button",state:{buttonStyle:"filled",buttonType:"primary",size:"L"},attributes:{type:"submit",className:"w-full"},children:[{id:"submit-button-text",type:"Span",state:{text:"Submit"}}]}]}]}]}]}};return E(e),T.jsx(D,{document:t,components:O})},parameters:{docs:{description:{story:"Demonstrates how to add help messages to form fields with zod validation. Help messages provide additional context and guidance to users about what to enter in each field. Help messages are displayed below the input field and remain visible even when the field is in an error state. The username field uses regex validation to ensure only alphanumeric characters and underscores are allowed."}}}},M={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"form-container",type:"Div",attributes:{className:"w-[340px]"},children:[{id:"form",type:"Form",attributes:{},children:[{id:"form-fields-container",type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:"form-field-email",type:"FormField",attributes:{name:"email",label:"Email",type:"text",placeholder:"example@email.com",required:!1,disabled:!1}},{id:"form-field-password",type:"FormField",attributes:{name:"password",label:"Password",type:"password",placeholder:"Enter password",required:!1,disabled:!1}},{id:"submit-button",type:"Button",state:{buttonStyle:"filled",buttonType:"primary",size:"L"},attributes:{type:"submit",className:"w-full"},children:[{id:"submit-button-text",type:"Span",state:{text:"Submit"}}]}]}]}]}]}};return T.jsx(D,{document:e,components:O})},parameters:{docs:{description:{story:"Shows how to use the Form component without a validation schema. In this mode, the form collects data without performing any validation. This is useful for simple forms where validation is handled server-side or when you need maximum flexibility."}}}},W={render:()=>{const e={customForm:j({phone:S().min(1,"Please enter your phone number").regex(/^010-\d{4}-\d{4}$/,"Please enter in format 010-XXXX-XXXX"),age:S().min(1,"Please enter your age").refine(n=>{const r=Number(n);return!Number.isNaN(r)&&r>=18&&r<=100},{message:"Age must be between 18 and 100"})})},t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"form-container",type:"Div",attributes:{className:"w-[340px]"},children:[{id:"form",type:"Form",attributes:{schemaName:"customForm"},children:[{id:"form-fields-container",type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:"form-field-phone",type:"FormField",attributes:{name:"phone",label:"Phone Number",type:"text",placeholder:"010-1234-5678",required:!0,disabled:!1,helpMessage:"Please enter in format 010-XXXX-XXXX"}},{id:"form-field-age",type:"FormField",attributes:{name:"age",label:"Age",type:"number",placeholder:"18",required:!0,disabled:!1}},{id:"submit-button",type:"Button",state:{buttonStyle:"filled",buttonType:"primary",size:"L"},attributes:{type:"submit",className:"w-full"},children:[{id:"submit-button-text",type:"Span",state:{text:"Submit"}}]}]}]}]}]}};return E(e),T.jsx(D,{document:t,components:O})},parameters:{docs:{description:{story:"Demonstrates custom validation rules using zod. The phone field uses a regex pattern to validate Korean phone number format (010-XXXX-XXXX), and the age field uses a refine method to check that the value is between 18 and 100. This shows how to implement domain-specific validation rules beyond basic type checking."}}}},V={render:()=>{const e={profileForm:j({email:S().email("Please enter a valid email"),username:S().min(3,"Username must be at least 3 characters")})},t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"form-container",type:"Div",attributes:{className:"w-[340px]"},children:[{id:"form",type:"Form",attributes:{schemaName:"profileForm"},children:[{id:"form-fields-container",type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:"form-field-email",type:"FormField",attributes:{name:"email",label:"Email",type:"email",placeholder:"example@email.com",required:!0,disabled:!1}},{id:"form-field-username",type:"FormField",attributes:{name:"username",label:"Username",type:"text",placeholder:"username",required:!0,disabled:!1}},{id:"submit-button",type:"Button",state:{buttonStyle:"filled",buttonType:"primary",size:"L"},attributes:{type:"submit",className:"w-full"},children:[{id:"submit-button-text",type:"Span",state:{text:"Submit"}}]}]}]}]}]}};return E(e),T.jsx(D,{document:t,components:O})},parameters:{docs:{description:{story:"Demonstrates how to use schema names with registerSchemas. Schemas are registered via registerSchemas function, and the form references them using schemaName attribute. This approach is useful when you want to reuse schemas across multiple forms or when schemas are defined separately from the form document."}}}},K={render:()=>{const e={profileForm:j({email:S().email("Please enter a valid email"),username:S().min(3,"Username must be at least 3 characters")})},t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"form-container",type:"Div",attributes:{className:"w-[340px]"},children:[{id:"form",type:"Form",attributes:{schemaName:"profileForm"},children:[{id:"form-fields-container",type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:"form-field-email",type:"FormField",attributes:{name:"email",label:"Email",disabled:!0,inputProps:{defaultValue:"user@example.com"}}},{id:"form-field-username",type:"FormField",attributes:{name:"username",label:"Username",placeholder:"Enter username",required:!0}},{id:"submit-button",type:"Button",state:{buttonStyle:"filled",buttonType:"primary",size:"L"},attributes:{type:"submit",className:"w-full"},children:[{id:"submit-button-text",type:"Span",state:{text:"Submit"}}]}]}]}]}]}};return E(e),T.jsx(D,{document:t,components:O})},parameters:{docs:{description:{story:"Shows how to include disabled fields in a form with zod validation. Disabled fields are read-only and cannot be edited by users. They are useful for displaying pre-filled information that shouldn't be changed, such as user email addresses in profile forms. Disabled fields are still included in the form submission and validated according to the schema."}}}},H={render:()=>{const e={loginForm:j({email:S().min(1,"Please enter your email").email("Please enter a valid email"),password:S().min(8,"Password must be at least 8 characters")})},t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"form-container",type:"Div",attributes:{className:"w-[340px]"},children:[{id:"form",type:"Form",attributes:{schemaName:"loginForm"},children:[{id:"form-fields-container",type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:"form-field-email",type:"FormField",attributes:{name:"email",label:"Email",type:"email",placeholder:"example@email.com",required:!0,disabled:!1}},{id:"form-field-password",type:"FormField",attributes:{name:"password",label:"Password",type:"password",placeholder:"Enter at least 8 characters",required:!0,disabled:!1}},{id:"form-field-username",type:"FormField",attributes:{name:"username",label:"Username",type:"text",placeholder:"username",required:!0,disabled:!1}},{id:"submit-button",type:"Button",state:{buttonStyle:"filled",buttonType:"primary",size:"L"},attributes:{type:"submit",className:"w-full"},children:[{id:"submit-button-text",type:"Span",state:{text:"Login"}}]}]}]}]}]}};return E(e),T.jsx(Dt,{children:T.jsx(D,{document:t,components:O})})},parameters:{docs:{description:{story:'Demonstrates runtime validation when FormField names do not match the schema. The schema only defines "email" and "password" fields, but the form includes a "username" field that is not in the schema. This will throw an error and display it in the ErrorBoundary: "FormField with name "username" is not defined in the form schema. Expected fields: email, password". This helps catch mismatches between schema definitions and form fields during development.'}}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
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
    registerSchemas(schemas);
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic form example demonstrating zod schema validation. The form uses a zod schema to validate email and password fields. When validation fails, error messages are automatically displayed below the corresponding fields. The form only submits when all validations pass. Try submitting with invalid data to see validation errors.'
      }
    }
  }
}`,...X.parameters?.docs?.source}}};q.parameters={...q.parameters,docs:{...q.parameters?.docs,source:{originalSource:`{
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
    registerSchemas(schemas);
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: "A registration form example that demonstrates cross-field validation using zod's refine method. The form validates that the password and confirm password fields match. When passwords don't match, an error is displayed on the confirmPassword field. This shows how to implement complex validation rules that depend on multiple fields."
      }
    }
  }
}`,...q.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
    registerSchemas(schemas);
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how to add help messages to form fields with zod validation. Help messages provide additional context and guidance to users about what to enter in each field. Help messages are displayed below the input field and remain visible even when the field is in an error state. The username field uses regex validation to ensure only alphanumeric characters and underscores are allowed.'
      }
    }
  }
}`,...B.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
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
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how to use the Form component without a validation schema. In this mode, the form collects data without performing any validation. This is useful for simple forms where validation is handled server-side or when you need maximum flexibility.'
      }
    }
  }
}`,...M.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
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
    registerSchemas(schemas);
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates custom validation rules using zod. The phone field uses a regex pattern to validate Korean phone number format (010-XXXX-XXXX), and the age field uses a refine method to check that the value is between 18 and 100. This shows how to implement domain-specific validation rules beyond basic type checking.'
      }
    }
  }
}`,...W.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  render: () => {
    // Define schemas and register them via registerSchemas
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
    // Register schemas before rendering
    registerSchemas(schemas);
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how to use schema names with registerSchemas. Schemas are registered via registerSchemas function, and the form references them using schemaName attribute. This approach is useful when you want to reuse schemas across multiple forms or when schemas are defined separately from the form document.'
      }
    }
  }
}`,...V.parameters?.docs?.source}}};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
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
    registerSchemas(schemas);
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: "Shows how to include disabled fields in a form with zod validation. Disabled fields are read-only and cannot be edited by users. They are useful for displaying pre-filled information that shouldn't be changed, such as user email addresses in profile forms. Disabled fields are still included in the form submission and validated according to the schema."
      }
    }
  }
}`,...K.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
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
    registerSchemas(schemas);
    return <ErrorBoundary>
        <SduiLayoutRenderer document={document} components={sduiComponents} />
      </ErrorBoundary>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates runtime validation when FormField names do not match the schema. The schema only defines "email" and "password" fields, but the form includes a "username" field that is not in the schema. This will throw an error and display it in the ErrorBoundary: "FormField with name "username" is not defined in the form schema. Expected fields: email, password". This helps catch mismatches between schema definitions and form fields during development.'
      }
    }
  }
}`,...H.parameters?.docs?.source}}};const js=["Basic","RegistrationForm","WithHelpMessages","WithoutSchema","CustomValidation","WithSchemaName","DisabledFields","SchemaMismatch"];export{X as Basic,W as CustomValidation,K as DisabledFields,q as RegistrationForm,H as SchemaMismatch,B as WithHelpMessages,V as WithSchemaName,M as WithoutSchema,js as __namedExportsOrder,Es as default};
