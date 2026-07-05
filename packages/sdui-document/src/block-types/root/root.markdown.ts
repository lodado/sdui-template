import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { BlockToMarkdownContext } from '../types'

/** Root has no markdown of its own — it is just its children, blank-line separated. */
export function rootToMarkdown(block: SduiDocumentBlock, ctx: BlockToMarkdownContext): string {
  return ctx.renderChildren(block)
}
