import{j as n}from"./jsx-runtime-D49rcD3I.js";import"./marked.esm-EAW_3-AJ.js";import{t as _}from"./toSduiLayout-D-oBgYlR.js";import{r as a}from"./iframe-D0kPy9LB.js";import{S as y}from"./SduiDocumentEditor-BBg5DMGR.js";import{S as E}from"./SduiLayoutStateInspector-DpPKU1UO.js";function g(e){return"blockId"in e?e.blockId:"block"in e?e.block.id:""}function L(e){const{type:t}=e,r=g(e);return r?`${t}  ${r}`:t}const T=({patches:e})=>e.length===0?n.jsx("pre",{className:"sdui-doc__log",children:"문서를 편집하면 여기에 패치가 순서대로 쌓입니다."}):n.jsx("pre",{className:"sdui-doc__log",children:e.slice(-10).map((t,r)=>`${String(e.length-Math.min(10,e.length)+r+1).padStart(2,"0")}  ${L(t)}`).join(`
`)}),C=({content:e})=>n.jsxs("section",{"aria-label":"SduiDocumentContent",style:{display:"grid",gap:8},children:[n.jsx("strong",{style:{fontSize:13},children:"Domain · SduiDocumentContent"}),n.jsx("pre",{style:{margin:0,padding:12,borderRadius:8,border:"1px solid #cbd5e1",background:"#fff7ed",color:"#0f172a",overflow:"auto",maxHeight:280,fontSize:12,lineHeight:1.45,whiteSpace:"pre-wrap",wordBreak:"break-word"},children:JSON.stringify(e,null,2)})]}),O=({content:e,readOnly:t,documentId:r="storybook-doc",title:o="Editor → SDUI layout state"})=>{const[i,s]=a.useState(e),[u,d]=a.useState([]),l=a.useMemo(()=>_(i,{documentId:r,title:o}),[i,r,o]);return n.jsxs("div",{style:{display:"grid",gap:16,gridTemplateColumns:"minmax(0, 1.1fr) minmax(0, 0.9fr)",alignItems:"start"},children:[n.jsxs("div",{style:{display:"grid",gap:12},children:[n.jsx(y,{content:e,readOnly:t,onContentChange:(m,c)=>{s(m),d(p=>[...p,...c])}}),!t&&n.jsx(T,{patches:u})]}),n.jsxs("div",{style:{display:"grid",gap:12},children:[n.jsx(C,{content:i}),n.jsx(E,{document:l,title:o,maxHeight:420})]})]})};O.__docgenInfo={description:`SduiDocumentEditor + live domain/layout JSON panels for Storybook debugging.
Each edit updates SduiDocumentContent, then lowers it through toSduiLayoutDocument
for the sdui-template state inspector.`,methods:[],displayName:"EditorWithStateInspector",props:{content:{required:!0,tsType:{name:"signature",type:"object",raw:`{
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
| typeof TOC_BLOCK_TYPE`,elements:[{name:"ROOT_BLOCK_TYPE"},{name:"PARAGRAPH_BLOCK_TYPE"},{name:"HEADING_BLOCK_TYPE"},{name:"BULLETED_LIST_BLOCK_TYPE"},{name:"NUMBERED_LIST_BLOCK_TYPE"},{name:"CHECKLIST_BLOCK_TYPE"},{name:"DIVIDER_BLOCK_TYPE"},{name:"CALLOUT_BLOCK_TYPE"},{name:"IMAGE_BLOCK_TYPE"},{name:"FILE_BLOCK_TYPE"},{name:"LINK_BLOCK_TYPE"},{name:"QUOTE_BLOCK_TYPE"},{name:"TOGGLE_BLOCK_TYPE"},{name:"CODE_BLOCK_TYPE"},{name:"COLUMN_LIST_BLOCK_TYPE"},{name:"COLUMN_BLOCK_TYPE"},{name:"TOC_BLOCK_TYPE"}]},{name:"unknown"}],required:!0}},{key:"position",value:{name:"string",required:!1},description:"Fractional ordering key among siblings (root block omits this)."},{key:"origin",value:{name:"signature",type:"object",raw:`{
  clientId: string
  opId: string
}`,signature:{properties:[{key:"clientId",value:{name:"string",required:!0}},{key:"opId",value:{name:"string",required:!0}}]},required:!1},description:"Deterministic tie-break when two blocks share the same position key."},{key:"state",value:{name:"Record",elements:[{name:"string"},{name:"unknown"}],raw:"Record<string, unknown>",required:!1}},{key:"attributes",value:{name:"Record",elements:[{name:"string"},{name:"unknown"}],raw:"Record<string, unknown>",required:!1}},{key:"children",value:{name:"Array",elements:[{name:"SduiDocumentBlock"}],raw:"SduiDocumentBlock[]",required:!1}}]},required:!0}}]}},description:""},readOnly:{required:!1,tsType:{name:"boolean"},description:""},documentId:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'storybook-doc'",computed:!1}},title:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Editor → SDUI layout state'",computed:!1}}}};export{O as E};
