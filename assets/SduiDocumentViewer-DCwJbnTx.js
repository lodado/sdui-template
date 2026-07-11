import{j as n}from"./jsx-runtime-DP0j7HmO.js";import{R as d}from"./iframe-Du9bMobq.js";import{j as P,n as O,B as Y,k as g,I as k,m as f,D as c,o as I,p as D}from"./SduiDocumentEditor-BMtSg7s0.js";import{d as L,c as w,f as h,C as S,r as b}from"./marked.esm-Ci4fhsQd.js";function R(e){const{children:r,...o}=e;return o}const v=({block:e,depth:r})=>{const o=e.children??[];if(e.type===L)return n.jsx("div",{"data-block-id":e.id,"data-block-type":e.type,"data-depth":r,"data-column-list":!0,children:o.map(t=>n.jsx(s,{block:t,depth:r},t.id))});const i=P(e.attributes);return n.jsx("div",{"data-block-id":e.id,"data-block-type":e.type,"data-column":!0,style:i!==void 0?{flexGrow:i}:void 0,children:o.map(t=>n.jsx(s,{block:t,depth:r},t.id))})},s=({block:e,depth:r,listOrdinal:o})=>e.type===L||e.type===w?n.jsx(v,{block:e,depth:r}):n.jsx(A,{block:e,depth:r,listOrdinal:o}),A=({block:e,depth:r,listOrdinal:o})=>{const i=e.children??[],t=e.type===h,a=e.type===S,u=e.attributes?.collapsed===!0,[m,E]=d.useState(u);d.useEffect(()=>{t&&E(u)},[t,u]);const T=t&&m,p=t&&!T&&i.length===0,l=R(e),C=t?{...l,attributes:{...l.attributes,collapsed:m}}:l,B=t?(_,K)=>E(K):void 0,y=O(i);return n.jsxs("div",{"data-block-id":e.id,"data-block-type":e.type,"data-depth":r,children:[n.jsx("div",{"data-block-row":!0,children:n.jsx("div",{"data-block-content":!0,"data-align":b(e.attributes?.align),children:n.jsx(Y,{block:C,depth:r,listOrdinal:o,onToggleCollapsed:B,children:g(e)&&n.jsx("span",{className:"sdui-doc-static","data-inline-root":!0,children:n.jsx(k,{content:f(e)})})})})}),i.length>0&&!T&&!a?n.jsx("div",{"data-block-nested":!0,"data-nested-toggle":t||void 0,style:{paddingLeft:c},children:i.map(_=>n.jsx(s,{block:_,depth:r+1,listOrdinal:y.get(_.id)},_.id))}):null,p?n.jsx("div",{"data-block-nested":!0,"data-nested-toggle":!0,style:{paddingLeft:c},children:n.jsx("button",{type:"button",className:"toggle-empty-placeholder",disabled:!0,children:"Empty toggle. Press Enter, click, or drop blocks inside."})}):null]})};s.__docgenInfo={description:"",methods:[],displayName:"ViewerBlockNode",props:{block:{required:!0,tsType:{name:"signature",type:"object",raw:`{
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
| typeof BUTTON_BLOCK_TYPE
| typeof SDUI_BLOCK_TYPE`,elements:[{name:"ROOT_BLOCK_TYPE"},{name:"PARAGRAPH_BLOCK_TYPE"},{name:"HEADING_BLOCK_TYPE"},{name:"BULLETED_LIST_BLOCK_TYPE"},{name:"NUMBERED_LIST_BLOCK_TYPE"},{name:"CHECKLIST_BLOCK_TYPE"},{name:"DIVIDER_BLOCK_TYPE"},{name:"CALLOUT_BLOCK_TYPE"},{name:"IMAGE_BLOCK_TYPE"},{name:"FILE_BLOCK_TYPE"},{name:"LINK_BLOCK_TYPE"},{name:"QUOTE_BLOCK_TYPE"},{name:"TOGGLE_BLOCK_TYPE"},{name:"CODE_BLOCK_TYPE"},{name:"COLUMN_LIST_BLOCK_TYPE"},{name:"COLUMN_BLOCK_TYPE"},{name:"TOC_BLOCK_TYPE"},{name:"PAGE_BLOCK_TYPE"},{name:"COLLECTION_BLOCK_TYPE"},{name:"BOOKMARK_BLOCK_TYPE"},{name:"VIDEO_BLOCK_TYPE"},{name:"EMBED_BLOCK_TYPE"},{name:"TAGS_BLOCK_TYPE"},{name:"BUTTON_BLOCK_TYPE"},{name:"SDUI_BLOCK_TYPE"}]},{name:"unknown"}],required:!0}},{key:"position",value:{name:"string",required:!1},description:"Fractional ordering key among siblings (root block omits this)."},{key:"origin",value:{name:"signature",type:"object",raw:`{
  clientId: string
  opId: string
}`,signature:{properties:[{key:"clientId",value:{name:"string",required:!0}},{key:"opId",value:{name:"string",required:!0}}]},required:!1},description:"Deterministic tie-break when two blocks share the same position key."},{key:"state",value:{name:"Record",elements:[{name:"string"},{name:"unknown"}],raw:"Record<string, unknown>",required:!1}},{key:"attributes",value:{name:"Record",elements:[{name:"string"},{name:"unknown"}],raw:"Record<string, unknown>",required:!1}},{key:"children",value:{name:"Array",elements:[{name:"SduiDocumentBlock"}],raw:"SduiDocumentBlock[]",required:!1}}]}},description:""},depth:{required:!0,tsType:{name:"number"},description:""},listOrdinal:{required:!1,tsType:{name:"number"},description:""}}};const N=({content:e,className:r})=>{const o=d.useRef(null);o.current??=I(e),d.useEffect(()=>{o.current?.setSnapshot(e)},[e]);const i=e.root.children??[],t=O(i);return n.jsx(D,{value:o.current,children:n.jsx("div",{className:r,"data-sdui-document-editor":!0,"data-sdui-document-viewer":!0,children:i.map(a=>n.jsx(s,{block:a,depth:1,listOrdinal:t.get(a.id)},a.id))})})};N.__docgenInfo={description:"Read-only document renderer with visual parity to `SduiDocumentEditor`'s\nreadOnly mode, but with no ProseMirror/dnd-kit in its import graph — import\nit from `@lodado/sdui-document-react/viewer` to keep editor code out of the\nbundle (published pages, SSR).\n\n`data-sdui-document-editor` is load-bearing: every rule in the src/styles\nstylesheets is scoped under it.",methods:[],displayName:"SduiDocumentViewer",props:{content:{required:!0,tsType:{name:"signature",type:"object",raw:`{
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
| typeof BUTTON_BLOCK_TYPE
| typeof SDUI_BLOCK_TYPE`,elements:[{name:"ROOT_BLOCK_TYPE"},{name:"PARAGRAPH_BLOCK_TYPE"},{name:"HEADING_BLOCK_TYPE"},{name:"BULLETED_LIST_BLOCK_TYPE"},{name:"NUMBERED_LIST_BLOCK_TYPE"},{name:"CHECKLIST_BLOCK_TYPE"},{name:"DIVIDER_BLOCK_TYPE"},{name:"CALLOUT_BLOCK_TYPE"},{name:"IMAGE_BLOCK_TYPE"},{name:"FILE_BLOCK_TYPE"},{name:"LINK_BLOCK_TYPE"},{name:"QUOTE_BLOCK_TYPE"},{name:"TOGGLE_BLOCK_TYPE"},{name:"CODE_BLOCK_TYPE"},{name:"COLUMN_LIST_BLOCK_TYPE"},{name:"COLUMN_BLOCK_TYPE"},{name:"TOC_BLOCK_TYPE"},{name:"PAGE_BLOCK_TYPE"},{name:"COLLECTION_BLOCK_TYPE"},{name:"BOOKMARK_BLOCK_TYPE"},{name:"VIDEO_BLOCK_TYPE"},{name:"EMBED_BLOCK_TYPE"},{name:"TAGS_BLOCK_TYPE"},{name:"BUTTON_BLOCK_TYPE"},{name:"SDUI_BLOCK_TYPE"}]},{name:"unknown"}],required:!0}},{key:"position",value:{name:"string",required:!1},description:"Fractional ordering key among siblings (root block omits this)."},{key:"origin",value:{name:"signature",type:"object",raw:`{
  clientId: string
  opId: string
}`,signature:{properties:[{key:"clientId",value:{name:"string",required:!0}},{key:"opId",value:{name:"string",required:!0}}]},required:!1},description:"Deterministic tie-break when two blocks share the same position key."},{key:"state",value:{name:"Record",elements:[{name:"string"},{name:"unknown"}],raw:"Record<string, unknown>",required:!1}},{key:"attributes",value:{name:"Record",elements:[{name:"string"},{name:"unknown"}],raw:"Record<string, unknown>",required:!1}},{key:"children",value:{name:"Array",elements:[{name:"SduiDocumentBlock"}],raw:"SduiDocumentBlock[]",required:!1}}]},required:!0}}]}},description:""},className:{required:!1,tsType:{name:"string"},description:""}}};export{N as S};
