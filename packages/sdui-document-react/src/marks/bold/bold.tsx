import { toggleMark } from 'prosemirror-commands'
import React from 'react'

import { markInputRule } from '../markInputRule'
import type { SduiMarkDefinition } from '../types'

/** Outline marks/Bold.ts — <strong>, Mod-b, `**text**`. */
export const boldMark: SduiMarkDefinition = {
  name: 'bold',
  spec: {
    parseDOM: [{ tag: 'strong' }, { tag: 'b' }],
    toDOM: () => ['strong', 0],
  },
  renderStatic: (children) => <strong>{children}</strong>,
  toSduiMark: () => ({ type: 'bold' }),
  keys: (markType) => ({ 'Mod-b': toggleMark(markType) }),
  inputRule: (markType) => markInputRule(/\*\*([^*\s](?:[^*]*[^*\s])?)\*\*$/, markType),
}
