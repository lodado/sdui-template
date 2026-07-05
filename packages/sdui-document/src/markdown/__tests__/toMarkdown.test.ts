import type { SduiDocumentContent } from '../../blocks/schema'
import { createBlockId } from '../../blocks/schema/ids'
import { markdownToSduiDocumentContent } from '../fromMarkdown'
import { inlineContentToMarkdown } from '../inlineToMarkdown'
import { sduiDocumentContentToMarkdown } from '../toMarkdown'

/** md -> content -> md, exercising both the importer and each block's toMarkdown. */
function roundTrip(markdown: string): string {
  let counter = 0
  const content = markdownToSduiDocumentContent(markdown, {
    generateId: (hint) => {
      counter += 1
      return `${hint}-${counter}`
    },
  })
  return sduiDocumentContentToMarkdown(content)
}

describe('inlineContentToMarkdown', () => {
  test('folds marks outward over text', () => {
    expect(inlineContentToMarkdown([{ type: 'text', text: 'x', marks: [{ type: 'bold' }] }])).toBe('**x**')
    expect(inlineContentToMarkdown([{ type: 'text', text: 'x', marks: [{ type: 'code' }] }])).toBe('`x`')
    expect(
      inlineContentToMarkdown([
        { type: 'text', text: 't', marks: [{ type: 'link', attrs: { href: 'https://x.io' } }] },
      ]),
    ).toBe('[t](https://x.io)')
  })

  test('marks without a markdown form degrade to plain text', () => {
    expect(inlineContentToMarkdown([{ type: 'text', text: 'u', marks: [{ type: 'underline' }] }])).toBe('u')
    expect(
      inlineContentToMarkdown([
        { type: 'text', text: 'h', marks: [{ type: 'highlight', attrs: { color: '#ffff00' } }] },
      ]),
    ).toBe('h')
  })

  test('hard_break becomes a newline', () => {
    expect(
      inlineContentToMarkdown([{ type: 'text', text: 'a' }, { type: 'hard_break' }, { type: 'text', text: 'b' }]),
    ).toBe('a\nb')
  })
})

describe('sduiDocumentContentToMarkdown round-trips', () => {
  test.each([
    ['heading level 1', '# One'],
    ['paragraph with marks', 'a **b** c'],
    ['unchecked checklist', '- [ ] todo'],
    ['checked checklist', '- [x] done'],
    ['divider', '---'],
    ['image', '![alt](https://x.io/a.png)'],
    ['quote', '> note'],
    ['bulleted list', '- alpha\n- beta'],
    ['nested bulleted list', '- parent\n  - child'],
    ['numbered list', '1. one\n1. two'],
    ['fenced code with language', '```js\nconst x = 1\n```'],
    ['multiple blocks', '# Title\n\nbody'],
  ])('%s', (_label, markdown) => {
    expect(roundTrip(markdown)).toBe(markdown)
  })
})

describe('block-level blocks the importer cannot produce', () => {
  test('link and file blocks serialize from their state/attributes', () => {
    const content: SduiDocumentContent = {
      schemaVersion: '1.1',
      root: {
        id: createBlockId('root'),
        type: 'document.root',
        children: [
          {
            id: createBlockId('l1'),
            type: 'document.link',
            state: { text: 'Home' },
            attributes: { href: 'https://x.io' },
          },
          { id: createBlockId('f1'), type: 'document.file', state: { text: 'report.pdf' } },
        ],
      },
    }

    expect(sduiDocumentContentToMarkdown(content)).toBe('[Home](https://x.io)\n\nreport.pdf')
  })
})
