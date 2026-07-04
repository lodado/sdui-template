import { type BlockPresence,getBlockEditors, prunePresence, upsertPresence } from '../index'

const T0 = '2026-07-04T12:00:00.000Z'
const T0_PLUS_30S = '2026-07-04T12:00:30.000Z'

function presence(overrides?: Partial<BlockPresence>): BlockPresence {
  return {
    userId: 'user-1',
    documentId: 'doc-1',
    blockId: 'para-1',
    status: 'editing',
    lastActiveAt: T0,
    ...overrides,
  }
}

describe('upsertPresence', () => {
  describe('as is: empty presence list (BVA: min size)', () => {
    describe('when a presence is upserted', () => {
      it('to be: single entry list', () => {
        expect(upsertPresence([], presence())).toEqual([presence()])
      })
    })
  })

  describe('as is: existing presence for the same user+document (EP: replace partition)', () => {
    describe('when the user moves to another block', () => {
      it('to be: entry replaced, not duplicated, input untouched', () => {
        const existing = [presence()]
        const moved = presence({ blockId: 'para-2', lastActiveAt: T0_PLUS_30S })

        expect(upsertPresence(existing, moved)).toEqual([moved])
        expect(existing[0].blockId).toBe('para-1')
      })
    })
  })

  describe('as is: presence of a different user (EP: append partition)', () => {
    describe('when upserted', () => {
      it('to be: both entries kept', () => {
        const other = presence({ userId: 'user-2', blockId: 'para-2' })

        expect(upsertPresence([presence()], other)).toEqual([presence(), other])
      })
    })
  })
})

describe('prunePresence', () => {
  const TTL_MS = 30_000

  describe('as is: entry aged exactly ttl (BVA: boundary inclusive)', () => {
    describe('when pruned at now = lastActiveAt + ttl', () => {
      it('to be: entry kept', () => {
        expect(prunePresence([presence()], T0_PLUS_30S, TTL_MS)).toHaveLength(1)
      })
    })
  })

  describe('as is: entry aged ttl + 1ms (BVA: boundary + 1)', () => {
    describe('when pruned', () => {
      it('to be: entry dropped', () => {
        const justExpired = '2026-07-04T12:00:30.001Z'

        expect(prunePresence([presence()], justExpired, TTL_MS)).toEqual([])
      })
    })
  })

  describe('as is: mixed fresh and stale entries (EP: partition split)', () => {
    describe('when pruned', () => {
      it('to be: only fresh entries survive', () => {
        const stale = presence({ userId: 'user-2', lastActiveAt: '2026-07-04T11:00:00.000Z' })

        expect(prunePresence([presence(), stale], T0_PLUS_30S, TTL_MS)).toEqual([presence()])
      })
    })
  })
})

describe('getBlockEditors', () => {
  describe('as is: mixed statuses on a block (EP: editing vs viewing)', () => {
    describe('when editors of para-1 are queried', () => {
      it('to be: only editing presences on that block', () => {
        const list: BlockPresence[] = [
          presence(),
          presence({ userId: 'user-2', status: 'viewing' }),
          presence({ userId: 'user-3', blockId: 'para-2' }),
        ]

        expect(getBlockEditors(list, 'para-1')).toEqual([presence()])
      })
    })
  })

  describe('as is: presence without a blockId (EP: document-level presence)', () => {
    describe('when any block is queried', () => {
      it('to be: excluded', () => {
        expect(getBlockEditors([presence({ blockId: undefined })], 'para-1')).toEqual([])
      })
    })
  })
})
