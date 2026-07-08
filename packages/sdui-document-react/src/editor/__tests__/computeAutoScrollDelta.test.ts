import { AUTOSCROLL_EDGE_BAND, AUTOSCROLL_MAX_SPEED, computeAutoScrollDelta } from '../hooks/useBlockPointerDrag'

/**
 * Pure ramp math behind the live-drag autoscroll: speed scales linearly with
 * how deep the pointer sits inside the top/bottom edge band. The interaction
 * path (rAF loop, scroller fallback, re-hit-test) is characterized in
 * touchBlockDrag.test.tsx — this file pins the magnitudes.
 */
describe('computeAutoScrollDelta', () => {
  const TOP = 0
  const BOTTOM = 600

  describe('as is: pointer between the edge bands', () => {
    it('to be: 0 (no autoscroll)', () => {
      expect(computeAutoScrollDelta(300, TOP, BOTTOM)).toBe(0)
    })

    it('to be: 0 exactly ON the band boundary (BVA: band edge is outside)', () => {
      expect(computeAutoScrollDelta(TOP + AUTOSCROLL_EDGE_BAND, TOP, BOTTOM)).toBe(0)
      expect(computeAutoScrollDelta(BOTTOM - AUTOSCROLL_EDGE_BAND, TOP, BOTTOM)).toBe(0)
    })
  })

  describe('as is: pointer inside the bottom band', () => {
    it('to be: positive dy ramping to max speed at the very edge', () => {
      expect(computeAutoScrollDelta(BOTTOM, TOP, BOTTOM)).toBe(AUTOSCROLL_MAX_SPEED)
    })

    it('to be: half depth ramps to half speed', () => {
      const halfDepth = BOTTOM - AUTOSCROLL_EDGE_BAND / 2

      expect(computeAutoScrollDelta(halfDepth, TOP, BOTTOM)).toBe(Math.ceil(AUTOSCROLL_MAX_SPEED / 2))
    })

    it('to be: minimum 1px just inside the band (ceil keeps the scroll from stalling)', () => {
      expect(computeAutoScrollDelta(BOTTOM - AUTOSCROLL_EDGE_BAND + 1, TOP, BOTTOM)).toBe(1)
    })
  })

  describe('as is: pointer inside the top band', () => {
    it('to be: negative dy, symmetric to the bottom ramp', () => {
      expect(computeAutoScrollDelta(TOP, TOP, BOTTOM)).toBe(-AUTOSCROLL_MAX_SPEED)
      expect(computeAutoScrollDelta(TOP + AUTOSCROLL_EDGE_BAND - 1, TOP, BOTTOM)).toBe(-1)
    })
  })

  describe('as is: custom band and speed (scroller-specific tuning)', () => {
    it('to be: parameters override the defaults', () => {
      expect(computeAutoScrollDelta(95, 0, 100, 10, 20)).toBe(10) // half depth of a 10px band, max 20
    })
  })
})
