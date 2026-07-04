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
        state: { text: 'document.heading — h1, attributes.level 1–4' },
        attributes: { level: 1 },
      }),
      createDocumentBlock({
        id: 'all-heading-2',
        type: 'document.heading',
        state: { text: 'document.heading — h2' },
        attributes: { level: 2 },
      }),
      createDocumentBlock({
        id: 'all-heading-3',
        type: 'document.heading',
        state: { text: 'document.heading — h3' },
        attributes: { level: 3 },
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
            { type: 'text', text: ', ' },
            { type: 'text', text: 'strikethrough', marks: [{ type: 'strikethrough' }] },
            { type: 'text', text: ', ' },
            { type: 'text', text: 'underline', marks: [{ type: 'underline' }] },
            { type: 'hard_break' },
            { type: 'text', text: 'and a hard_break right above this line.' },
          ],
          text: 'document.paragraph — default text block. Inline marks: bold, italic, code, link, strikethrough, underline\nand a hard_break right above this line.',
        },
      }),
      createDocumentBlock({
        id: 'all-highlights',
        type: 'document.paragraph',
        state: {
          content: [
            { type: 'text', text: 'highlight (Outline palette): ' },
            { type: 'text', text: 'Coral', marks: [{ type: 'highlight', attrs: { color: '#FDEA9B' } }] },
            { type: 'text', text: ' ' },
            { type: 'text', text: 'Apricot', marks: [{ type: 'highlight', attrs: { color: '#FED46A' } }] },
            { type: 'text', text: ' ' },
            { type: 'text', text: 'Sunset', marks: [{ type: 'highlight', attrs: { color: '#FA551E' } }] },
            { type: 'text', text: ' ' },
            { type: 'text', text: 'Smoothie', marks: [{ type: 'highlight', attrs: { color: '#B4DC19' } }] },
            { type: 'text', text: ' ' },
            { type: 'text', text: 'Bubblegum', marks: [{ type: 'highlight', attrs: { color: '#C8AFF0' } }] },
            { type: 'text', text: ' ' },
            { type: 'text', text: 'Neon', marks: [{ type: 'highlight', attrs: { color: '#3CBEFC' } }] },
            { type: 'text', text: ' — drag-select any text to open the formatting toolbar.' },
          ],
          text: 'highlight (Outline palette): Coral Apricot Sunset Smoothie Bubblegum Neon — drag-select any text to open the formatting toolbar.',
        },
      }),
      createDocumentBlock({
        id: 'all-checklist',
        type: 'document.checklist',
        state: { text: 'document.checklist — click the box to toggle (emits block.update)' },
        attributes: { checked: false },
      }),
      createDocumentBlock({
        id: 'all-checklist-done',
        type: 'document.checklist',
        state: { text: 'document.checklist — checked state dims the text' },
        attributes: { checked: true },
      }),
      createDocumentBlock({
        id: 'all-callout-info',
        type: 'document.callout',
        state: { text: 'document.callout — info (default variant)' },
        attributes: { style: 'info' },
      }),
      createDocumentBlock({
        id: 'all-callout-warning',
        type: 'document.callout',
        state: { text: 'document.callout — warning' },
        attributes: { style: 'warning' },
      }),
      createDocumentBlock({
        id: 'all-callout-tip',
        type: 'document.callout',
        state: { text: 'document.callout — tip' },
        attributes: { style: 'tip' },
      }),
      createDocumentBlock({
        id: 'all-callout-success',
        type: 'document.callout',
        state: { text: 'document.callout — success' },
        attributes: { style: 'success' },
      }),
      createDocumentBlock({ id: 'all-divider', type: 'document.divider' }),
      createDocumentBlock({
        id: 'all-page-break',
        type: 'document.divider',
        attributes: { markup: '***' },
      }),
      createDocumentBlock({
        id: 'all-image',
        type: 'document.image',
        state: { text: 'document.image — caption comes from state.text' },
        attributes: { src: 'https://picsum.photos/seed/sdui/640/280', alt: 'random landscape', width: 640 },
      }),
      createDocumentBlock({
        id: 'all-file',
        type: 'document.file',
        attributes: { url: 'https://example.com/file.pdf', name: 'quarterly-report.pdf', size: 48211 },
      }),
      createDocumentBlock({
        id: 'all-link',
        type: 'document.link',
        state: { text: 'document.link — bookmark card (a.embed)' },
        attributes: { url: 'https://www.getoutline.com' },
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
          'Every block type rendered with its semantic tag + CSS ported from the Outline editor ' +
          '(tags from `shared/editor/nodes/*` toDOM, values from `Styles.ts`/`theme.ts`):\n\n' +
          '| Type | Rendered as | Editable inline? |\n' +
          '|------|-------------|------------------|\n' +
          '| `document.root` | invisible tree root (never rendered) | — |\n' +
          '| `document.heading` | `<h1..h4 class="heading-content">` via `attributes.level` (markdown `#`…) | ✅ |\n' +
          '| `document.paragraph` | `<p dir="auto">` | ✅ |\n' +
          '| `document.checklist` | checkbox item — box toggles `attributes.checked` via `block.update` | ✅ |\n' +
          '| `document.callout` | `.notice-block` info/warning/tip/success (markdown `> `) | ✅ |\n' +
          '| `document.divider` | `<hr>`; `attributes.markup="***"` → dashed page-break | ❌ non-text |\n' +
          '| `document.image` | `<div class="image"><img>` + caption from `state.text` | ❌ non-text |\n' +
          '| `document.file` | `<a class="attachment">` download card | ❌ non-text |\n' +
          '| `document.link` | `<a class="embed">` bookmark | ❌ non-text |\n\n' +
          'The paragraphs show all inline marks (`bold`, `italic`, `strikethrough`, `underline`, `code.inline`, ' +
          '`link`, `highlight` in all 6 Outline palette colors) plus `hard_break`. ' +
          'Drag-selecting text in edit mode opens the floating formatting toolbar (Radix popover, Outline design). ' +
          'Light/dark tokens switch with the `data-theme` attribute. ' +
          'Focused and static states share the same wrapper tag, so entering/leaving edit mode causes no layout shift.',
      },
    },
  },
}
