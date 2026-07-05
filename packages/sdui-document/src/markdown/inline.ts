import type { Token } from 'marked'

import type { SduiInlineContent, SduiInlineMark, SduiInlineNode } from '../blocks/schema/inline'
import { mergeInlineContent } from '../content/inlineContent'
import { inlineMarkFromToken, type MarkFromMarkdownContext } from '../marks'
import type { MarkdownUnsupportedPolicy } from './types'

function textNode(text: string, marks: SduiInlineMark[]): SduiInlineNode {
  return marks.length > 0 ? { type: 'text', text, marks } : { type: 'text', text }
}

function tokenNodes(token: Token, marks: SduiInlineMark[], onUnsupported: MarkdownUnsupportedPolicy): SduiInlineNode[] {
  // marks own their own marked-token mappings (strong -> bold, codespan -> code, …)
  const markCtx: MarkFromMarkdownContext = {
    // eslint-disable-next-line no-use-before-define
    collect: (nestedTokens, nestedMarks) => collect(nestedTokens, nestedMarks, onUnsupported),
    textNode,
  }
  const markNodes = inlineMarkFromToken(token, marks, markCtx)
  if (markNodes) {
    return markNodes
  }

  switch (token.type) {
    case 'text':
      // list-item text containers nest their own inline tokens
      if ('tokens' in token && token.tokens) {
        // eslint-disable-next-line no-use-before-define
        return collect(token.tokens, marks, onUnsupported)
      }
      return [textNode(token.text, marks)]

    case 'escape':
      return [textNode(token.text, marks)]

    case 'br':
      return [{ type: 'hard_break' }]

    case 'image':
      // inline images cannot be expressed inside text — degrade to alt text
      if (onUnsupported === 'throw') {
        throw new Error('Unsupported markdown construct in inline content: image')
      }
      return onUnsupported === 'skip' ? [] : [textNode(token.text, marks)]

    default: {
      if (onUnsupported === 'throw') {
        throw new Error(`Unsupported markdown construct in inline content: ${token.type}`)
      }
      return onUnsupported === 'skip' ? [] : [textNode(token.raw, marks)]
    }
  }
}

function collect(tokens: Token[], marks: SduiInlineMark[], onUnsupported: MarkdownUnsupportedPolicy): SduiInlineNode[] {
  return tokens.reduce<SduiInlineNode[]>((nodes, token) => [...nodes, ...tokenNodes(token, marks, onUnsupported)], [])
}

/**
 * Converts marked inline (phrasing) tokens to SduiInlineContent.
 * Nested emphasis accumulates on the mark stack in nesting order; the result is
 * normalized (adjacent same-mark text nodes merged, empty text nodes dropped).
 */
export function inlineTokensToContent(tokens: Token[], onUnsupported: MarkdownUnsupportedPolicy): SduiInlineContent {
  return mergeInlineContent(collect(tokens, [], onUnsupported), [])
}
