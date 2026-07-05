import type { DragEndEvent, DragMoveEvent, DragStartEvent } from '@dnd-kit/core'
import {
  appendColumnCleanupPatches,
  createHorizontalBlockDropPatches,
  createProjectedBlockMovePatch,
  projectHorizontalBlockDrop,
  projectNestedBlockDrop,
  type SduiDocumentContent,
  type SduiDocumentPatch,
} from '@lodado/sdui-document'
import type { MutableRefObject, RefObject } from 'react'

import { type DropIndicatorProjection, positionDropIndicatorOverlay } from './dropIndicatorOverlay'

type NestedBlockDragDropOptions = {
  docRef: MutableRefObject<SduiDocumentContent>
  indentWidth: number
  containerRef: RefObject<HTMLElement>
  /** Single absolutely-positioned indicator element inside the container. */
  indicatorRef: RefObject<HTMLElement>
  applyPatches(patches: SduiDocumentPatch[]): void
  onDragStart(): void
}

/**
 * dnd-kit wiring for nested block drag & drop.
 *
 * The drop indicator is NOT React state: onDragMove fires at pointer
 * frequency, so the projection is painted onto one overlay element via direct
 * DOM mutation (positionDropIndicatorOverlay). Zero re-renders per drag frame;
 * React is only involved again at drop time (one patch → one doc update).
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Vertical pointer position within the over row: 0 = top edge, 1 = bottom.
 *
 * dnd-kit does not expose live pointer coordinates on move/end events, so the
 * current position is reconstructed as activator position + accumulated delta.
 *
 * @returns undefined when it cannot be measured (no over target, keyboard
 *          activation, zero-height rect) — the projection then falls back to
 *          the legacy after-only behavior.
 */
export function resolveOverRatio(event: DragMoveEvent | DragEndEvent): number | undefined {
  const { over, activatorEvent, delta } = event
  const clientY = (activatorEvent as { clientY?: unknown } | null)?.clientY

  if (!over || typeof clientY !== 'number' || over.rect.height <= 0) {
    return undefined
  }

  const pointerY = clientY + delta.y

  return clamp((pointerY - over.rect.top) / over.rect.height, 0, 1)
}

export type OverPointerX = {
  /** Pointer X offset from the over row's left edge, px (unclamped). */
  offsetX: number
  /** Over row width, px. */
  width: number
}

/**
 * Horizontal pointer position against the over row, in PIXELS (not a ratio —
 * the split edge band is a fixed px width and must not scale with the row).
 * Mirrors resolveOverRatio (activator position + accumulated delta).
 *
 * @returns undefined when it cannot be measured (no over target, keyboard
 *          activation, zero-width rect) — horizontal drops are then disabled
 *          and the vertical projection owns the gesture.
 */
export function resolveOverPointerX(event: DragMoveEvent | DragEndEvent): OverPointerX | undefined {
  const { over, activatorEvent, delta } = event
  const clientX = (activatorEvent as { clientX?: unknown } | null)?.clientX

  if (!over || typeof clientX !== 'number' || over.rect.width <= 0) {
    return undefined
  }

  return { offsetX: clientX + delta.x - over.rect.left, width: over.rect.width }
}

export function useNestedBlockDragDrop({
  docRef,
  indentWidth,
  containerRef,
  indicatorRef,
  applyPatches,
  onDragStart,
}: NestedBlockDragDropOptions) {
  // Horizontal (left/right edge) wins over the vertical slot projection: the
  // edge band is a narrow fixed-px strip, so an edge pointer is an explicit
  // split intent.
  const projectHorizontal = (event: DragMoveEvent | DragEndEvent) => {
    if (!event.over) {
      return null
    }

    const pointer = resolveOverPointerX(event)

    return projectHorizontalBlockDrop({
      content: docRef.current,
      activeId: String(event.active.id),
      overId: String(event.over.id),
      overOffsetX: pointer?.offsetX,
      overWidth: pointer?.width,
    })
  }

  const projectDrop = (event: DragMoveEvent | DragEndEvent): DropIndicatorProjection | null => {
    if (!event.over) {
      return null
    }

    const horizontal = projectHorizontal(event)
    if (horizontal) {
      return horizontal
    }

    return projectNestedBlockDrop({
      content: docRef.current,
      activeId: String(event.active.id),
      overId: String(event.over.id),
      offsetX: event.delta.x,
      indentWidth,
      overRatio: resolveOverRatio(event),
    })
  }

  const paintIndicator = (projected: DropIndicatorProjection | null) => {
    const overlay = indicatorRef.current
    const container = containerRef.current
    if (!overlay || !container) {
      return
    }

    positionDropIndicatorOverlay(overlay, container, projected, indentWidth)
  }

  const handleDragStart = (_event: DragStartEvent) => {
    onDragStart()
  }

  const handleDragMove = (event: DragMoveEvent) => {
    paintIndicator(projectDrop(event))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    paintIndicator(null)
    if (!event.over) {
      return
    }

    const horizontal = projectHorizontal(event)
    if (horizontal) {
      const patches = createHorizontalBlockDropPatches({
        content: docRef.current,
        activeId: String(event.active.id),
        overId: String(event.over.id),
        side: horizontal.side,
      })
      if (patches) {
        applyPatches(appendColumnCleanupPatches(docRef.current, patches))
      }

      return
    }

    const patch = createProjectedBlockMovePatch({
      content: docRef.current,
      activeId: String(event.active.id),
      overId: String(event.over.id),
      offsetX: event.delta.x,
      indentWidth,
      overRatio: resolveOverRatio(event),
    })
    if (patch) {
      // vertical moves can empty a column too — same-batch cleanup keeps undo atomic
      applyPatches(appendColumnCleanupPatches(docRef.current, [patch]))
    }
  }

  const handleDragCancel = () => {
    paintIndicator(null)
  }

  return { handleDragStart, handleDragMove, handleDragEnd, handleDragCancel }
}
