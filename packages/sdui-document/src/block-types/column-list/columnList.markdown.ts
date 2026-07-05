import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { BlockToMarkdownContext } from '../types'

/**
 * Markdown has no column construct — lossy by policy: columns are flattened
 * vertically in column order (left column first), blank-line separated.
 */
export function columnListToMarkdown(block: SduiDocumentBlock, ctx: BlockToMarkdownContext): string {
  return ctx.renderChildren(block)
}
