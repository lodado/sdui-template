import type { SduiDocumentContent, SduiInlineContent } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'

import { deleteInlineRange } from '../deleteInlineRange'
import { normalizeDocRange } from '../docRange'
import {
  addMarkInRange,
  coveredTextSegments,
  rangeHasMark,
  rangeMarkAttr,
  removeMarkInRange,
} from '../inlineRangeMarks'

const bold = { type: 'bold' as const }

function content(): SduiInlineContent {
  return [
    { type: 'text', text: 'hello' },
    { type: 'text', text: 'X', marks: [bold] },
    { type: 'hard_break' },
    { type: 'text', text: 'end' },
  ]
}

describe('deleteInlineRange', () => {
  test('removes a mid-range slice, preserving marks outside it', () => {
    // offsets: hello=0..5, X=5..6, break=6..7, end=7..10
    expect(deleteInlineRange(content(), 2, 6)).toEqual([
      { type: 'text', text: 'he' },
      { type: 'hard_break' },
      { type: 'text', text: 'end' },
    ])
  })

  test('drops a hard_break inside the range', () => {
    expect(deleteInlineRange(content(), 5, 7)).toEqual([
      { type: 'text', text: 'hello' },
      { type: 'text', text: 'end' },
    ])
  })

  test('deleting everything yields empty content', () => {
    expect(deleteInlineRange(content(), 0, 10)).toEqual([])
  })
})

describe('mark ops', () => {
  test('addMarkInRange marks only the covered slice, splitting the node', () => {
    const result = addMarkInRange([{ type: 'text', text: 'abcd' }], 1, 3, bold)
    expect(result).toEqual([
      { type: 'text', text: 'a' },
      { type: 'text', text: 'bc', marks: [bold] },
      { type: 'text', text: 'd' },
    ])
  })

  test('addMarkInRange replaces a same-type mark (e.g. color update)', () => {
    const red = { type: 'color' as const, attrs: { color: 'red' } }
    const blue = { type: 'color' as const, attrs: { color: 'blue' } }
    const result = addMarkInRange([{ type: 'text', text: 'ab', marks: [red] }], 0, 2, blue)
    expect(result).toEqual([{ type: 'text', text: 'ab', marks: [blue] }])
  })

  test('removeMarkInRange strips the mark and drops an emptied marks array', () => {
    const result = removeMarkInRange([{ type: 'text', text: 'ab', marks: [bold] }], 0, 2, 'bold')
    expect(result).toEqual([{ type: 'text', text: 'ab' }])
  })

  test('rangeHasMark is true only when every covered segment carries the mark', () => {
    const mixed: SduiInlineContent = [
      { type: 'text', text: 'ab', marks: [bold] },
      { type: 'text', text: 'cd' },
    ]
    expect(rangeHasMark(mixed, 0, 2, 'bold')).toBe(true)
    expect(rangeHasMark(mixed, 0, 4, 'bold')).toBe(false)
    expect(rangeHasMark(mixed, 2, 4, 'bold')).toBe(false)
  })

  test('coveredTextSegments returns the sliced covered text', () => {
    expect(coveredTextSegments([{ type: 'text', text: 'abcdef' }], 2, 5)).toEqual([{ type: 'text', text: 'cde' }])
  })
})

describe('rangeMarkAttr', () => {
  const link = (href: string) => ({ type: 'link' as const, attrs: { href } })

  describe('as is: covered segments all carry the same link href', () => {
    describe('when the attr is read', () => {
      it('to be: returns that uniform href', () => {
        const linked: SduiInlineContent = [
          { type: 'text', text: 'ab', marks: [link('https://a.com')] },
          { type: 'text', text: 'cd', marks: [link('https://a.com')] },
        ]
        expect(rangeMarkAttr(linked, 0, 4, 'link', 'href')).toBe('https://a.com')
      })
    })
  })

  describe('as is: covered segments carry different hrefs (mixed selection)', () => {
    describe('when the attr is read', () => {
      it('to be: returns null', () => {
        const linked: SduiInlineContent = [
          { type: 'text', text: 'ab', marks: [link('https://a.com')] },
          { type: 'text', text: 'cd', marks: [link('https://b.com')] },
        ]
        expect(rangeMarkAttr(linked, 0, 4, 'link', 'href')).toBeNull()
      })
    })
  })

  describe('as is: a covered segment lacks the mark', () => {
    describe('when the attr is read', () => {
      it('to be: returns null', () => {
        const linked: SduiInlineContent = [
          { type: 'text', text: 'ab', marks: [link('https://a.com')] },
          { type: 'text', text: 'cd' },
        ]
        expect(rangeMarkAttr(linked, 0, 4, 'link', 'href')).toBeNull()
      })
    })
  })
})

describe('normalizeDocRange', () => {
  function threeBlocks(): SduiDocumentContent {
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

  test('orders a backwards selection and lists covered blocks', () => {
    const result = normalizeDocRange(threeBlocks(), {
      anchor: { blockId: 'c', offset: 1 },
      focus: { blockId: 'a', offset: 2 },
    })
    expect(result).toEqual({
      start: { blockId: 'a', offset: 2 },
      end: { blockId: 'c', offset: 1 },
      blockIds: ['a', 'b', 'c'],
      isCrossBlock: true,
    })
  })

  test('flags a single-block range as not cross-block', () => {
    const result = normalizeDocRange(threeBlocks(), {
      anchor: { blockId: 'b', offset: 0 },
      focus: { blockId: 'b', offset: 2 },
    })
    expect(result?.isCrossBlock).toBe(false)
    expect(result?.blockIds).toEqual(['b'])
  })
})
