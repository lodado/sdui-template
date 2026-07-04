import { InputRule, inputRules } from 'prosemirror-inputrules'
import type { Plugin } from 'prosemirror-state'

import type { FocusedBlockCallbacks } from './keymapDelegation'

type TurnIntoRule = {
  pattern: RegExp
  type: string
  attrs?: Record<string, unknown>
}

const TURN_INTO_RULES: TurnIntoRule[] = [
  { pattern: /^#\s$/, type: 'document.heading', attrs: { level: 1 } },
  { pattern: /^##\s$/, type: 'document.heading', attrs: { level: 2 } },
  { pattern: /^###\s$/, type: 'document.heading', attrs: { level: 3 } },
  { pattern: /^\[\]\s$/, type: 'document.checklist' },
  { pattern: /^>\s$/, type: 'document.callout' },
]

/**
 * Markdown shortcuts at block start ("# ", "[] ", "> ", ...).
 *
 * Policies:
 * - the matched prefix is deleted from the PM doc; the actual block type
 *   change is delegated to the block layer via onTurnInto (patch territory)
 */
export function buildBlockTypeInputRules(callbacks: FocusedBlockCallbacks): Plugin {
  return inputRules({
    rules: TURN_INTO_RULES.map(
      (rule) =>
        new InputRule(rule.pattern, (state, _match, start, end) => {
          callbacks.onTurnInto(rule.type, rule.attrs)
          return state.tr.delete(start, end)
        }),
    ),
  })
}
