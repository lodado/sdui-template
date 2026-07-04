import { render, screen } from '@testing-library/react'
import React from 'react'

import type { FocusedBlockEditorProps } from '../../components/FocusedBlockEditor'
import { FocusedBlockEditor } from '../../components/FocusedBlockEditor'

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
    ...overrides,
  }
}

describe('FocusedBlockEditor', () => {
  describe('as is: a block with inline content', () => {
    describe('when mounted', () => {
      it('to be: renders a single contenteditable surface with the text', () => {
        const props = createProps()
        render(<FocusedBlockEditor {...props} />)

        const host = screen.getByTestId('focused-block-editor')
        expect(host.querySelectorAll('[contenteditable="true"]')).toHaveLength(1)
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
