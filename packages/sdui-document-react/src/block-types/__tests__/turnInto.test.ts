import { BLOCK_TURN_INTO_DEFINITIONS, turnIntoInputRuleEntries, turnIntoShortcutEntries } from '../turnInto'

describe('turn-into registry', () => {
  describe('as is: the registry as shipped', () => {
    it('to be: shortcut keys are unique (duplicate binding = registry bug)', () => {
      expect(() => turnIntoShortcutEntries()).not.toThrow()

      const keys = turnIntoShortcutEntries().map((entry) => entry.key)
      expect(new Set(keys).size).toBe(keys.length)
    })

    it('to be: Outline bindings present — Shift-Ctrl-0/1..4/7', () => {
      const byKey = turnIntoShortcutEntries().reduce<Record<string, { type: string; attrs?: unknown }>>(
        (map, entry) => ({ ...map, [entry.key]: { type: entry.type, attrs: entry.attrs } }),
        {},
      )

      expect(byKey['Shift-Ctrl-0']).toEqual({ type: 'document.paragraph', attrs: undefined })
      expect(byKey['Shift-Ctrl-1']).toEqual({ type: 'document.heading', attrs: { level: 1 } })
      expect(byKey['Shift-Ctrl-4']).toEqual({ type: 'document.heading', attrs: { level: 4 } })
      expect(byKey['Shift-Ctrl-7']).toEqual({ type: 'document.checklist', attrs: undefined })
    })

    it('to be: markdown prefixes cover heading/checklist/divider', () => {
      const patterns = turnIntoInputRuleEntries().map((entry) => ({
        source: entry.pattern.source,
        type: entry.type,
      }))

      expect(patterns).toEqual(
        expect.arrayContaining([
          { source: '^#\\s$', type: 'document.heading' },
          { source: '^####\\s$', type: 'document.heading' },
          { source: '^\\[\\]\\s$', type: 'document.checklist' },
          { source: '^\\[x\\]\\s$', type: 'document.checklist' },
          { source: '^---$', type: 'document.divider' },
        ]),
      )
    })

    it('to be: "[x] " prefix carries checked: true', () => {
      const checked = turnIntoInputRuleEntries().find((entry) => entry.pattern.source === '^\\[x\\]\\s$')

      expect(checked?.attrs).toEqual({ checked: true })
    })

    it('to be: notion input rule triggers map to the new block types', () => {
      const rules = turnIntoInputRuleEntries()
      const match = (text: string) => rules.find((rule) => rule.pattern.test(text))

      expect(match('- ')?.type).toBe('document.bulleted-list')
      expect(match('* ')?.type).toBe('document.bulleted-list')
      expect(match('+ ')?.type).toBe('document.bulleted-list')
      expect(match('1. ')?.type).toBe('document.numbered-list')
      expect(match('2) ')?.type).toBe('document.numbered-list')
      expect(match('> ')?.type).toBe('document.toggle')
      expect(match('" ')?.type).toBe('document.quote')
      expect(match('```')?.type).toBe('document.code')
    })

    it('to be: callout no longer owns an input rule ("> " belongs to toggle)', () => {
      const calloutRules = turnIntoInputRuleEntries().filter((entry) => entry.type === 'document.callout')

      expect(calloutRules).toEqual([])
    })

    it('to be: list/code shortcuts are bound (Shift-Ctrl-8/9/c)', () => {
      const byKey = turnIntoShortcutEntries().reduce<Record<string, string>>(
        (map, entry) => ({ ...map, [entry.key]: entry.type }),
        {},
      )

      expect(byKey['Shift-Ctrl-8']).toBe('document.bulleted-list')
      expect(byKey['Shift-Ctrl-9']).toBe('document.numbered-list')
      expect(byKey['Shift-Ctrl-c']).toBe('document.code')
    })
  })

  describe('as is: a registry with a duplicate key (defensive)', () => {
    it('to be: aggregation throws', () => {
      const definitions = [
        ...BLOCK_TURN_INTO_DEFINITIONS,
        { type: 'document.fake', shortcuts: [{ key: 'Shift-Ctrl-1' }] },
      ]
      const aggregate = () => {
        const seen = new Set<string>()
        definitions.forEach((definition) =>
          (definition.shortcuts ?? []).forEach((shortcut) => {
            if (seen.has(shortcut.key)) {
              throw new Error(`Duplicate turn-into shortcut binding: ${shortcut.key}`)
            }
            seen.add(shortcut.key)
          }),
        )
      }

      expect(aggregate).toThrow(/Duplicate/)
    })
  })
})
