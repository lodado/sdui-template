import type { SduiInlineMark } from '@lodado/sdui-document'
import type { InputRule } from 'prosemirror-inputrules'
import type { Attrs, Mark as PmMark, MarkSpec, MarkType } from 'prosemirror-model'
import type { Command } from 'prosemirror-state'
import type React from 'react'

/**
 * One inline mark, fully colocated: PM schema spec, static renderer,
 * domain <-> PM serialization, keyboard shortcut, and markdown input rule.
 *
 * Policies:
 * - `name` must equal both the SduiInlineMark type string and the PM mark name
 *   (the 1:1 no-mapping-layer contract of the focused-block schema)
 * - `renderStatic` must be visually identical to `spec.toDOM` — the static
 *   view and the PM view swap in place on focus
 */
export type SduiMarkDefinition = {
  name: SduiInlineMark['type']
  /** ProseMirror schema spec (toDOM/parseDOM ported from Outline marks/*) */
  spec: MarkSpec
  /** static InlineContentView wrapper */
  renderStatic: (children: React.ReactNode, mark: SduiInlineMark) => React.ReactNode
  /** PM attrs from the domain mark — attrs-bearing marks only */
  toPmAttrs?: (mark: SduiInlineMark) => Attrs | undefined
  /** domain mark from the PM mark */
  toSduiMark: (mark: PmMark) => SduiInlineMark
  /** keymap bindings (Outline shortcuts) */
  keys?: (markType: MarkType) => Record<string, Command>
  /** markdown input rule (Outline patterns) */
  inputRule?: (markType: MarkType) => InputRule
}
