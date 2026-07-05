import type { CommittedPatchEnvelope, PatchEnvelope } from './envelope'

/**
 * Append-only, server-ordered event log for one document.
 *
 * Policies:
 * - `seq` is the single ordering authority for collaboration. It is assigned
 *   here, at append time — never derived from client timestamps.
 * - The log is immutable data; persistence/transport lives outside this
 *   package (repository/adapter layer).
 * - `seq` never resets: compaction drops old entries but keeps the counter.
 */
export type DocumentLog = {
  readonly seq: number
  readonly entries: readonly CommittedPatchEnvelope[]
}

export function createDocumentLog(): DocumentLog {
  return { seq: 0, entries: [] }
}

export type AppendToLogResult = {
  log: DocumentLog
  committed: CommittedPatchEnvelope
}

export function appendToLog(log: DocumentLog, envelope: PatchEnvelope): AppendToLogResult {
  const committed: CommittedPatchEnvelope = { ...envelope, seq: log.seq + 1 }

  return {
    log: { seq: committed.seq, entries: [...log.entries, committed] },
    committed,
  }
}

export function entriesSince(log: DocumentLog, afterSeq: number): CommittedPatchEnvelope[] {
  return log.entries.filter((entry) => entry.seq > afterSeq)
}

/** Drops entries with seq <= keepAfterSeq (callers snapshot first). */
export function compactLog(log: DocumentLog, keepAfterSeq: number): DocumentLog {
  return { seq: log.seq, entries: log.entries.filter((entry) => entry.seq > keepAfterSeq) }
}
