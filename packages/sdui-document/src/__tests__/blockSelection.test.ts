import {
  clearBlockSelection,
  createBlockSelection,
  createDocumentBlock,
  extendBlockSelection,
  type SduiDocumentContent,
  toggleBlockSelection,
} from '../index'

/**
 * Fixture tree (flattened order):
 * root > a (a1, a2) > b > c
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

describe('block selection model', () => {
  describe('as is: no selection', () => {
    describe('when a block is selected (enter selection mode)', () => {
      it('to be: that block becomes the single selection and the anchor', () => {
        expect(createBlockSelection('b')).toEqual({ selectedIds: ['b'], anchorId: 'b' })
      })
    })
  })

  describe('as is: single selected block b', () => {
    const state = createBlockSelection('b')

    describe('when toggling another block c (EP: add partition)', () => {
      it('to be: both selected, anchor moves to c', () => {
        expect(toggleBlockSelection(state, 'c')).toEqual({ selectedIds: ['b', 'c'], anchorId: 'c' })
      })
    })

    describe('when toggling b itself (EP: remove partition)', () => {
      it('to be: empty selection', () => {
        expect(toggleBlockSelection(state, 'b')).toEqual({ selectedIds: [], anchorId: undefined })
      })
    })

    describe('when the selection is cleared', () => {
      it('to be: empty selection', () => {
        expect(clearBlockSelection()).toEqual({ selectedIds: [], anchorId: undefined })
      })
    })
  })

  describe('as is: anchor at a1, extending with shift-select', () => {
    const state = createBlockSelection('a1')

    describe('when extending forward to b (EP: forward range)', () => {
      it('to be: flattened range a1..b selected, anchor preserved', () => {
        expect(extendBlockSelection(state, createContent(), 'b')).toEqual({
          selectedIds: ['a1', 'a2', 'b'],
          anchorId: 'a1',
        })
      })
    })

    describe('when extending backward to a (EP: backward range + ancestor normalization)', () => {
      it('to be: only the ancestor a is kept (descendants a1 implied)', () => {
        expect(extendBlockSelection(state, createContent(), 'a')).toEqual({
          selectedIds: ['a'],
          anchorId: 'a1',
        })
      })
    })

    describe('when extending to the anchor itself (BVA: zero-length range)', () => {
      it('to be: only the anchor selected', () => {
        expect(extendBlockSelection(state, createContent(), 'a1')).toEqual({
          selectedIds: ['a1'],
          anchorId: 'a1',
        })
      })
    })

    describe('when extending to the last block c (BVA: range end = last flattened item)', () => {
      it('to be: a1..c selected with ancestor normalization applied', () => {
        expect(extendBlockSelection(state, createContent(), 'c')).toEqual({
          selectedIds: ['a1', 'a2', 'b', 'c'],
          anchorId: 'a1',
        })
      })
    })
  })

  describe('as is: selection without an anchor (EP: degenerate state)', () => {
    describe('when extending', () => {
      it('to be: behaves like creating a fresh selection at the target', () => {
        expect(extendBlockSelection(clearBlockSelection(), createContent(), 'b')).toEqual({
          selectedIds: ['b'],
          anchorId: 'b',
        })
      })
    })
  })

  describe('as is: range covering a whole subtree (EP: ancestor + descendants)', () => {
    describe('when extending from a to a2', () => {
      it('to be: descendants of a selected ancestor are dropped from the id list', () => {
        expect(extendBlockSelection(createBlockSelection('a'), createContent(), 'a2')).toEqual({
          selectedIds: ['a'],
          anchorId: 'a',
        })
      })
    })
  })
})
