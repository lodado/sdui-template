import type { SduiInlineContent } from '@lodado/sdui-document'
import { TextSelection } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React, { useLayoutEffect, useRef } from 'react'

import { createFocusedBlockEditorState, editorStateToInline } from '../pm/editorState'
import type { FocusedBlockCallbacks } from '../pm/keymapDelegation'

export type FocusedBlockCommit = {
  content: SduiInlineContent
  text: string
}

export type FocusedBlockEditorProps = FocusedBlockCallbacks & {
  /** Inline JSON injected once on mount (channel 1 of 3). */
  content: SduiInlineContent
  /** Caret placement on mount: start / end / explicit offset. */
  autoFocus?: 'start' | 'end' | number
  /** Called on blur and unmount with the committed inline state (channel 2 of 3). */
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
 * - commit fires on blur and unmount, but never mid-composition (IME safety);
 *   an unmount during composition still commits as a last resort
 * - block-boundary keys are delegated via FocusedBlockCallbacks (channel 3)
 */
export const FocusedBlockEditor = (props: FocusedBlockEditorProps) => {
  const { content, autoFocus, onCommit, className } = props
  const containerRef = useRef<HTMLDivElement>(null)
  const latestProps = useRef(props)
  latestProps.current = props

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) {
      return undefined
    }

    const callbacks: FocusedBlockCallbacks = {
      onSplit: (offset) => latestProps.current.onSplit(offset),
      onMergeBackward: () => latestProps.current.onMergeBackward(),
      onIndent: () => latestProps.current.onIndent(),
      onOutdent: () => latestProps.current.onOutdent(),
      onNavigate: (direction, offset) => latestProps.current.onNavigate(direction, offset),
      onTurnInto: (type, attrs) => latestProps.current.onTurnInto(type, attrs),
    }

    const initialState = createFocusedBlockEditorState(content, callbacks)
    const caret = resolveCaretOffset(autoFocus, initialState.doc.content.size)
    const stateWithCaret = initialState.apply(
      initialState.tr.setSelection(TextSelection.create(initialState.doc, caret)),
    )

    const view = new EditorView(container, {
      state: stateWithCaret,
      dispatchTransaction: (transaction) => {
        view.updateState(view.state.apply(transaction))
      },
      handleDOMEvents: {
        blur: (blurredView) => {
          if (!blurredView.composing) {
            latestProps.current.onCommit(editorStateToInline(blurredView.state))
          }

          return false
        },
      },
    })

    view.focus()

    return () => {
      const commit = editorStateToInline(view.state)
      view.destroy()
      latestProps.current.onCommit(commit)
    }
    // Mount-once per focus session: content/autoFocus are init-only inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={containerRef} className={className} data-testid="focused-block-editor" />
}
