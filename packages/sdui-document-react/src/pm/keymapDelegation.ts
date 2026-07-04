import { keymap } from 'prosemirror-keymap'
import type { EditorState, Plugin } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'

/**
 * Boundary events the focused-block editor delegates to the block layer.
 *
 * This is one of the three sanctioned PM <-> block-layer channels
 * (inject on mount / commit on blur / keymap delegation). The editor never
 * mutates block structure itself.
 */
export type FocusedBlockCallbacks = {
  /** Enter — block layer should issue a block.split patch at the offset. */
  onSplit(offset: number): void
  /** Backspace at offset 0 — block layer should issue a block.merge patch. */
  onMergeBackward(): void
  /** Tab — block layer should indent (block.move under previous sibling). */
  onIndent(): void
  /** Shift-Tab — block layer should outdent (block.move to grandparent). */
  onOutdent(): void
  /** Arrow key at the first/last visual line — move focus to a neighbor block. */
  onNavigate(direction: 'up' | 'down', offset: number): void
  /** Markdown input rule matched — block layer should change the block type. */
  onTurnInto(type: string, attrs?: Record<string, unknown>): void
}

function isAtVerticalBoundary(state: EditorState, view: EditorView | undefined, direction: 'up' | 'down'): boolean {
  if (view && typeof view.endOfTextblock === 'function') {
    return view.endOfTextblock(direction)
  }

  // No view (tests / SSR): fall back to absolute doc boundaries.
  return direction === 'up' ? state.selection.from === 0 : state.selection.to === state.doc.content.size
}

/**
 * Keymap plugin that intercepts block-boundary keys and delegates them.
 * Everything else (text input, IME, in-block deletion, marks) stays in PM.
 */
export function buildFocusedBlockKeymap(callbacks: FocusedBlockCallbacks): Plugin {
  return keymap({
    Enter: (state) => {
      callbacks.onSplit(state.selection.from)
      return true
    },
    Backspace: (state) => {
      if (state.selection.empty && state.selection.from === 0) {
        callbacks.onMergeBackward()
        return true
      }

      return false
    },
    Tab: () => {
      callbacks.onIndent()
      return true
    },
    'Shift-Tab': () => {
      callbacks.onOutdent()
      return true
    },
    ArrowUp: (state, _dispatch, view) => {
      if (state.selection.empty && isAtVerticalBoundary(state, view, 'up')) {
        callbacks.onNavigate('up', state.selection.from)
        return true
      }

      return false
    },
    ArrowDown: (state, _dispatch, view) => {
      if (state.selection.empty && isAtVerticalBoundary(state, view, 'down')) {
        callbacks.onNavigate('down', state.selection.from)
        return true
      }

      return false
    },
  })
}
