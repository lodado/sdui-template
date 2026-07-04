import {
  applyDocumentPatches,
  canHostInlineText,
  createDocumentBlock,
  createInlineDragPatches,
  findBlockById,
  type SduiDocumentContent,
} from '../../index'

const bold = { type: 'bold' as const }

function createContent(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({
          id: 'a',
          type: 'document.paragraph',
          state: {
            content: [
              { type: 'text', text: 'Hello', marks: [bold] },
              { type: 'text', text: ' world' },
            ],
            text: 'Hello world',
          },
        }),
        createDocumentBlock({
          id: 'b',
          type: 'document.paragraph',
          state: { content: [{ type: 'text', text: 'Target' }], text: 'Target' },
        }),
        createDocumentBlock({ id: 'd', type: 'document.divider' }),
        createDocumentBlock({ id: 't', type: 'document.paragraph', state: { text: 'plain' } }),
      ],
    }),
  }
}

describe('canHostInlineText', () => {
  it('accepts text-bearing blocks and rejects structural ones', () => {
    const content = createContent()
    expect(canHostInlineText(findBlockById(content, 'a')!)).toBe(true)
    expect(canHostInlineText(findBlockById(content, 'd')!)).toBe(false)
    expect(canHostInlineText(findBlockById(content, 'root')!)).toBe(false)
  })
})

describe('createInlineDragPatches', () => {
  it('moves a range into another block, preserving marks', () => {
    const content = createContent()
    const result = createInlineDragPatches({
      content,
      source: { blockId: 'a', from: 0, to: 5 },
      targetBlockId: 'b',
      targetOffset: 3,
    })

    expect(result).not.toBeNull()
    expect(result!.focusBlockId).toBe('b')
    expect(result!.caretOffset).toBe(8)

    const next = applyDocumentPatches(content, result!.patches)
    expect(findBlockById(next, 'a')!.state).toEqual({
      content: [{ type: 'text', text: ' world' }],
      text: ' world',
    })
    expect(findBlockById(next, 'b')!.state).toEqual({
      content: [
        { type: 'text', text: 'Tar' },
        { type: 'text', text: 'Hello', marks: [bold] },
        { type: 'text', text: 'get' },
      ],
      text: 'TarHelloget',
    })
  })

  it('copies without touching the source when copy is set', () => {
    const content = createContent()
    const result = createInlineDragPatches({
      content,
      source: { blockId: 'a', from: 6, to: 11 },
      targetBlockId: 'b',
      targetOffset: 6,
      copy: true,
    })

    expect(result!.patches).toHaveLength(1)

    const next = applyDocumentPatches(content, result!.patches)
    expect(findBlockById(next, 'a')!.state?.text).toBe('Hello world')
    expect(findBlockById(next, 'b')!.state?.text).toBe('Targetworld')
    expect(result!.caretOffset).toBe(11)
  })

  it('moves a range within the same block, adjusting the insert offset', () => {
    const content = createContent()
    const result = createInlineDragPatches({
      content,
      source: { blockId: 'b', from: 0, to: 3 },
      targetBlockId: 'b',
      targetOffset: 6,
    })

    expect(result!.patches).toHaveLength(1)

    const next = applyDocumentPatches(content, result!.patches)
    expect(findBlockById(next, 'b')!.state?.text).toBe('getTar')
    expect(result!.focusBlockId).toBe('b')
    expect(result!.caretOffset).toBe(6)
  })

  it('returns null when dropping inside the dragged range', () => {
    const content = createContent()
    const result = createInlineDragPatches({
      content,
      source: { blockId: 'a', from: 2, to: 8 },
      targetBlockId: 'a',
      targetOffset: 5,
    })

    expect(result).toBeNull()
  })

  it('returns null for an empty range', () => {
    const content = createContent()
    expect(
      createInlineDragPatches({
        content,
        source: { blockId: 'a', from: 3, to: 3 },
        targetBlockId: 'b',
        targetOffset: 0,
      }),
    ).toBeNull()
  })

  it('returns null for non-text targets and unknown blocks', () => {
    const content = createContent()
    expect(
      createInlineDragPatches({
        content,
        source: { blockId: 'a', from: 0, to: 5 },
        targetBlockId: 'd',
        targetOffset: 0,
      }),
    ).toBeNull()
    expect(
      createInlineDragPatches({
        content,
        source: { blockId: 'missing', from: 0, to: 5 },
        targetBlockId: 'b',
        targetOffset: 0,
      }),
    ).toBeNull()
  })

  it('clamps out-of-range offsets instead of throwing', () => {
    const content = createContent()
    const result = createInlineDragPatches({
      content,
      source: { blockId: 'a', from: 6, to: 99 },
      targetBlockId: 'b',
      targetOffset: 99,
    })

    const next = applyDocumentPatches(content, result!.patches)
    expect(findBlockById(next, 'b')!.state?.text).toBe('Targetworld')
    expect(result!.caretOffset).toBe(11)
  })

  it('keeps text-mode blocks in text mode (no content key written)', () => {
    const content = createContent()
    const result = createInlineDragPatches({
      content,
      source: { blockId: 't', from: 0, to: 5 },
      targetBlockId: 'b',
      targetOffset: 0,
    })

    const next = applyDocumentPatches(content, result!.patches)
    expect(findBlockById(next, 't')!.state).toEqual({ text: '' })
    expect(findBlockById(next, 'b')!.state?.text).toBe('plainTarget')
  })
})
