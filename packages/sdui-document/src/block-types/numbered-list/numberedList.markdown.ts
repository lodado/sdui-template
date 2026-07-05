import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiInlineContent } from '../../blocks/schema/inline'
import { indentListChildren } from '../bulleted-list/bulletedList.markdown'
import type { BlockFromMarkdownContext, BlockToMarkdownContext } from '../types'
import { NUMBERED_LIST_BLOCK_TYPE } from './numberedList.type'

/** Always `1.` — markdown renderers renumber consecutive ordered items. */
export function numberedListToMarkdown(block: SduiDocumentBlock, ctx: BlockToMarkdownContext): string {
  const own = `1. ${ctx.inline(block)}`
  const children = ctx.renderChildren(block)
  return children.length > 0 ? `${own}\n${indentListChildren(children)}` : own
}

/** Numbered item produced from a marked ordered-list item's inline content + nested blocks. */
export function numberedListFromListItem(
  content: SduiInlineContent,
  children: SduiDocumentBlock[],
  ctx: BlockFromMarkdownContext,
): SduiDocumentBlock {
  return {
    id: ctx.blockId('numbered-list'),
    type: NUMBERED_LIST_BLOCK_TYPE,
    state: ctx.textState(content),
    ...(children.length > 0 ? { children } : {}),
  }
}
