import {
  applyDocumentPatch,
  BlockNotFoundError,
  createDocumentBlock,
  DuplicateBlockIdError,
  findBlockById,
  InvalidBlockMergeError,
  InvalidBlockSplitError,
  InvalidInlineOffsetError,
  type SduiDocumentContent,
} from '../index'

const bold = { type: 'bold' } as const

/**
 * Fixture tree:
 *
 * root
 * ├── rich-1      content-mode: bold "Hello" + plain " world" (length 11)
 * ├── text-1      text-mode: state.text "Plain text"
 * └── parent-1    content-mode "Parent", children: [child-1, child-2]
 */
function createContent(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({
          id: 'rich-1',
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
          id: 'text-1',
          type: 'document.paragraph',
          state: { text: 'Plain text' },
        }),
        createDocumentBlock({
          id: 'parent-1',
          type: 'document.callout',
          state: { content: [{ type: 'text', text: 'Parent' }], text: 'Parent' },
          children: [
            createDocumentBlock({ id: 'child-1', type: 'document.paragraph', state: { text: 'c1' } }),
            createDocumentBlock({ id: 'child-2', type: 'document.paragraph', state: { text: 'c2' } }),
          ],
        }),
      ],
    }),
  }
}

describe('block.split patch', () => {
  describe('as is: content-mode block "Hello world" (length 11)', () => {
    describe('when split at offset 5 (EP: interior, on mark boundary)', () => {
      it('to be: original keeps first half, new next sibling gets second half with same type', () => {
        const next = applyDocumentPatch(createContent(), {
          type: 'block.split',
          blockId: 'rich-1',
          offset: 5,
          newBlockId: 'rich-2',
        })

        expect(next.root.children?.map((block) => block.id)).toEqual(['rich-1', 'rich-2', 'text-1', 'parent-1'])
        expect(findBlockById(next, 'rich-1')?.state).toMatchObject({
          content: [{ type: 'text', text: 'Hello', marks: [bold] }],
          text: 'Hello',
        })
        expect(findBlockById(next, 'rich-2')).toMatchObject({
          type: 'document.paragraph',
          state: { content: [{ type: 'text', text: ' world' }], text: ' world' },
        })
      })
    })

    describe('when split at offset 0 (BVA: min)', () => {
      it('to be: original becomes empty, new block carries all content', () => {
        const next = applyDocumentPatch(createContent(), {
          type: 'block.split',
          blockId: 'rich-1',
          offset: 0,
          newBlockId: 'rich-2',
        })

        expect(findBlockById(next, 'rich-1')?.state).toMatchObject({ content: [], text: '' })
        expect(findBlockById(next, 'rich-2')?.state?.text).toBe('Hello world')
      })
    })

    describe('when split at offset 11 (BVA: max = length)', () => {
      it('to be: new block is empty', () => {
        const next = applyDocumentPatch(createContent(), {
          type: 'block.split',
          blockId: 'rich-1',
          offset: 11,
          newBlockId: 'rich-2',
        })

        expect(findBlockById(next, 'rich-1')?.state?.text).toBe('Hello world')
        expect(findBlockById(next, 'rich-2')?.state).toMatchObject({ content: [], text: '' })
      })
    })

    describe('when split at offset 12 (BVA: max + 1)', () => {
      it('to be: throws InvalidInlineOffsetError', () => {
        expect(() =>
          applyDocumentPatch(createContent(), {
            type: 'block.split',
            blockId: 'rich-1',
            offset: 12,
            newBlockId: 'rich-2',
          }),
        ).toThrow(InvalidInlineOffsetError)
      })
    })
  })

  describe('as is: text-mode block "Plain text" (EP: state.text without state.content)', () => {
    describe('when split at offset 5', () => {
      it('to be: halves stay in text mode (no content array introduced)', () => {
        const next = applyDocumentPatch(createContent(), {
          type: 'block.split',
          blockId: 'text-1',
          offset: 5,
          newBlockId: 'text-2',
        })

        expect(findBlockById(next, 'text-1')?.state).toEqual({ text: 'Plain' })
        expect(findBlockById(next, 'text-2')?.state).toEqual({ text: ' text' })
      })
    })
  })

  describe('as is: block with children', () => {
    describe('when split at offset 3', () => {
      it('to be: children stay on the original block, new block has none', () => {
        const next = applyDocumentPatch(createContent(), {
          type: 'block.split',
          blockId: 'parent-1',
          offset: 3,
          newBlockId: 'parent-2',
        })

        expect(findBlockById(next, 'parent-1')?.children?.map((block) => block.id)).toEqual(['child-1', 'child-2'])
        expect(findBlockById(next, 'parent-2')?.children).toBeUndefined()
      })
    })
  })

  describe('as is: invalid split targets (EP: error partitions)', () => {
    describe('when splitting the root block', () => {
      it('to be: throws InvalidBlockSplitError', () => {
        expect(() =>
          applyDocumentPatch(createContent(), {
            type: 'block.split',
            blockId: 'root',
            offset: 0,
            newBlockId: 'root-2',
          }),
        ).toThrow(InvalidBlockSplitError)
      })
    })

    describe('when splitting a missing block', () => {
      it('to be: throws BlockNotFoundError', () => {
        expect(() =>
          applyDocumentPatch(createContent(), {
            type: 'block.split',
            blockId: 'missing',
            offset: 0,
            newBlockId: 'new-1',
          }),
        ).toThrow(BlockNotFoundError)
      })
    })

    describe('when newBlockId already exists in the tree', () => {
      it('to be: throws DuplicateBlockIdError', () => {
        expect(() =>
          applyDocumentPatch(createContent(), {
            type: 'block.split',
            blockId: 'rich-1',
            offset: 5,
            newBlockId: 'text-1',
          }),
        ).toThrow(DuplicateBlockIdError)
      })
    })
  })

  describe('as is: any split', () => {
    describe('when the patch is applied', () => {
      it('to be: original content is not mutated', () => {
        const original = createContent()

        applyDocumentPatch(original, {
          type: 'block.split',
          blockId: 'rich-1',
          offset: 5,
          newBlockId: 'rich-2',
        })

        expect(findBlockById(original, 'rich-2')).toBeUndefined()
        expect(findBlockById(original, 'rich-1')?.state?.text).toBe('Hello world')
      })
    })
  })
})

describe('block.merge patch', () => {
  describe('as is: two content-mode siblings', () => {
    describe('when merging parent-1 into rich-1', () => {
      it('to be: target content concatenated, merged block removed, children promoted in place', () => {
        const next = applyDocumentPatch(createContent(), {
          type: 'block.merge',
          blockId: 'parent-1',
          intoBlockId: 'rich-1',
        })

        expect(findBlockById(next, 'rich-1')?.state?.text).toBe('Hello worldParent')
        expect(findBlockById(next, 'parent-1')).toBeUndefined()
        // children promoted to parent-1's former position under root
        expect(next.root.children?.map((block) => block.id)).toEqual(['rich-1', 'text-1', 'child-1', 'child-2'])
      })
    })
  })

  describe('as is: two text-mode blocks (EP: both plain)', () => {
    describe('when merging text-mode into text-mode', () => {
      it('to be: stays in text mode with concatenated text', () => {
        const base = applyDocumentPatch(createContent(), {
          type: 'block.split',
          blockId: 'text-1',
          offset: 5,
          newBlockId: 'text-2',
        })

        const next = applyDocumentPatch(base, {
          type: 'block.merge',
          blockId: 'text-2',
          intoBlockId: 'text-1',
        })

        expect(findBlockById(next, 'text-1')?.state).toEqual({ text: 'Plain text' })
        expect(findBlockById(next, 'text-2')).toBeUndefined()
      })
    })
  })

  describe('as is: mixed modes (EP: content-mode target + text-mode source)', () => {
    describe('when merging text-1 into rich-1', () => {
      it('to be: normalized to content mode with derived text', () => {
        const next = applyDocumentPatch(createContent(), {
          type: 'block.merge',
          blockId: 'text-1',
          intoBlockId: 'rich-1',
        })

        const state = findBlockById(next, 'rich-1')?.state
        expect(state?.text).toBe('Hello worldPlain text')
        expect(Array.isArray(state?.content)).toBe(true)
      })
    })
  })

  describe('as is: invalid merge targets (EP: error partitions)', () => {
    describe('when merging a block into itself', () => {
      it('to be: throws InvalidBlockMergeError', () => {
        expect(() =>
          applyDocumentPatch(createContent(), {
            type: 'block.merge',
            blockId: 'rich-1',
            intoBlockId: 'rich-1',
          }),
        ).toThrow(InvalidBlockMergeError)
      })
    })

    describe('when merging the root block', () => {
      it('to be: throws InvalidBlockMergeError', () => {
        expect(() =>
          applyDocumentPatch(createContent(), {
            type: 'block.merge',
            blockId: 'root',
            intoBlockId: 'rich-1',
          }),
        ).toThrow(InvalidBlockMergeError)
      })
    })

    describe('when merging a block into its own descendant', () => {
      it('to be: throws InvalidBlockMergeError', () => {
        expect(() =>
          applyDocumentPatch(createContent(), {
            type: 'block.merge',
            blockId: 'parent-1',
            intoBlockId: 'child-1',
          }),
        ).toThrow(InvalidBlockMergeError)
      })
    })

    describe('when either block is missing', () => {
      it('to be: throws BlockNotFoundError', () => {
        expect(() =>
          applyDocumentPatch(createContent(), {
            type: 'block.merge',
            blockId: 'missing',
            intoBlockId: 'rich-1',
          }),
        ).toThrow(BlockNotFoundError)

        expect(() =>
          applyDocumentPatch(createContent(), {
            type: 'block.merge',
            blockId: 'rich-1',
            intoBlockId: 'missing',
          }),
        ).toThrow(BlockNotFoundError)
      })
    })
  })

  describe('as is: split then merge (round trip)', () => {
    describe('when a block is split and merged back', () => {
      it('to be: plain text restored to the original', () => {
        const original = createContent()
        const split = applyDocumentPatch(original, {
          type: 'block.split',
          blockId: 'rich-1',
          offset: 5,
          newBlockId: 'rich-2',
        })
        const merged = applyDocumentPatch(split, {
          type: 'block.merge',
          blockId: 'rich-2',
          intoBlockId: 'rich-1',
        })

        const childIdsOf = (content: SduiDocumentContent): string[] =>
          (content.root.children ?? []).map((block) => block.id)

        expect(findBlockById(merged, 'rich-1')?.state?.text).toBe('Hello world')
        expect(childIdsOf(merged)).toEqual(childIdsOf(original))
      })
    })
  })
})
