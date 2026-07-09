import { toggleMark } from 'prosemirror-commands'

import { markInputRule } from '../markInputRule'
import { staticMarkRenderers } from '../staticRenderers'
import type { SduiMarkDefinition } from '../types'

/** Outline marks/Code.ts — <code class="inline">, Mod-e / Mod-Shift-c, `` `text` ``. */
export const codeMark: SduiMarkDefinition = {
  name: 'code',
  spec: {
    parseDOM: [{ tag: 'code' }],
    toDOM: () => ['code', { class: 'inline' }, 0],
  },
  renderStatic: staticMarkRenderers.code,
  toSduiMark: () => ({ type: 'code' }),
  keys: (markType) => ({ 'Mod-e': toggleMark(markType), 'Mod-Shift-c': toggleMark(markType) }),
  inputRule: (markType) => markInputRule(/(?:^|[^`])(`([^`\s](?:[^`]*[^`\s])?)`)$/, markType),
}
