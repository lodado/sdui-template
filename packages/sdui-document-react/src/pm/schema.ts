import { Schema } from 'prosemirror-model'

/**
 * Inline-only ProseMirror schema for the focused-block editor.
 *
 * Policies:
 * - the doc itself is the textblock (`content: 'inline*'`) — the editor never
 *   knows about block structure; block semantics live in @lodado/sdui-document
 * - node/mark names match SduiInlineNode/SduiInlineMark 1:1 (no mapping layer)
 * - offsets are interchangeable with sdui inline offsets (hard_break = 1)
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
  marks: {
    bold: {
      parseDOM: [{ tag: 'strong' }, { tag: 'b' }],
      toDOM: () => ['strong', 0],
    },
    italic: {
      parseDOM: [{ tag: 'em' }, { tag: 'i' }],
      toDOM: () => ['em', 0],
    },
    code: {
      parseDOM: [{ tag: 'code' }],
      toDOM: () => ['code', 0],
    },
    link: {
      attrs: { href: {} },
      inclusive: false,
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs: (dom) => ({ href: (dom as HTMLElement).getAttribute('href') }),
        },
      ],
      toDOM: (mark) => ['a', { href: String(mark.attrs.href) }, 0],
    },
  },
})
