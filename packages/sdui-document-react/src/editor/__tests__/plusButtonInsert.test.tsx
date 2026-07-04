import type { SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

describe("'+' gutter button", () => {
  test('click inserts a paragraph below the block, focuses it, opens the menu', async () => {
    const user = userEvent.setup()
    const { container } = renderEditor(twoParagraphs())

    await user.click(screen.getByLabelText('Add block below p1'))

    expect(blockIds(container)).toEqual(['p1', 'gen-1', 'p2'])
    expect(screen.getByTestId('focused-block-editor').closest('[data-block-id]')).toHaveAttribute(
      'data-block-id',
      'gen-1',
    )
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  test('selecting heading in the +-opened menu converts the new block, no stray slash remains', async () => {
    const user = userEvent.setup()
    const { container, onContentChange } = renderEditor(twoParagraphs())

    await user.click(screen.getByLabelText('Add block below p1'))
    fireEvent.keyDown(screen.getByTestId('focused-block-editor'), { key: 'Enter' })

    // first menu item is Text (paragraph) — pick a heading instead via click
    await user.click(screen.getByLabelText('Add block below p2'))
    await user.click(screen.getByRole('option', { name: /heading 1/i }))

    const doc = onContentChange.mock.calls[onContentChange.mock.calls.length - 1][0] as SduiDocumentContent
    const inserted = (doc.root.children ?? []).find((child) => child.id === 'gen-2')
    expect(inserted?.type).toBe('document.heading')
    expect(inserted?.state?.text ?? '').toBe('')
    expect(container.querySelector('[data-block-id="gen-2"] h1')).not.toBeNull()
  })

  test('readOnly editor renders no plus handles', () => {
    const { container } = renderEditor(twoParagraphs(), { readOnly: true })
    expect(container.querySelector('[data-plus-handle]')).toBeNull()
  })

  test('undo after + insert removes the new block again', async () => {
    const user = userEvent.setup()
    const { container } = renderEditor(twoParagraphs())

    await user.click(screen.getByLabelText('Add block below p1'))
    expect(blockIds(container)).toEqual(['p1', 'gen-1', 'p2'])

    // close the menu, then undo: the first Mod-Z clears the auto-typed '/'
    // from the PM inline history, the second bubbles up and rolls back the
    // block.insert (same two-tier order as every other inline edit)
    fireEvent.keyDown(screen.getByTestId('focused-block-editor'), { key: 'Escape' })
    await user.keyboard('{Control>}z{/Control}')
    await user.keyboard('{Control>}z{/Control}')

    expect(blockIds(container)).toEqual(['p1', 'p2'])
  })
})
