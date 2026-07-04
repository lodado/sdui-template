import { InputRule } from 'prosemirror-inputrules'
import type { MarkType } from 'prosemirror-model'

/**
 * "delimiter + text + delimiter" -> marked text (Outline's markInputRule):
 * deletes the delimiters and applies the mark to the inner text.
 *
 * Two pattern shapes are supported (both used by Outline):
 * - simple: one capture group = inner text; match[0] is the delimited span
 *   (e.g. `/~([^~]+)~$/`)
 * - prefix-guarded: `(?:^|[^*])` prefix + capture groups where the FIRST
 *   group is the delimited span and the LAST group is the inner text
 *   (e.g. `/(?:^|[^`])(`([^`]+)`)$/`) — the guard character before the span
 *   must survive the rewrite
 */
export function markInputRule(pattern: RegExp, markType: MarkType, attrs?: Record<string, unknown>): InputRule {
  return new InputRule(pattern, (state, match, start, end) => {
    const groups = match.slice(1).filter((group): group is string => group !== undefined)
    const innerText = groups[groups.length - 1]
    if (!innerText) {
      return null
    }

    const delimited = groups.length > 1 ? groups[0] : match[0]
    const { tr } = state
    const spanStart = start + match[0].indexOf(delimited)
    const textStart = spanStart + delimited.indexOf(innerText)
    const textEnd = textStart + innerText.length

    if (textEnd < end) {
      tr.delete(textEnd, end)
    }
    if (textStart > spanStart) {
      tr.delete(spanStart, textStart)
    }

    return tr.addMark(spanStart, spanStart + innerText.length, markType.create(attrs)).removeStoredMark(markType)
  })
}
