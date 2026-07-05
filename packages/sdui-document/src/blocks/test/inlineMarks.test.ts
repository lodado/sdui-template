import { mergeInlineContent, splitInlineContent } from '../../content'
import { isValidHighlightColor, parseSduiInlineContent } from '../schema'

describe('inline mark schema — strikethrough/underline/highlight', () => {
  describe('as is: parseSduiInlineContent boundary validation', () => {
    describe('when content carries every mark type (EP: valid partition)', () => {
      it('to be: parses and preserves marks verbatim', () => {
        const content = [
          {
            type: 'text',
            text: 'styled',
            marks: [
              { type: 'bold' },
              { type: 'italic' },
              { type: 'strikethrough' },
              { type: 'underline' },
              { type: 'code' },
              { type: 'link', attrs: { href: 'https://example.com' } },
              { type: 'highlight', attrs: { color: '#FDEA9B' } },
            ],
          },
          { type: 'hard_break' },
        ]

        expect(parseSduiInlineContent(content)).toEqual(content)
      })
    })

    describe('when highlight color is not 6-digit hex (EP: invalid partition)', () => {
      it.each(['FDEA9B', '#FDEA9', '#FDEA9B00', 'coral'])('to be: rejects %s', (color) => {
        const content = [{ type: 'text', text: 'x', marks: [{ type: 'highlight', attrs: { color } }] }]

        expect(() => parseSduiInlineContent(content)).toThrow()
      })
    })

    describe('when mark type is unknown (EP: invalid partition)', () => {
      it('to be: rejects', () => {
        const content = [{ type: 'text', text: 'x', marks: [{ type: 'font_size' }] }]

        expect(() => parseSduiInlineContent(content)).toThrow()
      })
    })
  })

  describe('as is: isValidHighlightColor', () => {
    describe('when checking boundary formats (BVA: exact 6 hex digits)', () => {
      it('to be: accepts #RRGGBB only', () => {
        expect(isValidHighlightColor('#FDEA9B')).toBe(true)
        expect(isValidHighlightColor('#fdea9b')).toBe(true)
        expect(isValidHighlightColor('#FDEA9')).toBe(false) // 5 digits
        expect(isValidHighlightColor('#FDEA9B0')).toBe(false) // 7 digits
        expect(isValidHighlightColor('FDEA9B')).toBe(false) // missing #
      })
    })
  })

  describe('as is: split/merge engine with attrs-bearing marks', () => {
    describe('when highlighted text is split then merged (EP: round-trip)', () => {
      it('to be: highlight attrs survive and equal-marked segments re-merge', () => {
        const content = [
          { type: 'text' as const, text: 'ab', marks: [{ type: 'highlight' as const, attrs: { color: '#3CBEFC' } }] },
        ]

        const [before, after] = splitInlineContent(content, 1)
        expect(before).toEqual([
          { type: 'text', text: 'a', marks: [{ type: 'highlight', attrs: { color: '#3CBEFC' } }] },
        ])

        const merged = mergeInlineContent(before, after)
        expect(merged).toEqual(content)
      })
    })

    describe('when adjacent highlights differ only by color (BVA: attrs equality)', () => {
      it('to be: segments do not merge', () => {
        const merged = mergeInlineContent(
          [{ type: 'text', text: 'a', marks: [{ type: 'highlight', attrs: { color: '#FDEA9B' } }] }],
          [{ type: 'text', text: 'b', marks: [{ type: 'highlight', attrs: { color: '#3CBEFC' } }] }],
        )

        expect(merged).toHaveLength(2)
      })
    })
  })
})
