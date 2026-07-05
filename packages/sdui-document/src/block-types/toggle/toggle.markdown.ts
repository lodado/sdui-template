import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { indentListChildren } from '../bulleted-list/bulletedList.markdown'
import type { BlockToMarkdownContext } from '../types'

/** Markdown has no toggle — degrade to a bulleted item (matches Notion's export). */
export function toggleToMarkdown(block: SduiDocumentBlock, ctx: BlockToMarkdownContext): string {
  const own = `- ${ctx.inline(block)}`
  const children = ctx.renderChildren(block)
  return children.length > 0 ? `${own}\n${indentListChildren(children)}` : own
}
