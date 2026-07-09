import { toggleMark } from 'prosemirror-commands'

import { markInputRule } from '../markInputRule'
import { staticMarkRenderers } from '../staticRenderers'
import type { SduiMarkDefinition } from '../types'

/** Outline marks/Strikethrough.ts — <del>, Mod-d, `~text~`. */
export const strikethroughMark: SduiMarkDefinition = {
  name: 'strikethrough',
  spec: {
    parseDOM: [{ tag: 's' }, { tag: 'del' }, { tag: 'strike' }, { style: 'text-decoration=line-through' }],
    toDOM: () => ['del', 0],
  },
  renderStatic: staticMarkRenderers.strikethrough,
  toSduiMark: () => ({ type: 'strikethrough' }),
  keys: (markType) => ({ 'Mod-d': toggleMark(markType) }),
  inputRule: (markType) => markInputRule(/~([^~\s](?:[^~]*[^~\s])?)~$/, markType),
}
