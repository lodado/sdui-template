import {
  blockText,
  createDocumentBlock,
  isCalloutBlock,
  isChecklistBlock,
  isDividerBlock,
  isFileBlock,
  isHeadingBlock,
  isImageBlock,
  isLinkBlock,
  isParagraphBlock,
  type SduiDocumentBlock,
} from '../index'

const make = (type: string, state?: Record<string, unknown>): SduiDocumentBlock =>
  createDocumentBlock({ id: 'b', type, state })

describe('block type guards', () => {
  it.each([
    ['document.paragraph', isParagraphBlock],
    ['document.heading', isHeadingBlock],
    ['document.checklist', isChecklistBlock],
    ['document.divider', isDividerBlock],
    ['document.callout', isCalloutBlock],
    ['document.image', isImageBlock],
    ['document.file', isFileBlock],
    ['document.link', isLinkBlock],
  ] as const)('%s guard returns true for matching type', (type, guard) => {
    expect(guard(make(type))).toBe(true)
  })

  it('guards return false for non-matching type', () => {
    const block = make('document.paragraph')
    expect(isHeadingBlock(block)).toBe(false)
    expect(isChecklistBlock(block)).toBe(false)
    expect(isDividerBlock(block)).toBe(false)
  })

  it('guards return true for unknown custom block types only for paragraph fallback', () => {
    const custom = make('custom.block')
    expect(isParagraphBlock(custom)).toBe(false)
    expect(isHeadingBlock(custom)).toBe(false)
  })
})

describe('blockText', () => {
  it('returns state.text when present', () => {
    expect(blockText(make('document.paragraph', { text: 'Hello' }))).toBe('Hello')
  })

  it('returns empty string when state.text is absent', () => {
    expect(blockText(make('document.divider'))).toBe('')
  })

  it('returns empty string when state.text is not a string', () => {
    expect(blockText(make('document.paragraph', { text: 42 }))).toBe('')
  })
})
