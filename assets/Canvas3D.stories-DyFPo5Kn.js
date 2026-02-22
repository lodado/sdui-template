import{j as v}from"./jsx-runtime-B1jkZvI5.js";import{r as K}from"./iframe-DBmxkCFe.js";import{p as $,t as tt,q as et,S as z,s as kt,v as Nt,f as Et}from"./sduiComponents-DHkbB7Oh.js";import"./preload-helper-ggYluGXI.js";import"./index-wxXxgRnB.js";import"./index-Cox-AIaQ.js";const ft=32;function Q(e,t=ft){if(e.length<2)return[...e];const r=[];for(let s=0;s<e.length-1;s+=1){const a=e[s].x,c=e[s].y,p=e[s+1].x,l=e[s+1].y,i=p-a,n=l-c,f=s===e.length-2?t+1:t;for(let u=0;u<f;u+=1){const o=u/t;r.push({x:a+o*i,y:c+o*n})}}return r.push({x:e[e.length-1].x,y:e[e.length-1].y}),r}function zt(e,t,r,s){const a=t.length,c=new Array(a),p=new Array(a);c[0]=r[0]/t[0],p[0]=s[0]/t[0];for(let i=1;i<a;i+=1){const n=t[i]-e[i]*c[i-1];c[i]=i<a-1?r[i]/n:0,p[i]=(s[i]-e[i]*p[i-1])/n}const l=new Array(a);l[a-1]=p[a-1];for(let i=a-2;i>=0;i-=1)l[i]=p[i]-c[i]*l[i+1];return l}function _t(e,t=ft){const r=e.length;if(r<2)return[...e];if(r===2)return Q(e,t);const s=e.map(o=>o.x),a=e.map(o=>o.y),c=[];for(let o=0;o<r-1;o+=1)c.push(s[o+1]-s[o]);const p=[2],l=[0],i=[0],n=[0];for(let o=1;o<r-1;o+=1){const d=(a[o+1]-a[o])/c[o]-(a[o]-a[o-1])/c[o-1];i.push(c[o-1]),p.push(2*(c[o-1]+c[o])),l.push(c[o]),n.push(6*d)}i.push(0),p.push(2),l.push(0),n.push(0);const f=zt(i,p,l,n),u=[];for(let o=0;o<r-1;o+=1){const d=s[o];s[o+1];const h=a[o],D=a[o+1],T=c[o],I=f[o],y=f[o+1],g=h,S=(D-h)/T-T/6*(2*I+y),w=I/2,k=(y-I)/(6*T),R=o===r-2?t+1:t;for(let E=0;E<R;E+=1){const q=E/t,U=d+q*T,N=U-d,ct=g+S*N+w*N*N+k*N*N*N;u.push({x:U,y:ct})}}return u.push({x:s[r-1],y:a[r-1]}),u}function jt(e,t=ft){const r=e.length;if(r<2)return[...e];if(r===2)return Q(e,t);const s=e.map(n=>n.x),a=e.map(n=>n.y),c=[];for(let n=0;n<r-1;n+=1)c.push(s[n+1]-s[n]);const p=[];for(let n=0;n<r-1;n+=1)p.push((a[n+1]-a[n])/c[n]);const l=[];l[0]=p[0];for(let n=1;n<r-1;n+=1)p[n-1]*p[n]<=0?l[n]=0:l[n]=(c[n-1]+c[n])/(c[n-1]/p[n-1]+c[n]/p[n]);l[r-1]=p[r-2];for(let n=0;n<r-1;n+=1){const f=p[n];if(Math.abs(f)>=1e-10){const u=l[n]/f,o=l[n+1]/f,d=Math.sqrt(u*u+o*o);if(d>3){const h=3/d;l[n]=h*l[n],l[n+1]=h*l[n+1]}}else l[n]=0,l[n+1]=0}const i=[];for(let n=0;n<r-1;n+=1){const f=s[n];s[n+1];const u=a[n],o=a[n+1],d=c[n],h=l[n],D=l[n+1],T=n===r-2?t+1:t;for(let I=0;I<T;I+=1){const y=I/t,g=2*y*y*y-3*y*y+1,S=-2*y*y*y+3*y*y,w=y*y*y-2*y*y+y,k=y*y*y-y*y,R=f+y*d,E=u*g+o*S+d*h*w+d*D*k;i.push({x:R,y:E})}}return i.push({x:s[r-1],y:a[r-1]}),i}function ot(e){return"z"in e&&typeof e.z=="number"}const nt={x:0,y:0,z:0},bt="#1a1a1a";function rt(e){if(typeof e!="object"||e===null)return!1;const t=e;return typeof t.x=="number"&&typeof t.y=="number"&&typeof t.z=="number"}function st(e){const t=e?.scale;return typeof t=="number"?t:1}function xt(e){const t=e?.color,r=e?.stroke;return typeof t=="string"?t:typeof r=="string"?r:bt}function At(e){const t=e?.fill,r=e?.color;return typeof t=="string"?t:typeof r=="string"?r:"#3366CC"}const Wt=[{x:-.5,y:-.5,z:-.5},{x:.5,y:-.5,z:-.5},{x:.5,y:.5,z:-.5},{x:-.5,y:.5,z:-.5},{x:-.5,y:-.5,z:.5},{x:.5,y:-.5,z:.5},{x:.5,y:.5,z:.5},{x:-.5,y:.5,z:.5}],dt=[0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7],Lt=e=>{const{ctx:t,viewport:r,item:s,kind:a}=e;if(a!=="3d")return;const c=s.position;if(!ot(c))return;const p=st(s.info),l=rt(s.info?.rotation)?s.info.rotation:nt,i=xt(s.info),n={position:{x:c.x,y:c.y,z:c.z},rotation:{x:l.x??0,y:l.y??0,z:l.z??0},scale:{x:p,y:p,z:p}},f=$(n),u=Wt.map(o=>{const d=tt(f,o);return et(r,d.x,d.y,d.z)});t.beginPath(),t.strokeStyle=i;for(let o=0;o<dt.length;o+=2){const d=u[dt[o]],h=u[dt[o+1]];t.moveTo(d.sx,d.sy),t.lineTo(h.sx,h.sy)}t.stroke()},Pt=(()=>{const t=[];for(let r=0;r<2;r+=1){const s=r===0?-.5:.5;for(let a=0;a<6;a+=1){const c=a*Math.PI/3;t.push({x:.5*Math.cos(c),y:.5*Math.sin(c),z:s})}}return t})(),pt=[0,1,1,2,2,3,3,4,4,5,5,0,6,7,7,8,8,9,9,10,10,11,11,6,0,6,1,7,2,8,3,9,4,10,5,11];function Ut(e,t,r){return t+(r-t)*(2*e-e*e)}function Ft(e,t,r,s,a){const c=i=>Ut(i,s,r),p=[],l=[];for(let i=0;i<=t;i+=1){const n=i/t,f=n-.5,u=c(n);for(let o=0;o<e;o+=1){const d=2*Math.PI*o/e;p.push({x:u*Math.cos(d),y:u*Math.sin(d),z:f}),i<t&&l.push(i*e+o,(i+1)*e+o);const h=(o+1)%e;l.push(i*e+o,i*e+h)}}return{vertices:p,lineIndices:l}}function Mt(e,t){const r=[];for(let s=0;s<t;s+=1)for(let a=0;a<e;a+=1){const c=s*e+a,p=(s+1)*e+a,l=s*e+(a+1)%e,i=(s+1)*e+(a+1)%e;r.push([c,p,l]),r.push([l,p,i])}return r}function Ht(e,t){const r=[{x:0,y:0,z:-.5}],s=[];for(let a=0;a<e;a+=1){const c=2*Math.PI*a/e;r.push({x:t*Math.cos(c),y:t*Math.sin(c),z:-.5})}for(let a=0;a<e;a+=1)s.push([0,1+(a+1)%e,1+a]);return{vertices:r,triangleIndices:s}}const at=16,vt=8,Ot=.5,wt=.25,{vertices:It,lineIndices:ut}=Ft(at,vt,Ot,wt),Xt=Mt(at,vt),ht=(vt+1)*at,{vertices:Yt,triangleIndices:Vt}=Ht(at,wt),Bt=[...It,...Yt],Gt=[...Xt,...Vt.map(([e,t,r])=>[e+ht,t+ht,r+ht])],qt=e=>{const{ctx:t,viewport:r,item:s,kind:a}=e;if(a!=="3d")return;const c=s.position;if(!ot(c))return;const p=st(s.info),l=rt(s.info?.rotation)?s.info.rotation:nt,i=xt(s.info),n={position:{x:c.x,y:c.y,z:c.z},rotation:{x:l.x??0,y:l.y??0,z:l.z??0},scale:{x:p,y:p,z:p}},f=$(n),u=It.map(o=>{const d=tt(f,o);return et(r,d.x,d.y,d.z)});t.beginPath(),t.strokeStyle=i;for(let o=0;o<ut.length;o+=2){const d=u[ut[o]],h=u[ut[o+1]];t.moveTo(d.sx,d.sy),t.lineTo(h.sx,h.sy)}t.stroke()},Zt=e=>{const{ctx:t,viewport:r,item:s,kind:a}=e;if(a!=="3d")return;const c=s.position;if(!ot(c))return;const p=st(s.info),l=rt(s.info?.rotation)?s.info.rotation:nt,i=At(s.info),n={position:{x:c.x,y:c.y,z:c.z},rotation:{x:l.x??0,y:l.y??0,z:l.z??0},scale:{x:p,y:p,z:p}},f=$(n),u=Bt.map(d=>{const h=tt(f,d);return et(r,h.x,h.y,h.z)}),o=Gt.map(([d,h,D])=>{const T=u[d],I=u[h],y=u[D];return{depth:(T.z+I.z+y.z)/3,p0:T,p1:I,p2:y}});o.sort((d,h)=>d.depth-h.depth),o.forEach(({p0:d,p1:h,p2:D})=>{t.beginPath(),t.moveTo(d.sx,d.sy),t.lineTo(h.sx,h.sy),t.lineTo(D.sx,D.sy),t.closePath(),t.fillStyle=i,t.fill()})},Jt=e=>{const{ctx:t,viewport:r,item:s,kind:a}=e;if(a!=="3d")return;const c=s.position;if(!ot(c))return;const p=st(s.info),l=rt(s.info?.rotation)?s.info.rotation:nt,i=xt(s.info),n={position:{x:c.x,y:c.y,z:c.z},rotation:{x:l.x??0,y:l.y??0,z:l.z??0},scale:{x:p,y:p,z:p}},f=$(n),u=Pt.map(o=>{const d=tt(f,o);return et(r,d.x,d.y,d.z)});t.beginPath(),t.strokeStyle=i;for(let o=0;o<pt.length;o+=2){const d=u[pt[o]],h=u[pt[o+1]];t.moveTo(d.sx,d.sy),t.lineTo(h.sx,h.sy)}t.stroke()},W={left:48,right:24,top:24,bottom:40};function gt(e){if(Number.isInteger(e))return String(e);const t=Math.abs(e);return t>=1e3||t>0&&t<.01?e.toExponential(1):t>=1?e.toFixed(1):e.toFixed(2)}const Kt=3;function Qt(e,t,r,s,a,c){const p=W.left,l=W.right,i=W.top,n=Math.max(0,a-p-l),f=Math.max(0,c-i-W.bottom);return(u,o)=>{const d=p+(u-e)/(t-e)*n,h=i+f-(o-r)/(s-r)*f;return{px:d,py:h}}}function $t(e){return typeof e=="object"&&e!==null}function Ct(e){return e==null||typeof e!="object"?null:e}function Dt(e){return Array.isArray(e)?e.map(t=>{if(t==null||typeof t!="object"||!("x"in t)||!("y"in t))return null;const r=t,s=Number(r.x),a=Number(r.y);return Number.isNaN(s)||Number.isNaN(a)?null:{x:s,y:a}}).filter(t=>t!==null):[]}function te(e,t,r=32){if(e.length<2)return[...e];switch(t){case"linear":return Q(e,r);case"cubic":return _t(e,r);case"monotone":return jt(e,r);default:return Q(e,r)}}const ee=e=>{const{ctx:t,viewport:r,item:s,kind:a}=e;if(a!=="2d"||s.type!=="interpolationChart")return;const c=s.info,p=$t(c)?c:{},l=Array.isArray(p.series)?p.series:[],i=p.title,n=p.xRange,f=p.yRange;if(l.length===0)return;const u=r.width,o=r.height,d=W.left,h=W.right,D=W.top,T=W.bottom,I=Math.max(0,u-d-h),y=Math.max(0,o-D-T);let g,S,w,k;if(Array.isArray(n)&&n.length>=2&&Array.isArray(f)&&f.length>=2)g=Number(n[0]),S=Number(n[1]),w=Number(f[0]),k=Number(f[1]);else{let m=1/0,x=-1/0,C=1/0,b=-1/0;l.forEach(_=>{const Z=Ct(_);Dt(Z?.data).forEach(A=>{m=Math.min(m,A.x),x=Math.max(x,A.x),C=Math.min(C,A.y),b=Math.max(b,A.y)})}),m===x&&(x=m+1),C===b&&(b=C+1),g=m,S=x,w=C,k=b}const R=(m,x)=>{const C=d+(m-g)/(S-g)*I,b=D+y-(x-w)/(k-w)*y;return{px:C,py:b}},E=S-g,q=E>=1&&E<=24&&Number.isInteger(g)&&Number.isInteger(S),U=q?Array.from({length:E+1},(m,x)=>g+x):Array.from({length:7},(m,x)=>g+x/6*E);t.strokeStyle="#e5e7eb",t.lineWidth=1;const N=5;U.forEach(m=>{const{px:x}=R(m,w);t.beginPath(),t.moveTo(x,D),t.lineTo(x,D+y),t.stroke()}),Array.from({length:N+1},(m,x)=>x).forEach(m=>{const x=m/N,C=w+x*(k-w),{py:b}=R(g,C);t.beginPath(),t.moveTo(d,b),t.lineTo(d+I,b),t.stroke()}),t.fillStyle="#6b7280",t.font="11px sans-serif",t.textAlign="center",t.textBaseline="top";const ct=D+y+4;U.forEach(m=>{const{px:x}=R(m,w),C=q?String(Math.round(m)):gt(m);t.fillText(C,x,ct)}),t.fillStyle="#6b7280",t.font="11px sans-serif",t.textAlign="right",t.textBaseline="middle";const Rt=d-6;Array.from({length:N+1},(m,x)=>x).forEach(m=>{const x=m/N,C=w+x*(k-w),{py:b}=R(g,C),_=gt(C);t.fillText(_,Rt,b)});const St=(typeof i=="string"?i:void 0)??"Interpolation Modes";t.fillStyle="#1a1a1a",t.font="16px sans-serif",t.textAlign="center",t.fillText(St,u/2,D-6);function Tt(m){return m==="linear"||m==="cubic"||m==="monotone"?m:"linear"}l.map(m=>{const x=Ct(m),C=Dt(x?.data),b=Tt(x?.interpolation),_=typeof x?.stroke=="string"?x.stroke:bt;return{data:C,mode:b,stroke:_}}).filter(({data:m})=>m.length>=2).forEach(({data:m,mode:x,stroke:C})=>{const b=te(m,x),_=b[0];if(!_)return;t.strokeStyle=C,t.lineWidth=2,t.beginPath();const Z=R(_.x,_.y);t.moveTo(Z.px,Z.py),b.slice(1).forEach(L=>{const{px:A,py:lt}=R(L.x,L.y);t.lineTo(A,lt)}),t.stroke(),t.fillStyle=C,m.forEach(L=>{const{px:A,py:lt}=R(L.x,L.y);t.beginPath(),t.arc(A,lt,Kt,0,Math.PI*2),t.fill()})}),t.save(),t.translate(12,D+y/2),t.rotate(-Math.PI/2),t.textAlign="center",t.fillStyle="#374151",t.font="12px sans-serif",t.fillText("Value",0,0),t.restore()},oe={cube:Lt,hexagon:Jt,cup:qt,cupFilled:Zt,interpolationChart:ee},P={...kt,Canvas3D:(e,t)=>v.jsx(Nt,{id:e,parentPath:t??[],renderStrategy:oe})},De={title:"Shared/UI/Canvas3D",component:z,tags:["autodocs"],parameters:{layout:"centered",docs:{description:{component:`
## Overview

**Canvas3D** draws 3D wireframe shapes (cube, hexagon, etc.) on a 2D HTML canvas. The scene is driven by your SDUI document: you define **collections** and **items** in the tree; the canvas reads that data every frame and does not subscribe to individual nodes. A **render strategy** (injected from outside) maps item \`type\` (e.g. \`'cube'\`) to a draw function, so you can add custom shapes without changing the core.

**Key idea:** We live in 3D, but the screen is 2D. So we need a consistent way to turn 3D positions into 2D pixel coordinates and to decide which object is in front. The sections below explain that pipeline and the math in a beginner-friendly way.

---

## Rendering Pipeline (High Level)

Each frame, the following happens in order:

\`\`\`
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  requestAnimationFrame loop (every ~16ms)                               │
  └─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  1. Get "what to draw"                                                   │
  │     getCollections() → reads SDUI store, builds Collection[] from       │
  │     Canvas3D's child nodes (Canvas3DCollection → Canvas3DItem)           │
  └─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  2. Clear canvas, then for each collection:                              │
  │     - Sort 3D items by depth (z) so far objects are drawn first          │
  │     - For each item: look up strategy[item.type] and call it              │
  │       with (ctx, viewport, item, kind, dt)                                │
  └─────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  3. Each ItemRenderer:                                                    │
  │     - Builds a "world matrix" from item position/rotation/scale           │
  │     - Transforms shape vertices (e.g. cube corners) to world space         │
  │     - Projects 3D points to 2D (orthographic + view tilt)                │
  │     - Draws lines on ctx between projected points                         │
  └─────────────────────────────────────────────────────────────────────────┘
\`\`\`

No React state or SDUI subscription is used for the scene data; the loop always reads the latest from the store via the getter.

---

## SDUI Document Structure

The document tree under **Canvas3D** describes what appears on the canvas.

\`\`\`
  Canvas3D (id, state: width, height, scale, …)
    │
    ├── Canvas3DCollection (state.kind: '3d' | '2d')
    │     │
    │     ├── Canvas3DItem (state: type, position, info)
    │     ├── Canvas3DItem (state: type, position, info)
    │     └── …
    │
    └── Canvas3DCollection (state.kind: '3d')
          ├── Canvas3DItem …
          └── …
\`\`\`

| Node | Role |
|------|------|
| **Canvas3D** | Root. Optional \`state\`: \`width\`, \`height\`, \`scale\`, \`className\`. |
| **Canvas3DCollection** | Group of items. \`state.kind\`: \`'3d'\` (depth-sorted) or \`'2d'\`. |
| **Canvas3DItem** | One shape. \`state.type\` (e.g. \`'cube'\`, \`'hexagon'\`), \`position\` \`{ x, y, z }\`, \`info\` (scale, rotation, stroke/color). |

To **animate** (e.g. rotate): update the item's state with \`updateNodeState(itemNodeId, { info: { ...info, rotation: { x, y, z } } })\`. The next frame will read the new value and redraw.

---

## From 3D to 2D: Why Orthographic? What Is "View Rotation"?

### The problem

We have 3D coordinates (e.g. a corner of a cube). The screen has only 2D pixels. We need a **projection** that maps 3D to 2D in a consistent way.

### Two common projections

| Projection | Idea | Use case |
|-----------|------|----------|
| **Perspective** | Far things look smaller (like a photo). | Realistic games, CAD. |
| **Orthographic** | No shrinking with distance: 1 unit in the world = fixed pixels. | Diagrams, technical views, this component. |

Canvas3D uses **orthographic** so that moving an object in depth doesn’t change its on-screen size—only its position and draw order.

### Why "view rotation"?

If we map world X and Y directly, we’re looking straight down the **Z axis**. A cube centered at the origin would look like a single square (only the front face). To see **three faces** (top, front, side), we first **tilt** the scene: we rotate the world around X and Y by small angles (viewRotationX, viewRotationY). That “view rotation” gives us a view space; we then project the tilted X and Y to the screen and use the tilted depth only for depth ordering (who is in front).

---

## Coordinate Systems and the Full Path of a Point

A single vertex (e.g. one corner of a cube) goes through four stages:

- **Local**: Vertices are defined in the shape’s own space (e.g. cube corners in model units).
- **World**: A world matrix moves the shape to the scene (position, rotation, scale).
- **View**: View rotation turns the whole scene so we see multiple faces.
- **Screen**: View X and Y map to pixels with a fixed scale; view depth is only used for draw order.

---

## The World Matrix (Per-Item Transform)

Each item has position, rotation (Euler angles in radians), and scale. These are combined into one transform so we can move every vertex in one go. **Order matters**: apply scale first, then rotation (X, then Y, then Z), then translation.

---

## Scale, Rotation, and Translation (Theory)

**Scale (S)** — From info.scale or per-axis (sx, sy, sz). Each axis multiplies the local coordinate by that factor.

**Rotation (R)** — From info.rotation (x, y, z in radians). Rotations are applied around X, then Y, then Z. Each axis rotation leaves that axis unchanged and rotates the other two (e.g. Z rotation keeps z and rotates x and y in the XY plane using cos and sin of the angle).

**Translation (T)** — From position (tx, ty, tz). We add these to the rotated-and-scaled coordinates to get the final world position.

To get a pixel: take the world position, apply view rotation to get view-space coordinates, then map view X and Y to screen using the viewport scale and center. View depth is only used for depth ordering. Screen Y is flipped so that "up" in the world is up on screen.

---

## Orthographic Projection

Viewport stores width, height, scale (pixels per world unit), centerX (width/2), centerY (height/2), and optional viewRotationX, viewRotationY (radians). View rotation tilts the world (first around X, then around Y) so we see three faces of a cube. Orthographic projection then maps the tilted X and Y to pixel coordinates using the scale and center; the tilted depth is not used for pixel position, only for depth order (who is in front).

---

## Depth Ordering

For collections with kind "3d", we draw farther objects first so that closer ones appear on top. Each item is assigned a single depth value (e.g. from its position, or 0 if only x and y are given). Items are sorted by this value (ascending: small depth first), then drawn in that order. More advanced engines sometimes sort by per-vertex depth; here we use one depth per item for simplicity.

---

## Summary

| Step | What happens |
|------|----------------------|
| **Loop** | requestAnimationFrame runs renderSystem(dt) every frame. |
| **Data** | getCollections() builds Collection[] from SDUI store (Canvas3D children). |
| **Draw** | Clear canvas; for each collection sort by depth, then for each item call strategy[item.type](ctx, viewport, item, kind, dt). |
| **Per item** | World transform from position, rotation, scale (scale then rotate X/Y/Z then translate). |
| **Per vertex** | Local to world (via that transform), then view rotation, then orthographic to pixels; depth used for draw order. |
| **Strategy** | No default in the package; inject renderStrategy (e.g. from Storybook or createSduiComponents). |
        `}}}},ne=`const document = {
  version: '1.0.0',
  root: {
    id: 'root',
    type: 'Div',
    attributes: { className: 'w-full h-[400px]' },
    children: [{
      id: 'canvas',
      type: 'Canvas3D',
      state: { width: 600, height: 400, scale: 80 },
      children: [{
        id: 'col-3d',
        type: 'Canvas3DCollection',
        state: { kind: '3d' },
        children: [{
          id: 'cube-1',
          type: 'Canvas3DItem',
          state: {
            type: 'cube',
            position: { x: 0, y: 0, z: 0 },
            info: { scale: 1, rotation: { x: 0, y: 0, z: 0 }, stroke: '#1a1a1a' },
          },
        }],
      }],
    }],
  },
}

<SduiLayoutRenderer document={document} components={canvas3DComponents} />`,re=`// Data: 12 points (x 0..11)
const data = [
  { x: 0, y: 0 }, { x: 1, y: 20 }, { x: 2, y: 20 }, { x: 3, y: 58 },
  { x: 4, y: 58 }, { x: 5, y: 118 }, { x: 6, y: 148 }, { x: 7, y: 178 },
  { x: 8, y: 118 }, { x: 9, y: 125 }, { x: 10, y: 105 }, { x: 11, y: 110 },
]

const document = {
  version: '1.0.0',
  root: {
    id: 'root',
    type: 'Div',
    attributes: { className: 'w-full h-[420px]' },
    children: [{
      id: 'chart-canvas',
      type: 'Canvas3D',
      state: { width: 640, height: 400, scale: 80 },
      children: [{
        id: 'chart-col',
        type: 'Canvas3DCollection',
        state: { kind: '2d' },
        children: [{
          id: 'chart-item',
          type: 'Canvas3DItem',
          state: {
            type: 'interpolationChart',
            position: { x: 0, y: 0 },
            info: {
              title: 'Interpolation Modes',
              xRange: [0, 11],
              yRange: [-50, 200],
              series: [
                { data, interpolation: 'monotone', stroke: '#dc2626' },
                { data, interpolation: 'cubic', stroke: '#2563eb' },
                { data, interpolation: 'linear', stroke: '#0d9488' },
              ],
            },
          },
        }],
      }],
    }],
  },
}

<SduiLayoutRenderer document={document} components={canvas3DComponents} />`;function se(e){return{version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"w-full h-[400px]"},children:[{id:"canvas",type:"Canvas3D",state:{width:600,height:400,scale:80},children:[{id:"col-3d",type:"Canvas3DCollection",state:{kind:"3d"},children:[{id:"cube-1",type:"Canvas3DItem",state:{type:"cube",position:{x:0,y:0,z:0},info:{scale:1,rotation:e??{x:0,y:0,z:0},stroke:"#1a1a1a"}}}]}]}]}}}function ae(e){return{version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"w-full h-[400px]"},children:[{id:"canvas",type:"Canvas3D",state:{width:600,height:400,scale:80},children:[{id:"col-3d",type:"Canvas3DCollection",state:{kind:"3d"},children:[{id:"hexagon-1",type:"Canvas3DItem",state:{type:"hexagon",position:{x:0,y:0,z:0},info:{scale:1,rotation:e??{x:0,y:0,z:0},stroke:"#1a1a1a"}}}]}]}]}}}function ie(e){return{version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"w-full h-[400px]"},children:[{id:"canvas",type:"Canvas3D",state:{width:600,height:400,scale:80},children:[{id:"col-3d",type:"Canvas3DCollection",state:{kind:"3d"},children:[{id:"cup-1",type:"Canvas3DItem",state:{type:"cup",position:{x:0,y:0,z:0},info:{scale:1,rotation:e??{x:0,y:0,z:0},stroke:"#1a1a1a"}}}]}]}]}}}function ce(e){return{version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"w-full h-[400px]"},children:[{id:"canvas",type:"Canvas3D",state:{width:600,height:400,scale:80},children:[{id:"col-3d",type:"Canvas3DCollection",state:{kind:"3d"},children:[{id:"cup-filled-1",type:"Canvas3DItem",state:{type:"cupFilled",position:{x:0,y:0,z:0},info:{scale:1,rotation:e??{x:0,y:0,z:0},fill:"#3366CC",stroke:"#1a1a1a"}}}]}]}]}}}function le(e){const t=e?.state?.info;return t==null||typeof t!="object"?{}:t}const de=({nodeId:e})=>{const t=Et(),r=t.state.nodes[e]?.state,s=typeof r?.targetNodeId=="string"?r.targetNodeId:"";return K.useEffect(()=>{if(!s)return()=>{};let a;const c=()=>{const p=t.state.nodes[s],l=le(p),i=performance.now()/1e3;t.updateNodeState(s,{info:{...l,rotation:{x:0,y:0,z:i*.5}}}),a=requestAnimationFrame(c)};return a=requestAnimationFrame(c),()=>cancelAnimationFrame(a)},[t,s]),null},it={...P,RotationDriver:e=>v.jsx(de,{nodeId:e})},j=({children:e})=>v.jsx("div",{className:"flex justify-center rounded-lg border border-gray-200 bg-white p-6 shadow-sm",children:e}),F={render:()=>v.jsx(j,{children:v.jsx(z,{document:se(),components:P})}),parameters:{docs:{description:{story:"Renders a single 3D cube from an SDUI document. No rotation."},source:{code:ne,language:"tsx",type:"code"}}}},M={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"w-full h-[400px]"},children:[{id:"canvas",type:"Canvas3D",state:{width:600,height:400,scale:80},children:[{id:"col-3d",type:"Canvas3DCollection",state:{kind:"3d"},children:[{id:"cube-1",type:"Canvas3DItem",state:{type:"cube",position:{x:0,y:0,z:0},info:{scale:1,rotation:{x:0,y:0,z:0},stroke:"#1a1a1a"}}}]}]},{id:"driver",type:"RotationDriver",state:{targetNodeId:"cube-1"}}]}};return v.jsx(j,{children:v.jsx(z,{document:e,components:it})})},parameters:{docs:{description:{story:"Rotating 3D cube. RotationDriver updates the cube node's rotation state every frame."}}}},H={render:()=>v.jsx(j,{children:v.jsx(z,{document:ae(),components:P})}),parameters:{docs:{description:{story:"Renders a single 3D hexagon from an SDUI document. No rotation."}}}},O={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"w-full h-[400px]"},children:[{id:"canvas",type:"Canvas3D",state:{width:600,height:400,scale:80},children:[{id:"col-3d",type:"Canvas3DCollection",state:{kind:"3d"},children:[{id:"hexagon-1",type:"Canvas3DItem",state:{type:"hexagon",position:{x:0,y:0,z:0},info:{scale:1,rotation:{x:0,y:0,z:0},stroke:"#1a1a1a"}}}]}]},{id:"driver",type:"RotationDriver",state:{targetNodeId:"hexagon-1"}}]}};return v.jsx(j,{children:v.jsx(z,{document:e,components:it})})},parameters:{docs:{description:{story:"Rotating hexagon. RotationDriver updates the hexagon node's rotation state every frame, and the canvas reads the store every frame to reflect it."}}}},X={render:()=>v.jsx(j,{children:v.jsx(z,{document:ie(),components:P})}),parameters:{docs:{description:{story:"Renders a single 3D cup (surface of revolution) wireframe from an SDUI document. No rotation."}}}},Y={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"w-full h-[400px]"},children:[{id:"canvas",type:"Canvas3D",state:{width:600,height:400,scale:80},children:[{id:"col-3d",type:"Canvas3DCollection",state:{kind:"3d"},children:[{id:"cup-1",type:"Canvas3DItem",state:{type:"cup",position:{x:0,y:0,z:0},info:{scale:1,rotation:{x:0,y:0,z:0},stroke:"#1a1a1a"}}}]}]},{id:"driver",type:"RotationDriver",state:{targetNodeId:"cup-1"}}]}};return v.jsx(j,{children:v.jsx(z,{document:e,components:it})})},parameters:{docs:{description:{story:"Rotating 3D cup. RotationDriver updates the cup node's rotation state every frame."}}}},V={render:()=>v.jsx(j,{children:v.jsx(z,{document:ce(),components:P})}),parameters:{docs:{description:{story:"Renders a 3D cup with solid blue fill and black outline (surface of revolution)."}}}},B={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"w-full h-[400px]"},children:[{id:"canvas",type:"Canvas3D",state:{width:600,height:400,scale:80},children:[{id:"col-3d",type:"Canvas3DCollection",state:{kind:"3d"},children:[{id:"cup-filled-1",type:"Canvas3DItem",state:{type:"cupFilled",position:{x:0,y:0,z:0},info:{scale:1,rotation:{x:0,y:0,z:0},fill:"#3366CC",stroke:"#1a1a1a"}}}]}]},{id:"driver",type:"RotationDriver",state:{targetNodeId:"cup-filled-1"}}]}};return v.jsx(j,{children:v.jsx(z,{document:e,components:it})})},parameters:{docs:{description:{story:"Filled 3D cup with rotation. Blue fill and black outline."}}}},J=[{x:0,y:0},{x:1,y:20},{x:2,y:20},{x:3,y:58},{x:4,y:58},{x:5,y:118},{x:6,y:148},{x:7,y:178},{x:8,y:118},{x:9,y:125},{x:10,y:105},{x:11,y:110}],pe=640,ue=400,yt=[0,11],mt=[-50,200],he=14,ye=()=>{const e=K.useRef(null),[t,r]=K.useState(null);K.useEffect(()=>{const l=e.current;if(!l)return;const i=l.querySelector("canvas");if(!i)return;const n=u=>{const o=i.getBoundingClientRect(),d=i.width,h=i.height;if(d<=0||h<=0||o.width<=0||o.height<=0)return;const D=(u.clientX-o.left)/o.width*d,T=(u.clientY-o.top)/o.height*h,I=Qt(yt[0],yt[1],mt[0],mt[1],d,h),y=J.reduce((g,S)=>{const{px:w,py:k}=I(S.x,S.y),R=Math.hypot(D-w,T-k);return R<=he&&(g===null||R<g.dist)?{x:S.x,y:S.y,dist:R}:g},null);r(y!==null?{clientX:u.clientX,clientY:u.clientY,x:y.x,y:y.y}:null)},f=()=>r(null);return i.addEventListener("mousemove",n),i.addEventListener("mouseleave",f),()=>{i.removeEventListener("mousemove",n),i.removeEventListener("mouseleave",f)}},[]);const s={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"w-full h-[420px]"},children:[{id:"chart-canvas",type:"Canvas3D",state:{width:pe,height:ue,scale:80},children:[{id:"chart-col",type:"Canvas3DCollection",state:{kind:"2d"},children:[{id:"chart-item",type:"Canvas3DItem",state:{type:"interpolationChart",position:{x:0,y:0},info:{title:"Interpolation Modes",xRange:yt,yRange:mt,series:[{data:J,interpolation:"monotone",stroke:"#dc2626",label:"Cubic interpolation (monotone)"},{data:J,interpolation:"cubic",stroke:"#2563eb",label:"Cubic interpolation"},{data:J,interpolation:"linear",stroke:"#0d9488",label:"Linear interpolation (default)"}]}}}]}]}]}},a=t,c=a!==null?(()=>{let u=a.clientX+12,o=a.clientY+12;const d=typeof window<"u"?window.innerWidth:0,h=typeof window<"u"?window.innerHeight:0;return d>0&&u+80+8>d&&(u=d-80-8),d>0&&u<8&&(u=8),h>0&&o+28+8>h&&(o=h-28-8),h>0&&o<8&&(o=8),{left:u,top:o}})():null,p=[{label:"Cubic interpolation (monotone)",color:"#dc2626"},{label:"Cubic interpolation",color:"#2563eb"},{label:"Linear interpolation (default)",color:"#0d9488"}];return v.jsxs(j,{children:[v.jsxs("div",{ref:e,className:"relative flex flex-col items-center gap-4",children:[v.jsx(z,{document:s,components:P}),v.jsx("div",{className:"flex flex-wrap justify-center gap-6 text-sm text-gray-600",role:"list","aria-label":"Chart legend",children:p.map(l=>v.jsxs("span",{className:"flex items-center gap-2",role:"listitem",children:[v.jsx("span",{className:"h-3 w-3 shrink-0 rounded-sm border border-gray-300",style:{backgroundColor:l.color},"aria-hidden":!0}),v.jsx("span",{children:l.label})]},l.label))}),v.jsx("p",{className:"text-xs text-gray-500",children:"Hover over a data point to see (x, y) values."})]}),a!==null&&c!==null?v.jsxs("div",{className:"pointer-events-none fixed z-10 rounded bg-gray-900 px-2 py-1.5 text-xs text-white shadow-lg",style:{left:c.left,top:c.top},role:"tooltip",children:[v.jsxs("span",{className:"font-medium",children:["x: ",a.x]}),v.jsxs("span",{className:"ml-2 font-medium",children:["y: ",a.y]})]}):null]})},G={render:()=>v.jsx(ye,{}),parameters:{docs:{description:{story:`
**2D line chart** comparing three interpolation modes on the same 12-point data (x: 0–11):

- **Linear** (teal): piecewise straight segments.
- **Cubic** (blue): natural cubic spline; smooth but may overshoot.
- **Cubic monotone** (red): Fritsch–Carlson; smooth and preserves monotonicity.

Rendered with \`Canvas3DCollection\` \`kind: "2d"\` and one \`Canvas3DItem\` \`type: "interpolationChart"\`.  
**Hover** a data point to see (x, y) in a tooltip. The legend below the chart identifies each series.
        `.trim()},source:{code:re,language:"tsx",type:"code"}}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  render: () => <CanvasStoryWrapper>
      <SduiLayoutRenderer document={cubeDocument()} components={canvas3DComponents} />
    </CanvasStoryWrapper>,
  parameters: {
    docs: {
      description: {
        story: 'Renders a single 3D cube from an SDUI document. No rotation.'
      },
      source: {
        code: CUBE_DOCUMENT_SOURCE,
        language: 'tsx',
        type: 'code'
      }
    }
  }
}`,...F.parameters?.docs?.source},description:{story:"Static cube (no rotation).",...F.parameters?.docs?.description}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'w-full h-[400px]'
        },
        children: [{
          id: 'canvas',
          type: 'Canvas3D',
          state: {
            width: 600,
            height: 400,
            scale: 80
          },
          children: [{
            id: 'col-3d',
            type: 'Canvas3DCollection',
            state: {
              kind: '3d'
            },
            children: [{
              id: 'cube-1',
              type: 'Canvas3DItem',
              state: {
                type: 'cube',
                position: {
                  x: 0,
                  y: 0,
                  z: 0
                },
                info: {
                  scale: 1,
                  rotation: {
                    x: 0,
                    y: 0,
                    z: 0
                  },
                  stroke: '#1a1a1a'
                }
              }
            }]
          }]
        }, {
          id: 'driver',
          type: 'RotationDriver',
          state: {
            targetNodeId: 'cube-1'
          }
        }]
      }
    };
    return <CanvasStoryWrapper>
        <SduiLayoutRenderer document={document} components={componentsWithDriver} />
      </CanvasStoryWrapper>;
  },
  parameters: {
    docs: {
      description: {
        story: "Rotating 3D cube. RotationDriver updates the cube node's rotation state every frame."
      }
    }
  }
}`,...M.parameters?.docs?.source},description:{story:"Rotating cube: RotationDriver updates cube node state every frame.",...M.parameters?.docs?.description}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: () => <CanvasStoryWrapper>
      <SduiLayoutRenderer document={hexagonDocument()} components={canvas3DComponents} />
    </CanvasStoryWrapper>,
  parameters: {
    docs: {
      description: {
        story: 'Renders a single 3D hexagon from an SDUI document. No rotation.'
      }
    }
  }
}`,...H.parameters?.docs?.source},description:{story:"Static hexagon (no rotation).",...H.parameters?.docs?.description}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'w-full h-[400px]'
        },
        children: [{
          id: 'canvas',
          type: 'Canvas3D',
          state: {
            width: 600,
            height: 400,
            scale: 80
          },
          children: [{
            id: 'col-3d',
            type: 'Canvas3DCollection',
            state: {
              kind: '3d'
            },
            children: [{
              id: 'hexagon-1',
              type: 'Canvas3DItem',
              state: {
                type: 'hexagon',
                position: {
                  x: 0,
                  y: 0,
                  z: 0
                },
                info: {
                  scale: 1,
                  rotation: {
                    x: 0,
                    y: 0,
                    z: 0
                  },
                  stroke: '#1a1a1a'
                }
              }
            }]
          }]
        }, {
          id: 'driver',
          type: 'RotationDriver',
          state: {
            targetNodeId: 'hexagon-1'
          }
        }]
      }
    };
    return <CanvasStoryWrapper>
        <SduiLayoutRenderer document={document} components={componentsWithDriver} />
      </CanvasStoryWrapper>;
  },
  parameters: {
    docs: {
      description: {
        story: "Rotating hexagon. RotationDriver updates the hexagon node's rotation state every frame, and the canvas reads the store every frame to reflect it."
      }
    }
  }
}`,...O.parameters?.docs?.source},description:{story:"Rotating hexagon: RotationDriver updates hexagon node state every frame.",...O.parameters?.docs?.description}}};X.parameters={...X.parameters,docs:{...X.parameters?.docs,source:{originalSource:`{
  render: () => <CanvasStoryWrapper>
      <SduiLayoutRenderer document={cupDocument()} components={canvas3DComponents} />
    </CanvasStoryWrapper>,
  parameters: {
    docs: {
      description: {
        story: 'Renders a single 3D cup (surface of revolution) wireframe from an SDUI document. No rotation.'
      }
    }
  }
}`,...X.parameters?.docs?.source},description:{story:"Static cup (surface-of-revolution wireframe, no rotation).",...X.parameters?.docs?.description}}};Y.parameters={...Y.parameters,docs:{...Y.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'w-full h-[400px]'
        },
        children: [{
          id: 'canvas',
          type: 'Canvas3D',
          state: {
            width: 600,
            height: 400,
            scale: 80
          },
          children: [{
            id: 'col-3d',
            type: 'Canvas3DCollection',
            state: {
              kind: '3d'
            },
            children: [{
              id: 'cup-1',
              type: 'Canvas3DItem',
              state: {
                type: 'cup',
                position: {
                  x: 0,
                  y: 0,
                  z: 0
                },
                info: {
                  scale: 1,
                  rotation: {
                    x: 0,
                    y: 0,
                    z: 0
                  },
                  stroke: '#1a1a1a'
                }
              }
            }]
          }]
        }, {
          id: 'driver',
          type: 'RotationDriver',
          state: {
            targetNodeId: 'cup-1'
          }
        }]
      }
    };
    return <CanvasStoryWrapper>
        <SduiLayoutRenderer document={document} components={componentsWithDriver} />
      </CanvasStoryWrapper>;
  },
  parameters: {
    docs: {
      description: {
        story: "Rotating 3D cup. RotationDriver updates the cup node's rotation state every frame."
      }
    }
  }
}`,...Y.parameters?.docs?.source},description:{story:"Rotating cup: RotationDriver updates cup node state every frame.",...Y.parameters?.docs?.description}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  render: () => <CanvasStoryWrapper>
      <SduiLayoutRenderer document={cupFilledDocument()} components={canvas3DComponents} />
    </CanvasStoryWrapper>,
  parameters: {
    docs: {
      description: {
        story: 'Renders a 3D cup with solid blue fill and black outline (surface of revolution).'
      }
    }
  }
}`,...V.parameters?.docs?.source},description:{story:"Filled cup (blue fill + black outline), static.",...V.parameters?.docs?.description}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'w-full h-[400px]'
        },
        children: [{
          id: 'canvas',
          type: 'Canvas3D',
          state: {
            width: 600,
            height: 400,
            scale: 80
          },
          children: [{
            id: 'col-3d',
            type: 'Canvas3DCollection',
            state: {
              kind: '3d'
            },
            children: [{
              id: 'cup-filled-1',
              type: 'Canvas3DItem',
              state: {
                type: 'cupFilled',
                position: {
                  x: 0,
                  y: 0,
                  z: 0
                },
                info: {
                  scale: 1,
                  rotation: {
                    x: 0,
                    y: 0,
                    z: 0
                  },
                  fill: '#3366CC',
                  stroke: '#1a1a1a'
                }
              }
            }]
          }]
        }, {
          id: 'driver',
          type: 'RotationDriver',
          state: {
            targetNodeId: 'cup-filled-1'
          }
        }]
      }
    };
    return <CanvasStoryWrapper>
        <SduiLayoutRenderer document={document} components={componentsWithDriver} />
      </CanvasStoryWrapper>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Filled 3D cup with rotation. Blue fill and black outline.'
      }
    }
  }
}`,...B.parameters?.docs?.source},description:{story:"Filled cup with rotation.",...B.parameters?.docs?.description}}};G.parameters={...G.parameters,docs:{...G.parameters?.docs,source:{originalSource:`{
  render: () => <InterpolationModesWithTooltip />,
  parameters: {
    docs: {
      description: {
        story: \`
**2D line chart** comparing three interpolation modes on the same 12-point data (x: 0–11):

- **Linear** (teal): piecewise straight segments.
- **Cubic** (blue): natural cubic spline; smooth but may overshoot.
- **Cubic monotone** (red): Fritsch–Carlson; smooth and preserves monotonicity.

Rendered with \\\`Canvas3DCollection\\\` \\\`kind: "2d"\\\` and one \\\`Canvas3DItem\\\` \\\`type: "interpolationChart"\\\`.  
**Hover** a data point to see (x, y) in a tooltip. The legend below the chart identifies each series.
        \`.trim()
      },
      source: {
        code: INTERPOLATION_CHART_DOCUMENT_SOURCE,
        language: 'tsx',
        type: 'code'
      }
    }
  }
}`,...G.parameters?.docs?.source},description:{story:"Interpolation Modes: 2D line chart with linear, cubic, and monotone cubic interpolation (canvas-3d 2D collection).",...G.parameters?.docs?.description}}};const be=["StaticCube","RotatingCube","StaticHexagon","RotatingHexagon","StaticCup","RotatingCup","StaticCupFilled","RotatingCupFilled","InterpolationModes"];export{G as InterpolationModes,M as RotatingCube,Y as RotatingCup,B as RotatingCupFilled,O as RotatingHexagon,F as StaticCube,X as StaticCup,V as StaticCupFilled,H as StaticHexagon,be as __namedExportsOrder,De as default};
