import { applyDocumentPatches, applyDocumentPatchesWithInverse } from '../blocks/patch/blockPatch'
import type { SduiDocumentContent, SduiDocumentPatch } from '../blocks/schema'
import type { CommittedPatchEnvelope, PatchEnvelope } from './envelope'

/**
 * Client-side optimistic outbox (R3 client half).
 *
 * Policies:
 * - every optimistic apply stores its inverse; rebase = rollback pending in
 *   reverse -> apply remote in seq order -> re-apply pending on the new base
 * - a pending envelope that no longer applies (its block was deleted
 *   remotely) is DROPPED and reported — callers must surface `dropped` to the
 *   user, never swallow it
 * - own envelopes echoed back through the log act as acks; the server's
 *   committed form is authoritative, so they are applied from the log and
 *   removed from pending
 */
export type PendingEnvelope = {
  envelope: PatchEnvelope
  inverse: SduiDocumentPatch[]
}

export type ClientSyncState = {
  confirmedSeq: number
  pending: readonly PendingEnvelope[]
}

export function createClientSyncState(confirmedSeq: number): ClientSyncState {
  return { confirmedSeq, pending: [] }
}

export type StageLocalEditInput = {
  content: SduiDocumentContent
  syncState: ClientSyncState
  envelope: PatchEnvelope
}

export type StageLocalEditResult = {
  content: SduiDocumentContent
  syncState: ClientSyncState
}

export function stageLocalEdit(input: StageLocalEditInput): StageLocalEditResult {
  const { content, inverse } = applyDocumentPatchesWithInverse(input.content, input.envelope.patches)

  return {
    content,
    syncState: {
      confirmedSeq: input.syncState.confirmedSeq,
      pending: [...input.syncState.pending, { envelope: input.envelope, inverse }],
    },
  }
}

export function acknowledgeCommit(syncState: ClientSyncState, committed: CommittedPatchEnvelope): ClientSyncState {
  return {
    confirmedSeq: Math.max(syncState.confirmedSeq, committed.seq),
    pending: syncState.pending.filter((entry) => entry.envelope.envelopeId !== committed.envelopeId),
  }
}

export type ReconcileRemoteInput = {
  content: SduiDocumentContent
  syncState: ClientSyncState
  remoteEntries: readonly CommittedPatchEnvelope[]
}

export type ReconcileRemoteResult = {
  content: SduiDocumentContent
  syncState: ClientSyncState
  dropped: PatchEnvelope[]
}

export function reconcileRemote(input: ReconcileRemoteInput): ReconcileRemoteResult {
  const { syncState, remoteEntries } = input
  if (remoteEntries.length === 0) {
    return { content: input.content, syncState, dropped: [] }
  }

  // 1. roll back optimistic edits (reverse order)
  const rolledBack = [...syncState.pending]
    .reverse()
    .reduce((content, entry) => applyDocumentPatches(content, entry.inverse), input.content)

  // 2. own entries in the log are acks; the rest stays pending for re-apply
  const remoteIds = new Set(remoteEntries.map((entry) => entry.envelopeId))
  const stillPending = syncState.pending.filter((entry) => !remoteIds.has(entry.envelope.envelopeId))

  // 3. apply remote entries in seq order (server form is authoritative)
  const ordered = [...remoteEntries].sort((a, b) => a.seq - b.seq)
  const remoteApplied = ordered.reduce((content, entry) => applyDocumentPatches(content, entry.patches), rolledBack)

  // 4. re-apply surviving local edits, recomputing inverses on the new base
  const reapplied = stillPending.reduce<{
    content: SduiDocumentContent
    pending: PendingEnvelope[]
    dropped: PatchEnvelope[]
  }>(
    (accumulator, entry) => {
      try {
        const { content, inverse } = applyDocumentPatchesWithInverse(accumulator.content, entry.envelope.patches)

        return {
          content,
          pending: [...accumulator.pending, { envelope: entry.envelope, inverse }],
          dropped: accumulator.dropped,
        }
      } catch {
        return { ...accumulator, dropped: [...accumulator.dropped, entry.envelope] }
      }
    },
    { content: remoteApplied, pending: [], dropped: [] },
  )

  return {
    content: reapplied.content,
    syncState: {
      confirmedSeq: Math.max(syncState.confirmedSeq, ordered[ordered.length - 1].seq),
      pending: reapplied.pending,
    },
    dropped: reapplied.dropped,
  }
}
