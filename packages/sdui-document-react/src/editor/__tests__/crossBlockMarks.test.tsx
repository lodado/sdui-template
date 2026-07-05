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

function blockContent(content: SduiDocumentContent, id: string) {
  const block = content.root.children?.find((child) => child.id === id)
  return (block?.state?.content ?? []) as Array<{ type: string; text?: string; marks?: Array<{ type: string }> }>
}

function markTypes(nodes: ReturnType<typeof blockContent>): string[][] {
  return nodes.map((node) => (node.marks ?? []).map((mark) => mark.type))
}

describe('cross-block mark toggle (Cmd+B)', () => {
  test('applies bold to each covered block sub-range, keeping the blocks', () => {
    const onContentChange = jest.fn()
    const { container } = render(<SduiDocumentEditor content={threeParagraphs()} onContentChange={onContentChange} />)

    selectAcross(container, ['a', 2], ['c', 1])
    fireEvent.keyDown(document, { key: 'b', ctrlKey: true })

    const next = onContentChange.mock.calls.at(-1)?.[0] as SduiDocumentContent
    // blocks are retained (mark toggle, not delete)
    expect(next.root.children?.map((child) => child.id)).toEqual(['a', 'b', 'c'])
    // a: 'aa' plain + 'a' bold
    expect(markTypes(blockContent(next, 'a'))).toEqual([[], ['bold']])
    // b: fully bold
    expect(markTypes(blockContent(next, 'b'))).toEqual([['bold']])
    // c: 'c' bold + 'cc' plain
    expect(markTypes(blockContent(next, 'c'))).toEqual([['bold'], []])
  })

  test('a second Cmd+B removes the mark across the whole range', () => {
    const onContentChange = jest.fn()
    const { container } = render(<SduiDocumentEditor content={threeParagraphs()} onContentChange={onContentChange} />)

    selectAcross(container, ['a', 0], ['c', 3])
    fireEvent.keyDown(document, { key: 'b', ctrlKey: true }) // all bold
    selectAcross(container, ['a', 0], ['c', 3])
    fireEvent.keyDown(document, { key: 'b', ctrlKey: true }) // toggle off

    const next = onContentChange.mock.calls.at(-1)?.[0] as SduiDocumentContent
    expect(markTypes(blockContent(next, 'a')).flat()).toEqual([])
    expect(markTypes(blockContent(next, 'b')).flat()).toEqual([])
    expect(markTypes(blockContent(next, 'c')).flat()).toEqual([])
  })
})
