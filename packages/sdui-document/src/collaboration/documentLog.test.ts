import type { SduiDocumentContent } from '../blocks/schema'
import { createBlockId, createDocumentBlock, createDocumentId } from '../blocks/schema'
import { appendToLog, compactLog, createDocumentLog, entriesSince } from './documentLog'
import type { PatchEnvelope } from './envelope'
import { createSnapshot, replayFromSnapshot } from './snapshot'

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
    patches: [{ type: 'block.update', blockId: createBlockId('b1'), state: { text: 'edited' } }],
    ...overrides,
  }
}

describe('DocumentLog', () => {
  test('appendToLog stamps monotonically increasing seq without mutating the old log', () => {
    const log0 = createDocumentLog()
    const { log: log1, committed: first } = appendToLog(log0, makeEnvelope({ envelopeId: 'env-1' }))
    const { log: log2, committed: second } = appendToLog(log1, makeEnvelope({ envelopeId: 'env-2' }))

    expect(first.seq).toBe(1)
    expect(second.seq).toBe(2)
    expect(log0.entries).toHaveLength(0)
    expect(log2.entries.map((entry) => entry.envelopeId)).toEqual(['env-1', 'env-2'])
  })

  test('entriesSince returns only entries after the given seq', () => {
    const log0 = createDocumentLog()
    const { log: log1 } = appendToLog(log0, makeEnvelope({ envelopeId: 'env-1' }))
    const { log: log2 } = appendToLog(log1, makeEnvelope({ envelopeId: 'env-2' }))

    expect(entriesSince(log2, 1).map((entry) => entry.envelopeId)).toEqual(['env-2'])
    expect(entriesSince(log2, 2)).toEqual([])
  })

  test('compactLog drops entries at or below keepAfterSeq but preserves seq counter', () => {
    const log0 = createDocumentLog()
    const { log: log1 } = appendToLog(log0, makeEnvelope({ envelopeId: 'env-1' }))
    const { log: log2 } = appendToLog(log1, makeEnvelope({ envelopeId: 'env-2' }))

    const compacted = compactLog(log2, 1)

    expect(compacted.seq).toBe(2)
    expect(compacted.entries.map((entry) => entry.envelopeId)).toEqual(['env-2'])
  })
})

describe('snapshot replay', () => {
  test('replayFromSnapshot reproduces content and versions deterministically', () => {
    const content = makeContent()
    const log0 = createDocumentLog()
    const { log: log1, committed } = appendToLog(log0, makeEnvelope({ envelopeId: 'env-1' }))

    const snapshot = createSnapshot(0, content, {})
    const replayed = replayFromSnapshot(snapshot, entriesSince(log1, 0))

    expect(replayed.seq).toBe(committed.seq)
    expect(replayed.versions).toEqual({ b1: 1 })
    const b1 = replayed.content.root.children?.find((block) => block.id === 'b1')
    expect(b1?.state).toEqual({ text: 'edited' })
    // determinism: replaying again from the same snapshot gives the same result
    expect(replayFromSnapshot(snapshot, entriesSince(log1, 0))).toEqual(replayed)
  })
})
