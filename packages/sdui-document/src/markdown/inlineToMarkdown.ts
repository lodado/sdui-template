import type { SduiInlineContent } from '../blocks/schema/inline'
import { isInlineDateNode, isInlineTextNode } from '../blocks/schema/inline'
import { applyMarkMarkdown } from '../marks'

/**
 * Serialize inline content to markdown. Marks fold outward over the text
 * (innermost mark applied first); `hard_break` becomes a newline; a date node
 * degrades to its display text (lossy — the node identity is not preserved).
 * Marks with no markdown form (underline, highlight) degrade to their inner text.
 */
export function inlineContentToMarkdown(content: SduiInlineContent): string {
  return content
    .map((node) => {
      if (isInlineTextNode(node)) {
        return (node.marks ?? []).reduce((inner, mark) => applyMarkMarkdown(mark, inner), node.text)
      }
      if (isInlineDateNode(node)) {
        return node.display ?? node.iso
      }
      return '\n'
    })
    .join('')
}
