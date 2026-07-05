import type { Tokens } from 'marked'

import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiInlineContent, SduiInlineNode } from '../../blocks/schema/inline'
import type { BlockFromMarkdownContext, BlockToMarkdownContext } from '../types'
import { CODE_BLOCK_TYPE } from './code.type'

export function codeToMarkdown(block: SduiDocumentBlock, _ctx: BlockToMarkdownContext): string {
  const language = typeof block.attributes?.language === 'string' ? block.attributes.language : ''
  const text = typeof block.state?.text === 'string' ? block.state.text : ''
  return `\`\`\`${language}\n${text}\n\`\`\``
}

/** Source lines as inline content: text nodes joined by hard_break (PM convention). */
export function codeTextToInlineContent(text: string): SduiInlineContent {
  return text.split('\n').reduce<SduiInlineNode[]>((nodes, line, index) => {
    const withBreak = index > 0 ? [...nodes, { type: 'hard_break' } as const] : nodes
    return line.length > 0 ? [...withBreak, { type: 'text', text: line }] : withBreak
  }, [])
}

export function codeFromMarkdown(token: Tokens.Code, ctx: BlockFromMarkdownContext): SduiDocumentBlock {
  const language = typeof token.lang === 'string' && token.lang.length > 0 ? token.lang : undefined
  return {
    id: ctx.blockId('code'),
    type: CODE_BLOCK_TYPE,
    state: { content: codeTextToInlineContent(token.text), text: token.text },
    ...(language ? { attributes: { language } } : {}),
  }
}
