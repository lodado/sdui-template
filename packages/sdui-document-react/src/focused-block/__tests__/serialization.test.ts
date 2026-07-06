import type { SduiInlineContent } from '@lodado/sdui-document'

import { inlineContentToPmDoc, pmDocToInlineContent } from '../pm/serialization'

function roundTrip(content: SduiInlineContent): SduiInlineContent {
  return pmDocToInlineContent(inlineContentToPmDoc(content))
}

describe('inline content <-> ProseMirror doc serialization', () => {
  describe('as is: empty content (BVA: min size)', () => {
    describe('when round-tripped', () => {
      it('to be: empty content', () => {
        expect(roundTrip([])).toEqual([])
      })
    })
  })

  describe('as is: plain text (EP: unmarked partition)', () => {
    describe('when round-tripped', () => {
      it('to be: identical single text node', () => {
        expect(roundTrip([{ type: 'text', text: 'Hello world' }])).toEqual([{ type: 'text', text: 'Hello world' }])
      })
    })
  })

  describe('as is: marked text (EP: every mark type)', () => {
    describe('when round-tripped with bold + italic + code', () => {
      it('to be: marks preserved per node', () => {
        const content: SduiInlineContent = [
          { type: 'text', text: 'a', marks: [{ type: 'bold' }] },
          { type: 'text', text: 'b', marks: [{ type: 'italic' }] },
          { type: 'text', text: 'c', marks: [{ type: 'code' }] },
        ]

        expect(roundTrip(content)).toEqual(content)
      })
    })

    describe('when round-tripped with strikethrough + underline', () => {
      it('to be: marks preserved per node', () => {
        const content: SduiInlineContent = [
          { type: 'text', text: 'a', marks: [{ type: 'strikethrough' }] },
          { type: 'text', text: 'b', marks: [{ type: 'underline' }] },
        ]

        expect(roundTrip(content)).toEqual(content)
      })
    })

    describe('when round-tripped with a highlight mark (EP: attrs-bearing mark)', () => {
      it('to be: color attr preserved', () => {
        const content: SduiInlineContent = [
          { type: 'text', text: 'hi', marks: [{ type: 'highlight', attrs: { color: '#FDEA9B' } }] },
        ]

        expect(roundTrip(content)).toEqual(content)
      })
    })

    describe('when round-tripped with a color mark (EP: attrs-bearing mark)', () => {
      it('to be: color attr preserved', () => {
        const content: SduiInlineContent = [
          { type: 'text', text: 'hi', marks: [{ type: 'color', attrs: { color: '#66778F' } }] },
        ]

        expect(roundTrip(content)).toEqual(content)
      })
    })

    describe('when round-tripped with a link mark', () => {
      it('to be: href attr preserved', () => {
        const content: SduiInlineContent = [
          { type: 'text', text: 'docs', marks: [{ type: 'link', attrs: { href: 'https://example.com' } }] },
        ]

        expect(roundTrip(content)).toEqual(content)
      })
    })

    describe('when a node carries multiple marks (BVA: mark count > 1)', () => {
      it('to be: all marks preserved', () => {
        const content: SduiInlineContent = [{ type: 'text', text: 'ab', marks: [{ type: 'bold' }, { type: 'italic' }] }]

        const result = roundTrip(content)
        expect(result).toHaveLength(1)
        expect(result[0]).toMatchObject({ type: 'text', text: 'ab' })
        expect((result[0] as { marks?: unknown[] }).marks).toHaveLength(2)
      })
    })
  })

  describe('as is: content with hard_break', () => {
    describe('when round-tripped', () => {
      it('to be: hard_break preserved in position', () => {
        const content: SduiInlineContent = [
          { type: 'text', text: 'ab' },
          { type: 'hard_break' },
          { type: 'text', text: 'cd' },
        ]

        expect(roundTrip(content)).toEqual(content)
      })
    })
  })

  describe('as is: a ProseMirror doc built from inline content', () => {
    describe('when its length is inspected', () => {
      it('to be: doc content size matches sdui inline offset semantics (hard_break = 1)', () => {
        const doc = inlineContentToPmDoc([
          { type: 'text', text: 'ab' },
          { type: 'hard_break' },
          { type: 'text', text: 'cd' },
        ])

        expect(doc.content.size).toBe(5)
      })
    })
  })

  describe('as is: inline content with a date node', () => {
    describe('when round-tripped', () => {
      it('to be: the date node survives with iso and display', () => {
        const content: SduiInlineContent = [
          { type: 'text', text: 'due ' },
          { type: 'date', iso: '2026-07-06', display: 'Jul 6' },
        ]

        expect(roundTrip(content)).toEqual(content)
      })

      it('to be: a date node without display round-trips unchanged', () => {
        const content: SduiInlineContent = [{ type: 'date', iso: '2026-07-06' }]

        expect(roundTrip(content)).toEqual(content)
      })

      it('to be: a date node occupies one offset unit', () => {
        const doc = inlineContentToPmDoc([
          { type: 'text', text: 'ab' },
          { type: 'date', iso: '2026-07-06' },
        ])

        expect(doc.content.size).toBe(3)
      })
    })
  })
})
