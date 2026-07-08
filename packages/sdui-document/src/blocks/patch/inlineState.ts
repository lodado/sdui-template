import { inlineContentToPlainText, textToInlineContent } from '../../content/inlineContent'
import type { SduiDocumentBlock, SduiInlineContent } from '../schema'

/**
 * Inline representation of a block's text state.
 *
 * Policies:
 * - `content` mode: `state.content` is the rich source of truth, `state.text` is derived
 * - `text` mode: `state.text` plain string only, no `state.content` is introduced by the engine
 * - `empty` mode: block carries no inline text (offset 0 is the only valid split point)
 */
export type BlockInlineState = {
  mode: 'content' | 'text' | 'empty'
  content: SduiInlineContent
}

export function getBlockInline(block: SduiDocumentBlock): BlockInlineState {
  const stateContent = block.state?.content
  if (Array.isArray(stateContent)) {
    return { mode: 'content', content: stateContent as SduiInlineContent }
  }

  const stateText = block.state?.text
  if (typeof stateText === 'string') {
    return { mode: 'text', content: textToInlineContent(stateText) }
  }

  return { mode: 'empty', content: [] }
}

export function toInlineStatePatch(
  mode: BlockInlineState['mode'],
  content: SduiInlineContent,
): Record<string, unknown> {
  if (mode === 'content') {
    return { content, text: inlineContentToPlainText(content) }
  }

  return { text: inlineContentToPlainText(content) }
}

export function stripUndefinedKeys(record: Record<string, unknown>): Record<string, unknown> | undefined {
  const entries = Object.entries(record).filter(([, value]) => value !== undefined)
  if (entries.length === 0) {
    return undefined
  }

  return entries.reduce<Record<string, unknown>>((result, [key, value]) => ({ ...result, [key]: value }), {})
}
