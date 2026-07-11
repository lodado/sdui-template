import type { SduiDocument } from '@lodado/sdui-document'
import { SduiEmbedConfigProvider, SduiPageProvider } from '@lodado/sdui-document-react'
import { SduiDocumentViewer } from '@lodado/sdui-document-react/viewer'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { allBlocksContent } from './fixtures'

/**
 * Styling & customization guide for @lodado/sdui-document-react.
 *
 * Every rule the package ships lives in a `@layer sdui-doc.*` cascade layer, so
 * an unlayered rule you write ALWAYS wins over package styles — no `!important`,
 * no specificity escalation. The stories below inject a scoped <style> tag and
 * render the live viewer so you can see each override take effect.
 */
const meta: Meta = {
  title: 'Document/Customization',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'How to restyle the document editor/viewer. Two mechanisms, both driven by plain CSS:',
          '',
          '1. **Token override** — set `--sdui-doc-*` custom properties to retheme colors, surfaces, radii, shadows, chips, and z-index. Source of truth: `styles/tokens.css`.',
          '2. **Per-block override** — every block wrapper carries `data-block-type` (e.g. `document.callout`). Target it with a plain rule.',
          '',
          '**Import order matters.** Document styles are layered, so a cascade layer loses to any *later-declared* layer. If you use Tailwind or a CSS reset, import the document CSS **after** it — otherwise Preflight (`@layer base`) flattens headings, lists, and margins:',
          '',
          '```tsx',
          "import 'tailwindcss'                                  // or your reset / globals",
          "import '@lodado/sdui-document-react/styles/index.css' // MUST come after",
          '```',
          '',
          '**Entry points:**',
          '',
          '| Import | Contents |',
          '| --- | --- |',
          '| `…/styles/index.css` | Full editor (viewer + editing chrome) |',
          '| `…/styles/viewer.css` | Read-only viewer (no drag handles/toolbars) |',
          '| `…/styles/tokens.css` | CSS variables only (`--sdui-doc-*`) |',
          '| `…/styles/base.css` | Block layout scaffolding |',
          '| `…/styles/blocks/*.css` | Per-block-group styles |',
          '| `…/styles/chrome.css` | Editor-only UI (handles, toolbars) |',
          '| `…/styles/themes/swiss.css` | Swiss theme (included in index.css/viewer.css) |',
          '| `…/styles/print.css` | A4 print/PDF rules |',
          '',
          'Layer order: `sdui-doc.tokens → base → blocks → chrome → themes → print`.',
          '',
          'For full-document presets (Swiss default, custom themes), see **Document/Themes**.',
        ].join('\n'),
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj

const vault = new Map<string, SduiDocument>()

/** Providers the catalog blocks need (embed allowlist + page resolver). */
const Shell = ({ children }: { children: React.ReactNode }) => (
  <SduiEmbedConfigProvider value={{ allowedHosts: ['codepen.io', 'codesandbox.io'] }}>
    <SduiPageProvider resolver={async (docId) => vault.get(docId)} navigator={{ push: () => {} }}>
      {children}
    </SduiPageProvider>
  </SduiEmbedConfigProvider>
)

/**
 * Renders `css` inside a scoped wrapper, shows it in a <pre>, and mounts the
 * viewer under the same scope so the override is live. The scope class keeps the
 * demo from leaking into the rest of Storybook.
 */
const CustomizedDemo = ({ scope, css }: { scope: string; css: string }) => (
  <div>
    <style>{css}</style>
    <pre
      style={{
        background: '#0f0f10',
        color: '#e6e6e6',
        padding: '12px 14px',
        borderRadius: 8,
        fontSize: 12,
        lineHeight: 1.55,
        overflowX: 'auto',
        margin: '0 0 16px',
      }}
    >
      <code>{css.trim()}</code>
    </pre>
    <div className={scope} style={{ maxWidth: 820 }}>
      <Shell>
        <SduiDocumentViewer content={allBlocksContent} />
      </Shell>
    </div>
  </div>
)

export const Baseline: Story = {
  name: '0. Baseline (no overrides)',
  render: () => (
    <div style={{ maxWidth: 820 }}>
      <Shell>
        <SduiDocumentViewer content={allBlocksContent} />
      </Shell>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The default look, for comparison with the customized stories below.',
      },
    },
  },
}

const TOKEN_CSS = `/* Retheme via tokens — set --sdui-doc-* on any wrapper (here .theme-grape).
   Use :root for app-wide, [data-theme='dark'] per theme, or a class per instance. */
.theme-grape {
  --sdui-doc-accent: #7c3aed;
  --sdui-doc-accent-strong: #6d28d9;
  --sdui-doc-accent-wash: rgba(124, 58, 237, 0.12);
  --sdui-doc-radius-card: 4px;
  --sdui-doc-chip-blue-bg: rgba(124, 58, 237, 0.16);
  --sdui-doc-chip-blue-text: #6d28d9;
}`

export const TokenTheme: Story = {
  name: '1. Token override (retheme)',
  render: () => <CustomizedDemo scope="theme-grape" css={TOKEN_CSS} />,
  parameters: {
    docs: {
      description: {
        story:
          'No selectors touched — only CSS variables. Because token definitions live in ' +
          '`@layer sdui-doc.tokens`, an unlayered `.theme-grape { --sdui-doc-* }` wins. See ' +
          '`styles/tokens.css` for the full token surface (colors, surfaces, borders, shadows, ' +
          'radii, chip palette, z-index).',
      },
    },
  },
}

const BLOCK_CSS = `/* Restyle ONE block type. Wrappers carry data-block-type; because package
   rules are layered, a plain unlayered rule beats them without !important. */
.custom-callout [data-block-type='document.callout'] .notice-block {
  border: none;
  border-left: 3px solid var(--sdui-doc-accent, #4c6ef5);
  border-radius: 0;
  background: transparent;
  padding-left: 14px;
}`

export const PerBlock: Story = {
  name: '2. Per-block override',
  render: () => <CustomizedDemo scope="custom-callout" css={BLOCK_CSS} />,
  parameters: {
    docs: {
      description: {
        story:
          'Callouts become a flat left-border accent while every other block keeps its default ' +
          'style. `data-block-type` values match the `document.*` type ids — see **Document/Catalog** ' +
          'for the full list.',
      },
    },
  },
}
