import { InputRule } from 'prosemirror-inputrules'
import type { MarkType } from 'prosemirror-model'

/**
 * "delimiter + text + delimiter" -> marked text (Outline's markInputRule):
 * deletes the delimiters and applies the mark to the inner text.
 */
export function markInputRule(pattern: RegExp, markType: MarkType, attrs?: Record<string, unknown>): InputRule {
  return new InputRule(pattern, (state, match, start, end) => {
    const innerText = match[1]
    if (!innerText) {
      return null
    }

    const { tr } = state
    const textStart = start + match[0].indexOf(innerText)
    const textEnd = textStart + innerText.length

    if (textEnd < end) {
      tr.delete(textEnd, end)
    }
    if (textStart > start) {
      tr.delete(start, textStart)
    }

    return tr.addMark(start, start + innerText.length, markType.create(attrs)).removeStoredMark(markType)
  })
}
