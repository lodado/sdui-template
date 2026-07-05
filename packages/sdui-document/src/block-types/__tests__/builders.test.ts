import { createDocumentBlock } from '../../blocks/schema/block'
import { parseSduiDocumentContent } from '../../blocks/schema/validate'
import { bold, colored, hardBreak, inlineState, link, text } from '../../content/inlineBuilders'
import { nextBlockId, resetBlockIds } from '../authoring/blockId'
import { bulletedList } from '../bulleted-list/bulletedList.builder'
import { divider } from '../divider/divider.builder'
import { heading } from '../heading/heading.builder'
import { image } from '../image/image.builder'
import { paragraph } from '../paragraph/paragraph.builder'

describe('inline builders', () => {
  test('mark helpers produce the engine mark shapes', () => {
    expect(bold('hi')).toEqual({ type: 'text', text: 'hi', marks: [{ type: 'bold' }] })
    expect(colored('hi', '#66778F')).toEqual({
      type: 'text',
      text: 'hi',
      marks: [{ type: 'color', attrs: { color: '#66778F' } }],
    })
    expect(link('docs', 'https://a.io')).toEqual({
      type: 'text',
      text: 'docs',
      marks: [{ type: 'link', attrs: { href: 'https://a.io' } }],
    })
    expect(text('plain')).toEqual({ type: 'text', text: 'plain' })
  })

  test('inlineState derives the plain-text fallback (hard_break -> newline)', () => {
    const state = inlineState([text('a'), hardBreak, bold('b')])
    expect(state.text).toBe('a\nb')
    expect(state.content).toHaveLength(3)
  })
})

describe('block builders', () => {
  beforeEach(() => resetBlockIds())

  test('auto-ids are deterministic and unique via a shared monotonic counter', () => {
    expect(heading('A', 1).id).toBe('heading-1')
    expect(paragraph('B').id).toBe('paragraph-2')
    expect(divider().id).toBe('divider-3')
  })

  test('explicit id and align pass through', () => {
    const block = heading('Title', 2, { id: 'h', align: 'center' })
    expect(block).toMatchObject({ id: 'h', type: 'document.heading', attributes: { level: 2, align: 'center' } })
    expect(paragraph('x', { align: 'right' }).attributes).toEqual({ align: 'right' })
  })

  test('bulletedList nests children; image carries layout attrs', () => {
    const list = bulletedList('parent', { id: 'p', children: [paragraph('child', { id: 'c' })] })
    expect(list.children).toHaveLength(1)

    const img = image({ id: 'i', src: 'https://x.io/a.png', width: 160, align: 'center', caption: 'cap' })
    expect(img).toMatchObject({
      id: 'i',
      type: 'document.image',
      state: { text: 'cap' },
      attributes: { src: 'https://x.io/a.png', width: 160, align: 'center' },
    })
  })

  test('authored tree validates through createDocumentBlock + parse', () => {
    const content = {
      schemaVersion: '1.0' as const,
      root: createDocumentBlock({
        id: 'root',
        type: 'document.root',
        children: [
          heading('Resume', 1, { align: 'center' }),
          paragraph([text('by '), bold('me')]),
          bulletedList('item'),
          divider(),
        ],
      }),
    }

    expect(() => parseSduiDocumentContent(content)).not.toThrow()
  })

  test('nextBlockId hint prefixes the counter', () => {
    resetBlockIds()
    expect(nextBlockId('x')).toBe('x-1')
    expect(nextBlockId('x')).toBe('x-2')
  })
})
