import type { SduiDocumentContent, SduiInlineContent } from '../blocks/schema'
import { inlineContentToPlainText } from './inlineContent'
import { walkDocumentBlocks } from './walkBlocks'

/**
 * Extracts searchable plain text from every block in the document.
 *
 * Policies:
 * - `state.text` (derived plain text) wins when present
 * - falls back to deriving from `state.content` inline nodes
 */
export function extractPlainText(content: SduiDocumentContent): string {
  const lines: string[] = []

  walkDocumentBlocks(content, (block) => {
    const text = block.state?.text
    if (typeof text === 'string' && text.length > 0) {
      lines.push(text)
      return
    }

    const inline = block.state?.content
    if (Array.isArray(inline)) {
      const derived = inlineContentToPlainText(inline as SduiInlineContent)
      if (derived.length > 0) {
        lines.push(derived)
      }
    }
  })

  return lines.join('\n')
}
