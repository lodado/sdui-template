import type { SduiDocumentBlock } from '../../blocks/schema'
import { markdownToSduiDocumentContent } from '../fromMarkdown'

function convert(markdown: string, onUnsupported?: 'degrade' | 'skip' | 'throw') {
  let counter = 0
  return markdownToSduiDocumentContent(markdown, {
    generateId: (hint) => {
      counter += 1
      return `${hint}-${counter}`
    },
    onUnsupported,
  })
}

function childBlocks(content: ReturnType<typeof convert>): SduiDocumentBlock[] {
  return content.root.children ?? []
}

describe('markdownToSduiDocumentContent', () => {
  test('wraps blocks in a document.root and validates against the document schema', () => {
    const content = convert('hello')

    expect(content.schemaVersion).toBe('1.1')
    expect(content.root.type).toBe('document.root')
    expect(childBlocks(content)).toHaveLength(1)
  })

  test('maps headings with level and clamps depth 4+ to level 3', () => {
    const blocks = childBlocks(convert('# One\n\n## Two\n\n#### Four'))

    expect(blocks.map((block) => block.type)).toEqual(['document.heading', 'document.heading', 'document.heading'])
    expect(blocks.map((block) => block.state?.level)).toEqual([1, 2, 3])
    expect(blocks[0].state?.text).toBe('One')
  })

  test('maps paragraph inline marks: bold, italic, strikethrough, code, link', () => {
    const [block] = childBlocks(convert('a **b _c_** ~~d~~ `e` [f](https://x.io)'))

    expect(block.type).toBe('document.paragraph')
    expect(block.state?.text).toBe('a b c d e f')
    expect(block.state?.content).toEqual([
      { type: 'text', text: 'a ' },
      { type: 'text', text: 'b ', marks: [{ type: 'bold' }] },
      { type: 'text', text: 'c', marks: [{ type: 'bold' }, { type: 'italic' }] },
      { type: 'text', text: ' ' },
      { type: 'text', text: 'd', marks: [{ type: 'strikethrough' }] },
      { type: 'text', text: ' ' },
      { type: 'text', text: 'e', marks: [{ type: 'code' }] },
      { type: 'text', text: ' ' },
      { type: 'text', text: 'f', marks: [{ type: 'link', attrs: { href: 'https://x.io' } }] },
    ])
  })

  test('maps hard breaks to hard_break nodes', () => {
    const [block] = childBlocks(convert('first  \nsecond'))

    expect(block.state?.content).toEqual([
      { type: 'text', text: 'first' },
      { type: 'hard_break' },
      { type: 'text', text: 'second' },
    ])
    expect(block.state?.text).toBe('first\nsecond')
  })

  test('unescapes backslash escapes into plain text', () => {
    const [block] = childBlocks(convert('a \\* b'))

    expect(block.state?.text).toBe('a * b')
  })

  test('maps thematic break to document.divider', () => {
    const blocks = childBlocks(convert('above\n\n---\n\nbelow'))

    expect(blocks.map((block) => block.type)).toEqual(['document.paragraph', 'document.divider', 'document.paragraph'])
  })

  test('maps GFM task list items to document.checklist with checked state', () => {
    const blocks = childBlocks(convert('- [x] done **now**\n- [ ] todo'))

    expect(blocks.map((block) => block.type)).toEqual(['document.checklist', 'document.checklist'])
    expect(blocks[0].state?.checked).toBe(true)
    expect(blocks[0].state?.text).toBe('done now')
    expect(blocks[1].state?.checked).toBe(false)
  })

  test('degrades plain list items to paragraphs', () => {
    const blocks = childBlocks(convert('- alpha\n- beta'))

    expect(blocks.map((block) => block.type)).toEqual(['document.paragraph', 'document.paragraph'])
    expect(blocks.map((block) => block.state?.text)).toEqual(['alpha', 'beta'])
  })

  test('maps blockquote to an info callout, hoisting the first paragraph as its text', () => {
    const blocks = childBlocks(convert('> quoted **text**\n>\n> second line'))

    expect(blocks).toHaveLength(1)
    const [callout] = blocks
    expect(callout.type).toBe('document.callout')
    expect(callout.attributes?.tone).toBe('info')
    expect(callout.state?.text).toBe('quoted text')
    expect(callout.children?.map((child) => child.type)).toEqual(['document.paragraph'])
    expect(callout.children?.[0].state?.text).toBe('second line')
  })

  test('degrades fenced code to a code-marked paragraph with hard_break line separators', () => {
    const [block] = childBlocks(convert('```ts\nconst a = 1\nconst b = 2\n```'))

    expect(block.type).toBe('document.paragraph')
    expect(block.state?.content).toEqual([
      { type: 'text', text: 'const a = 1', marks: [{ type: 'code' }] },
      { type: 'hard_break' },
      { type: 'text', text: 'const b = 2', marks: [{ type: 'code' }] },
    ])
  })

  test('maps an image-only paragraph to document.image', () => {
    const [block] = childBlocks(convert('![alt text](https://img.example/pic.png)'))

    expect(block.type).toBe('document.image')
    expect(block.attributes).toEqual({ src: 'https://img.example/pic.png', alt: 'alt text' })
    expect(block.state?.text).toBe('alt text')
  })

  test('degrades inline images inside text to their alt text', () => {
    const [block] = childBlocks(convert('before ![tiny](https://x.io/i.png) after'))

    expect(block.type).toBe('document.paragraph')
    expect(block.state?.text).toBe('before tiny after')
  })

  test('unsupported html block: degrade keeps plain text, skip drops it, throw throws', () => {
    expect(childBlocks(convert('<div>raw</div>', 'degrade'))[0].state?.text).toBe('<div>raw</div>')
    expect(childBlocks(convert('<div>raw</div>', 'skip'))).toHaveLength(0)
    expect(() => convert('<div>raw</div>', 'throw')).toThrow(/unsupported/i)
  })

  test('generates unique block ids and a root id', () => {
    const content = convert('# a\n\nb\n\n- [ ] c')
    const ids = [content.root.id, ...childBlocks(content).map((block) => block.id)]

    expect(new Set(ids).size).toBe(ids.length)
  })

  test('default id generator produces unique ids without options', () => {
    const content = markdownToSduiDocumentContent('# a\n\nb')
    const ids = [content.root.id, ...childBlocks(content).map((block) => block.id)]

    expect(new Set(ids).size).toBe(ids.length)
  })

  test('merges adjacent text nodes with identical marks (normalization)', () => {
    const [block] = childBlocks(convert('plain \\* still plain'))

    expect(block.state?.content).toEqual([{ type: 'text', text: 'plain * still plain' }])
  })
})
