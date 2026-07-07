import { createDocumentBlock, findBlockById, type SduiDocumentContent } from '@lodado/sdui-document'

import { buildBlockDropPatches, hasPassedThreshold, type OverHit, projectBlockDrop } from '../hooks/useBlockPointerDrag'

const INDENT_WIDTH = 24

function createContent(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({ id: 'block-a', type: 'document.paragraph', state: { text: 'A' } }),
        createDocumentBlock({ id: 'block-b', type: 'document.paragraph', state: { text: 'B' } }),
      ],
    }),
  }
}

/** Over-row hit at x=0 with the given width; height is irrelevant to the horizontal band. */
function overRow(width: number): OverHit {
  return { overId: 'block-b', rowRect: { left: 0, top: 0, width, height: 0 } }
}

/** Drop `block-a` onto `block-b` at an absolute pointer X (no horizontal indent travel). */
function dropAt(content: SduiDocumentContent, hit: OverHit, pointerX: number) {
  return buildBlockDropPatches({
    content,
    activeId: 'block-a',
    hit,
    pointerX,
    pointerY: 0,
    startX: pointerX,
    indentWidth: INDENT_WIDTH,
  })
}

describe('hasPassedThreshold (press → drag activation)', () => {
  describe('as is: the default 4px activation distance', () => {
    describe('when the pointer has barely moved (BVA: 3px < 4px)', () => {
      it('to be: false — still a click', () => {
        expect(hasPassedThreshold(3, 0)).toBe(false)
      })
    })

    describe('when the pointer moved exactly the threshold (BVA: 4px)', () => {
      it('to be: true — drag activates', () => {
        expect(hasPassedThreshold(4, 0)).toBe(true)
      })
    })

    describe('when the pointer moved diagonally past it (EP: Euclidean, 3-4-5)', () => {
      it('to be: true', () => {
        expect(hasPassedThreshold(3, 4)).toBe(true)
      })
    })
  })
})

describe('buildBlockDropPatches — column split vs vertical move', () => {
  // 200px row at x=0: 40px right band → x within [160, 200] splits, else vertical.
  describe('as is: a drop on the RIGHT edge band of another row', () => {
    describe('when the pointer is 20px from the right edge (BVA: inside the 40px band)', () => {
      it('to be: a column-split batch — over left, active right', () => {
        const content = createContent()

        const patches = dropAt(content, overRow(200), 180)

        expect(patches).not.toBeNull()
        expect(patches![0]).toMatchObject({ type: 'block.insert', parentId: 'root' })
        expect((patches![0] as { block: { type: string } }).block.type).toBe('document.columnList')
        expect((patches![0] as { block: { children: { id: string }[] } }).block.children.map((c) => c.id)).toEqual([
          'block-b-col',
          'block-a-col',
        ])
        expect(patches![1]).toMatchObject({ type: 'block.move', blockId: 'block-b', parentId: 'block-b-col' })
        expect(patches![2]).toMatchObject({ type: 'block.move', blockId: 'block-a', parentId: 'block-a-col' })
        // sanity: the source content is never mutated — applyPatches owns the state
        expect(findBlockById(content, 'block-b-cols')).toBeUndefined()
      })
    })
  })

  describe('as is: a drop on the MIDDLE of another row (EP: vertical partition)', () => {
    describe('when the pointer is at the row center', () => {
      it('to be: a single block.move, no columnList', () => {
        const content = createContent()

        const patches = dropAt(content, overRow(200), 100)

        expect(patches).toHaveLength(1)
        expect(patches![0]).toMatchObject({ type: 'block.move', blockId: 'block-a' })
      })
    })
  })

  describe('as is: a WIDE 800px row (the band is a fixed 40px, not a % of width)', () => {
    describe('when the pointer is 100px from the right edge (outside the 40px band)', () => {
      it('to be: the vertical move path — band must NOT scale with row width', () => {
        const content = createContent()

        const patches = dropAt(content, overRow(800), 700)

        expect(patches).toHaveLength(1)
        expect(patches![0]).toMatchObject({ type: 'block.move', blockId: 'block-a' })
      })
    })

    describe('when the pointer is 20px from the right edge (inside the band)', () => {
      it('to be: a column split', () => {
        const content = createContent()

        const patches = dropAt(content, overRow(800), 780)

        expect((patches![0] as { block: { type: string } }).block.type).toBe('document.columnList')
      })
    })
  })

  describe('as is: a drop onto the dragged block itself (negative partition)', () => {
    describe('when active and over are the same block', () => {
      it('to be: null — no self-move', () => {
        const content = createContent()

        const patches = buildBlockDropPatches({
          content,
          activeId: 'block-a',
          hit: { overId: 'block-a', rowRect: { left: 0, top: 0, width: 200, height: 30 } },
          pointerX: 100,
          pointerY: 15,
          startX: 100,
          indentWidth: INDENT_WIDTH,
        })

        expect(patches).toBeNull()
      })
    })
  })
})

describe('projectBlockDrop — indicator projection branch', () => {
  describe('as is: hovering the right edge band', () => {
    describe('when the pointer is inside the 40px band', () => {
      it('to be: a horizontal projection with side "right"', () => {
        const projection = projectBlockDrop({
          content: createContent(),
          activeId: 'block-a',
          hit: overRow(200),
          pointerX: 180,
          pointerY: 0,
          startX: 180,
          indentWidth: INDENT_WIDTH,
        })

        expect(projection).toMatchObject({ side: 'right' })
      })
    })
  })
})
