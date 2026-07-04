import { render, screen } from '@testing-library/react'
import React from 'react'

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
    onBlockAction: jest.fn(),
    onSlashMenuOpen: jest.fn(),
    onSlashMenuQueryChange: jest.fn(),
    onSlashMenuClose: jest.fn(),
    isSlashMenuOpen: jest.fn(() => false),
    onSlashMenuKey: jest.fn(() => false),
    ...overrides,
  }
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
})
