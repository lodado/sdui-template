/* eslint-disable no-param-reassign -- this module's contract IS mutating the
   overlay element: indicator updates run at pointer-move frequency and must
   bypass React state (see Phase 21.2). */
import type { ProjectedHorizontalBlockDrop, ProjectedNestedBlockDrop } from '@lodado/sdui-document'

/** Either drop mode: vertical slot line (before/inside/after) or column-split edge line (left/right). */
export type DropIndicatorProjection = ProjectedNestedBlockDrop | ProjectedHorizontalBlockDrop

function isHorizontalProjection(projected: DropIndicatorProjection): projected is ProjectedHorizontalBlockDrop {
  return 'side' in projected
}

function escapeAttributeValue(value: string): string {
  return value.replace(/["\\]/g, '\\$&')
}

/**
 * Positions the single drop-indicator overlay element for the current drag
 * projection — via direct DOM mutation, no React state.
 *
 * The indicator changes at pointer-move frequency; routing it through setState
 * would re-render the whole block tree every frame. One absolutely-positioned
 * element updated with transform/width keeps drag frames at zero React work
 * (and stays on compositor-friendly properties).
 *
 * @param overlay - the overlay div (position:absolute inside the container)
 * @param container - the editor root ([data-sdui-document-editor])
 * @param projected - drop projection, or null to hide the indicator
 * @param indentWidth - px per depth level (must match drag projection unit)
 */
export function positionDropIndicatorOverlay(
  overlay: HTMLElement,
  container: HTMLElement,
  projected: DropIndicatorProjection | null,
  indentWidth: number,
): void {
  if (!projected) {
    overlay.style.display = 'none'
    overlay.removeAttribute('data-drop-position')

    return
  }

  const row = container.querySelector<HTMLElement>(`[data-block-id="${escapeAttributeValue(projected.overId)}"]`)
  // the first child is the row content (handle + chrome); nested children follow
  const rowContent = row?.firstElementChild
  if (!row || !rowContent) {
    overlay.style.display = 'none'
    overlay.removeAttribute('data-drop-position')

    return
  }

  const containerRect = container.getBoundingClientRect()
  const rowRect = rowContent.getBoundingClientRect()

  // Horizontal (column split) drops paint a VERTICAL line hugging the row's
  // left or right edge — same overlay element, different geometry.
  if (isHorizontalProjection(projected)) {
    const lineX = projected.side === 'left' ? rowRect.left : rowRect.left + rowRect.width

    overlay.style.display = 'block'
    overlay.style.transform = `translate(${lineX - containerRect.left}px, ${rowRect.top - containerRect.top}px)`
    overlay.style.width = '2px'
    overlay.style.height = `${rowRect.height}px`
    overlay.setAttribute('data-drop-position', projected.side)

    return
  }

  const rowDepth = Number(row.dataset.depth ?? '1')
  const indent = (projected.depth - rowDepth) * indentWidth
  // 'before' slots sit above the row; everything else ('after'/'inside') below
  const lineY = projected.position === 'before' ? rowRect.top : rowRect.bottom

  overlay.style.display = 'block'
  overlay.style.transform = `translate(${rowRect.left - containerRect.left + indent}px, ${lineY - containerRect.top}px)`
  overlay.style.width = `${Math.max(rowRect.width - indent, indentWidth)}px`
  // reset any horizontal-mode geometry back to the 2px slot line
  overlay.style.height = '2px'
  overlay.setAttribute('data-drop-position', projected.position)
}
