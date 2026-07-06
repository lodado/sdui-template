import { getInlineContentLength, inlineContentToPlainText, splitInlineContent } from './inlineContent'

const date = { type: 'date' as const, iso: '2026-07-06', display: 'Jul 6' }

describe('inline date node handling', () => {
  it('counts a date node as one offset unit', () => {
    expect(getInlineContentLength([{ type: 'text', text: 'a' }, date])).toBe(2)
  })

  it('renders the display string in plain text', () => {
    expect(inlineContentToPlainText([date])).toBe('Jul 6')
    expect(inlineContentToPlainText([{ type: 'date', iso: '2026-07-06' }])).toBe('2026-07-06')
  })

  it('splits cleanly around a date node', () => {
    const [left, right] = splitInlineContent([{ type: 'text', text: 'a' }, date], 1)
    expect(left).toEqual([{ type: 'text', text: 'a' }])
    expect(right).toEqual([date])
  })
})
