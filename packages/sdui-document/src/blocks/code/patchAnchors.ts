import { sortBlocksByPosition } from '../../ordering/sortChildren'
import type { SduiDocumentBlock } from '../schema/block'
import type { SduiDocumentContent } from '../schema/document'
import type { BlockPlacementAnchor } from '../schema/patch'

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

function fallbackBefore(content: SduiDocumentContent, parentId: string, blockId: string): string[] | undefined {
  const siblings = sortedChildren(content, parentId)
  const index = siblings.findIndex((sibling) => sibling.id === blockId)

  if (index <= 0) {
    return undefined
  }

  return [siblings[index - 1].id]
}

/** Place a block immediately after `afterBlockId` within `parentId`. */
export function anchorAfterBlock(
  content: SduiDocumentContent,
  parentId: string,
  afterBlockId: string,
): BlockPlacementAnchor {
  const fallback = fallbackBefore(content, parentId, afterBlockId)

  return {
    after: afterBlockId,
    ...(fallback ? { fallbackAfter: fallback } : {}),
  }
}

/** Place a block immediately before `beforeBlockId` within `parentId`. */
export function anchorBeforeBlock(
  content: SduiDocumentContent,
  parentId: string,
  beforeBlockId: string,
): BlockPlacementAnchor {
  const siblings = sortedChildren(content, parentId)
  const index = siblings.findIndex((sibling) => sibling.id === beforeBlockId)
  const prev = index > 0 ? siblings[index - 1].id : undefined

  return {
    before: beforeBlockId,
    ...(prev ? { fallbackAfter: [prev] } : {}),
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
