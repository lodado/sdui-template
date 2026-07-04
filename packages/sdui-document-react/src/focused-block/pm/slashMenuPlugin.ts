import type { EditorState } from 'prosemirror-state'
import { Plugin, PluginKey } from 'prosemirror-state'

import type { FocusedBlockCallbacks } from './keymapDelegation'

/** Plugin state: tracks the PM position of the '/' character (before it), or null when no active slash range. */
type SlashMenuState = { slashPos: number | null }

const slashMenuKey = new PluginKey<SlashMenuState>('slashMenu')

/** Regex that matches a slash trigger at the start of the text or after whitespace, at the end of the string. */
const SLASH_TRIGGER_RE = /(?:^|\s)\/([^\s/]*)$/

/**
 * Returns the PM position of the matched '/' character within the text
 * produced by doc.textBetween(textFrom, textTo), converted back to PM space.
 *
 * textFrom: the PM position at which the textBetween call started.
 */
function findSlashPosInText(text: string, textFrom: number, m: RegExpMatchArray): number {
  // m.index is the start of the full match in `text`.
  // If the match starts with whitespace (e.g. " /abc"), skip 1 char to reach '/'.
  const offsetInMatch = m[0][0] === '/' ? 0 : 1
  return textFrom + m.index! + offsetInMatch
}

/**
 * Validate that the slash range is still open:
 *  - doc char at slashPos is '/'
 *  - caret is strictly after slashPos (i.e. ≥ slashPos + 1)
 *  - text between slashPos+1 and caret contains no whitespace
 *  - char immediately before slashPos is either doc-start or whitespace
 */
function isSlashRangeValid(state: EditorState, slashPos: number): boolean {
  const { doc } = state
  const caret = state.selection.from

  if (caret < slashPos + 1) {
    return false
  }

  // Character at slashPos must be '/'
  const charAtSlash = doc.textBetween(slashPos, slashPos + 1)
  if (charAtSlash !== '/') {
    return false
  }

  // No whitespace between '/' and caret
  if (slashPos + 1 < caret) {
    const query = doc.textBetween(slashPos + 1, caret)
    if (/\s/.test(query)) {
      return false
    }
  }

  // Char before slashPos must be doc-start or whitespace
  if (slashPos > 0) {
    const charBefore = doc.textBetween(slashPos - 1, slashPos)
    if (!/^\s$/.test(charBefore)) {
      return false
    }
  }

  return true
}

/**
 * Returns the slash+query range if an active slash menu range exists, or null.
 * from = PM position of the '/' character; to = current cursor position.
 * Task 5 uses this to delete the range on item select.
 */
export function getSlashRange(state: EditorState): { from: number; to: number } | null {
  const pluginState = slashMenuKey.getState(state)
  if (!pluginState || pluginState.slashPos === null) {
    return null
  }
  return { from: pluginState.slashPos, to: state.selection.from }
}

/**
 * ProseMirror plugin that detects a '/' slash trigger and delegates
 * open/query/close callbacks to the block layer.
 *
 * Plugin state: { slashPos: number | null } under PluginKey('slashMenu').
 * Register this plugin BEFORE buildFocusedBlockKeymap so that
 * Arrow/Enter/Escape reach the menu first while it is open.
 */
export function buildSlashMenuPlugin(callbacks: FocusedBlockCallbacks): Plugin {
  return new Plugin<SlashMenuState>({
    key: slashMenuKey,

    state: {
      init: () => ({ slashPos: null }),

      apply(tr, value) {
        let { slashPos } = value

        // Map the stored position through the transaction's mapping.
        if (slashPos !== null) {
          slashPos = tr.mapping.map(slashPos)
        }

        // Re-validate an existing slash range.
        if (slashPos !== null) {
          const caret = tr.selection.from
          const {doc} = tr

          // Bounds guard: slashPos must still be within the document.
          if (slashPos + 1 > doc.content.size) {
            slashPos = null
          } else {
            const charAtSlash = doc.textBetween(slashPos, slashPos + 1)
            const beforeSlash = slashPos > 0 ? doc.textBetween(slashPos - 1, slashPos) : ''
            const query = slashPos + 1 <= caret ? doc.textBetween(slashPos + 1, caret) : ''

            const valid =
              charAtSlash === '/' &&
              caret >= slashPos + 1 &&
              !/\s/.test(query) &&
              (slashPos === 0 || /^\s$/.test(beforeSlash))

            if (!valid) {
              slashPos = null
            }
          }
        }

        // Detect a new slash trigger when no range is currently active.
        if (slashPos === null && tr.docChanged) {
          const caret = tr.selection.from
          const textBefore = tr.doc.textBetween(0, caret)
          const m = SLASH_TRIGGER_RE.exec(textBefore)
          if (m) {
            slashPos = findSlashPosInText(textBefore, 0, m)
          }
        }

        return { slashPos }
      },
    },

    view() {
      let prevSlashPos: number | null = null

      return {
        update(view, prevState) {
          // Suppress all callbacks during IME composition.
          if (view.composing) {
            return
          }

          const currPluginState = slashMenuKey.getState(view.state)
          const currSlashPos = currPluginState?.slashPos ?? null

          if (currSlashPos === prevSlashPos) {
            // Slash range unchanged: check for query change.
            if (currSlashPos !== null) {
              const prevQuery = prevState.doc.textBetween(currSlashPos + 1, prevState.selection.from)
              const currQuery = view.state.doc.textBetween(currSlashPos + 1, view.state.selection.from)
              if (prevQuery !== currQuery) {
                callbacks.onSlashMenuQueryChange(currQuery)
              }
            }
          } else if (currSlashPos !== null && prevSlashPos === null) {
            // null → pos: menu opened.
            let anchor = { left: 0, top: 0, bottom: 0 }
            try {
              const coords = view.coordsAtPos(currSlashPos)
              anchor = { left: coords.left, top: coords.top, bottom: coords.bottom }
            } catch {
              // coordsAtPos may throw in jsdom / SSR — use fallback.
            }
            callbacks.onSlashMenuOpen(anchor)
            // "/query" can arrive in ONE transaction (paste, batched insert) —
            // the open event alone would leave the menu unfiltered.
            const openQuery = view.state.doc.textBetween(currSlashPos + 1, view.state.selection.from)
            if (openQuery !== '') {
              callbacks.onSlashMenuQueryChange(openQuery)
            }
          } else if (currSlashPos === null && prevSlashPos !== null) {
            // pos → null: menu closed.
            callbacks.onSlashMenuClose()
          }

          prevSlashPos = currSlashPos
        },
      }
    },

    props: {
      handleKeyDown(view, event) {
        // Intercept navigation keys only while the slash menu is open.
        if (!callbacks.isSlashMenuOpen()) {
          return false
        }

        const {key} = event
        if (key === 'ArrowUp') return callbacks.onSlashMenuKey('up')
        if (key === 'ArrowDown') return callbacks.onSlashMenuKey('down')
        if (key === 'Enter') return callbacks.onSlashMenuKey('enter')
        if (key === 'Escape') return callbacks.onSlashMenuKey('escape')

        return false
      },
    },
  })
}
