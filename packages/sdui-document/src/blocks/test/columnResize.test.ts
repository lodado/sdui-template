import { COLUMN_BLOCK_TYPE } from '../../block-types/column/column.type'
import { COLUMN_LIST_BLOCK_TYPE } from '../../block-types/column-list/columnList.type'
import { createColumnResizePatches, MIN_COLUMN_RATIO, resizeColumnPair } from '../patch/columnResize'
import { createDocumentBlock, type CreateDocumentBlockInput, type SduiDocumentContent } from '../schema'

const paragraph = (id: string): CreateDocumentBlockInput => ({ id, type: 'document.paragraph', state: { text: id } })

const column = (id: string, children: CreateDocumentBlockInput[], ratio?: number): CreateDocumentBlockInput => ({
  id,
  type: COLUMN_BLOCK_TYPE,
  ...(ratio !== undefined ? { attributes: { ratio } } : {}),
  children,
})

const content = (children: CreateDocumentBlockInput[]): SduiDocumentContent => ({
  schemaVersion: '1.0',
  root: createDocumentBlock({ id: 'root', type: 'document.root', children }),
})

const splitContent = () =>
  content([
    {
      id: 'cl',
      type: COLUMN_LIST_BLOCK_TYPE,
      children: [column('col-a', [paragraph('p-a')]), column('col-b', [paragraph('p-b')])],
    },
    paragraph('tail'),
  ])

describe('resizeColumnPair', () => {
  // EP/BVA on deltaFraction: 0 (identity), positive, negative,
  // clamp boundary (pushes a column below MIN_COLUMN_RATIO), non-finite (guard)
  describe('as is: an equal pair (1, 1) — total weight 2', () => {
    describe('when the gutter does not move (delta 0, identity boundary)', () => {
      it('to be: ratios unchanged', () => {
        expect(resizeColumnPair({ deltaFraction: 0 })).toEqual({ leftRatio: 1, rightRatio: 1 })
      })
    })

    describe('when dragged right by 10% of the pair width', () => {
      it('to be: weight moves left → right shrinks, total preserved', () => {
        expect(resizeColumnPair({ deltaFraction: 0.1 })).toEqual({ leftRatio: 1.2, rightRatio: 0.8 })
      })
    })

    describe('when dragged left by 10%', () => {
      it('to be: the mirror image', () => {
        expect(resizeColumnPair({ deltaFraction: -0.1 })).toEqual({ leftRatio: 0.8, rightRatio: 1.2 })
      })
    })

    describe('when dragged far right past the clamp (BVA: right column at MIN_COLUMN_RATIO)', () => {
      it('to be: right pinned at the minimum, left takes the rest', () => {
        const resized = resizeColumnPair({ deltaFraction: 5 })

        expect(resized.rightRatio).toBe(MIN_COLUMN_RATIO)
        expect(resized.leftRatio).toBeCloseTo(2 - MIN_COLUMN_RATIO)
      })
    })

    describe('when dragged far left (BVA: left column at MIN_COLUMN_RATIO)', () => {
      it('to be: left pinned at the minimum', () => {
        const resized = resizeColumnPair({ deltaFraction: -5 })

        expect(resized.leftRatio).toBe(MIN_COLUMN_RATIO)
        expect(resized.rightRatio).toBeCloseTo(2 - MIN_COLUMN_RATIO)
      })
    })

    describe('when the delta is not finite (EP: guard partition)', () => {
      it('to be: identity', () => {
        expect(resizeColumnPair({ deltaFraction: Number.NaN })).toEqual({ leftRatio: 1, rightRatio: 1 })
      })
    })
  })

  describe('as is: an already-weighted pair (2, 1) — total weight 3', () => {
    describe('when dragged right by 10% of the pair width', () => {
      it('to be: shift scales with the pair total (0.1 × 3 = 0.3)', () => {
        expect(resizeColumnPair({ leftRatio: 2, rightRatio: 1, deltaFraction: 0.1 })).toEqual({
          leftRatio: 2.3,
          rightRatio: 0.7,
        })
      })
    })
  })
})

describe('createColumnResizePatches', () => {
  describe('as is: a two-column split with default ratios', () => {
    describe('when the shared gutter is dragged right by 10%', () => {
      it('to be: one block.update per column, new ratios in attributes', () => {
        const patches = createColumnResizePatches({
          content: splitContent(),
          leftColumnId: 'col-a',
          rightColumnId: 'col-b',
          deltaFraction: 0.1,
        })

        expect(patches).toEqual([
          { type: 'block.update', blockId: 'col-a', attributes: { ratio: 1.2 } },
          { type: 'block.update', blockId: 'col-b', attributes: { ratio: 0.8 } },
        ])
      })
    })
  })

  describe('as is: invalid resize targets (negative partitions)', () => {
    describe('when one id is not a column', () => {
      it('to be: null', () => {
        expect(
          createColumnResizePatches({
            content: splitContent(),
            leftColumnId: 'col-a',
            rightColumnId: 'tail',
            deltaFraction: 0.1,
          }),
        ).toBeNull()
      })
    })

    describe('when the columns belong to different parents', () => {
      it('to be: null', () => {
        const twoSplits = content([
          {
            id: 'cl-1',
            type: COLUMN_LIST_BLOCK_TYPE,
            children: [column('col-a', [paragraph('p-a')]), column('col-b', [paragraph('p-b')])],
          },
          {
            id: 'cl-2',
            type: COLUMN_LIST_BLOCK_TYPE,
            children: [column('col-x', [paragraph('p-x')]), column('col-y', [paragraph('p-y')])],
          },
        ])

        expect(
          createColumnResizePatches({
            content: twoSplits,
            leftColumnId: 'col-a',
            rightColumnId: 'col-x',
            deltaFraction: 0.1,
          }),
        ).toBeNull()
      })
    })

    describe('when an id is unknown', () => {
      it('to be: null', () => {
        expect(
          createColumnResizePatches({
            content: splitContent(),
            leftColumnId: 'ghost',
            rightColumnId: 'col-b',
            deltaFraction: 0.1,
          }),
        ).toBeNull()
      })
    })
  })
})
