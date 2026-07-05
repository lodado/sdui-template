import { normalizeColumnRatio } from '../../block-types/column/column.schema'
import { COLUMN_BLOCK_TYPE } from '../../block-types/column/column.type'
import type { SduiDocumentContent, SduiDocumentPatch } from '../schema'
import { findBlockById, findParent } from './patch/traverse'

/** A column can never be squeezed below this weight (≈ Notion's min column width). */
export const MIN_COLUMN_RATIO = 0.2

/** Rounds away float-drag noise so ratios stay short in the document JSON. */
function roundRatio(value: number): number {
  return Math.round(value * 1000) / 1000
}

export type ResizeColumnPairInput = {
  /** Current left/right weights; absent = the default equal weight (1). */
  leftRatio?: number
  rightRatio?: number
  /** Gutter travel as a fraction of the PAIR's total width (positive = right). */
  deltaFraction: number
}

export type ResizedColumnPair = {
  leftRatio: number
  rightRatio: number
}

/**
 * Redistributes a column pair's weight for a gutter drag. The pair's total
 * weight is preserved — only the split point moves; the shift scales with the
 * total so a 10% pointer travel is a 10% visual change regardless of weights.
 *
 * Policies:
 * - either column clamps at MIN_COLUMN_RATIO (the other takes the rest)
 * - non-finite deltas are treated as no movement
 */
export function resizeColumnPair(input: ResizeColumnPairInput): ResizedColumnPair {
  const leftRatio = normalizeColumnRatio(input.leftRatio) ?? 1
  const rightRatio = normalizeColumnRatio(input.rightRatio) ?? 1
  const delta = Number.isFinite(input.deltaFraction) ? input.deltaFraction : 0

  const total = leftRatio + rightRatio
  const shifted = leftRatio + delta * total
  const nextLeft = roundRatio(Math.min(Math.max(shifted, MIN_COLUMN_RATIO), total - MIN_COLUMN_RATIO))

  return { leftRatio: nextLeft, rightRatio: roundRatio(total - nextLeft) }
}

export type CreateColumnResizePatchesInput = {
  content: SduiDocumentContent
  leftColumnId: string
  rightColumnId: string
  deltaFraction: number
}

/**
 * Maps a gutter drag between two sibling columns onto block.update patches.
 *
 * @returns two ratio updates (left, right), or null when the ids are not two
 *          columns sharing the same columnList parent
 */
export function createColumnResizePatches(input: CreateColumnResizePatchesInput): SduiDocumentPatch[] | null {
  const { content, leftColumnId, rightColumnId, deltaFraction } = input

  const left = findBlockById(content, leftColumnId)
  const right = findBlockById(content, rightColumnId)
  if (!left || !right || left.type !== COLUMN_BLOCK_TYPE || right.type !== COLUMN_BLOCK_TYPE) {
    return null
  }

  const leftParent = findParent(content.root, leftColumnId)
  const rightParent = findParent(content.root, rightColumnId)
  if (!leftParent || !rightParent || leftParent.parent.id !== rightParent.parent.id) {
    return null
  }

  const resized = resizeColumnPair({
    leftRatio: normalizeColumnRatio(left.attributes?.ratio),
    rightRatio: normalizeColumnRatio(right.attributes?.ratio),
    deltaFraction,
  })

  return [
    { type: 'block.update', blockId: left.id, attributes: { ratio: resized.leftRatio } },
    { type: 'block.update', blockId: right.id, attributes: { ratio: resized.rightRatio } },
  ]
}
