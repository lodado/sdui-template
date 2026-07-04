/**
 * Realtime R2: block-level presence ("who is viewing/editing which block").
 * Pure helpers over a presence list — the transport adapter feeds/broadcasts it.
 */
export type BlockPresence = {
  userId: string
  documentId: string
  /** Absent for document-level presence (e.g. viewing without a caret). */
  blockId?: string
  status: 'viewing' | 'editing'
  lastActiveAt: string
}

function isSameActor(a: BlockPresence, b: BlockPresence): boolean {
  return a.userId === b.userId && a.documentId === b.documentId
}

/** Replaces the entry for the same user+document, or appends a new one. */
export function upsertPresence(list: BlockPresence[], presence: BlockPresence): BlockPresence[] {
  const exists = list.some((entry) => isSameActor(entry, presence))
  if (!exists) {
    return [...list, presence]
  }

  return list.map((entry) => (isSameActor(entry, presence) ? presence : entry))
}

/**
 * Drops entries older than the ttl.
 *
 * Policies:
 * - boundary inclusive: an entry aged exactly `ttlMs` is kept
 */
export function prunePresence(list: BlockPresence[], nowIso: string, ttlMs: number): BlockPresence[] {
  const now = Date.parse(nowIso)

  return list.filter((entry) => now - Date.parse(entry.lastActiveAt) <= ttlMs)
}

/** Presences currently editing the given block. */
export function getBlockEditors(list: BlockPresence[], blockId: string): BlockPresence[] {
  return list.filter((entry) => entry.status === 'editing' && entry.blockId === blockId)
}
