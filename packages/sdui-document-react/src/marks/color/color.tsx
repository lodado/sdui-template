import React from 'react'

import type { SduiMarkDefinition } from '../types'

/**
 * Foreground text color — <span data-text-color> painted as `color`.
 * Sibling of highlight (which paints `background-color`). Applied from the
 * selection toolbar palette; no keymap (avoids the Mod-Shift-c code-mark
 * collision) and no markdown syntax (degrades to plain text on export).
 */
export const colorMark: SduiMarkDefinition = {
  name: 'color',
  spec: {
    attrs: { color: {} },
    parseDOM: [
      {
        tag: 'span[data-text-color]',
        getAttrs: (dom) => ({ color: (dom as HTMLElement).getAttribute('data-text-color') }),
      },
    ],
    toDOM: (mark) => [
      'span',
      {
        'data-text-color': String(mark.attrs.color),
        style: `color: ${String(mark.attrs.color)}`,
      },
      0,
    ],
  },
  renderStatic: (children, mark) => {
    if (mark.type !== 'color') {
      return children
    }

    return (
      <span data-text-color={mark.attrs.color} style={{ color: mark.attrs.color }}>
        {children}
      </span>
    )
  },
  toPmAttrs: (mark) => (mark.type === 'color' ? { color: mark.attrs.color } : undefined),
  toSduiMark: (mark) => ({ type: 'color', attrs: { color: String(mark.attrs.color) } }),
}
