import { findBlockById } from '../patch'
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
  /**
   * Vertical pointer position within the over row (0 = top edge, 1 = bottom).
   * Omitted → legacy behavior (drop slot is always after the over row).
   */
  overRatio?: number
}

/** overRatio below this → insert before the over row (top edge zone). */
export const DROP_BEFORE_RATIO = 0.25
/** overRatio above this → the after/horizontal-depth logic (bottom edge zone). */
export const DROP_AFTER_RATIO = 0.75

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
 * Vertical zones (when `overRatio` is provided):
 * - top zone (< DROP_BEFORE_RATIO)  → before the over row, at its depth
 * - middle zone                     → inside the over row (nest as first child)
 * - bottom zone (> DROP_AFTER_RATIO) → the horizontal-depth logic below
 *
 * In the bottom zone (and for legacy callers without overRatio) the drop slot
 * is "immediately after `overId`"; the horizontal offset picks the depth
 * within [minDepth, maxDepth] where
 * - maxDepth = over item's depth + 1 (become its child)
 * - minDepth = the next visible item's depth (keep the tree well-formed)
 *
 * @returns the (overId, position, depth) triple to feed createNestedBlockMovePatch,
 *          or null when the target is invalid (root, the active block itself,
 *          or anything inside the dragged subtree)
 */
export function projectNestedBlockDrop(input: ProjectNestedBlockDropInput): ProjectedNestedBlockDrop | null {
  const { content, activeId, overId, offsetX, indentWidth, overRatio } = input

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

  if (overRatio !== undefined) {
    if (overRatio < DROP_BEFORE_RATIO) {
      return { overId: previous.id, position: 'before', depth: previous.depth }
    }

    if (overRatio <= DROP_AFTER_RATIO) {
      return { overId: previous.id, position: 'inside', depth: previous.depth + 1 }
    }
  }

  const maxDepth = previous.depth + 1
  const minDepth = next ? next.depth : 1
  // Pointer-driven drops (overRatio present) must ignore the horizontal drag
  // delta: it measures travel from the grab point to the target, not intent —
  // grabbing a handle on the left and dropping mid-row would read as "+10
  // levels". The bottom zone targets the over row's own depth; the clamp only
  // bends it to keep the tree well-formed (e.g. first-child slot when the
  // next row is the over row's child). Legacy callers keep the dnd-kit
  // sortable-tree convention (depth = active depth + horizontal delta).
  const desiredDepth = overRatio === undefined ? active.depth + Math.round(offsetX / indentWidth) : previous.depth
  const projectedDepth = clamp(desiredDepth, minDepth, maxDepth)

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
