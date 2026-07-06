import { filterEmojis } from './filterEmojis'

describe('filterEmojis', () => {
  it('returns all emojis for an empty query', () => {
    expect(filterEmojis('').length).toBeGreaterThan(20)
  })

  it('matches by keyword, case-insensitive', () => {
    expect(filterEmojis('SMILE').some((e) => e.char === '😄')).toBe(true)
  })

  it('matches by name substring', () => {
    expect(filterEmojis('rocket').some((e) => e.char === '🚀')).toBe(true)
  })
})
