import { Schema } from 'prosemirror-model'

import { MARK_DEFINITIONS } from '../../marks'

/**
 * Inline-only ProseMirror schema for the focused-block editor.
 *
 * Policies:
 * - the doc itself is the textblock (`content: 'inline*'`) — the editor never
 *   knows about block structure; block semantics live in @lodado/sdui-document
 * - node/mark names match SduiInlineNode/SduiInlineMark 1:1 (no mapping layer)
 * - offsets are interchangeable with sdui inline offsets (hard_break = 1)
 * - mark specs come from the mark registry (src/marks/<name>/) — registry
 *   order is the schema mark order
 */
export const focusedBlockSchema = new Schema({
  nodes: {
    doc: { content: 'inline*' },
    text: { group: 'inline' },
    hard_break: {
      inline: true,
      group: 'inline',
      selectable: false,
      leafText: () => '\n',
      parseDOM: [{ tag: 'br' }],
      toDOM: () => ['br'],
    },
  },
  marks: Object.fromEntries(MARK_DEFINITIONS.map((definition) => [definition.name, definition.spec])),
})
