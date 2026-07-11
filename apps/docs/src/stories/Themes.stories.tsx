import type { SduiDocument } from '@lodado/sdui-document'
import { SduiDocumentEditor, SduiEmbedConfigProvider, SduiPageProvider } from '@lodado/sdui-document-react'
import { SduiDocumentViewer } from '@lodado/sdui-document-react/viewer'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { allBlocksContent } from './fixtures'

const meta: Meta = {
  title: 'Document/Themes',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Theme system for the document editor/viewer. The `theme` prop renders `data-sdui-doc-theme` on the ' +
          'root; theme CSS lives in the `sdui-doc.themes` cascade layer, so it beats the base styles without ' +
          '`!important` while unlayered consumer CSS still wins. **Swiss** (print-editorial, near black & white) ' +
          'is the default — pass `theme="notion"` for the original Notion-like look.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj

const vault = new Map<string, SduiDocument>()

const ThemeShell = ({ children }: { children: React.ReactNode }) => (
  <SduiEmbedConfigProvider value={{ allowedHosts: ['codepen.io', 'codesandbox.io'] }}>
    <SduiPageProvider resolver={async (docId) => vault.get(docId)} navigator={{ push: () => {} }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>{children}</div>
    </SduiPageProvider>
  </SduiEmbedConfigProvider>
)

export const Swiss: Story = {
  name: 'Swiss (default)',
  render: () => (
    <ThemeShell>
      <SduiDocumentEditor content={allBlocksContent} readOnly />
    </ThemeShell>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Every built-in block under the default **Swiss** theme — uppercase section labels on 2px rules, ' +
          'ink-on-paper palette, hairline dividers, mono outline chips, square corners, black selection chrome. ' +
          'Light-only by design: the theme pins its own ink/paper values even under `[data-theme="dark"]`.',
      },
    },
  },
}

export const SwissEditable: Story = {
  name: 'Swiss (editable chrome)',
  render: () => (
    <ThemeShell>
      <SduiDocumentEditor content={allBlocksContent} />
    </ThemeShell>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Edit mode under Swiss — selection toolbar, slash menu, drag handles, and popovers pick up the ' +
          'monochrome pass (hairline ink ring instead of soft shadows, black active states).',
      },
    },
  },
}

export const NotionOptOut: Story = {
  name: 'Notion (theme="notion")',
  render: () => (
    <ThemeShell>
      <SduiDocumentEditor content={allBlocksContent} readOnly theme="notion" />
    </ThemeShell>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The base Notion-like look, kept as an opt-out: any `theme` value without a matching ' +
          '`data-sdui-doc-theme` stylesheet falls through to the base styles.',
      },
    },
  },
}

export const SideBySide: Story = {
  name: 'Swiss ↔ Notion',
  render: () => (
    <ThemeShell>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <section aria-label="Swiss theme">
          <h4 style={{ margin: '0 0 8px' }}>theme=&quot;swiss&quot; (default)</h4>
          <SduiDocumentViewer content={allBlocksContent} />
        </section>
        <section aria-label="Notion theme">
          <h4 style={{ margin: '0 0 8px' }}>theme=&quot;notion&quot;</h4>
          <SduiDocumentViewer content={allBlocksContent} theme="notion" />
        </section>
      </div>
    </ThemeShell>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Same document, both themes — the visual-regression surface for theme work.',
      },
    },
  },
}
