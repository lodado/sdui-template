/**
 * Authoring helpers for inline rich text — terse builders for hand-writing
 * documents (stories, fixtures, seed content). They produce the same
 * `SduiInlineNode` shapes the engine emits, so authored content round-trips
 * through validation and rendering unchanged.
 */

import type { SduiInlineContent, SduiInlineMark, SduiInlineNode, SduiInlineTextNode } from '../blocks/schema/inline'
import { inlineContentToPlainText } from './inlineContent'

/** A text node, optionally carrying marks. */
export function text(value: string, marks?: SduiInlineMark[]): SduiInlineTextNode {
  return marks && marks.length > 0 ? { type: 'text', text: value, marks } : { type: 'text', text: value }
}

/** A hard line break (1 offset unit, like PM's leaf node). */
export const hardBreak: SduiInlineNode = { type: 'hard_break' }

export const bold = (value: string): SduiInlineTextNode => text(value, [{ type: 'bold' }])
export const italic = (value: string): SduiInlineTextNode => text(value, [{ type: 'italic' }])
export const underline = (value: string): SduiInlineTextNode => text(value, [{ type: 'underline' }])
export const strikethrough = (value: string): SduiInlineTextNode => text(value, [{ type: 'strikethrough' }])
export const inlineCode = (value: string): SduiInlineTextNode => text(value, [{ type: 'code' }])
export const link = (value: string, href: string): SduiInlineTextNode =>
  text(value, [{ type: 'link', attrs: { href } }])
/** Background highlight chip. */
export const highlighted = (value: string, color: string): SduiInlineTextNode =>
  text(value, [{ type: 'highlight', attrs: { color } }])
/** Foreground text color. */
export const colored = (value: string, color: string): SduiInlineTextNode =>
  text(value, [{ type: 'color', attrs: { color } }])

/**
 * Text-bearing block `state` from rich inline content — carries the rich
 * `content` plus the derived plain-text fallback the engine keeps in sync.
 */
export function inlineState(content: SduiInlineContent): { content: SduiInlineContent; text: string } {
  return { content, text: inlineContentToPlainText(content) }
}
