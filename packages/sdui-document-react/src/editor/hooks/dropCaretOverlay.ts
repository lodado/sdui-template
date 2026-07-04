/* eslint-disable no-param-reassign -- this module's contract IS mutating the
   overlay element: caret updates run at dragover frequency and must bypass
   React state (same policy as dropIndicatorOverlay). */
import type { DropCaretRect } from '../../inline/domInlineOffsets'

/**
 * Positions the drop-caret overlay (the ProseMirror-style vertical insertion
 * caret shown while dragging text) — via direct DOM mutation, no React state.
 *
 * @param overlay - the caret div (position:absolute inside the container)
 * @param container - the editor root ([data-sdui-document-editor])
 * @param rect - caret rect in viewport coordinates, or null to hide
 */
export function positionDropCaretOverlay(
  overlay: HTMLElement,
  container: HTMLElement,
  rect: DropCaretRect | null,
): void {
  if (!rect) {
    overlay.style.display = 'none'

    return
  }

  const containerRect = container.getBoundingClientRect()

  overlay.style.display = 'block'
  overlay.style.transform = `translate(${rect.left - containerRect.left}px, ${rect.top - containerRect.top}px)`
  overlay.style.height = `${rect.height}px`
}
