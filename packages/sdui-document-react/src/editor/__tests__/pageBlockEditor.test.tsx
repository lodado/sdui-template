import type { SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock, PAGE_BLOCK_TYPE } from '@lodado/sdui-document'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { EditorView } from 'prosemirror-view'
import React from 'react'

import { SduiDocumentEditor } from '../SduiDocumentEditor'

function createContent(children: Parameters<typeof createDocumentBlock>[0][]): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({ id: 'root', type: 'document.root', children }),
  }
}

const twoParagraphs = () =>
  createContent([
    { id: 'p1', type: 'document.paragraph', state: { text: 'First' } },
    { id: 'p2', type: 'document.paragraph', state: { text: '' } },
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

function lastContent(onContentChange: jest.Mock): SduiDocumentContent {
  return onContentChange.mock.calls[onContentChange.mock.calls.length - 1][0]
}

function findChild(content: SduiDocumentContent, id: string) {
  return (content.root.children ?? []).find((child) => child.id === id)
}

function typeIntoFocusedBlock(text: string): void {
  const host = screen.getByTestId('focused-block-editor') as HTMLElement & { pmView?: EditorView }
  const view = host.pmView
  if (!view) {
    throw new Error('pmView test handle missing')
  }

  act(() => {
    view.dispatch(view.state.tr.insertText(text, view.state.selection.from))
  })
}

function pressKeyOnFocusedBlock(key: string): void {
  fireEvent.keyDown(screen.getByTestId('focused-block-editor'), { key })
}

describe('page block editor integration', () => {
  describe('as is: /page slash insert (EP: onCreatePage provided vs absent vs failing)', () => {
    test('to be: creates a document and converts the empty block into a page block', async () => {
      const user = userEvent.setup()
      const onCreatePage = jest.fn().mockResolvedValue({ documentId: 'doc-new', title: 'New page' })
      const { container, onContentChange } = renderEditor(twoParagraphs(), { onCreatePage })

      const p2Static = container.querySelector('[data-block-id="p2"] [data-inline-root]') as HTMLElement
      await user.click(p2Static)
      typeIntoFocusedBlock('/page')
      pressKeyOnFocusedBlock('Enter')

      await waitFor(() => {
        const converted = findChild(lastContent(onContentChange), 'p2')
        expect(converted?.type).toBe(PAGE_BLOCK_TYPE)
        expect(converted?.attributes?.documentId).toBe('doc-new')
        expect(converted?.state?.text).toBe('New page')
      })
      expect(onCreatePage).toHaveBeenCalledTimes(1)
    })

    test('to be: without onCreatePage the Page menu item is hidden', async () => {
      const user = userEvent.setup()
      const { container } = renderEditor(twoParagraphs())

      const p2Static = container.querySelector('[data-block-id="p2"] [data-inline-root]') as HTMLElement
      await user.click(p2Static)
      typeIntoFocusedBlock('/page')

      await waitFor(() => expect(screen.getByRole('listbox', { name: 'Insert block' })).toBeInTheDocument())
      expect(screen.queryByRole('option', { name: /^Page/ })).not.toBeInTheDocument()
    })

    test('to be: a failing onCreatePage leaves the block unchanged', async () => {
      const user = userEvent.setup()
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {})
      const onCreatePage = jest.fn().mockRejectedValue(new Error('server down'))
      const { container, onContentChange } = renderEditor(twoParagraphs(), { onCreatePage })

      const p2Static = container.querySelector('[data-block-id="p2"] [data-inline-root]') as HTMLElement
      await user.click(p2Static)
      typeIntoFocusedBlock('/page')
      pressKeyOnFocusedBlock('Enter')

      await waitFor(() => expect(onCreatePage).toHaveBeenCalled())
      await act(async () => {
        await Promise.resolve()
      })

      const p2 = onContentChange.mock.calls.length > 0 ? findChild(lastContent(onContentChange), 'p2') : undefined
      expect(p2?.type ?? 'document.paragraph').toBe('document.paragraph')
      warn.mockRestore()
    })
  })

  describe('as is: deleting a page block (EP: onArchivePage wiring)', () => {
    const withPageBlock = () =>
      createContent([
        { id: 'p1', type: 'document.paragraph', state: { text: 'First' } },
        { id: 'pg', type: PAGE_BLOCK_TYPE, state: { text: 'Sub page' }, attributes: { documentId: 'doc-sub' } },
        { id: 'p2', type: 'document.paragraph', state: { text: '' } },
      ])

    test('to be: deleting the block archives its target document', async () => {
      const user = userEvent.setup()
      const onArchivePage = jest.fn()
      const { container, onContentChange } = renderEditor(withPageBlock(), { onArchivePage })

      // ⠿ handle opens the block-actions menu (also selects the block) → Delete
      const handle = container.querySelector('[data-block-id="pg"] [data-drag-handle]') as HTMLElement
      await user.click(handle)
      await user.click(screen.getByRole('menuitem', { name: 'Delete' }))

      await waitFor(() => expect(findChild(lastContent(onContentChange), 'pg')).toBeUndefined())
      expect(onArchivePage).toHaveBeenCalledWith('doc-sub')
    })

    test('to be: deleting a subtree archives nested page blocks too', async () => {
      const user = userEvent.setup()
      const onArchivePage = jest.fn()
      const content = createContent([
        {
          id: 'tg',
          type: 'document.toggle',
          state: { text: 'Wrap' },
          children: [
            { id: 'pg1', type: PAGE_BLOCK_TYPE, state: { text: 'A' }, attributes: { documentId: 'doc-a' } },
            { id: 'pg2', type: PAGE_BLOCK_TYPE, state: { text: 'B' }, attributes: { documentId: 'doc-b' } },
          ],
        },
        { id: 'p2', type: 'document.paragraph', state: { text: '' } },
      ])
      const { container, onContentChange } = renderEditor(content, { onArchivePage })

      const handle = container.querySelector('[data-block-id="tg"] [data-drag-handle]') as HTMLElement
      await user.click(handle)
      await user.click(screen.getByRole('menuitem', { name: 'Delete' }))

      await waitFor(() => expect(findChild(lastContent(onContentChange), 'tg')).toBeUndefined())
      expect(onArchivePage).toHaveBeenCalledWith('doc-a')
      expect(onArchivePage).toHaveBeenCalledWith('doc-b')
    })
  })
})
