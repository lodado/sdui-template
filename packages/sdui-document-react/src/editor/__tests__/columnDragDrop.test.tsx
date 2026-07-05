import type { DragEndEvent, DragMoveEvent } from '@dnd-kit/core'
import type { SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock, findBlockById } from '@lodado/sdui-document'
import { renderHook } from '@testing-library/react'
import type { MutableRefObject } from 'react'

import { positionDropIndicatorOverlay } from '../hooks/dropIndicatorOverlay'
import { resolveOverPointerX, useNestedBlockDragDrop } from '../hooks/useNestedBlockDragDrop'

const INDENT_WIDTH = 24

/**
 * Minimal dnd-kit event shape the horizontal projection consumes: activator
 * pointer X + accumulated delta + the over droppable rect.
 */
function createEvent(input: {
  activeId?: string
  overId?: string
  clientX?: number
  deltaX?: number
  overRect?: { left: number; width: number }
}): DragEndEvent {
  const { activeId = 'block-a', overId, clientX, deltaX = 0, overRect } = input

  return {
    active: { id: activeId },
    activatorEvent: clientX === undefined ? ({} as Event) : ({ clientX, clientY: 10 } as unknown as Event),
    delta: { x: deltaX, y: 0 },
    over: overId ? { id: overId, rect: { left: 0, width: 0, top: 0, height: 0, ...overRect } } : null,
  } as unknown as DragEndEvent
}

describe('resolveOverPointerX', () => {
  describe('as is: a 200px-wide over row starting at x=100', () => {
    const rect = { left: 100, width: 200 }

    describe('when the pointer sits at the left edge (BVA: x = rect.left)', () => {
      it('to be: offset 0 with the row width', () => {
        expect(resolveOverPointerX(createEvent({ overId: 't', clientX: 100, overRect: rect }))).toEqual({
          offsetX: 0,
          width: 200,
        })
      })
    })

    describe('when the pointer reached the middle via drag delta (EP: activator + delta composition)', () => {
      it('to be: the CURRENT pointer offset, not the drag start', () => {
        expect(resolveOverPointerX(createEvent({ overId: 't', clientX: 50, deltaX: 150, overRect: rect }))).toEqual({
          offsetX: 100,
          width: 200,
        })
      })
    })

    describe('when the pointer overshoots past the right edge (BVA: x > rect.right)', () => {
      it('to be: an UNCLAMPED offset beyond the width (overshoot still reads as that edge)', () => {
        expect(resolveOverPointerX(createEvent({ overId: 't', clientX: 400, overRect: rect }))).toEqual({
          offsetX: 300,
          width: 200,
        })
      })
    })
  })

  describe('as is: degenerate inputs (EP: fallback partition)', () => {
    describe('when there is no over droppable', () => {
      it('to be: undefined', () => {
        expect(resolveOverPointerX(createEvent({ clientX: 100 }))).toBeUndefined()
      })
    })

    describe('when the activator has no clientX (EP: keyboard activation)', () => {
      it('to be: undefined', () => {
        expect(resolveOverPointerX(createEvent({ overId: 't', overRect: { left: 0, width: 100 } }))).toBeUndefined()
      })
    })

    describe('when the over rect has zero width (BVA: division guard)', () => {
      it('to be: undefined', () => {
        expect(
          resolveOverPointerX(createEvent({ overId: 't', clientX: 10, overRect: { left: 0, width: 0 } })),
        ).toBeUndefined()
      })
    })
  })
})

describe('useNestedBlockDragDrop horizontal drops', () => {
  function createContent(): SduiDocumentContent {
    return {
      schemaVersion: '1.0',
      root: createDocumentBlock({
        id: 'root',
        type: 'document.root',
        children: [
          createDocumentBlock({ id: 'block-a', type: 'document.paragraph', state: { text: 'A' } }),
          createDocumentBlock({ id: 'block-b', type: 'document.paragraph', state: { text: 'B' } }),
        ],
      }),
    }
  }

  function setup() {
    const docRef = { current: createContent() } as MutableRefObject<SduiDocumentContent>
    const applyPatches = jest.fn()
    const container = document.createElement('div')
    const indicator = document.createElement('div')
    container.appendChild(indicator)

    const { result } = renderHook(() =>
      useNestedBlockDragDrop({
        docRef,
        indentWidth: INDENT_WIDTH,
        containerRef: { current: container },
        indicatorRef: { current: indicator },
        applyPatches,
        onDragStart: jest.fn(),
      }),
    )

    return { result, applyPatches, docRef }
  }

  // 200px row at x=0: ratio 0.1 → left zone, 0.9 → right zone, 0.5 → middle
  const overRect = { left: 0, width: 200 }

  describe('as is: a drag hovering the RIGHT edge band of another row', () => {
    describe('when the drag ends (pointer at x=180, 20px from the right edge < 40px band)', () => {
      it('to be: a column split batch applied — over left, active right', () => {
        const { result, applyPatches, docRef } = setup()

        result.current.handleDragEnd(createEvent({ activeId: 'block-a', overId: 'block-b', clientX: 180, overRect }))

        expect(applyPatches).toHaveBeenCalledTimes(1)
        const patches = applyPatches.mock.calls[0][0]
        expect(patches[0]).toMatchObject({ type: 'block.insert', parentId: 'root' })
        expect(patches[0].block.type).toBe('document.columnList')
        expect(patches[0].block.children.map((child: { id: string }) => child.id)).toEqual([
          'block-b-col',
          'block-a-col',
        ])
        expect(patches[1]).toMatchObject({ type: 'block.move', blockId: 'block-b', parentId: 'block-b-col' })
        expect(patches[2]).toMatchObject({ type: 'block.move', blockId: 'block-a', parentId: 'block-a-col' })
        // sanity: the doc in the ref is untouched (applyPatches owns the state)
        expect(findBlockById(docRef.current, 'block-b-cols')).toBeUndefined()
      })
    })
  })

  describe('as is: a drag hovering the MIDDLE of another row (EP: vertical partition)', () => {
    describe('when the drag ends (pointer at x=100, center of a 200px row)', () => {
      it('to be: the vertical move path — a single block.move patch, no columnList', () => {
        const { result, applyPatches } = setup()

        result.current.handleDragEnd(createEvent({ activeId: 'block-a', overId: 'block-b', clientX: 100, overRect }))

        expect(applyPatches).toHaveBeenCalledTimes(1)
        const patches = applyPatches.mock.calls[0][0]
        expect(patches).toHaveLength(1)
        expect(patches[0]).toMatchObject({ type: 'block.move', blockId: 'block-a' })
      })
    })
  })

  describe('as is: a WIDE 800px row where the old 20% ratio zone would have split', () => {
    describe('when the drag ends 100px from the right edge (inside old ratio zone, outside the 40px band)', () => {
      it('to be: the vertical move path — the band must NOT scale with row width', () => {
        const { result, applyPatches } = setup()

        result.current.handleDragEnd(
          createEvent({ activeId: 'block-a', overId: 'block-b', clientX: 700, overRect: { left: 0, width: 800 } }),
        )

        expect(applyPatches).toHaveBeenCalledTimes(1)
        const patches = applyPatches.mock.calls[0][0]
        expect(patches).toHaveLength(1)
        expect(patches[0]).toMatchObject({ type: 'block.move', blockId: 'block-a' })
      })
    })

    describe('when the drag ends 20px from the right edge (inside the band)', () => {
      it('to be: a column split', () => {
        const { result, applyPatches } = setup()

        result.current.handleDragEnd(
          createEvent({ activeId: 'block-a', overId: 'block-b', clientX: 780, overRect: { left: 0, width: 800 } }),
        )

        const patches = applyPatches.mock.calls[0][0]
        expect(patches[0].block.type).toBe('document.columnList')
      })
    })
  })

  describe('as is: a drag with no droppable under the pointer (negative partition)', () => {
    describe('when the drag ends', () => {
      it('to be: nothing applied', () => {
        const { result, applyPatches } = setup()

        result.current.handleDragEnd(createEvent({ activeId: 'block-a', clientX: 180 }))

        expect(applyPatches).not.toHaveBeenCalled()
      })
    })
  })
})

describe('positionDropIndicatorOverlay horizontal painting', () => {
  function createDom() {
    const container = document.createElement('div')
    const row = document.createElement('div')
    row.setAttribute('data-block-id', 'target')
    row.setAttribute('data-depth', '1')
    const rowContent = document.createElement('div')
    row.appendChild(rowContent)
    container.appendChild(row)

    const overlay = document.createElement('div')
    overlay.style.display = 'none'
    container.appendChild(overlay)

    return { container, overlay, rowContent }
  }

  function stubRect(element: Element, rect: { top: number; bottom: number; left: number; width: number }) {
    jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
      ...rect,
      height: rect.bottom - rect.top,
      right: rect.left + rect.width,
      x: rect.left,
      y: rect.top,
      toJSON: () => ({}),
    } as DOMRect)
  }

  describe('as is: a hidden overlay and a horizontal drop projection', () => {
    describe("when painted for a 'right' drop", () => {
      it('to be: a vertical line at the row right edge, spanning the row height', () => {
        const { container, overlay, rowContent } = createDom()
        stubRect(container, { top: 0, bottom: 500, left: 0, width: 600 })
        stubRect(rowContent, { top: 100, bottom: 130, left: 40, width: 560 })

        positionDropIndicatorOverlay(overlay, container, { overId: 'target', side: 'right' }, INDENT_WIDTH)

        expect(overlay.style.display).toBe('block')
        expect(overlay.getAttribute('data-drop-position')).toBe('right')
        // right edge x = 40 + 560 = 600; line spans the row: y 100→130
        expect(overlay.style.transform).toBe('translate(600px, 100px)')
        expect(overlay.style.width).toBe('2px')
        expect(overlay.style.height).toBe('30px')
      })
    })

    describe("when painted for a 'left' drop", () => {
      it('to be: a vertical line at the row left edge', () => {
        const { container, overlay, rowContent } = createDom()
        stubRect(container, { top: 0, bottom: 500, left: 0, width: 600 })
        stubRect(rowContent, { top: 100, bottom: 130, left: 40, width: 560 })

        positionDropIndicatorOverlay(overlay, container, { overId: 'target', side: 'left' }, INDENT_WIDTH)

        expect(overlay.style.transform).toBe('translate(40px, 100px)')
        expect(overlay.getAttribute('data-drop-position')).toBe('left')
      })
    })

    describe('when repainted from horizontal back to a vertical projection (EP: mode switch)', () => {
      it('to be: the horizontal line geometry fully reset (2px-high row line again)', () => {
        const { container, overlay, rowContent } = createDom()
        stubRect(container, { top: 0, bottom: 500, left: 0, width: 600 })
        stubRect(rowContent, { top: 100, bottom: 130, left: 40, width: 560 })

        positionDropIndicatorOverlay(overlay, container, { overId: 'target', side: 'right' }, INDENT_WIDTH)
        positionDropIndicatorOverlay(
          overlay,
          container,
          { overId: 'target', position: 'after', depth: 1 },
          INDENT_WIDTH,
        )

        expect(overlay.style.height).toBe('2px')
        expect(overlay.style.width).toBe('560px')
        expect(overlay.getAttribute('data-drop-position')).toBe('after')
      })
    })
  })
})
