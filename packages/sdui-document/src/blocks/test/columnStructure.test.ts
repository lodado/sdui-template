import { COLUMN_BLOCK_TYPE } from '../../block-types/column/column.type'
import { COLUMN_LIST_BLOCK_TYPE } from '../../block-types/column-list/columnList.type'
import { normalizeColumnStructure } from '../patch/columnStructure'
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

describe('normalizeColumnStructure', () => {
  // EP/BVA on column count per columnList: 0 (invalid), 1 (min-1, dissolve), 2 (min valid)
  describe('as is: a columnList with two columns (minimum valid split)', () => {
    const valid = content([
      columnList('cl', [column('col-a', [paragraph('p-a')]), column('col-b', [paragraph('p-b')])]),
    ])

    describe('when normalized', () => {
      it('to be: returned unchanged (same reference — no structural repair needed)', () => {
        expect(normalizeColumnStructure(valid)).toBe(valid)
      })
    })
  })

  describe('as is: a columnList degraded to a single column (min-1 boundary)', () => {
    describe('when normalized', () => {
      it('to be: dissolved — the column children take the columnList slot in order', () => {
        const input = content([
          paragraph('p-0'),
          columnList('cl', [column('col-a', [paragraph('p-a'), paragraph('p-b')])]),
          paragraph('p-9'),
        ])

        const next = normalizeColumnStructure(input)

        expect(childIds(next.root)).toEqual(['p-0', 'p-a', 'p-b', 'p-9'])
      })
    })
  })

  describe('as is: a columnList with zero columns (empty boundary)', () => {
    describe('when normalized', () => {
      it('to be: removed entirely', () => {
        const input = content([paragraph('p-0'), columnList('cl', []), paragraph('p-9')])

        const next = normalizeColumnStructure(input)

        expect(childIds(next.root)).toEqual(['p-0', 'p-9'])
      })
    })
  })

  describe('as is: an empty column among three columns', () => {
    describe('when normalized', () => {
      it('to be: the empty column dropped, the split kept (2 columns remain)', () => {
        const input = content([
          columnList('cl', [
            column('col-a', [paragraph('p-a')]),
            column('col-empty', []),
            column('col-b', [paragraph('p-b')]),
          ]),
        ])

        const next = normalizeColumnStructure(input)
        const list = findById(next.root, 'cl')

        expect(childIds(list)).toEqual(['col-a', 'col-b'])
      })
    })
  })

  describe('as is: two columns where one is empty (cascade boundary)', () => {
    describe('when normalized', () => {
      it('to be: empty column removed AND the now-single-column list dissolved', () => {
        const input = content([columnList('cl', [column('col-a', [paragraph('p-a')]), column('col-empty', [])])])

        const next = normalizeColumnStructure(input)

        expect(childIds(next.root)).toEqual(['p-a'])
      })
    })
  })

  describe('as is: a stray non-column block directly inside a columnList', () => {
    describe('when normalized', () => {
      it('to be: wrapped into a fresh column with a deterministic derived id', () => {
        const input = content([columnList('cl', [column('col-a', [paragraph('p-a')]), paragraph('p-stray')])])

        const next = normalizeColumnStructure(input)
        const list = findById(next.root, 'cl')

        expect(childIds(list)).toEqual(['col-a', 'p-stray-col'])
        expect(findById(next.root, 'p-stray-col').type).toBe(COLUMN_BLOCK_TYPE)
        expect(childIds(findById(next.root, 'p-stray-col'))).toEqual(['p-stray'])
      })
    })
  })

  describe('as is: a column living outside any columnList', () => {
    describe('when normalized', () => {
      it('to be: dissolved — its children promoted in place', () => {
        const input = content([paragraph('p-0'), column('col-orphan', [paragraph('p-a')])])

        const next = normalizeColumnStructure(input)

        expect(childIds(next.root)).toEqual(['p-0', 'p-a'])
      })
    })
  })

  describe('as is: a columnList nested below a column (nesting forbidden)', () => {
    describe('when normalized', () => {
      it('to be: the inner columnList flattened vertically inside the outer column', () => {
        const input = content([
          columnList('cl-outer', [
            column('col-a', [
              paragraph('p-a'),
              columnList('cl-inner', [column('col-x', [paragraph('p-x')]), column('col-y', [paragraph('p-y')])]),
            ]),
            column('col-b', [paragraph('p-b')]),
          ]),
        ])

        const next = normalizeColumnStructure(input)
        const outerColumn = findById(next.root, 'col-a')

        expect(childIds(outerColumn)).toEqual(['p-a', 'p-x', 'p-y'])
        expect(findById(next.root, 'cl-inner')).toBeUndefined()
      })
    })
  })

  describe('as is: an already-normalized document', () => {
    describe('when normalized twice', () => {
      it('to be: idempotent (second pass returns the first pass result unchanged)', () => {
        const input = content([columnList('cl', [column('col-a', [paragraph('p-a')]), column('col-empty', [])])])

        const once = normalizeColumnStructure(input)
        const twice = normalizeColumnStructure(once)

        expect(twice).toBe(once)
      })
    })
  })
})
