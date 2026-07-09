import type { SduiDocument } from '@lodado/sdui-document'
import { SduiDocumentEditor, SduiEmbedConfigProvider, SduiPageProvider } from '@lodado/sdui-document-react'
import { SduiDocumentViewer } from '@lodado/sdui-document-react/viewer'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { allBlocksContent } from './AllBlocks.stories'

const meta: Meta<typeof SduiDocumentViewer> = {
  title: 'Document/Document Viewer (Read-only)',
  component: SduiDocumentViewer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Read-only document renderer from the `@lodado/sdui-document-react/viewer` subpath — ' +
          'zero ProseMirror/dnd-kit in its import graph (≈68% smaller than the editor bundle), ' +
          'SSR-friendly, with DOM parity to `SduiDocumentEditor readOnly`. ' +
          'Use it for published pages; mount the editor only when entering edit mode.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof SduiDocumentViewer>

const vault = new Map<string, SduiDocument>()

/** The full block catalog rendered by the standalone viewer. */
export const AllBlocks: Story = {
  render: () => (
    <SduiEmbedConfigProvider value={{ allowedHosts: ['codepen.io', 'codesandbox.io'] }}>
      <SduiPageProvider resolver={async (docId) => vault.get(docId)} navigator={{ push: () => {} }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <SduiDocumentViewer content={allBlocksContent} />
        </div>
      </SduiPageProvider>
    </SduiEmbedConfigProvider>
  ),
}

/** Same content through the readOnly editor (left) and the viewer (right) — the DOM must match. */
export const EditorParity: Story = {
  render: () => (
    <SduiEmbedConfigProvider value={{ allowedHosts: ['codepen.io', 'codesandbox.io'] }}>
      <SduiPageProvider resolver={async (docId) => vault.get(docId)} navigator={{ push: () => {} }}>
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
      </SduiPageProvider>
    </SduiEmbedConfigProvider>
  ),
}
