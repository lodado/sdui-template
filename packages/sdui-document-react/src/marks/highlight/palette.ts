/**
 * Highlight preset palette — ported verbatim from Outline
 * (shared/utils/color.ts:75-82). Background is painted at 40% opacity
 * (Outline marks/Highlight.ts:12), keeping stored attrs a pure hex.
 */
export type HighlightPreset = {
  hex: string
  name: string
}

export const HIGHLIGHT_PALETTE: readonly HighlightPreset[] = [
  { hex: '#FDEA9B', name: 'Coral' },
  { hex: '#FED46A', name: 'Apricot' },
  { hex: '#FA551E', name: 'Sunset' },
  { hex: '#B4DC19', name: 'Smoothie' },
  { hex: '#C8AFF0', name: 'Bubblegum' },
  { hex: '#3CBEFC', name: 'Neon' },
]

export const HIGHLIGHT_OPACITY = 0.4

/** rgba() string for a palette hex at the Outline highlight opacity. */
export function highlightBackground(hex: string): string {
  const red = parseInt(hex.slice(1, 3), 16)
  const green = parseInt(hex.slice(3, 5), 16)
  const blue = parseInt(hex.slice(5, 7), 16)

  return `rgba(${red}, ${green}, ${blue}, ${HIGHLIGHT_OPACITY})`
}
