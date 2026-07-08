import type { Tokens } from 'marked'

import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { hoistLeadingParagraph, renderAsBlockquote } from '../shared/blockquote'
import type { BlockFromMarkdownContext, BlockToMarkdownContext } from '../types'
import { CALLOUT_BLOCK_TYPE } from './callout.type'

export function calloutToMarkdown(block: SduiDocumentBlock, ctx: BlockToMarkdownContext): string {
  return renderAsBlockquote(block, ctx)
}

/** Blockquote → callout: hoist a leading paragraph as the callout's own text, rest become children. */
export function calloutFromMarkdown(token: Tokens.Blockquote, ctx: BlockFromMarkdownContext): SduiDocumentBlock {
  const { content, children } = hoistLeadingParagraph(token, ctx)

  return {
    id: ctx.blockId('callout'),
    type: CALLOUT_BLOCK_TYPE,
    state: ctx.textState(content),
    attributes: { tone: 'info' },
    children: children.length > 0 ? children : undefined,
  }
}
