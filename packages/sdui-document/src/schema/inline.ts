/**
 * Inline rich text model for text-bearing document blocks.
 *
 * Shape is intentionally ProseMirror-compatible so a focused-block PM editor
 * can serialize to/from `block.state.content` without a mapping layer.
 *
 * Policies:
 * - `state.content` (SduiInlineContent) is the rich source of truth when present
 * - `state.text` is derived plain text (search/SSR/fallback), refreshed on every engine write
 * - a `hard_break` occupies exactly 1 offset unit (PM leaf-node convention)
 */

export type SduiInlineMark =
  | { type: 'bold' }
  | { type: 'italic' }
  | { type: 'code' }
  | { type: 'link'; attrs: { href: string } }

export type SduiInlineTextNode = {
  type: 'text'
  text: string
  marks?: SduiInlineMark[]
}

export type SduiInlineHardBreakNode = {
  type: 'hard_break'
}

export type SduiInlineNode = SduiInlineTextNode | SduiInlineHardBreakNode

export type SduiInlineContent = SduiInlineNode[]

export function isInlineTextNode(node: SduiInlineNode): node is SduiInlineTextNode {
  return node.type === 'text'
}

export function isInlineHardBreakNode(node: SduiInlineNode): node is SduiInlineHardBreakNode {
  return node.type === 'hard_break'
}
