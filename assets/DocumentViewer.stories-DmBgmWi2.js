import{j as e}from"./jsx-runtime-DiXa-lBB.js";import{allBlocksContent as i}from"./AllBlocks.stories-BJeomgN0.js";import{S as d}from"./SduiDocumentViewer-CT1d38gr.js";import{a as n,S as l}from"./SduiDocumentEditor-CgjqnSTA.js";import{S as a}from"./SduiPageProvider-R6z6GX1o.js";import"./iframe-CZ4IIPOh.js";import"./preload-helper-ggYluGXI.js";import"./marked.esm-lzu47DTe.js";import"./schemas-Cci_sPZ2.js";import"./block-CtGQPaNA.js";import"./apply-BaHQGFVK.js";import"./generate-CBS9Nabc.js";import"./index-BaxEpJ4J.js";import"./index-_HwedgUL.js";import"./index-USHisANu.js";import"./documentHistory-DN5HMk3K.js";import"./SduiLayoutRenderer-gV_C9lT7.js";import"./index-DkykxaJC.js";const O={title:"Document/Document Viewer (Read-only)",component:d,parameters:{layout:"padded",docs:{description:{component:"Read-only document renderer from the `@lodado/sdui-document-react/viewer` subpath — zero ProseMirror/dnd-kit in its import graph (≈68% smaller than the editor bundle), SSR-friendly, with DOM parity to `SduiDocumentEditor readOnly`. Use it for published pages; mount the editor only when entering edit mode."}}},tags:["autodocs"]},s=new Map,o={render:()=>e.jsx(n,{value:{allowedHosts:["codepen.io","codesandbox.io"]},children:e.jsx(a,{resolver:async t=>s.get(t),navigator:{push:()=>{}},children:e.jsx("div",{style:{maxWidth:820,margin:"0 auto"},children:e.jsx(d,{content:i})})})})},r={render:()=>e.jsx(n,{value:{allowedHosts:["codepen.io","codesandbox.io"]},children:e.jsx(a,{resolver:async t=>s.get(t),navigator:{push:()=>{}},children:e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24},children:[e.jsxs("section",{"aria-label":"Editor (readOnly)",children:[e.jsx("h4",{style:{margin:"0 0 8px"},children:"SduiDocumentEditor readOnly"}),e.jsx(l,{content:i,readOnly:!0})]}),e.jsxs("section",{"aria-label":"Viewer",children:[e.jsx("h4",{style:{margin:"0 0 8px"},children:"SduiDocumentViewer"}),e.jsx(d,{content:i})]})]})})})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <SduiEmbedConfigProvider value={{
    allowedHosts: ['codepen.io', 'codesandbox.io']
  }}>
      <SduiPageProvider resolver={async docId => vault.get(docId)} navigator={{
      push: () => {}
    }}>
        <div style={{
        maxWidth: 820,
        margin: '0 auto'
      }}>
          <SduiDocumentViewer content={allBlocksContent} />
        </div>
      </SduiPageProvider>
    </SduiEmbedConfigProvider>
}`,...o.parameters?.docs?.source},description:{story:"The full block catalog rendered by the standalone viewer.",...o.parameters?.docs?.description}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <SduiEmbedConfigProvider value={{
    allowedHosts: ['codepen.io', 'codesandbox.io']
  }}>
      <SduiPageProvider resolver={async docId => vault.get(docId)} navigator={{
      push: () => {}
    }}>
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
      </SduiPageProvider>
    </SduiEmbedConfigProvider>
}`,...r.parameters?.docs?.source},description:{story:"Same content through the readOnly editor (left) and the viewer (right) — the DOM must match.",...r.parameters?.docs?.description}}};const k=["AllBlocks","EditorParity"];export{o as AllBlocks,r as EditorParity,k as __namedExportsOrder,O as default};
