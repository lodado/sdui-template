import type { SduiDocument } from '@lodado/sdui-document'
import { SduiDocumentEditor, SduiEmbedConfigProvider, SduiPageProvider } from '@lodado/sdui-document-react'
import { SduiDocumentViewer } from '@lodado/sdui-document-react/viewer'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { allBlocksContent } from './fixtures'

const meta: Meta = {
  title: 'Document/Catalog',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Canonical catalog of every built-in `document.*` block — the same JSON the server would send. ' +
          'Use the **Editor (readOnly)** story for the full editor bundle, **Viewer** for the lightweight ' +
          'read-only subpath (~68% smaller), and **Editor ↔ Viewer Parity** to confirm DOM parity. ' +
          'Embed blocks need `SduiEmbedConfigProvider`; page/collection cards resolve through `SduiPageProvider`.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj

const vault = new Map<string, SduiDocument>()

const CatalogShell = ({ children }: { children: React.ReactNode }) => (
  <SduiEmbedConfigProvider value={{ allowedHosts: ['codepen.io', 'codesandbox.io'] }}>
    <SduiPageProvider resolver={async (docId) => vault.get(docId)} navigator={{ push: () => {} }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>{children}</div>
    </SduiPageProvider>
  </SduiEmbedConfigProvider>
)

export const AllBlocksEditor: Story = {
  name: 'All Blocks (Editor, readOnly)',
  render: () => (
    <CatalogShell>
      <SduiDocumentEditor content={allBlocksContent} readOnly />
    </CatalogShell>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Full block catalog through `SduiDocumentEditor readOnly`. For editable inline marks and the formatting ' +
          'toolbar, use **Document/Editor → Getting Started** or edit this document by removing `readOnly`.',
      },
    },
  },
}

export const AllBlocksViewer: Story = {
  name: 'All Blocks (Viewer)',
  render: () => (
    <CatalogShell>
      <SduiDocumentViewer content={allBlocksContent} />
    </CatalogShell>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Same catalog through `@lodado/sdui-document-react/viewer` — zero ProseMirror/dnd-kit in the import graph. ' +
          'Mount the editor only when the user enters edit mode.',
      },
    },
  },
}

export const EditorViewerParity: Story = {
  name: 'Editor ↔ Viewer Parity',
  render: () => (
    <CatalogShell>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <section aria-label="Editor (readOnly)">
          <h4 style={{ margin: '0 0 8px' }}>SduiDocumentEditor readOnly</h4>
          <SduiDocumentEditor content={allBlocksContent} readOnly />
        </section>
        <section aria-label="Viewer">
          <h4 style={{ margin: '0 0 8px' }}>SduiDocumentViewer</h4>
          <SduiDocumentViewer content={allBlocksContent} />
        </section>
      </div>
    </CatalogShell>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Side-by-side DOM parity check — published pages should match what the readOnly editor renders.',
      },
    },
  },
}

export const AllBlocksEditable: Story = {
  name: 'All Blocks (Editor, editable)',
  render: () => (
    <CatalogShell>
      <SduiDocumentEditor content={allBlocksContent} />
    </CatalogShell>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Full catalog in edit mode — click any text block to mount ProseMirror, drag-select for the formatting ' +
          'toolbar, toggle checklists (emits `block.update`). Non-text blocks (divider/image/file/link/embed) never ' +
          'mount ProseMirror.',
      },
    },
  },
}
