import { boldMark } from '../bold/bold'
import { codeMark } from '../code/code'
import { colorMark, isValidTextColor, TEXT_COLOR_PATTERN } from '../color/color'
import { HIGHLIGHT_COLOR_PATTERN, highlightMark, isValidHighlightColor } from '../highlight/highlight'
import { cloneMark, inlineMarkSchema, MARK_MODULES, marksEqual } from '../index'
import { italicMark } from '../italic/italic'
import { linkMark } from '../link/link'
import { strikethroughMark } from '../strikethrough/strikethrough'
import { underlineMark } from '../underline/underline'

describe('attr-less mark modules', () => {
  const modules = [boldMark, italicMark, strikethroughMark, underlineMark, codeMark]

  test('schema accepts exactly its own type literal', () => {
    modules.forEach((markModule) => {
      expect(markModule.schema.parse({ type: markModule.name })).toEqual({ type: markModule.name })
      expect(() => markModule.schema.parse({ type: 'nope' })).toThrow()
    })
  })

  test('clone returns a new object, equals is always true', () => {
    modules.forEach((markModule) => {
      const mark = { type: markModule.name }
      expect(markModule.clone(mark)).not.toBe(mark)
      expect(markModule.clone(mark)).toEqual(mark)
      expect(markModule.equals(mark, mark)).toBe(true)
    })
  })
})

describe('attrs-bearing mark modules', () => {
  test('link: schema, deep clone, href equality', () => {
    const mark = { type: 'link' as const, attrs: { href: 'https://example.com' } }
    expect(linkMark.schema.parse(mark)).toEqual(mark)
    expect(() => linkMark.schema.parse({ type: 'link' })).toThrow()

    const cloned = linkMark.clone(mark)
    expect(cloned).toEqual(mark)
    expect(cloned.attrs).not.toBe(mark.attrs)

    expect(linkMark.equals(mark, { type: 'link', attrs: { href: 'https://example.com' } })).toBe(true)
    expect(linkMark.equals(mark, { type: 'link', attrs: { href: 'https://other.com' } })).toBe(false)
  })

  test('highlight: 6-digit hex enforced, deep clone, color equality', () => {
    const mark = { type: 'highlight' as const, attrs: { color: '#FFC107' } }
    expect(highlightMark.schema.parse(mark)).toEqual(mark)
    expect(() => highlightMark.schema.parse({ type: 'highlight', attrs: { color: 'red' } })).toThrow()

    const cloned = highlightMark.clone(mark)
    expect(cloned.attrs).not.toBe(mark.attrs)

    expect(highlightMark.equals(mark, { type: 'highlight', attrs: { color: '#FFC107' } })).toBe(true)
    expect(highlightMark.equals(mark, { type: 'highlight', attrs: { color: '#000000' } })).toBe(false)

    expect(isValidHighlightColor('#a1B2c3')).toBe(true)
    expect(isValidHighlightColor('#fff')).toBe(false)
    expect(HIGHLIGHT_COLOR_PATTERN.test('#123456')).toBe(true)
  })

  test('color: 6-digit hex enforced, deep clone, color equality', () => {
    const mark = { type: 'color' as const, attrs: { color: '#66778F' } }
    expect(colorMark.schema.parse(mark)).toEqual(mark)
    expect(() => colorMark.schema.parse({ type: 'color', attrs: { color: 'gray' } })).toThrow()

    const cloned = colorMark.clone(mark)
    expect(cloned.attrs).not.toBe(mark.attrs)

    expect(colorMark.equals(mark, { type: 'color', attrs: { color: '#66778F' } })).toBe(true)
    expect(colorMark.equals(mark, { type: 'color', attrs: { color: '#000000' } })).toBe(false)

    expect(isValidTextColor('#a1B2c3')).toBe(true)
    expect(isValidTextColor('#fff')).toBe(false)
    expect(TEXT_COLOR_PATTERN.test('#123456')).toBe(true)
  })
})

describe('mark registry', () => {
  test('registry names are unique and cover all 8 marks', () => {
    const names = MARK_MODULES.map((markModule) => markModule.name)
    expect(new Set(names).size).toBe(names.length)
    expect(names.sort()).toEqual(['bold', 'code', 'color', 'highlight', 'italic', 'link', 'strikethrough', 'underline'])
  })

  test('inlineMarkSchema parses every mark shape and rejects bad highlight', () => {
    expect(inlineMarkSchema.parse({ type: 'bold' })).toEqual({ type: 'bold' })
    expect(inlineMarkSchema.parse({ type: 'link', attrs: { href: 'https://a.io' } })).toEqual({
      type: 'link',
      attrs: { href: 'https://a.io' },
    })
    expect(inlineMarkSchema.parse({ type: 'color', attrs: { color: '#66778F' } })).toEqual({
      type: 'color',
      attrs: { color: '#66778F' },
    })
    expect(() => inlineMarkSchema.parse({ type: 'highlight', attrs: { color: 'red' } })).toThrow()
  })

  test('cloneMark deep-copies attrs-bearing marks', () => {
    const link = { type: 'link' as const, attrs: { href: 'https://a.io' } }
    expect(cloneMark(link).attrs).not.toBe(link.attrs)
    expect(cloneMark({ type: 'bold' })).toEqual({ type: 'bold' })
  })

  test('marksEqual compares per-mark attrs', () => {
    expect(marksEqual([{ type: 'bold' }], [{ type: 'bold' }])).toBe(true)
    expect(marksEqual([{ type: 'bold' }], [{ type: 'italic' }])).toBe(false)
    expect(marksEqual(undefined, [])).toBe(true)
    expect(
      marksEqual(
        [{ type: 'highlight', attrs: { color: '#111111' } }],
        [{ type: 'highlight', attrs: { color: '#222222' } }],
      ),
    ).toBe(false)
  })
})
