import { createDocumentBlock } from '@lodado/sdui-document'
import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { SduiLayoutRenderer } from '@lodado/sdui-template'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import { documentEditorComponent } from '../DocumentEditorNode'
import { documentViewerComponent } from '../DocumentViewerNode'

function docContent(text: string) {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [createDocumentBlock({ id: 'p1', type: 'document.paragraph', state: { text } })],
    }),
  }
}

// SDUI layout whose single node is a document region.
function layoutWithDocument(text: string): SduiLayoutDocument {
  return {
    version: '1.0',
    root: { id: 'doc-region', type: 'Document', state: { content: docContent(text) } },
  } as SduiLayoutDocument
}

describe('document region as an SDUI layout node', () => {
  describe('as is: documentViewerComponent registered as "Document"', () => {
    it('to be: the layout renders the document read-only', () => {
      render(
        <SduiLayoutRenderer
          document={layoutWithDocument('hello from layout')}
          components={{ Document: documentViewerComponent }}
        />,
      )

      expect(screen.getByText('hello from layout')).toBeInTheDocument()
      // read-only: no editor affordances
      expect(document.querySelector('[contenteditable="true"]')).toBeNull()
    })

    it('to be: placeholder when the node has no content', () => {
      const layout = { version: '1.0', root: { id: 'empty', type: 'Document', state: {} } } as SduiLayoutDocument
      render(<SduiLayoutRenderer document={layout} components={{ Document: documentViewerComponent }} />)

      expect(screen.getByText(/no document content/i)).toBeInTheDocument()
    })
  })

  describe('as is: documentEditorComponent registered as "Document"', () => {
    it('to be: edits write back to the layout store node state', () => {
      render(
        <SduiLayoutRenderer
          document={layoutWithDocument('editable body')}
          components={{ Document: documentEditorComponent }}
        />,
      )

      // editor mounts an editable region for the paragraph
      expect(screen.getByText('editable body')).toBeInTheDocument()
      expect(document.querySelector('[data-sdui-document-editor]')).not.toBeNull()
      // focusing a block mounts ProseMirror (contenteditable)
      fireEvent.click(screen.getByText('editable body'))
      expect(document.querySelector('[data-sdui-document-editor]')).not.toBeNull()
    })
  })
})
