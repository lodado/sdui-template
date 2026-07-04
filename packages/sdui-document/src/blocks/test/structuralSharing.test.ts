import {
  applyDocumentPatch,
  createBlockId,
  createDocumentBlock,
  findBlockById,
  type SduiDocumentContent,
} from '../../index'

/**
 * Fixture tree:
 * root
 * ├── a (a1, a2)
 * ├── b (b1)
 * └── c
 */
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
          state: { text: 'A' },
          children: [
            createDocumentBlock({ id: 'a1', type: 'document.paragraph', state: { text: 'A1' } }),
            createDocumentBlock({ id: 'a2', type: 'document.paragraph', state: { text: 'A2' } }),
          ],
        }),
        createDocumentBlock({
          id: 'b',
          type: 'document.paragraph',
          state: { text: 'B' },
          children: [createDocumentBlock({ id: 'b1', type: 'document.paragraph', state: { text: 'B1' } })],
        }),
        createDocumentBlock({ id: 'c', type: 'document.paragraph', state: { text: 'C' } }),
      ],
    }),
  }
}

describe('applyDocumentPatch structural sharing', () => {
  describe('as is: block.update on a nested block (EP: single-path mutation)', () => {
    describe('when a1 is updated', () => {
      it('to be: the a1 path gets fresh references while untouched subtrees are shared', () => {
        const content = createContent()

        const next = applyDocumentPatch(content, {
          type: 'block.update',
          blockId: findBlockById(content, 'a1')!.id,
          state: { text: 'A1 changed' },
        })

        // path to the touched block: all new references (immutability contract)
        expect(next).not.toBe(content)
        expect(next.root).not.toBe(content.root)
        expect(findBlockById(next, 'a')).not.toBe(findBlockById(content, 'a'))
        expect(findBlockById(next, 'a1')).not.toBe(findBlockById(content, 'a1'))

        // off-path subtrees: identical references (memo bail-out contract)
        expect(findBlockById(next, 'a2')).toBe(findBlockById(content, 'a2'))
        expect(findBlockById(next, 'b')).toBe(findBlockById(content, 'b'))
        expect(findBlockById(next, 'b1')).toBe(findBlockById(content, 'b1'))
        expect(findBlockById(next, 'c')).toBe(findBlockById(content, 'c'))
      })

      it('to be: the original document is left untouched (immutability)', () => {
        const content = createContent()
        const snapshot = JSON.parse(JSON.stringify(content))

        applyDocumentPatch(content, {
          type: 'block.update',
          blockId: findBlockById(content, 'a1')!.id,
          state: { text: 'A1 changed' },
        })

        expect(content).toEqual(snapshot)
      })
    })
  })

  describe('as is: block.delete of a nested block (EP: parent-array mutation)', () => {
    describe('when a1 is deleted', () => {
      it('to be: siblings of the path stay shared, original intact', () => {
        const content = createContent()
        const snapshot = JSON.parse(JSON.stringify(content))

        const next = applyDocumentPatch(content, {
          type: 'block.delete',
          blockId: findBlockById(content, 'a1')!.id,
        })

        expect(findBlockById(next, 'a2')).toBe(findBlockById(content, 'a2'))
        expect(findBlockById(next, 'b')).toBe(findBlockById(content, 'b'))
        expect(content).toEqual(snapshot)
      })
    })
  })

  describe('as is: block.move across parents (BVA: two touched paths at once)', () => {
    describe('when b1 moves under a', () => {
      it('to be: both parents get fresh references, the c subtree stays shared', () => {
        const content = createContent()
        const snapshot = JSON.parse(JSON.stringify(content))

        const next = applyDocumentPatch(content, {
          type: 'block.move',
          blockId: findBlockById(content, 'b1')!.id,
          parentId: findBlockById(content, 'a')!.id,
          index: 0,
        })

        expect(findBlockById(next, 'a')).not.toBe(findBlockById(content, 'a'))
        expect(findBlockById(next, 'b')).not.toBe(findBlockById(content, 'b'))
        expect(findBlockById(next, 'c')).toBe(findBlockById(content, 'c'))
        expect(content).toEqual(snapshot)
      })
    })
  })

  describe('as is: failing patch (EP: error partition)', () => {
    describe('when the target block does not exist', () => {
      it('to be: throws and the original document is untouched', () => {
        const content = createContent()
        const snapshot = JSON.parse(JSON.stringify(content))

        expect(() =>
          applyDocumentPatch(content, {
            type: 'block.update',
            blockId: createBlockId('missing'),
            state: { text: 'x' },
          }),
        ).toThrow()
        expect(content).toEqual(snapshot)
      })
    })
  })
})
