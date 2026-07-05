import type { Tokens } from 'marked'

import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { BlockFromMarkdownContext } from '../types'
import { IMAGE_BLOCK_TYPE } from './image.type'

export function imageToMarkdown(block: SduiDocumentBlock): string {
  const alt = (typeof block.state?.text === 'string' && block.state.text) || String(block.attributes?.alt ?? '')
  const src = String(block.attributes?.src ?? '')
  return `![${alt}](${src})`
}

export function imageFromMarkdown(token: Tokens.Image, ctx: BlockFromMarkdownContext): SduiDocumentBlock {
  return {
    id: ctx.blockId('image'),
    type: IMAGE_BLOCK_TYPE,
    state: { text: token.text },
    attributes: { src: token.href, alt: token.text },
  }
}
