import type { SduiDocumentBlock } from '../blocks/schema/block'
import type { BlockPlacementAnchor } from '../blocks/schema/patch'
import { sortBlocksByPosition } from './sortChildren'

export type ResolvedPositionBounds = {
  afterKey: string | null
  beforeKey: string | null
}

function sortedSiblings(parent: SduiDocumentBlock): SduiDocumentBlock[] {
  return sortBlocksByPosition(parent.children ?? [])
}

function findSiblingById(parent: SduiDocumentBlock, blockId: string): SduiDocumentBlock | undefined {
  return (parent.children ?? []).find((child) => child.id === blockId)
}

function resolveAfterBlockId(
  parent: SduiDocumentBlock,
  after: string | null | undefined,
  fallbackAfter: string[] | undefined,
): SduiDocumentBlock | undefined {
  if (after === null || after === undefined) {
    return undefined
  }

  const direct = findSiblingById(parent, after)
  if (direct) {
    return direct
  }

  return (fallbackAfter ?? [])
    .map((candidateId) => findSiblingById(parent, candidateId))
    .find((candidate): candidate is SduiDocumentBlock => candidate !== undefined)
}

/**
 * Resolves anchor intent to fractional key bounds for `generatePositionBetween`.
 *
 * Fallback policy when anchors are missing:
 * 1. Try `after` then `fallbackAfter[]`
 * 2. Try `before`
 * 3. Default to end of parent (after last sibling)
 */
export function resolvePositionBounds(parent: SduiDocumentBlock, anchor: BlockPlacementAnchor): ResolvedPositionBounds {
  const siblings = sortedSiblings(parent)
  const { after, before, fallbackAfter } = anchor

  if (after === null) {
    const first = siblings[0]
    return {
      afterKey: null,
      beforeKey:
        before !== undefined && before !== null
          ? findSiblingById(parent, before)?.position ?? null
          : first?.position ?? null,
    }
  }

  if (before === null) {
    const last = siblings[siblings.length - 1]
    const afterBlock = after !== undefined ? resolveAfterBlockId(parent, after, fallbackAfter) : last

    return {
      afterKey: afterBlock?.position ?? last?.position ?? null,
      beforeKey: null,
    }
  }

  const afterBlock = resolveAfterBlockId(parent, after, fallbackAfter)
  if (afterBlock) {
    const afterIndex = siblings.findIndex((s) => s.id === afterBlock.id)
    const nextSibling = siblings[afterIndex + 1]

    if (before !== undefined && before !== null) {
      const beforeBlock = findSiblingById(parent, before)

      return {
        afterKey: afterBlock.position ?? null,
        beforeKey: beforeBlock?.position ?? null,
      }
    }

    return {
      afterKey: afterBlock.position ?? null,
      beforeKey: nextSibling?.position ?? null,
    }
  }

  if (before !== undefined && before !== null) {
    const beforeBlock = findSiblingById(parent, before)

    if (beforeBlock) {
      const beforeIndex = siblings.findIndex((s) => s.id === beforeBlock.id)
      const prevSibling = beforeIndex > 0 ? siblings[beforeIndex - 1] : undefined

      return {
        afterKey: prevSibling?.position ?? null,
        beforeKey: beforeBlock.position ?? null,
      }
    }
  }

  // Default: append to end of parent
  const last = siblings[siblings.length - 1]

  return {
    afterKey: last?.position ?? null,
    beforeKey: null,
  }
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
