import{j as e}from"./jsx-runtime-C8ciXbTX.js";import{a as n}from"./nestedDragContent-DBk-tst0.js";import"./marked.esm-CEb0ui0X.js";import{S as i,a as l}from"./SduiPageProvider-_SE5AL9r.js";import{a as m}from"./SduiDocumentEditor-DEAbgBzr.js";import"./iframe-BRtNCAqL.js";import"./preload-helper-ggYluGXI.js";import"./block-CtGQPaNA.js";import"./toSduiLayout-DQvzG4Yh.js";import"./SduiLayoutRenderer-DA4-ne6Z.js";import"./sduiComponents-DYjHDyOz.js";import"./index-8QG6HgI2.js";import"./index-YxL2SS1X.js";import"./index-CRYuw-kS.js";import"./index-BmSe0qYn.js";import"./index-0D-cfp0j.js";import"./Button-BtIotH1t.js";import"./schemas-BKIZ752n.js";import"./apply-vgUm-Yiu.js";import"./generate-CBS9Nabc.js";import"./documentHistory-CAg6iL5B.js";const I={title:"Document/Customization",parameters:{layout:"padded",docs:{description:{component:["How to restyle the document editor/viewer. Two mechanisms, both driven by plain CSS:","","1. **Token override** — set `--sdui-doc-*` custom properties to retheme colors, surfaces, radii, shadows, chips, and z-index. Source of truth: `styles/tokens.css`.","2. **Per-block override** — every block wrapper carries `data-block-type` (e.g. `document.callout`). Target it with a plain rule.","","**Import order matters.** Document styles are layered, so a cascade layer loses to any *later-declared* layer. If you use Tailwind or a CSS reset, import the document CSS **after** it — otherwise Preflight (`@layer base`) flattens headings, lists, and margins:","","```tsx","import 'tailwindcss'                                  // or your reset / globals","import '@lodado/sdui-document-react/styles/index.css' // MUST come after","```","","**Entry points:**","","| Import | Contents |","| --- | --- |","| `…/styles/index.css` | Full editor (viewer + editing chrome) |","| `…/styles/viewer.css` | Read-only viewer (no drag handles/toolbars) |","| `…/styles/tokens.css` | CSS variables only (`--sdui-doc-*`) |","| `…/styles/base.css` | Block layout scaffolding |","| `…/styles/blocks/*.css` | Per-block-group styles |","| `…/styles/chrome.css` | Editor-only UI (handles, toolbars) |","| `…/styles/themes/swiss.css` | Swiss theme (included in index.css/viewer.css) |","| `…/styles/print.css` | A4 print/PDF rules |","","Layer order: `sdui-doc.tokens → base → blocks → chrome → themes → print`.","","For full-document presets (Swiss default, custom themes), see **Document/Themes**."].join(`
`)}}},tags:["autodocs"]},p=new Map,c=({children:a})=>e.jsx(m,{value:{allowedHosts:["codepen.io","codesandbox.io"]},children:e.jsx(l,{resolver:async s=>p.get(s),navigator:{push:()=>{}},children:a})}),d=({scope:a,css:s})=>e.jsxs("div",{children:[e.jsx("style",{children:s}),e.jsx("pre",{style:{background:"#0f0f10",color:"#e6e6e6",padding:"12px 14px",borderRadius:8,fontSize:12,lineHeight:1.55,overflowX:"auto",margin:"0 0 16px"},children:e.jsx("code",{children:s.trim()})}),e.jsx("div",{className:a,style:{maxWidth:820},children:e.jsx(c,{children:e.jsx(i,{content:n})})})]}),o={name:"0. Baseline (no overrides)",render:()=>e.jsx("div",{style:{maxWidth:820},children:e.jsx(c,{children:e.jsx(i,{content:n})})}),parameters:{docs:{description:{story:"The default look, for comparison with the customized stories below."}}}},u=`/* Retheme via tokens — set --sdui-doc-* on any wrapper (here .theme-grape).
   Use :root for app-wide, [data-theme='dark'] per theme, or a class per instance. */
.theme-grape {
  --sdui-doc-accent: #7c3aed;
  --sdui-doc-accent-strong: #6d28d9;
  --sdui-doc-accent-wash: rgba(124, 58, 237, 0.12);
  --sdui-doc-radius-card: 4px;
  --sdui-doc-chip-blue-bg: rgba(124, 58, 237, 0.16);
  --sdui-doc-chip-blue-text: #6d28d9;
}`,t={name:"1. Token override (retheme)",render:()=>e.jsx(d,{scope:"theme-grape",css:u}),parameters:{docs:{description:{story:"No selectors touched — only CSS variables. Because token definitions live in `@layer sdui-doc.tokens`, an unlayered `.theme-grape { --sdui-doc-* }` wins. See `styles/tokens.css` for the full token surface (colors, surfaces, borders, shadows, radii, chip palette, z-index)."}}}},h=`/* Restyle ONE block type. Wrappers carry data-block-type; because package
   rules are layered, a plain unlayered rule beats them without !important. */
.custom-callout [data-block-type='document.callout'] .notice-block {
  border: none;
  border-left: 3px solid var(--sdui-doc-accent, #4c6ef5);
  border-radius: 0;
  background: transparent;
  padding-left: 14px;
}`,r={name:"2. Per-block override",render:()=>e.jsx(d,{scope:"custom-callout",css:h}),parameters:{docs:{description:{story:"Callouts become a flat left-border accent while every other block keeps its default style. `data-block-type` values match the `document.*` type ids — see **Document/Catalog** for the full list."}}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: '1. Token override (retheme)',
  render: () => <CustomizedDemo scope="theme-grape" css={TOKEN_CSS} />,
  parameters: {
    docs: {
      description: {
        story: 'No selectors touched — only CSS variables. Because token definitions live in ' + '\`@layer sdui-doc.tokens\`, an unlayered \`.theme-grape { --sdui-doc-* }\` wins. See ' + '\`styles/tokens.css\` for the full token surface (colors, surfaces, borders, shadows, ' + 'radii, chip palette, z-index).'
      }
    }
  }
}`,...t.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: '2. Per-block override',
  render: () => <CustomizedDemo scope="custom-callout" css={BLOCK_CSS} />,
  parameters: {
    docs: {
      description: {
        story: 'Callouts become a flat left-border accent while every other block keeps its default ' + 'style. \`data-block-type\` values match the \`document.*\` type ids — see **Document/Catalog** ' + 'for the full list.'
      }
    }
  }
}`,...r.parameters?.docs?.source}}};const K=["Baseline","TokenTheme","PerBlock"];export{o as Baseline,r as PerBlock,t as TokenTheme,K as __namedExportsOrder,I as default};
