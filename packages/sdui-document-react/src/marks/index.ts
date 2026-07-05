import { boldMark } from './bold/bold'
import { codeMark } from './code/code'
import { colorMark } from './color/color'
import { highlightMark } from './highlight/highlight'
import { italicMark } from './italic/italic'
import { linkMark } from './link/link'
import { strikethroughMark } from './strikethrough/strikethrough'
import type { SduiMarkDefinition } from './types'
import { underlineMark } from './underline/underline'

/**
 * Mark registry — single source for the PM schema, serialization,
 * keymaps, input rules, and the static renderer.
 *
 * Order matters: it is the PM schema mark order (mark sort/nesting order).
 */
export const MARK_DEFINITIONS: readonly SduiMarkDefinition[] = [
  boldMark,
  italicMark,
  strikethroughMark,
  underlineMark,
  highlightMark,
  colorMark,
  codeMark,
  linkMark,
]

export const markDefinitionByName: Record<string, SduiMarkDefinition> = MARK_DEFINITIONS.reduce(
  (byName, definition) => ({ ...byName, [definition.name]: definition }),
  {},
)

export type { HighlightPreset } from './highlight/palette'
export { HIGHLIGHT_OPACITY, HIGHLIGHT_PALETTE, highlightBackground } from './highlight/palette'
export type { SduiMarkDefinition } from './types'
