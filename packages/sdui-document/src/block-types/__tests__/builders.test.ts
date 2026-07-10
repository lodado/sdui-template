import { createDocumentBlock } from '../../blocks/schema/block'
import { parseSduiDocumentContent } from '../../blocks/schema/validate'
import { bold, colored, hardBreak, inlineState, link, text } from '../../content/inlineBuilders'
import { nextBlockId, resetBlockIds } from '../authoring/blockId'
import { bookmark } from '../bookmark/bookmark.builder'
import { bulletedList } from '../bulleted-list/bulletedList.builder'
import { callout } from '../callout/callout.builder'
import { column } from '../column/column.builder'
import { columnList } from '../column-list/columnList.builder'
import { divider } from '../divider/divider.builder'
import { heading } from '../heading/heading.builder'
import { image } from '../image/image.builder'
import { paragraph } from '../paragraph/paragraph.builder'
import { tags } from '../tags/tags.builder'
import { toc } from '../toc/toc.builder'
import { toggle } from '../toggle/toggle.builder'

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

  test('columnList/column build a horizontal split with ratio', () => {
    const list = columnList([
      column([paragraph('left', { id: 'l' })], { id: 'colA', ratio: 1 }),
      column([paragraph('right', { id: 'r' })], { id: 'colB', ratio: 2 }),
    ])
    expect(list).toMatchObject({ type: 'document.columnList' })
    expect(list.children).toHaveLength(2)
    expect(list.children?.[1]).toMatchObject({ type: 'document.column', attributes: { ratio: 2 } })
  })

  test('nextBlockId hint prefixes the counter', () => {
    resetBlockIds()
    expect(nextBlockId('x')).toBe('x-1')
    expect(nextBlockId('x')).toBe('x-2')
  })
})

describe('notion block builders (callout/toggle/toc/tags/bookmark)', () => {
  beforeEach(() => resetBlockIds())

  test('callout carries tone/icon and nests children', () => {
    const block = callout('주목!', { id: 'c', tone: 'tip', icon: '🚀', children: [paragraph('detail', { id: 'd' })] })
    expect(block).toMatchObject({
      id: 'c',
      type: 'document.callout',
      state: { text: '주목!' },
      attributes: { tone: 'tip', icon: '🚀' },
    })
    expect(block.children).toHaveLength(1)
    expect(callout('plain').attributes).toBeUndefined()
  })

  test('toggle stores summary text, children, collapsed', () => {
    const block = toggle('열어보기', [paragraph('내용', { id: 'p' })], { id: 't', collapsed: true })
    expect(block).toMatchObject({
      id: 't',
      type: 'document.toggle',
      state: { text: '열어보기' },
      attributes: { collapsed: true },
    })
    expect(block.children).toHaveLength(1)
    expect(toggle('빈 토글').children).toBeUndefined()
  })

  test('toc is a bare block', () => {
    expect(toc({ id: 'toc' })).toEqual({ id: 'toc', type: 'document.toc' })
  })

  test('tags maps strings and objects to TagItem chips with auto ids', () => {
    const block = tags(['React', { label: 'Next.js', color: 'blue' }], { id: 'skills' })
    expect(block.attributes).toEqual({
      items: [
        { id: 'tag-1', label: 'React' },
        { id: 'tag-2', label: 'Next.js', color: 'blue' },
      ],
    })
  })

  test('bookmark carries url/title/description', () => {
    expect(bookmark('https://github.com/lodado', { id: 'b', title: 'GitHub' })).toEqual({
      id: 'b',
      type: 'document.bookmark',
      attributes: { url: 'https://github.com/lodado', title: 'GitHub' },
    })
  })

  test('authored notion blocks validate through createDocumentBlock + parse', () => {
    const content = {
      schemaVersion: '1.0' as const,
      root: createDocumentBlock({
        id: 'root',
        type: 'document.root',
        children: [
          toc(),
          callout('metric', { tone: 'success' }),
          toggle('detail', [paragraph('inner')]),
          tags(['TS', 'React']),
          bookmark('https://example.com'),
        ],
      }),
    }
    expect(() => parseSduiDocumentContent(content)).not.toThrow()
  })
})
