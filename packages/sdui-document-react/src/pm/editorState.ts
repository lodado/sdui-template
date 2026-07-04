import type { SduiInlineContent } from '@lodado/sdui-document'
import { inlineContentToPlainText } from '@lodado/sdui-document'
import { baseKeymap, toggleMark } from 'prosemirror-commands'
import { history, redo, undo } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import { EditorState } from 'prosemirror-state'

import { buildBlockTypeInputRules } from './inputRules'
import type { FocusedBlockCallbacks } from './keymapDelegation'
import { buildFocusedBlockKeymap } from './keymapDelegation'
import { focusedBlockSchema } from './schema'
import { inlineContentToPmDoc, pmDocToInlineContent } from './serialization'

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
      history(),
      keymap({
        'Mod-z': undo,
        'Mod-y': redo,
        'Mod-Shift-z': redo,
        'Mod-b': toggleMark(focusedBlockSchema.marks.bold),
        'Mod-i': toggleMark(focusedBlockSchema.marks.italic),
        'Mod-e': toggleMark(focusedBlockSchema.marks.code),
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
