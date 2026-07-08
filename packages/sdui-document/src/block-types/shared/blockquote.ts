import type { Tokens } from 'marked'

import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { BlockFromMarkdownContext, BlockToMarkdownContext } from '../types'

/**
 * Shared blockquote serialization for quote- and callout-shaped blocks: own
 * inline text plus nested children, every line `> `-prefixed. Extract point for
 * the next blockquote-like type (the team already shares list-indent logic the
 * same way).
 */
export function renderAsBlockquote(block: SduiDocumentBlock, ctx: BlockToMarkdownContext): string {
  const own = ctx.inline(block)
  const children = ctx.renderChildren(block)
  const body = [own, children].filter((part) => part.length > 0).join('\n\n')

  return body
    .split('\n')
    .map((line) => (line.length > 0 ? `> ${line}` : '>'))
    .join('\n')
}

/**
 * Parse a markdown blockquote into a quote/callout body: hoist a leading
 * paragraph as the block's own inline text, the rest become children.
 */
export function hoistLeadingParagraph(
  token: Tokens.Blockquote,
  ctx: BlockFromMarkdownContext,
): { content: ReturnType<BlockFromMarkdownContext['inline']>; children: SduiDocumentBlock[] } {
  const inner = token.tokens.filter((child) => child.type !== 'space')
  const [first, ...others] = inner

  const hoisted = first?.type === 'paragraph' ? (first as Tokens.Paragraph) : undefined
  const content = ctx.inline(hoisted?.tokens ?? [])
  const children = ctx.mapTokens(hoisted ? others : inner)

  return { content, children }
}
