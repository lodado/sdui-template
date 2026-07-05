import type { SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { SduiDocumentEditor,type SduiDocumentEditorApi } from '../SduiDocumentEditor'

function createContent(children: Parameters<typeof createDocumentBlock>[0][]): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({ id: 'root', type: 'document.root', children }),
  }
}

const twoParagraphs = () =>
  createContent([
    { id: 'p1', type: 'document.paragraph', state: { text: 'First' } },
    { id: 'p2', type: 'document.paragraph', state: { text: 'Second' } },
  ])

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

describe('document-level undo/redo (Mod-Z / Mod-Shift-Z / Mod-Y)', () => {
  describe('as is: a block was split via Enter', () => {
    describe('when Ctrl-Z is pressed (PM session history is empty, key bubbles up)', () => {
      it('to be: the split is rolled back and the merge target regains focus', async () => {
        const user = userEvent.setup()
        const { container } = renderEditor(twoParagraphs())

        await user.click(screen.getByText('First'))
        await user.keyboard('{Enter}')
        expect(blockIds(container)).toEqual(['p1', 'gen-1', 'p2'])

        await user.keyboard('{Control>}z{/Control}')

        expect(blockIds(container)).toEqual(['p1', 'p2'])
        expect(screen.getByTestId('focused-block-editor').closest('[data-block-id]')).toHaveAttribute(
          'data-block-id',
          'p1',
        )
      })
    })

    describe('when Ctrl-Shift-Z is pressed after the undo', () => {
      it('to be: the split is replayed exactly', async () => {
        const user = userEvent.setup()
        const { container } = renderEditor(twoParagraphs())

        await user.click(screen.getByText('First'))
        await user.keyboard('{Enter}')
        await user.keyboard('{Control>}z{/Control}')
        await user.keyboard('{Control>}{Shift>}z{/Shift}{/Control}')

        expect(blockIds(container)).toEqual(['p1', 'gen-1', 'p2'])
      })
    })

    describe('when a fresh edit lands after an undo (EP: history fork)', () => {
      it('to be: the redo stack is cleared — Ctrl-Y does nothing', async () => {
        const user = userEvent.setup()
        const { container } = renderEditor(twoParagraphs())

        await user.click(screen.getByText('First'))
        await user.keyboard('{Enter}')
        await user.keyboard('{Control>}z{/Control}')

        await user.click(screen.getByText('Second'))
        await user.keyboard('{Enter}')
        expect(blockIds(container)).toEqual(['p1', 'p2', 'gen-2'])

        await user.keyboard('{Control>}y{/Control}')

        expect(blockIds(container)).toEqual(['p1', 'p2', 'gen-2'])
      })
    })
  })

  describe('as is: heading split into heading + normalized paragraph', () => {
    describe('when Ctrl-Z is pressed', () => {
      it('to be: the whole batch (split + setType) reverts in one step', async () => {
        const user = userEvent.setup()
        const { container } = renderEditor(
          createContent([
            { id: 'h1', type: 'document.heading', state: { text: 'Title' }, attributes: { level: 2 } },
            { id: 'p1', type: 'document.paragraph', state: { text: 'Body' } },
          ]),
        )

        await user.click(screen.getByText('Title'))
        await user.keyboard('{Enter}')
        expect(blockIds(container)).toEqual(['h1', 'gen-1', 'p1'])

        await user.keyboard('{Control>}z{/Control}')

        expect(blockIds(container)).toEqual(['h1', 'p1'])
        // heading survives the round-trip with its level attribute intact
        expect(container.querySelector('[data-block-id="h1"] h2')).not.toBeNull()
      })
    })
  })

  describe('as is: trailing-block invariant fired on delete (divider was last)', () => {
    describe('when Ctrl-Z is pressed (EP: invariant must not re-fire during history)', () => {
      it('to be: document returns to its exact pre-delete shape, no extra trailing block', async () => {
        const user = userEvent.setup()
        const { container, onContentChange } = renderEditor(
          createContent([
            { id: 'divider-1', type: 'document.divider' },
            { id: 'p1', type: 'document.paragraph', state: { text: 'Tail' } },
          ]),
        )

        await user.click(screen.getByLabelText('Drag block p1'))
        await user.keyboard('{Backspace}')
        expect(blockIds(container)).toEqual(['divider-1', 'gen-1'])

        await user.keyboard('{Control>}z{/Control}')

        expect(blockIds(container)).toEqual(['divider-1', 'p1'])
        // undo emitted exactly the inverse batch — no invariant patch rode along
        const undoPatches = onContentChange.mock.calls[1][1]
        expect(undoPatches.map((patch: { type: string }) => patch.type)).toEqual(['block.delete', 'block.insert'])
      })
    })
  })

  describe('as is: readOnly document (EP: permission-gated partition)', () => {
    describe('when Ctrl-Z is pressed', () => {
      it('to be: nothing happens', async () => {
        const user = userEvent.setup()
        const { container, onContentChange } = renderEditor(twoParagraphs(), { readOnly: true })

        await user.click(screen.getByText('First'))
        await user.keyboard('{Control>}z{/Control}')

        expect(blockIds(container)).toEqual(['p1', 'p2'])
        expect(onContentChange).not.toHaveBeenCalled()
      })
    })
  })

  describe('imperative apiRef (host chrome)', () => {
    it('getContent returns the live doc and undo reverts a patch', async () => {
      const user = userEvent.setup()
      const api = React.createRef<SduiDocumentEditorApi>()
      const ids = ['gen-1', 'gen-2', 'gen-3']
      const { container } = render(
        <SduiDocumentEditor content={twoParagraphs()} apiRef={api} generateBlockId={() => ids.shift() ?? 'gen-x'} />,
      )

      await user.click(screen.getByText('First'))
      await user.keyboard('{Enter}')
      expect(blockIds(container)).toEqual(['p1', 'gen-1', 'p2'])

      const snapshot = api.current?.getContent()
      expect(snapshot?.root.children?.map((child) => child.id)).toEqual(['p1', 'gen-1', 'p2'])

      act(() => api.current?.undo())
      expect(blockIds(container)).toEqual(['p1', 'p2'])
    })
  })
})
