import { sortBlocksByPosition } from '../../ordering/sortChildren'
import type { SduiDocumentBlock } from '../schema/block'
import type { SduiDocumentContent } from '../schema/document'
import type { BlockPlacementAnchor } from '../schema/patch'

/**
 * How many neighbors to capture per direction as fallback anchors. Survives
 * up to this many consecutive sibling deletions before degrading.
 */
const ANCHOR_FALLBACK_DEPTH = 3

function findBlock(block: SduiDocumentBlock, blockId: string): SduiDocumentBlock | undefined {
  if (block.id === blockId) {
    return block
  }

  return (block.children ?? [])
    .map((child) => findBlock(child, blockId))
    .find((found): found is SduiDocumentBlock => Boolean(found))
}

function sortedChildren(content: SduiDocumentContent, parentId: string) {
  const parent = findBlock(content.root, parentId)

  return sortBlocksByPosition(parent?.children ?? [])
}

/** Up to `ANCHOR_FALLBACK_DEPTH` sibling ids before/after `index`, nearest first. */
function neighborIds(siblings: SduiDocumentBlock[], index: number, direction: -1 | 1): string[] | undefined {
  if (index < 0) {
    return undefined
  }

  const ids: string[] = []
  for (let step = 1; step <= ANCHOR_FALLBACK_DEPTH; step += 1) {
    const neighbor = siblings[index + direction * step]
    if (!neighbor) {
      break
    }
    ids.push(neighbor.id)
  }

  return ids.length > 0 ? ids : undefined
}

function fallbacksAround(content: SduiDocumentContent, parentId: string, blockId: string) {
  const siblings = sortedChildren(content, parentId)
  const index = siblings.findIndex((sibling) => sibling.id === blockId)
  const fallbackAfter = neighborIds(siblings, index, -1)
  const fallbackBefore = neighborIds(siblings, index, 1)

  return {
    ...(fallbackAfter ? { fallbackAfter } : {}),
    ...(fallbackBefore ? { fallbackBefore } : {}),
  }
}

/** Place a block immediately after `afterBlockId` within `parentId`. */
export function anchorAfterBlock(
  content: SduiDocumentContent,
  parentId: string,
  afterBlockId: string,
): BlockPlacementAnchor {
  return {
    after: afterBlockId,
    ...fallbacksAround(content, parentId, afterBlockId),
  }
}

/** Place a block immediately before `beforeBlockId` within `parentId`. */
export function anchorBeforeBlock(
  content: SduiDocumentContent,
  parentId: string,
  beforeBlockId: string,
): BlockPlacementAnchor {
  return {
    before: beforeBlockId,
    ...fallbacksAround(content, parentId, beforeBlockId),
  }
}

/** Append as the last child of `parentId`. */
export function anchorAppendToParent(content: SduiDocumentContent, parentId: string): BlockPlacementAnchor {
  const siblings = sortedChildren(content, parentId)
  const last = siblings[siblings.length - 1]

  return last ? anchorAfterBlock(content, parentId, last.id) : { before: null }
}

/** Prepend as the first child of `parentId`. */
export function anchorPrependToParent(): BlockPlacementAnchor {
  return { after: null }
}
