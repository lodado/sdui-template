import type { Tokens } from 'marked'

import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { hoistLeadingParagraph, renderAsBlockquote } from '../shared/blockquote'
import type { BlockFromMarkdownContext, BlockToMarkdownContext } from '../types'
import { QUOTE_BLOCK_TYPE } from './quote.type'

export function quoteToMarkdown(block: SduiDocumentBlock, ctx: BlockToMarkdownContext): string {
  return renderAsBlockquote(block, ctx)
}

/** Blockquote → quote: hoist a leading paragraph as the quote's own text, rest become children. */
export function quoteFromMarkdown(token: Tokens.Blockquote, ctx: BlockFromMarkdownContext): SduiDocumentBlock {
  const { content, children } = hoistLeadingParagraph(token, ctx)

  return {
    id: ctx.blockId('quote'),
    type: QUOTE_BLOCK_TYPE,
    state: ctx.textState(content),
    ...(children.length > 0 ? { children } : {}),
  }
}
