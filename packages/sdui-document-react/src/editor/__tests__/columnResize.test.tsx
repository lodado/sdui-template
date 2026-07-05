import type { SduiDocumentContent } from '@lodado/sdui-document'
import { COLUMN_BLOCK_TYPE, COLUMN_LIST_BLOCK_TYPE, createDocumentBlock } from '@lodado/sdui-document'
import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import { SduiDocumentEditor } from '../SduiDocumentEditor'

function createSplitContent(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({
          id: 'split',
          type: COLUMN_LIST_BLOCK_TYPE,
          children: [
            createDocumentBlock({
              id: 'col-a',
              type: COLUMN_BLOCK_TYPE,
              children: [createDocumentBlock({ id: 'p-a', type: 'document.paragraph', state: { text: 'A' } })],
            }),
            createDocumentBlock({
              id: 'col-b',
              type: COLUMN_BLOCK_TYPE,
              children: [createDocumentBlock({ id: 'p-b', type: 'document.paragraph', state: { text: 'B' } })],
            }),
            createDocumentBlock({
              id: 'col-c',
              type: COLUMN_BLOCK_TYPE,
              children: [createDocumentBlock({ id: 'p-c', type: 'document.paragraph', state: { text: 'C' } })],
            }),
          ],
        }),
      ],
    }),
  }
}

/** jsdom rects are zero — give every column a real 200px box for drag math. */
function stubColumnWidths(container: HTMLElement, width = 200) {
  container.querySelectorAll('[data-column]').forEach((element) => {
    jest.spyOn(element, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 100,
      height: 100,
      left: 0,
      right: width,
      width,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect)
  })
}

describe('column resize gutter', () => {
  describe('as is: a three-column split rendered editable', () => {
    describe('when rendered', () => {
      it('to be: one keyboard-reachable separator per column boundary (BVA: columns - 1)', () => {
        const { container } = render(<SduiDocumentEditor content={createSplitContent()} />)

        const gutters = container.querySelectorAll('[data-column-resize]')
        expect(gutters).toHaveLength(2)
        gutters.forEach((gutter) => {
          expect(gutter.getAttribute('role')).toBe('separator')
          expect(gutter.getAttribute('aria-orientation')).toBe('vertical')
          expect(gutter.getAttribute('tabindex')).toBe('0')
        })
      })
    })

    describe('when rendered readOnly (no-interaction partition)', () => {
      it('to be: zero gutters', () => {
        const { container } = render(<SduiDocumentEditor content={createSplitContent()} readOnly />)

        expect(container.querySelectorAll('[data-column-resize]')).toHaveLength(0)
      })
    })

    describe('when ArrowRight is pressed on the first gutter (keyboard resize, one step)', () => {
      it('to be: left column grows by one 5% step, right shrinks — third column untouched', () => {
        const { container } = render(<SduiDocumentEditor content={createSplitContent()} />)

        fireEvent.keyDown(container.querySelectorAll('[data-column-resize]')[0], { key: 'ArrowRight' })

        const colA = container.querySelector('[data-block-id="col-a"]') as HTMLElement
        const colB = container.querySelector('[data-block-id="col-b"]') as HTMLElement
        const colC = container.querySelector('[data-block-id="col-c"]') as HTMLElement
        // pair total 2, step 0.05 → shift 0.1
        expect(colA.style.flexGrow).toBe('1.1')
        expect(colB.style.flexGrow).toBe('0.9')
        expect(colC.style.flexGrow).toBe('')
      })
    })

    describe('when ArrowLeft is pressed (mirror partition)', () => {
      it('to be: left shrinks, right grows', () => {
        const { container } = render(<SduiDocumentEditor content={createSplitContent()} />)

        fireEvent.keyDown(container.querySelectorAll('[data-column-resize]')[0], { key: 'ArrowLeft' })

        expect((container.querySelector('[data-block-id="col-a"]') as HTMLElement).style.flexGrow).toBe('0.9')
        expect((container.querySelector('[data-block-id="col-b"]') as HTMLElement).style.flexGrow).toBe('1.1')
      })
    })

    describe('when the gutter is dragged 40px right across a 400px pair (pointer resize)', () => {
      it('to be: a 10% weight shift committed on pointerup', () => {
        const { container } = render(<SduiDocumentEditor content={createSplitContent()} />)
        stubColumnWidths(container)

        const gutter = container.querySelectorAll('[data-column-resize]')[0]
        // jsdom has no PointerEvent — MouseEvent instances carrying the pointer
        // event TYPE deliver real clientX/button through React's root listener
        fireEvent(gutter, new MouseEvent('pointerdown', { bubbles: true, clientX: 100, button: 0 }))
        fireEvent(window, new MouseEvent('pointerup', { clientX: 140 }))

        expect((container.querySelector('[data-block-id="col-a"]') as HTMLElement).style.flexGrow).toBe('1.2')
        expect((container.querySelector('[data-block-id="col-b"]') as HTMLElement).style.flexGrow).toBe('0.8')
      })
    })

    describe('when the pointer never moves between down and up (BVA: zero-delta drag)', () => {
      it('to be: no ratio change', () => {
        const { container } = render(<SduiDocumentEditor content={createSplitContent()} />)
        stubColumnWidths(container)

        const gutter = container.querySelectorAll('[data-column-resize]')[0]
        fireEvent(gutter, new MouseEvent('pointerdown', { bubbles: true, clientX: 100, button: 0 }))
        fireEvent(window, new MouseEvent('pointerup', { clientX: 100 }))

        expect((container.querySelector('[data-block-id="col-a"]') as HTMLElement).style.flexGrow).toBe('')
        expect((container.querySelector('[data-block-id="col-b"]') as HTMLElement).style.flexGrow).toBe('')
      })
    })
  })
})
