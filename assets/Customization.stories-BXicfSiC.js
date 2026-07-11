import{j as e}from"./jsx-runtime-nMOS41yt.js";import{a as n}from"./nestedDragContent-rvUO8EIk.js";import"./marked.esm-Ci4fhsQd.js";import{S as i}from"./SduiDocumentViewer-DMDbb1al.js";import{a as l}from"./SduiDocumentEditor-Bl7AXmYX.js";import{S as m}from"./SduiPageProvider-rKLOmN03.js";import"./iframe-DK6hgcQ8.js";import"./preload-helper-ggYluGXI.js";import"./block-CtGQPaNA.js";import"./toSduiLayout-ooNGaLo6.js";import"./SduiLayoutRenderer-Cg3V9tL-.js";import"./sduiComponents-BPr8QmK_.js";import"./index-BPDJ27bN.js";import"./index-D3qblGAu.js";import"./index-CuG-EX1F.js";import"./index-Cui2BfwZ.js";import"./schemas-D-ljss90.js";import"./apply-CLR2MSiX.js";import"./generate-CBS9Nabc.js";import"./documentHistory-2lo5fnId.js";const R={title:"Document/Customization",parameters:{layout:"padded",docs:{description:{component:["How to restyle the document editor/viewer. Two mechanisms, both driven by plain CSS:","","1. **Token override** — set `--sdui-doc-*` custom properties to retheme colors, surfaces, radii, shadows, chips, and z-index. Source of truth: `styles/tokens.css`.","2. **Per-block override** — every block wrapper carries `data-block-type` (e.g. `document.callout`). Target it with a plain rule.","","**Import order matters.** Document styles are layered, so a cascade layer loses to any *later-declared* layer. If you use Tailwind or a CSS reset, import the document CSS **after** it — otherwise Preflight (`@layer base`) flattens headings, lists, and margins:","","```tsx","import 'tailwindcss'                                  // or your reset / globals","import '@lodado/sdui-document-react/styles/index.css' // MUST come after","```","","**Entry points:**","","| Import | Contents |","| --- | --- |","| `…/styles/index.css` | Full editor (viewer + editing chrome) |","| `…/styles/viewer.css` | Read-only viewer (no drag handles/toolbars) |","| `…/styles/tokens.css` | CSS variables only (`--sdui-doc-*`) |","| `…/styles/base.css` | Block layout scaffolding |","| `…/styles/blocks/*.css` | Per-block-group styles |","| `…/styles/chrome.css` | Editor-only UI (handles, toolbars) |","| `…/styles/print.css` | A4 print/PDF rules |","","Layer order: `sdui-doc.tokens → base → blocks → chrome → print`."].join(`
`)}}},tags:["autodocs"]},p=new Map,c=({children:a})=>e.jsx(l,{value:{allowedHosts:["codepen.io","codesandbox.io"]},children:e.jsx(m,{resolver:async o=>p.get(o),navigator:{push:()=>{}},children:a})}),d=({scope:a,css:o})=>e.jsxs("div",{children:[e.jsx("style",{children:o}),e.jsx("pre",{style:{background:"#0f0f10",color:"#e6e6e6",padding:"12px 14px",borderRadius:8,fontSize:12,lineHeight:1.55,overflowX:"auto",margin:"0 0 16px"},children:e.jsx("code",{children:o.trim()})}),e.jsx("div",{className:a,style:{maxWidth:820},children:e.jsx(c,{children:e.jsx(i,{content:n})})})]}),s={name:"0. Baseline (no overrides)",render:()=>e.jsx("div",{style:{maxWidth:820},children:e.jsx(c,{children:e.jsx(i,{content:n})})}),parameters:{docs:{description:{story:"The default look, for comparison with the customized stories below."}}}},u=`/* Retheme via tokens — set --sdui-doc-* on any wrapper (here .theme-grape).
   Use :root for app-wide, [data-theme='dark'] per theme, or a class per instance. */
.theme-grape {
  --sdui-doc-accent: #7c3aed;
  --sdui-doc-accent-strong: #6d28d9;
  --sdui-doc-accent-wash: rgba(124, 58, 237, 0.12);
  --sdui-doc-radius-card: 4px;
  --sdui-doc-chip-blue-bg: rgba(124, 58, 237, 0.16);
  --sdui-doc-chip-blue-text: #6d28d9;
}`,r={name:"1. Token override (retheme)",render:()=>e.jsx(d,{scope:"theme-grape",css:u}),parameters:{docs:{description:{story:"No selectors touched — only CSS variables. Because token definitions live in `@layer sdui-doc.tokens`, an unlayered `.theme-grape { --sdui-doc-* }` wins. See `styles/tokens.css` for the full token surface (colors, surfaces, borders, shadows, radii, chip palette, z-index)."}}}},h=`/* Restyle ONE block type. Wrappers carry data-block-type; because package
   rules are layered, a plain unlayered rule beats them without !important. */
.custom-callout [data-block-type='document.callout'] .notice-block {
  border: none;
  border-left: 3px solid var(--sdui-doc-accent, #4c6ef5);
  border-radius: 0;
  background: transparent;
  padding-left: 14px;
}`,t={name:"2. Per-block override",render:()=>e.jsx(d,{scope:"custom-callout",css:h}),parameters:{docs:{description:{story:"Callouts become a flat left-border accent while every other block keeps its default style. `data-block-type` values match the `document.*` type ids — see **Document/Catalog** for the full list."}}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: '0. Baseline (no overrides)',
  render: () => <div style={{
    maxWidth: 820
  }}>
      <Shell>
        <SduiDocumentViewer content={allBlocksContent} />
      </Shell>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'The default look, for comparison with the customized stories below.'
      }
    }
  }
}`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: '1. Token override (retheme)',
  render: () => <CustomizedDemo scope="theme-grape" css={TOKEN_CSS} />,
  parameters: {
    docs: {
      description: {
        story: 'No selectors touched — only CSS variables. Because token definitions live in ' + '\`@layer sdui-doc.tokens\`, an unlayered \`.theme-grape { --sdui-doc-* }\` wins. See ' + '\`styles/tokens.css\` for the full token surface (colors, surfaces, borders, shadows, ' + 'radii, chip palette, z-index).'
      }
    }
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: '2. Per-block override',
  render: () => <CustomizedDemo scope="custom-callout" css={BLOCK_CSS} />,
  parameters: {
    docs: {
      description: {
        story: 'Callouts become a flat left-border accent while every other block keeps its default ' + 'style. \`data-block-type\` values match the \`document.*\` type ids — see **Document/Catalog** ' + 'for the full list.'
      }
    }
  }
}`,...t.parameters?.docs?.source}}};const I=["Baseline","TokenTheme","PerBlock"];export{s as Baseline,t as PerBlock,r as TokenTheme,I as __namedExportsOrder,R as default};
