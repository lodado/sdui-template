import type { SduiInlineContent, SduiInlineNode } from '@lodado/sdui-document'

/**
 * The one place inline offset boundaries are split. Walks `content` in offset
 * order (text char = 1 unit, hard_break = 1 unit — the domInlineOffsets
 * convention) and hands every node segment that falls inside [from, to) to
 * `transform`; segments outside the range pass through untouched.
 *
 * A text node straddling a boundary is sliced so `transform` only ever sees a
 * fully-covered segment (marks preserved on the slice). Returning [] drops it.
 *
 * All cross-block range ops (delete, add/remove mark, slice-for-copy) are built
 * on this so the fiddly boundary math lives here alone.
 */
export function mapInlineRange(
  content: SduiInlineContent,
  from: number,
  to: number,
  transform: (node: SduiInlineNode) => SduiInlineNode[],
): SduiInlineContent {
  if (to <= from) {
    return content
  }

  const keepText = (node: SduiInlineNode, text: string): SduiInlineNode[] =>
    node.type === 'text' && text ? [{ ...node, text }] : []

  const segmentAt = (node: SduiInlineNode, start: number): SduiInlineNode[] => {
    // Leaf nodes (hard_break, date) occupy 1 unit and are never sliced.
    if (node.type !== 'text') {
      const covered = start >= from && start < to
      return covered ? transform(node) : [node]
    }
    const end = start + node.text.length
    const coverStart = Math.max(from, start)
    const coverEnd = Math.min(to, end)
    if (coverStart >= coverEnd) {
      return [node] // wholly outside the range
    }
    // left keep · covered segment (transformed) · right keep
    return [
      ...keepText(node, node.text.slice(0, coverStart - start)),
      ...transform({ ...node, text: node.text.slice(coverStart - start, coverEnd - start) }),
      ...keepText(node, node.text.slice(coverEnd - start)),
    ]
  }

  return content.reduce<{ pos: number; nodes: SduiInlineNode[] }>(
    (accumulated, node) => ({
      pos: accumulated.pos + (node.type === 'text' ? node.text.length : 1),
      nodes: [...accumulated.nodes, ...segmentAt(node, accumulated.pos)],
    }),
    { pos: 0, nodes: [] },
  ).nodes
}
