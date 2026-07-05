import type { Tokens } from 'marked'

import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { BlockFromMarkdownContext, BlockToMarkdownContext } from '../types'
import { HEADING_BLOCK_TYPE } from './heading.type'

const HEADING_MAX_LEVEL = 3

export function headingToMarkdown(block: SduiDocumentBlock, ctx: BlockToMarkdownContext): string {
  const level = block.state?.level
  const depth = level === 2 || level === 3 ? level : 1
  return `${'#'.repeat(depth)} ${ctx.inline(block)}`
}

export function headingFromMarkdown(token: Tokens.Heading, ctx: BlockFromMarkdownContext): SduiDocumentBlock {
  const content = ctx.inline(token.tokens)
  return {
    id: ctx.blockId('heading'),
    type: HEADING_BLOCK_TYPE,
    state: { ...ctx.textState(content), level: Math.min(token.depth, HEADING_MAX_LEVEL) },
  }
}
