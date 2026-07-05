import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiInlineContent } from '../../blocks/schema/inline'
import type { BlockFromMarkdownContext, BlockToMarkdownContext } from '../types'
import { CHECKLIST_BLOCK_TYPE } from './checklist.type'

export function checklistToMarkdown(block: SduiDocumentBlock, ctx: BlockToMarkdownContext): string {
  const marker = block.state?.checked === true ? 'x' : ' '
  return `- [${marker}] ${ctx.inline(block)}`
}

/** Checklist produced from a task list item's inline content + checked state. */
export function checklistFromListItem(
  content: SduiInlineContent,
  checked: boolean,
  ctx: BlockFromMarkdownContext,
  children: SduiDocumentBlock[] = [],
): SduiDocumentBlock {
  return {
    id: ctx.blockId('checklist'),
    type: CHECKLIST_BLOCK_TYPE,
    state: { ...ctx.textState(content), checked },
    ...(children.length > 0 ? { children } : {}),
  }
}
