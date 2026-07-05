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

/** First text node inside a block's inline content. */
function textNode(container: HTMLElement, blockId: string): Text {
  const root = container.querySelector(`[data-block-id="${blockId}"] [data-inline-root]`) as HTMLElement
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  return walker.nextNode() as Text
}

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
  const block = content.root.children?.find((child) => child.id === id)
  return (block?.state?.text as string) ?? ''
}

describe('cross-block Backspace (Notion merge)', () => {
  test('deletes the range and merges the start prefix with the end suffix', () => {
    const onContentChange = jest.fn()
    const { container } = render(<SduiDocumentEditor content={threeParagraphs()} onContentChange={onContentChange} />)

    // select from 'aa|a' (offset 2) through 'c|cc' (offset 1)
    selectAcross(container, ['a', 2], ['c', 1])
    fireEvent.keyDown(document, { key: 'Backspace' })

    const next = onContentChange.mock.calls.at(-1)?.[0] as SduiDocumentContent
    expect(childIds(next)).toEqual(['a'])
    expect(blockText(next, 'a')).toBe('aacc')
  })

  test('ignores a collapsed selection (no cross-block range)', () => {
    const onContentChange = jest.fn()
    const { container } = render(<SduiDocumentEditor content={threeParagraphs()} onContentChange={onContentChange} />)

    const range = document.createRange()
    range.setStart(textNode(container, 'a'), 1)
    range.collapse(true)
    const selection = document.getSelection()!
    selection.removeAllRanges()
    selection.addRange(range)

    fireEvent.keyDown(document, { key: 'Backspace' })
    expect(onContentChange).not.toHaveBeenCalled()
  })
})
