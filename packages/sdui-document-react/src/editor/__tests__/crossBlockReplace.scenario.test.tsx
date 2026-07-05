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

// jsdom userEvent cannot drive a cross-block native selection (no focused
// contenteditable owns it), so the selection is built directly and the key is
// dispatched on document — the same path the real document-level listener sees.
function selectAcross(container: HTMLElement, from: [string, number], to: [string, number]) {
  const range = document.createRange()
  range.setStart(textNode(container, from[0]), from[1])
  range.setEnd(textNode(container, to[0]), to[1])
  const selection = document.getSelection()!
  selection.removeAllRanges()
  selection.addRange(range)
}

function childIds(content: SduiDocumentContent): string[] {
  return (content.root.children ?? []).map((child) => child.id)
}

function blockText(content: SduiDocumentContent, id: string): string {
  return (content.root.children?.find((child) => child.id === id)?.state?.text as string) ?? ''
}

describe('SduiDocumentEditor cross-block replace/Enter', () => {
  describe('as is: a native selection spans aa|a … c|cc (blocks a, b, c)', () => {
    describe('when a printable character is typed', () => {
      it('to be: the range is replaced by that character, merged into the start block', () => {
        const onContentChange = jest.fn()
        const { container } = render(
          <SduiDocumentEditor content={threeParagraphs()} onContentChange={onContentChange} />,
        )

        selectAcross(container, ['a', 2], ['c', 1])
        fireEvent.keyDown(document, { key: 'X' })

        const next = onContentChange.mock.calls.at(-1)?.[0] as SduiDocumentContent
        expect(childIds(next)).toEqual(['a']) // b, c removed
        expect(blockText(next, 'a')).toBe('aaXcc') // prefix + typed + suffix
      })
    })

    describe('when Enter is pressed', () => {
      it('to be: the range collapses like a delete, without splitting a new block', () => {
        const onContentChange = jest.fn()
        const { container } = render(
          <SduiDocumentEditor content={threeParagraphs()} onContentChange={onContentChange} />,
        )

        selectAcross(container, ['a', 2], ['c', 1])
        fireEvent.keyDown(document, { key: 'Enter' })

        const next = onContentChange.mock.calls.at(-1)?.[0] as SduiDocumentContent
        expect(childIds(next)).toEqual(['a'])
        expect(blockText(next, 'a')).toBe('aacc')
      })
    })

    describe('when a modifier+character (Ctrl+A) is pressed', () => {
      it('to be: it is not treated as text input (no replacement)', () => {
        const onContentChange = jest.fn()
        const { container } = render(
          <SduiDocumentEditor content={threeParagraphs()} onContentChange={onContentChange} />,
        )

        selectAcross(container, ['a', 2], ['c', 1])
        fireEvent.keyDown(document, { key: 'a', ctrlKey: true })

        expect(onContentChange).not.toHaveBeenCalled()
      })
    })
  })

  describe('as is: a collapsed caret (no range) inside one block', () => {
    describe('when a printable character is typed at the document level', () => {
      it('to be: the range handler ignores it (single-block editing is the PM editor’s job)', () => {
        const onContentChange = jest.fn()
        const { container } = render(
          <SduiDocumentEditor content={threeParagraphs()} onContentChange={onContentChange} />,
        )

        const range = document.createRange()
        range.setStart(textNode(container, 'a'), 1)
        range.collapse(true)
        const selection = document.getSelection()!
        selection.removeAllRanges()
        selection.addRange(range)

        fireEvent.keyDown(document, { key: 'X' })
        expect(onContentChange).not.toHaveBeenCalled()
      })
    })
  })
})
