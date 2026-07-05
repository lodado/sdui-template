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

    describe('when rendered (splitter ARIA value)', () => {
      it('to be: aria-valuenow is the left column percentage, clamped to the reachable range', () => {
        const { container } = render(<SduiDocumentEditor content={createSplitContent()} />)

        const gutter = container.querySelectorAll('[data-column-resize]')[0]
        // equal split → 50%, min/max from MIN_COLUMN_RATIO (0.2) over pair total 2
        expect(gutter.getAttribute('aria-valuenow')).toBe('50')
        expect(gutter.getAttribute('aria-valuemin')).toBe('10')
        expect(gutter.getAttribute('aria-valuemax')).toBe('90')
      })

      it('to be: aria-valuenow follows a committed keyboard resize', () => {
        const { container } = render(<SduiDocumentEditor content={createSplitContent()} />)

        const gutter = container.querySelectorAll('[data-column-resize]')[0]
        fireEvent.keyDown(gutter, { key: 'ArrowRight' })
        // 1.1 / 0.9 → 55%
        expect(gutter.getAttribute('aria-valuenow')).toBe('55')
      })
    })

    describe('when the gutter receives a pointerdown (focus for keyboard follow-up)', () => {
      it('to be: the gutter is focused so a later ArrowLeft/Right resizes', () => {
        const { container } = render(<SduiDocumentEditor content={createSplitContent()} />)
        stubColumnWidths(container)

        const gutter = container.querySelectorAll('[data-column-resize]')[0] as HTMLElement
        fireEvent(gutter, new MouseEvent('pointerdown', { bubbles: true, clientX: 100, button: 0 }))

        expect(document.activeElement).toBe(gutter)
      })
    })

    describe('when dragging (live percentage tooltip)', () => {
      it('to be: a tooltip appears on pointermove and is removed on pointerup', () => {
        const { container } = render(<SduiDocumentEditor content={createSplitContent()} />)
        stubColumnWidths(container)

        const gutter = container.querySelectorAll('[data-column-resize]')[0]
        fireEvent(gutter, new MouseEvent('pointerdown', { bubbles: true, clientX: 100, button: 0 }))
        fireEvent(window, new MouseEvent('pointermove', { clientX: 140 }))

        const tooltip = gutter.querySelector('[data-resize-tooltip]')
        expect(tooltip).not.toBeNull()
        expect(tooltip?.textContent).toBe('60%') // equal split + 10% shift

        fireEvent(window, new MouseEvent('pointerup', { clientX: 140 }))
        expect(gutter.querySelector('[data-resize-tooltip]')).toBeNull()
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

    describe('when the gutter is dragged from the equal split without releasing (live preview)', () => {
      it('to be: both columns repaint flex-grow on pointermove, before any commit', () => {
        const { container } = render(<SduiDocumentEditor content={createSplitContent()} />)
        stubColumnWidths(container)

        const gutter = container.querySelectorAll('[data-column-resize]')[0]
        fireEvent(gutter, new MouseEvent('pointerdown', { bubbles: true, clientX: 100, button: 0 }))
        // move only — no pointerup yet: preview is a direct DOM paint, not a patch
        fireEvent(window, new MouseEvent('pointermove', { clientX: 140 }))

        // equal split (grow 1 / 1, pair 400px) + 40px → 10% shift
        expect((container.querySelector('[data-block-id="col-a"]') as HTMLElement).style.flexGrow).toBe('1.2')
        expect((container.querySelector('[data-block-id="col-b"]') as HTMLElement).style.flexGrow).toBe('0.8')
      })
    })

    describe('when a live-preview drag is cancelled with Escape', () => {
      it('to be: the equal split is restored and nothing is committed', () => {
        const { container } = render(<SduiDocumentEditor content={createSplitContent()} />)
        stubColumnWidths(container)

        const gutter = container.querySelectorAll('[data-column-resize]')[0]
        fireEvent(gutter, new MouseEvent('pointerdown', { bubbles: true, clientX: 100, button: 0 }))
        fireEvent(window, new MouseEvent('pointermove', { clientX: 140 }))
        fireEvent(window, new KeyboardEvent('keydown', { key: 'Escape' }))

        // back to the equal-split baseline (no inline grow)
        expect((container.querySelector('[data-block-id="col-a"]') as HTMLElement).style.flexGrow).toBe('')
        expect((container.querySelector('[data-block-id="col-b"]') as HTMLElement).style.flexGrow).toBe('')

        // and a later pointerup after cancel must not commit anything
        fireEvent(window, new MouseEvent('pointerup', { clientX: 140 }))
        expect((container.querySelector('[data-block-id="col-a"]') as HTMLElement).style.flexGrow).toBe('')
        expect((container.querySelector('[data-block-id="col-b"]') as HTMLElement).style.flexGrow).toBe('')
      })
    })

    describe('when dragged far past the edge from the equal split (BVA: min-ratio clamp)', () => {
      it('to be: the shrinking column stops at the minimum and the pair sum stays 2', () => {
        const { container } = render(<SduiDocumentEditor content={createSplitContent()} />)
        stubColumnWidths(container)

        const gutter = container.querySelectorAll('[data-column-resize]')[0]
        fireEvent(gutter, new MouseEvent('pointerdown', { bubbles: true, clientX: 100, button: 0 }))
        // yank 500px right across a 400px pair — well past the far edge
        fireEvent(window, new MouseEvent('pointerup', { clientX: 600 }))

        const left = (container.querySelector('[data-block-id="col-a"]') as HTMLElement).style.flexGrow
        const right = (container.querySelector('[data-block-id="col-b"]') as HTMLElement).style.flexGrow
        // total preserved at 2; right clamped to MIN_COLUMN_RATIO (0.2), left takes the rest
        expect(left).toBe('1.8')
        expect(right).toBe('0.2')
      })
    })
  })
})
