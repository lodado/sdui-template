import type { Token, Tokens } from 'marked'
import { lexer } from 'marked'

import type { BlockFromMarkdownContext } from '../block-types'
import { calloutFromMarkdown } from '../block-types/callout/callout.markdown'
import { checklistFromListItem } from '../block-types/checklist/checklist.markdown'
import { dividerFromMarkdown } from '../block-types/divider/divider.markdown'
import { headingFromMarkdown } from '../block-types/heading/heading.markdown'
import {
  paragraphFromCode,
  paragraphFromListItemContent,
  paragraphFromMarkdown,
  paragraphFromUnsupported,
} from '../block-types/paragraph/paragraph.markdown'
import type { SduiDocumentBlock, SduiDocumentContent } from '../blocks/schema'
import { createBlockId } from '../blocks/schema/ids'
import type { SduiInlineContent } from '../blocks/schema/inline'
import { parseSduiDocumentContent } from '../blocks/schema/validate'
import { inlineContentToPlainText } from '../content/inlineContent'
import { migrateToFractionalPositions } from '../ordering/migrate'
import { inlineTokensToContent } from './inline'
import type { MarkdownImportOptions } from './types'

function createDefaultIdGenerator(): (hint: string) => string {
  let counter = 0
  return (hint) => {
    counter += 1
    return `md-${hint}-${counter}`
  }
}

function textBlockState(content: SduiInlineContent): Record<string, unknown> {
  return { text: inlineContentToPlainText(content), content }
}

function listItemBlocks(item: Tokens.ListItem, ctx: BlockFromMarkdownContext): SduiDocumentBlock[] {
  const textToken = item.tokens.find((token): token is Tokens.Text => token.type === 'text')
  const content = ctx.inline(textToken?.tokens ?? [])

  // task items become checklists, plain items become paragraphs — each block owns its own builder
  const own = item.task
    ? checklistFromListItem(content, item.checked === true, ctx)
    : paragraphFromListItemContent(content, ctx)

  // nested block content inside the item (sub-lists, quotes, …) flattens after it
  const rest = item.tokens.filter((token) => token.type !== 'text' && token.type !== 'checkbox')
  return [own, ...ctx.mapTokens(rest)]
}

/**
 * marked token -> block dispatch. Each case delegates to the owning block's
 * `fromMarkdown` handler (colocated in `block-types/<name>/<name>.markdown.ts`);
 * only the token-keyed routing and list iteration stay here.
 */
function mapToken(token: Token, ctx: BlockFromMarkdownContext): SduiDocumentBlock[] {
  switch (token.type) {
    case 'space':
      return []
    case 'heading':
      return [headingFromMarkdown(token as Tokens.Heading, ctx)]
    case 'paragraph':
      return [paragraphFromMarkdown(token as Tokens.Paragraph, ctx)]
    case 'list':
      return (token as Tokens.List).items.reduce<SduiDocumentBlock[]>(
        (blocks, item) => [...blocks, ...listItemBlocks(item, ctx)],
        [],
      )
    case 'hr':
      return [dividerFromMarkdown(ctx)]
    case 'blockquote':
      return [calloutFromMarkdown(token as Tokens.Blockquote, ctx)]
    case 'code':
      return [paragraphFromCode(token as Tokens.Code, ctx)]
    default:
      return paragraphFromUnsupported(token, ctx)
  }
}

function mapTokens(tokens: Token[], ctx: BlockFromMarkdownContext): SduiDocumentBlock[] {
  return tokens.reduce<SduiDocumentBlock[]>((blocks, token) => [...blocks, ...mapToken(token, ctx)], [])
}

/**
 * Converts a markdown string to a validated SduiDocumentContent.
 *
 * Uses marked's GFM lexer; this module owns only mdToken -> block routing, with
 * each block type's translation colocated in its own module. Constructs the
 * schema cannot express (plain lists, fenced code, raw html, …) follow
 * `onUnsupported`: 'degrade' (default) approximates with existing block types,
 * 'skip' drops them, 'throw' fails fast.
 */
export function markdownToSduiDocumentContent(
  markdown: string,
  options: MarkdownImportOptions = {},
): SduiDocumentContent {
  const generateId = options.generateId ?? createDefaultIdGenerator()
  const onUnsupported = options.onUnsupported ?? 'degrade'
  const ctx: BlockFromMarkdownContext = {
    blockId: (hint) => createBlockId(generateId(hint)),
    onUnsupported,
    inline: (tokens) => inlineTokensToContent(tokens, onUnsupported),
    textState: textBlockState,
    mapTokens: (tokens) => mapTokens(tokens, ctx),
  }

  const children = mapTokens(lexer(markdown), ctx)

  return migrateToFractionalPositions(
    parseSduiDocumentContent({
      schemaVersion: '1.0',
      root: {
        id: ctx.blockId('root'),
        type: 'document.root',
        children: children.length > 0 ? children : undefined,
      },
    }),
  )
}
