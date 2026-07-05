import { blockToPlainText } from '../block-types'
import type { SduiDocumentBlock, SduiDocumentContent, SduiInlineContent } from '../blocks/schema'
import { inlineContentToPlainText } from './inlineContent'
import { walkDocumentBlocks } from './walkBlocks'

/**
 * Generic searchable text: `state.text` (derived plain text) wins, else derive
 * from `state.content` inline nodes. Used when a block module has no override.
 */
function genericPlainText(block: SduiDocumentBlock): string {
  const text = block.state?.text
  if (typeof text === 'string' && text.length > 0) {
    return text
  }

  const inline = block.state?.content
  if (Array.isArray(inline)) {
    return inlineContentToPlainText(inline as SduiInlineContent)
  }

  return ''
}

/**
 * Extracts searchable plain text from every block in the document. A block may
 * override its searchable text via `module.toPlainText` (per-block capability);
 * otherwise the generic `state.text` / derived-content rule applies.
 */
export function extractPlainText(content: SduiDocumentContent): string {
  const lines: string[] = []

  walkDocumentBlocks(content, (block) => {
    const line = blockToPlainText(block) ?? genericPlainText(block)
    if (line.length > 0) {
      lines.push(line)
    }
  })

  return lines.join('\n')
}
