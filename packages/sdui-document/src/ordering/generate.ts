import { generateKeyBetween, generateNKeysBetween } from 'fractional-indexing'

/**
 * Generates a fractional position key between two sibling keys.
 * Either bound may be null (start / end of list).
 */
export function generatePositionBetween(a: string | null, b: string | null): string {
  return generateKeyBetween(a, b)
}

/**
 * Generates `count` evenly-spaced position keys between two bounds.
 * Used for migration and rebalance.
 */
export function generatePositions(a: string | null, b: string | null, count: number): string[] {
  if (count <= 0) {
    return []
  }

  return generateNKeysBetween(a, b, count)
}
