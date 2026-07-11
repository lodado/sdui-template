import type { AnchorDegradeReport } from '../blocks/patch/blockPatch'
import { applyDocumentPatch, applyDocumentPatches, applyDocumentPatchesWithInverse } from '../blocks/patch/blockPatch'
import type { SduiDocumentContent, SduiDocumentPatch } from '../blocks/schema'
import { findBlockById, findParent } from '../blocks/traverse'
import type { AnchorPositionHint } from '../ordering'
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
 * - a pending envelope that re-applies with a dead anchor is either reported
 *   via `degraded` (append mode) or moved to `dropped` (`onAnchorMiss:
 *   'throw'`) — hosts must surface both; silent wrong order is never OK
 *
 * Non-goal: undo/redo inverses anchor against the tree at undo time by design
 * (documentHistory) — that is unrelated to stale-anchor replay and not
 * addressed here.
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
  options?: {
    /**
     * `append` (default) — a pending edit whose anchor died re-applies at the
     * parent tail and is reported via `degraded`. `throw` — such an edit is
     * dropped instead of committing a wrong order.
     */
    onAnchorMiss?: 'append' | 'throw'
  }
}

/** A re-applied pending envelope whose anchors fell to the parent tail. */
export type DegradedEnvelope = {
  envelope: PatchEnvelope
  reports: AnchorDegradeReport[]
}

export type ReconcileRemoteResult = {
  content: SduiDocumentContent
  syncState: ClientSyncState
  dropped: PatchEnvelope[]
  /** Callers must surface these to the user, never swallow them. */
  degraded: DegradedEnvelope[]
}

export function reconcileRemote(input: ReconcileRemoteInput): ReconcileRemoteResult {
  const { syncState, remoteEntries } = input
  if (remoteEntries.length === 0) {
    return { content: input.content, syncState, dropped: [], degraded: [] }
  }

  // 1. roll back optimistic edits (reverse order)
  const rolledBack = [...syncState.pending]
    .reverse()
    .reduce((content, entry) => applyDocumentPatches(content, entry.inverse), input.content)

  // 2. own entries in the log are acks; the rest stays pending for re-apply
  const remoteIds = new Set(remoteEntries.map((entry) => entry.envelopeId))
  const stillPending = syncState.pending.filter((entry) => !remoteIds.has(entry.envelope.envelopeId))

  // 3. apply remote entries in seq order (server form is authoritative).
  // Blocks the remote entries delete leave a tombstone (old parent+position) so
  // step 4 can re-anchor a pending edit at the dead anchor's exact slot.
  // ponytail: deletes only — a remote *move* leaves no tombstone and degrades
  // instead; record moves here if that turns out to matter.
  const tombstones = new Map<string, AnchorPositionHint>()
  const ordered = [...remoteEntries].sort((a, b) => a.seq - b.seq)
  const remoteApplied = ordered.reduce(
    (content, entry) =>
      entry.patches.reduce((current, patch) => {
        if (patch.type === 'block.delete') {
          const found = findParent(current.root, patch.blockId)
          const block = findBlockById(current, patch.blockId)
          if (found && block?.position) {
            tombstones.set(patch.blockId, { parentId: found.parent.id, position: block.position })
          }
        }
        return applyDocumentPatch(current, patch)
      }, content),
    rolledBack,
  )

  // 4. re-apply surviving local edits, recomputing inverses on the new base
  const applyOptions = { onAnchorMiss: input.options?.onAnchorMiss, positionHints: tombstones }
  const reapplied = stillPending.reduce<{
    content: SduiDocumentContent
    pending: PendingEnvelope[]
    dropped: PatchEnvelope[]
    degraded: DegradedEnvelope[]
  }>(
    (accumulator, entry) => {
      try {
        const { content, inverse, degraded } = applyDocumentPatchesWithInverse(
          accumulator.content,
          entry.envelope.patches,
          applyOptions,
        )

        return {
          content,
          pending: [...accumulator.pending, { envelope: entry.envelope, inverse }],
          dropped: accumulator.dropped,
          degraded:
            degraded.length > 0
              ? [...accumulator.degraded, { envelope: entry.envelope, reports: degraded }]
              : accumulator.degraded,
        }
      } catch {
        return { ...accumulator, dropped: [...accumulator.dropped, entry.envelope] }
      }
    },
    { content: remoteApplied, pending: [], dropped: [], degraded: [] },
  )

  return {
    content: reapplied.content,
    syncState: {
      confirmedSeq: Math.max(syncState.confirmedSeq, ordered[ordered.length - 1].seq),
      pending: reapplied.pending,
    },
    dropped: reapplied.dropped,
    degraded: reapplied.degraded,
  }
}
