import { comparePosition } from './compare'

describe('comparePosition', () => {
  it('orders by position first', () => {
    expect(comparePosition({ position: 'a0' }, { position: 'a1' })).toBeLessThan(0)
  })

  it('breaks position ties with clientId', () => {
    expect(comparePosition({ position: 'a0', clientId: 'a' }, { position: 'a0', clientId: 'b' })).toBeLessThan(0)
  })

  it('breaks clientId ties with opId', () => {
    expect(
      comparePosition({ position: 'a0', clientId: 'a', opId: '1' }, { position: 'a0', clientId: 'a', opId: '2' }),
    ).toBeLessThan(0)
  })
})
