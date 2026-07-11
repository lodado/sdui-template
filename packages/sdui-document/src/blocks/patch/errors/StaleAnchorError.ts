/**
 * Thrown in `onAnchorMiss: 'throw'` mode when an insert/move anchor (and every
 * fallback) is dead and the block would otherwise silently fall to the parent
 * tail. Collaboration rebase catches this and drops the envelope instead of
 * committing a wrong order.
 */
export class StaleAnchorError extends Error {
  constructor(public readonly blockId: string, public readonly parentId: string) {
    super(`Anchor for block "${blockId}" in parent "${parentId}" is stale and unrecoverable`)
    this.name = 'StaleAnchorError'
  }
}
