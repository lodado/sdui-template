import { applyDocumentPatches } from '../blocks/patch/blockPatch'
import type { SduiDocumentContent } from '../blocks/schema'
import {
  type BlockVersionConflict,
  type BlockVersionMap,
  bumpBlockVersions,
  detectVersionConflicts,
} from './blockVersions'
import { appendToLog, createDocumentLog, type DocumentLog } from './documentLog'
import type { CommittedPatchEnvelope, PatchEnvelope } from './envelope'

/**
 * Pure server-side sequencer: the single writer that turns client envelopes
 * into committed log entries.
 *
 * Policies (R3):
 * - a stale `baseSeq` alone never rejects — conflicts are block-granular
 *   (two actors editing different blocks from the same stale view both land)
 * - `expectedVersion` conflicts (R1 detection) reject the WHOLE envelope:
 *   envelopes are atomic batches
 * - a patch-engine throw (e.g. target deleted concurrently) rejects as
 *   `applyFailed`; state is returned unchanged on every rejection
 * - duplicate envelopeIds are answered idempotently for retry safety
 */
export type SequencerState = {
  content: SduiDocumentContent
  versions: BlockVersionMap
  log: DocumentLog
}

export function createSequencerState(content: SduiDocumentContent): SequencerState {
  return { content, versions: {}, log: createDocumentLog() }
}

export type CommitEnvelopeResult =
  | { status: 'committed'; state: SequencerState; committed: CommittedPatchEnvelope }
  | { status: 'duplicate'; state: SequencerState; committed: CommittedPatchEnvelope }
  | {
      status: 'rejected'
      state: SequencerState
      reason: 'blockConflict'
      conflicts: BlockVersionConflict[]
      currentSeq: number
    }
  | { status: 'rejected'; state: SequencerState; reason: 'applyFailed'; error: unknown; currentSeq: number }

export function commitEnvelope(state: SequencerState, envelope: PatchEnvelope): CommitEnvelopeResult {
  const duplicate = state.log.entries.find((entry) => entry.envelopeId === envelope.envelopeId)
  if (duplicate) {
    return { status: 'duplicate', state, committed: duplicate }
  }

  const conflicts = detectVersionConflicts({ versions: state.versions, patches: envelope.patches })
  if (conflicts.length > 0) {
    return { status: 'rejected', state, reason: 'blockConflict', conflicts, currentSeq: state.log.seq }
  }

  try {
    const content = applyDocumentPatches(state.content, envelope.patches)
    const versions = bumpBlockVersions(state.versions, envelope.patches)
    const { log, committed } = appendToLog(state.log, envelope)

    return { status: 'committed', state: { content, versions, log }, committed }
  } catch (error: unknown) {
    return { status: 'rejected', state, reason: 'applyFailed', error, currentSeq: state.log.seq }
  }
}
