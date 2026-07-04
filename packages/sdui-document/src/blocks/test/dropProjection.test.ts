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

function project(activeId: string, overId: string, offsetX: number, overRatio?: number) {
  return projectNestedBlockDrop({
    content: createContent(),
    activeId,
    overId,
    offsetX,
    indentWidth: INDENT_WIDTH,
    ...(overRatio === undefined ? {} : { overRatio }),
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

  describe('as is: vertical zones via overRatio (pointer position within the over row)', () => {
    describe('when overRatio is 0.1 (EP: top zone)', () => {
      it('to be: before b at its own depth — dropping on the upper edge inserts above', () => {
        expect(project('c', 'b', 0, 0.1)).toEqual({ overId: 'b', position: 'before', depth: 1 })
      })
    })

    describe('when overRatio is just below the before-threshold (BVA: 0.25 - epsilon)', () => {
      it('to be: still before b', () => {
        expect(project('c', 'b', 0, 0.24)).toEqual({ overId: 'b', position: 'before', depth: 1 })
      })
    })

    describe('when overRatio is exactly the before-threshold (BVA: 0.25)', () => {
      it('to be: inside b — hovering the body of a block nests as its child', () => {
        expect(project('c', 'b', 0, 0.25)).toEqual({ overId: 'b', position: 'inside', depth: 2 })
      })
    })

    describe('when overRatio is 0.5 (EP: middle zone)', () => {
      it('to be: inside b even with zero horizontal offset', () => {
        expect(project('c', 'b', 0, 0.5)).toEqual({ overId: 'b', position: 'inside', depth: 2 })
      })
    })

    describe('when overRatio is exactly the after-threshold (BVA: 0.75)', () => {
      it('to be: still inside b', () => {
        expect(project('c', 'b', 0, 0.75)).toEqual({ overId: 'b', position: 'inside', depth: 2 })
      })
    })

    describe('when overRatio is just above the after-threshold (BVA: 0.76)', () => {
      it('to be: after b — bottom zone falls back to the horizontal depth logic', () => {
        expect(project('c', 'b', 0, 0.76)).toEqual({ overId: 'b', position: 'after', depth: 1 })
      })
    })

    describe('when overRatio is 1 with a huge horizontal offset (EP: pointer travel is not intent)', () => {
      it('to be: after b at its own depth — dragging from a far-left handle must not read as nesting', () => {
        expect(project('c', 'b', INDENT_WIDTH * 10, 1)).toEqual({ overId: 'b', position: 'after', depth: 1 })
      })
    })

    describe('when hovering the bottom zone of a (next row a1 is its child — BVA: minDepth forces +1)', () => {
      it('to be: inside a, first-child slot — the only well-formed slot right below the a row', () => {
        expect(project('b', 'a', 0, 0.9)).toEqual({ overId: 'a', position: 'inside', depth: 2 })
      })
    })

    describe('when hovering the bottom zone of a2 (last child, next row b is shallower)', () => {
      it('to be: after a2 at depth 2 — stays a sibling of a2, not pulled to depth 1', () => {
        expect(project('c', 'a2', 0, 0.9)).toEqual({ overId: 'a2', position: 'after', depth: 2 })
      })
    })

    describe('when hovering the middle of a (a already has children)', () => {
      it('to be: inside a', () => {
        expect(project('b', 'a', 0, 0.5)).toEqual({ overId: 'a', position: 'inside', depth: 2 })
      })
    })

    describe('when hovering the top zone of a1 (first child of a)', () => {
      it('to be: before a1 at depth 2', () => {
        expect(project('c', 'a1', 0, 0.1)).toEqual({ overId: 'a1', position: 'before', depth: 2 })
      })
    })

    describe('when overRatio is omitted (EP: legacy callers)', () => {
      it('to be: unchanged after-based projection', () => {
        expect(project('c', 'b', 0)).toEqual({ overId: 'b', position: 'after', depth: 1 })
      })
    })

    describe('when the target is invalid (EP: guards run before zones)', () => {
      it('to be: null for root / self / own subtree regardless of ratio', () => {
        expect(project('c', 'root', 0, 0.5)).toBeNull()
        expect(project('a', 'a', 0, 0.5)).toBeNull()
        expect(project('a', 'a1', 0, 0.5)).toBeNull()
      })
    })
  })
})
