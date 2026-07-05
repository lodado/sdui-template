import { COLUMN_BLOCK_TYPE } from '../../block-types/column/column.type'
import { COLUMN_LIST_BLOCK_TYPE } from '../../block-types/column-list/columnList.type'
import { applyDocumentPatches } from '../code'
import { normalizeColumnStructure } from '../code/columnStructure'
import { createHorizontalBlockDropPatches } from '../drag/columnDropPatches'
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

describe('createHorizontalBlockDropPatches', () => {
  describe('as is: two top-level sibling paragraphs (no split yet)', () => {
    const base = () => content([paragraph('block-a'), paragraph('block-b'), paragraph('block-c')])

    describe('when block-a is dropped on the RIGHT edge of block-b', () => {
      it('to be: a columnList in block-b slot with columns [block-b, block-a]', () => {
        const input = base()
        const patches = createHorizontalBlockDropPatches({
          content: input,
          activeId: 'block-a',
          overId: 'block-b',
          side: 'right',
        })

        expect(patches).not.toBeNull()
        const next = applyDocumentPatches(input, patches!)

        const list = findById(next.root, 'block-b-cols')
        expect(list.type).toBe(COLUMN_LIST_BLOCK_TYPE)
        // list takes block-b's former slot
        expect(childIds(next.root)).toEqual(['block-b-cols', 'block-c'])
        // side=right → over keeps left column, active lands right
        const [left, right] = list.children
        expect(left.type).toBe(COLUMN_BLOCK_TYPE)
        expect(childIds(left)).toEqual(['block-b'])
        expect(childIds(right)).toEqual(['block-a'])
      })
    })

    describe('when block-a is dropped on the LEFT edge of block-b', () => {
      it('to be: active lands in the left column, over in the right', () => {
        const input = base()
        const patches = createHorizontalBlockDropPatches({
          content: input,
          activeId: 'block-a',
          overId: 'block-b',
          side: 'left',
        })

        const next = applyDocumentPatches(input, patches!)
        const list = findById(next.root, 'block-b-cols')
        const [left, right] = list.children

        expect(childIds(left)).toEqual(['block-a'])
        expect(childIds(right)).toEqual(['block-b'])
      })
    })
  })

  describe('as is: an existing two-column split', () => {
    const base = () =>
      content([
        columnList('cl', [column('col-a', [paragraph('p-a')]), column('col-b', [paragraph('p-b')])]),
        paragraph('block-x'),
      ])

    describe('when block-x is dropped on the RIGHT edge of p-b (inside the split)', () => {
      it('to be: a third column appended after col-b, holding block-x', () => {
        const input = base()
        const patches = createHorizontalBlockDropPatches({
          content: input,
          activeId: 'block-x',
          overId: 'p-b',
          side: 'right',
        })

        const next = applyDocumentPatches(input, patches!)
        const list = findById(next.root, 'cl')

        expect(childIds(list)).toEqual(['col-a', 'col-b', 'block-x-col'])
        expect(childIds(findById(next.root, 'block-x-col'))).toEqual(['block-x'])
      })
    })

    describe('when block-x is dropped on the LEFT edge of p-a (first-index boundary)', () => {
      it('to be: a new first column before col-a', () => {
        const input = base()
        const patches = createHorizontalBlockDropPatches({
          content: input,
          activeId: 'block-x',
          overId: 'p-a',
          side: 'left',
        })

        const next = applyDocumentPatches(input, patches!)
        const list = findById(next.root, 'cl')

        expect(childIds(list)).toEqual(['block-x-col', 'col-a', 'col-b'])
      })
    })

    describe('when p-a is dropped beside p-b, emptying its own column', () => {
      it('to be: normalize dissolves the leftover empty column', () => {
        const input = base()
        const patches = createHorizontalBlockDropPatches({
          content: input,
          activeId: 'p-a',
          overId: 'p-b',
          side: 'right',
        })

        const next = normalizeColumnStructure(applyDocumentPatches(input, patches!))
        const list = findById(next.root, 'cl')

        // col-a emptied and dropped; col-b and the fresh p-a column remain
        expect(childIds(list)).toEqual(['col-b', 'p-a-col'])
      })
    })
  })

  describe('as is: invalid drop targets (negative partitions)', () => {
    describe('when active and over are the same block', () => {
      it('to be: null', () => {
        const input = content([paragraph('block-a')])

        expect(
          createHorizontalBlockDropPatches({ content: input, activeId: 'block-a', overId: 'block-a', side: 'left' }),
        ).toBeNull()
      })
    })

    describe('when over is the root block', () => {
      it('to be: null', () => {
        const input = content([paragraph('block-a')])

        expect(
          createHorizontalBlockDropPatches({ content: input, activeId: 'block-a', overId: 'root', side: 'left' }),
        ).toBeNull()
      })
    })

    describe('when over sits inside the dragged subtree', () => {
      it('to be: null (cannot drop a block beside its own descendant)', () => {
        const input = content([
          { id: 'callout-a', type: 'document.callout', children: [paragraph('p-nested')] },
          paragraph('block-b'),
        ])

        expect(
          createHorizontalBlockDropPatches({
            content: input,
            activeId: 'callout-a',
            overId: 'p-nested',
            side: 'right',
          }),
        ).toBeNull()
      })
    })

    describe('when active or over is itself a column container', () => {
      it('to be: null for both container types', () => {
        const input = content([
          columnList('cl', [column('col-a', [paragraph('p-a')]), column('col-b', [paragraph('p-b')])]),
          paragraph('block-x'),
        ])

        expect(
          createHorizontalBlockDropPatches({ content: input, activeId: 'cl', overId: 'block-x', side: 'left' }),
        ).toBeNull()
        expect(
          createHorizontalBlockDropPatches({ content: input, activeId: 'block-x', overId: 'col-a', side: 'left' }),
        ).toBeNull()
      })
    })

    describe('when an id is unknown', () => {
      it('to be: null', () => {
        const input = content([paragraph('block-a')])

        expect(
          createHorizontalBlockDropPatches({ content: input, activeId: 'ghost', overId: 'block-a', side: 'left' }),
        ).toBeNull()
      })
    })
  })

  describe('as is: derived ids already taken by earlier splits', () => {
    describe('when the deterministic id would collide', () => {
      it('to be: suffixed with a counter instead of throwing', () => {
        const input = content([
          columnList('cl', [column('block-x-col', [paragraph('p-a')]), column('col-b', [paragraph('p-b')])]),
          paragraph('block-x'),
        ])

        const patches = createHorizontalBlockDropPatches({
          content: input,
          activeId: 'block-x',
          overId: 'p-b',
          side: 'right',
        })

        expect(patches).not.toBeNull()
        const next = applyDocumentPatches(input, patches!)
        const list = findById(next.root, 'cl')

        expect(childIds(list)).toEqual(['block-x-col', 'col-b', 'block-x-col-2'])
      })
    })
  })
})
