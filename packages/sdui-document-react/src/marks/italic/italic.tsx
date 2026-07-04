import { toggleMark } from 'prosemirror-commands'
import React from 'react'

import type { SduiMarkDefinition } from '../types'

/** Outline marks/Italic.ts — <em>, Mod-i. */
export const italicMark: SduiMarkDefinition = {
  name: 'italic',
  spec: {
    parseDOM: [{ tag: 'em' }, { tag: 'i' }],
    toDOM: () => ['em', 0],
  },
  renderStatic: (children) => <em>{children}</em>,
  toSduiMark: () => ({ type: 'italic' }),
  keys: (markType) => ({ 'Mod-i': toggleMark(markType) }),
}
