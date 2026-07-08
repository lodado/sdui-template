import { applyDocumentPatches } from '../blocks/patch/blockPatch'
import type { SduiDocumentContent } from '../blocks/schema'
import { type BlockVersionMap, bumpBlockVersions } from './blockVersions'
import type { CommittedPatchEnvelope } from './envelope'

/**
 * Materialized document state at a log seq. Snapshots bound replay cost:
 * state(seq N) = replay(snapshot(seq K), entries K+1..N).
 */
export type DocumentSnapshot = {
  seq: number
  content: SduiDocumentContent
  versions: BlockVersionMap
}

export function createSnapshot(seq: number, content: SduiDocumentContent, versions: BlockVersionMap): DocumentSnapshot {
  return { seq, content, versions }
}

/**
 * Deterministic replay: relies on applyDocumentPatches being a pure reducer.
 * Entries must be contiguous and start right after snapshot.seq.
 */
export function replayFromSnapshot(
  snapshot: DocumentSnapshot,
  entries: readonly CommittedPatchEnvelope[],
): DocumentSnapshot {
  return entries.reduce<DocumentSnapshot>(
    (state, entry) => ({
      seq: entry.seq,
      content: applyDocumentPatches(state.content, entry.patches),
      versions: bumpBlockVersions(state.versions, entry.patches),
    }),
    snapshot,
  )
}
