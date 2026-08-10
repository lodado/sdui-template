import { createDocumentBlock, type SduiDocumentContent } from '@lodado/sdui-document'
import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { SduiDocumentEditor } from '../SduiDocumentEditor'

function content(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({ id: 'a', type: 'document.paragraph', position: 'a0', state: { text: 'AAA' } }),
        createDocumentBlock({ id: 'b', type: 'document.paragraph', position: 'a1', state: { text: 'BBB' } }),
      ],
    }),
  }
}

function fire(type: string, clientX: number, clientY: number, target: EventTarget) {
  const event = new MouseEvent(type, { clientX, clientY, button: 0, bubbles: true, cancelable: true })
  act(() => {
    target.dispatchEvent(event)
  })
}

/**
 * Drives the real useBlockPointerDrag gesture end to end against the editor's
 * own store. jsdom has no elementFromPoint, so we point it at block b's row —
 * everything else (threshold, projection, applyPatches, render-store sync,
 * React re-render) runs for real. Reproduces "nodes vanish on drop".
 */
describe('live drop gesture through the editor', () => {
  it('dragging block a onto block b leaves BOTH blocks in the document', () => {
    const { container } = render(<SduiDocumentEditor content={content()} />)

    const handle = container.querySelector('[data-block-id="a"] [data-drag-handle]')
    const bRow = container.querySelector('[data-block-id="b"] [data-block-row]')
    expect(handle).not.toBeNull()
    expect(bRow).not.toBeNull()

    // jsdom has no elementFromPoint — provide one that reports block b's row.
    const original = (document as unknown as { elementFromPoint?: unknown }).elementFromPoint
    ;(document as unknown as { elementFromPoint: (x: number, y: number) => Element | null }).elementFromPoint = () =>
      bRow as Element

    fire('pointerdown', 10, 10, handle!)
    fire('pointermove', 40, 200, window) // past 4px threshold → activate, hit = b
    fire('pointerup', 40, 200, window)
    ;(document as unknown as { elementFromPoint?: unknown }).elementFromPoint = original

    expect(screen.getByText('AAA')).toBeInTheDocument()
    expect(screen.getByText('BBB')).toBeInTheDocument()
  })

  it('restores the focused block when Escape cancels an active drag', async () => {
    const user = userEvent.setup()
    const { container } = render(<SduiDocumentEditor content={content()} />)
    await user.click(screen.getByText('AAA'))

    const handle = container.querySelector('[data-block-id="a"] [data-drag-handle]')
    const bRow = container.querySelector('[data-block-id="b"] [data-block-row]')
    const original = (document as unknown as { elementFromPoint?: unknown }).elementFromPoint
    ;(document as unknown as { elementFromPoint: (x: number, y: number) => Element | null }).elementFromPoint = () =>
      bRow as Element

    fire('pointerdown', 10, 10, handle!)
    fire('pointermove', 40, 200, window)
    expect(container.querySelector('[contenteditable="true"]')).toBeNull()

    fireEvent.keyDown(window, { key: 'Escape' })
    ;(document as unknown as { elementFromPoint?: unknown }).elementFromPoint = original

    expect(screen.getByTestId('focused-block-editor').closest('[data-block-id]')).toHaveAttribute(
      'data-block-id',
      'a',
    )
    expect(handle).not.toHaveAttribute('data-dragging')
  })
})
