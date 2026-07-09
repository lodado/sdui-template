import{j as o}from"./jsx-runtime-CKw7595g.js";import{r as c}from"./iframe-Br0GjfgR.js";import{S as u}from"./SduiDocumentEditor-D46t7_gm.js";function l(e){return"blockId"in e?e.blockId:"block"in e?e.block.id:""}function d(e){const{type:n}=e,t=l(e);return t?`${n}  ${t}`:n}const r=({patches:e})=>e.length===0?o.jsx("pre",{className:"sdui-doc__log",children:"문서를 편집하면 여기에 패치가 순서대로 쌓입니다."}):o.jsx("pre",{className:"sdui-doc__log",children:e.slice(-14).map((n,t)=>`${String(e.length-Math.min(14,e.length)+t+1).padStart(2,"0")}  ${d(n)}`).join(`
`)}),m=({content:e,readOnly:n})=>{const[t,i]=c.useState([]);return o.jsxs("div",{style:{display:"grid",gap:14},children:[o.jsx(u,{content:e,readOnly:n,onContentChange:(_,a)=>i(s=>[...s,...a])}),!n&&o.jsx(r,{patches:t})]})};r.__docgenInfo={description:"",methods:[],displayName:"PatchLog",props:{patches:{required:!0,tsType:{name:"Array",elements:[{name:"intersection",raw:`SduiDocumentPatchBase &
(
  | ({
      type: 'block.insert'
      parentId: SduiDocumentBlockId
      block: SduiDocumentBlock
    } & BlockPlacementAnchor)
  | {
      type: 'block.update'
      blockId: SduiDocumentBlockId
      state?: Record<string, unknown>
      attributes?: Record<string, unknown>
    }
  | {
      type: 'block.delete'
      blockId: SduiDocumentBlockId
    }
  | ({
      type: 'block.move'
      blockId: SduiDocumentBlockId
      parentId: SduiDocumentBlockId
    } & BlockPlacementAnchor)
  | {
      /**
       * Splits a text-bearing block at an inline offset.
       * The original block keeps [0, offset); a new next sibling of the same
       * type receives [offset, length). Children stay on the original block.
       */
      type: 'block.split'
      blockId: SduiDocumentBlockId
      offset: number
      newBlockId: SduiDocumentBlockId
    }
  | {
      /**
       * Merges \`blockId\`'s inline content into the end of \`intoBlockId\`,
       * removes \`blockId\`, and promotes its children to its former position.
       */
      type: 'block.merge'
      blockId: SduiDocumentBlockId
      intoBlockId: SduiDocumentBlockId
    }
  | {
      /**
       * Changes a block's type in place (turn-into). State and children are
       * kept; \`attributes\` REPLACES the whole attribute object — stale
       * attributes of the previous type (e.g. heading \`level\`) must not
       * leak into the new type. Omitting it clears attributes.
       */
      type: 'block.setType'
      blockId: SduiDocumentBlockId
      blockType: SduiDocumentBlock['type']
      attributes?: Record<string, unknown>
    }
  | {
      type: 'document.setTitle'
      title: string
    }
)`,elements:[{name:"signature",type:"object",raw:`{
  expectedVersion?: number
  origin?: BlockOrigin
}`,signature:{properties:[{key:"expectedVersion",value:{name:"number",required:!1}},{key:"origin",value:{name:"signature",type:"object",raw:`{
  clientId: string
  opId: string
}`,signature:{properties:[{key:"clientId",value:{name:"string",required:!0}},{key:"opId",value:{name:"string",required:!0}}]},required:!1}}]}},{name:"unknown"}]}],raw:"SduiDocumentPatch[]"},description:""}}};m.__docgenInfo={description:"Editor wired to a live patch log — the workhorse for most core demos.",methods:[],displayName:"EditorWithPatchLog",props:{content:{required:!0,tsType:{name:"signature",type:"object",raw:`{
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
}`,signature:{properties:[{key:"clientId",value:{name:"string",required:!0}},{key:"opId",value:{name:"string",required:!0}}]},required:!1},description:"Deterministic tie-break when two blocks share the same position key."},{key:"state",value:{name:"Record",elements:[{name:"string"},{name:"unknown"}],raw:"Record<string, unknown>",required:!1}},{key:"attributes",value:{name:"Record",elements:[{name:"string"},{name:"unknown"}],raw:"Record<string, unknown>",required:!1}},{key:"children",value:{name:"Array",elements:[{name:"SduiDocumentBlock"}],raw:"SduiDocumentBlock[]",required:!1}}]},required:!0}}]}},description:""},readOnly:{required:!1,tsType:{name:"boolean"},description:""}}};export{m as E};
