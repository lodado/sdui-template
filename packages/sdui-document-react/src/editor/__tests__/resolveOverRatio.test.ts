import { computeOverRatio } from '../hooks/useBlockPointerDrag'

/**
 * computeOverRatio maps an absolute pointer Y onto a 0..1 position within the
 * over row (0 = top edge → "before", 1 = bottom edge → "after"). Replaces the
 * old dnd-kit `resolveOverRatio` adapter now that the drag reads the pointer
 * directly.
 */
describe('computeOverRatio', () => {
  describe('as is: a 30px-tall over row starting at y=100', () => {
    describe('when the pointer sits at the row top edge (BVA: y = rect.top)', () => {
      it('to be: 0', () => {
        expect(computeOverRatio(100, 100, 30)).toBe(0)
      })
    })

    describe('when the pointer sits mid-row (EP: middle zone)', () => {
      it('to be: 0.5', () => {
        expect(computeOverRatio(115, 100, 30)).toBe(0.5)
      })
    })

    describe('when the pointer sits at the bottom edge (BVA: y = rect.bottom)', () => {
      it('to be: 1', () => {
        expect(computeOverRatio(130, 100, 30)).toBe(1)
      })
    })

    describe('when the pointer overshoots below the row (BVA: y > rect.bottom)', () => {
      it('to be: clamped to 1', () => {
        expect(computeOverRatio(200, 100, 30)).toBe(1)
      })
    })

    describe('when the pointer overshoots above the row (BVA: y < rect.top)', () => {
      it('to be: clamped to 0', () => {
        expect(computeOverRatio(10, 100, 30)).toBe(0)
      })
    })
  })

  describe('as is: a degenerate row (EP: fallback partition → undefined = after-only projection)', () => {
    describe('when the over rect has zero height (BVA: division guard)', () => {
      it('to be: undefined', () => {
        expect(computeOverRatio(100, 100, 0)).toBeUndefined()
      })
    })

    describe('when the over rect has negative height (EP: unmeasurable)', () => {
      it('to be: undefined', () => {
        expect(computeOverRatio(100, 100, -5)).toBeUndefined()
      })
    })
  })
})
