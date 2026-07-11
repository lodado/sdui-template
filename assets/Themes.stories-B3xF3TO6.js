import{j as e}from"./jsx-runtime-nMOS41yt.js";import{a as t}from"./nestedDragContent-rvUO8EIk.js";import"./marked.esm-Ci4fhsQd.js";import{S as l}from"./SduiDocumentViewer-DMDbb1al.js";import{S as a,a as c}from"./SduiDocumentEditor-Bl7AXmYX.js";import{S as h}from"./SduiPageProvider-rKLOmN03.js";import"./iframe-DK6hgcQ8.js";import"./preload-helper-ggYluGXI.js";import"./block-CtGQPaNA.js";import"./toSduiLayout-ooNGaLo6.js";import"./SduiLayoutRenderer-Cg3V9tL-.js";import"./sduiComponents-BPr8QmK_.js";import"./index-BPDJ27bN.js";import"./index-D3qblGAu.js";import"./index-CuG-EX1F.js";import"./index-Cui2BfwZ.js";import"./schemas-D-ljss90.js";import"./apply-CLR2MSiX.js";import"./generate-CBS9Nabc.js";import"./documentHistory-2lo5fnId.js";const V={title:"Document/Themes",parameters:{layout:"padded",docs:{description:{component:'Theme system for the document editor/viewer. The `theme` prop renders `data-sdui-doc-theme` on the root; theme CSS lives in the `sdui-doc.themes` cascade layer, so it beats the base styles without `!important` while unlayered consumer CSS still wins. **Swiss** (print-editorial, near black & white) is the default — pass `theme="notion"` for the original Notion-like look.'}}},tags:["autodocs"]},p=new Map,i=({children:d})=>e.jsx(c,{value:{allowedHosts:["codepen.io","codesandbox.io"]},children:e.jsx(h,{resolver:async m=>p.get(m),navigator:{push:()=>{}},children:e.jsx("div",{style:{maxWidth:820,margin:"0 auto"},children:d})})}),o={name:"Swiss (default)",render:()=>e.jsx(i,{children:e.jsx(a,{content:t,readOnly:!0})}),parameters:{docs:{description:{story:'Every built-in block under the default **Swiss** theme — uppercase section labels on 2px rules, ink-on-paper palette, hairline dividers, mono outline chips, square corners, black selection chrome. Light-only by design: the theme pins its own ink/paper values even under `[data-theme="dark"]`.'}}}},s={name:"Swiss (editable chrome)",render:()=>e.jsx(i,{children:e.jsx(a,{content:t})}),parameters:{docs:{description:{story:"Edit mode under Swiss — selection toolbar, slash menu, drag handles, and popovers pick up the monochrome pass (hairline ink ring instead of soft shadows, black active states)."}}}},n={name:'Notion (theme="notion")',render:()=>e.jsx(i,{children:e.jsx(a,{content:t,readOnly:!0,theme:"notion"})}),parameters:{docs:{description:{story:"The base Notion-like look, kept as an opt-out: any `theme` value without a matching `data-sdui-doc-theme` stylesheet falls through to the base styles."}}}},r={name:"Swiss ↔ Notion",render:()=>e.jsx(i,{children:e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24},children:[e.jsxs("section",{"aria-label":"Swiss theme",children:[e.jsx("h4",{style:{margin:"0 0 8px"},children:'theme="swiss" (default)'}),e.jsx(l,{content:t})]}),e.jsxs("section",{"aria-label":"Notion theme",children:[e.jsx("h4",{style:{margin:"0 0 8px"},children:'theme="notion"'}),e.jsx(l,{content:t,theme:"notion"})]})]})}),parameters:{docs:{description:{story:"Same document, both themes — the visual-regression surface for theme work."}}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: 'Swiss (default)',
  render: () => <ThemeShell>
      <SduiDocumentEditor content={allBlocksContent} readOnly />
    </ThemeShell>,
  parameters: {
    docs: {
      description: {
        story: 'Every built-in block under the default **Swiss** theme — uppercase section labels on 2px rules, ' + 'ink-on-paper palette, hairline dividers, mono outline chips, square corners, black selection chrome. ' + 'Light-only by design: the theme pins its own ink/paper values even under \`[data-theme="dark"]\`.'
      }
    }
  }
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: 'Swiss (editable chrome)',
  render: () => <ThemeShell>
      <SduiDocumentEditor content={allBlocksContent} />
    </ThemeShell>,
  parameters: {
    docs: {
      description: {
        story: 'Edit mode under Swiss — selection toolbar, slash menu, drag handles, and popovers pick up the ' + 'monochrome pass (hairline ink ring instead of soft shadows, black active states).'
      }
    }
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: 'Notion (theme="notion")',
  render: () => <ThemeShell>
      <SduiDocumentEditor content={allBlocksContent} readOnly theme="notion" />
    </ThemeShell>,
  parameters: {
    docs: {
      description: {
        story: 'The base Notion-like look, kept as an opt-out: any \`theme\` value without a matching ' + '\`data-sdui-doc-theme\` stylesheet falls through to the base styles.'
      }
    }
  }
}`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: 'Swiss ↔ Notion',
  render: () => <ThemeShell>
      <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }}>
        <section aria-label="Swiss theme">
          <h4 style={{
          margin: '0 0 8px'
        }}>theme=&quot;swiss&quot; (default)</h4>
          <SduiDocumentViewer content={allBlocksContent} />
        </section>
        <section aria-label="Notion theme">
          <h4 style={{
          margin: '0 0 8px'
        }}>theme=&quot;notion&quot;</h4>
          <SduiDocumentViewer content={allBlocksContent} theme="notion" />
        </section>
      </div>
    </ThemeShell>,
  parameters: {
    docs: {
      description: {
        story: 'Same document, both themes — the visual-regression surface for theme work.'
      }
    }
  }
}`,...r.parameters?.docs?.source}}};const L=["Swiss","SwissEditable","NotionOptOut","SideBySide"];export{n as NotionOptOut,r as SideBySide,o as Swiss,s as SwissEditable,L as __namedExportsOrder,V as default};
