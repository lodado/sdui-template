import type { SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { SduiDocumentEditor } from '../components/SduiDocumentEditor'

/**
 * Fixture tree:
 * root
 * ├── p1 "First"
 * └── p2 "Second"
 */
function createContent(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({ id: 'p1', type: 'document.paragraph', state: { text: 'First' } }),
        createDocumentBlock({ id: 'p2', type: 'document.paragraph', state: { text: 'Second' } }),
      ],
    }),
  }
}

function renderEditor(overrides?: Partial<React.ComponentProps<typeof SduiDocumentEditor>>) {
  const ids = ['gen-1', 'gen-2', 'gen-3']
  const onContentChange = jest.fn()
  const utils = render(
    <SduiDocumentEditor
      content={createContent()}
      onContentChange={onContentChange}
      generateBlockId={() => ids.shift() ?? 'gen-x'}
      {...overrides}
    />,
  )

  return { ...utils, onContentChange }
}

function blockIds(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('[data-block-id]')).map(
    (element) => element.getAttribute('data-block-id') ?? '',
  )
}

describe('SduiDocumentEditor', () => {
  describe('as is: document with two paragraphs, nothing focused', () => {
    describe('when rendered', () => {
      it('to be: all block texts visible with zero ProseMirror instances', () => {
        const { container } = renderEditor()

        expect(screen.getByText('First')).toBeInTheDocument()
        expect(screen.getByText('Second')).toBeInTheDocument()
        expect(container.querySelectorAll('[contenteditable="true"]')).toHaveLength(0)
      })
    })

    describe('when a block is clicked (success flow via mouse)', () => {
      it('to be: exactly one ProseMirror surface mounts on that block', async () => {
        const user = userEvent.setup()
        const { container } = renderEditor()

        await user.click(screen.getByText('First'))

        expect(container.querySelectorAll('[contenteditable="true"]')).toHaveLength(1)
        expect(screen.getByTestId('focused-block-editor').closest('[data-block-id]')).toHaveAttribute(
          'data-block-id',
          'p1',
        )
      })
    })
  })

  describe('as is: focus on p1 with caret at start (success flow via keyboard)', () => {
    describe('when Enter is pressed (BVA: offset 0 split)', () => {
      it('to be: new block inserted, original keeps empty half, focus moves to the new block', async () => {
        const user = userEvent.setup()
        const { container, onContentChange } = renderEditor()

        await user.click(screen.getByText('First'))
        await user.keyboard('{Enter}')

        expect(blockIds(container)).toEqual(['p1', 'gen-1', 'p2'])
        expect(onContentChange).toHaveBeenCalled()
        // focus moved to the split-off block
        expect(screen.getByTestId('focused-block-editor').closest('[data-block-id]')).toHaveAttribute(
          'data-block-id',
          'gen-1',
        )
      })
    })

    describe('when Backspace is pressed on the second block at offset 0', () => {
      it('to be: merged into the previous block, block removed, texts joined', async () => {
        const user = userEvent.setup()
        const { container } = renderEditor()

        await user.click(screen.getByText('Second'))
        await user.keyboard('{Backspace}')

        expect(blockIds(container)).toEqual(['p1'])
        // merged block is now focused; PM holds the joined text
        expect(screen.getByTestId('focused-block-editor').textContent).toContain('FirstSecond')
      })
    })

    describe('when Backspace is pressed on the FIRST block (BVA: no previous sibling)', () => {
      it('to be: nothing merges, structure unchanged', async () => {
        const user = userEvent.setup()
        const { container } = renderEditor()

        await user.click(screen.getByText('First'))
        await user.keyboard('{Backspace}')

        expect(blockIds(container)).toEqual(['p1', 'p2'])
      })
    })

    describe('when Tab is pressed on the second block (EP: indent)', () => {
      it('to be: p2 becomes a child of p1 (depth 2)', async () => {
        const user = userEvent.setup()
        const { container } = renderEditor()

        await user.click(screen.getByText('Second'))
        await user.keyboard('{Tab}')

        const p2 = container.querySelector('[data-block-id="p2"]')
        expect(p2).toHaveAttribute('data-depth', '2')
      })
    })

    describe('when Tab is pressed on the FIRST block (BVA: no previous sibling to indent under)', () => {
      it('to be: depth unchanged', async () => {
        const user = userEvent.setup()
        const { container } = renderEditor()

        await user.click(screen.getByText('First'))
        await user.keyboard('{Tab}')

        expect(container.querySelector('[data-block-id="p1"]')).toHaveAttribute('data-depth', '1')
      })
    })

    describe('when Shift-Tab is pressed on a nested block (EP: outdent)', () => {
      it('to be: block moves back to root level after indent then outdent', async () => {
        const user = userEvent.setup()
        const { container } = renderEditor()

        await user.click(screen.getByText('Second'))
        await user.keyboard('{Tab}')
        expect(container.querySelector('[data-block-id="p2"]')).toHaveAttribute('data-depth', '2')

        await user.keyboard('{Shift>}{Tab}{/Shift}')
        expect(container.querySelector('[data-block-id="p2"]')).toHaveAttribute('data-depth', '1')
      })
    })
  })

  describe('as is: readOnly document (EP: permission-gated partition)', () => {
    describe('when a block is clicked', () => {
      it('to be: no ProseMirror surface mounts', async () => {
        const user = userEvent.setup()
        const { container } = renderEditor({ readOnly: true })

        await user.click(screen.getByText('First'))

        expect(container.querySelectorAll('[contenteditable="true"]')).toHaveLength(0)
      })
    })
  })

  describe('as is: empty document root (BVA: zero blocks)', () => {
    describe('when rendered', () => {
      it('to be: renders without crashing', () => {
        const { container } = renderEditor({
          content: {
            schemaVersion: '1.0',
            root: createDocumentBlock({ id: 'root', type: 'document.root' }),
          },
        })

        expect(blockIds(container)).toEqual([])
      })
    })
  })
})
