import {
  createDocumentBlock,
  createTrailingBlockPatch,
  isEmptyDocument,
  requiresTrailingBlock,
  type SduiDocumentContent,
  withTrailingBlock,
} from '../../index'

function createContent(children?: Parameters<typeof createDocumentBlock>[0][]): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      ...(children ? { children } : {}),
    }),
  }
}

describe('trailing block invariant (Outline TrailingNode port)', () => {
  describe('requiresTrailingBlock', () => {
    it('returns true for a root with no children (BVA: zero blocks)', () => {
      expect(requiresTrailingBlock(createContent())).toBe(true)
    })

    it('returns true when the last root child cannot host inline text', () => {
      const content = createContent([
        { id: 'p1', type: 'document.paragraph', state: { text: 'First' } },
        { id: 'divider-1', type: 'document.divider' },
      ])

      expect(requiresTrailingBlock(content)).toBe(true)
    })

    it('returns false when the last root child is a paragraph, even a non-empty one', () => {
      const content = createContent([{ id: 'p1', type: 'document.paragraph', state: { text: 'First' } }])

      expect(requiresTrailingBlock(content)).toBe(false)
    })
  })

  describe('createTrailingBlockPatch', () => {
    it('builds a block.insert appending an empty paragraph after a trailing divider', () => {
      const content = createContent([
        { id: 'p1', type: 'document.paragraph', state: { text: 'First' } },
        { id: 'divider-1', type: 'document.divider' },
      ])

      const patch = createTrailingBlockPatch(content, () => 'gen-1')

      expect(patch).toEqual({
        type: 'block.insert',
        parentId: 'root',
        after: 'divider-1',
        block: { id: 'gen-1', type: 'document.paragraph' },
      })
    })

    it('returns null and never calls the id generator when no trailing block is needed', () => {
      const content = createContent([{ id: 'p1', type: 'document.paragraph', state: { text: 'First' } }])
      const generateBlockId = jest.fn(() => 'gen-1')

      expect(createTrailingBlockPatch(content, generateBlockId)).toBeNull()
      expect(generateBlockId).not.toHaveBeenCalled()
    })
  })

  describe('withTrailingBlock', () => {
    it('appends an empty paragraph to an empty document (BVA: zero blocks)', () => {
      const next = withTrailingBlock(createContent(), () => 'gen-1')

      expect(next.root.children?.map((block) => block.id)).toEqual(['gen-1'])
      expect(next.root.children?.[0]).toMatchObject({ type: 'document.paragraph' })
    })

    it('appends after a trailing non-text block', () => {
      const content = createContent([{ id: 'divider-1', type: 'document.divider' }])

      const next = withTrailingBlock(content, () => 'gen-1')

      expect(next.root.children?.map((block) => block.id)).toEqual(['divider-1', 'gen-1'])
    })

    it('returns the same reference when the invariant already holds', () => {
      const content = createContent([{ id: 'p1', type: 'document.paragraph', state: { text: 'First' } }])
      const generateBlockId = jest.fn(() => 'gen-1')

      expect(withTrailingBlock(content, generateBlockId)).toBe(content)
      expect(generateBlockId).not.toHaveBeenCalled()
    })
  })

  describe('isEmptyDocument', () => {
    it('returns true for a single empty paragraph', () => {
      expect(isEmptyDocument(createContent([{ id: 'p1', type: 'document.paragraph' }]))).toBe(true)
    })

    it('returns false for a single paragraph with text', () => {
      expect(isEmptyDocument(createContent([{ id: 'p1', type: 'document.paragraph', state: { text: 'Hi' } }]))).toBe(
        false,
      )
    })

    it('returns false for zero children (BVA: not yet normalized)', () => {
      expect(isEmptyDocument(createContent())).toBe(false)
    })

    it('returns false for two children even when both are empty', () => {
      const content = createContent([
        { id: 'p1', type: 'document.paragraph' },
        { id: 'p2', type: 'document.paragraph' },
      ])

      expect(isEmptyDocument(content)).toBe(false)
    })

    it('returns false for a single non-text block', () => {
      expect(isEmptyDocument(createContent([{ id: 'divider-1', type: 'document.divider' }]))).toBe(false)
    })

    it('returns false for a single empty paragraph that has children', () => {
      const content = createContent([
        { id: 'p1', type: 'document.paragraph', children: [{ id: 'p2', type: 'document.paragraph' }] },
      ])

      expect(isEmptyDocument(content)).toBe(false)
    })
  })
})
