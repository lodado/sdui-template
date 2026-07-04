import type { Token, Tokens } from 'marked'
import { lexer } from 'marked'

import type { SduiDocumentBlock, SduiDocumentContent } from '../blocks/schema'
import { createBlockId, type SduiDocumentBlockId } from '../blocks/schema/ids'
import type { SduiInlineContent } from '../blocks/schema/inline'
import { parseSduiDocumentContent } from '../blocks/schema/validate'
import { inlineContentToPlainText } from '../content/inlineContent'
import { inlineTokensToContent } from './inline'
import type { MarkdownImportOptions, MarkdownUnsupportedPolicy } from './types'

type ConversionContext = {
  blockId: (hint: string) => SduiDocumentBlockId
  onUnsupported: MarkdownUnsupportedPolicy
}

const HEADING_MAX_LEVEL = 3

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

function headingBlock(token: Tokens.Heading, ctx: ConversionContext): SduiDocumentBlock {
  const content = inlineTokensToContent(token.tokens, ctx.onUnsupported)
  return {
    id: ctx.blockId('heading'),
    type: 'document.heading',
    state: { ...textBlockState(content), level: Math.min(token.depth, HEADING_MAX_LEVEL) },
  }
}

function imageBlock(token: Tokens.Image, ctx: ConversionContext): SduiDocumentBlock {
  return {
    id: ctx.blockId('image'),
    type: 'document.image',
    state: { text: token.text },
    attributes: { src: token.href, alt: token.text },
  }
}

function paragraphBlock(token: Tokens.Paragraph, ctx: ConversionContext): SduiDocumentBlock {
  const [only] = token.tokens
  if (token.tokens.length === 1 && only.type === 'image') {
    return imageBlock(only as Tokens.Image, ctx)
  }

  return {
    id: ctx.blockId('paragraph'),
    type: 'document.paragraph',
    state: textBlockState(inlineTokensToContent(token.tokens, ctx.onUnsupported)),
  }
}

function listItemBlocks(item: Tokens.ListItem, ctx: ConversionContext): SduiDocumentBlock[] {
  const textToken = item.tokens.find((token): token is Tokens.Text => token.type === 'text')
  const content = inlineTokensToContent(textToken?.tokens ?? [], ctx.onUnsupported)

  const own: SduiDocumentBlock = item.task
    ? {
        id: ctx.blockId('checklist'),
        type: 'document.checklist',
        state: { ...textBlockState(content), checked: item.checked === true },
      }
    : {
        id: ctx.blockId('paragraph'),
        type: 'document.paragraph',
        state: textBlockState(content),
      }

  // nested block content inside the item (sub-lists, quotes, …) flattens after it
  const rest = item.tokens.filter((token) => token.type !== 'text' && token.type !== 'checkbox')
  // eslint-disable-next-line no-use-before-define
  return [own, ...mapTokens(rest, ctx)]
}

function calloutBlock(token: Tokens.Blockquote, ctx: ConversionContext): SduiDocumentBlock {
  const inner = token.tokens.filter((child) => child.type !== 'space')
  const [first, ...others] = inner

  // hoist a leading paragraph as the callout's own text (matches callout state shape)
  const hoisted = first?.type === 'paragraph' ? (first as Tokens.Paragraph) : undefined
  const content = inlineTokensToContent(hoisted?.tokens ?? [], ctx.onUnsupported)
  // eslint-disable-next-line no-use-before-define
  const children = mapTokens(hoisted ? others : inner, ctx)

  return {
    id: ctx.blockId('callout'),
    type: 'document.callout',
    state: textBlockState(content),
    attributes: { tone: 'info' },
    children: children.length > 0 ? children : undefined,
  }
}

function codeBlock(token: Tokens.Code, ctx: ConversionContext): SduiDocumentBlock {
  // no dedicated code block type yet — degrade to a code-marked paragraph
  const content = token.text.split('\n').reduce<SduiInlineContent>((nodes, line, lineIndex) => {
    const withBreak: SduiInlineContent = lineIndex > 0 ? [...nodes, { type: 'hard_break' }] : nodes
    if (line.length === 0) {
      return withBreak
    }
    return [...withBreak, { type: 'text', text: line, marks: [{ type: 'code' }] }]
  }, [])

  return {
    id: ctx.blockId('paragraph'),
    type: 'document.paragraph',
    state: textBlockState(content),
  }
}

function unsupportedBlocks(token: Token, ctx: ConversionContext): SduiDocumentBlock[] {
  if (ctx.onUnsupported === 'throw') {
    throw new Error(`Unsupported markdown construct: ${token.type}`)
  }
  if (ctx.onUnsupported === 'skip') {
    return []
  }

  const text = token.raw.trim()
  if (text.length === 0) {
    return []
  }

  return [
    {
      id: ctx.blockId('paragraph'),
      type: 'document.paragraph',
      state: { text, content: [{ type: 'text', text }] },
    },
  ]
}

function mapToken(token: Token, ctx: ConversionContext): SduiDocumentBlock[] {
  switch (token.type) {
    case 'space':
      return []
    case 'heading':
      return [headingBlock(token as Tokens.Heading, ctx)]
    case 'paragraph':
      return [paragraphBlock(token as Tokens.Paragraph, ctx)]
    case 'list':
      return (token as Tokens.List).items.reduce<SduiDocumentBlock[]>(
        (blocks, item) => [...blocks, ...listItemBlocks(item, ctx)],
        [],
      )
    case 'hr':
      return [{ id: ctx.blockId('divider'), type: 'document.divider' }]
    case 'blockquote':
      return [calloutBlock(token as Tokens.Blockquote, ctx)]
    case 'code':
      return [codeBlock(token as Tokens.Code, ctx)]
    default:
      return unsupportedBlocks(token, ctx)
  }
}

function mapTokens(tokens: Token[], ctx: ConversionContext): SduiDocumentBlock[] {
  return tokens.reduce<SduiDocumentBlock[]>((blocks, token) => [...blocks, ...mapToken(token, ctx)], [])
}

/**
 * Converts a markdown string to a validated SduiDocumentContent.
 *
 * Uses marked's GFM lexer; the mapping owns only mdToken -> block translation.
 * Constructs the schema cannot express (plain lists, fenced code, raw html, …)
 * follow `onUnsupported`: 'degrade' (default) approximates with existing block
 * types, 'skip' drops them, 'throw' fails fast.
 */
export function markdownToSduiDocumentContent(
  markdown: string,
  options: MarkdownImportOptions = {},
): SduiDocumentContent {
  const generateId = options.generateId ?? createDefaultIdGenerator()
  const ctx: ConversionContext = {
    blockId: (hint) => createBlockId(generateId(hint)),
    onUnsupported: options.onUnsupported ?? 'degrade',
  }

  const children = mapTokens(lexer(markdown), ctx)

  return parseSduiDocumentContent({
    schemaVersion: '1.0',
    root: {
      id: ctx.blockId('root'),
      type: 'document.root',
      children: children.length > 0 ? children : undefined,
    },
  })
}
