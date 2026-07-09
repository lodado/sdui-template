import{j as e}from"./jsx-runtime-DiXa-lBB.js";import{r as a}from"./iframe-CZ4IIPOh.js";import{u as L,b as P,S as b,c as K}from"./SduiDocumentEditor-CgjqnSTA.js";import{R as w,P as D,O as I,C as Y,a as S,T as q}from"./index-DkykxaJC.js";const C=({documentId:r,onClose:o,mode:s="side",readOnly:m=!1,onContentChange:c,className:p})=>{const _=L(),t=P(r,{refresh:!0});if(r===null)return null;const l=()=>{_?.open(r,"push"),o()};return e.jsx(w,{open:!0,onOpenChange:d=>d?void 0:o(),children:e.jsxs(D,{children:[e.jsx(I,{className:"sdui-doc-peek-overlay","data-mode":s}),e.jsxs(Y,{className:p??"sdui-doc-peek-content","data-mode":s,"aria-describedby":void 0,children:[e.jsxs("div",{className:"sdui-doc-peek-toolbar",children:[e.jsx("button",{type:"button",className:"sdui-doc-peek-open-full",onClick:l,"aria-label":"Open as full page",title:"Open as full page",children:"⤢"}),e.jsx(S,{asChild:!0,children:e.jsx("button",{type:"button",className:"sdui-doc-peek-close","aria-label":"Close preview",title:"Close",children:"✕"})})]}),e.jsx(q,{className:"sdui-doc-peek-title",children:t.status==="ready"?t.document.title:"Preview"}),e.jsxs("div",{className:"sdui-doc-peek-body",children:[t.status==="loading"&&e.jsxs("div",{className:"sdui-doc-peek-skeleton","aria-hidden":!0,children:[e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{})]}),t.status==="missing"&&e.jsx("p",{className:"sdui-doc-peek-status",children:"Page not found."}),t.status==="error"&&e.jsx("p",{className:"sdui-doc-peek-status",children:"Failed to load this page."}),t.status==="ready"&&e.jsx(b,{content:t.document.content,readOnly:m,onContentChange:c?d=>c(r,d):void 0},r)]})]})]})})};C.__docgenInfo={description:`Notion-style peek: hosts the target document in a dialog as a full,
independent editor instance (drag & drop, slash menu — everything), like an
iframe of another page. Content is refetched on every open (refresh) so
edits made elsewhere show up.`,methods:[],displayName:"SduiPeekDialog",props:{documentId:{required:!0,tsType:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}]},description:"Target document to preview; null renders nothing."},mode:{required:!1,tsType:{name:"union",raw:"'side' | 'center'",elements:[{name:"literal",value:"'side'"},{name:"literal",value:"'center'"}]},description:`Notion peek grammar: 'side' (default) slides a panel in from the right and
keeps the page behind visible; 'center' is a dimmed modal.`,defaultValue:{value:"'side'",computed:!1}},readOnly:{required:!1,tsType:{name:"boolean"},description:"Render the peeked document read-only. Default false — like Notion, the peek is a full editor.",defaultValue:{value:"false",computed:!1}},className:{required:!1,tsType:{name:"string"},description:""}}};const R=({resolver:r,navigator:o,defaultOpenMode:s="push",peekMode:m="side",peekReadOnly:c=!1,onPeekContentChange:p,children:_})=>{const t=a.useRef(new Map),l=a.useRef(new Map),[d,y]=a.useState(null),g=a.useRef(r);g.current=r;const f=a.useRef(o);f.current=o;const k=a.useCallback(async(n,u)=>{const i=t.current.get(n);if(!u?.refresh&&i!==void 0)return i==="missing"?void 0:i;const h=l.current.get(n);if(h)return h;const E=g.current(n).then(O=>(t.current.set(n,O??"missing"),O)).finally(()=>{l.current.delete(n)});return l.current.set(n,E),E},[]),T=a.useCallback(n=>{const u=t.current.get(n);return u==="missing"?void 0:u},[]),v=a.useCallback((n,u=s)=>{const i=f.current;if(u==="push"){i?.push?i.push(n):console.warn("[sdui-document-react] navigator.push is not provided — page push ignored");return}i?.peek?i.peek(n):y(n)},[s]),B=a.useMemo(()=>({resolve:k,peekCache:T,open:v,defaultOpenMode:s}),[k,T,v,s]);return e.jsxs(K.Provider,{value:B,children:[_,o?.peek?null:e.jsx(C,{documentId:d,mode:m,readOnly:c,onContentChange:p,onClose:()=>y(null)})]})};R.__docgenInfo={description:"Headless page-navigation boundary: document resolution (cached), and\npush/peek dispatch to the host navigator. When the host provides no `peek`,\nthe provider renders its own SduiPeekDialog as a fallback.",methods:[],displayName:"SduiPageProvider",props:{resolver:{required:!0,tsType:{name:"signature",type:"function",raw:"(id: string) => Promise<SduiDocument | undefined>",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"Promise",elements:[{name:"union",raw:"SduiDocument | undefined",elements:[{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"push",value:{name:"void",required:!1}},{key:"peek",value:{name:"void",required:!1}}]}},description:""},defaultOpenMode:{required:!1,tsType:{name:"union",raw:"'push' | 'peek'",elements:[{name:"literal",value:"'push'"},{name:"literal",value:"'peek'"}]},description:"What a plain click on a page block does. Default 'push'.",defaultValue:{value:"'push'",computed:!1}},peekMode:{required:!1,tsType:{name:"union",raw:"'side' | 'center'",elements:[{name:"literal",value:"'side'"},{name:"literal",value:"'center'"}]},description:"Presentation of the built-in fallback peek dialog. Default 'side'.",defaultValue:{value:"'side'",computed:!1}},peekReadOnly:{required:!1,tsType:{name:"boolean"},description:"Render the fallback peek read-only. Default false — the peek is a full editor.",defaultValue:{value:"false",computed:!1}},children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};export{R as S};
