import{j as n}from"./jsx-runtime-CZLhImQn.js";import{R as g,r as u}from"./iframe-B8KYAuVr.js";import{e as S,n as Y,B as R,f as N,I as q,g as A,D as v,h as j,j as x,u as U,k as G,S as M,m as V}from"./SduiDocumentEditor-DSUbiD1e.js";import{R as H,P as F,O as Q,C as W,a as z,T as J}from"./index-DsyjPEvF.js";import{d as w,c as X,f as Z,C as $,r as ee}from"./marked.esm-CEb0ui0X.js";function ne(e){const{children:t,...r}=e;return r}const te=({block:e,depth:t})=>{const r=e.children??[];if(e.type===w)return n.jsx("div",{"data-block-id":e.id,"data-block-type":e.type,"data-depth":t,"data-column-list":!0,children:r.map(a=>n.jsx(y,{block:a,depth:t},a.id))});const i=S(e.attributes);return n.jsx("div",{"data-block-id":e.id,"data-block-type":e.type,"data-column":!0,style:i!==void 0?{flexGrow:i}:void 0,children:r.map(a=>n.jsx(y,{block:a,depth:t},a.id))})},y=({block:e,depth:t,listOrdinal:r})=>e.type===w||e.type===X?n.jsx(te,{block:e,depth:t}):n.jsx(re,{block:e,depth:t,listOrdinal:r}),re=({block:e,depth:t,listOrdinal:r})=>{const i=e.children??[],a=e.type===Z,p=e.type===$,d=e.attributes?.collapsed===!0,[o,c]=g.useState(d);g.useEffect(()=>{a&&c(d)},[a,d]);const l=a&&o,O=a&&!l&&i.length===0,_=ne(e),L=a?{..._,attributes:{..._.attributes,collapsed:o}}:_,C=a?(T,f)=>c(f):void 0,B=Y(i);return n.jsxs("div",{"data-block-id":e.id,"data-block-type":e.type,"data-depth":t,children:[n.jsx("div",{"data-block-row":!0,children:n.jsx("div",{"data-block-content":!0,"data-align":ee(e.attributes?.align),children:n.jsx(R,{block:L,depth:t,listOrdinal:r,onToggleCollapsed:C,children:N(e)&&n.jsx("span",{className:"sdui-doc-static","data-inline-root":!0,children:n.jsx(q,{content:A(e)})})})})}),i.length>0&&!l&&!p?n.jsx("div",{"data-block-nested":!0,"data-nested-toggle":a||void 0,style:{paddingLeft:v},children:i.map(T=>n.jsx(y,{block:T,depth:t+1,listOrdinal:B.get(T.id)},T.id))}):null,O?n.jsx("div",{"data-block-nested":!0,"data-nested-toggle":!0,style:{paddingLeft:v},children:n.jsx("button",{type:"button",className:"toggle-empty-placeholder",disabled:!0,children:"Empty toggle. Press Enter, click, or drop blocks inside."})}):null]})};y.__docgenInfo={description:"",methods:[],displayName:"ViewerBlockNode",props:{block:{required:!0,tsType:{name:"signature",type:"object",raw:`{
  id: SduiDocumentBlockId
  type: SduiDocumentBlockType | (string & {})
  /** Fractional ordering key among siblings (root block omits this). */
  position?: string
  /** Deterministic tie-break when two blocks share the same position key. */
  origin?: BlockOrigin
  state?: Record<string, unknown>
  attributes?: Record<string, unknown>
  children?: SduiDocumentBlock[]
}`,signature:{properties:[{key:"id",value:{name:"intersection",raw:"T & { readonly [__brand]: B }",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ readonly [__brand]: B }",signature:{properties:[{key:"@computed#__brand",value:{name:"literal",value:"'SduiDocumentBlockId'",required:!0}}]}}],required:!0}},{key:"type",value:{name:"union",raw:"SduiDocumentBlockType | (string & {})",elements:[{name:"union",raw:`| typeof ROOT_BLOCK_TYPE
| typeof PARAGRAPH_BLOCK_TYPE
| typeof HEADING_BLOCK_TYPE
| typeof BULLETED_LIST_BLOCK_TYPE
| typeof NUMBERED_LIST_BLOCK_TYPE
| typeof CHECKLIST_BLOCK_TYPE
| typeof DIVIDER_BLOCK_TYPE
| typeof CALLOUT_BLOCK_TYPE
| typeof IMAGE_BLOCK_TYPE
| typeof FILE_BLOCK_TYPE
| typeof LINK_BLOCK_TYPE
| typeof QUOTE_BLOCK_TYPE
| typeof TOGGLE_BLOCK_TYPE
| typeof CODE_BLOCK_TYPE
| typeof COLUMN_LIST_BLOCK_TYPE
| typeof COLUMN_BLOCK_TYPE
| typeof TOC_BLOCK_TYPE
| typeof PAGE_BLOCK_TYPE
| typeof COLLECTION_BLOCK_TYPE
| typeof BOOKMARK_BLOCK_TYPE
| typeof VIDEO_BLOCK_TYPE
| typeof EMBED_BLOCK_TYPE
| typeof TAGS_BLOCK_TYPE
| typeof BUTTON_BLOCK_TYPE`,elements:[{name:"ROOT_BLOCK_TYPE"},{name:"PARAGRAPH_BLOCK_TYPE"},{name:"HEADING_BLOCK_TYPE"},{name:"BULLETED_LIST_BLOCK_TYPE"},{name:"NUMBERED_LIST_BLOCK_TYPE"},{name:"CHECKLIST_BLOCK_TYPE"},{name:"DIVIDER_BLOCK_TYPE"},{name:"CALLOUT_BLOCK_TYPE"},{name:"IMAGE_BLOCK_TYPE"},{name:"FILE_BLOCK_TYPE"},{name:"LINK_BLOCK_TYPE"},{name:"QUOTE_BLOCK_TYPE"},{name:"TOGGLE_BLOCK_TYPE"},{name:"CODE_BLOCK_TYPE"},{name:"COLUMN_LIST_BLOCK_TYPE"},{name:"COLUMN_BLOCK_TYPE"},{name:"TOC_BLOCK_TYPE"},{name:"PAGE_BLOCK_TYPE"},{name:"COLLECTION_BLOCK_TYPE"},{name:"BOOKMARK_BLOCK_TYPE"},{name:"VIDEO_BLOCK_TYPE"},{name:"EMBED_BLOCK_TYPE"},{name:"TAGS_BLOCK_TYPE"},{name:"BUTTON_BLOCK_TYPE"}]},{name:"unknown"}],required:!0}},{key:"position",value:{name:"string",required:!1},description:"Fractional ordering key among siblings (root block omits this)."},{key:"origin",value:{name:"signature",type:"object",raw:`{
  clientId: string
  opId: string
}`,signature:{properties:[{key:"clientId",value:{name:"string",required:!0}},{key:"opId",value:{name:"string",required:!0}}]},required:!1},description:"Deterministic tie-break when two blocks share the same position key."},{key:"state",value:{name:"Record",elements:[{name:"string"},{name:"unknown"}],raw:"Record<string, unknown>",required:!1}},{key:"attributes",value:{name:"Record",elements:[{name:"string"},{name:"unknown"}],raw:"Record<string, unknown>",required:!1}},{key:"children",value:{name:"Array",elements:[{name:"SduiDocumentBlock"}],raw:"SduiDocumentBlock[]",required:!1}}]}},description:""},depth:{required:!0,tsType:{name:"number"},description:""},listOrdinal:{required:!1,tsType:{name:"number"},description:""}}};const b=({content:e,className:t,theme:r="swiss"})=>{const i=g.useRef(null);i.current??=j(e),g.useEffect(()=>{i.current?.setSnapshot(e)},[e]);const a=e.root.children??[],p=Y(a);return n.jsx(x,{value:i.current,children:n.jsx("div",{className:t,"data-sdui-document-editor":!0,"data-sdui-document-viewer":!0,"data-sdui-doc-theme":r,children:a.map(d=>n.jsx(y,{block:d,depth:1,listOrdinal:p.get(d.id)},d.id))})})};b.__docgenInfo={description:"Read-only document renderer with visual parity to `SduiDocumentEditor`'s\nreadOnly mode, but with no ProseMirror/dnd-kit in its import graph — import\nit from `@lodado/sdui-document-react/viewer` to keep editor code out of the\nbundle (published pages, SSR).\n\n`data-sdui-document-editor` is load-bearing: every rule in the src/styles\nstylesheets is scoped under it.",methods:[],displayName:"SduiDocumentViewer",props:{content:{required:!0,tsType:{name:"signature",type:"object",raw:`{
  schemaVersion: SduiDocumentSchemaVersion
  root: SduiDocumentBlock
}`,signature:{properties:[{key:"schemaVersion",value:{name:"union",raw:"'1.0' | '1.1'",elements:[{name:"literal",value:"'1.0'"},{name:"literal",value:"'1.1'"}],required:!0}},{key:"root",value:{name:"signature",type:"object",raw:`{
  id: SduiDocumentBlockId
  type: SduiDocumentBlockType | (string & {})
  /** Fractional ordering key among siblings (root block omits this). */
  position?: string
  /** Deterministic tie-break when two blocks share the same position key. */
  origin?: BlockOrigin
  state?: Record<string, unknown>
  attributes?: Record<string, unknown>
  children?: SduiDocumentBlock[]
}`,signature:{properties:[{key:"id",value:{name:"intersection",raw:"T & { readonly [__brand]: B }",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ readonly [__brand]: B }",signature:{properties:[{key:"@computed#__brand",value:{name:"literal",value:"'SduiDocumentBlockId'",required:!0}}]}}],required:!0}},{key:"type",value:{name:"union",raw:"SduiDocumentBlockType | (string & {})",elements:[{name:"union",raw:`| typeof ROOT_BLOCK_TYPE
| typeof PARAGRAPH_BLOCK_TYPE
| typeof HEADING_BLOCK_TYPE
| typeof BULLETED_LIST_BLOCK_TYPE
| typeof NUMBERED_LIST_BLOCK_TYPE
| typeof CHECKLIST_BLOCK_TYPE
| typeof DIVIDER_BLOCK_TYPE
| typeof CALLOUT_BLOCK_TYPE
| typeof IMAGE_BLOCK_TYPE
| typeof FILE_BLOCK_TYPE
| typeof LINK_BLOCK_TYPE
| typeof QUOTE_BLOCK_TYPE
| typeof TOGGLE_BLOCK_TYPE
| typeof CODE_BLOCK_TYPE
| typeof COLUMN_LIST_BLOCK_TYPE
| typeof COLUMN_BLOCK_TYPE
| typeof TOC_BLOCK_TYPE
| typeof PAGE_BLOCK_TYPE
| typeof COLLECTION_BLOCK_TYPE
| typeof BOOKMARK_BLOCK_TYPE
| typeof VIDEO_BLOCK_TYPE
| typeof EMBED_BLOCK_TYPE
| typeof TAGS_BLOCK_TYPE
| typeof BUTTON_BLOCK_TYPE`,elements:[{name:"ROOT_BLOCK_TYPE"},{name:"PARAGRAPH_BLOCK_TYPE"},{name:"HEADING_BLOCK_TYPE"},{name:"BULLETED_LIST_BLOCK_TYPE"},{name:"NUMBERED_LIST_BLOCK_TYPE"},{name:"CHECKLIST_BLOCK_TYPE"},{name:"DIVIDER_BLOCK_TYPE"},{name:"CALLOUT_BLOCK_TYPE"},{name:"IMAGE_BLOCK_TYPE"},{name:"FILE_BLOCK_TYPE"},{name:"LINK_BLOCK_TYPE"},{name:"QUOTE_BLOCK_TYPE"},{name:"TOGGLE_BLOCK_TYPE"},{name:"CODE_BLOCK_TYPE"},{name:"COLUMN_LIST_BLOCK_TYPE"},{name:"COLUMN_BLOCK_TYPE"},{name:"TOC_BLOCK_TYPE"},{name:"PAGE_BLOCK_TYPE"},{name:"COLLECTION_BLOCK_TYPE"},{name:"BOOKMARK_BLOCK_TYPE"},{name:"VIDEO_BLOCK_TYPE"},{name:"EMBED_BLOCK_TYPE"},{name:"TAGS_BLOCK_TYPE"},{name:"BUTTON_BLOCK_TYPE"}]},{name:"unknown"}],required:!0}},{key:"position",value:{name:"string",required:!1},description:"Fractional ordering key among siblings (root block omits this)."},{key:"origin",value:{name:"signature",type:"object",raw:`{
  clientId: string
  opId: string
}`,signature:{properties:[{key:"clientId",value:{name:"string",required:!0}},{key:"opId",value:{name:"string",required:!0}}]},required:!1},description:"Deterministic tie-break when two blocks share the same position key."},{key:"state",value:{name:"Record",elements:[{name:"string"},{name:"unknown"}],raw:"Record<string, unknown>",required:!1}},{key:"attributes",value:{name:"Record",elements:[{name:"string"},{name:"unknown"}],raw:"Record<string, unknown>",required:!1}},{key:"children",value:{name:"Array",elements:[{name:"SduiDocumentBlock"}],raw:"SduiDocumentBlock[]",required:!1}}]},required:!0}}]}},description:""},className:{required:!1,tsType:{name:"string"},description:""},theme:{required:!1,tsType:{name:"union",raw:"'swiss' | 'notion' | (string & {})",elements:[{name:"literal",value:"'swiss'"},{name:"literal",value:"'notion'"},{name:"unknown"}]},description:"Visual theme, rendered as `data-sdui-doc-theme` on the root. Defaults to\n'swiss'; pass 'notion' for the base Notion-like look.",defaultValue:{value:"'swiss'",computed:!1}}}};const I=({documentId:e,onClose:t,mode:r="side",readOnly:i=!1,onContentChange:a,className:p})=>{const d=U(),o=G(e,{refresh:!0});if(e===null)return null;const c=()=>{d?.open(e,"push"),t()};return n.jsx(H,{open:!0,onOpenChange:l=>l?void 0:t(),children:n.jsxs(F,{children:[n.jsx(Q,{className:"sdui-doc-peek-overlay","data-mode":r}),n.jsxs(W,{className:p??"sdui-doc-peek-content","data-mode":r,"aria-describedby":void 0,children:[n.jsxs("div",{className:"sdui-doc-peek-toolbar",children:[n.jsx("button",{type:"button",className:"sdui-doc-peek-open-full",onClick:c,"aria-label":"Open as full page",title:"Open as full page",children:"⤢"}),n.jsx(z,{asChild:!0,children:n.jsx("button",{type:"button",className:"sdui-doc-peek-close","aria-label":"Close preview",title:"Close",children:"✕"})})]}),n.jsx(J,{className:"sdui-doc-peek-title",children:o.status==="ready"?o.document.title:"Preview"}),n.jsxs("div",{className:"sdui-doc-peek-body",children:[o.status==="loading"&&n.jsxs("div",{className:"sdui-doc-peek-skeleton","aria-hidden":!0,children:[n.jsx("span",{}),n.jsx("span",{}),n.jsx("span",{})]}),o.status==="missing"&&n.jsx("p",{className:"sdui-doc-peek-status",children:"Page not found."}),o.status==="error"&&n.jsx("p",{className:"sdui-doc-peek-status",children:"Failed to load this page."}),o.status==="ready"&&(i?n.jsx(b,{content:o.document.content},e):n.jsx(M,{content:o.document.content,onContentChange:a?l=>a(e,l):void 0},e))]})]})]})})};I.__docgenInfo={description:`Notion-style peek: hosts the target document in a dialog as a full,
independent editor instance (drag & drop, slash menu — everything), like an
iframe of another page. Content is refetched on every open (refresh) so
edits made elsewhere show up.`,methods:[],displayName:"SduiPeekDialog",props:{documentId:{required:!0,tsType:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}]},description:"Target document to preview; null renders nothing."},mode:{required:!1,tsType:{name:"union",raw:"'side' | 'center'",elements:[{name:"literal",value:"'side'"},{name:"literal",value:"'center'"}]},description:`Notion peek grammar: 'side' (default) slides a panel in from the right and
keeps the page behind visible; 'center' is a dimmed modal.`,defaultValue:{value:"'side'",computed:!1}},readOnly:{required:!1,tsType:{name:"boolean"},description:"Render the peeked document read-only. Default false — like Notion, the peek is a full editor.",defaultValue:{value:"false",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};function k(e){return typeof window>"u"?null:new URLSearchParams(window.location.search).get(e)}function ae(e,t){if(typeof window>"u")return;const r=new URL(window.location.href);t===null?r.searchParams.delete(e):r.searchParams.set(e,t),window.history.pushState(window.history.state,"",r)}function ie(e,t,r){const i=u.useRef(r);i.current=r,u.useEffect(()=>{if(!e)return;i.current(k(e));const a=()=>i.current(k(e));return window.addEventListener("popstate",a),()=>window.removeEventListener("popstate",a)},[e]),u.useEffect(()=>{e&&k(e)!==t&&ae(e,t)},[e,t])}const oe=({resolver:e,navigator:t,defaultOpenMode:r="push",peekMode:i="side",peekReadOnly:a=!1,onPeekContentChange:p,peekUrlParam:d,children:o})=>{const c=u.useRef(new Map),l=u.useRef(new Map),[O,_]=u.useState(null),L=u.useRef(e);L.current=e;const C=u.useRef(t);C.current=t;const B=u.useCallback(async(s,E)=>{const m=c.current.get(s);if(!E?.refresh&&m!==void 0)return m==="missing"?void 0:m;const P=l.current.get(s);if(P)return P;const K=L.current(s).then(h=>(c.current.set(s,h??"missing"),h)).finally(()=>{l.current.delete(s)});return l.current.set(s,K),K},[]),T=u.useCallback(s=>{const E=c.current.get(s);return E==="missing"?void 0:E},[]),f=u.useCallback((s,E=r)=>{const m=C.current;if(E==="push"){m?.push?m.push(s):console.warn("[sdui-document-react] navigator.push is not provided — page push ignored");return}m?.peek?m.peek(s):_(s)},[r]),D=u.useMemo(()=>({resolve:B,peekCache:T,open:f,defaultOpenMode:r}),[B,T,f,r]);return ie(t?.peek?void 0:d,O,_),n.jsxs(V.Provider,{value:D,children:[o,t?.peek?null:n.jsx(I,{documentId:O,mode:i,readOnly:a,onContentChange:p,onClose:()=>_(null)})]})};oe.__docgenInfo={description:"Headless page-navigation boundary: document resolution (cached), and\npush/peek dispatch to the host navigator. When the host provides no `peek`,\nthe provider renders its own SduiPeekDialog as a fallback.",methods:[],displayName:"SduiPageProvider",props:{resolver:{required:!0,tsType:{name:"signature",type:"function",raw:"(id: string) => Promise<SduiDocument | undefined>",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"Promise",elements:[{name:"union",raw:"SduiDocument | undefined",elements:[{name:"signature",type:"object",raw:`{
  id: SduiDocumentId
  workspaceId: SduiWorkspaceId
  collectionId?: SduiCollectionId
  parentDocumentId?: SduiDocumentId
  sortIndex?: number
  title: string
  state: SduiDocumentState
  content: SduiDocumentContent
  version: number
  createdAt: string
  updatedAt: string
  archivedAt?: string
  deletedAt?: string
  createdBy?: string
}`,signature:{properties:[{key:"id",value:{name:"intersection",raw:"T & { readonly [__brand]: B }",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ readonly [__brand]: B }",signature:{properties:[{key:"@computed#__brand",value:{name:"literal",value:"'SduiDocumentId'",required:!0}}]}}],required:!0}},{key:"workspaceId",value:{name:"intersection",raw:"T & { readonly [__brand]: B }",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ readonly [__brand]: B }",signature:{properties:[{key:"@computed#__brand",value:{name:"literal",value:"'SduiDocumentId'",required:!0}}]}}],required:!0}},{key:"collectionId",value:{name:"intersection",raw:"T & { readonly [__brand]: B }",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ readonly [__brand]: B }",signature:{properties:[{key:"@computed#__brand",value:{name:"literal",value:"'SduiDocumentId'",required:!0}}]}}],required:!0}},{key:"parentDocumentId",value:{name:"intersection",raw:"T & { readonly [__brand]: B }",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ readonly [__brand]: B }",signature:{properties:[{key:"@computed#__brand",value:{name:"literal",value:"'SduiDocumentId'",required:!0}}]}}],required:!0}},{key:"sortIndex",value:{name:"number",required:!1}},{key:"title",value:{name:"string",required:!0}},{key:"state",value:{name:"union",raw:"'draft' | 'published' | 'archived' | 'deleted'",elements:[{name:"literal",value:"'draft'"},{name:"literal",value:"'published'"},{name:"literal",value:"'archived'"},{name:"literal",value:"'deleted'"}],required:!0}},{key:"content",value:{name:"signature",type:"object",raw:`{
  schemaVersion: SduiDocumentSchemaVersion
  root: SduiDocumentBlock
}`,signature:{properties:[{key:"schemaVersion",value:{name:"union",raw:"'1.0' | '1.1'",elements:[{name:"literal",value:"'1.0'"},{name:"literal",value:"'1.1'"}],required:!0}},{key:"root",value:{name:"signature",type:"object",raw:`{
  id: SduiDocumentBlockId
  type: SduiDocumentBlockType | (string & {})
  /** Fractional ordering key among siblings (root block omits this). */
  position?: string
  /** Deterministic tie-break when two blocks share the same position key. */
  origin?: BlockOrigin
  state?: Record<string, unknown>
  attributes?: Record<string, unknown>
  children?: SduiDocumentBlock[]
}`,signature:{properties:[{key:"id",value:{name:"intersection",raw:"T & { readonly [__brand]: B }",elements:[{name:"string"},{name:"signature",type:"object",raw:"{ readonly [__brand]: B }",signature:{properties:[{key:"@computed#__brand",value:{name:"literal",value:"'SduiDocumentId'",required:!0}}]}}],required:!0}},{key:"type",value:{name:"union",raw:"SduiDocumentBlockType | (string & {})",elements:[{name:"union",raw:`| typeof ROOT_BLOCK_TYPE
| typeof PARAGRAPH_BLOCK_TYPE
| typeof HEADING_BLOCK_TYPE
| typeof BULLETED_LIST_BLOCK_TYPE
| typeof NUMBERED_LIST_BLOCK_TYPE
| typeof CHECKLIST_BLOCK_TYPE
| typeof DIVIDER_BLOCK_TYPE
| typeof CALLOUT_BLOCK_TYPE
| typeof IMAGE_BLOCK_TYPE
| typeof FILE_BLOCK_TYPE
| typeof LINK_BLOCK_TYPE
| typeof QUOTE_BLOCK_TYPE
| typeof TOGGLE_BLOCK_TYPE
| typeof CODE_BLOCK_TYPE
| typeof COLUMN_LIST_BLOCK_TYPE
| typeof COLUMN_BLOCK_TYPE
| typeof TOC_BLOCK_TYPE
| typeof PAGE_BLOCK_TYPE
| typeof COLLECTION_BLOCK_TYPE
| typeof BOOKMARK_BLOCK_TYPE
| typeof VIDEO_BLOCK_TYPE
| typeof EMBED_BLOCK_TYPE
| typeof TAGS_BLOCK_TYPE
| typeof BUTTON_BLOCK_TYPE`,elements:[{name:"ROOT_BLOCK_TYPE"},{name:"PARAGRAPH_BLOCK_TYPE"},{name:"HEADING_BLOCK_TYPE"},{name:"BULLETED_LIST_BLOCK_TYPE"},{name:"NUMBERED_LIST_BLOCK_TYPE"},{name:"CHECKLIST_BLOCK_TYPE"},{name:"DIVIDER_BLOCK_TYPE"},{name:"CALLOUT_BLOCK_TYPE"},{name:"IMAGE_BLOCK_TYPE"},{name:"FILE_BLOCK_TYPE"},{name:"LINK_BLOCK_TYPE"},{name:"QUOTE_BLOCK_TYPE"},{name:"TOGGLE_BLOCK_TYPE"},{name:"CODE_BLOCK_TYPE"},{name:"COLUMN_LIST_BLOCK_TYPE"},{name:"COLUMN_BLOCK_TYPE"},{name:"TOC_BLOCK_TYPE"},{name:"PAGE_BLOCK_TYPE"},{name:"COLLECTION_BLOCK_TYPE"},{name:"BOOKMARK_BLOCK_TYPE"},{name:"VIDEO_BLOCK_TYPE"},{name:"EMBED_BLOCK_TYPE"},{name:"TAGS_BLOCK_TYPE"},{name:"BUTTON_BLOCK_TYPE"}]},{name:"unknown"}],required:!0}},{key:"position",value:{name:"string",required:!1},description:"Fractional ordering key among siblings (root block omits this)."},{key:"origin",value:{name:"signature",type:"object",raw:`{
  clientId: string
  opId: string
}`,signature:{properties:[{key:"clientId",value:{name:"string",required:!0}},{key:"opId",value:{name:"string",required:!0}}]},required:!1},description:"Deterministic tie-break when two blocks share the same position key."},{key:"state",value:{name:"Record",elements:[{name:"string"},{name:"unknown"}],raw:"Record<string, unknown>",required:!1}},{key:"attributes",value:{name:"Record",elements:[{name:"string"},{name:"unknown"}],raw:"Record<string, unknown>",required:!1}},{key:"children",value:{name:"Array",elements:[{name:"SduiDocumentBlock"}],raw:"SduiDocumentBlock[]",required:!1}}]},required:!0}}]},required:!0}},{key:"version",value:{name:"number",required:!0}},{key:"createdAt",value:{name:"string",required:!0}},{key:"updatedAt",value:{name:"string",required:!0}},{key:"archivedAt",value:{name:"string",required:!1}},{key:"deletedAt",value:{name:"string",required:!1}},{key:"createdBy",value:{name:"string",required:!1}}]}},{name:"undefined"}]}],raw:"Promise<SduiDocument | undefined>"}}},description:""},navigator:{required:!1,tsType:{name:"signature",type:"object",raw:`{
  push?(id: string): void
  peek?(id: string): void
}`,signature:{properties:[{key:"push",value:{name:"void",required:!1}},{key:"peek",value:{name:"void",required:!1}}]}},description:""},defaultOpenMode:{required:!1,tsType:{name:"union",raw:"'push' | 'peek'",elements:[{name:"literal",value:"'push'"},{name:"literal",value:"'peek'"}]},description:"What a plain click on a page block does. Default 'push'.",defaultValue:{value:"'push'",computed:!1}},peekMode:{required:!1,tsType:{name:"union",raw:"'side' | 'center'",elements:[{name:"literal",value:"'side'"},{name:"literal",value:"'center'"}]},description:"Presentation of the built-in fallback peek dialog. Default 'side'.",defaultValue:{value:"'side'",computed:!1}},peekReadOnly:{required:!1,tsType:{name:"boolean"},description:"Render the fallback peek read-only. Default false — the peek is a full editor.",defaultValue:{value:"false",computed:!1}},peekUrlParam:{required:!1,tsType:{name:"string"},description:"Sync the fallback peek id to this URL search param (e.g. 'peek') so a\npreview is shareable/deep-linkable and the back button closes it. Omit to\ndisable. Ignored when the host provides its own `navigator.peek`."},children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};export{b as S,oe as a};
