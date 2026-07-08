import { act, fireEvent, render, screen } from '@testing-library/react'
import type { EditorView } from 'prosemirror-view'
import React from 'react'

import type { FocusedBlockEditorProps } from '../FocusedBlockEditor'
import { FocusedBlockEditor } from '../FocusedBlockEditor'

function createProps(overrides?: Partial<FocusedBlockEditorProps>): FocusedBlockEditorProps {
  return {
    content: [{ type: 'text', text: 'Hello' }],
    autoFocus: 'end',
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
    onBlockMenuSelect: jest.fn(),
    ...overrides,
  }
}

/** jsdom cannot type into contenteditable — drive PM through the test-only view handle. */
function pmView(): EditorView {
  const host = screen.getByTestId('focused-block-editor') as HTMLElement & { pmView?: EditorView }
  if (!host.pmView) {
    throw new Error('pmView test handle missing')
  }

  return host.pmView
}

function typeText(text: string): void {
  act(() => {
    const view = pmView()
    view.dispatch(view.state.tr.insertText(text, view.state.selection.from))
  })
}

/**
 * `EditorView.composing` is a prototype getter (reads `input.composing`), so an
 * own-property getter shadows it deterministically. Real CompositionEvents are
 * NOT used: PM's compositionend lifecycle (timeouts + DOM observer) is flaky in
 * jsdom, while every production guard only ever reads `view.composing`.
 */
function setComposing(view: EditorView, composing: boolean): void {
  if (composing) {
    Object.defineProperty(view, 'composing', { get: () => true, configurable: true })
  } else {
    // removing the own property restores the prototype getter (false in jsdom)
    Reflect.deleteProperty(view, 'composing')
  }
}

describe('FocusedBlockEditor IME composition guards', () => {
  describe('as is: an IME composition in progress (view.composing = true)', () => {
    describe('when the editor blurs (commit path)', () => {
      it('to be: onCommit is NOT called (no mid-composition commit)', () => {
        const props = createProps()
        render(<FocusedBlockEditor {...props} />)
        setComposing(pmView(), true)

        act(() => {
          fireEvent.blur(screen.getByTestId('focused-block-editor'))
        })

        expect(props.onCommit).not.toHaveBeenCalled()
      })
    })

    describe("when a '/' slash trigger is typed", () => {
      it('to be: the slash menu does NOT open (plugin update suppressed)', () => {
        render(<FocusedBlockEditor {...createProps({ content: [] })} />)
        setComposing(pmView(), true)

        typeText('/')

        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      })
    })
  })

  describe('as is: the composition has finished (view.composing back to false)', () => {
    describe('when the editor blurs again', () => {
      it('to be: the previously suppressed commit fires exactly once', () => {
        const props = createProps()
        render(<FocusedBlockEditor {...props} />)
        const view = pmView()
        const host = screen.getByTestId('focused-block-editor')

        setComposing(view, true)
        act(() => {
          fireEvent.blur(host)
        })
        expect(props.onCommit).not.toHaveBeenCalled()

        setComposing(view, false)
        act(() => {
          fireEvent.blur(host)
        })

        expect(props.onCommit).toHaveBeenCalledTimes(1)
        expect(props.onCommit).toHaveBeenCalledWith({
          content: [{ type: 'text', text: 'Hello' }],
          text: 'Hello',
        })
      })
    })

    describe("when the next transaction arrives after a composed '/'", () => {
      it('to be: the deferred slash menu opens', () => {
        render(<FocusedBlockEditor {...createProps({ content: [] })} />)
        const view = pmView()

        // '/' lands while composing: plugin STATE tracks the slash range, but
        // the view-layer update (open callback) is suppressed
        setComposing(view, true)
        typeText('/')
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()

        // first transaction after composition ends flushes the open
        setComposing(view, false)
        typeText('h')

        expect(screen.getByRole('listbox')).toBeInTheDocument()
      })
    })
  })
})
