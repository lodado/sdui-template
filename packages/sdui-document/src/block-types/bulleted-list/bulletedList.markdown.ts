import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiInlineContent } from '../../blocks/schema/inline'
import type { BlockFromMarkdownContext, BlockToMarkdownContext } from '../types'
import { BULLETED_LIST_BLOCK_TYPE } from './bulletedList.type'

/** Indent nested list markdown by two spaces so marked re-parses it as a sub-list. */
export function indentListChildren(children: string): string {
  return children
    .split('\n')
    .map((line) => (line.length > 0 ? `  ${line}` : line))
    .join('\n')
}

export function bulletedListToMarkdown(block: SduiDocumentBlock, ctx: BlockToMarkdownContext): string {
  const own = `- ${ctx.inline(block)}`
  const children = ctx.renderChildren(block)
  return children.length > 0 ? `${own}\n${indentListChildren(children)}` : own
}

/** Bulleted item produced from a marked list item's inline content + nested blocks. */
export function bulletedListFromListItem(
  content: SduiInlineContent,
  children: SduiDocumentBlock[],
  ctx: BlockFromMarkdownContext,
): SduiDocumentBlock {
  return {
    id: ctx.blockId('bulleted-list'),
    type: BULLETED_LIST_BLOCK_TYPE,
    state: ctx.textState(content),
    ...(children.length > 0 ? { children } : {}),
  }
}
