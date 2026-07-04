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

/**
 * Complex nested fixture — same tree as
 * packages/sdui-document/src/__tests__/nestedDragScenario.test.ts and
 * packages/sdui-document-react/src/__tests__/NestedDocumentEditor.test.tsx.
 * Keep all three in sync.
 *
 * root
 * ├── section-a  heading            depth 1
 * │   ├── a-1    paragraph          depth 2
 * │   │   ├── a-1-1   paragraph     depth 3
 * │   │   │   └── a-1-1-1 checklist depth 4
 * │   │   └── a-1-2   paragraph     depth 3
 * │   └── a-2    callout            depth 2
 * ├── section-b  heading            depth 1
 * │   └── b-1    paragraph          depth 2
 * └── tail       paragraph          depth 1
 */
const nestedContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'section-a',
        type: 'document.heading',
        state: { text: 'Section A' },
        attributes: { level: 2 },
        children: [
          createDocumentBlock({
            id: 'a-1',
            type: 'document.paragraph',
            state: { text: 'A-1 — drag me onto B-1: my whole subtree travels along' },
            children: [
              createDocumentBlock({
                id: 'a-1-1',
                type: 'document.paragraph',
                state: { text: 'A-1-1 (depth 3)' },
                children: [
                  createDocumentBlock({
                    id: 'a-1-1-1',
                    type: 'document.checklist',
                    state: { text: 'A-1-1-1 (depth 4) — drag me left to outdent two levels at once' },
                    attributes: { checked: false },
                  }),
                ],
              }),
              createDocumentBlock({ id: 'a-1-2', type: 'document.paragraph', state: { text: 'A-1-2 (depth 3)' } }),
            ],
          }),
          createDocumentBlock({ id: 'a-2', type: 'document.callout', state: { text: 'A-2 (callout, depth 2)' } }),
        ],
      }),
      createDocumentBlock({
        id: 'section-b',
        type: 'document.heading',
        state: { text: 'Section B' },
        attributes: { level: 2 },
        children: [createDocumentBlock({ id: 'b-1', type: 'document.paragraph', state: { text: 'B-1 (depth 2)' } })],
      }),
      createDocumentBlock({
        id: 'tail',
        type: 'document.paragraph',
        state: { text: 'Tail — drop me onto A-1-1-1 and slide right to nest 4 levels deep' },
      }),
    ],
  }),
}

const NestedEditorWithPatchLog = () => {
  const [patches, setPatches] = useState<SduiDocumentPatch[]>([])

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <SduiDocumentEditor
        content={nestedContent}
        onContentChange={(_next, applied) => setPatches((previous) => [...previous, ...applied])}
      />
      <PatchLog patches={patches} />
    </div>
  )
}

export const NestedDragAndDrop: Story = {
  render: () => <NestedEditorWithPatchLog />,
  parameters: {
    docs: {
      description: {
        story:
          'A 4-depth tree for exercising nested drag & drop. Grab the ⠿ handle and drag: ' +
          'the drop slot is always "after the hovered block", and the **horizontal** pointer offset ' +
          '(24px per level) picks the depth — slide right to nest inside the hovered block, ' +
          'slide left to outdent onto an ancestor. Dropping a block onto its own descendant is rejected. ' +
          'Every drop emits a single `block.move` patch (see the log). ' +
          'The same tree is verified headlessly in `nestedDragScenario.test.ts` ' +
          'and as a render contract in `NestedDocumentEditor.test.tsx`.',
      },
    },
  },
}

/**
 * One block of every type in the sdui-document schema, plus every inline mark.
 * Text blocks (paragraph/heading/checklist/callout) are click-to-edit;
 * non-text blocks (divider/image/file/link) never mount ProseMirror.
 */
const allBlocksContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'document-root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'all-heading',
        type: 'document.heading',
        state: { text: 'document.heading — title block, attributes.level 1–3' },
        attributes: { level: 1 },
      }),
      createDocumentBlock({
        id: 'all-paragraph',
        type: 'document.paragraph',
        state: {
          content: [
            { type: 'text', text: 'document.paragraph — default text block. Inline marks: ' },
            { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
            { type: 'text', text: ', ' },
            { type: 'text', text: 'italic', marks: [{ type: 'italic' }] },
            { type: 'text', text: ', ' },
            { type: 'text', text: 'code', marks: [{ type: 'code' }] },
            { type: 'text', text: ', ' },
            { type: 'text', text: 'link', marks: [{ type: 'link', attrs: { href: 'https://example.com' } }] },
            { type: 'hard_break' },
            { type: 'text', text: 'and a hard_break right above this line.' },
          ],
          text: 'document.paragraph — default text block. Inline marks: bold, italic, code, link\nand a hard_break right above this line.',
        },
      }),
      createDocumentBlock({
        id: 'all-checklist',
        type: 'document.checklist',
        state: { text: 'document.checklist — todo item, attributes.checked boolean' },
        attributes: { checked: false },
      }),
      createDocumentBlock({
        id: 'all-callout',
        type: 'document.callout',
        state: { text: 'document.callout — highlighted note block' },
      }),
      createDocumentBlock({
        id: 'all-divider',
        type: 'document.divider',
        state: { text: 'document.divider — non-text: never mounts ProseMirror, focus skips it' },
      }),
      createDocumentBlock({
        id: 'all-image',
        type: 'document.image',
        state: { text: 'document.image — non-text media block (src via attributes)' },
        attributes: { src: 'https://example.com/image.png', alt: 'example' },
      }),
      createDocumentBlock({
        id: 'all-file',
        type: 'document.file',
        state: { text: 'document.file — non-text attachment block' },
        attributes: { url: 'https://example.com/file.pdf', name: 'file.pdf' },
      }),
      createDocumentBlock({
        id: 'all-link',
        type: 'document.link',
        state: { text: 'document.link — non-text bookmark block' },
        attributes: { url: 'https://example.com' },
      }),
      createDocumentBlock({
        id: 'all-nested-parent',
        type: 'document.paragraph',
        state: { text: 'Any block can nest children (n-depth outline):' },
        children: [
          createDocumentBlock({
            id: 'all-nested-child',
            type: 'document.paragraph',
            state: { text: 'nested child — moves with its parent on drag' },
          }),
        ],
      }),
    ],
  }),
}

export const AllBlocks: Story = {
  render: () => <SduiDocumentEditor content={allBlocksContent} />,
  parameters: {
    docs: {
      description: {
        story:
          'Every block type in the schema, one of each:\n\n' +
          '| Type | Role | Editable inline? |\n' +
          '|------|------|------------------|\n' +
          '| `document.root` | invisible tree root (never rendered) | — |\n' +
          '| `document.heading` | section title, `attributes.level` 1–3 (markdown `#`/`##`/`###` shortcut) | ✅ |\n' +
          '| `document.paragraph` | default text block | ✅ |\n' +
          '| `document.checklist` | todo item, `attributes.checked` (markdown `[] ` shortcut) | ✅ |\n' +
          '| `document.callout` | highlighted note (markdown `> ` shortcut) | ✅ |\n' +
          '| `document.divider` | horizontal rule | ❌ non-text |\n' +
          '| `document.image` | media block, `attributes.src/alt` | ❌ non-text |\n' +
          '| `document.file` | attachment, `attributes.url/name` | ❌ non-text |\n' +
          '| `document.link` | bookmark, `attributes.url` | ❌ non-text |\n\n' +
          'The paragraph shows all inline marks (`bold`, `italic`, `code`, `link`) plus `hard_break`. ' +
          'Type-specific chrome (real `<hr>`, image rendering, checkbox UI) is renderer backlog — ' +
          'today every block renders its inline content through `InlineContentView`.',
      },
    },
  },
}
