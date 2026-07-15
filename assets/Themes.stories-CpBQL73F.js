import{j as e}from"./jsx-runtime-CZLhImQn.js";import{a as t}from"./nestedDragContent-BttFxho3.js";import"./marked.esm-CEb0ui0X.js";import{S as o,a as w}from"./SduiPageProvider-CrMdcq33.js";import{S as u,a as S}from"./SduiDocumentEditor-DSUbiD1e.js";import"./iframe-B8KYAuVr.js";import"./preload-helper-ggYluGXI.js";import"./block-CtGQPaNA.js";import"./toSduiLayout-DQvzG4Yh.js";import"./SduiLayoutRenderer-CJW1mZI8.js";import"./sduiComponents-B-2yCxvD.js";import"./index-DsyjPEvF.js";import"./index-DIjnaTkK.js";import"./index-BkkYwL6C.js";import"./index-Cmn6teYt.js";import"./schemas-BKIZ752n.js";import"./apply-vgUm-Yiu.js";import"./generate-CBS9Nabc.js";import"./documentHistory-CAg6iL5B.js";const U={title:"Document/Themes",parameters:{layout:"padded",docs:{description:{component:["# CSS theme system","","Document themes restyle **every block type and the editor chrome** under a single name.","Use them when you want a cohesive look (Swiss print-editorial, Notion-like base, or your own brand)","instead of hand-picking token overrides per block (see **Document/Customization** for that workflow).","","---","","## Quick start","","```tsx","import '@lodado/sdui-document-react/styles/index.css' // includes Swiss by default","import { SduiDocumentEditor } from '@lodado/sdui-document-react'","","// Swiss is the default — no prop needed","<SduiDocumentEditor content={content} onContentChange={setContent} />","","// Opt out to the original Notion-like base styles",'<SduiDocumentEditor content={content} onContentChange={setContent} theme="notion" />',"```","","Read-only pages can import the slimmer bundle and the viewer entrypoint:","","```tsx","import '@lodado/sdui-document-react/styles/viewer.css'","import { SduiDocumentViewer } from '@lodado/sdui-document-react/viewer'","",'<SduiDocumentViewer content={content} theme="swiss" />',"```","","---","","## `theme` prop → `data-sdui-doc-theme`","","Both `SduiDocumentEditor` and `SduiDocumentViewer` accept `theme?: string`.","The value is rendered as **`data-sdui-doc-theme`** on the root element that also carries","`[data-sdui-document-editor]` — every package stylesheet is scoped under that attribute.","","| Prop | Default | Effect |","| --- | --- | --- |","| *(omit)* | `swiss` | Applies the Swiss theme stylesheet |",'| `theme="swiss"` | — | Same as default |','| `theme="notion"` | — | Opt-out: no matching theme rules → base Notion-like look |','| `theme="your-name"` | — | Activates `[data-sdui-doc-theme="your-name"]` rules you ship |',"","There is **no runtime CSS loader** — you import the theme file yourself (tree-shakeable).",'Passing `theme="ocean"` without importing an `ocean.css` simply falls through to the base styles,','same as `theme="notion"`.',"","---","","## Built-in themes","","### Swiss (`swiss`) — default","","- **Import:** included in `styles/index.css` and `styles/viewer.css`; standalone:","  `@lodado/sdui-document-react/styles/themes/swiss.css`","- **Look:** print-editorial — ink-on-paper (`#111` on white), uppercase `h2` section labels on a 2px rule,","  hairline dividers, mono outline chips, square corners, monochrome editor chrome (toolbar, slash menu, popovers).","- **Light-only:** Swiss pins its own ink/paper values on the scope element, so it stays light even when",'  a parent sets `[data-theme="dark"]`. A dark Swiss variant is intentionally out of scope for v1.',"","### Notion (`notion`) — opt-out","","- **Import:** none — this is the **base** stylesheet before theme rules apply.","- **Look:** the original Notion-like palette (soft shadows, rounded cards, colored chips/notices).",'- Pass `theme="notion"` when upgrading from an older version and you need the previous default look',"  without rewriting consumer CSS.","","---","","## Cascade layers & override precedence","","All package CSS lives in named `@layer`s. Later layers beat earlier ones **without `!important`**:","","```","sdui-doc.tokens → base → blocks → chrome → themes → print","```","","| Layer | Role |","| --- | --- |","| `sdui-doc.tokens` | `--sdui-doc-*` custom properties |","| `sdui-doc.base` | Block rows, columns, alignment scaffolding |","| `sdui-doc.blocks` | Per-block typography, callouts, media, collections… |","| `sdui-doc.chrome` | Editor-only UI (drag handles, toolbars, menus) |","| **`sdui-doc.themes`** | **Theme presets (Swiss, yours)** |","| `sdui-doc.print` | A4 print/PDF rules (always wins at print time) |","","**Your unlayered CSS always wins** over every package layer — including themes.","That means you can:","","1. Ship a theme for 95% of the look, then patch one block with a plain rule.","2. Wrap the editor in a class and set `--sdui-doc-*` tokens to re-tint a theme instance.","","See stories **5. Custom theme** and **6. Override on top of a theme** below.","","---","","## Ship your own theme","","1. Create a CSS file scoped under `[data-sdui-doc-theme='<name>']`.","2. Wrap rules in `@layer sdui-doc.themes { … }` so they sit at the correct precedence.","3. Import the file **after** the base entrypoint (or cherry-pick partials — see below).",'4. Pass `theme="<name>"` on the editor/viewer.',"","```css","/* styles/themes/ocean.css */","@layer sdui-doc.themes {","  [data-sdui-doc-theme='ocean'] {","    --sdui-doc-accent: #0369a1;","    --sdui-doc-accent-strong: #0c4a6e;","    --sdui-doc-link: #0284c7;","    --sdui-doc-radius-card: 12px;","  }","","  /* Structural rules when tokens alone are not enough */","  [data-sdui-doc-theme='ocean'] h2 {","    border-bottom: 2px solid var(--sdui-doc-accent);","    padding-bottom: 6px;","  }","}","```","","```tsx","import '@lodado/sdui-document-react/styles/index.css'","import './styles/themes/ocean.css'","",'<SduiDocumentEditor content={content} theme="ocean" onContentChange={setContent} />',"```","","Swiss itself (`packages/sdui-document-react/src/styles/themes/swiss.css`) is the reference implementation —","token block on the scope element plus structural rules for headings, callouts, collections, and chrome.","","---","","## Partial / cherry-pick imports","","Skip block groups you restyle entirely and import only what you need:","","```tsx","import '@lodado/sdui-document-react/styles/tokens.css'","import '@lodado/sdui-document-react/styles/base.css'","import '@lodado/sdui-document-react/styles/blocks/typography.css'","import '@lodado/sdui-document-react/styles/themes/swiss.css'","import './styles/themes/ocean.css' // your theme replaces or extends Swiss","```","","Partial entry files do **not** declare the layer order — declare it once in your app:","","```css","@layer sdui-doc.tokens, sdui-doc.base, sdui-doc.blocks, sdui-doc.chrome, sdui-doc.themes, sdui-doc.print;","```","","---","","## Import order with Tailwind / resets","","If you use Tailwind Preflight or another CSS reset, import document styles **after** it —","otherwise `@layer base` can flatten headings, lists, and margins. Same guidance as **Document/Customization**.","","```tsx","import 'tailwindcss'","import '@lodado/sdui-document-react/styles/index.css' // MUST come after","```","","---","","## Themes vs Customization","","| Mechanism | When to use |","| --- | --- |","| **Theme** (`theme` prop + `themes/*.css`) | Full-document visual identity; covers all block types + chrome |","| **Token override** (`--sdui-doc-*` on a wrapper) | Tint accents/radii/shadows without a new theme file |","| **Per-block override** (`data-block-type` selectors) | Change one block type; works on top of any theme |","","Themes and customization compose: a theme sets the baseline; unlayered consumer rules and token overrides","on a wrapper class still win."].join(`
`)}}},tags:["autodocs"]},g=new Map,s=({children:n})=>e.jsx(S,{value:{allowedHosts:["codepen.io","codesandbox.io"]},children:e.jsx(w,{resolver:async r=>g.get(r),navigator:{push:()=>{}},children:e.jsx("div",{style:{maxWidth:820,margin:"0 auto"},children:n})})}),k=({css:n,theme:r,readOnly:y=!0})=>e.jsxs("div",{children:[e.jsx("style",{children:n}),e.jsx("pre",{style:{background:"#0f0f10",color:"#e6e6e6",padding:"12px 14px",borderRadius:8,fontSize:12,lineHeight:1.55,overflowX:"auto",margin:"0 0 16px"},children:e.jsx("code",{children:n.trim()})}),e.jsx(s,{children:y?e.jsx(o,{content:t,theme:r}):e.jsx(u,{content:t,theme:r,onContentChange:()=>{}})})]}),i={name:"0. Quick start (default Swiss)",render:()=>e.jsx(s,{children:e.jsx(u,{content:t,readOnly:!0})}),parameters:{docs:{description:{story:["No `theme` prop — **`swiss` is the default**. Import `styles/index.css` (editor) or","`styles/viewer.css` (read-only) and the Swiss theme ships with the bundle.","",'The root renders `data-sdui-doc-theme="swiss"` automatically.'].join(`
`)}}}},a={name:"1. Swiss (default)",render:()=>e.jsx(s,{children:e.jsx(o,{content:t})}),parameters:{docs:{description:{story:["Every built-in block under **Swiss** — uppercase section labels on 2px rules, ink-on-paper palette,","hairline dividers, mono outline chips, square corners, black selection chrome.","","Source: `packages/sdui-document-react/src/styles/themes/swiss.css`","",'**Light-only:** values are set on `[data-sdui-doc-theme="swiss"]` itself, so parent dark-mode',"attributes do not flip the document to a dark palette."].join(`
`)}}}},d={name:"2. Swiss (editable chrome)",render:()=>e.jsx(s,{children:e.jsx(u,{content:t,onContentChange:()=>{}})}),parameters:{docs:{description:{story:["Edit mode under Swiss — selection toolbar, slash menu, drag handles, and popovers pick up the","monochrome pass (hairline ink ring instead of soft shadows, black active states).","","Theme rules in `sdui-doc.themes` cover **chrome.css** surfaces as well as block styles."].join(`
`)}}}},c={name:'3. Notion (theme="notion")',render:()=>e.jsx(s,{children:e.jsx(o,{content:t,theme:"notion"})}),parameters:{docs:{description:{story:['The original Notion-like look — pass **`theme="notion"`** to skip Swiss.',"","There is no separate `notion.css` file: any `theme` value without matching",'`[data-sdui-doc-theme="…"]` rules falls through to the base layered styles in',"`tokens.css`, `blocks/*.css`, and `chrome.css`.","","Use this when migrating existing integrations that assumed the pre-Swiss default."].join(`
`)}}}},l={name:"4. Swiss ↔ Notion",render:()=>e.jsx(s,{children:e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24},children:[e.jsxs("section",{"aria-label":"Swiss theme",children:[e.jsx("h4",{style:{margin:"0 0 8px",fontSize:13,fontWeight:600},children:'default / theme="swiss"'}),e.jsx(o,{content:t})]}),e.jsxs("section",{"aria-label":"Notion theme",children:[e.jsx("h4",{style:{margin:"0 0 8px",fontSize:13,fontWeight:600},children:'theme="notion"'}),e.jsx(o,{content:t,theme:"notion"})]})]})}),parameters:{docs:{description:{story:"Same `allBlocksContent` fixture, both themes — use as the visual-regression surface when editing theme CSS."}}}},b=`@layer sdui-doc.themes {
  /* Step 1–2: scope + layer (see page docs above) */
  [data-sdui-doc-theme='ocean'] {
    --sdui-doc-accent: #0369a1;
    --sdui-doc-accent-strong: #0c4a6e;
    --sdui-doc-accent-wash: rgba(3, 105, 161, 0.1);
    --sdui-doc-link: #0284c7;
    --sdui-doc-radius-card: 12px;
    --sdui-doc-radius-chip: 999px;
    --sdui-doc-shadow-card: 0 1px 3px rgba(3, 105, 161, 0.12);
  }

  /* Step 3: structural rule when tokens are not enough */
  [data-sdui-doc-theme='ocean'] h2 {
    color: var(--sdui-doc-accent-strong);
    border-top: none;
    border-bottom: 2px solid var(--sdui-doc-accent);
    padding-top: 0;
    padding-bottom: 6px;
    text-transform: none;
    letter-spacing: normal;
    font-size: 18px;
  }
}`,m={name:'5. Custom theme (theme="ocean")',render:()=>e.jsx(k,{css:b,theme:"ocean"}),parameters:{docs:{description:{story:["A minimal custom theme injected live: token overrides + one structural `h2` rule.","","In your app, move this CSS into `styles/themes/ocean.css`, import it after `index.css`,",'and pass **`theme="ocean"`**. The editor root will render `data-sdui-doc-theme="ocean"`.',"",'Without the import, `theme="ocean"` behaves like `theme="notion"` — no matching rules, base look only.'].join(`
`)}}}},p=`/* Unlayered consumer CSS — beats @layer sdui-doc.themes without !important */

/* Re-tint tokens on the same element Swiss sets them on (parent wrapper is not enough) */
[data-sdui-doc-theme='swiss'].brand-patch {
  --sdui-doc-accent: #7c3aed;
  --sdui-doc-link: #6d28d9;
}

/* Patch one structural rule the theme owns */
[data-sdui-doc-theme='swiss'].brand-patch h2 {
  border-top-color: #7c3aed;
  color: #5b21b6;
}`,h={name:"6. Override on top of a theme",render:()=>e.jsxs("div",{children:[e.jsx("style",{children:p}),e.jsx("pre",{style:{background:"#0f0f10",color:"#e6e6e6",padding:"12px 14px",borderRadius:8,fontSize:12,lineHeight:1.55,overflowX:"auto",margin:"0 0 16px"},children:e.jsx("code",{children:p.trim()})}),e.jsx(s,{children:e.jsx(o,{content:t,className:"brand-patch"})})]}),parameters:{docs:{description:{story:["Swiss stays active (default), but **unlayered** rules and wrapper-level token overrides still win:","","- `.brand-patch` on the editor root (via `className`) re-tints tokens **on the same element**","  that Swiss sets them on — parent wrappers alone are not enough because themes pin values on",'  `[data-sdui-doc-theme="…"]`.','- `[data-sdui-doc-theme="swiss"].brand-patch h2 { … }` patches one selector the theme owns.',"","This is the recommended escape hatch — ship a theme for the bulk of the UI, patch the remainder","with plain CSS (see also **Document/Customization** for per-block `data-block-type` targeting)."].join(`
`)}}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  name: '0. Quick start (default Swiss)',
  render: () => <ThemeShell>
      <SduiDocumentEditor content={allBlocksContent} readOnly />
    </ThemeShell>,
  parameters: {
    docs: {
      description: {
        story: ['No \`theme\` prop — **\`swiss\` is the default**. Import \`styles/index.css\` (editor) or', '\`styles/viewer.css\` (read-only) and the Swiss theme ships with the bundle.', '', 'The root renders \`data-sdui-doc-theme="swiss"\` automatically.'].join('\\n')
      }
    }
  }
}`,...i.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  name: '1. Swiss (default)',
  render: () => <ThemeShell>
      <SduiDocumentViewer content={allBlocksContent} />
    </ThemeShell>,
  parameters: {
    docs: {
      description: {
        story: ['Every built-in block under **Swiss** — uppercase section labels on 2px rules, ink-on-paper palette,', 'hairline dividers, mono outline chips, square corners, black selection chrome.', '', 'Source: \`packages/sdui-document-react/src/styles/themes/swiss.css\`', '', '**Light-only:** values are set on \`[data-sdui-doc-theme="swiss"]\` itself, so parent dark-mode', 'attributes do not flip the document to a dark palette.'].join('\\n')
      }
    }
  }
}`,...a.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: '2. Swiss (editable chrome)',
  render: () => <ThemeShell>
      <SduiDocumentEditor content={allBlocksContent} onContentChange={() => {}} />
    </ThemeShell>,
  parameters: {
    docs: {
      description: {
        story: ['Edit mode under Swiss — selection toolbar, slash menu, drag handles, and popovers pick up the', 'monochrome pass (hairline ink ring instead of soft shadows, black active states).', '', 'Theme rules in \`sdui-doc.themes\` cover **chrome.css** surfaces as well as block styles.'].join('\\n')
      }
    }
  }
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: '3. Notion (theme="notion")',
  render: () => <ThemeShell>
      <SduiDocumentViewer content={allBlocksContent} theme="notion" />
    </ThemeShell>,
  parameters: {
    docs: {
      description: {
        story: ['The original Notion-like look — pass **\`theme="notion"\`** to skip Swiss.', '', 'There is no separate \`notion.css\` file: any \`theme\` value without matching', '\`[data-sdui-doc-theme="…"]\` rules falls through to the base layered styles in', '\`tokens.css\`, \`blocks/*.css\`, and \`chrome.css\`.', '', 'Use this when migrating existing integrations that assumed the pre-Swiss default.'].join('\\n')
      }
    }
  }
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: '4. Swiss ↔ Notion',
  render: () => <ThemeShell>
      <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 24
    }}>
        <section aria-label="Swiss theme">
          <h4 style={{
          margin: '0 0 8px',
          fontSize: 13,
          fontWeight: 600
        }}>default / theme=&quot;swiss&quot;</h4>
          <SduiDocumentViewer content={allBlocksContent} />
        </section>
        <section aria-label="Notion theme">
          <h4 style={{
          margin: '0 0 8px',
          fontSize: 13,
          fontWeight: 600
        }}>theme=&quot;notion&quot;</h4>
          <SduiDocumentViewer content={allBlocksContent} theme="notion" />
        </section>
      </div>
    </ThemeShell>,
  parameters: {
    docs: {
      description: {
        story: 'Same \`allBlocksContent\` fixture, both themes — use as the visual-regression surface when editing theme CSS.'
      }
    }
  }
}`,...l.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: '5. Custom theme (theme="ocean")',
  render: () => <ThemedDemo css={OCEAN_THEME_CSS} theme="ocean" />,
  parameters: {
    docs: {
      description: {
        story: ['A minimal custom theme injected live: token overrides + one structural \`h2\` rule.', '', 'In your app, move this CSS into \`styles/themes/ocean.css\`, import it after \`index.css\`,', 'and pass **\`theme="ocean"\`**. The editor root will render \`data-sdui-doc-theme="ocean"\`.', '', 'Without the import, \`theme="ocean"\` behaves like \`theme="notion"\` — no matching rules, base look only.'].join('\\n')
      }
    }
  }
}`,...m.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: '6. Override on top of a theme',
  render: () => <div>
      <style>{OVERRIDE_CSS}</style>
      <pre style={{
      background: '#0f0f10',
      color: '#e6e6e6',
      padding: '12px 14px',
      borderRadius: 8,
      fontSize: 12,
      lineHeight: 1.55,
      overflowX: 'auto',
      margin: '0 0 16px'
    }}>
        <code>{OVERRIDE_CSS.trim()}</code>
      </pre>
      <ThemeShell>
        <SduiDocumentViewer content={allBlocksContent} className="brand-patch" />
      </ThemeShell>
    </div>,
  parameters: {
    docs: {
      description: {
        story: ['Swiss stays active (default), but **unlayered** rules and wrapper-level token overrides still win:', '', '- \`.brand-patch\` on the editor root (via \`className\`) re-tints tokens **on the same element**', '  that Swiss sets them on — parent wrappers alone are not enough because themes pin values on', '  \`[data-sdui-doc-theme="…"]\`.', '- \`[data-sdui-doc-theme="swiss"].brand-patch h2 { … }\` patches one selector the theme owns.', '', 'This is the recommended escape hatch — ship a theme for the bulk of the UI, patch the remainder', 'with plain CSS (see also **Document/Customization** for per-block \`data-block-type\` targeting).'].join('\\n')
      }
    }
  }
}`,...h.parameters?.docs?.source}}};const q=["QuickStart","Swiss","SwissEditable","NotionOptOut","SideBySide","CustomTheme","OverrideOnTheme"];export{m as CustomTheme,c as NotionOptOut,h as OverrideOnTheme,i as QuickStart,l as SideBySide,a as Swiss,d as SwissEditable,q as __namedExportsOrder,U as default};
