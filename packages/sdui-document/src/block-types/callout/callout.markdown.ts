import type { Tokens } from 'marked'

import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { BlockFromMarkdownContext, BlockToMarkdownContext } from '../types'
/** Callout serializes as a blockquote — own text plus nested children, each line `> `-prefixed. */
import { CALLOUT_BLOCK_TYPE } from './callout.type'

export function calloutToMarkdown(block: SduiDocumentBlock, ctx: BlockToMarkdownContext): string {
  const own = ctx.inline(block)
  const children = ctx.renderChildren(block)
  const body = [own, children].filter((part) => part.length > 0).join('\n\n')

  return body
    .split('\n')
    .map((line) => (line.length > 0 ? `> ${line}` : '>'))
    .join('\n')
}

/** Blockquote → callout: hoist a leading paragraph as the callout's own text, rest become children. */
export function calloutFromMarkdown(token: Tokens.Blockquote, ctx: BlockFromMarkdownContext): SduiDocumentBlock {
  const inner = token.tokens.filter((child) => child.type !== 'space')
  const [first, ...others] = inner

  const hoisted = first?.type === 'paragraph' ? (first as Tokens.Paragraph) : undefined
  const content = ctx.inline(hoisted?.tokens ?? [])
  const children = ctx.mapTokens(hoisted ? others : inner)

  return {
    id: ctx.blockId('callout'),
    type: CALLOUT_BLOCK_TYPE,
    state: ctx.textState(content),
    attributes: { tone: 'info' },
    children: children.length > 0 ? children : undefined,
  }
}
