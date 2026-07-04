import {
  getInlineContentLength,
  inlineContentToPlainText,
  InvalidInlineOffsetError,
  mergeInlineContent,
  type SduiInlineContent,
  splitInlineContent,
  textToInlineContent,
} from '../index'

const bold = { type: 'bold' } as const

describe('getInlineContentLength', () => {
  describe('as is: empty content', () => {
    describe('when measured', () => {
      it('to be: 0', () => {
        expect(getInlineContentLength([])).toBe(0)
      })
    })
  })

  describe('as is: single text node "abc"', () => {
    describe('when measured', () => {
      it('to be: 3', () => {
        expect(getInlineContentLength([{ type: 'text', text: 'abc' }])).toBe(3)
      })
    })
  })

  describe('as is: text(3) + hard_break + text(2)', () => {
    describe('when measured', () => {
      it('to be: 6 (hard_break counts as 1)', () => {
        const content: SduiInlineContent = [
          { type: 'text', text: 'abc' },
          { type: 'hard_break' },
          { type: 'text', text: 'de' },
        ]

        expect(getInlineContentLength(content)).toBe(6)
      })
    })
  })
})

describe('splitInlineContent', () => {
  describe('as is: single text node "Hello" (length 5)', () => {
    const content: SduiInlineContent = [{ type: 'text', text: 'Hello' }]

    describe('when offset is -1 (BVA: min - 1)', () => {
      it('to be: throws InvalidInlineOffsetError', () => {
        expect(() => splitInlineContent(content, -1)).toThrow(InvalidInlineOffsetError)
      })
    })

    describe('when offset is 0 (BVA: min)', () => {
      it('to be: empty first half, full second half', () => {
        expect(splitInlineContent(content, 0)).toEqual([[], [{ type: 'text', text: 'Hello' }]])
      })
    })

    describe('when offset is 2 (EP: interior offset)', () => {
      it('to be: "He" and "llo"', () => {
        expect(splitInlineContent(content, 2)).toEqual([
          [{ type: 'text', text: 'He' }],
          [{ type: 'text', text: 'llo' }],
        ])
      })
    })

    describe('when offset is 5 (BVA: max = length)', () => {
      it('to be: full first half, empty second half', () => {
        expect(splitInlineContent(content, 5)).toEqual([[{ type: 'text', text: 'Hello' }], []])
      })
    })

    describe('when offset is 6 (BVA: max + 1)', () => {
      it('to be: throws InvalidInlineOffsetError', () => {
        expect(() => splitInlineContent(content, 6)).toThrow(InvalidInlineOffsetError)
      })
    })
  })

  describe('as is: bold "ab" + plain "cd" (node boundary at 2)', () => {
    const content: SduiInlineContent = [
      { type: 'text', text: 'ab', marks: [bold] },
      { type: 'text', text: 'cd' },
    ]

    describe('when offset is 2 (BVA: exact node boundary)', () => {
      it('to be: nodes preserved intact on each side', () => {
        expect(splitInlineContent(content, 2)).toEqual([
          [{ type: 'text', text: 'ab', marks: [bold] }],
          [{ type: 'text', text: 'cd' }],
        ])
      })
    })

    describe('when offset is 1 (EP: inside a marked node)', () => {
      it('to be: both halves keep the bold mark', () => {
        expect(splitInlineContent(content, 1)).toEqual([
          [{ type: 'text', text: 'a', marks: [bold] }],
          [
            { type: 'text', text: 'b', marks: [bold] },
            { type: 'text', text: 'cd' },
          ],
        ])
      })
    })
  })

  describe('as is: "ab" + hard_break + "cd" (break occupies offset 2..3)', () => {
    const content: SduiInlineContent = [
      { type: 'text', text: 'ab' },
      { type: 'hard_break' },
      { type: 'text', text: 'cd' },
    ]

    describe('when offset is 2 (BVA: boundary before the break)', () => {
      it('to be: break belongs to the second half', () => {
        expect(splitInlineContent(content, 2)).toEqual([
          [{ type: 'text', text: 'ab' }],
          [{ type: 'hard_break' }, { type: 'text', text: 'cd' }],
        ])
      })
    })

    describe('when offset is 3 (BVA: boundary after the break)', () => {
      it('to be: break belongs to the first half', () => {
        expect(splitInlineContent(content, 3)).toEqual([
          [{ type: 'text', text: 'ab' }, { type: 'hard_break' }],
          [{ type: 'text', text: 'cd' }],
        ])
      })
    })
  })
})

describe('mergeInlineContent', () => {
  describe('as is: empty content on one side (EP: identity)', () => {
    describe('when merging empty + "ab"', () => {
      it('to be: "ab" unchanged', () => {
        expect(mergeInlineContent([], [{ type: 'text', text: 'ab' }])).toEqual([{ type: 'text', text: 'ab' }])
      })
    })

    describe('when merging "ab" + empty', () => {
      it('to be: "ab" unchanged', () => {
        expect(mergeInlineContent([{ type: 'text', text: 'ab' }], [])).toEqual([{ type: 'text', text: 'ab' }])
      })
    })
  })

  describe('as is: adjacent text nodes with identical marks (EP: mergeable partition)', () => {
    describe('when merging plain "ab" + plain "cd"', () => {
      it('to be: normalized into a single text node "abcd"', () => {
        expect(mergeInlineContent([{ type: 'text', text: 'ab' }], [{ type: 'text', text: 'cd' }])).toEqual([
          { type: 'text', text: 'abcd' },
        ])
      })
    })
  })

  describe('as is: adjacent text nodes with different marks (EP: non-mergeable partition)', () => {
    describe('when merging bold "ab" + plain "cd"', () => {
      it('to be: two separate nodes', () => {
        expect(
          mergeInlineContent([{ type: 'text', text: 'ab', marks: [bold] }], [{ type: 'text', text: 'cd' }]),
        ).toEqual([
          { type: 'text', text: 'ab', marks: [bold] },
          { type: 'text', text: 'cd' },
        ])
      })
    })

    describe('when merging links with different href attrs', () => {
      it('to be: two separate nodes', () => {
        const left: SduiInlineContent = [
          { type: 'text', text: 'ab', marks: [{ type: 'link', attrs: { href: 'https://a.example' } }] },
        ]
        const right: SduiInlineContent = [
          { type: 'text', text: 'cd', marks: [{ type: 'link', attrs: { href: 'https://b.example' } }] },
        ]

        expect(mergeInlineContent(left, right)).toHaveLength(2)
      })
    })
  })
})

describe('inlineContentToPlainText', () => {
  describe('as is: marked text with a hard_break', () => {
    describe('when converted to plain text', () => {
      it('to be: marks stripped and hard_break rendered as newline', () => {
        const content: SduiInlineContent = [
          { type: 'text', text: 'ab', marks: [bold] },
          { type: 'hard_break' },
          { type: 'text', text: 'cd' },
        ]

        expect(inlineContentToPlainText(content)).toBe('ab\ncd')
      })
    })
  })
})

describe('textToInlineContent', () => {
  describe('as is: empty string (BVA: min length)', () => {
    describe('when converted', () => {
      it('to be: empty content', () => {
        expect(textToInlineContent('')).toEqual([])
      })
    })
  })

  describe('as is: non-empty string', () => {
    describe('when converted', () => {
      it('to be: single unmarked text node', () => {
        expect(textToInlineContent('ab')).toEqual([{ type: 'text', text: 'ab' }])
      })
    })
  })
})
