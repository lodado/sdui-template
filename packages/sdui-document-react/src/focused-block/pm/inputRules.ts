import { InputRule, inputRules } from 'prosemirror-inputrules'
import type { Plugin } from 'prosemirror-state'

import { turnIntoInputRuleEntries } from '../../block-types/turnInto'
import { MARK_DEFINITIONS } from '../../marks'
import type { FocusedBlockCallbacks } from './keymapDelegation'
import { focusedBlockSchema } from './schema'

/**
 * Markdown shortcuts at block start ("# ", "[] ", "> ", "---", ...),
 * aggregated from the turn-into registry (block-types/turnInto.ts).
 *
 * Policies:
 * - the matched prefix is deleted from the PM doc; the actual block type
 *   change is delegated to the block layer via onTurnInto (patch territory)
 */
export function buildBlockTypeInputRules(callbacks: FocusedBlockCallbacks): Plugin {
  return inputRules({
    rules: turnIntoInputRuleEntries().map(
      (rule) =>
        new InputRule(rule.pattern, (state, _match, start, end) => {
          callbacks.onTurnInto(rule.type, rule.attrs)
          return state.tr.delete(start, end)
        }),
    ),
  })
}

/**
 * Markdown mark shortcuts aggregated from the mark registry
 * (Outline patterns: `**text**`, `*text*`, `` `text` ``, `~text~`,
 * `__text__`, `==text==`).
 */
export function buildMarkInputRules(): Plugin {
  return inputRules({
    rules: MARK_DEFINITIONS.filter((definition) => definition.inputRule).map((definition) =>
      definition.inputRule!(focusedBlockSchema.marks[definition.name]),
    ),
  })
}
