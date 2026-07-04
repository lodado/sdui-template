import { findBlockById } from '../code'
import type { SduiDocumentContent, SduiDocumentPatch } from '../schema'
import type { FlattenedDocumentBlock, NestedBlockDropPosition } from './dragHelpers'
import { createNestedBlockMovePatch, flattenDocumentBlocks } from './dragHelpers'

export type ProjectNestedBlockDropInput = {
  content: SduiDocumentContent
  activeId: string
  overId: string
  /** Horizontal pointer offset from drag start, in px (positive = right). */
  offsetX: number
  /** Pixel width of one indentation level. */
  indentWidth: number
}

export type ProjectedNestedBlockDrop = {
  overId: string
  position: NestedBlockDropPosition
  depth: number
}

function collectSubtreeIds(content: SduiDocumentContent, blockId: string): Set<string> {
  const subtreeRoot = findBlockById(content, blockId)
  if (!subtreeRoot) {
    return new Set()
  }

  const flattened = flattenDocumentBlocks({ ...content, root: subtreeRoot })

  return new Set(flattened.map((item) => item.id))
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function ancestorAtDepth(
  items: FlattenedDocumentBlock[],
  from: FlattenedDocumentBlock,
  depth: number,
): FlattenedDocumentBlock | undefined {
  if (from.depth === depth) {
    return from
  }

  const parent = items.find((item) => item.id === from.parentId)
  if (!parent) {
    return undefined
  }

  return ancestorAtDepth(items, parent, depth)
}

/**
 * Projects a pointer position onto a concrete drop slot for nested block DnD
 * (dnd-kit nested-sortable pattern).
 *
 * The drop slot is "immediately after `overId`"; the horizontal offset picks
 * the depth within [minDepth, maxDepth] where
 * - maxDepth = over item's depth + 1 (become its child)
 * - minDepth = the next visible item's depth (keep the tree well-formed)
 *
 * @returns the (overId, position, depth) triple to feed createNestedBlockMovePatch,
 *          or null when the target is invalid (root, the active block itself,
 *          or anything inside the dragged subtree)
 */
export function projectNestedBlockDrop(input: ProjectNestedBlockDropInput): ProjectedNestedBlockDrop | null {
  const { content, activeId, overId, offsetX, indentWidth } = input

  if (overId === content.root.id || overId === activeId) {
    return null
  }

  const activeSubtreeIds = collectSubtreeIds(content, activeId)
  if (activeSubtreeIds.has(overId)) {
    return null
  }

  const flattened = flattenDocumentBlocks(content)
  const active = flattened.find((item) => item.id === activeId)
  if (!active) {
    return null
  }

  const visibleItems = flattened.filter((item) => item.id !== content.root.id && !activeSubtreeIds.has(item.id))
  const overIndex = visibleItems.findIndex((item) => item.id === overId)
  if (overIndex < 0) {
    return null
  }

  const previous = visibleItems[overIndex]
  const next = visibleItems[overIndex + 1]

  const maxDepth = previous.depth + 1
  const minDepth = next ? next.depth : 1
  const projectedDepth = clamp(active.depth + Math.round(offsetX / indentWidth), minDepth, maxDepth)

  if (projectedDepth === previous.depth + 1) {
    return { overId: previous.id, position: 'inside', depth: projectedDepth }
  }

  if (projectedDepth === previous.depth) {
    return { overId: previous.id, position: 'after', depth: projectedDepth }
  }

  const ancestor = ancestorAtDepth(flattened, previous, projectedDepth)
  if (!ancestor) {
    return null
  }

  return { overId: ancestor.id, position: 'after', depth: projectedDepth }
}

/**
 * One-shot DnD drop handler: projects the pointer onto a drop slot and maps
 * it straight to a block.move patch.
 *
 * @returns the move patch, or null when the drop target is invalid
 *          (root / dragged subtree / unknown ids)
 */
export function createProjectedBlockMovePatch(
  input: ProjectNestedBlockDropInput,
): Extract<SduiDocumentPatch, { type: 'block.move' }> | null {
  const projected = projectNestedBlockDrop(input)
  if (!projected) {
    return null
  }

  return createNestedBlockMovePatch({
    content: input.content,
    activeId: input.activeId,
    overId: projected.overId,
    position: projected.position,
  })
}
