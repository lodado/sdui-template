import type { SduiInlineContent, SduiInlineMark, SduiInlineNode } from '@lodado/sdui-document'
import type { Mark, Node as PmNode } from 'prosemirror-model'

import { focusedBlockSchema } from './schema'

function toPmMark(mark: SduiInlineMark): Mark {
  if (mark.type === 'link') {
    return focusedBlockSchema.marks.link.create({ href: mark.attrs.href })
  }

  return focusedBlockSchema.marks[mark.type].create()
}

function toSduiMark(mark: Mark): SduiInlineMark {
  if (mark.type.name === 'link') {
    return { type: 'link', attrs: { href: String(mark.attrs.href) } }
  }

  return { type: mark.type.name as 'bold' | 'italic' | 'code' }
}

/**
 * Builds a ProseMirror doc from sdui inline content.
 *
 * @returns a doc whose content size equals `getInlineContentLength(content)`
 */
export function inlineContentToPmDoc(content: SduiInlineContent): PmNode {
  const nodes = content.map((node) =>
    node.type === 'text'
      ? focusedBlockSchema.text(node.text, (node.marks ?? []).map(toPmMark))
      : focusedBlockSchema.nodes.hard_break.create(),
  )

  return focusedBlockSchema.nodes.doc.create(null, nodes)
}

/**
 * Serializes a ProseMirror doc back to sdui inline content.
 * Unknown node types are dropped defensively (schema forbids them anyway).
 */
export function pmDocToInlineContent(doc: PmNode): SduiInlineContent {
  return Array.from({ length: doc.childCount }, (_, childIndex) => doc.child(childIndex)).reduce<SduiInlineNode[]>(
    (content, child) => {
      if (child.isText) {
        const textNode: SduiInlineNode = { type: 'text', text: child.text ?? '' }
        if (child.marks.length > 0) {
          return [...content, { ...textNode, marks: child.marks.map(toSduiMark) }]
        }

        return [...content, textNode]
      }

      if (child.type.name === 'hard_break') {
        return [...content, { type: 'hard_break' }]
      }

      return content
    },
    [],
  )
}
