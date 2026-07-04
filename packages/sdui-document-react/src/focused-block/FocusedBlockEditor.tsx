import type { SduiInlineContent } from '@lodado/sdui-document'
import { toggleMark } from 'prosemirror-commands'
import { TextSelection } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'

import { safeHref } from '../inline/safeHref'
import type { SelectionSnapshot } from '../selection-toolbar/selectionSnapshot'
import { buildSelectionSnapshot, selectionSnapshotsEqual } from '../selection-toolbar/selectionSnapshot'
import { SelectionToolbar } from '../selection-toolbar/SelectionToolbar'
import { createFocusedBlockEditorState, editorStateToInline } from './pm/editorState'
import type { FocusedBlockCallbacks } from './pm/keymapDelegation'
import { focusedBlockSchema } from './pm/schema'

export type FocusedBlockCommit = {
  content: SduiInlineContent
  text: string
}

export type FocusedBlockEditorProps = FocusedBlockCallbacks & {
  /** Inline JSON injected once on mount (channel 1 of 3). */
  content: SduiInlineContent
  /** Caret placement on mount: start / end / explicit offset. */
  autoFocus?: 'start' | 'end' | number
  /** Called on blur, unmount, and before boundary delegation (channel 2 of 3). */
  // eslint-disable-next-line react/no-unused-prop-types -- consumed via latestProps ref
  onCommit(result: FocusedBlockCommit): void
  className?: string
}

function resolveCaretOffset(autoFocus: FocusedBlockEditorProps['autoFocus'], docSize: number): number {
  if (autoFocus === 'start' || autoFocus === undefined) {
    return 0
  }

  if (autoFocus === 'end') {
    return docSize
  }

  return Math.max(0, Math.min(autoFocus, docSize))
}

/** Normalizes toolbar link input: bare domains get https://, unsafe schemes are rejected. */
function normalizeLinkHref(input: string): string | null {
  const candidate = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(input) ? input : `https://${input}`

  return safeHref(candidate) ?? null
}

/**
 * The single ProseMirror instance of the document, mounted only on the
 * focused text block. Unfocused blocks render via InlineContentView.
 *
 * Policies:
 * - mounts once per focus session; `content` changes after mount are ignored
 *   (the editor is the source of truth until commit)
 * - commit fires on blur and unmount, but never mid-composition (IME safety)
 * - structural delegations (split/merge/navigate) commit FIRST so typed text
 *   is never lost, then RETIRE this editor — its content authority is gone,
 *   so later blur/unmount commits are suppressed (they would be stale)
 * - indent/outdent commit first but do not retire (content is unaffected)
 * - block-boundary keys are delegated via FocusedBlockCallbacks (channel 3)
 * - a ranged selection raises the SelectionToolbar (hidden while the mouse
 *   drag is still in progress — Outline's isSelectingText rule); mark edits
 *   are plain PM transactions, persisted through the normal commit channel
 */
export const FocusedBlockEditor = (props: FocusedBlockEditorProps) => {
  // onCommit is intentionally not destructured: it is only reached through
  // latestProps so late prop swaps still land (react/no-unused-prop-types).
  const { content, autoFocus, className } = props
  const containerRef = useRef<HTMLSpanElement>(null)
  const viewRef = useRef<EditorView>()
  const latestProps = useRef(props)
  latestProps.current = props

  const [snapshot, setSnapshot] = useState<SelectionSnapshot | null>(null)
  const [isSelectingText, setIsSelectingText] = useState(false)

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
  }, [])

  const toggleNamedMark = useCallback((name: 'bold' | 'italic' | 'strikethrough' | 'code') => {
    const view = viewRef.current
    if (!view) {
      return
    }

    toggleMark(focusedBlockSchema.marks[name])(view.state, view.dispatch)
    view.focus()
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
  }, [])

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) {
      return undefined
    }

    const retired = { current: false }

    const commitNow = () => {
      if (retired.current || !viewRef.current || viewRef.current.composing) {
        return
      }

      latestProps.current.onCommit(editorStateToInline(viewRef.current.state))
    }

    const callbacks: FocusedBlockCallbacks = {
      onSplit: (offset) => {
        commitNow()
        retired.current = true
        latestProps.current.onSplit(offset)
      },
      onMergeBackward: () => {
        commitNow()
        retired.current = true
        latestProps.current.onMergeBackward()
      },
      onIndent: () => {
        commitNow()
        latestProps.current.onIndent()
      },
      onOutdent: () => {
        commitNow()
        latestProps.current.onOutdent()
      },
      onNavigate: (direction, offset) => {
        commitNow()
        retired.current = true
        latestProps.current.onNavigate(direction, offset)
      },
      // No commit here: the input-rule transaction (prefix deletion) has not
      // been dispatched yet, so committing now would persist the raw "# ".
      onTurnInto: (type, attrs) => latestProps.current.onTurnInto(type, attrs),
      onEscape: () => {
        commitNow()
        retired.current = true
        latestProps.current.onEscape()
      },
    }

    const initialState = createFocusedBlockEditorState(content, callbacks)
    const caret = resolveCaretOffset(autoFocus, initialState.doc.content.size)
    const stateWithCaret = initialState.apply(
      initialState.tr.setSelection(TextSelection.create(initialState.doc, caret)),
    )

    // `mount` makes the span itself the contenteditable root — the editor adds
    // no extra <div>, so the chrome wrapper (<p>/<h1>…) keeps valid nesting.
    const view = new EditorView(
      { mount: container },
      {
        state: stateWithCaret,
        dispatchTransaction: (transaction) => {
          view.updateState(view.state.apply(transaction))
          refreshSnapshot()
        },
        handleDOMEvents: {
          blur: () => {
            commitNow()

            return false
          },
        },
      },
    )
    viewRef.current = view

    // Outline's isSelectingText: hide the toolbar while the mouse is dragging
    // out a selection, show it on release.
    const handleMouseDown = () => setIsSelectingText(true)
    const handleMouseUp = () => {
      setIsSelectingText(false)
      refreshSnapshot()
    }
    container.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    view.focus()

    return () => {
      container.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      const finalCommit = retired.current ? undefined : editorStateToInline(view.state)
      viewRef.current = undefined
      view.destroy()
      if (finalCommit) {
        latestProps.current.onCommit(finalCommit)
      }
    }
    // Mount-once per focus session: content/autoFocus are init-only inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <span ref={containerRef} className={className} data-testid="focused-block-editor" />
      {snapshot && !isSelectingText ? (
        <SelectionToolbar
          snapshot={snapshot}
          onToggleMark={toggleNamedMark}
          onSetHighlight={setHighlight}
          onSetLink={setLink}
        />
      ) : null}
    </>
  )
}
