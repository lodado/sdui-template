/**
 * Turn-into registry — per-block-type keyboard metadata, colocated the same
 * way marks/ colocates mark modules. Shortcuts and markdown prefixes are
 * ported from Outline (shared/editor/nodes/* keys() and inputRules()).
 *
 * Policies:
 * - `shortcuts` fire from the focused-block keymap and delegate to the block
 *   layer via onTurnInto (patch territory — PM never changes block structure)
 * - `inputRules` match a typed prefix at block start; the prefix is deleted
 *   from the PM doc and the type change is delegated the same way
 * - keys reserved for not-yet-implemented block types (Shift-Ctrl-8/9 lists,
 *   Shift-Ctrl-c code fence) must stay unbound until those types exist
 */

export type BlockTurnIntoShortcut = {
  /** ProseMirror keymap key string — Outline binding kept verbatim. */
  key: string
  attrs?: Record<string, unknown>
}

export type BlockTurnIntoInputRule = {
  /** Prefix pattern at block start (deleted on match). */
  pattern: RegExp
  attrs?: Record<string, unknown>
}

export type BlockTurnIntoDefinition = {
  type: string
  shortcuts?: readonly BlockTurnIntoShortcut[]
  inputRules?: readonly BlockTurnIntoInputRule[]
}

export const BLOCK_TURN_INTO_DEFINITIONS: readonly BlockTurnIntoDefinition[] = [
  {
    // Outline nodes/Paragraph.ts — Shift-Ctrl-0
    type: 'document.paragraph',
    shortcuts: [{ key: 'Shift-Ctrl-0' }],
  },
  {
    // Outline nodes/Heading.ts — Shift-Ctrl-<level>, "#"… prefixes.
    // Levels 1..4 = the range our HeadingBlock clamps to.
    type: 'document.heading',
    shortcuts: [
      { key: 'Shift-Ctrl-1', attrs: { level: 1 } },
      { key: 'Shift-Ctrl-2', attrs: { level: 2 } },
      { key: 'Shift-Ctrl-3', attrs: { level: 3 } },
      { key: 'Shift-Ctrl-4', attrs: { level: 4 } },
    ],
    inputRules: [
      { pattern: /^#\s$/, attrs: { level: 1 } },
      { pattern: /^##\s$/, attrs: { level: 2 } },
      { pattern: /^###\s$/, attrs: { level: 3 } },
      { pattern: /^####\s$/, attrs: { level: 4 } },
    ],
  },
  {
    // Outline nodes/CheckboxList.ts — Shift-Ctrl-7, "[ ] " / "[x] " prefixes
    type: 'document.checklist',
    shortcuts: [{ key: 'Shift-Ctrl-7' }],
    inputRules: [
      { pattern: /^\[\]\s$/ },
      { pattern: /^\[ \]\s$/ },
      { pattern: /^\[x\]\s$/i, attrs: { checked: true } },
    ],
  },
  {
    // Outline Blockquote "> " mapped to our callout block (no quote type yet)
    type: 'document.callout',
    inputRules: [{ pattern: /^>\s$/ }],
  },
  {
    // Outline nodes/HorizontalRule.tsx — "---" hr, "*** " page break markup
    type: 'document.divider',
    inputRules: [{ pattern: /^---$/ }, { pattern: /^\*\*\*\s$/, attrs: { markup: '***' } }],
  },
]

export type TurnIntoShortcutEntry = {
  key: string
  type: string
  attrs?: Record<string, unknown>
}

/**
 * Flattened shortcut list for keymap aggregation.
 * A duplicate key binding is a registry bug — fail fast at build time.
 */
export function turnIntoShortcutEntries(): TurnIntoShortcutEntry[] {
  const entries = BLOCK_TURN_INTO_DEFINITIONS.reduce<TurnIntoShortcutEntry[]>(
    (accumulated, definition) => [
      ...accumulated,
      ...(definition.shortcuts ?? []).map((shortcut) => ({
        key: shortcut.key,
        type: definition.type,
        ...(shortcut.attrs ? { attrs: shortcut.attrs } : {}),
      })),
    ],
    [],
  )

  const seen = new Set<string>()
  entries.forEach((entry) => {
    if (seen.has(entry.key)) {
      throw new Error(`Duplicate turn-into shortcut binding: ${entry.key}`)
    }
    seen.add(entry.key)
  })

  return entries
}

export type TurnIntoInputRuleEntry = {
  pattern: RegExp
  type: string
  attrs?: Record<string, unknown>
}

/** Flattened input-rule list for the focused-block inputRules plugin. */
export function turnIntoInputRuleEntries(): TurnIntoInputRuleEntry[] {
  return BLOCK_TURN_INTO_DEFINITIONS.reduce<TurnIntoInputRuleEntry[]>(
    (accumulated, definition) => [
      ...accumulated,
      ...(definition.inputRules ?? []).map((rule) => ({
        pattern: rule.pattern,
        type: definition.type,
        ...(rule.attrs ? { attrs: rule.attrs } : {}),
      })),
    ],
    [],
  )
}
