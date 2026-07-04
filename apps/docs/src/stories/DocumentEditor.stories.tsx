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
 * Fixture for inline text drag: two rich paragraphs plus a checklist, callout
 * and divider so both accepting and rejecting drop targets are on screen.
 */
const textDragContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'drag-source',
        type: 'document.paragraph',
        state: {
          content: [
            { type: 'text', text: 'Select any text here — like ' },
            { type: 'text', text: 'this bold fragment', marks: [{ type: 'bold' }] },
            { type: 'text', text: ' or ' },
            { type: 'text', text: 'this highlight', marks: [{ type: 'highlight', attrs: { color: '#FED46A' } }] },
            { type: 'text', text: ' — and drag it into another block.' },
          ],
          text: 'Select any text here — like this bold fragment or this highlight — and drag it into another block.',
        },
      }),
      createDocumentBlock({
        id: 'drag-target',
        type: 'document.paragraph',
        state: {
          content: [{ type: 'text', text: 'Drop it anywhere in this paragraph; marks travel along.' }],
          text: 'Drop it anywhere in this paragraph; marks travel along.',
        },
      }),
      createDocumentBlock({
        id: 'drag-checklist',
        type: 'document.checklist',
        state: { text: 'Checklists accept text drops too' },
        attributes: { checked: false },
      }),
      createDocumentBlock({
        id: 'drag-callout',
        type: 'document.callout',
        state: { text: 'Callouts as well — hold Alt/Option while dropping to copy instead of move.' },
        attributes: { style: 'tip' },
      }),
      createDocumentBlock({ id: 'drag-divider', type: 'document.divider' }),
    ],
  }),
}

const TextDragEditorWithPatchLog = () => {
  const [patches, setPatches] = useState<SduiDocumentPatch[]>([])

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <SduiDocumentEditor
        content={textDragContent}
        onContentChange={(_next, applied) => setPatches((previous) => [...previous, ...applied])}
      />
      <PatchLog patches={patches} />
    </div>
  )
}

export const InlineTextDragAndDrop: Story = {
  render: () => <TextDragEditorWithPatchLog />,
  parameters: {
    docs: {
      description: {
        story:
          'ProseMirror-style inline text drag across blocks: select text in any block (focused or static), ' +
          'drag it, and an insertion caret follows the pointer inside valid targets. ' +
          'Dropping emits `block.update` patches (source range removed + fragment inserted — one atomic batch, ' +
          'see the log); holding **Alt/Option** copies instead of moving. ' +
          'Marks are preserved through the move. Non-text blocks (divider/image/file/link) reject the drop. ' +
          'The block-structure drag on the ⠿ handle is a separate channel (dnd-kit) and is unaffected.',
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

/**
 * Empty-document scenario, ported from Outline:
 * - trailing-block invariant (TrailingNode) seeds/keeps an empty paragraph at
 *   the end, so the caret always has somewhere to land
 * - clicking the padding below the document focuses that trailing paragraph
 *   (ClickablePadding + focusAtEnd) — the click never inserts
 * - a CSS-only placeholder shows while the document is a single empty paragraph
 */
const emptyContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({ id: 'empty-root', type: 'document.root' }),
}

const dividerTailContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'divider-tail-root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'divider-tail-heading',
        type: 'document.heading',
        state: { text: 'Document ending in a divider' },
        attributes: { level: 2 },
      }),
      createDocumentBlock({ id: 'divider-tail-hr', type: 'document.divider' }),
    ],
  }),
}

const EmptyDocumentStory = () => {
  const [patches, setPatches] = useState<SduiDocumentPatch[]>([])

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ border: '1px dashed #ccc', borderRadius: 6 }}>
        <SduiDocumentEditor
          content={emptyContent}
          onContentChange={(_next, applied) => setPatches((previous) => [...previous, ...applied])}
        />
      </div>
      <PatchLog patches={patches} />
    </div>
  )
}

export const EmptyDocument: Story = {
  render: () => <EmptyDocumentStory />,
  parameters: {
    docs: {
      description: {
        story:
          'Starts from a root with zero children: the trailing-block invariant seeds one empty paragraph on ' +
          'mount (silently — no patch event, mirroring Outline `withTrailingNode`). Click anywhere in the dashed ' +
          'area below the text to focus the trailing paragraph. Deleting every block always leaves one empty ' +
          'paragraph behind, and the placeholder returns.',
      },
    },
  },
}

const TrailingAfterDividerStory = () => {
  const [patches, setPatches] = useState<SduiDocumentPatch[]>([])

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <SduiDocumentEditor
        content={dividerTailContent}
        onContentChange={(_next, applied) => setPatches((previous) => [...previous, ...applied])}
      />
      <PatchLog patches={patches} />
    </div>
  )
}

export const TrailingAfterDivider: Story = {
  render: () => <TrailingAfterDividerStory />,
  parameters: {
    docs: {
      description: {
        story:
          'The stored document ends in a `document.divider` (a non-text block). On mount the invariant appends ' +
          'an empty trailing paragraph after it, so the caret can always be placed after the divider — delete the ' +
          'trailing paragraph and it comes right back in the same patch batch (watch the log).',
      },
    },
  },
}
