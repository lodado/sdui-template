import type { DragMoveEvent } from '@dnd-kit/core'

import { resolveOverRatio } from '../hooks/useNestedBlockDragDrop'

/**
 * Builds the minimal dnd-kit event shape resolveOverRatio consumes:
 * activator pointer position + accumulated delta + the over droppable rect.
 */
function createEvent(input: {
  clientY?: number
  deltaY: number
  overRect?: { top: number; height: number }
}): DragMoveEvent {
  const { clientY, deltaY, overRect } = input

  return {
    activatorEvent: clientY === undefined ? ({} as Event) : ({ clientY } as unknown as Event),
    delta: { x: 0, y: deltaY },
    over: overRect ? { id: 'target', rect: overRect } : null,
  } as unknown as DragMoveEvent
}

describe('resolveOverRatio', () => {
  describe('as is: a 30px-tall over row starting at y=100', () => {
    describe('when the pointer sits at the row top edge (BVA: y = rect.top)', () => {
      it('to be: 0', () => {
        expect(resolveOverRatio(createEvent({ clientY: 100, deltaY: 0, overRect: { top: 100, height: 30 } }))).toBe(0)
      })
    })

    describe('when the pointer sits mid-row (EP: middle zone)', () => {
      it('to be: 0.5', () => {
        expect(resolveOverRatio(createEvent({ clientY: 115, deltaY: 0, overRect: { top: 100, height: 30 } }))).toBe(0.5)
      })
    })

    describe('when the pointer reached the row via drag delta (EP: activator + delta composition)', () => {
      it('to be: the ratio of the CURRENT pointer position, not the drag start', () => {
        // started at y=40, dragged +75 → current pointer y=115 → middle of the row
        expect(resolveOverRatio(createEvent({ clientY: 40, deltaY: 75, overRect: { top: 100, height: 30 } }))).toBe(0.5)
      })
    })

    describe('when the pointer overshoots below the row (BVA: y > rect.bottom)', () => {
      it('to be: clamped to 1', () => {
        expect(resolveOverRatio(createEvent({ clientY: 200, deltaY: 0, overRect: { top: 100, height: 30 } }))).toBe(1)
      })
    })

    describe('when the pointer overshoots above the row (BVA: y < rect.top)', () => {
      it('to be: clamped to 0', () => {
        expect(resolveOverRatio(createEvent({ clientY: 10, deltaY: 0, overRect: { top: 100, height: 30 } }))).toBe(0)
      })
    })
  })

  describe('as is: degenerate inputs (EP: fallback partition → undefined = legacy projection)', () => {
    describe('when there is no over droppable', () => {
      it('to be: undefined', () => {
        expect(resolveOverRatio(createEvent({ clientY: 100, deltaY: 0 }))).toBeUndefined()
      })
    })

    describe('when the activator event has no clientY (EP: keyboard activation)', () => {
      it('to be: undefined', () => {
        expect(resolveOverRatio(createEvent({ deltaY: 0, overRect: { top: 100, height: 30 } }))).toBeUndefined()
      })
    })

    describe('when the over rect has zero height (BVA: division guard)', () => {
      it('to be: undefined', () => {
        expect(
          resolveOverRatio(createEvent({ clientY: 100, deltaY: 0, overRect: { top: 100, height: 0 } })),
        ).toBeUndefined()
      })
    })
  })
})
