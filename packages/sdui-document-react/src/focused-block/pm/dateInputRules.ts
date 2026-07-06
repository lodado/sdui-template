import { InputRule, inputRules } from 'prosemirror-inputrules'
import type { Plugin } from 'prosemirror-state'

import { focusedBlockSchema } from './schema'

/** `@today` / `@tomorrow` / `@YYYY-MM-DD` followed by a space. */
const DATE_INPUT_RE = /@(today|tomorrow|\d{4}-\d{2}-\d{2})\s$/i

function toIso(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Resolves an `@`-token to an ISO date (YYYY-MM-DD), or null when unrecognized.
 * `today`/`tomorrow` are relative to the current local date.
 */
export function resolveDateToken(token: string): string | null {
  const normalized = token.toLowerCase()
  if (normalized === 'today') {
    return toIso(new Date())
  }
  if (normalized === 'tomorrow') {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return toIso(tomorrow)
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    const parsed = new Date(`${normalized}T00:00:00`)
    return Number.isNaN(parsed.getTime()) ? null : normalized
  }
  return null
}

/** Human-readable label for a date chip (medium style, locale default). */
export function formatDateDisplay(iso: string): string {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) {
    return iso
  }
  return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(date)
}

/**
 * Input rule that turns `@today ` / `@tomorrow ` / `@2026-07-06 ` into an inline
 * date chip. A lazy alternative to a full mention popover — reuses the existing
 * prosemirror-inputrules machinery. The trailing space is preserved so the
 * caret lands after the atom.
 */
export function buildDateInputRules(): Plugin {
  return inputRules({
    rules: [
      new InputRule(DATE_INPUT_RE, (state, match, start, end) => {
        const iso = resolveDateToken(match[1])
        if (!iso) {
          return null
        }
        const node = focusedBlockSchema.nodes.date.create({ iso, display: formatDateDisplay(iso) })
        return state.tr.replaceRangeWith(start, end, node).insertText(' ')
      }),
    ],
  })
}
