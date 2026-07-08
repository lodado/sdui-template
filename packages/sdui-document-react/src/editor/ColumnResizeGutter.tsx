import { MIN_COLUMN_RATIO, resizeColumnPair } from '@lodado/sdui-document'
import React from 'react'

import { useEditorRuntime } from './EditorRuntimeContext'
import { useBlockEntry } from './renderModel/useBlockEntry'

/** A column's grow weight from its attributes; absent/invalid = equal-split default. */
export function attributeRatio(attributes: Record<string, unknown> | undefined): number | undefined {
  const ratio = attributes?.ratio
  return typeof ratio === 'number' && Number.isFinite(ratio) && ratio > 0 ? ratio : undefined
}

/** One ArrowLeft/ArrowRight press moves the gutter by this fraction of the pair width. */
export const KEYBOARD_RESIZE_STEP = 0.05

function escapeAttributeValue(value: string): string {
  return value.replace(/["\\]/g, '\\$&')
}

/** Reads a column's current grow weight from its inline style; absent = the equal-split default (1). */
function currentColumnRatio(element: HTMLElement | null): number | undefined {
  const value = element?.style.flexGrow
  if (!value) {
    return undefined
  }
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

/**
 * Draggable/keyboard-operable divider between two sibling columns. Commits a
 * ratio update on pointerup (drag) or per arrow press — the patch pair is one
 * undo step. Pointer travel is measured against the two columns' current
 * rendered widths so a 10% drag is a 10% visual change.
 *
 * While dragging, the two columns' flex-grow is repainted live on every
 * pointermove (inline style, no patch/re-render) using the same clamped math as
 * the commit; the preview is torn down on pointerup or Escape, then the final
 * position is committed as one undo step. Escape cancels without committing.
 *
 * Deliberately a component, not a hook: the drag gesture is imperative
 * pointer-handler code (AbortController + direct DOM writes) with no React
 * state — the only React surface is the two entry subscriptions above.
 */
export const ColumnResizeGutter = ({ leftId, rightId }: { leftId: string; rightId: string }) => {
  const { handlers, renderStore } = useEditorRuntime()
  // subscribe to both columns' entries so a committed resize updates the
  // splitter's ARIA value reactively (ratio lives on each column's attributes)
  const leftRatio = attributeRatio(useBlockEntry(renderStore, leftId)?.attributes) ?? 1
  const rightRatio = attributeRatio(useBlockEntry(renderStore, rightId)?.attributes) ?? 1

  // Left column's share of the pair, as a percentage, for the splitter's ARIA
  // value. The pair total is preserved on resize and each side clamps at
  // MIN_COLUMN_RATIO, so the reachable range is [minPct, 100 - minPct].
  const total = leftRatio + rightRatio
  const leftPct = Math.round((leftRatio / total) * 100)
  const minPct = Math.round((MIN_COLUMN_RATIO / total) * 100)

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- focusable separator IS the resize widget (window-splitter pattern)
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={`Resize columns ${leftId} and ${rightId}`}
      aria-valuenow={leftPct}
      aria-valuemin={minPct}
      aria-valuemax={100 - minPct}
      aria-valuetext={`${leftPct}%`}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- focusable separator IS the resize widget (window-splitter pattern)
      tabIndex={0}
      data-column-resize
      onKeyDown={(event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
          return
        }

        event.preventDefault()
        handlers.resizeColumnPair(
          leftId,
          rightId,
          event.key === 'ArrowRight' ? KEYBOARD_RESIZE_STEP : -KEYBOARD_RESIZE_STEP,
        )
      }}
      onPointerDown={(event) => {
        if (event.button !== 0) {
          return
        }

        // a drag, not a click — keep the gesture out of text selection
        event.preventDefault()
        // preventDefault suppresses the browser's focus-on-mousedown, so without
        // this the gutter never receives focus and a follow-up ArrowLeft/Right
        // (keyboard resize) goes nowhere.
        const gutter = event.currentTarget
        gutter.focus({ preventScroll: true })
        const list = gutter.parentElement
        const leftEl = list?.querySelector<HTMLElement>(`[data-block-id="${escapeAttributeValue(leftId)}"]`) ?? null
        const rightEl = list?.querySelector<HTMLElement>(`[data-block-id="${escapeAttributeValue(rightId)}"]`) ?? null
        const startX = event.clientX
        const pairWidth = (leftEl?.getBoundingClientRect().width ?? 0) + (rightEl?.getBoundingClientRect().width ?? 0)
        const startLeftRatio = currentColumnRatio(leftEl)
        const startRightRatio = currentColumnRatio(rightEl)
        // restore exactly what React had rendered so a cancelled/committed drag leaves no orphan inline style
        const restoreLeft = leftEl?.style.flexGrow ?? ''
        const restoreRight = rightEl?.style.flexGrow ?? ''

        // Live percentage readout that follows the gutter while dragging.
        const tooltip = gutter.ownerDocument.createElement('div')
        tooltip.dataset.resizeTooltip = ''
        gutter.appendChild(tooltip)

        const deltaFractionAt = (clientX: number) => (pairWidth > 0 ? (clientX - startX) / pairWidth : 0)

        const controller = new AbortController()
        const { signal } = controller
        const teardown = () => {
          controller.abort()
          tooltip.remove()
          if (leftEl) leftEl.style.flexGrow = restoreLeft
          if (rightEl) rightEl.style.flexGrow = restoreRight
        }

        window.addEventListener(
          'pointermove',
          (move: PointerEvent) => {
            const delta = deltaFractionAt(move.clientX)
            if (delta === 0) {
              return
            }
            const preview = resizeColumnPair({
              leftRatio: startLeftRatio,
              rightRatio: startRightRatio,
              deltaFraction: delta,
            })
            if (leftEl) leftEl.style.flexGrow = String(preview.leftRatio)
            if (rightEl) rightEl.style.flexGrow = String(preview.rightRatio)
            const previewTotal = preview.leftRatio + preview.rightRatio
            tooltip.textContent = `${Math.round((preview.leftRatio / previewTotal) * 100)}%`
          },
          { signal },
        )
        window.addEventListener(
          'pointerup',
          (up: PointerEvent) => {
            const delta = deltaFractionAt(up.clientX)
            teardown()
            if (delta !== 0) {
              handlers.resizeColumnPair(leftId, rightId, delta)
            }
          },
          { signal },
        )
        window.addEventListener(
          'keydown',
          (key: KeyboardEvent) => {
            if (key.key === 'Escape') {
              teardown()
            }
          },
          { signal },
        )
        // A touch resize is interrupted (scroll steal, incoming call, second
        // finger) by pointercancel, never pointerup — without this the live
        // flex-grow preview and the % tooltip would be stranded. Cancel = revert,
        // same as Escape: no commit.
        window.addEventListener('pointercancel', teardown, { signal })
      }}
    />
  )
}
