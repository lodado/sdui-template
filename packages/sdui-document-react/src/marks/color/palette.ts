/**
 * Foreground text-color preset palette. Stored attrs are a pure 6-digit hex
 * and painted directly as `color` (no opacity, unlike highlight backgrounds).
 */
export type TextColorPreset = {
  hex: string
  name: string
}

export const TEXT_COLOR_PALETTE: readonly TextColorPreset[] = [
  { hex: '#66778F', name: 'Gray' },
  { hex: '#0366D6', name: 'Blue' },
  { hex: '#3AD984', name: 'Green' },
  { hex: '#F5BE31', name: 'Yellow' },
  { hex: '#FA551E', name: 'Orange' },
  { hex: '#D73A49', name: 'Red' },
]
