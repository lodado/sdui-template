import { COLUMN_BLOCK_TYPE } from '../../block-types/column/column.type'
import { COLUMN_LIST_BLOCK_TYPE } from '../../block-types/column-list/columnList.type'
import {
  appendColumnCleanupPatches,
  createNestedBlockMovePatch,
  HORIZONTAL_DROP_EDGE_PX,
  projectHorizontalBlockDrop,
} from '../drag'
import { applyDocumentPatches } from '../patch'
import { createDocumentBlock, type CreateDocumentBlockInput, type SduiDocumentContent } from '../schema'

const paragraph = (id: string, text = id): CreateDocumentBlockInput => ({
  id,
  type: 'document.paragraph',
  state: { text },
})

const column = (id: string, children: CreateDocumentBlockInput[]): CreateDocumentBlockInput => ({
  id,
  type: COLUMN_BLOCK_TYPE,
  children,
})

const columnList = (id: string, children: CreateDocumentBlockInput[]): CreateDocumentBlockInput => ({
  id,
  type: COLUMN_LIST_BLOCK_TYPE,
  children,
})

const content = (children: CreateDocumentBlockInput[]): SduiDocumentContent => ({
  schemaVersion: '1.0',
  root: createDocumentBlock({ id: 'root', type: 'document.root', children }),
})

const childIds = (block: { children?: { id: string }[] }) => (block.children ?? []).map((child) => child.id)

const findById = (block: any, id: string): any => {
  if (block.id === id) return block
  return (block.children ?? []).map((child: any) => findById(child, id)).find(Boolean)
}

describe('projectHorizontalBlockDrop', () => {
  const base = () => content([paragraph('block-a'), paragraph('block-b')])

  // BVA on overOffsetX around the FIXED pixel edge band (HORIZONTAL_DROP_EDGE_PX):
  // only a pointer hugging the row's real edge triggers a split — zones are
  // EXCLUSIVE at exactly edge px, and do NOT scale with row width
  describe('as is: a wide 800px over row (edge band = the full constant)', () => {
    describe.each([
      ['just inside the left edge band (boundary - 1px)', HORIZONTAL_DROP_EDGE_PX - 1, 'left'],
      ['exactly at the left band boundary', HORIZONTAL_DROP_EDGE_PX, null],
      ['past the old 20% ratio zone but outside the band (BVA: 160px on 800px row)', 160, null],
      ['mirror of 160px from the right edge', 800 - 160, null],
      ['exactly at the right band boundary', 800 - HORIZONTAL_DROP_EDGE_PX, null],
      ['just inside the right edge band (boundary + 1px)', 800 - HORIZONTAL_DROP_EDGE_PX + 1, 'right'],
      ['overshooting LEFT of the row entirely (negative offset)', -10, 'left'],
      ['overshooting RIGHT of the row entirely (offset > width)', 900, 'right'],
    ])('when the pointer sits %s', (_label, overOffsetX, expectedSide) => {
      it(`to be: ${expectedSide === null ? 'null (vertical logic takes over)' : `a ${expectedSide} drop`}`, () => {
        const projected = projectHorizontalBlockDrop({
          content: base(),
          activeId: 'block-a',
          overId: 'block-b',
          overOffsetX,
          overWidth: 800,
        })

        if (expectedSide === null) {
          expect(projected).toBeNull()
        } else {
          expect(projected).toEqual({ overId: 'block-b', side: expectedSide })
        }
      })
    })

    describe('when the pointer position is unmeasurable (keyboard activation)', () => {
      it('to be: null', () => {
        expect(projectHorizontalBlockDrop({ content: base(), activeId: 'block-a', overId: 'block-b' })).toBeNull()
      })
    })

    describe('when the over width is degenerate (BVA: 0)', () => {
      it('to be: null', () => {
        expect(
          projectHorizontalBlockDrop({
            content: base(),
            activeId: 'block-a',
            overId: 'block-b',
            overOffsetX: 10,
            overWidth: 0,
          }),
        ).toBeNull()
      })
    })
  })

  describe('as is: a narrow 100px row (band clamps to 25% so a middle zone survives)', () => {
    describe.each([
      ['24px from the left (inside the clamped 25px band)', 24, 'left'],
      ['exactly at the clamped boundary (25px)', 25, null],
      ['center (50px)', 50, null],
      ['76px (inside the clamped right band)', 76, 'right'],
    ])('when the pointer sits %s', (_label, overOffsetX, expectedSide) => {
      it(`to be: ${expectedSide === null ? 'null' : `a ${expectedSide} drop`}`, () => {
        const projected = projectHorizontalBlockDrop({
          content: base(),
          activeId: 'block-a',
          overId: 'block-b',
          overOffsetX,
          overWidth: 100,
        })

        if (expectedSide === null) {
          expect(projected).toBeNull()
        } else {
          expect(projected).toEqual({ overId: 'block-b', side: expectedSide })
        }
      })
    })
  })

  describe('as is: an edge-zone pointer over an invalid target', () => {
    describe('when over is the active block itself', () => {
      it('to be: null even in the edge zone', () => {
        expect(
          projectHorizontalBlockDrop({
            content: base(),
            activeId: 'block-a',
            overId: 'block-a',
            overOffsetX: 10,
            overWidth: 800,
          }),
        ).toBeNull()
      })
    })

    describe('when over sits inside the dragged subtree', () => {
      it('to be: null', () => {
        const input = content([
          { id: 'callout-a', type: 'document.callout', children: [paragraph('p-nested')] },
          paragraph('block-b'),
        ])

        expect(
          projectHorizontalBlockDrop({
            content: input,
            activeId: 'callout-a',
            overId: 'p-nested',
            overOffsetX: 10,
            overWidth: 800,
          }),
        ).toBeNull()
      })
    })
  })
})

describe('appendColumnCleanupPatches', () => {
  describe('as is: a three-column split where one column holds a single block', () => {
    describe('when a move patch drags that last block out to the root', () => {
      it('to be: the emptied column deleted in the same batch, split preserved (2 columns left)', () => {
        const input = content([
          columnList('cl', [
            column('col-a', [paragraph('p-a')]),
            column('col-b', [paragraph('p-b')]),
            column('col-c', [paragraph('p-c')]),
          ]),
          paragraph('tail'),
        ])

        const move = createNestedBlockMovePatch({ content: input, activeId: 'p-c', overId: 'tail', position: 'after' })
        const patches = appendColumnCleanupPatches(input, [move])
        const next = applyDocumentPatches(input, patches)

        expect(childIds(findById(next.root, 'cl'))).toEqual(['col-a', 'col-b'])
        expect(childIds(next.root)).toEqual(['cl', 'tail', 'p-c'])
      })
    })
  })

  describe('as is: a two-column split (min valid) where one column holds a single block', () => {
    describe('when that block is dragged out (cascade boundary: 2 → 1 column)', () => {
      it('to be: empty column deleted AND the single-column list unwrapped in place', () => {
        const input = content([
          paragraph('head'),
          columnList('cl', [
            column('col-a', [paragraph('p-a1'), paragraph('p-a2')]),
            column('col-b', [paragraph('p-b')]),
          ]),
          paragraph('tail'),
        ])

        const move = createNestedBlockMovePatch({ content: input, activeId: 'p-b', overId: 'tail', position: 'after' })
        const patches = appendColumnCleanupPatches(input, [move])
        const next = applyDocumentPatches(input, patches)

        // col-a's contents take the columnList slot, order preserved
        expect(childIds(next.root)).toEqual(['head', 'p-a1', 'p-a2', 'tail', 'p-b'])
        expect(findById(next.root, 'cl')).toBeUndefined()
        expect(findById(next.root, 'col-a')).toBeUndefined()
      })
    })
  })

  describe('as is: a move that leaves every column populated (no violation partition)', () => {
    describe('when cleanup is appended', () => {
      it('to be: the original patches returned unchanged', () => {
        const input = content([
          columnList('cl', [
            column('col-a', [paragraph('p-a1'), paragraph('p-a2')]),
            column('col-b', [paragraph('p-b')]),
          ]),
          paragraph('tail'),
        ])

        const move = createNestedBlockMovePatch({ content: input, activeId: 'p-a2', overId: 'tail', position: 'after' })
        const patches = appendColumnCleanupPatches(input, [move])

        expect(patches).toEqual([move])
      })
    })
  })

  describe('as is: an empty starting patch list (identity boundary)', () => {
    describe('when the content is already clean', () => {
      it('to be: an empty patch list back', () => {
        const input = content([paragraph('p-a')])

        expect(appendColumnCleanupPatches(input, [])).toEqual([])
      })
    })
  })
})
