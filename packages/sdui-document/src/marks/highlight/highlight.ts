import { z } from 'zod'

import type { SduiMarkModule } from '../types'

export type HighlightMark = { type: 'highlight'; attrs: { color: string } }

/** Highlight colors must be 6-digit hex — the only attrs format renderers accept. */
export const HIGHLIGHT_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/

export function isValidHighlightColor(color: string): boolean {
  return HIGHLIGHT_COLOR_PATTERN.test(color)
}

export const highlightMark: SduiMarkModule<HighlightMark> = {
  name: 'highlight',
  schema: z.object({
    type: z.literal('highlight'),
    attrs: z.object({ color: z.string().regex(HIGHLIGHT_COLOR_PATTERN, 'highlight color must be #RRGGBB') }),
  }),
  clone: (mark) => ({ type: 'highlight', attrs: { ...mark.attrs } }),
  equals: (a, b) => a.attrs.color === b.attrs.color,
}
