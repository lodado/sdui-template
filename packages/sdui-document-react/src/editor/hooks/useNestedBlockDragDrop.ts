import type { DragEndEvent, DragMoveEvent, DragStartEvent } from '@dnd-kit/core'
import {
  createProjectedBlockMovePatch,
  type ProjectedNestedBlockDrop,
  projectNestedBlockDrop,
  type SduiDocumentContent,
  type SduiDocumentPatch,
} from '@lodado/sdui-document'
import type { MutableRefObject, RefObject } from 'react'

import { positionDropIndicatorOverlay } from './dropIndicatorOverlay'

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

export function useNestedBlockDragDrop({
  docRef,
  indentWidth,
  containerRef,
  indicatorRef,
  applyPatches,
  onDragStart,
}: NestedBlockDragDropOptions) {
  const projectDrop = (event: DragMoveEvent | DragEndEvent): ProjectedNestedBlockDrop | null => {
    if (!event.over) {
      return null
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

  const paintIndicator = (projected: ProjectedNestedBlockDrop | null) => {
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

    const patch = createProjectedBlockMovePatch({
      content: docRef.current,
      activeId: String(event.active.id),
      overId: String(event.over.id),
      offsetX: event.delta.x,
      indentWidth,
      overRatio: resolveOverRatio(event),
    })
    if (patch) {
      applyPatches([patch])
    }
  }

  const handleDragCancel = () => {
    paintIndicator(null)
  }

  return { handleDragStart, handleDragMove, handleDragEnd, handleDragCancel }
}
