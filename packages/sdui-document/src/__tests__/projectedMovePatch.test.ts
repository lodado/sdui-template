import { createDocumentBlock, createProjectedBlockMovePatch, type SduiDocumentContent } from '../index'

const INDENT_WIDTH = 24

/**
 * Fixture tree: root > a (a1, a2) > b > c   (same as dropProjection fixture)
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
          children: [
            createDocumentBlock({ id: 'a1', type: 'document.paragraph' }),
            createDocumentBlock({ id: 'a2', type: 'document.paragraph' }),
          ],
        }),
        createDocumentBlock({ id: 'b', type: 'document.paragraph' }),
        createDocumentBlock({ id: 'c', type: 'document.paragraph' }),
      ],
    }),
  }
}

describe('createProjectedBlockMovePatch', () => {
  describe('as is: valid projection — c dropped after b (EP: happy partition)', () => {
    describe('when the patch is created', () => {
      it("to be: a block.move patch targeting b's parent at the slot after b", () => {
        expect(
          createProjectedBlockMovePatch({
            content: createContent(),
            activeId: 'c',
            overId: 'b',
            offsetX: 0,
            indentWidth: INDENT_WIDTH,
          }),
        ).toEqual({ type: 'block.move', blockId: 'c', parentId: 'root', index: 2 })
      })
    })
  })

  describe('as is: projection resolving to inside (BVA: offsetX = indentWidth)', () => {
    describe('when the patch is created', () => {
      it('to be: block.move appending as the last child of the over block', () => {
        expect(
          createProjectedBlockMovePatch({
            content: createContent(),
            activeId: 'c',
            overId: 'b',
            offsetX: INDENT_WIDTH,
            indentWidth: INDENT_WIDTH,
          }),
        ).toEqual({ type: 'block.move', blockId: 'c', parentId: 'b', index: 0 })
      })
    })
  })

  describe('as is: invalid targets (EP: null passthrough partition)', () => {
    describe('when dropping onto the dragged subtree itself', () => {
      it('to be: null — no patch produced', () => {
        expect(
          createProjectedBlockMovePatch({
            content: createContent(),
            activeId: 'a',
            overId: 'a1',
            offsetX: 0,
            indentWidth: INDENT_WIDTH,
          }),
        ).toBeNull()
      })
    })

    describe('when dropping onto the root', () => {
      it('to be: null', () => {
        expect(
          createProjectedBlockMovePatch({
            content: createContent(),
            activeId: 'c',
            overId: 'root',
            offsetX: 0,
            indentWidth: INDENT_WIDTH,
          }),
        ).toBeNull()
      })
    })
  })

  describe('as is: no-op drop — same position (EP: identity partition)', () => {
    describe('when c is dropped right after b at its current depth', () => {
      it('to be: patch still produced (engine applies it as a stable no-op)', () => {
        const patch = createProjectedBlockMovePatch({
          content: createContent(),
          activeId: 'c',
          overId: 'b',
          offsetX: 0,
          indentWidth: INDENT_WIDTH,
        })

        expect(patch).not.toBeNull()
      })
    })
  })
})
