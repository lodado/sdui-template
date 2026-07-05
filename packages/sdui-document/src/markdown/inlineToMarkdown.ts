import type { SduiInlineContent } from '../blocks/schema/inline'
import { applyMarkMarkdown } from '../marks'

/**
 * Serialize inline content to markdown. Marks fold outward over the text
 * (innermost mark applied first); `hard_break` becomes a newline. Marks with
 * no markdown form (underline, highlight) degrade to their inner text.
 */
export function inlineContentToMarkdown(content: SduiInlineContent): string {
  return content
    .map((node) => {
      if (node.type === 'hard_break') {
        return '\n'
      }
      return (node.marks ?? []).reduce((inner, mark) => applyMarkMarkdown(mark, inner), node.text)
    })
    .join('')
}
