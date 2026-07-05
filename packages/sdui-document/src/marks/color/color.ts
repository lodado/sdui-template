import { z } from 'zod'

import type { SduiMarkModule } from '../types'

export type ColorMark = { type: 'color'; attrs: { color: string } }

/** Foreground text color must be 6-digit hex — the only attrs format renderers accept. */
export const TEXT_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/

export function isValidTextColor(color: string): boolean {
  return TEXT_COLOR_PATTERN.test(color)
}

export const colorMark: SduiMarkModule<ColorMark> = {
  name: 'color',
  schema: z.object({
    type: z.literal('color'),
    attrs: z.object({ color: z.string().regex(TEXT_COLOR_PATTERN, 'text color must be #RRGGBB') }),
  }),
  clone: (mark) => ({ type: 'color', attrs: { ...mark.attrs } }),
  equals: (a, b) => a.attrs.color === b.attrs.color,
}
