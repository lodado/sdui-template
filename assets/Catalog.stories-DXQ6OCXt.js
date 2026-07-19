import{j as e}from"./jsx-runtime-C8ciXbTX.js";import{a as r}from"./nestedDragContent-DBk-tst0.js";import"./marked.esm-CEb0ui0X.js";import{S as l,a as m}from"./SduiDocumentEditor-DEAbgBzr.js";import{S as d,a as u}from"./SduiPageProvider-_SE5AL9r.js";import"./iframe-BRtNCAqL.js";import"./preload-helper-ggYluGXI.js";import"./block-CtGQPaNA.js";import"./toSduiLayout-DQvzG4Yh.js";import"./SduiLayoutRenderer-DA4-ne6Z.js";import"./sduiComponents-DYjHDyOz.js";import"./index-8QG6HgI2.js";import"./index-YxL2SS1X.js";import"./index-CRYuw-kS.js";import"./index-BmSe0qYn.js";import"./index-0D-cfp0j.js";import"./Button-BtIotH1t.js";import"./schemas-BKIZ752n.js";import"./apply-vgUm-Yiu.js";import"./generate-CBS9Nabc.js";import"./documentHistory-CAg6iL5B.js";const N={title:"Document/Catalog",parameters:{layout:"padded",docs:{description:{component:"Canonical catalog of every built-in `document.*` block — the same JSON the server would send. Use the **Editor (readOnly)** story for the full editor bundle, **Viewer** for the lightweight read-only subpath (~68% smaller), and **Editor ↔ Viewer Parity** to confirm DOM parity. Embed blocks need `SduiEmbedConfigProvider`; page/collection cards resolve through `SduiPageProvider`."}}},tags:["autodocs"]},p=new Map,n=({children:s})=>e.jsx(m,{value:{allowedHosts:["codepen.io","codesandbox.io"]},children:e.jsx(u,{resolver:async c=>p.get(c),navigator:{push:()=>{}},children:e.jsx("div",{style:{maxWidth:820,margin:"0 auto"},children:s})})}),t={name:"All Blocks (Editor, readOnly)",render:()=>e.jsx(n,{children:e.jsx(l,{content:r,readOnly:!0})}),parameters:{docs:{description:{story:"Full block catalog through `SduiDocumentEditor readOnly`. For editable inline marks and the formatting toolbar, use **Document/Editor → Getting Started** or edit this document by removing `readOnly`."}}}},o={name:"All Blocks (Viewer)",render:()=>e.jsx(n,{children:e.jsx(d,{content:r})}),parameters:{docs:{description:{story:"Same catalog through `@lodado/sdui-document-react/viewer` — zero ProseMirror/dnd-kit in the import graph. Mount the editor only when the user enters edit mode."}}}},i={name:"Editor ↔ Viewer Parity",render:()=>e.jsx(n,{children:e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24},children:[e.jsxs("section",{"aria-label":"Editor (readOnly)",children:[e.jsx("h4",{style:{margin:"0 0 8px"},children:"SduiDocumentEditor readOnly"}),e.jsx(l,{content:r,readOnly:!0})]}),e.jsxs("section",{"aria-label":"Viewer",children:[e.jsx("h4",{style:{margin:"0 0 8px"},children:"SduiDocumentViewer"}),e.jsx(d,{content:r})]})]})}),parameters:{docs:{description:{story:"Side-by-side DOM parity check — published pages should match what the readOnly editor renders."}}}},a={name:"All Blocks (Editor, editable)",render:()=>e.jsx(n,{children:e.jsx(l,{content:r})}),parameters:{docs:{description:{story:"Full catalog in edit mode — click any text block to mount ProseMirror, drag-select for the formatting toolbar, toggle checklists (emits `block.update`). Non-text blocks (divider/image/file/link/embed) never mount ProseMirror."}}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: 'All Blocks (Editor, readOnly)',
  render: () => <CatalogShell>
      <SduiDocumentEditor content={allBlocksContent} readOnly />
    </CatalogShell>,
  parameters: {
    docs: {
      description: {
        story: 'Full block catalog through \`SduiDocumentEditor readOnly\`. For editable inline marks and the formatting ' + 'toolbar, use **Document/Editor → Getting Started** or edit this document by removing \`readOnly\`.'
      }
    }
  }
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: 'All Blocks (Viewer)',
  render: () => <CatalogShell>
      <SduiDocumentViewer content={allBlocksContent} />
    </CatalogShell>,
  parameters: {
    docs: {
      description: {
        story: 'Same catalog through \`@lodado/sdui-document-react/viewer\` — zero ProseMirror/dnd-kit in the import graph. ' + 'Mount the editor only when the user enters edit mode.'
      }
    }
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: 'Editor ↔ Viewer Parity',
  render: () => <CatalogShell>
      <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }}>
        <section aria-label="Editor (readOnly)">
          <h4 style={{
          margin: '0 0 8px'
        }}>SduiDocumentEditor readOnly</h4>
          <SduiDocumentEditor content={allBlocksContent} readOnly />
        </section>
        <section aria-label="Viewer">
          <h4 style={{
          margin: '0 0 8px'
        }}>SduiDocumentViewer</h4>
          <SduiDocumentViewer content={allBlocksContent} />
        </section>
      </div>
    </CatalogShell>,
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side DOM parity check — published pages should match what the readOnly editor renders.'
      }
    }
  }
}`,...i.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: 'All Blocks (Editor, editable)',
  render: () => <CatalogShell>
      <SduiDocumentEditor content={allBlocksContent} />
    </CatalogShell>,
  parameters: {
    docs: {
      description: {
        story: 'Full catalog in edit mode — click any text block to mount ProseMirror, drag-select for the formatting ' + 'toolbar, toggle checklists (emits \`block.update\`). Non-text blocks (divider/image/file/link/embed) never ' + 'mount ProseMirror.'
      }
    }
  }
}`,...a.parameters?.docs?.source}}};const z=["AllBlocksEditor","AllBlocksViewer","EditorViewerParity","AllBlocksEditable"];export{a as AllBlocksEditable,t as AllBlocksEditor,o as AllBlocksViewer,i as EditorViewerParity,z as __namedExportsOrder,N as default};
