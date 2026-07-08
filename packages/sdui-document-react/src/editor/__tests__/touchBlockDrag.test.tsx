import { createDocumentBlock, type SduiDocumentContent } from '@lodado/sdui-document'
import { act, render } from '@testing-library/react'
import React from 'react'

import {
  ACTIVATION_DISTANCE,
  hasPassedThreshold,
  TOUCH_ACTIVATION_DISTANCE,
  TOUCH_LONG_PRESS_MS,
} from '../hooks/useBlockPointerDrag'
import { SduiDocumentEditor } from '../SduiDocumentEditor'

function content(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({ id: 'a', type: 'document.paragraph', position: 'a0', state: { text: 'AAA' } }),
        createDocumentBlock({ id: 'b', type: 'document.paragraph', position: 'a1', state: { text: 'BBB' } }),
      ],
    }),
  }
}

/**
 * jsdom has no PointerEvent — a MouseEvent carrying the pointer event TYPE plus a
 * hand-set pointerType/pointerId behaves identically for the native listeners the
 * drag hook attaches (it reads clientX/Y, button, pointerType, pointerId).
 */
function firePointer(
  type: string,
  props: { clientX?: number; clientY?: number; pointerType?: string; pointerId?: number },
  target: EventTarget,
) {
  const event = new MouseEvent(type, {
    clientX: props.clientX ?? 0,
    clientY: props.clientY ?? 0,
    button: 0,
    bubbles: true,
    cancelable: true,
  })
  Object.defineProperty(event, 'pointerType', { value: props.pointerType ?? 'mouse' })
  Object.defineProperty(event, 'pointerId', { value: props.pointerId ?? 1 })
  act(() => {
    target.dispatchEvent(event)
  })
  return event
}

const dragHandle = (container: HTMLElement) =>
  container.querySelector('[data-block-id="a"] [data-drag-handle]') as HTMLElement
const ghostEl = () => document.querySelector('[data-drag-ghost]')

// The context menu can't be judged by defaultPrevented — BlockNode's own
// onContextMenu always preventDefaults to open the block menu. The real signal is
// propagation: a live handle press stops the event in the capture phase, so it
// never reaches BlockNode (or a window-bubble probe).
function contextMenuReachesTarget(handle: HTMLElement): boolean {
  let reached = false
  const probe = () => {
    reached = true
  }
  window.addEventListener('contextmenu', probe)
  const menu = new MouseEvent('contextmenu', { bubbles: true, cancelable: true })
  act(() => handle.dispatchEvent(menu))
  window.removeEventListener('contextmenu', probe)
  return reached
}

describe('hasPassedThreshold (activation distance BVA)', () => {
  describe('as is: mouse activation distance', () => {
    describe(`when travel is one px below the ${ACTIVATION_DISTANCE}px threshold`, () => {
      it('to be: still a click (false)', () => {
        // BVA min-1: 3px < 4px
        expect(hasPassedThreshold(ACTIVATION_DISTANCE - 1, 0, ACTIVATION_DISTANCE)).toBe(false)
      })
    })

    describe(`when travel is exactly the ${ACTIVATION_DISTANCE}px threshold`, () => {
      it('to be: promoted to a drag (true)', () => {
        // BVA at boundary: hypot == distance activates
        expect(hasPassedThreshold(ACTIVATION_DISTANCE, 0, ACTIVATION_DISTANCE)).toBe(true)
      })
    })
  })

  describe('as is: touch activation distance', () => {
    describe(`when travel is one px below the ${TOUCH_ACTIVATION_DISTANCE}px touch threshold`, () => {
      it('to be: still a tap (false)', () => {
        // BVA min-1: 9px < 10px — tolerates finger jitter
        expect(hasPassedThreshold(TOUCH_ACTIVATION_DISTANCE - 1, 0, TOUCH_ACTIVATION_DISTANCE)).toBe(false)
      })
    })

    describe(`when travel is exactly the ${TOUCH_ACTIVATION_DISTANCE}px touch threshold`, () => {
      it('to be: promoted to a drag (true)', () => {
        expect(hasPassedThreshold(TOUCH_ACTIVATION_DISTANCE, 0, TOUCH_ACTIVATION_DISTANCE)).toBe(true)
      })
    })
  })
})

describe('useBlockPointerDrag activation policy', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    // jsdom implements neither — the live-drag autoscroll tick calls both
    window.scrollBy = jest.fn()
    ;(document as unknown as { elementFromPoint: () => Element | null }).elementFromPoint = () => null
  })
  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    // ghosts append to <body>, outside the RTL container — clean up
    document.querySelectorAll('[data-drag-ghost]').forEach((n) => n.remove())
  })

  describe('as is: a touch press on the drag handle', () => {
    describe(`when released before the ${TOUCH_LONG_PRESS_MS}ms long-press, without moving`, () => {
      it('to be: no drag (stays a tap that opens the block menu)', () => {
        const { container } = render(<SduiDocumentEditor content={content()} />)
        const handle = dragHandle(container)

        firePointer('pointerdown', { pointerType: 'touch', clientX: 10, clientY: 10 }, handle)
        expect(ghostEl()).toBeNull()
        firePointer('pointerup', { pointerType: 'touch', clientX: 10, clientY: 10 }, window)
        // BVA: advance well past the delay — a released press must never activate late
        act(() => jest.advanceTimersByTime(TOUCH_LONG_PRESS_MS * 2))

        expect(ghostEl()).toBeNull()
      })
    })

    describe(`when held to the ${TOUCH_LONG_PRESS_MS}ms long-press delay without moving`, () => {
      it('to be: drag activates (ghost appears)', () => {
        const { container } = render(<SduiDocumentEditor content={content()} />)
        const handle = dragHandle(container)

        firePointer('pointerdown', { pointerType: 'touch', clientX: 10, clientY: 10 }, handle)
        // BVA min-1: just before the delay — not yet a drag
        act(() => jest.advanceTimersByTime(TOUCH_LONG_PRESS_MS - 1))
        expect(ghostEl()).toBeNull()
        // BVA at boundary: the delay elapses — drag activates
        act(() => jest.advanceTimersByTime(1))

        expect(ghostEl()).not.toBeNull()
      })
    })

    describe('when moved one px below the touch threshold before the delay', () => {
      it('to be: no drag (jitter is not a drag)', () => {
        const { container } = render(<SduiDocumentEditor content={content()} />)
        const handle = dragHandle(container)

        firePointer('pointerdown', { pointerType: 'touch', clientX: 10, clientY: 10 }, handle)
        // BVA min-1: 9px of vertical travel < 10px touch threshold
        firePointer(
          'pointermove',
          { pointerType: 'touch', clientX: 10, clientY: 10 + (TOUCH_ACTIVATION_DISTANCE - 1) },
          window,
        )

        expect(ghostEl()).toBeNull()
      })
    })

    describe('when moved exactly the touch threshold before the delay', () => {
      it('to be: drag activates immediately (ghost appears)', () => {
        const { container } = render(<SduiDocumentEditor content={content()} />)
        const handle = dragHandle(container)

        firePointer('pointerdown', { pointerType: 'touch', clientX: 10, clientY: 10 }, handle)
        // BVA at boundary: 10px vertical travel == touch threshold
        firePointer(
          'pointermove',
          { pointerType: 'touch', clientX: 10, clientY: 10 + TOUCH_ACTIVATION_DISTANCE },
          window,
        )

        expect(ghostEl()).not.toBeNull()
      })
    })
  })

  describe('as is: a mouse press on the drag handle', () => {
    describe('when moved one px below the mouse threshold', () => {
      it('to be: no drag (stays a click)', () => {
        const { container } = render(<SduiDocumentEditor content={content()} />)
        const handle = dragHandle(container)

        firePointer('pointerdown', { clientX: 10, clientY: 10 }, handle)
        // BVA min-1: 3px < 4px mouse threshold
        firePointer('pointermove', { clientX: 10, clientY: 10 + (ACTIVATION_DISTANCE - 1) }, window)

        expect(ghostEl()).toBeNull()
      })
    })

    describe('when moved exactly the mouse threshold', () => {
      it('to be: drag activates (ghost appears)', () => {
        const { container } = render(<SduiDocumentEditor content={content()} />)
        const handle = dragHandle(container)

        firePointer('pointerdown', { clientX: 10, clientY: 10 }, handle)
        // BVA at boundary: 4px == mouse threshold
        firePointer('pointermove', { clientX: 10, clientY: 10 + ACTIVATION_DISTANCE }, window)

        expect(ghostEl()).not.toBeNull()
      })
    })
  })
})

describe('useBlockPointerDrag context-menu suppression', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    window.scrollBy = jest.fn()
    ;(document as unknown as { elementFromPoint: () => Element | null }).elementFromPoint = () => null
  })
  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    document.querySelectorAll('[data-drag-ghost]').forEach((n) => n.remove())
  })

  describe('as is: a live touch handle press (drag session open)', () => {
    describe('when the long-press context menu fires', () => {
      it('to be: stopped before it reaches the block (no menu interrupt)', () => {
        const { container } = render(<SduiDocumentEditor content={content()} />)
        const handle = dragHandle(container)

        firePointer('pointerdown', { pointerType: 'touch', clientX: 10, clientY: 10 }, handle)

        expect(contextMenuReachesTarget(handle)).toBe(false)
      })
    })
  })

  describe('as is: no active handle press (plain right-click)', () => {
    describe('when a context menu fires on the handle', () => {
      it('to be: reaches the block (menu can open)', () => {
        const { container } = render(<SduiDocumentEditor content={content()} />)
        const handle = dragHandle(container)

        expect(contextMenuReachesTarget(handle)).toBe(true)
      })
    })
  })
})

describe('useBlockPointerDrag trailing-click suppression lifecycle', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    window.scrollBy = jest.fn()
    ;(document as unknown as { elementFromPoint: () => Element | null }).elementFromPoint = () => null
  })
  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    document.querySelectorAll('[data-drag-ghost]').forEach((n) => n.remove())
  })

  describe('as is: a completed mouse drag-drop', () => {
    describe('when the browser fires its synchronous trailing click', () => {
      it('to be: swallowed (block menu does not pop after a drop)', () => {
        const { container } = render(<SduiDocumentEditor content={content()} />)
        const handle = dragHandle(container)

        firePointer('pointerdown', { clientX: 10, clientY: 10 }, handle)
        firePointer('pointermove', { clientX: 40, clientY: 200 }, window)
        firePointer('pointerup', { clientX: 40, clientY: 200 }, window)

        // trailing click arrives in the same task, before the disarm timeout
        const click = new MouseEvent('click', { bubbles: true, cancelable: true })
        act(() => window.dispatchEvent(click))
        expect(click.defaultPrevented).toBe(true)
      })
    })
  })

  describe('as is: a completed touch drag-drop (no trailing click emitted)', () => {
    describe('when the user taps again a task later', () => {
      it('to be: NOT swallowed (no armed listener left behind)', () => {
        const { container } = render(<SduiDocumentEditor content={content()} />)
        const handle = dragHandle(container)

        firePointer('pointerdown', { pointerType: 'touch', clientX: 10, clientY: 10 }, handle)
        act(() => jest.advanceTimersByTime(TOUCH_LONG_PRESS_MS)) // long-press → activate
        firePointer('pointermove', { pointerType: 'touch', clientX: 40, clientY: 200 }, window)
        firePointer('pointerup', { pointerType: 'touch', clientX: 40, clientY: 200 }, window)
        // disarm timeout (setTimeout 0) runs — the guard is removed
        act(() => jest.advanceTimersByTime(1))

        const tap = new MouseEvent('click', { bubbles: true, cancelable: true })
        act(() => window.dispatchEvent(tap))
        expect(tap.defaultPrevented).toBe(false)
      })
    })
  })
})
