/**
 * Named block colors (Notion-style). Stored on block.attributes as
 * `textColor` / `backgroundColor`; the names map to CSS custom properties in
 * editor.css so themes (light/dark) can remap without touching data.
 */
export const BLOCK_COLOR_NAMES = [
  'default',
  'gray',
  'brown',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'red',
] as const

export type BlockColorName = (typeof BLOCK_COLOR_NAMES)[number]

/** Human labels for the color-picker rows. */
export const BLOCK_COLOR_LABELS: Record<BlockColorName, string> = {
  default: 'Default',
  gray: 'Gray',
  brown: 'Brown',
  orange: 'Orange',
  yellow: 'Yellow',
  green: 'Green',
  blue: 'Blue',
  purple: 'Purple',
  pink: 'Pink',
  red: 'Red',
}

export function isBlockColorName(value: unknown): value is BlockColorName {
  return typeof value === 'string' && (BLOCK_COLOR_NAMES as readonly string[]).includes(value)
}

/**
 * Data-attribute value for a stored color: the name when it's a known
 * non-default color, else undefined (so `default` / junk render no attribute).
 */
export function blockColorAttr(value: unknown): string | undefined {
  return isBlockColorName(value) && value !== 'default' ? value : undefined
}
