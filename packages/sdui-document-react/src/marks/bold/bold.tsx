import { toggleMark } from 'prosemirror-commands'

import { markInputRule } from '../markInputRule'
import { staticMarkRenderers } from '../staticRenderers'
import type { SduiMarkDefinition } from '../types'

/** Outline marks/Bold.ts — <strong>, Mod-b, `**text**`. */
export const boldMark: SduiMarkDefinition = {
  name: 'bold',
  spec: {
    parseDOM: [{ tag: 'strong' }, { tag: 'b' }],
    toDOM: () => ['strong', 0],
  },
  renderStatic: staticMarkRenderers.bold,
  toSduiMark: () => ({ type: 'bold' }),
  keys: (markType) => ({ 'Mod-b': toggleMark(markType) }),
  inputRule: (markType) => markInputRule(/\*\*([^*\s](?:[^*]*[^*\s])?)\*\*$/, markType),
}
