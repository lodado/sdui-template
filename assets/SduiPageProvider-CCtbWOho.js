import{j as n}from"./jsx-runtime-H4OobEdJ.js";import{r as i}from"./iframe-DXfu0nKd.js";import{u as w,e as b,S as K,f as S}from"./SduiDocumentEditor-Dhci3RLH.js";import{R as D,P as Y,O as I,C as q,a as R,T as j}from"./index-Df7Wmu72.js";import{S as N}from"./SduiDocumentViewer-CQjYoekc.js";const P=({documentId:e,onClose:t,mode:a="side",readOnly:u=!1,onContentChange:l,className:p})=>{const _=w(),s=b(e,{refresh:!0});if(e===null)return null;const m=()=>{_?.open(e,"push"),t()};return n.jsx(D,{open:!0,onOpenChange:d=>d?void 0:t(),children:n.jsxs(Y,{children:[n.jsx(I,{className:"sdui-doc-peek-overlay","data-mode":a}),n.jsxs(q,{className:p??"sdui-doc-peek-content","data-mode":a,"aria-describedby":void 0,children:[n.jsxs("div",{className:"sdui-doc-peek-toolbar",children:[n.jsx("button",{type:"button",className:"sdui-doc-peek-open-full",onClick:m,"aria-label":"Open as full page",title:"Open as full page",children:"⤢"}),n.jsx(R,{asChild:!0,children:n.jsx("button",{type:"button",className:"sdui-doc-peek-close","aria-label":"Close preview",title:"Close",children:"✕"})})]}),n.jsx(j,{className:"sdui-doc-peek-title",children:s.status==="ready"?s.document.title:"Preview"}),n.jsxs("div",{className:"sdui-doc-peek-body",children:[s.status==="loading"&&n.jsxs("div",{className:"sdui-doc-peek-skeleton","aria-hidden":!0,children:[n.jsx("span",{}),n.jsx("span",{}),n.jsx("span",{})]}),s.status==="missing"&&n.jsx("p",{className:"sdui-doc-peek-status",children:"Page not found."}),s.status==="error"&&n.jsx("p",{className:"sdui-doc-peek-status",children:"Failed to load this page."}),s.status==="ready"&&(u?n.jsx(N,{content:s.document.content},e):n.jsx(K,{content:s.document.content,onContentChange:l?d=>l(e,d):void 0},e))]})]})]})})};P.__docgenInfo={description:`Notion-style peek: hosts the target document in a dialog as a full,
independent editor instance (drag & drop, slash menu — everything), like an
iframe of another page. Content is refetched on every open (refresh) so
edits made elsewhere show up.`,methods:[],displayName:"SduiPeekDialog",props:{documentId:{required:!0,tsType:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}]},description:"Target document to preview; null renders nothing."},mode:{required:!1,tsType:{name:"union",raw:"'side' | 'center'",elements:[{name:"literal",value:"'side'"},{name:"literal",value:"'center'"}]},description:`Notion peek grammar: 'side' (default) slides a panel in from the right and
keeps the page behind visible; 'center' is a dimmed modal.`,defaultValue:{value:"'side'",computed:!1}},readOnly:{required:!1,tsType:{name:"boolean"},description:"Render the peeked document read-only. Default false — like Notion, the peek is a full editor.",defaultValue:{value:"false",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};function y(e){return typeof window>"u"?null:new URLSearchParams(window.location.search).get(e)}function x(e,t){if(typeof window>"u")return;const a=new URL(window.location.href);t===null?a.searchParams.delete(e):a.searchParams.set(e,t),window.history.pushState(window.history.state,"",a)}function A(e,t,a){const u=i.useRef(a);u.current=a,i.useEffect(()=>{if(!e)return;u.current(y(e));const l=()=>u.current(y(e));return window.addEventListener("popstate",l),()=>window.removeEventListener("popstate",l)},[e]),i.useEffect(()=>{e&&y(e)!==t&&x(e,t)},[e,t])}const U=({resolver:e,navigator:t,defaultOpenMode:a="push",peekMode:u="side",peekReadOnly:l=!1,onPeekContentChange:p,peekUrlParam:_,children:s})=>{const m=i.useRef(new Map),d=i.useRef(new Map),[g,f]=i.useState(null),k=i.useRef(e);k.current=e;const h=i.useRef(t);h.current=t;const v=i.useCallback(async(r,c)=>{const o=m.current.get(r);if(!c?.refresh&&o!==void 0)return o==="missing"?void 0:o;const O=d.current.get(r);if(O)return O;const C=k.current(r).then(L=>(m.current.set(r,L??"missing"),L)).finally(()=>{d.current.delete(r)});return d.current.set(r,C),C},[]),T=i.useCallback(r=>{const c=m.current.get(r);return c==="missing"?void 0:c},[]),E=i.useCallback((r,c=a)=>{const o=h.current;if(c==="push"){o?.push?o.push(r):console.warn("[sdui-document-react] navigator.push is not provided — page push ignored");return}o?.peek?o.peek(r):f(r)},[a]),B=i.useMemo(()=>({resolve:v,peekCache:T,open:E,defaultOpenMode:a}),[v,T,E,a]);return A(t?.peek?void 0:_,g,f),n.jsxs(S.Provider,{value:B,children:[s,t?.peek?null:n.jsx(P,{documentId:g,mode:u,readOnly:l,onContentChange:p,onClose:()=>f(null)})]})};U.__docgenInfo={description:"Headless page-navigation boundary: document resolution (cached), and\npush/peek dispatch to the host navigator. When the host provides no `peek`,\nthe provider renders its own SduiPeekDialog as a fallback.",methods:[],displayName:"SduiPageProvider",props:{resolver:{required:!0,tsType:{name:"signature",type:"function",raw:"(id: string) => Promise<SduiDocument | undefined>",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"Promise",elements:[{name:"union",raw:"SduiDocument | undefined",elements:[{name:"signature",type:"object",raw:`{
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
| typeof BUTTON_BLOCK_TYPE
| typeof SDUI_BLOCK_TYPE`,elements:[{name:"ROOT_BLOCK_TYPE"},{name:"PARAGRAPH_BLOCK_TYPE"},{name:"HEADING_BLOCK_TYPE"},{name:"BULLETED_LIST_BLOCK_TYPE"},{name:"NUMBERED_LIST_BLOCK_TYPE"},{name:"CHECKLIST_BLOCK_TYPE"},{name:"DIVIDER_BLOCK_TYPE"},{name:"CALLOUT_BLOCK_TYPE"},{name:"IMAGE_BLOCK_TYPE"},{name:"FILE_BLOCK_TYPE"},{name:"LINK_BLOCK_TYPE"},{name:"QUOTE_BLOCK_TYPE"},{name:"TOGGLE_BLOCK_TYPE"},{name:"CODE_BLOCK_TYPE"},{name:"COLUMN_LIST_BLOCK_TYPE"},{name:"COLUMN_BLOCK_TYPE"},{name:"TOC_BLOCK_TYPE"},{name:"PAGE_BLOCK_TYPE"},{name:"COLLECTION_BLOCK_TYPE"},{name:"BOOKMARK_BLOCK_TYPE"},{name:"VIDEO_BLOCK_TYPE"},{name:"EMBED_BLOCK_TYPE"},{name:"TAGS_BLOCK_TYPE"},{name:"BUTTON_BLOCK_TYPE"},{name:"SDUI_BLOCK_TYPE"}]},{name:"unknown"}],required:!0}},{key:"position",value:{name:"string",required:!1},description:"Fractional ordering key among siblings (root block omits this)."},{key:"origin",value:{name:"signature",type:"object",raw:`{
  clientId: string
  opId: string
}`,signature:{properties:[{key:"clientId",value:{name:"string",required:!0}},{key:"opId",value:{name:"string",required:!0}}]},required:!1},description:"Deterministic tie-break when two blocks share the same position key."},{key:"state",value:{name:"Record",elements:[{name:"string"},{name:"unknown"}],raw:"Record<string, unknown>",required:!1}},{key:"attributes",value:{name:"Record",elements:[{name:"string"},{name:"unknown"}],raw:"Record<string, unknown>",required:!1}},{key:"children",value:{name:"Array",elements:[{name:"SduiDocumentBlock"}],raw:"SduiDocumentBlock[]",required:!1}}]},required:!0}}]},required:!0}},{key:"version",value:{name:"number",required:!0}},{key:"createdAt",value:{name:"string",required:!0}},{key:"updatedAt",value:{name:"string",required:!0}},{key:"archivedAt",value:{name:"string",required:!1}},{key:"deletedAt",value:{name:"string",required:!1}},{key:"createdBy",value:{name:"string",required:!1}}]}},{name:"undefined"}]}],raw:"Promise<SduiDocument | undefined>"}}},description:""},navigator:{required:!1,tsType:{name:"signature",type:"object",raw:`{
  push?(id: string): void
  peek?(id: string): void
}`,signature:{properties:[{key:"push",value:{name:"void",required:!1}},{key:"peek",value:{name:"void",required:!1}}]}},description:""},defaultOpenMode:{required:!1,tsType:{name:"union",raw:"'push' | 'peek'",elements:[{name:"literal",value:"'push'"},{name:"literal",value:"'peek'"}]},description:"What a plain click on a page block does. Default 'push'.",defaultValue:{value:"'push'",computed:!1}},peekMode:{required:!1,tsType:{name:"union",raw:"'side' | 'center'",elements:[{name:"literal",value:"'side'"},{name:"literal",value:"'center'"}]},description:"Presentation of the built-in fallback peek dialog. Default 'side'.",defaultValue:{value:"'side'",computed:!1}},peekReadOnly:{required:!1,tsType:{name:"boolean"},description:"Render the fallback peek read-only. Default false — the peek is a full editor.",defaultValue:{value:"false",computed:!1}},peekUrlParam:{required:!1,tsType:{name:"string"},description:"Sync the fallback peek id to this URL search param (e.g. 'peek') so a\npreview is shareable/deep-linkable and the back button closes it. Omit to\ndisable. Ignored when the host provides its own `navigator.peek`."},children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};export{U as S};
