import { toggleMark } from 'prosemirror-commands'
import React from 'react'

import { markInputRule } from '../markInputRule'
import type { SduiMarkDefinition } from '../types'
import { HIGHLIGHT_PALETTE, highlightBackground } from './palette'

/**
 * Outline marks/Highlight.ts — <mark data-color> with 40%-opacity background,
 * Mod-Shift-h (first preset), `==text==`.
 */
export const highlightMark: SduiMarkDefinition = {
  name: 'highlight',
  spec: {
    attrs: { color: {} },
    parseDOM: [
      {
        tag: 'mark[data-color]',
        getAttrs: (dom) => ({ color: (dom as HTMLElement).getAttribute('data-color') }),
      },
    ],
    toDOM: (mark) => [
      'mark',
      {
        'data-color': String(mark.attrs.color),
        style: `background-color: ${highlightBackground(String(mark.attrs.color))}`,
      },
      0,
    ],
  },
  renderStatic: (children, mark) => {
    if (mark.type !== 'highlight') {
      return children
    }

    return (
      <mark data-color={mark.attrs.color} style={{ backgroundColor: highlightBackground(mark.attrs.color) }}>
        {children}
      </mark>
    )
  },
  toPmAttrs: (mark) => (mark.type === 'highlight' ? { color: mark.attrs.color } : undefined),
  toSduiMark: (mark) => ({ type: 'highlight', attrs: { color: String(mark.attrs.color) } }),
  keys: (markType) => ({ 'Mod-Shift-h': toggleMark(markType, { color: HIGHLIGHT_PALETTE[0].hex }) }),
  inputRule: (markType) =>
    markInputRule(/==([^=\s](?:[^=]*[^=\s])?)==$/, markType, { color: HIGHLIGHT_PALETTE[0].hex }),
}
