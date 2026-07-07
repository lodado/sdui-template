/* eslint-disable no-param-reassign -- this hook mutates DOM (ghost element,
   source-row opacity, indicator overlay, body cursor) at pointer frequency by
   design: the whole drag is imperative so it triggers ZERO React re-renders.
   React is involved again only at drop time (one patch → one doc update). */
import {
  appendColumnCleanupPatches,
  createHorizontalBlockDropPatches,
  createProjectedBlockMovePatch,
  projectHorizontalBlockDrop,
  projectNestedBlockDrop,
  type SduiDocumentContent,
  type SduiDocumentPatch,
} from '@lodado/sdui-document'
import { type MutableRefObject, type RefObject, useEffect, useRef } from 'react'

import { type DropIndicatorProjection, positionDropIndicatorOverlay } from './dropIndicatorOverlay'

/** Pointer travel (px) before a press becomes a drag — below this it stays a click. */
const ACTIVATION_DISTANCE = 4
const GHOST_OPACITY = '0.6'
const SOURCE_OPACITY = '0.4'

/** Just enough of a row's box for the projection math — a real DOMRect satisfies it. */
export type RowRect = { left: number; top: number; width: number; height: number }

/** The block row under the pointer plus its measured content rect. */
export type OverHit = { overId: string; rowRect: RowRect }

type DropInput = {
  content: SduiDocumentContent
  activeId: string
  hit: OverHit
  /** Absolute pointer X (viewport) — drives the column-split edge band. */
  pointerX: number
  /** Absolute pointer Y (viewport) — drives the before/after vertical zone. */
  pointerY: number
  /** Pointer X at press start — the horizontal travel drives indent depth. */
  startX: number
  indentWidth: number
}

/**
 * @returns true once the pointer has moved `distance` px (Euclidean) from the
 *          press origin. BVA: exactly `distance` activates.
 */
export function hasPassedThreshold(dx: number, dy: number, distance: number = ACTIVATION_DISTANCE): boolean {
  return Math.hypot(dx, dy) >= distance
}

/**
 * Vertical pointer position within the over row: 0 = top edge, 1 = bottom.
 *
 * @returns undefined for a zero/negative-height row (unmeasurable) — the
 *          projection then falls back to its after-only behavior.
 */
export function computeOverRatio(clientY: number, rowTop: number, rowHeight: number): number | undefined {
  if (rowHeight <= 0) {
    return undefined
  }

  const ratio = (clientY - rowTop) / rowHeight

  return Math.min(Math.max(ratio, 0), 1)
}

// A column-split edge band takes precedence over the vertical slot projection.
function projectHorizontal({ content, activeId, hit, pointerX }: DropInput) {
  return projectHorizontalBlockDrop({
    content,
    activeId,
    overId: hit.overId,
    overOffsetX: pointerX - hit.rowRect.left,
    overWidth: hit.rowRect.width,
  })
}

/**
 * Pure drop projection (what the indicator paints). Shared by the live drag and
 * by tests, so the hit is passed as data rather than read from the DOM.
 */
export function projectBlockDrop(input: DropInput): DropIndicatorProjection | null {
  const horizontal = projectHorizontal(input)
  if (horizontal) {
    return horizontal
  }

  return projectNestedBlockDrop({
    content: input.content,
    activeId: input.activeId,
    overId: input.hit.overId,
    offsetX: input.pointerX - input.startX,
    indentWidth: input.indentWidth,
    overRatio: computeOverRatio(input.pointerY, input.hit.rowRect.top, input.hit.rowRect.height),
  })
}

/**
 * Pure drop resolution (the patch batch to apply). Column-split edge → a
 * columnList insert + two moves; otherwise a single vertical `block.move`. Column
 * cleanup is folded in so the batch stays atomic for undo.
 *
 * @returns the patch batch, or null when the drop is a no-op.
 */
export function buildBlockDropPatches(input: DropInput): SduiDocumentPatch[] | null {
  const { content, activeId, hit } = input

  const horizontal = projectHorizontal(input)
  if (horizontal) {
    const patches = createHorizontalBlockDropPatches({ content, activeId, overId: hit.overId, side: horizontal.side })

    return patches ? appendColumnCleanupPatches(content, patches) : null
  }

  const patch = createProjectedBlockMovePatch({
    content,
    activeId,
    overId: hit.overId,
    offsetX: input.pointerX - input.startX,
    indentWidth: input.indentWidth,
    overRatio: computeOverRatio(input.pointerY, hit.rowRect.top, hit.rowRect.height),
  })

  return patch ? appendColumnCleanupPatches(content, [patch]) : null
}

type BlockPointerDragOptions = {
  docRef: MutableRefObject<SduiDocumentContent>
  indentWidth: number
  containerRef: RefObject<HTMLElement>
  /** Single absolutely-positioned indicator element inside the container. */
  indicatorRef: RefObject<HTMLElement>
  applyPatches(patches: SduiDocumentPatch[]): void
  onDragStart(): void
}

/**
 * Native-pointer block drag & drop (replaces dnd-kit).
 *
 * Every block row being a dnd-kit draggable+droppable meant the whole tree
 * re-rendered on drag start/end (dnd-kit's `active` context change bypasses
 * memo). This hook drives the drag from raw PointerEvents instead: the row is
 * hit-tested with elementFromPoint and the projection/indicator/ghost are all
 * painted via direct DOM mutation. No row is a draggable, so nothing re-renders
 * during the gesture; the drop applies one patch batch, which notifies only the
 * affected parent id via the render model.
 */
export function useBlockPointerDrag(options: BlockPointerDragOptions): void {
  const optsRef = useRef(options)
  optsRef.current = options

  useEffect(() => {
    const container = options.containerRef.current
    if (!container) {
      return undefined
    }

    // --- per-session drag state (closure, never React state) ---
    let activeId: string | null = null
    let pointerId: number | null = null
    let startX = 0
    let startY = 0
    let activated = false
    let ghost: HTMLElement | null = null
    let sourceRow: HTMLElement | null = null
    let grabX = 0
    let grabY = 0

    const paint = (projection: DropIndicatorProjection | null) => {
      const overlay = optsRef.current.indicatorRef.current
      if (overlay) {
        positionDropIndicatorOverlay(overlay, container, projection, optsRef.current.indentWidth)
      }
    }

    const hitTest = (x: number, y: number): OverHit | null => {
      const el = document.elementFromPoint(x, y)
      const row = el?.closest<HTMLElement>('[data-block-id]')
      const rowContent = row?.firstElementChild as HTMLElement | null // [data-block-row]
      if (!row || !rowContent || !row.dataset.blockId) {
        return null
      }

      return { overId: row.dataset.blockId, rowRect: rowContent.getBoundingClientRect() }
    }

    const dropInput = (hit: OverHit, x: number, y: number): DropInput => ({
      content: optsRef.current.docRef.current,
      activeId: activeId as string,
      hit,
      pointerX: x,
      pointerY: y,
      startX,
      indentWidth: optsRef.current.indentWidth,
    })

    const createGhost = () => {
      if (!sourceRow) {
        return
      }

      const content = sourceRow.querySelector<HTMLElement>('[data-block-content]')
      const source = content ?? (sourceRow.firstElementChild as HTMLElement | null)
      if (!source) {
        return
      }

      const rect = source.getBoundingClientRect()
      grabX = startX - rect.left
      grabY = startY - rect.top

      ghost = document.createElement('div')
      ghost.setAttribute('data-drag-ghost', '')
      ghost.setAttribute('aria-hidden', 'true')
      Object.assign(ghost.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: `${rect.width}px`,
        opacity: GHOST_OPACITY,
        pointerEvents: 'none',
        zIndex: '1000',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        borderRadius: '4px',
        background: 'var(--sdui-doc-surface, #fff)',
      })
      ghost.appendChild(source.cloneNode(true))
      document.body.appendChild(ghost)
    }

    const moveGhost = (x: number, y: number) => {
      if (ghost) {
        ghost.style.transform = `translate(${x - grabX}px, ${y - grabY}px)`
      }
    }

    const cleanup = () => {
      paint(null)
      if (ghost) {
        ghost.remove()
        ghost = null
      }
      if (sourceRow) {
        sourceRow.style.opacity = ''
        sourceRow = null
      }
      document.body.style.cursor = ''
      activeId = null
      pointerId = null
      activated = false
    }

    // A real drag ends with a trailing click on the handle — swallow it so the
    // block-actions menu does not pop open right after a drop.
    const suppressNextClick = (event: Event) => {
      event.stopPropagation()
      event.preventDefault()
    }

    let detachWindowListeners: () => void

    function onPointerMove(event: PointerEvent) {
      if (event.pointerId !== pointerId || !activeId) {
        return
      }

      if (!activated) {
        if (!hasPassedThreshold(event.clientX - startX, event.clientY - startY)) {
          return
        }

        activated = true
        optsRef.current.onDragStart()
        createGhost()
        if (sourceRow) {
          sourceRow.style.opacity = SOURCE_OPACITY
        }
        document.body.style.cursor = 'grabbing'
      }

      event.preventDefault()
      moveGhost(event.clientX, event.clientY)

      const hit = hitTest(event.clientX, event.clientY)
      if (!hit || hit.overId === activeId) {
        paint(null)

        return
      }

      paint(projectBlockDrop(dropInput(hit, event.clientX, event.clientY)))
    }

    function onPointerUp(event: PointerEvent) {
      if (pointerId !== null && event.pointerId !== pointerId) {
        return
      }

      detachWindowListeners()

      const dropId = activeId
      // pointercancel (or an un-activated release) never drops.
      if (activated && dropId && event.type === 'pointerup') {
        const hit = hitTest(event.clientX, event.clientY)
        if (hit && hit.overId !== dropId) {
          const patches = buildBlockDropPatches(dropInput(hit, event.clientX, event.clientY))
          if (patches && patches.length > 0) {
            optsRef.current.applyPatches(patches)
          }
        }
        window.addEventListener('click', suppressNextClick, { capture: true, once: true })
      }

      cleanup()
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        detachWindowListeners()
        cleanup()
      }
    }

    detachWindowListeners = () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      window.removeEventListener('keydown', onKeyDown)
    }

    function onPointerDown(event: PointerEvent) {
      if (event.button !== 0) {
        return
      }

      const handle = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-drag-handle]')
      const row = handle?.closest<HTMLElement>('[data-block-id]')
      if (!handle || !row || !row.dataset.blockId) {
        return
      }

      activeId = row.dataset.blockId
      sourceRow = row
      pointerId = event.pointerId
      startX = event.clientX
      startY = event.clientY
      activated = false

      // No preventDefault yet: a press that never crosses the threshold stays a
      // plain click (opens the block menu via the handle's onClick).
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
      window.addEventListener('pointercancel', onPointerUp)
      window.addEventListener('keydown', onKeyDown)
    }

    container.addEventListener('pointerdown', onPointerDown)

    return () => {
      container.removeEventListener('pointerdown', onPointerDown)
      detachWindowListeners()
      if (ghost) {
        ghost.remove()
      }
      if (sourceRow) {
        sourceRow.style.opacity = ''
      }
    }
  }, [options.containerRef, options.indentWidth])
}
