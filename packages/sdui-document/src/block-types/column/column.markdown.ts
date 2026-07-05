import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { BlockToMarkdownContext } from '../types'

/** A column has no markdown of its own — it is just its children, blank-line separated. */
export function columnToMarkdown(block: SduiDocumentBlock, ctx: BlockToMarkdownContext): string {
  return ctx.renderChildren(block)
}
