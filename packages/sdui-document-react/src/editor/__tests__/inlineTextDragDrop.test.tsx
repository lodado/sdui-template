import type { SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'
import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import { SduiDocumentEditor } from '../SduiDocumentEditor'

/**
 * Fixture tree:
 * root
 * ├── a "Hello world"
 * ├── b "Target"
 * └── d (divider)
 */
function createContent(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({
          id: 'a',
          type: 'document.paragraph',
          state: { content: [{ type: 'text', text: 'Hello world' }], text: 'Hello world' },
        }),
        createDocumentBlock({
          id: 'b',
          type: 'document.paragraph',
          state: { content: [{ type: 'text', text: 'Target' }], text: 'Target' },
        }),
        createDocumentBlock({ id: 'd', type: 'document.divider' }),
      ],
    }),
  }
}

type DataTransferMock = {
  types: string[]
  effectAllowed: string
  dropEffect: string
  setData(type: string, value: string): void
  getData(type: string): string
}

function createDataTransferMock(): DataTransferMock {
  const data = new Map<string, string>()

  return {
    types: [],
    effectAllowed: '',
    dropEffect: '',
    setData(type, value) {
      data.set(type, value)
      if (!this.types.includes(type)) {
        this.types.push(type)
      }
    },
    getData(type) {
      return data.get(type) ?? ''
    },
  }
}

function inlineRoot(container: HTMLElement, blockId: string): HTMLElement {
  const root = container.querySelector<HTMLElement>(`[data-block-id="${blockId}"] [data-inline-root]`)
  if (!root) {
    throw new Error(`inline root for block ${blockId} not found`)
  }

  return root
}

function selectRange(node: Node, from: number, to: number): void {
  const range = document.createRange()
  range.setStart(node, from)
  range.setEnd(node, to)
  const selection = window.getSelection()!
  selection.removeAllRanges()
  selection.addRange(range)
}

/** Points the caret API at a fixed DOM position for the next dragover/drop. */
function mockCaretAt(node: Node, offset: number): void {
  const documentWithCaret = document as Document & { caretRangeFromPoint?: (x: number, y: number) => Range }
  documentWithCaret.caretRangeFromPoint = () => {
    const range = document.createRange()
    range.setStart(node, offset)
    range.collapse(true)

    return range
  }
}

afterEach(() => {
  delete (document as Document & { caretRangeFromPoint?: unknown }).caretRangeFromPoint
})

describe('inline text drag and drop', () => {
  describe('as is: selection "Hello" in static block a, drop into block b at offset 3', () => {
    it('to be: text moves out of a into b, caret block is b', () => {
      const onContentChange = jest.fn()
      const { container } = render(<SduiDocumentEditor content={createContent()} onContentChange={onContentChange} />)

      const sourceRoot = inlineRoot(container, 'a')
      selectRange(sourceRoot.firstChild!, 0, 5)

      const dataTransfer = createDataTransferMock()
      fireEvent.dragStart(sourceRoot, { dataTransfer })

      expect(dataTransfer.types).toContain('application/x-sdui-inline')
      expect(dataTransfer.getData('text/plain')).toBe('Hello')

      const targetRoot = inlineRoot(container, 'b')
      mockCaretAt(targetRoot.firstChild!, 3)
      fireEvent.drop(targetRoot, { dataTransfer, clientX: 10, clientY: 10 })

      expect(onContentChange).toHaveBeenCalled()
      const [next] = onContentChange.mock.calls[onContentChange.mock.calls.length - 1]
      const blocks = next.root.children
      expect(blocks[0].state.text).toBe(' world')
      expect(blocks[1].state.text).toBe('TarHelloget')

      // drop target gets focused with the caret after the fragment
      expect(container.querySelector('[data-block-id="b"] [data-testid="focused-block-editor"]')).not.toBeNull()
    })
  })

  describe('as is: same drag with Alt held (copy semantics)', () => {
    it('to be: source keeps its text, target receives the fragment', () => {
      const onContentChange = jest.fn()
      const { container } = render(<SduiDocumentEditor content={createContent()} onContentChange={onContentChange} />)

      const sourceRoot = inlineRoot(container, 'a')
      selectRange(sourceRoot.firstChild!, 6, 11)

      const dataTransfer = createDataTransferMock()
      fireEvent.dragStart(sourceRoot, { dataTransfer })

      const targetRoot = inlineRoot(container, 'b')
      mockCaretAt(targetRoot.firstChild!, 6)
      // fireEvent.drop drops altKey in jsdom — dispatch a real MouseEvent
      const dropEvent = new MouseEvent('drop', {
        bubbles: true,
        cancelable: true,
        clientX: 10,
        clientY: 10,
        altKey: true,
      })
      Object.defineProperty(dropEvent, 'dataTransfer', { value: dataTransfer })
      targetRoot.dispatchEvent(dropEvent)

      const [next] = onContentChange.mock.calls[onContentChange.mock.calls.length - 1]
      expect(next.root.children[0].state.text).toBe('Hello world')
      expect(next.root.children[1].state.text).toBe('Targetworld')
    })
  })

  describe('as is: drop lands on a divider block (non-text target)', () => {
    it('to be: nothing changes', () => {
      const onContentChange = jest.fn()
      const { container } = render(<SduiDocumentEditor content={createContent()} onContentChange={onContentChange} />)

      const sourceRoot = inlineRoot(container, 'a')
      selectRange(sourceRoot.firstChild!, 0, 5)

      const dataTransfer = createDataTransferMock()
      fireEvent.dragStart(sourceRoot, { dataTransfer })

      const dividerRow = container.querySelector('[data-block-id="d"] [data-block-row]')!
      fireEvent.drop(dividerRow, { dataTransfer, clientX: 10, clientY: 10 })

      expect(onContentChange).not.toHaveBeenCalled()
    })
  })

  describe('as is: collapsed selection (plain click, no selected text)', () => {
    it('to be: dragstart is ignored, no session is written to dataTransfer', () => {
      const { container } = render(<SduiDocumentEditor content={createContent()} />)

      const sourceRoot = inlineRoot(container, 'a')
      selectRange(sourceRoot.firstChild!, 2, 2)

      const dataTransfer = createDataTransferMock()
      fireEvent.dragStart(sourceRoot, { dataTransfer })

      expect(dataTransfer.types).not.toContain('application/x-sdui-inline')
    })
  })

  describe('as is: static block with an active text selection', () => {
    it('to be: clicking does not steal focus (selection survives for dragging)', () => {
      const { container } = render(<SduiDocumentEditor content={createContent()} />)

      const sourceRoot = inlineRoot(container, 'a')
      selectRange(sourceRoot.firstChild!, 0, 5)
      fireEvent.click(sourceRoot)

      expect(container.querySelector('[data-testid="focused-block-editor"]')).toBeNull()
    })
  })
})
