import type { SduiDocumentContent } from '../blocks/schema'
import { createBlockId, createDocumentBlock, createDocumentId } from '../blocks/schema'
import type { CommittedPatchEnvelope, PatchEnvelope } from './envelope'
import { acknowledgeCommit, createClientSyncState, reconcileRemote, stageLocalEdit } from './outbox'

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
    envelopeId: 'env-local-1',
    documentId: createDocumentId('doc-1'),
    actorId: 'client-a',
    hlc: { millis: 1, counter: 0, actorId: 'client-a' },
    baseSeq: 0,
    patches: [{ type: 'block.update', blockId: createBlockId('b1'), state: { text: 'local-edit' } }],
    ...overrides,
  }
}

function findText(content: SduiDocumentContent, id: string): unknown {
  return content.root.children?.find((block) => block.id === id)?.state?.text
}

describe('stageLocalEdit / acknowledgeCommit', () => {
  test('applies optimistically and stores the inverse in pending', () => {
    const staged = stageLocalEdit({
      content: makeContent(),
      syncState: createClientSyncState(0),
      envelope: makeEnvelope({}),
    })

    expect(findText(staged.content, 'b1')).toBe('local-edit')
    expect(staged.syncState.pending).toHaveLength(1)
    expect(staged.syncState.pending[0].inverse).toHaveLength(1)
  })

  test('acknowledgeCommit removes the pending entry and advances confirmedSeq', () => {
    const staged = stageLocalEdit({
      content: makeContent(),
      syncState: createClientSyncState(0),
      envelope: makeEnvelope({}),
    })
    const committed: CommittedPatchEnvelope = { ...makeEnvelope({}), seq: 1 }

    const acked = acknowledgeCommit(staged.syncState, committed)

    expect(acked.pending).toHaveLength(0)
    expect(acked.confirmedSeq).toBe(1)
  })
})

describe('reconcileRemote', () => {
  test('interleaves a foreign remote edit under a pending local edit', () => {
    const staged = stageLocalEdit({
      content: makeContent(),
      syncState: createClientSyncState(0),
      envelope: makeEnvelope({}),
    })
    const remote: CommittedPatchEnvelope = {
      ...makeEnvelope({
        envelopeId: 'env-remote-1',
        actorId: 'client-b',
        patches: [{ type: 'block.update', blockId: createBlockId('b2'), state: { text: 'remote-edit' } }],
      }),
      seq: 1,
    }

    const result = reconcileRemote({ content: staged.content, syncState: staged.syncState, remoteEntries: [remote] })

    expect(findText(result.content, 'b2')).toBe('remote-edit') // remote landed
    expect(findText(result.content, 'b1')).toBe('local-edit') // local survived rebase
    expect(result.syncState.confirmedSeq).toBe(1)
    expect(result.syncState.pending).toHaveLength(1)
    expect(result.dropped).toHaveLength(0)
  })

  test('own committed envelope arriving via the log acks pending instead of double-applying', () => {
    const staged = stageLocalEdit({
      content: makeContent(),
      syncState: createClientSyncState(0),
      envelope: makeEnvelope({}),
    })
    const ownCommitted: CommittedPatchEnvelope = { ...makeEnvelope({}), seq: 1 }

    const result = reconcileRemote({
      content: staged.content,
      syncState: staged.syncState,
      remoteEntries: [ownCommitted],
    })

    expect(findText(result.content, 'b1')).toBe('local-edit')
    expect(result.syncState.pending).toHaveLength(0)
    expect(result.syncState.confirmedSeq).toBe(1)
  })

  test('drops a pending edit whose target block was deleted remotely and reports it', () => {
    const staged = stageLocalEdit({
      content: makeContent(),
      syncState: createClientSyncState(0),
      envelope: makeEnvelope({}),
    })
    const remoteDelete: CommittedPatchEnvelope = {
      ...makeEnvelope({
        envelopeId: 'env-remote-del',
        actorId: 'client-b',
        patches: [{ type: 'block.delete', blockId: createBlockId('b1') }],
      }),
      seq: 1,
    }

    const result = reconcileRemote({
      content: staged.content,
      syncState: staged.syncState,
      remoteEntries: [remoteDelete],
    })

    expect(result.content.root.children?.find((block) => block.id === 'b1')).toBeUndefined()
    expect(result.syncState.pending).toHaveLength(0)
    expect(result.dropped.map((envelope) => envelope.envelopeId)).toEqual(['env-local-1'])
  })
})
