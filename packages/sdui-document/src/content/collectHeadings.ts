import { blockToPlainText, HEADING_BLOCK_TYPE } from '../block-types'
import type { SduiDocumentContent, SduiInlineContent } from '../blocks/schema'
import { inlineContentToPlainText } from './inlineContent'
import { walkDocumentBlocks } from './walkBlocks'

export interface HeadingEntry {
  id: string
  level: number
  text: string
}

/** Ordered heading entries for a table-of-contents block. Pure — no stored state. */
export function collectHeadings(content: SduiDocumentContent): HeadingEntry[] {
  const headings: HeadingEntry[] = []

  walkDocumentBlocks(content, (block) => {
    if (block.type !== HEADING_BLOCK_TYPE) {
      return
    }

    const level = typeof block.attributes?.level === 'number' ? block.attributes.level : 1
    const inline = block.state?.content
    const text =
      blockToPlainText(block) ?? (Array.isArray(inline) ? inlineContentToPlainText(inline as SduiInlineContent) : '')

    headings.push({ id: block.id, level, text })
  })

  return headings
}
