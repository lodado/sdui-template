/**
 * Notion's color palette (light mode). Each color has one base hex used two
 * ways, mirroring Notion's "text color" vs "background color" split:
 *   - as a foreground `color` mark  → the hex at full strength
 *   - as a `highlight` background   → the hex at 40% (see highlightBackground)
 */
export type NotionColor = {
  name: string
  hex: string
}

export const NOTION_COLORS: readonly NotionColor[] = [
  { name: 'Gray', hex: '#787774' },
  { name: 'Brown', hex: '#9F6B53' },
  { name: 'Orange', hex: '#D9730D' },
  { name: 'Yellow', hex: '#CB912F' },
  { name: 'Green', hex: '#448361' },
  { name: 'Blue', hex: '#337EA9' },
  { name: 'Purple', hex: '#9065B0' },
  { name: 'Pink', hex: '#C14C8A' },
  { name: 'Red', hex: '#D44C47' },
]
