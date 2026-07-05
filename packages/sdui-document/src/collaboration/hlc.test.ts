import { compareHlc, decodeHlc, encodeHlc, hlcMerge, hlcTick } from './hlc'

describe('hlcTick', () => {
  test('advances physical component when wall clock moves forward', () => {
    const first = hlcTick(null, 100, 'a')
    const second = hlcTick(first, 200, 'a')

    expect(second).toEqual({ millis: 200, counter: 0, actorId: 'a' })
  })

  test('stays monotonic when wall clock stalls or goes backwards', () => {
    const first = hlcTick(null, 100, 'a')
    const stalled = hlcTick(first, 100, 'a')
    const backwards = hlcTick(stalled, 50, 'a')

    expect(stalled).toEqual({ millis: 100, counter: 1, actorId: 'a' })
    expect(backwards).toEqual({ millis: 100, counter: 2, actorId: 'a' })
    expect(compareHlc(backwards, stalled)).toBeGreaterThan(0)
  })
})

describe('hlcMerge', () => {
  test('advances past a remote timestamp from the future', () => {
    const local = hlcTick(null, 100, 'a')
    const remote = { millis: 500, counter: 3, actorId: 'b' }

    const merged = hlcMerge(local, remote, 100, 'a')

    expect(merged.millis).toBe(500)
    expect(merged.counter).toBe(4)
    expect(compareHlc(merged, remote)).toBeGreaterThan(0)
  })

  test('uses physical time when it dominates both clocks', () => {
    const local = hlcTick(null, 100, 'a')
    const remote = { millis: 200, counter: 9, actorId: 'b' }

    const merged = hlcMerge(local, remote, 900, 'a')

    expect(merged).toEqual({ millis: 900, counter: 0, actorId: 'a' })
  })
})

describe('compareHlc / encodeHlc', () => {
  test('orders by millis, then counter, then actorId', () => {
    const base = { millis: 100, counter: 0, actorId: 'a' }

    expect(compareHlc(base, { millis: 101, counter: 0, actorId: 'a' })).toBeLessThan(0)
    expect(compareHlc(base, { millis: 100, counter: 1, actorId: 'a' })).toBeLessThan(0)
    expect(compareHlc(base, { millis: 100, counter: 0, actorId: 'b' })).toBeLessThan(0)
    expect(compareHlc(base, { millis: 100, counter: 0, actorId: 'a' })).toBe(0)
  })

  test('encoded strings sort identically to compareHlc and round-trip', () => {
    const stamps = [
      { millis: 2, counter: 0, actorId: 'a' },
      { millis: 100, counter: 5, actorId: 'z' },
      { millis: 100, counter: 12, actorId: 'a' },
      { millis: 1000, counter: 0, actorId: 'a' },
    ]

    const byCompare = [...stamps].sort(compareHlc).map(encodeHlc)
    const byString = stamps.map(encodeHlc).sort()

    expect(byString).toEqual(byCompare)
    expect(decodeHlc(encodeHlc(stamps[1]))).toEqual(stamps[1])
  })
})
