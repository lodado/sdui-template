import type { SduiInlineContent } from '@lodado/sdui-document'
import { inlineContentToPlainText } from '@lodado/sdui-document'
import { baseKeymap } from 'prosemirror-commands'
import { history, redo, undo } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import type { Command } from 'prosemirror-state'
import { EditorState } from 'prosemirror-state'

import { MARK_DEFINITIONS } from '../../marks'
import { buildBlockTypeInputRules, buildMarkInputRules } from './inputRules'
import type { FocusedBlockCallbacks } from './keymapDelegation'
import { buildFocusedBlockKeymap } from './keymapDelegation'
import { focusedBlockSchema } from './schema'
import { inlineContentToPmDoc, pmDocToInlineContent } from './serialization'

/** Mark shortcuts aggregated from the mark registry (Outline bindings). */
function buildMarkKeymap(): Record<string, Command> {
  return MARK_DEFINITIONS.reduce<Record<string, Command>>(
    (keys, definition) =>
      definition.keys ? { ...keys, ...definition.keys(focusedBlockSchema.marks[definition.name]) } : keys,
    {},
  )
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
): EditorState {
  return EditorState.create({
    doc: inlineContentToPmDoc(content),
    plugins: [
      buildFocusedBlockKeymap(callbacks),
      buildBlockTypeInputRules(callbacks),
      buildMarkInputRules(),
      history(),
      keymap({
        'Mod-z': undo,
        'Mod-y': redo,
        'Mod-Shift-z': redo,
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
