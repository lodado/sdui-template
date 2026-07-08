import type { Token, Tokens } from 'marked'

import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiInlineContent } from '../../blocks/schema/inline'
import { UnsupportedMarkdownError } from '../../markdown/errors/UnsupportedMarkdownError'
import { imageFromMarkdown } from '../image/image.markdown'
import type { BlockFromMarkdownContext, BlockToMarkdownContext } from '../types'
import { PARAGRAPH_BLOCK_TYPE } from './paragraph.type'

/** Also the markdown fallback for unknown block types (matches the mapping fallback). */
export function paragraphToMarkdown(block: SduiDocumentBlock, ctx: BlockToMarkdownContext): string {
  return ctx.inline(block)
}

export function paragraphFromMarkdown(token: Tokens.Paragraph, ctx: BlockFromMarkdownContext): SduiDocumentBlock {
  const [only] = token.tokens
  // a lone image is a block-level image, not a paragraph — delegate to the image module
  if (token.tokens.length === 1 && only.type === 'image') {
    return imageFromMarkdown(only as Tokens.Image, ctx)
  }

  return {
    id: ctx.blockId('paragraph'),
    type: PARAGRAPH_BLOCK_TYPE,
    state: ctx.textState(ctx.inline(token.tokens)),
  }
}

/** Fenced code has no dedicated block type yet — degrade to a code-marked paragraph. */
export function paragraphFromCode(token: Tokens.Code, ctx: BlockFromMarkdownContext): SduiDocumentBlock {
  const content = token.text.split('\n').reduce<SduiInlineContent>((nodes, line, lineIndex) => {
    const withBreak: SduiInlineContent = lineIndex > 0 ? [...nodes, { type: 'hard_break' }] : nodes
    if (line.length === 0) {
      return withBreak
    }
    return [...withBreak, { type: 'text', text: line, marks: [{ type: 'code' }] }]
  }, [])

  return { id: ctx.blockId('paragraph'), type: PARAGRAPH_BLOCK_TYPE, state: ctx.textState(content) }
}

/** Paragraph produced from a plain (non-task) list item's inline content. */
export function paragraphFromListItemContent(
  content: SduiInlineContent,
  ctx: BlockFromMarkdownContext,
): SduiDocumentBlock {
  return { id: ctx.blockId('paragraph'), type: PARAGRAPH_BLOCK_TYPE, state: ctx.textState(content) }
}

/** Last-resort mapping for constructs the schema cannot express (per onUnsupported). */
export function paragraphFromUnsupported(token: Token, ctx: BlockFromMarkdownContext): SduiDocumentBlock[] {
  if (ctx.onUnsupported === 'throw') {
    throw new UnsupportedMarkdownError(token.type)
  }
  if (ctx.onUnsupported === 'skip') {
    return []
  }

  const text = token.raw.trim()
  if (text.length === 0) {
    return []
  }

  return [
    { id: ctx.blockId('paragraph'), type: PARAGRAPH_BLOCK_TYPE, state: { text, content: [{ type: 'text', text }] } },
  ]
}
