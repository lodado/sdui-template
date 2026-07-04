'use client'

import type { SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'
import { SduiDocumentEditor } from '@lodado/sdui-document-react'
import { useRef } from 'react'

/**
 * Hybrid document editor E2E surface.
 *
 * Renders the notion-like block editor (block tree = sdui-document patches,
 * inline text = focused-block ProseMirror) for real-browser tests,
 * including Korean IME composition.
 */
const initialContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'document-root',
    type: 'document.root',
    children: [
      createDocumentBlock({ id: 'p1', type: 'document.paragraph', state: { text: 'First' } }),
      createDocumentBlock({ id: 'p2', type: 'document.paragraph', state: { text: 'Second' } }),
      createDocumentBlock({ id: 'p3', type: 'document.paragraph', state: { text: 'Third' } }),
    ],
  }),
}

const DocumentEditorPage = () => {
  const counter = useRef(0)

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <h1>Document Editor E2E</h1>
      <SduiDocumentEditor
        content={initialContent}
        generateBlockId={() => {
          counter.current += 1

          return `gen-${counter.current}`
        }}
      />
    </main>
  )
}

export default DocumentEditorPage
