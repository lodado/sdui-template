import { SduiDocumentEditor } from '@lodado/sdui-document-react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { EditorWithPatchLog } from './architecture/demos/EditorWithPatchLog'
import {
  dividerTailContent,
  editorIntroContent,
  emptyDocumentContent,
  nestedDragContent,
  rangeClipboardContent,
  textDragContent,
} from './fixtures'

const meta: Meta<typeof SduiDocumentEditor> = {
  title: 'Document/Editor',
  component: SduiDocumentEditor,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Hybrid notion-like editor: block tree owned by @lodado/sdui-document patches, ' +
          'inline text edited by a single focused-block ProseMirror instance. ' +
          'Click a block to edit; Enter splits, Backspace at start merges, Tab/Shift-Tab indent/outdent, ' +
          'ArrowUp/Down move focus across blocks. ' +
          'For the full block catalog see **Document/Catalog**; for read-only parity see **Editor ↔ Viewer Parity**.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof SduiDocumentEditor>

export const GettingStarted: Story = {
  name: 'Getting Started',
  render: () => <EditorWithPatchLog content={editorIntroContent} />,
  parameters: {
    docs: {
      description: {
        story:
          'Introductory hybrid editor with a live patch log. Structure changes (split, merge, indent, toggle) ' +
          'emit `SduiDocumentPatch[]`; inline text commits on blur as `block.update`.',
      },
    },
  },
}

export const NestedDragAndDrop: Story = {
  render: () => <EditorWithPatchLog content={nestedDragContent} />,
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

export const InlineTextDragAndDrop: Story = {
  render: () => <EditorWithPatchLog content={textDragContent} />,
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

export const BlockRangeSelectionAndClipboard: Story = {
  render: () => <EditorWithPatchLog content={rangeClipboardContent} />,
  parameters: {
    docs: {
      description: {
        story:
          'Notion-style range selection: drag text across a block boundary and the selection snaps from ' +
          'text to whole blocks (`extendBlockSelection`, ancestor-normalized). With blocks selected: ' +
          '**Cmd/Ctrl-C** copies (`application/x-sdui-blocks` JSON + plain text), **X** cuts (copy + atomic ' +
          '`block.delete` batch), **V** pastes after the selection with fresh ids (`block.insert` batch — see the log). ' +
          'Pasting plain text routes through the markdown importer, so `# headings`, `- [ ] tasks` etc. from other ' +
          'apps become real blocks. Payloads are zod-validated on the way in. ' +
          'Single-block text selection/copy stays native (ProseMirror untouched).',
      },
    },
  },
}

export const EmptyDocument: Story = {
  render: () => (
    <div style={{ border: '1px dashed #ccc', borderRadius: 6 }}>
      <EditorWithPatchLog content={emptyDocumentContent} />
    </div>
  ),
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

export const TrailingAfterDivider: Story = {
  render: () => <EditorWithPatchLog content={dividerTailContent} />,
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
