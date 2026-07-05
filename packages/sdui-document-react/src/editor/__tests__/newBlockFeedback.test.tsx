import type { SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { SduiDocumentEditor } from '../SduiDocumentEditor'

function twoParagraphs(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        { id: 'p1', type: 'document.paragraph', state: { text: 'First' } },
        { id: 'p2', type: 'document.paragraph', state: { text: 'Second' } },
      ],
    }),
  }
}

function renderEditor(content: SduiDocumentContent) {
  const ids = ['gen-1', 'gen-2', 'gen-3']
  return render(<SduiDocumentEditor content={content} generateBlockId={() => ids.shift() ?? 'gen-x'} />)
}

function row(container: HTMLElement, id: string): HTMLElement {
  return container.querySelector(`[data-block-id="${id}"]`) as HTMLElement
}

describe('new block feedback', () => {
  test('the focused text block row is marked data-focused; others are not', async () => {
    const user = userEvent.setup()
    const { container } = renderEditor(twoParagraphs())

    await user.click(screen.getByText('First'))

    expect(row(container, 'p1')).toHaveAttribute('data-focused')
    expect(row(container, 'p2')).not.toHaveAttribute('data-focused')
  })

  test("clicking '+' marks the newly inserted block data-just-inserted", () => {
    const { container } = renderEditor(twoParagraphs())

    const plus = container.querySelector('[data-block-id="p1"] [data-plus-handle]') as HTMLElement
    fireEvent.click(plus)

    expect(row(container, 'gen-1')).toHaveAttribute('data-just-inserted')
  })

  test('the just-inserted mark clears once focus moves to another block', async () => {
    const user = userEvent.setup()
    const { container } = renderEditor(twoParagraphs())

    const plus = container.querySelector('[data-block-id="p1"] [data-plus-handle]') as HTMLElement
    fireEvent.click(plus)
    expect(row(container, 'gen-1')).toHaveAttribute('data-just-inserted')

    await user.click(screen.getByText('Second'))

    expect(row(container, 'gen-1')).not.toHaveAttribute('data-just-inserted')
  })
})
