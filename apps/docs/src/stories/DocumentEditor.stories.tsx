import { createDocumentBlock, type SduiDocumentContent, type SduiDocumentPatch } from '@lodado/sdui-document'
import { SduiDocumentEditor } from '@lodado/sdui-document-react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState } from 'react'

const meta: Meta<typeof SduiDocumentEditor> = {
  title: 'Document/Document Editor (Hybrid PM)',
  component: SduiDocumentEditor,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Hybrid notion-like editor: block tree owned by @lodado/sdui-document patches, ' +
          'inline text edited by a single focused-block ProseMirror instance. ' +
          'Click a block to edit; Enter splits, Backspace at start merges, Tab/Shift-Tab indent/outdent, ' +
          'ArrowUp/Down move focus across blocks.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof SduiDocumentEditor>

const sampleContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'document-root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'heading-1',
        type: 'document.heading',
        state: {
          content: [{ type: 'text', text: 'Hybrid block editor', marks: [{ type: 'bold' }] }],
          text: 'Hybrid block editor',
        },
        attributes: { level: 1 },
      }),
      createDocumentBlock({
        id: 'paragraph-1',
        type: 'document.paragraph',
        state: {
          content: [
            { type: 'text', text: 'Only the focused block mounts ' },
            { type: 'text', text: 'ProseMirror', marks: [{ type: 'code' }] },
            { type: 'text', text: '; everything else is static React.' },
          ],
          text: 'Only the focused block mounts ProseMirror; everything else is static React.',
        },
      }),
      createDocumentBlock({
        id: 'paragraph-2',
        type: 'document.paragraph',
        state: {
          content: [
            { type: 'text', text: 'Structure changes are ' },
            { type: 'text', text: 'patches', marks: [{ type: 'italic' }] },
            { type: 'text', text: ' — try Enter, Backspace at start, Tab and Shift-Tab.' },
          ],
          text: 'Structure changes are patches — try Enter, Backspace at start, Tab and Shift-Tab.',
        },
        children: [
          createDocumentBlock({
            id: 'nested-1',
            type: 'document.paragraph',
            state: { text: 'Nested blocks move with their parents.' },
          }),
        ],
      }),
    ],
  }),
}

const PatchLog = ({ patches }: { patches: SduiDocumentPatch[] }) => (
  <pre style={{ fontSize: 12, background: '#f5f5f5', padding: 12, maxHeight: 240, overflow: 'auto' }}>
    {patches
      .slice(-12)
      .map((patch) => JSON.stringify(patch))
      .join('\n') || '(edit the document to see patches)'}
  </pre>
)

const EditorWithPatchLog = () => {
  const [patches, setPatches] = useState<SduiDocumentPatch[]>([])

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <SduiDocumentEditor
        content={sampleContent}
        onContentChange={(_next, applied) => setPatches((previous) => [...previous, ...applied])}
      />
      <PatchLog patches={patches} />
    </div>
  )
}

export const Editable: Story = {
  render: () => <EditorWithPatchLog />,
}

export const ReadOnly: Story = {
  render: () => <SduiDocumentEditor content={sampleContent} readOnly />,
}
