import type { SduiDocumentContent } from '../blocks/schema'
import { createBlockId, createDocumentBlock, createDocumentId } from '../blocks/schema'
import type { PatchEnvelope } from './envelope'
import { commitEnvelope, createSequencerState } from './sequencer'

function makeContent(): SduiDocumentContent {
  return {
    schemaVersion: '1.1',
    root: createDocumentBlock({
      id: 'root',
      type: 'root',
      children: [
        { id: 'b1', type: 'paragraph', position: 'a0', state: { text: 'hello' } },
        { id: 'b2', type: 'paragraph', position: 'a1', state: { text: 'world' } },
      ],
    }),
  }
}

function makeEnvelope(overrides: Partial<PatchEnvelope>): PatchEnvelope {
  return {
    envelopeId: 'env-1',
    documentId: createDocumentId('doc-1'),
    actorId: 'client-a',
    hlc: { millis: 1, counter: 0, actorId: 'client-a' },
    baseSeq: 0,
    patches: [{ type: 'block.update', blockId: createBlockId('b1'), state: { text: 'from-a' } }],
    ...overrides,
  }
}

describe('commitEnvelope', () => {
  test('commits a clean envelope: applies patches, bumps versions, appends log', () => {
    const state0 = createSequencerState(makeContent())

    const result = commitEnvelope(state0, makeEnvelope({}))

    expect(result.status).toBe('committed')
    if (result.status !== 'committed') return
    expect(result.committed.seq).toBe(1)
    expect(result.state.versions).toEqual({ b1: 1 })
    const b1 = result.state.content.root.children?.find((block) => block.id === 'b1')
    expect(b1?.state).toEqual({ text: 'from-a' })
  })

  test('stale baseSeq on DIFFERENT blocks still commits (block-granular policy)', () => {
    const state0 = createSequencerState(makeContent())
    const first = commitEnvelope(state0, makeEnvelope({ envelopeId: 'env-1' }))
    if (first.status !== 'committed') throw new Error('setup failed')

    const second = commitEnvelope(
      first.state,
      makeEnvelope({
        envelopeId: 'env-2',
        actorId: 'client-b',
        baseSeq: 0, // stale: produced before env-1 landed
        patches: [{ type: 'block.update', blockId: createBlockId('b2'), state: { text: 'from-b' } }],
      }),
    )

    expect(second.status).toBe('committed')
    if (second.status !== 'committed') return
    expect(second.committed.seq).toBe(2)
  })

  test('rejects when expectedVersion conflicts on the same block', () => {
    const state0 = createSequencerState(makeContent())
    const first = commitEnvelope(state0, makeEnvelope({ envelopeId: 'env-1' }))
    if (first.status !== 'committed') throw new Error('setup failed')

    const second = commitEnvelope(
      first.state,
      makeEnvelope({
        envelopeId: 'env-2',
        actorId: 'client-b',
        baseSeq: 0,
        patches: [
          { type: 'block.update', blockId: createBlockId('b1'), state: { text: 'from-b' }, expectedVersion: 0 },
        ],
      }),
    )

    expect(second.status).toBe('rejected')
    if (second.status !== 'rejected') return
    expect(second.reason).toBe('blockConflict')
    if (second.reason !== 'blockConflict') return
    expect(second.conflicts).toEqual([{ blockId: 'b1', expectedVersion: 0, currentVersion: 1 }])
    expect(second.currentSeq).toBe(1)
    // rejection leaves state untouched
    expect(second.state).toBe(first.state)
  })

  test('rejects with applyFailed when the target block was deleted concurrently', () => {
    const state0 = createSequencerState(makeContent())
    const deleted = commitEnvelope(
      state0,
      makeEnvelope({ envelopeId: 'env-1', patches: [{ type: 'block.delete', blockId: createBlockId('b1') }] }),
    )
    if (deleted.status !== 'committed') throw new Error('setup failed')

    const second = commitEnvelope(deleted.state, makeEnvelope({ envelopeId: 'env-2', baseSeq: 0 }))

    expect(second.status).toBe('rejected')
    if (second.status !== 'rejected') return
    expect(second.reason).toBe('applyFailed')
  })

  test('re-sending an already committed envelopeId is idempotent', () => {
    const state0 = createSequencerState(makeContent())
    const first = commitEnvelope(state0, makeEnvelope({ envelopeId: 'env-1' }))
    if (first.status !== 'committed') throw new Error('setup failed')

    const retry = commitEnvelope(first.state, makeEnvelope({ envelopeId: 'env-1' }))

    expect(retry.status).toBe('duplicate')
    if (retry.status !== 'duplicate') return
    expect(retry.committed.seq).toBe(1)
    expect(retry.state).toBe(first.state)
  })
})
