/**
 * Highlight (background) preset palette — Notion's colors (see notionColors.ts).
 * The stored attr is the pure base hex; the background is painted at 40% opacity
 * so the light tint reads like Notion's background colors.
 */
import { NOTION_COLORS } from '../color/notionColors'

export type HighlightPreset = {
  hex: string
  name: string
}

export const HIGHLIGHT_PALETTE: readonly HighlightPreset[] = NOTION_COLORS

export const HIGHLIGHT_OPACITY = 0.4

/** rgba() string for a palette hex at the Outline highlight opacity. */
export function highlightBackground(hex: string): string {
  const red = parseInt(hex.slice(1, 3), 16)
  const green = parseInt(hex.slice(3, 5), 16)
  const blue = parseInt(hex.slice(5, 7), 16)

  return `rgba(${red}, ${green}, ${blue}, ${HIGHLIGHT_OPACITY})`
}
