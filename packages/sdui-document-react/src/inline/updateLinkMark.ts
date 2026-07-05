import type { SduiInlineContent } from '@lodado/sdui-document'

/**
 * Rewrites or removes link marks matching `href` across a block's inline
 * content, returning new content (never mutates the input).
 *
 * - `nextHref` is a string → the mark's href is replaced
 * - `nextHref` is null → the link mark is stripped, leaving the text
 *
 * Known limitation: two distinct links that happen to share the same href in
 * one block are edited together. Acceptable for v1 — link hrefs are the only
 * identity we have without offset tracking.
 */
export function updateLinkMark(content: SduiInlineContent, href: string, nextHref: string | null): SduiInlineContent {
  return content.map((node) => {
    if (node.type !== 'text' || !node.marks) {
      return node
    }

    let changed = false
    const marks = node.marks.flatMap((mark) => {
      if (mark.type !== 'link' || mark.attrs.href !== href) {
        return [mark]
      }
      changed = true
      return nextHref === null ? [] : [{ ...mark, attrs: { ...mark.attrs, href: nextHref } }]
    })

    if (!changed) {
      return node
    }

    return marks.length > 0 ? { ...node, marks } : { type: 'text' as const, text: node.text }
  })
}
