import { generatePositionBetween, generatePositions } from './generate'

describe('generatePositionBetween', () => {
  it('generates a key between two siblings', () => {
    const key = generatePositionBetween('a0', 'a2')
    expect(key > 'a0' && key < 'a2').toBe(true)
  })

  it('generates the first key when both bounds are null', () => {
    expect(generatePositionBetween(null, null)).toBe('a0')
  })

  it('generates a key after the last sibling', () => {
    const key = generatePositionBetween('a1', null)
    expect(key > 'a1').toBe(true)
  })

  it('generates a key before the first sibling', () => {
    const key = generatePositionBetween(null, 'a1')
    expect(key < 'a1').toBe(true)
  })
})

describe('generatePositions', () => {
  it('returns an empty array for count 0', () => {
    expect(generatePositions(null, null, 0)).toEqual([])
  })

  it('returns evenly spaced keys in sorted order', () => {
    const keys = generatePositions(null, null, 3)
    expect(keys).toHaveLength(3)
    expect([...keys].sort()).toEqual(keys)
  })
})
