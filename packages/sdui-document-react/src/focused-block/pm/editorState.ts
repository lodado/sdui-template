import type { SduiInlineContent } from '@lodado/sdui-document'
import { inlineContentToPlainText } from '@lodado/sdui-document'
import { baseKeymap, chainCommands } from 'prosemirror-commands'
import { history, redo, undo } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import type { Command } from 'prosemirror-state'
import { EditorState } from 'prosemirror-state'

import { MARK_DEFINITIONS } from '../../marks'
import { buildDateInputRules } from './dateInputRules'
import { buildBlockTypeInputRules, buildMarkInputRules } from './inputRules'
import type { FocusedBlockCallbacks, FocusedBlockKeymapOptions } from './keymapDelegation'
import { buildFocusedBlockKeymap } from './keymapDelegation'
import { focusedBlockSchema } from './schema'
import { inlineContentToPmDoc, pmDocToInlineContent } from './serialization'
import { buildSlashMenuPlugin } from './slashMenuPlugin'

/** Mark shortcuts aggregated from the mark registry (Outline bindings). */
function buildMarkKeymap(): Record<string, Command> {
  return MARK_DEFINITIONS.reduce<Record<string, Command>>(
    (keys, definition) =>
      definition.keys ? { ...keys, ...definition.keys(focusedBlockSchema.marks[definition.name]) } : keys,
    {},
  )
}

/** Shift-Enter — hard break inside the block (Outline nodes/HardBreak.ts). */
const insertHardBreak: Command = (state, dispatch) => {
  dispatch?.(state.tr.replaceSelectionWith(focusedBlockSchema.nodes.hard_break.create()).scrollIntoView())

  return true
}

/**
 * Creates the editor state for one focused block.
 *
 * Policies:
 * - the delegation keymap is registered FIRST so block-boundary keys
 *   (Enter/Backspace-at-start/Tab/Arrow-boundary) never reach baseKeymap
 * - history is per focus session; the block layer flattens it into patches
 */
export function createFocusedBlockEditorState(
  content: SduiInlineContent,
  callbacks: FocusedBlockCallbacks,
  options: FocusedBlockKeymapOptions = {},
): EditorState {
  return EditorState.create({
    doc: inlineContentToPmDoc(content),
    plugins: [
      buildSlashMenuPlugin(callbacks),
      buildFocusedBlockKeymap(callbacks, options),
      buildBlockTypeInputRules(callbacks),
      buildMarkInputRules(),
      buildDateInputRules(),
      history(),
      keymap({
        // Two-tier history: PM's inline undo/redo runs first; when it has
        // nothing (returns false) the chain delegates to the block-level
        // stack. This must be an explicit fallback, not a bubble — PM always
        // preventDefaults Mod-Z/Y (suppressing the browser's native
        // contentEditable undo), so the block layer can never detect an
        // "unhandled" key via defaultPrevented while a block is focused.
        'Mod-z': chainCommands(undo, () => {
          callbacks.onHistory('undo')
          return true
        }),
        'Mod-y': chainCommands(redo, () => {
          callbacks.onHistory('redo')
          return true
        }),
        'Mod-Shift-z': chainCommands(redo, () => {
          callbacks.onHistory('redo')
          return true
        }),
        'Shift-Enter': insertHardBreak,
        ...buildMarkKeymap(),
      }),
      keymap(baseKeymap),
    ],
  })
}

/**
 * Serializes editor state to the block commit payload
 * (`state.content` rich JSON + derived `state.text`).
 */
export function editorStateToInline(state: EditorState): { content: SduiInlineContent; text: string } {
  const content = pmDocToInlineContent(state.doc)

  return { content, text: inlineContentToPlainText(content) }
}
