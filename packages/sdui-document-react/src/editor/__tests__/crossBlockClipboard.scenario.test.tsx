import type { SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'
import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import { SduiDocumentEditor } from '../SduiDocumentEditor'

function threeParagraphs(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        { id: 'a', type: 'document.paragraph', state: { text: 'aaa' } },
        { id: 'b', type: 'document.paragraph', state: { text: 'bbb' } },
        { id: 'c', type: 'document.paragraph', state: { text: 'ccc' } },
      ],
    }),
  }
}

function textNode(container: HTMLElement, blockId: string): Text {
  const root = container.querySelector(`[data-block-id="${blockId}"] [data-inline-root]`) as HTMLElement
  return document.createTreeWalker(root, NodeFilter.SHOW_TEXT).nextNode() as Text
}

function selectAcross(container: HTMLElement, from: [string, number], to: [string, number]) {
  const range = document.createRange()
  range.setStart(textNode(container, from[0]), from[1])
  range.setEnd(textNode(container, to[0]), to[1])
  const selection = document.getSelection()!
  selection.removeAllRanges()
  selection.addRange(range)
}

// jsdom lacks a full ClipboardEvent/DataTransfer, so dispatch a plain cancelable
// Event with a minimal clipboardData shim — the same surface the handler uses.
// Pass a previous dispatch's `store` to round-trip a copy into a later paste.
function dispatchClipboard(type: 'copy' | 'cut' | 'paste', seedText = '', store = new Map<string, string>()) {
  if (seedText) {
    store.set('text/plain', seedText)
  }
  const event = new Event(type, { cancelable: true, bubbles: true }) as Event & { clipboardData: unknown }
  event.clipboardData = {
    setData: (mime: string, value: string) => store.set(mime, value),
    getData: (mime: string) => store.get(mime) ?? '',
  }
  document.dispatchEvent(event)
  return { event, store }
}

function childIds(content: SduiDocumentContent): string[] {
  return (content.root.children ?? []).map((child) => child.id)
}

function blockText(content: SduiDocumentContent, id: string): string {
  return (content.root.children?.find((child) => child.id === id)?.state?.text as string) ?? ''
}

type InlineNode = { type: string; text?: string; marks?: Array<{ type: string }> }

function blockContent(content: SduiDocumentContent, id: string): InlineNode[] {
  return (content.root.children?.find((child) => child.id === id)?.state?.content ?? []) as InlineNode[]
}

describe('SduiDocumentEditor cross-block clipboard', () => {
  describe('as is: a native selection spans aa|a … c|cc (blocks a, b, c)', () => {
    describe('when copy is dispatched', () => {
      it('to be: the covered slice of each block is written, newline-joined, doc unchanged', () => {
        const onContentChange = jest.fn()
        const { container } = render(
          <SduiDocumentEditor content={threeParagraphs()} onContentChange={onContentChange} />,
        )

        selectAcross(container, ['a', 2], ['c', 1])
        const { event, store } = dispatchClipboard('copy')

        expect(event.defaultPrevented).toBe(true)
        expect(store.get('text/plain')).toBe('a\nbbb\nc')
        expect(onContentChange).not.toHaveBeenCalled() // copy never mutates
      })
    })

    describe('when cut is dispatched', () => {
      it('to be: the slice is written AND the range is deleted (merged)', () => {
        const onContentChange = jest.fn()
        const { container } = render(
          <SduiDocumentEditor content={threeParagraphs()} onContentChange={onContentChange} />,
        )

        selectAcross(container, ['a', 2], ['c', 1])
        const { store } = dispatchClipboard('cut')

        expect(store.get('text/plain')).toBe('a\nbbb\nc')
        const next = onContentChange.mock.calls.at(-1)?.[0] as SduiDocumentContent
        expect(childIds(next)).toEqual(['a'])
        expect(blockText(next, 'a')).toBe('aacc')
      })
    })

    describe('when paste is dispatched with clipboard text', () => {
      it('to be: the range is replaced by the pasted text, merged into the start block', () => {
        const onContentChange = jest.fn()
        const { container } = render(
          <SduiDocumentEditor content={threeParagraphs()} onContentChange={onContentChange} />,
        )

        selectAcross(container, ['a', 2], ['c', 1])
        dispatchClipboard('paste', 'XY')

        const next = onContentChange.mock.calls.at(-1)?.[0] as SduiDocumentContent
        expect(childIds(next)).toEqual(['a'])
        expect(blockText(next, 'a')).toBe('aaXYcc')
      })
    })
  })

  describe('as is: no cross-block selection (collapsed caret)', () => {
    describe('when copy is dispatched', () => {
      it('to be: the handler defers to the browser (event not consumed)', () => {
        const { container } = render(<SduiDocumentEditor content={threeParagraphs()} />)

        const range = document.createRange()
        range.setStart(textNode(container, 'a'), 1)
        range.collapse(true)
        const selection = document.getSelection()!
        selection.removeAllRanges()
        selection.addRange(range)

        const { event } = dispatchClipboard('copy')
        expect(event.defaultPrevented).toBe(false)
      })
    })
  })

  describe('as is: blocks a+b carry a bold mark (seeded via the real Cmd+B range path)', () => {
    describe('when the marked range is copied and that store is pasted over b[0]..c[1]', () => {
      it('to be: copy writes the private inline mime; the paste preserves marks and hard breaks', () => {
        const onContentChange = jest.fn()
        const { container } = render(
          <SduiDocumentEditor content={threeParagraphs()} onContentChange={onContentChange} />,
        )

        selectAcross(container, ['a', 0], ['b', 3])
        fireEvent.keyDown(document, { key: 'b', ctrlKey: true }) // bold a+b

        // copy: the store now carries text/plain AND application/x-sdui-inline
        selectAcross(container, ['a', 0], ['b', 3])
        const { store } = dispatchClipboard('copy')
        expect(store.get('text/plain')).toBe('aaa\nbbb')
        expect(JSON.parse(store.get('application/x-sdui-inline') ?? 'null')).toEqual([
          expect.objectContaining({ type: 'text', text: 'aaa', marks: [{ type: 'bold' }] }),
          expect.objectContaining({ type: 'hard_break' }),
          expect.objectContaining({ type: 'text', text: 'bbb', marks: [{ type: 'bold' }] }),
        ])

        // paste the SAME captured store over a different cross-block range
        selectAcross(container, ['b', 0], ['c', 1])
        dispatchClipboard('paste', '', store)

        const next = onContentChange.mock.calls.at(-1)?.[0] as SduiDocumentContent
        expect(childIds(next)).toEqual(['a', 'b'])
        // rich (mark-preserving) path won over the plain-text fallback
        const pasted = blockContent(next, 'b')
        expect(pasted.map((node) => node.type)).toEqual(['text', 'hard_break', 'text', 'text'])
        expect(pasted.map((node) => node.text ?? '')).toEqual(['aaa', '', 'bbb', 'cc'])
        expect(pasted.map((node) => (node.marks ?? []).map((mark) => mark.type))).toEqual([
          ['bold'],
          [],
          ['bold'],
          [], // the tail slice of c was never bolded
        ])
      })
    })
  })
})
