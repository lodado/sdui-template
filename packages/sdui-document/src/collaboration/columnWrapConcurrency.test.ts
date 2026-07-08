import { COLUMN_BLOCK_TYPE } from '../block-types/column/column.type'
import { COLUMN_LIST_BLOCK_TYPE } from '../block-types/column-list/columnList.type'
import { createHorizontalBlockDropPatches } from '../blocks/drag/columnDropPatches'
import { normalizeColumnStructure } from '../blocks/patch/columnStructure'
import type { SduiDocumentContent, SduiDocumentPatch } from '../blocks/schema'
import { createBlockId, createDocumentBlock, createDocumentId } from '../blocks/schema'
import type { PatchEnvelope } from './envelope'
import { commitEnvelope, createSequencerState, type SequencerState } from './sequencer'

function makeContent(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({ id: 'block-a', type: 'document.paragraph', state: { text: 'A' } }),
        createDocumentBlock({ id: 'block-b', type: 'document.paragraph', state: { text: 'B' } }),
        createDocumentBlock({ id: 'tail', type: 'document.paragraph', state: { text: 'tail' } }),
      ],
    }),
  }
}

function makeEnvelope(envelopeId: string, actorId: string, patches: SduiDocumentPatch[], baseSeq = 0): PatchEnvelope {
  return {
    envelopeId,
    documentId: createDocumentId('doc-1'),
    actorId,
    hlc: { millis: 1, counter: 0, actorId },
    baseSeq,
    patches,
  }
}

const childIds = (block: { children?: { id: string }[] }) => (block.children ?? []).map((child) => child.id)

const findById = (block: any, id: string): any => {
  if (block.id === id) return block
  return (block.children ?? []).map((child: any) => findById(child, id)).find(Boolean)
}

function wrapPatches(content: SduiDocumentContent, activeId: string, overId: string, side: 'left' | 'right') {
  const patches = createHorizontalBlockDropPatches({ content, activeId, overId, side })
  if (!patches) throw new Error('expected wrap patches')
  return patches
}

describe('sequencer under concurrent column wraps', () => {
  describe('as is: two clients wrap the SAME over block from the same stale view (seq 0)', () => {
    const runBothCommits = (): { state: SequencerState; second: ReturnType<typeof commitEnvelope> } => {
      const base = makeContent()
      const state0 = createSequencerState(base)

      // both wraps derive the same deterministic container ids from overId=block-b
      const clientA = wrapPatches(base, 'block-a', 'block-b', 'right')
      const clientB = wrapPatches(base, 'tail', 'block-b', 'left')

      const first = commitEnvelope(state0, makeEnvelope('env-a', 'client-a', clientA))
      if (first.status !== 'committed') throw new Error('first commit must land')
      const second = commitEnvelope(first.state, makeEnvelope('env-b', 'client-b', clientB))

      return { state: first.state, second }
    }

    describe('when the second envelope arrives after the first committed', () => {
      it('to be: rejected as applyFailed (duplicate container ids), state untouched — no corrupt half-merge', () => {
        const { state, second } = runBothCommits()

        expect(second.status).toBe('rejected')
        if (second.status !== 'rejected') return
        expect(second.reason).toBe('applyFailed')
        // the first client's split is intact
        const list = findById(state.content.root, 'block-b-cols')
        expect(childIds(list)).toEqual(['block-b-col', 'block-a-col'])
      })
    })

    describe('when the rejected client rebases onto the committed state and retries', () => {
      it('to be: committed as an add-column drop — a valid three-column split, normalize is a no-op', () => {
        const { state, second } = runBothCommits()
        expect(second.status).toBe('rejected')

        // rebase: recompute the same intent against the NEW content — over is
        // now inside a column, so the add-column path fires instead of a wrap
        const rebased = wrapPatches(state.content, 'tail', 'block-b', 'left')
        const retry = commitEnvelope(state, makeEnvelope('env-b2', 'client-b', rebased, state.log.seq))

        expect(retry.status).toBe('committed')
        if (retry.status !== 'committed') return
        const list = findById(retry.state.content.root, 'block-b-cols')
        expect(childIds(list)).toEqual(['tail-col', 'block-b-col', 'block-a-col'])
        // structure already satisfies the invariants
        expect(normalizeColumnStructure(retry.state.content)).toBe(retry.state.content)
      })
    })
  })

  describe('as is: one client wraps while the other concurrently moves the over block away', () => {
    describe('when the stale vertical move lands AFTER the wrap (block-granular policy lets it through)', () => {
      it('to be: an empty column remains — and normalizeColumnStructure repairs it to a flat document', () => {
        const base = makeContent()
        const state0 = createSequencerState(base)

        const wrap = wrapPatches(base, 'block-a', 'block-b', 'right')
        // client B, from the same stale view, moves block-b below tail
        const staleMove: SduiDocumentPatch[] = [
          {
            type: 'block.move',
            blockId: createBlockId('block-b'),
            parentId: createBlockId('root'),
            after: createBlockId('tail'),
          },
        ]

        const first = commitEnvelope(state0, makeEnvelope('env-a', 'client-a', wrap))
        if (first.status !== 'committed') throw new Error('wrap must land')
        const second = commitEnvelope(first.state, makeEnvelope('env-b', 'client-b', staleMove))

        expect(second.status).toBe('committed')
        if (second.status !== 'committed') return

        // block-b left its column → the split degraded to one occupied column
        const beforeRepair = findById(second.state.content.root, 'block-b-col')
        expect(childIds(beforeRepair)).toEqual([])

        const repaired = normalizeColumnStructure(second.state.content)
        expect(childIds(repaired.root)).toEqual(['block-a', 'tail', 'block-b'])
        expect(findById(repaired.root, 'block-b-cols')).toBeUndefined()
        expect(
          [COLUMN_BLOCK_TYPE, COLUMN_LIST_BLOCK_TYPE].some((type) => JSON.stringify(repaired.root).includes(type)),
        ).toBe(false)
      })
    })
  })
})
