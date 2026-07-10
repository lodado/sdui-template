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
import { appendMultiBlockMovePatches } from './multiBlockMove'

/** Pointer travel (px) before a mouse/pen press becomes a drag — below this it stays a click. */
export const ACTIVATION_DISTANCE = 4
/** Touch travel (px) before a press becomes a drag — wider than mouse to tolerate finger jitter on a tap. */
export const TOUCH_ACTIVATION_DISTANCE = 10
/** Hold (ms) on the handle before a stationary touch becomes a drag (long-press to drag). */
export const TOUCH_LONG_PRESS_MS = 220
/** Distance (px) from a scroll edge at which a live drag starts auto-scrolling. */
export const AUTOSCROLL_EDGE_BAND = 48
/** Peak auto-scroll speed (px/frame) at the very edge of the band. */
export const AUTOSCROLL_MAX_SPEED = 14
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
 * Auto-scroll speed for a pointer near a scroll edge (pure ramp math).
 * Inside the top/bottom `band` the speed ramps linearly with depth, peaking at
 * `maxSpeed` px/frame at the very edge; `Math.ceil` keeps a minimum of 1px so
 * the scroll never stalls just inside the band. Negative = scroll up.
 *
 * @returns 0 when the pointer is outside both edge bands.
 */
export function computeAutoScrollDelta(
  pointerY: number,
  top: number,
  bottom: number,
  band: number = AUTOSCROLL_EDGE_BAND,
  maxSpeed: number = AUTOSCROLL_MAX_SPEED,
): number {
  if (pointerY < top + band) {
    return -Math.ceil(((top + band - pointerY) / band) * maxSpeed)
  }
  if (pointerY > bottom - band) {
    return Math.ceil(((pointerY - (bottom - band)) / band) * maxSpeed)
  }

  return 0
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
  /** Current block-selection ids — a drag on a selected block moves them all. */
  getSelectedIds?(): string[]
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
    let pointerType = 'mouse'
    let startX = 0
    let startY = 0
    let lastX = 0
    let lastY = 0
    let activated = false
    let ghost: HTMLElement | null = null
    let sourceRow: HTMLElement | null = null
    let grabX = 0
    let grabY = 0
    // touch long-press timer (window handle); autoscroll rAF handle
    let longPressTimer: ReturnType<typeof setTimeout> | null = null
    let autoScrollRaf: number | null = null

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

    const clearLongPress = () => {
      if (longPressTimer !== null) {
        clearTimeout(longPressTimer)
        longPressTimer = null
      }
    }

    // Nearest scrollable ancestor of the editor; falls back to the viewport.
    const findScrollParent = (el: HTMLElement | null): HTMLElement | null => {
      let node = el?.parentElement ?? null
      while (node) {
        const { overflowY } = getComputedStyle(node)
        if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight) {
          return node
        }
        node = node.parentElement
      }

      return null
    }

    // While a drag is live, nudge the page when the pointer sits near a scroll
    // edge — mobile viewports are short, so without this a drop target below the
    // fold is unreachable. Speed ramps with how deep into the edge band we are.
    const startAutoScroll = () => {
      if (typeof requestAnimationFrame !== 'function' || autoScrollRaf !== null) {
        return
      }

      const scroller = findScrollParent(container)
      const tick = () => {
        autoScrollRaf = null
        if (!activated) {
          return
        }

        const top = scroller ? scroller.getBoundingClientRect().top : 0
        const bottom = scroller ? scroller.getBoundingClientRect().bottom : window.innerHeight
        const dy = computeAutoScrollDelta(lastY, top, bottom)

        if (dy !== 0) {
          if (scroller) {
            scroller.scrollTop += dy
          } else {
            window.scrollBy(0, dy)
          }
          // the drop projection is stale after a scroll — re-hit-test at the last point
          const hit = hitTest(lastX, lastY)
          paint(hit && hit.overId !== activeId ? projectBlockDrop(dropInput(hit, lastX, lastY)) : null)
        }

        autoScrollRaf = requestAnimationFrame(tick)
      }

      autoScrollRaf = requestAnimationFrame(tick)
    }

    const stopAutoScroll = () => {
      if (autoScrollRaf !== null) {
        cancelAnimationFrame(autoScrollRaf)
        autoScrollRaf = null
      }
    }

    // Promote the live press to a real drag: ghost, dimmed source, autoscroll.
    // Reached from a mouse/pen threshold cross, a touch threshold cross, or the
    // touch long-press timer.
    const activate = () => {
      if (activated || !activeId) {
        return
      }

      clearLongPress()
      activated = true
      optsRef.current.onDragStart()
      createGhost()
      if (sourceRow) {
        sourceRow.style.opacity = SOURCE_OPACITY
      }
      document.body.style.cursor = 'grabbing'
      moveGhost(lastX, lastY)
      startAutoScroll()
    }

    const cleanup = () => {
      clearLongPress()
      stopAutoScroll()
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

      lastX = event.clientX
      lastY = event.clientY

      if (!activated) {
        const threshold = pointerType === 'touch' ? TOUCH_ACTIVATION_DISTANCE : ACTIVATION_DISTANCE
        if (!hasPassedThreshold(event.clientX - startX, event.clientY - startY, threshold)) {
          return
        }

        activate()
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
          const base = buildBlockDropPatches(dropInput(hit, event.clientX, event.clientY))
          if (base && base.length > 0) {
            // A drag that starts on a selected block moves the whole selection.
            const selectedIds = optsRef.current.getSelectedIds?.() ?? []
            const patches = appendMultiBlockMovePatches(base, dropId, selectedIds, optsRef.current.docRef.current)
            optsRef.current.applyPatches(patches)
          }
        }
        // Mouse fires a synchronous trailing click, caught by this once-listener
        // in the same task. Touch fires none, so a task later we disarm the
        // listener — otherwise it would swallow the user's next unrelated tap.
        window.addEventListener('click', suppressNextClick, { capture: true, once: true })
        setTimeout(() => window.removeEventListener('click', suppressNextClick, { capture: true }), 0)
      }

      cleanup()
    }

    // A live handle press must not surface a context menu: on touch the browser
    // fires `contextmenu` on long-press, which would interrupt the drag and pop
    // the block-actions menu. Suppressing in the capture phase also stops it from
    // reaching BlockNode. Mouse right-clicks never set a session (button !== 0),
    // so those still open the menu.
    function onContextMenu(event: MouseEvent) {
      if (activeId) {
        event.preventDefault()
        event.stopPropagation()
      }
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
      window.removeEventListener('contextmenu', onContextMenu, { capture: true })
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
      pointerType = event.pointerType || 'mouse'
      startX = event.clientX
      startY = event.clientY
      lastX = event.clientX
      lastY = event.clientY
      activated = false

      // Touch can't disambiguate tap-to-open-menu from press-to-drag by movement
      // alone (a finger jitters), so a stationary hold promotes to a drag.
      if (pointerType === 'touch') {
        clearLongPress()
        longPressTimer = setTimeout(activate, TOUCH_LONG_PRESS_MS)
      }

      // No preventDefault yet: a press that never crosses the threshold stays a
      // plain click (opens the block menu via the handle's onClick).
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
      window.addEventListener('pointercancel', onPointerUp)
      window.addEventListener('keydown', onKeyDown)
      window.addEventListener('contextmenu', onContextMenu, { capture: true })
    }

    container.addEventListener('pointerdown', onPointerDown)

    return () => {
      container.removeEventListener('pointerdown', onPointerDown)
      detachWindowListeners()
      clearLongPress()
      stopAutoScroll()
      if (ghost) {
        ghost.remove()
      }
      if (sourceRow) {
        sourceRow.style.opacity = ''
      }
    }
  }, [options.containerRef, options.indentWidth])
}
