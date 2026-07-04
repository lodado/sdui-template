import type { OrderedRef } from './types'

function compareStrings(a: string | undefined, b: string | undefined): number {
  const left = a ?? ''
  const right = b ?? ''

  if (left < right) {
    return -1
  }

  if (left > right) {
    return 1
  }

  return 0
}

/**
 * Lexicographic compare on `(position, clientId, opId)`.
 * Used for deterministic sibling ordering and tie-break.
 */
export function comparePosition(a: OrderedRef, b: OrderedRef): number {
  const byPosition = compareStrings(a.position, b.position)
  if (byPosition !== 0) {
    return byPosition
  }

  const byClient = compareStrings(a.clientId, b.clientId)
  if (byClient !== 0) {
    return byClient
  }

  return compareStrings(a.opId, b.opId)
}
