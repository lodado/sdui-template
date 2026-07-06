import type { SduiDocumentContent } from '../blocks/schema'
import { extractPlainText } from './plainText'
import { walkDocumentBlocks } from './walkBlocks'

export type DocumentStats = { words: number; chars: number; blocks: number }

const ROOT_BLOCK_TYPE = 'document.root'

/**
 * Pure document metrics for status/footer UI. `walkDocumentBlocks` visits the
 * root block, so it is excluded from the block count; `chars` is the length of
 * the derived plain text, `words` its whitespace-delimited token count.
 */
export function documentStats(content: SduiDocumentContent): DocumentStats {
  const text = extractPlainText(content)
  const trimmed = text.trim()
  const words = trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length

  let blocks = 0
  walkDocumentBlocks(content, (block) => {
    if (block.type !== ROOT_BLOCK_TYPE) {
      blocks += 1
    }
  })

  return { words, chars: text.length, blocks }
}
