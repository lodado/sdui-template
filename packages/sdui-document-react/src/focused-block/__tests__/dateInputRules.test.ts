import { formatDateDisplay, resolveDateToken } from '../pm/dateInputRules'

describe('resolveDateToken', () => {
  it('resolves an explicit ISO date unchanged', () => {
    expect(resolveDateToken('2026-07-06')).toBe('2026-07-06')
  })

  it('resolves today and tomorrow to ISO dates one day apart', () => {
    const today = resolveDateToken('today')
    const tomorrow = resolveDateToken('TOMORROW')
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(tomorrow).toMatch(/^\d{4}-\d{2}-\d{2}$/)

    const dayMs = 24 * 60 * 60 * 1000
    const diff = new Date(`${tomorrow}T00:00:00`).getTime() - new Date(`${today}T00:00:00`).getTime()
    expect(diff).toBe(dayMs)
  })

  it('returns null for unrecognized or invalid tokens', () => {
    expect(resolveDateToken('someday')).toBeNull()
    expect(resolveDateToken('2026-13-40')).toBeNull()
  })
})

describe('formatDateDisplay', () => {
  it('produces a human-readable label for a valid ISO date', () => {
    expect(formatDateDisplay('2026-07-06')).toMatch(/2026/)
  })
})
