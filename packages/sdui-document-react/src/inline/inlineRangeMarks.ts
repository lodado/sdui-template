import type { SduiInlineContent, SduiInlineMark, SduiInlineTextNode } from '@lodado/sdui-document'

import { mapInlineRange } from './mapInlineRange'

/** Adds `mark`, replacing any existing mark of the same type (so color/link update in place). */
function withMark(marks: SduiInlineMark[] | undefined, mark: SduiInlineMark): SduiInlineMark[] {
  return [...(marks ?? []).filter((existing) => existing.type !== mark.type), mark]
}

function withoutMark(marks: SduiInlineMark[] | undefined, markType: string): SduiInlineMark[] {
  return (marks ?? []).filter((existing) => existing.type !== markType)
}

/** Applies `mark` to every text segment in [from, to). */
export function addMarkInRange(
  content: SduiInlineContent,
  from: number,
  to: number,
  mark: SduiInlineMark,
): SduiInlineContent {
  return mapInlineRange(content, from, to, (node) =>
    node.type === 'text' ? [{ ...node, marks: withMark(node.marks, mark) }] : [node],
  )
}

/** Removes any mark of `markType` from every text segment in [from, to). */
export function removeMarkInRange(
  content: SduiInlineContent,
  from: number,
  to: number,
  markType: string,
): SduiInlineContent {
  return mapInlineRange(content, from, to, (node) => {
    if (node.type !== 'text') {
      return [node]
    }
    const marks = withoutMark(node.marks, markType)
    return [marks.length > 0 ? { ...node, marks } : { type: 'text', text: node.text }]
  })
}

/** Text slices (marks preserved) that fall inside [from, to). Basis for copy + mark-state checks. */
export function coveredTextSegments(content: SduiInlineContent, from: number, to: number): SduiInlineTextNode[] {
  return content.reduce<{ pos: number; segments: SduiInlineTextNode[] }>(
    (accumulated, node) => {
      const start = accumulated.pos
      const end = start + (node.type === 'text' ? node.text.length : 1)
      if (node.type !== 'text') {
        return { pos: end, segments: accumulated.segments }
      }
      const coverStart = Math.max(from, start)
      const coverEnd = Math.min(to, end)
      const segments =
        coverStart < coverEnd
          ? [...accumulated.segments, { ...node, text: node.text.slice(coverStart - start, coverEnd - start) }]
          : accumulated.segments
      return { pos: end, segments }
    },
    { pos: 0, segments: [] },
  ).segments
}

/** True when every covered text segment already carries `markType` (→ toggle should remove). */
export function rangeHasMark(content: SduiInlineContent, from: number, to: number, markType: string): boolean {
  const segments = coveredTextSegments(content, from, to)
  return (
    segments.length > 0 && segments.every((segment) => (segment.marks ?? []).some((mark) => mark.type === markType))
  )
}

/**
 * The uniform value of `markType`'s `attrKey` across the covered range, or null
 * when a segment lacks the mark or the values disagree (mixed selection). Used
 * to reflect the active color / highlight / link in the toolbar.
 */
export function rangeMarkAttr(
  content: SduiInlineContent,
  from: number,
  to: number,
  markType: string,
  attrKey: string,
): string | null {
  const segments = coveredTextSegments(content, from, to)
  if (segments.length === 0) {
    return null
  }
  const values = segments.map((segment) => {
    const mark = (segment.marks ?? []).find((entry) => entry.type === markType)
    const attrs = mark && 'attrs' in mark ? (mark.attrs as Record<string, unknown>) : undefined
    return attrs ? attrs[attrKey] : undefined
  })
  if (values.some((value) => value === undefined)) {
    return null
  }
  return values.every((value) => value === values[0]) ? String(values[0]) : null
}
