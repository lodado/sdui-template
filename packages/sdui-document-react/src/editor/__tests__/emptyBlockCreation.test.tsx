import type { SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { SduiDocumentEditor } from '../SduiDocumentEditor'
import { stripPatchOrigins } from './patchTestUtils'

function createContent(children?: Parameters<typeof createDocumentBlock>[0][]): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      ...(children ? { children } : {}),
    }),
  }
}

function renderEditor(
  content: SduiDocumentContent,
  overrides?: Partial<React.ComponentProps<typeof SduiDocumentEditor>>,
) {
  const ids = ['gen-1', 'gen-2', 'gen-3']
  const onContentChange = jest.fn()
  const utils = render(
    <SduiDocumentEditor
      content={content}
      onContentChange={onContentChange}
      generateBlockId={() => ids.shift() ?? 'gen-x'}
      {...overrides}
    />,
  )

  return { ...utils, onContentChange }
}

function blockIds(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('[data-block-id]')).map(
    (element) => element.getAttribute('data-block-id') ?? '',
  )
}

describe('empty block creation (Outline trailing-block scenario)', () => {
  describe('as is: empty document root (BVA: zero blocks)', () => {
    describe('when mounted', () => {
      it('to be: a trailing empty paragraph is seeded silently (no patch event)', () => {
        const { container, onContentChange } = renderEditor(createContent())

        expect(blockIds(container)).toEqual(['gen-1'])
        // load normalization mirrors Outline withTrailingNode — not an edit
        expect(onContentChange).not.toHaveBeenCalled()
      })

      it('to be: the empty-document placeholder flag is set on the container', () => {
        const { container } = renderEditor(createContent())

        expect(container.querySelector('[data-sdui-document-editor]')).toHaveAttribute('data-doc-empty')
      })
    })

    describe('when the seeded paragraph is clicked', () => {
      it('to be: the ProseMirror surface mounts on it', async () => {
        const user = userEvent.setup()
        const { container } = renderEditor(createContent())

        const staticView = container.querySelector('[data-block-id="gen-1"] [data-inline-root]')
        expect(staticView).not.toBeNull()
        await user.click(staticView as HTMLElement)

        expect(container.querySelectorAll('[contenteditable="true"]')).toHaveLength(1)
      })
    })
  })

  describe('as is: document ending in a non-text block (divider last)', () => {
    const dividerLast = () =>
      createContent([
        { id: 'p1', type: 'document.paragraph', state: { text: 'First' } },
        { id: 'divider-1', type: 'document.divider' },
      ])

    describe('when mounted', () => {
      it('to be: a trailing paragraph is appended after the divider', () => {
        const { container } = renderEditor(dividerLast())

        expect(blockIds(container)).toEqual(['p1', 'divider-1', 'gen-1'])
      })

      it('to be: no placeholder flag (document has content)', () => {
        const { container } = renderEditor(dividerLast())

        expect(container.querySelector('[data-sdui-document-editor]')).not.toHaveAttribute('data-doc-empty')
      })
    })
  })

  describe('as is: paragraph last, divider before it', () => {
    const paragraphLast = () =>
      createContent([
        { id: 'divider-1', type: 'document.divider' },
        { id: 'p1', type: 'document.paragraph', state: { text: 'Tail' } },
      ])

    describe('when the last paragraph is deleted (EP: invariant restore on mutation)', () => {
      it('to be: the trailing insert rides the same patch batch', async () => {
        const user = userEvent.setup()
        const { container, onContentChange } = renderEditor(paragraphLast())

        await user.click(screen.getByLabelText('Drag block p1'))
        await user.keyboard('{Backspace}')

        expect(blockIds(container)).toEqual(['divider-1', 'gen-1'])
        expect(onContentChange).toHaveBeenCalledTimes(1)
        const patches = onContentChange.mock.calls[0][1]
        expect(stripPatchOrigins(patches)).toEqual([
          { type: 'block.delete', blockId: 'p1' },
          {
            type: 'block.insert',
            parentId: 'root',
            after: 'divider-1',
            block: { id: 'gen-1', type: 'document.paragraph' },
          },
        ])
      })
    })
  })

  describe('as is: clickable padding below the document', () => {
    const twoParagraphs = () =>
      createContent([
        { id: 'p1', type: 'document.paragraph', state: { text: 'First' } },
        { id: 'p2', type: 'document.paragraph', state: { text: 'Second' } },
      ])

    describe('when the padding is clicked (success flow via mouse)', () => {
      it('to be: the last text block is focused at its end — nothing is created', async () => {
        const user = userEvent.setup()
        const { container, onContentChange } = renderEditor(twoParagraphs())

        const padding = container.querySelector('[data-editor-clickable-padding]')
        expect(padding).not.toBeNull()
        await user.click(padding as HTMLElement)

        expect(blockIds(container)).toEqual(['p1', 'p2'])
        expect(onContentChange).not.toHaveBeenCalled()
        expect(screen.getByTestId('focused-block-editor').closest('[data-block-id]')).toHaveAttribute(
          'data-block-id',
          'p2',
        )
      })
    })

    describe('when readOnly (EP: permission-gated partition)', () => {
      it('to be: no padding, no mount normalization', () => {
        const { container, onContentChange } = renderEditor(
          createContent([{ id: 'divider-1', type: 'document.divider' }]),
          { readOnly: true },
        )

        expect(container.querySelector('[data-editor-clickable-padding]')).toBeNull()
        expect(blockIds(container)).toEqual(['divider-1'])
        expect(onContentChange).not.toHaveBeenCalled()
      })
    })
  })

  describe('as is: focus at start of a heading', () => {
    const headingDoc = () =>
      createContent([
        { id: 'h1', type: 'document.heading', state: { text: 'Title' }, attributes: { level: 1 } },
        { id: 'p1', type: 'document.paragraph', state: { text: 'Body' } },
      ])

    describe('when Enter is pressed (EP: Notion split-type policy)', () => {
      it('to be: the continuation block is normalized to a paragraph', async () => {
        const user = userEvent.setup()
        const { onContentChange } = renderEditor(headingDoc())

        await user.click(screen.getByText('Title'))
        await user.keyboard('{Enter}')

        const patches = onContentChange.mock.calls[0][1]
        expect(stripPatchOrigins(patches)).toEqual([
          { type: 'block.split', blockId: 'h1', offset: 0, newBlockId: 'gen-1' },
          { type: 'block.setType', blockId: 'gen-1', blockType: 'document.paragraph' },
        ])
      })
    })
  })
})
