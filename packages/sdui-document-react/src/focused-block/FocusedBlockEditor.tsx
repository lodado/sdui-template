import type { SduiInlineContent } from '@lodado/sdui-document'
import { TextSelection } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React, { useLayoutEffect, useRef } from 'react'

import { createFocusedBlockEditorState, editorStateToInline } from './pm/editorState'
import type { FocusedBlockCallbacks } from './pm/keymapDelegation'

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
 */
export const FocusedBlockEditor = (props: FocusedBlockEditorProps) => {
  // onCommit is intentionally not destructured: it is only reached through
  // latestProps so late prop swaps still land (react/no-unused-prop-types).
  const { content, autoFocus, className } = props
  const containerRef = useRef<HTMLSpanElement>(null)
  const latestProps = useRef(props)
  latestProps.current = props

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) {
      return undefined
    }

    const viewRef: { current: EditorView | undefined } = { current: undefined }
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

    view.focus()

    return () => {
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

  return <span ref={containerRef} className={className} data-testid="focused-block-editor" />
}
