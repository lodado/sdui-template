import type { SduiDocumentBlock } from '../blocks/schema/block'
import type { BlockPlacementAnchor } from '../blocks/schema/patch'
import { sortBlocksByPosition } from './sortChildren'

/**
 * How faithfully an anchor was honored:
 * - `exact`     — the requested anchor block was found
 * - `fallback`  — anchor was dead but the position was recovered (hint,
 *                 fallback ids, or the opposite-direction anchor)
 * - `degraded`  — nothing survived; the block fell to the parent tail and is
 *                 probably in the wrong place. Callers must surface this.
 */
export type AnchorResolution = 'exact' | 'fallback' | 'degraded'

export type ResolvedPositionBounds = {
  afterKey: string | null
  beforeKey: string | null
  resolution: AnchorResolution
}

/** Old fractional position of a block that no longer exists (tombstone). */
export type AnchorPositionHint = { parentId: string; position: string }
export type AnchorPositionHints = ReadonlyMap<string, AnchorPositionHint>

function sortedSiblings(parent: SduiDocumentBlock): SduiDocumentBlock[] {
  return sortBlocksByPosition(parent.children ?? [])
}

function findSiblingById(parent: SduiDocumentBlock, blockId: string): SduiDocumentBlock | undefined {
  return (parent.children ?? []).find((child) => child.id === blockId)
}

function firstSurvivor(parent: SduiDocumentBlock, candidateIds: string[] | undefined): SduiDocumentBlock | undefined {
  return (candidateIds ?? [])
    .map((candidateId) => findSiblingById(parent, candidateId))
    .find((candidate): candidate is SduiDocumentBlock => candidate !== undefined)
}

function hintFor(
  parent: SduiDocumentBlock,
  blockId: string | null | undefined,
  hints: AnchorPositionHints | undefined,
): string | undefined {
  if (blockId === null || blockId === undefined) {
    return undefined
  }

  const hint = hints?.get(blockId)
  return hint && hint.parentId === parent.id ? hint.position : undefined
}

function boundsAfterBlock(siblings: SduiDocumentBlock[], block: SduiDocumentBlock, explicitBeforeKey?: string | null) {
  const index = siblings.findIndex((sibling) => sibling.id === block.id)

  return {
    afterKey: block.position ?? null,
    beforeKey: explicitBeforeKey !== undefined ? explicitBeforeKey : siblings[index + 1]?.position ?? null,
  }
}

function boundsBeforeBlock(siblings: SduiDocumentBlock[], block: SduiDocumentBlock) {
  const index = siblings.findIndex((sibling) => sibling.id === block.id)

  return {
    afterKey: index > 0 ? siblings[index - 1].position ?? null : null,
    beforeKey: block.position ?? null,
  }
}

/**
 * Resolves anchor intent to fractional key bounds for `generatePositionBetween`.
 *
 * Resolution order:
 * 1. `after` found directly (`exact`)
 * 2. `before` found directly (`exact`, or `fallback` when a specified `after` was dead)
 * 3. tombstone hint for `after` / `before` — re-uses the dead block's old slot (`fallback`)
 * 4. `fallbackAfter[]` then `fallbackBefore[]` survivors (`fallback`)
 * 5. parent tail (`degraded` — position intent lost)
 *
 * `hints` are rebase-scoped tombstones: `deleted block id → its old position`.
 */
export function resolvePositionBounds(
  parent: SduiDocumentBlock,
  anchor: BlockPlacementAnchor,
  hints?: AnchorPositionHints,
): ResolvedPositionBounds {
  const siblings = sortedSiblings(parent)
  const { after, before, fallbackAfter, fallbackBefore } = anchor

  // explicit prepend
  if (after === null) {
    return {
      afterKey: null,
      beforeKey:
        before !== undefined && before !== null
          ? findSiblingById(parent, before)?.position ?? null
          : siblings[0]?.position ?? null,
      resolution: 'exact',
    }
  }

  // explicit append — tail placement always satisfies `before: null`
  if (before === null) {
    const last = siblings[siblings.length - 1]
    const direct = after !== undefined ? findSiblingById(parent, after) : undefined
    const recovered = direct ?? firstSurvivor(parent, fallbackAfter)

    return {
      afterKey: recovered?.position ?? last?.position ?? null,
      beforeKey: null,
      resolution: after === undefined || direct ? 'exact' : 'fallback',
    }
  }

  // 1. after found directly
  if (after !== undefined) {
    const afterBlock = findSiblingById(parent, after)

    if (afterBlock) {
      const explicitBeforeKey = before !== undefined ? findSiblingById(parent, before)?.position ?? null : undefined
      return { ...boundsAfterBlock(siblings, afterBlock, explicitBeforeKey), resolution: 'exact' }
    }
  }

  // 2. before found directly
  if (before !== undefined) {
    const beforeBlock = findSiblingById(parent, before)

    if (beforeBlock) {
      return {
        ...boundsBeforeBlock(siblings, beforeBlock),
        resolution: after === undefined ? 'exact' : 'fallback',
      }
    }
  }

  // 3. tombstone hints — the dead anchor's old slot is the closest match to intent
  const afterHint = hintFor(parent, after, hints)
  if (afterHint !== undefined) {
    const nextSibling = siblings.find((sibling) => (sibling.position ?? '') > afterHint)
    return { afterKey: afterHint, beforeKey: nextSibling?.position ?? null, resolution: 'fallback' }
  }

  const beforeHint = hintFor(parent, before, hints)
  if (beforeHint !== undefined) {
    const preceding = siblings.filter((sibling) => (sibling.position ?? '') < beforeHint)
    return {
      afterKey: preceding[preceding.length - 1]?.position ?? null,
      beforeKey: beforeHint,
      resolution: 'fallback',
    }
  }

  // 4. fallback id chains
  const afterSurvivor = firstSurvivor(parent, fallbackAfter)
  if (afterSurvivor) {
    return { ...boundsAfterBlock(siblings, afterSurvivor), resolution: 'fallback' }
  }

  const beforeSurvivor = firstSurvivor(parent, fallbackBefore)
  if (beforeSurvivor) {
    return { ...boundsBeforeBlock(siblings, beforeSurvivor), resolution: 'fallback' }
  }

  // 5. degraded: append to end of parent
  const last = siblings[siblings.length - 1]

  return { afterKey: last?.position ?? null, beforeKey: null, resolution: 'degraded' }
}

/** Previous and next sibling ids for inverse move/insert patches. */
export function siblingAnchorsForBlock(
  parent: SduiDocumentBlock,
  blockId: string,
): { after: string | null; before: string | null } {
  const siblings = sortedSiblings(parent)
  const index = siblings.findIndex((s) => s.id === blockId)

  if (index < 0) {
    return { after: null, before: null }
  }

  return {
    after: index > 0 ? siblings[index - 1].id : null,
    before: index < siblings.length - 1 ? siblings[index + 1].id : null,
  }
}
