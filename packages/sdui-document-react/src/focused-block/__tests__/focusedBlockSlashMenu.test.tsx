import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { EditorView } from 'prosemirror-view'
import React from 'react'

import type { FocusedBlockEditorProps } from '../FocusedBlockEditor'
import { FocusedBlockEditor } from '../FocusedBlockEditor'

function createProps(overrides?: Partial<FocusedBlockEditorProps>): FocusedBlockEditorProps {
  return {
    content: [],
    autoFocus: 'start',
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

function pressKey(key: string): void {
  fireEvent.keyDown(screen.getByTestId('focused-block-editor'), { key })
}

describe('FocusedBlockEditor slash menu', () => {
  test('typing / opens the menu; typing filters it', () => {
    render(<FocusedBlockEditor {...createProps()} />)
    typeText('/')
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    typeText('head')
    expect(screen.getAllByRole('option')).toHaveLength(3) // heading 1-3
  })

  test('Enter selects the active item, removes /query, delegates', () => {
    const props = createProps()
    render(<FocusedBlockEditor {...props} />)
    typeText('/head')
    pressKey('ArrowDown')
    pressKey('Enter')
    expect(props.onBlockMenuSelect).toHaveBeenCalledTimes(1)
    expect(props.onBlockMenuSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'heading-2' }))
    // the /query text was deleted before delegation
    expect(props.onCommit).toHaveBeenCalledWith({ content: [], text: '' })
  })

  test('Enter with no matching items falls through to split', () => {
    const props = createProps()
    render(<FocusedBlockEditor {...props} />)
    typeText('/zzzz')
    pressKey('Enter')
    expect(props.onBlockMenuSelect).not.toHaveBeenCalled()
    expect(props.onSplit).toHaveBeenCalled()
  })

  test('Escape closes the menu, keeps the typed text, does not exit the block', () => {
    const props = createProps()
    render(<FocusedBlockEditor {...props} />)
    typeText('/he')
    pressKey('Escape')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(props.onBlockMenuSelect).not.toHaveBeenCalled()
    expect(props.onEscape).not.toHaveBeenCalled()
    expect(screen.getByTestId('focused-block-editor').textContent).toBe('/he')
  })

  test('link item opens URL input; submit delegates with normalized url', async () => {
    const props = createProps()
    render(<FocusedBlockEditor {...props} />)
    typeText('/link')
    pressKey('Enter')
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'example.com{Enter}')
    expect(props.onBlockMenuSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'link' }), {
      url: 'https://example.com',
    })
  })

  test('autoOpenBlockMenu opens the menu on mount', () => {
    render(<FocusedBlockEditor {...createProps({ autoOpenBlockMenu: true })} />)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })
})
