import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { BlockFromMarkdownContext } from '../types'
import { DIVIDER_BLOCK_TYPE } from './divider.type'

export function dividerToMarkdown(): string {
  return '---'
}

export function dividerFromMarkdown(ctx: BlockFromMarkdownContext): SduiDocumentBlock {
  return { id: ctx.blockId('divider'), type: DIVIDER_BLOCK_TYPE }
}
