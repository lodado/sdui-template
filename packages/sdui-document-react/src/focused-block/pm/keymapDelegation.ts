import { keymap } from 'prosemirror-keymap'
import type { Command, EditorState, Plugin } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'

import { turnIntoShortcutEntries } from '../../block-types/turnInto'
import { safeHref } from '../../inline/safeHref'
import { focusedBlockSchema } from './schema'

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
  /** Tab / Mod-] — block layer should indent (block.move under previous sibling). */
  onIndent(): void
  /** Shift-Tab / Mod-[ — block layer should outdent (block.move to grandparent). */
  onOutdent(): void
  /** Arrow key at the first/last visual line — move focus to a neighbor block. */
  onNavigate(direction: 'up' | 'down', offset: number): void
  /** Markdown input rule or turn-into shortcut — change the block type. */
  onTurnInto(type: string, attrs?: Record<string, unknown>): void
  /** Escape — exit inline editing into block selection mode. */
  onEscape(): void
  /** Mod-Alt-Arrow — swap the block with its previous/next sibling. */
  onMoveBlock(direction: 'up' | 'down'): void
  /** Mod-Enter — type-specific action (checklist toggle, …) resolved by the block layer. */
  onBlockAction(): void
  /** '/' detected at block start or after whitespace — menu should open. */
  onSlashMenuOpen(anchor: { left: number; top: number; bottom: number }): void
  /** Query text after the '/' changed while the range is still valid. */
  onSlashMenuQueryChange(query: string): void
  /** Slash range destroyed (slash deleted, whitespace typed, caret left). */
  onSlashMenuClose(): void
  /** React owns menu-open state (also true for '+'-opened menus). */
  isSlashMenuOpen(): boolean
  /** Arrow/Enter/Escape routed to the menu while open. true = consumed. */
  onSlashMenuKey(key: 'up' | 'down' | 'enter' | 'escape'): boolean
}

function isAtVerticalBoundary(state: EditorState, view: EditorView | undefined, direction: 'up' | 'down'): boolean {
  if (view && typeof view.endOfTextblock === 'function') {
    return view.endOfTextblock(direction)
  }

  // No view (tests / SSR): fall back to absolute doc boundaries.
  return direction === 'up' ? state.selection.from === 0 : state.selection.to === state.doc.content.size
}

/** href of a link mark at the selection head, if any (scheme-whitelisted). */
function linkHrefAtSelection(state: EditorState): string | null {
  const linkType = focusedBlockSchema.marks.link
  const mark = state.selection.$head
    .marks()
    .concat(state.storedMarks ?? [])
    .find((candidate) => candidate.type === linkType)
  const href = typeof mark?.attrs.href === 'string' ? mark.attrs.href : undefined

  return href ? safeHref(href) ?? null : null
}

/** Turn-into shortcut bindings aggregated from the block-type registry. */
function buildTurnIntoBindings(callbacks: FocusedBlockCallbacks): Record<string, Command> {
  return turnIntoShortcutEntries().reduce<Record<string, Command>>(
    (bindings, entry) => ({
      ...bindings,
      [entry.key]: () => {
        callbacks.onTurnInto(entry.type, entry.attrs)
        return true
      },
    }),
    {},
  )
}

/**
 * Keymap plugin that intercepts block-boundary keys and delegates them.
 * Everything else (text input, IME, in-block deletion, marks) stays in PM.
 *
 * Outline parity notes (app/editor/extensions/Keys.ts, nodes/*):
 * - Mod-]/Mod-[ mirror Tab/Shift-Tab (ListItem/Blockquote indent bindings)
 * - Mod-Alt-ArrowUp/Down move the block among its siblings
 * - Mod-Enter runs the block's contextual action; on a link mark it opens
 *   the link instead (Link.tsx behavior, http/https only via safeHref)
 */
export function buildFocusedBlockKeymap(callbacks: FocusedBlockCallbacks): Plugin {
  return keymap({
    ...buildTurnIntoBindings(callbacks),
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
    'Mod-]': () => {
      callbacks.onIndent()
      return true
    },
    'Mod-[': () => {
      callbacks.onOutdent()
      return true
    },
    'Mod-Alt-ArrowUp': () => {
      callbacks.onMoveBlock('up')
      return true
    },
    'Mod-Alt-ArrowDown': () => {
      callbacks.onMoveBlock('down')
      return true
    },
    'Mod-Enter': (state) => {
      const href = linkHrefAtSelection(state)
      if (href) {
        if (typeof window !== 'undefined') {
          window.open(href, '_blank', 'noopener,noreferrer')
        }
        return true
      }

      callbacks.onBlockAction()
      return true
    },
    Escape: () => {
      callbacks.onEscape()
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
        callbacks.onNavigate('down', state.selection.to)
        return true
      }

      return false
    },
  })
}
