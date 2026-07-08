import type { BlockAlign } from '@lodado/sdui-document'
import { toggleMark } from 'prosemirror-commands'
import type { EditorView } from 'prosemirror-view'
import type React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { SelectionSnapshot } from '../selection-toolbar/selectionSnapshot'
import { buildSelectionSnapshot, selectionSnapshotsEqual } from '../selection-toolbar/selectionSnapshot'
import type { SelectionToolbarProps } from '../selection-toolbar/SelectionToolbar'
import { normalizeLinkHref } from './linkHref'
import { focusedBlockSchema } from './pm/schema'

export type UseSelectionSnapshotPublishInput = {
  viewRef: React.MutableRefObject<EditorView | undefined>
  blockAlign?: BlockAlign | null
  onSetAlign?: (align: BlockAlign | null) => void
  turnIntoActiveId?: string | null
  /** Publishes to the editor-level single toolbar; read through a latest ref. */
  onToolbarPropsChange?: (props: SelectionToolbarProps | null) => void
}

export type UseSelectionSnapshotPublishResult = {
  /** Re-read the PM selection into the snapshot (dedup'd setState). */
  refreshSnapshot: () => void
  /** Drop the snapshot (e.g. the selection grew cross-block and is ceded). */
  clearSnapshot: () => void
  /**
   * Toolbar turn-into indirection: the PM mount effect writes the actual
   * implementation (commitNow + delegate) here — the commit-before-setType
   * ordering belongs to the mount lifecycle, not to this hook.
   */
  toolbarTurnIntoRef: React.MutableRefObject<((type: string, attrs?: Record<string, unknown>) => void) | undefined>
}

/**
 * Selection-toolbar publishing for the focused block: derives a selection
 * snapshot from the PM view, assembles SelectionToolbarProps with stable mark
 * callbacks, and publishes them upward (null on unmount).
 *
 * Extracted from FocusedBlockEditor's render body; the PM mount lifecycle
 * (view creation, commitNow, IME guard, retire flag) intentionally stays there.
 */
export function useSelectionSnapshotPublish(
  input: UseSelectionSnapshotPublishInput,
): UseSelectionSnapshotPublishResult {
  const { viewRef, blockAlign, onSetAlign, turnIntoActiveId, onToolbarPropsChange } = input

  const latestPublish = useRef(onToolbarPropsChange)
  latestPublish.current = onToolbarPropsChange

  const [snapshot, setSnapshot] = useState<SelectionSnapshot | null>(null)
  const toolbarTurnIntoRef = useRef<(type: string, attrs?: Record<string, unknown>) => void>()

  const refreshSnapshot = useCallback(() => {
    const view = viewRef.current
    if (!view) {
      return
    }

    const next = buildSelectionSnapshot(view)
    setSnapshot((previous) => {
      // collapsed -> collapsed changes (typing) never affect a hidden toolbar
      if (next.empty && (previous === null || previous.empty)) {
        return previous
      }

      return previous && selectionSnapshotsEqual(previous, next) ? previous : next
    })
    // viewRef is a ref (stable identity) — reading .current at call time is the point
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const clearSnapshot = useCallback(() => setSnapshot(null), [])

  const handleToolbarTurnInto = useCallback((type: string, attrs?: Record<string, unknown>) => {
    toolbarTurnIntoRef.current?.(type, attrs)
  }, [])

  const toggleNamedMark = useCallback((name: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code') => {
    const view = viewRef.current
    if (!view) {
      return
    }

    toggleMark(focusedBlockSchema.marks[name])(view.state, view.dispatch)
    view.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setHighlight = useCallback((color: string | null) => {
    const view = viewRef.current
    if (!view) {
      return
    }

    const { from, to } = view.state.selection
    const markType = focusedBlockSchema.marks.highlight
    const transaction = view.state.tr.removeMark(from, to, markType)
    view.dispatch(color ? transaction.addMark(from, to, markType.create({ color })) : transaction)
    view.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setColor = useCallback((color: string | null) => {
    const view = viewRef.current
    if (!view) {
      return
    }

    const { from, to } = view.state.selection
    const markType = focusedBlockSchema.marks.color
    const transaction = view.state.tr.removeMark(from, to, markType)
    view.dispatch(color ? transaction.addMark(from, to, markType.create({ color })) : transaction)
    view.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setLink = useCallback((href: string | null) => {
    const view = viewRef.current
    if (!view) {
      return
    }

    const { from, to } = view.state.selection
    const markType = focusedBlockSchema.marks.link
    const normalized = href === null ? null : normalizeLinkHref(href)
    const transaction = view.state.tr.removeMark(from, to, markType)
    view.dispatch(normalized ? transaction.addMark(from, to, markType.create({ href: normalized })) : transaction)
    view.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Assembled once per selection change; SelectionToolbar self-gates on an
  // empty snapshot, so an empty snapshot still publishes (the editor decides
  // whether to render). Callbacks are stable, so identity tracks the snapshot.
  const toolbarProps = useMemo<SelectionToolbarProps | null>(
    () =>
      snapshot
        ? {
            snapshot,
            onToggleMark: toggleNamedMark,
            onSetHighlight: setHighlight,
            onSetColor: setColor,
            onSetLink: setLink,
            blockAlign: blockAlign ?? null,
            onSetAlign,
            turnInto:
              turnIntoActiveId !== undefined
                ? { activeId: turnIntoActiveId, onSelect: handleToolbarTurnInto }
                : undefined,
          }
        : null,
    [
      snapshot,
      toggleNamedMark,
      setHighlight,
      setColor,
      setLink,
      blockAlign,
      onSetAlign,
      turnIntoActiveId,
      handleToolbarTurnInto,
    ],
  )

  // Publish to the editor-level single toolbar; clear on unmount so a stale
  // block's props never outlive it.
  useEffect(() => {
    latestPublish.current?.(toolbarProps)
  }, [toolbarProps])
  useEffect(() => () => latestPublish.current?.(null), [])

  return { refreshSnapshot, clearSnapshot, toolbarTurnIntoRef }
}
