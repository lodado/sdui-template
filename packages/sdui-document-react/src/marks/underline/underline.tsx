import { toggleMark } from 'prosemirror-commands'

import { markInputRule } from '../markInputRule'
import { staticMarkRenderers } from '../staticRenderers'
import type { SduiMarkDefinition } from '../types'

/** Outline marks/Underline.ts — <u>, Mod-u, `__text__`. */
export const underlineMark: SduiMarkDefinition = {
  name: 'underline',
  spec: {
    parseDOM: [{ tag: 'u' }, { style: 'text-decoration-line=underline' }],
    toDOM: () => ['u', 0],
  },
  renderStatic: staticMarkRenderers.underline,
  toSduiMark: () => ({ type: 'underline' }),
  keys: (markType) => ({ 'Mod-u': toggleMark(markType) }),
  inputRule: (markType) => markInputRule(/__([^_\s](?:[^_]*[^_\s])?)__$/, markType),
}
