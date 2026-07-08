import type { SduiDocumentBlock, SduiDocumentContent, SduiInlineContent } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'

import type { NormalizedRange } from '../../inline/docRange'
import {
  computeRangeReplacePatches,
  computeSetRangeMark,
  computeToggleRangeMark,
  coveredTextBlocks,
  isRangeMarkActive,
  parseInlineClipboard,
  serializeRangeInline,
  serializeRangeText,
  uniformRangeAttr,
} from '../rangePatchLogic'

function doc(children: SduiDocumentBlock[]): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({ id: 'root', type: 'document.root', children }),
  }
}

function inline(id: string, content: SduiInlineContent): SduiDocumentBlock {
  return createDocumentBlock({ id, type: 'document.paragraph', state: { content } })
}

function range(
  start: { blockId: string; offset: number },
  end: { blockId: string; offset: number },
  blockIds: string[],
): NormalizedRange {
  return { start, end, blockIds, isCrossBlock: blockIds.length > 1 }
}

const bold = { type: 'bold' as const }

describe('parseInlineClipboard', () => {
  it.each([
    ['undefined', undefined, null],
    ['empty string', '', null],
    ['not JSON', '{oops', null],
    ['not an array', '{"type":"text"}', null],
    ['empty array', '[]', null],
    ['bad node (no text)', '[{"type":"text"}]', null],
    ['unknown type', '[{"type":"widget"}]', null],
  ])('rejects %s', (_name, raw, expected) => {
    expect(parseInlineClipboard(raw as string | undefined)).toBe(expected)
  })

  it('accepts text / hard_break / date nodes and keeps marks', () => {
    const payload: SduiInlineContent = [
      { type: 'text', text: 'hi', marks: [bold] },
      { type: 'hard_break' },
      { type: 'text', text: 'there' },
    ]

    expect(parseInlineClipboard(JSON.stringify(payload))).toEqual(payload)
  })
})

describe('computeRangeReplacePatches (Notion delete/replace)', () => {
  const twoBlocks = () =>
    doc([inline('a', [{ type: 'text', text: 'hello' }]), inline('b', [{ type: 'text', text: 'world' }])])

  it('cross-block delete: head of start + tail of end merge, middles deleted, caret at join', () => {
    const { patches, caret } = computeRangeReplacePatches(
      twoBlocks(),
      range({ blockId: 'a', offset: 2 }, { blockId: 'b', offset: 3 }, ['a', 'b']),
      '',
    )

    expect(patches).toEqual([
      {
        type: 'block.update',
        blockId: 'a',
        state: expect.objectContaining({
          content: [
            { type: 'text', text: 'he' },
            { type: 'text', text: 'ld' },
          ],
        }),
      },
      { type: 'block.delete', blockId: 'b' },
    ])
    expect(caret).toEqual({ blockId: 'a', offset: 2 })
  })

  it('typed replacement: inserted text lands between head and tail, caret after insert', () => {
    const { patches, caret } = computeRangeReplacePatches(
      twoBlocks(),
      range({ blockId: 'a', offset: 2 }, { blockId: 'b', offset: 3 }, ['a', 'b']),
      'X',
    )

    expect(patches[0]).toEqual(
      expect.objectContaining({
        state: expect.objectContaining({
          content: [
            { type: 'text', text: 'he' },
            { type: 'text', text: 'X' },
            { type: 'text', text: 'ld' },
          ],
        }),
      }),
    )
    expect(caret).toEqual({ blockId: 'a', offset: 3 })
  })

  it('rich insert: inline content with marks survives verbatim', () => {
    const richInsert: SduiInlineContent = [{ type: 'text', text: 'BOLD', marks: [bold] }]
    const { patches, caret } = computeRangeReplacePatches(
      twoBlocks(),
      range({ blockId: 'a', offset: 5 }, { blockId: 'b', offset: 0 }, ['a', 'b']),
      richInsert,
    )

    expect(patches[0]).toEqual(
      expect.objectContaining({
        state: expect.objectContaining({
          content: [
            { type: 'text', text: 'hello' },
            { type: 'text', text: 'BOLD', marks: [bold] },
            { type: 'text', text: 'world' },
          ],
        }),
      }),
    )
    expect(caret).toEqual({ blockId: 'a', offset: 9 })
  })

  it('non-text start block: start+middles deleted, end keeps its suffix, caret at end block start', () => {
    const content = doc([
      createDocumentBlock({ id: 'img', type: 'document.image' }),
      inline('b', [{ type: 'text', text: 'world' }]),
    ])
    const { patches, caret } = computeRangeReplacePatches(
      content,
      range({ blockId: 'img', offset: 0 }, { blockId: 'b', offset: 3 }, ['img', 'b']),
      '',
    )

    expect(patches).toEqual([
      { type: 'block.delete', blockId: 'img' },
      {
        type: 'block.update',
        blockId: 'b',
        state: expect.objectContaining({ content: [{ type: 'text', text: 'ld' }] }),
      },
    ])
    expect(caret).toEqual({ blockId: 'b', offset: 0 })
  })

  it('both endpoints non-text: everything deleted, no caret', () => {
    const content = doc([
      createDocumentBlock({ id: 'img1', type: 'document.image' }),
      createDocumentBlock({ id: 'img2', type: 'document.image' }),
    ])
    const { patches, caret } = computeRangeReplacePatches(
      content,
      range({ blockId: 'img1', offset: 0 }, { blockId: 'img2', offset: 0 }, ['img1', 'img2']),
      '',
    )

    expect(patches).toEqual([
      { type: 'block.delete', blockId: 'img1' },
      { type: 'block.delete', blockId: 'img2' },
    ])
    expect(caret).toBeNull()
  })
})

describe('mark queries and patches', () => {
  const marked = () =>
    doc([
      inline('a', [{ type: 'text', text: 'hello', marks: [bold] }]),
      inline('b', [{ type: 'text', text: 'world', marks: [bold] }]),
    ])
  const mixed = () =>
    doc([inline('a', [{ type: 'text', text: 'hello', marks: [bold] }]), inline('b', [{ type: 'text', text: 'world' }])])
  const fullRange = range({ blockId: 'a', offset: 0 }, { blockId: 'b', offset: 5 }, ['a', 'b'])

  it('isRangeMarkActive: true only when EVERY covered segment has the mark', () => {
    expect(isRangeMarkActive(marked(), fullRange, 'bold')).toBe(true)
    expect(isRangeMarkActive(mixed(), fullRange, 'bold')).toBe(false)
  })

  it('computeToggleRangeMark: all marked → removes; partially marked → adds everywhere', () => {
    const removePatches = computeToggleRangeMark(marked(), fullRange, bold)
    removePatches.forEach((patch) => {
      const {content} = (patch as { state: { content: SduiInlineContent } }).state
      content.forEach((node) => expect((node as { marks?: unknown[] }).marks ?? []).toEqual([]))
    })

    const addPatches = computeToggleRangeMark(mixed(), fullRange, bold)
    addPatches.forEach((patch) => {
      const {content} = (patch as { state: { content: SduiInlineContent } }).state
      content.forEach((node) => expect((node as { marks?: unknown[] }).marks).toEqual([bold]))
    })
  })

  it('computeSetRangeMark: sets an attr mark, clears with null', () => {
    const highlight = { type: 'highlight' as const, attrs: { color: 'yellow' } }
    const setPatches = computeSetRangeMark(mixed(), fullRange, 'highlight', highlight)
    setPatches.forEach((patch) => {
      const {content} = (patch as { state: { content: SduiInlineContent } }).state
      content.forEach((node) =>
        expect((node as { marks?: unknown[] }).marks).toEqual(expect.arrayContaining([highlight])),
      )
    })

    const clearContent = doc([inline('a', [{ type: 'text', text: 'x', marks: [highlight] }])])
    const clearPatches = computeSetRangeMark(
      clearContent,
      range({ blockId: 'a', offset: 0 }, { blockId: 'a', offset: 1 }, ['a']),
      'highlight',
      null,
    )
    const {content} = (clearPatches[0] as { state: { content: SduiInlineContent } }).state
    content.forEach((node) => expect((node as { marks?: unknown[] }).marks ?? []).toEqual([]))
  })

  it('uniformRangeAttr: uniform value passes through, mixed → null, absent → null', () => {
    const yellow = { type: 'highlight' as const, attrs: { color: 'yellow' } }
    const pink = { type: 'highlight' as const, attrs: { color: 'pink' } }
    const uniform = doc([
      inline('a', [{ type: 'text', text: 'x', marks: [yellow] }]),
      inline('b', [{ type: 'text', text: 'y', marks: [yellow] }]),
    ])
    const clash = doc([
      inline('a', [{ type: 'text', text: 'x', marks: [yellow] }]),
      inline('b', [{ type: 'text', text: 'y', marks: [pink] }]),
    ])
    const r = range({ blockId: 'a', offset: 0 }, { blockId: 'b', offset: 1 }, ['a', 'b'])

    expect(uniformRangeAttr(uniform, r, 'highlight', 'color')).toBe('yellow')
    expect(uniformRangeAttr(clash, r, 'highlight', 'color')).toBeNull()
    expect(uniformRangeAttr(mixed(), r, 'highlight', 'color')).toBeNull()
  })
})

describe('serialization', () => {
  const content = doc([
    inline('a', [{ type: 'text', text: 'hello', marks: [bold] }]),
    createDocumentBlock({ id: 'img', type: 'document.image' }),
    inline('b', [{ type: 'text', text: 'world' }]),
  ])
  const r = range({ blockId: 'a', offset: 1 }, { blockId: 'b', offset: 3 }, ['a', 'img', 'b'])

  it('coveredTextBlocks skips non-text blocks in the covered span', () => {
    expect(coveredTextBlocks(content, r).map((block) => block.id)).toEqual(['a', 'b'])
  })

  it('serializeRangeText: covered slices joined by newline, one line per text block', () => {
    expect(serializeRangeText(content, r)).toBe('ello\nwor')
  })

  it('serializeRangeInline: keeps marks and inserts hard_break at block boundaries', () => {
    expect(serializeRangeInline(content, r)).toEqual([
      { type: 'text', text: 'ello', marks: [bold] },
      { type: 'hard_break' },
      { type: 'text', text: 'wor' },
    ])
  })
})
