/* eslint-disable no-param-reassign -- this module's contract IS mutating the
   overlay element: indicator updates run at pointer-move frequency and must
   bypass React state (see Phase 21.2). */
import type { ProjectedNestedBlockDrop } from '@lodado/sdui-document'

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
  projected: ProjectedNestedBlockDrop | null,
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
  const rowDepth = Number(row.dataset.depth ?? '1')
  const indent = (projected.depth - rowDepth) * indentWidth
  // 'before' slots sit above the row; everything else ('after'/'inside') below
  const lineY = projected.position === 'before' ? rowRect.top : rowRect.bottom

  overlay.style.display = 'block'
  overlay.style.transform = `translate(${rowRect.left - containerRect.left + indent}px, ${lineY - containerRect.top}px)`
  overlay.style.width = `${Math.max(rowRect.width - indent, indentWidth)}px`
  overlay.setAttribute('data-drop-position', projected.position)
}
