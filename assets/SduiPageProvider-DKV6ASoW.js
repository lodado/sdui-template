import{j as e}from"./jsx-runtime-ZPtVcyk_.js";import{r}from"./iframe-vZiTqZKk.js";import{u as L,b as f,a as B,c as h}from"./SduiDocumentEditor-BvFIT-Su.js";import{R as P,P as b,O as K,C as w,a as I,T as Y}from"./index-U3DYVwQh.js";const O=({documentId:i,onClose:s,className:o})=>{const l=L(),t=f(i,{refresh:!0});if(i===null)return null;const d=()=>{l?.open(i,"push"),s()};return e.jsx(P,{open:!0,onOpenChange:c=>c?void 0:s(),children:e.jsxs(b,{children:[e.jsx(K,{className:"sdui-doc-peek-overlay"}),e.jsxs(w,{className:o??"sdui-doc-peek-content","aria-describedby":void 0,children:[e.jsxs("div",{className:"sdui-doc-peek-toolbar",children:[e.jsx("button",{type:"button",className:"sdui-doc-peek-open-full",onClick:d,children:"Open as full page"}),e.jsx(I,{asChild:!0,children:e.jsx("button",{type:"button",className:"sdui-doc-peek-close","aria-label":"Close preview",children:"✕"})})]}),e.jsx(Y,{className:"sdui-doc-peek-title",children:t.status==="ready"?t.document.title:"Preview"}),e.jsxs("div",{className:"sdui-doc-peek-body",children:[t.status==="loading"&&e.jsx("p",{className:"sdui-doc-peek-status",children:"Loading…"}),t.status==="missing"&&e.jsx("p",{className:"sdui-doc-peek-status",children:"Page not found."}),t.status==="error"&&e.jsx("p",{className:"sdui-doc-peek-status",children:"Failed to load this page."}),t.status==="ready"&&e.jsx(B,{content:t.document.content,readOnly:!0},i)]})]})]})})};O.__docgenInfo={description:`Notion-style side peek: previews the target document read-only in a dialog.
Content is refetched on every open (refresh) so edits made elsewhere show up.`,methods:[],displayName:"SduiPeekDialog",props:{documentId:{required:!0,tsType:{name:"union",raw:"string | null",elements:[{name:"string"},{name:"null"}]},description:"Target document to preview; null renders nothing."},className:{required:!1,tsType:{name:"string"},description:""}}};const D=({resolver:i,navigator:s,defaultOpenMode:o="push",children:l})=>{const t=r.useRef(new Map),d=r.useRef(new Map),[c,m]=r.useState(null),p=r.useRef(i);p.current=i;const _=r.useRef(s);_.current=s;const y=r.useCallback(async(n,u)=>{const a=t.current.get(n);if(!u?.refresh&&a!==void 0)return a==="missing"?void 0:a;const T=d.current.get(n);if(T)return T;const v=p.current(n).then(E=>(t.current.set(n,E??"missing"),E)).finally(()=>{d.current.delete(n)});return d.current.set(n,v),v},[]),g=r.useCallback(n=>{const u=t.current.get(n);return u==="missing"?void 0:u},[]),k=r.useCallback((n,u=o)=>{const a=_.current;if(u==="push"){a?.push?a.push(n):console.warn("[sdui-document-react] navigator.push is not provided — page push ignored");return}a?.peek?a.peek(n):m(n)},[o]),C=r.useMemo(()=>({resolve:y,peekCache:g,open:k,defaultOpenMode:o}),[y,g,k,o]);return e.jsxs(h.Provider,{value:C,children:[l,s?.peek?null:e.jsx(O,{documentId:c,onClose:()=>m(null)})]})};D.__docgenInfo={description:"Headless page-navigation boundary: document resolution (cached), and\npush/peek dispatch to the host navigator. When the host provides no `peek`,\nthe provider renders its own SduiPeekDialog as a fallback.",methods:[],displayName:"SduiPageProvider",props:{resolver:{required:!0,tsType:{name:"signature",type:"function",raw:"(id: string) => Promise<SduiDocument | undefined>",signature:{arguments:[{type:{name:"string"},name:"id"}],return:{name:"Promise",elements:[{name:"union",raw:"SduiDocument | undefined",elements:[{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"push",value:{name:"void",required:!1}},{key:"peek",value:{name:"void",required:!1}}]}},description:""},defaultOpenMode:{required:!1,tsType:{name:"union",raw:"'push' | 'peek'",elements:[{name:"literal",value:"'push'"},{name:"literal",value:"'peek'"}]},description:"What a plain click on a page block does. Default 'push'.",defaultValue:{value:"'push'",computed:!1}},children:{required:!0,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""}}};export{D as S};
