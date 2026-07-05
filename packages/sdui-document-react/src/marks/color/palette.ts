/**
 * Foreground text-color presets — Notion's palette (see notionColors.ts).
 * Stored attrs are a pure 6-digit hex, painted directly as `color`.
 */
import { NOTION_COLORS } from './notionColors'

export type TextColorPreset = {
  hex: string
  name: string
}

export const TEXT_COLOR_PALETTE: readonly TextColorPreset[] = NOTION_COLORS
