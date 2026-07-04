import { InvalidInlineOffsetError } from './errors'
import { insertInlineContent, removeInlineRange, sliceInlineContent } from './inlineRange'

const bold = { type: 'bold' as const }

describe('sliceInlineContent', () => {
  it('slices a range crossing a mark boundary, keeping marks on each half', () => {
    const content = [
      { type: 'text' as const, text: 'Hello', marks: [bold] },
      { type: 'text' as const, text: ' world' },
    ]

    expect(sliceInlineContent(content, 3, 8)).toEqual([
      { type: 'text', text: 'lo', marks: [bold] },
      { type: 'text', text: ' wo' },
    ])
  })

  it('counts a hard_break as one offset unit', () => {
    const content = [
      { type: 'text' as const, text: 'ab' },
      { type: 'hard_break' as const },
      { type: 'text' as const, text: 'cd' },
    ]

    expect(sliceInlineContent(content, 1, 4)).toEqual([
      { type: 'text', text: 'b' },
      { type: 'hard_break' },
      { type: 'text', text: 'c' },
    ])
  })

  it('returns empty content for an empty range', () => {
    expect(sliceInlineContent([{ type: 'text', text: 'abc' }], 1, 1)).toEqual([])
  })

  it('throws when from is greater than to', () => {
    expect(() => sliceInlineContent([{ type: 'text', text: 'abc' }], 2, 1)).toThrow(InvalidInlineOffsetError)
  })

  it('throws when the range is out of bounds', () => {
    expect(() => sliceInlineContent([{ type: 'text', text: 'abc' }], 0, 4)).toThrow(InvalidInlineOffsetError)
  })
})

describe('removeInlineRange', () => {
  it('removes the range and joins the seam when marks match', () => {
    const content = [{ type: 'text' as const, text: 'Hello world' }]

    expect(removeInlineRange(content, 5, 11)).toEqual([{ type: 'text', text: 'Hello' }])
  })

  it('keeps distinct marks separate across the seam', () => {
    const content = [
      { type: 'text' as const, text: 'ab', marks: [bold] },
      { type: 'text' as const, text: 'XX' },
      { type: 'text' as const, text: 'cd' },
    ]

    expect(removeInlineRange(content, 2, 4)).toEqual([
      { type: 'text', text: 'ab', marks: [bold] },
      { type: 'text', text: 'cd' },
    ])
  })
})

describe('insertInlineContent', () => {
  it('inserts a fragment at the given offset and normalizes seams', () => {
    const content = [{ type: 'text' as const, text: 'Held' }]

    expect(insertInlineContent(content, 3, [{ type: 'text', text: ' wor' }])).toEqual([
      { type: 'text', text: 'Hel word' },
    ])
  })

  it('inserts at the start and end boundaries', () => {
    const content = [{ type: 'text' as const, text: 'mid' }]

    expect(insertInlineContent(content, 0, [{ type: 'text', text: 'a-' }])).toEqual([{ type: 'text', text: 'a-mid' }])
    expect(insertInlineContent(content, 3, [{ type: 'text', text: '-z' }])).toEqual([{ type: 'text', text: 'mid-z' }])
  })

  it('preserves fragment marks distinct from surrounding text', () => {
    const content = [{ type: 'text' as const, text: 'ac' }]

    expect(insertInlineContent(content, 1, [{ type: 'text', text: 'b', marks: [bold] }])).toEqual([
      { type: 'text', text: 'a' },
      { type: 'text', text: 'b', marks: [bold] },
      { type: 'text', text: 'c' },
    ])
  })
})
