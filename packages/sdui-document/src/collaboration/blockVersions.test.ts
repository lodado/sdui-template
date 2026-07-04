import {
  type BlockVersionMap,
  bumpBlockVersions,
  createBlockId,
  createDocumentBlock,
  detectVersionConflicts,
  type SduiDocumentPatch,
} from '../index'

const blockId = createBlockId

describe('detectVersionConflicts', () => {
  const versions: BlockVersionMap = { 'para-1': 3, 'para-2': 1 }

  describe('as is: patch carrying a matching expectedVersion (EP: happy partition)', () => {
    describe('when validated', () => {
      it('to be: no conflicts', () => {
        const patches: SduiDocumentPatch[] = [
          { type: 'block.update', blockId: blockId('para-1'), state: { text: 'x' }, expectedVersion: 3 },
        ]

        expect(detectVersionConflicts({ versions, patches })).toEqual([])
      })
    })
  })

  describe('as is: patch with a stale expectedVersion (EP: conflict partition)', () => {
    describe('when the stored version moved ahead (BVA: expected = current - 1)', () => {
      it('to be: one conflict with both versions reported', () => {
        const patches: SduiDocumentPatch[] = [
          { type: 'block.update', blockId: blockId('para-1'), state: { text: 'x' }, expectedVersion: 2 },
        ]

        expect(detectVersionConflicts({ versions, patches })).toEqual([
          { blockId: 'para-1', expectedVersion: 2, currentVersion: 3 },
        ])
      })
    })
  })

  describe('as is: patch without expectedVersion (EP: opt-out partition)', () => {
    describe('when validated', () => {
      it('to be: skipped — no conflict even if versions differ', () => {
        const patches: SduiDocumentPatch[] = [
          { type: 'block.update', blockId: blockId('para-1'), state: { text: 'x' } },
        ]

        expect(detectVersionConflicts({ versions, patches })).toEqual([])
      })
    })
  })

  describe('as is: patch targeting a block unknown to the version map (BVA: implicit version 0)', () => {
    describe('when expectedVersion is 0', () => {
      it('to be: no conflict', () => {
        const patches: SduiDocumentPatch[] = [
          { type: 'block.update', blockId: blockId('brand-new'), state: { text: 'x' }, expectedVersion: 0 },
        ]

        expect(detectVersionConflicts({ versions, patches })).toEqual([])
      })
    })

    describe('when expectedVersion is 1 (BVA: 0 + 1)', () => {
      it('to be: conflict against implicit current version 0', () => {
        const patches: SduiDocumentPatch[] = [
          { type: 'block.update', blockId: blockId('brand-new'), state: { text: 'x' }, expectedVersion: 1 },
        ]

        expect(detectVersionConflicts({ versions, patches })).toEqual([
          { blockId: 'brand-new', expectedVersion: 1, currentVersion: 0 },
        ])
      })
    })
  })

  describe('as is: every block-targeting patch type (EP: target extraction coverage)', () => {
    describe('when each patch type carries a stale expectedVersion', () => {
      it('to be: delete/move/split/merge report conflicts on their target block', () => {
        const patches: SduiDocumentPatch[] = [
          { type: 'block.delete', blockId: blockId('para-1'), expectedVersion: 99 },
          {
            type: 'block.move',
            blockId: blockId('para-1'),
            parentId: blockId('root'),
            after: null,
            expectedVersion: 99,
          },
          {
            type: 'block.split',
            blockId: blockId('para-1'),
            offset: 0,
            newBlockId: blockId('n1'),
            expectedVersion: 99,
          },
          { type: 'block.merge', blockId: blockId('para-2'), intoBlockId: blockId('para-1'), expectedVersion: 99 },
        ]

        expect(detectVersionConflicts({ versions, patches })).toHaveLength(4)
      })
    })

    describe('when document.setTitle carries expectedVersion (EP: document-level partition)', () => {
      it('to be: ignored — no block target', () => {
        const patches: SduiDocumentPatch[] = [{ type: 'document.setTitle', title: 'x', expectedVersion: 99 }]

        expect(detectVersionConflicts({ versions, patches })).toEqual([])
      })
    })
  })
})

describe('bumpBlockVersions', () => {
  const versions: BlockVersionMap = { 'para-1': 3, 'para-2': 1 }

  describe('as is: block.update applied', () => {
    describe('when versions are bumped', () => {
      it('to be: target version incremented, others untouched, input not mutated', () => {
        const next = bumpBlockVersions(versions, [
          { type: 'block.update', blockId: blockId('para-1'), state: { text: 'x' } },
        ])

        expect(next).toEqual({ 'para-1': 4, 'para-2': 1 })
        expect(versions['para-1']).toBe(3)
      })
    })
  })

  describe('as is: block.insert applied (BVA: first version of a new block)', () => {
    describe('when versions are bumped', () => {
      it('to be: new block starts at version 1', () => {
        const next = bumpBlockVersions(versions, [
          {
            type: 'block.insert',
            parentId: blockId('root'),
            after: null,
            block: createDocumentBlock({ id: 'new-1', type: 'document.paragraph' }),
          },
        ])

        expect(next['new-1']).toBe(1)
      })
    })
  })

  describe('as is: block.delete applied', () => {
    describe('when versions are bumped', () => {
      it('to be: entry removed from the map', () => {
        const next = bumpBlockVersions(versions, [{ type: 'block.delete', blockId: blockId('para-2') }])

        expect(next).toEqual({ 'para-1': 3 })
      })
    })
  })

  describe('as is: block.split applied', () => {
    describe('when versions are bumped', () => {
      it('to be: original bumped and new block starts at 1', () => {
        const next = bumpBlockVersions(versions, [
          { type: 'block.split', blockId: blockId('para-1'), offset: 0, newBlockId: blockId('para-1b') },
        ])

        expect(next).toEqual({ 'para-1': 4, 'para-1b': 1, 'para-2': 1 })
      })
    })
  })

  describe('as is: block.merge applied', () => {
    describe('when versions are bumped', () => {
      it('to be: merge target bumped, merged block entry removed', () => {
        const next = bumpBlockVersions(versions, [
          { type: 'block.merge', blockId: blockId('para-2'), intoBlockId: blockId('para-1') },
        ])

        expect(next).toEqual({ 'para-1': 4 })
      })
    })
  })
})
