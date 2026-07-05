import type { SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'
import { fireEvent, render, screen } from '@testing-library/react'
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

function renderEditor(content: SduiDocumentContent, onTurnInto?: (...args: unknown[]) => void) {
  const ids = ['gen-1', 'gen-2', 'gen-3']
  const { container } = render(
    <SduiDocumentEditor content={content} onTurnInto={onTurnInto} generateBlockId={() => ids.shift() ?? 'gen-x'} />,
  )

  return container
}

function blockIds(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('[data-block-id]')).map(
    (element) => element.getAttribute('data-block-id') ?? '',
  )
}

function openMenu(blockId: string) {
  fireEvent.contextMenu(screen.getByLabelText(`Drag block ${blockId}`))
}

describe('block-actions menu (⠿ handle)', () => {
  test('right-clicking the drag handle opens the actions menu', () => {
    renderEditor(twoParagraphs())

    openMenu('p1')

    expect(screen.getByRole('menu', { name: 'Block actions' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toBeInTheDocument()
  })

  test('Duplicate inserts a clone directly below the source block', () => {
    const container = renderEditor(twoParagraphs())

    openMenu('p1')
    fireEvent.click(screen.getByRole('menuitem', { name: 'Duplicate' }))

    const ids = blockIds(container)
    expect(ids).toHaveLength(3)
    expect(ids[0]).toBe('p1')
    expect(ids[2]).toBe('p2')
    expect(ids[1]).not.toBe('p1')
    // menu closes after a terminal action
    expect(screen.queryByRole('menu')).toBeNull()
  })

  test('Delete removes the block', () => {
    const container = renderEditor(twoParagraphs())

    openMenu('p2')
    fireEvent.click(screen.getByRole('menuitem', { name: 'Delete' }))

    expect(blockIds(container)).toEqual(['p1'])
  })

  test('Turn into opens a submenu and converts the block', () => {
    const onTurnInto = jest.fn()
    renderEditor(twoParagraphs(), onTurnInto)

    openMenu('p1')
    fireEvent.click(screen.getByRole('menuitem', { name: 'Turn into' }))
    // submenu now shows block-type targets
    fireEvent.click(screen.getByRole('menuitem', { name: 'Heading 1' }))

    expect(onTurnInto).toHaveBeenCalledTimes(1)
    expect(onTurnInto.mock.calls[0][0]).toBe('p1')
    expect(onTurnInto.mock.calls[0][1]).toBe('document.heading')
    expect(screen.queryByRole('menu')).toBeNull()
  })

  test('Escape closes the menu', () => {
    renderEditor(twoParagraphs())

    openMenu('p1')
    expect(screen.getByRole('menu', { name: 'Block actions' })).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(screen.queryByRole('menu')).toBeNull()
  })
})
