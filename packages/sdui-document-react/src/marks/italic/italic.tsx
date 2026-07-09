import { toggleMark } from 'prosemirror-commands'

import { markInputRule } from '../markInputRule'
import { staticMarkRenderers } from '../staticRenderers'
import type { SduiMarkDefinition } from '../types'

/** Outline marks/Italic.ts — <em>, Mod-i, `*text*` / `_text_`. */
export const italicMark: SduiMarkDefinition = {
  name: 'italic',
  spec: {
    parseDOM: [{ tag: 'em' }, { tag: 'i' }],
    toDOM: () => ['em', 0],
  },
  renderStatic: staticMarkRenderers.italic,
  toSduiMark: () => ({ type: 'italic' }),
  keys: (markType) => ({ 'Mod-i': toggleMark(markType) }),
  // single same-delimiter only (`*text*` / `_text_`) — `**` stays bold's,
  // `__` stays underline's; the prefix guard keeps mid-word underscores inert
  inputRule: (markType) => markInputRule(/(?:^|[^*_])(([*_])([^*_\s](?:[^*_]*[^*_\s])?)\2)$/, markType),
}
