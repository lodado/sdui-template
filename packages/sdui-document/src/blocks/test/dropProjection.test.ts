import { createDocumentBlock, projectNestedBlockDrop, type SduiDocumentContent } from '../../index'

const INDENT_WIDTH = 24

/**
 * Fixture tree (flattened order / depth):
 *
 * root            depth 0
 * ├── a           depth 1
 * │   ├── a1      depth 2
 * │   └── a2      depth 2
 * ├── b           depth 1
 * └── c           depth 1
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

function project(activeId: string, overId: string, offsetX: number) {
  return projectNestedBlockDrop({
    content: createContent(),
    activeId,
    overId,
    offsetX,
    indentWidth: INDENT_WIDTH,
  })
}

describe('projectNestedBlockDrop', () => {
  describe('as is: dragging c over b (both depth 1)', () => {
    describe('when offsetX is 0 (EP: no horizontal intent)', () => {
      it('to be: after b at the same depth', () => {
        expect(project('c', 'b', 0)).toEqual({ overId: 'b', position: 'after', depth: 1 })
      })
    })

    describe('when offsetX is indentWidth (BVA: exactly one level deeper)', () => {
      it('to be: inside b (b becomes parent)', () => {
        expect(project('c', 'b', INDENT_WIDTH)).toEqual({ overId: 'b', position: 'inside', depth: 2 })
      })
    })

    describe('when offsetX is indentWidth/2 (BVA: round-up threshold)', () => {
      it('to be: inside b (rounds to +1 depth)', () => {
        expect(project('c', 'b', INDENT_WIDTH / 2)).toEqual({ overId: 'b', position: 'inside', depth: 2 })
      })
    })

    describe('when offsetX is indentWidth/2 - 1 (BVA: just below round threshold)', () => {
      it('to be: stays after b at depth 1', () => {
        expect(project('c', 'b', INDENT_WIDTH / 2 - 1)).toEqual({ overId: 'b', position: 'after', depth: 1 })
      })
    })

    describe('when offsetX is huge (BVA: beyond maxDepth = previous.depth + 1)', () => {
      it('to be: clamped to inside b', () => {
        expect(project('c', 'b', INDENT_WIDTH * 10)).toEqual({ overId: 'b', position: 'inside', depth: 2 })
      })
    })
  })

  describe('as is: dragging c over a2 (previous is nested at depth 2)', () => {
    describe('when offsetX keeps depth 1 (EP: shallower than previous)', () => {
      it('to be: after the depth-1 ancestor (a), not after a2', () => {
        expect(project('c', 'a2', 0)).toEqual({ overId: 'a', position: 'after', depth: 1 })
      })
    })

    describe('when offsetX targets depth 2 (EP: sibling of previous)', () => {
      it('to be: after a2 at depth 2', () => {
        expect(project('c', 'a2', INDENT_WIDTH)).toEqual({ overId: 'a2', position: 'after', depth: 2 })
      })
    })

    describe('when offsetX drags far left (BVA: below minDepth from next item)', () => {
      it('to be: clamped so the slot stays valid for the next item (b at depth 1)', () => {
        expect(project('c', 'a2', -INDENT_WIDTH * 10)).toEqual({ overId: 'a', position: 'after', depth: 1 })
      })
    })
  })

  describe('as is: dragging b over a (a has children)', () => {
    describe('when the next visible item (a1) is deeper (BVA: minDepth = next.depth)', () => {
      it('to be: forced inside a — dropping between a and a1 at depth 1 would break the tree', () => {
        expect(project('b', 'a', 0)).toEqual({ overId: 'a', position: 'inside', depth: 2 })
      })
    })
  })

  describe('as is: dragging a (subtree with children)', () => {
    describe('when over its own descendant a1 (EP: invalid target partition)', () => {
      it('to be: null — active subtree is excluded from drop targets', () => {
        expect(project('a', 'a1', 0)).toBeNull()
      })
    })

    describe('when over itself', () => {
      it('to be: null', () => {
        expect(project('a', 'a', 0)).toBeNull()
      })
    })

    describe('when over b with no offset (EP: subtree relocation)', () => {
      it('to be: after b at depth 1 (subtree moves as a unit)', () => {
        expect(project('a', 'b', 0)).toEqual({ overId: 'b', position: 'after', depth: 1 })
      })
    })
  })

  describe('as is: dragging over the root block (EP: invalid target)', () => {
    describe('when overId is root', () => {
      it('to be: null', () => {
        expect(project('c', 'root', 0)).toBeNull()
      })
    })
  })
})
