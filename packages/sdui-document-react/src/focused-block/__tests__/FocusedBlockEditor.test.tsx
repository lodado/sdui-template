import { act, fireEvent, render, screen } from '@testing-library/react'
import { TextSelection } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import React from 'react'

import type { SelectionToolbarProps } from '../../selection-toolbar/SelectionToolbar'
import { SelectionToolbar } from '../../selection-toolbar/SelectionToolbar'
import type { FocusedBlockEditorProps } from '../FocusedBlockEditor'
import { FocusedBlockEditor } from '../FocusedBlockEditor'

function createProps(overrides?: Partial<FocusedBlockEditorProps>): FocusedBlockEditorProps {
  return {
    content: [{ type: 'text', text: 'Hello' }],
    onCommit: jest.fn(),
    onSplit: jest.fn(),
    onMergeBackward: jest.fn(),
    onIndent: jest.fn(),
    onOutdent: jest.fn(),
    onNavigate: jest.fn(),
    onTurnInto: jest.fn(),
    onEscape: jest.fn(),
    onMoveBlock: jest.fn(),
    onHistory: jest.fn(),
    onBlockAction: jest.fn(),
    onSlashMenuOpen: jest.fn(),
    onSlashMenuQueryChange: jest.fn(),
    onSlashMenuClose: jest.fn(),
    isSlashMenuOpen: jest.fn(() => false),
    onSlashMenuKey: jest.fn(() => false),
    ...overrides,
  }
}

/**
 * The editor no longer renders the SelectionToolbar itself — it publishes props
 * via onToolbarPropsChange and the document renders a single toolbar. This
 * harness reproduces that wiring so the DOM assertions stay meaningful.
 */
const ToolbarHarness = (overrides?: Partial<FocusedBlockEditorProps>) => {
  const [toolbarProps, setToolbarProps] = React.useState<SelectionToolbarProps | null>(null)

  return (
    <>
      <FocusedBlockEditor {...createProps(overrides)} onToolbarPropsChange={setToolbarProps} />
      {toolbarProps ? <SelectionToolbar {...toolbarProps} /> : null}
    </>
  )
}

describe('FocusedBlockEditor', () => {
  describe('as is: a block with inline content', () => {
    describe('when mounted', () => {
      it('to be: renders a single contenteditable surface with the text', () => {
        const props = createProps()
        render(<FocusedBlockEditor {...props} />)

        // PM mounts on the host itself (mount option) — no extra wrapper div,
        // so the editor stays valid inside <p>/<h1> chrome tags
        const host = screen.getByTestId('focused-block-editor')
        expect(host).toHaveAttribute('contenteditable', 'true')
        expect(host.textContent).toContain('Hello')
      })
    })

    describe('when unmounted (EP: focus leaves the block)', () => {
      it('to be: commits the inline state exactly once', () => {
        const props = createProps()
        const { unmount } = render(<FocusedBlockEditor {...props} />)

        unmount()

        expect(props.onCommit).toHaveBeenCalledTimes(1)
        expect(props.onCommit).toHaveBeenCalledWith({
          content: [{ type: 'text', text: 'Hello' }],
          text: 'Hello',
        })
      })
    })
  })

  describe('as is: empty content (BVA: min size)', () => {
    describe('when mounted and unmounted', () => {
      it('to be: commits empty content without crashing', () => {
        const props = createProps({ content: [] })
        const { unmount } = render(<FocusedBlockEditor {...props} />)

        unmount()

        expect(props.onCommit).toHaveBeenCalledWith({ content: [], text: '' })
      })
    })
  })

  describe('as is: selection toolbar visibility on drag-select', () => {
    // jsdom lacks the layout APIs the toolbar's anchor measurement touches.
    const originalElementFromPoint = document.elementFromPoint
    const rangeProto = Range.prototype as unknown as {
      getClientRects?: () => DOMRectList
      getBoundingClientRect?: () => DOMRect
    }
    const originalGetClientRects = rangeProto.getClientRects
    const originalGetBoundingClientRect = rangeProto.getBoundingClientRect
    const emptyRect = { x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, toJSON() {} } as DOMRect
    beforeAll(() => {
      document.elementFromPoint = () => document.body
      rangeProto.getClientRects = () => Object.assign([], { item: () => null }) as unknown as DOMRectList
      rangeProto.getBoundingClientRect = () => emptyRect
    })
    afterAll(() => {
      document.elementFromPoint = originalElementFromPoint
      rangeProto.getClientRects = originalGetClientRects
      rangeProto.getBoundingClientRect = originalGetBoundingClientRect
    })

    const selectAll = (host: HTMLElement) => {
      const view = (host as HTMLElement & { pmView?: EditorView }).pmView
      if (!view) throw new Error('pmView missing')
      act(() => {
        view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, 1, view.state.doc.content.size)))
      })
    }
    const toolbar = () => screen.queryByRole('toolbar', { name: 'Text formatting' })

    describe('when a selection is dragged out', () => {
      it('to be: shown as soon as the range is non-empty, without a trailing click', () => {
        render(<ToolbarHarness content={[{ type: 'text', text: 'Hello world' }]} />)
        const host = screen.getByTestId('focused-block-editor')

        // the toolbar tracks the DOM selection live — no mousedown/mouseup gating,
        // so a drag-select raises it immediately instead of only after a click
        selectAll(host)
        expect(toolbar()).toBeInTheDocument()
      })
    })

    describe('when the page scrolls with a live selection (bug: fixed anchor detaches)', () => {
      it('to be: re-measures coordsAtPos and repositions the toolbar anchor', () => {
        render(<ToolbarHarness content={[{ type: 'text', text: 'Hello world' }]} />)
        const host = screen.getByTestId('focused-block-editor')
        const view = (host as HTMLElement & { pmView?: EditorView }).pmView
        if (!view) throw new Error('pmView missing')

        const coords = jest.spyOn(view, 'coordsAtPos').mockReturnValue({ left: 10, right: 50, top: 100, bottom: 120 })
        selectAll(host)

        const anchorSpan = document.querySelector('[data-selection-anchor]') as HTMLElement
        expect(anchorSpan.style.top).toBe('100px')

        // scroll up 40px: coordsAtPos now reports a higher position. The
        // re-measure is rAF-throttled, so run the frame synchronously.
        coords.mockReturnValue({ left: 10, right: 50, top: 60, bottom: 80 })
        const raf = jest
          .spyOn(window, 'requestAnimationFrame')
          .mockImplementation((cb: FrameRequestCallback) => (cb(0), 0))
        act(() => {
          fireEvent.scroll(window)
        })
        raf.mockRestore()

        expect(anchorSpan.style.top).toBe('60px')
        coords.mockRestore()
      })
    })
  })
})
