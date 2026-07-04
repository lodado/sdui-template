import type { SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { SduiDocumentEditor } from '../SduiDocumentEditor'
import { stripPatchOrigins } from './patchTestUtils'

/**
 * Fixture: one block per chrome-relevant type.
 * root
 * ├── h2 (heading level 2)
 * ├── p1 (paragraph "Body")
 * ├── todo (checklist, unchecked)
 * └── hr (divider)
 */
function createContent(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({ id: 'h2', type: 'document.heading', state: { text: 'Title' }, attributes: { level: 2 } }),
        createDocumentBlock({ id: 'p1', type: 'document.paragraph', state: { text: 'Body' } }),
        createDocumentBlock({
          id: 'todo',
          type: 'document.checklist',
          state: { text: 'Task' },
          attributes: { checked: false },
        }),
        createDocumentBlock({ id: 'hr', type: 'document.divider' }),
      ],
    }),
  }
}

describe('SduiDocumentEditor block chrome integration', () => {
  describe('as is: mixed-type document, nothing focused', () => {
    describe('when rendered', () => {
      it('to be: each block wrapped in its semantic tag', () => {
        const { container } = render(<SduiDocumentEditor content={createContent()} />)

        expect(container.querySelector('[data-block-id="h2"] h2.heading-content')).toHaveTextContent('Title')
        expect(container.querySelector('[data-block-id="p1"] p[dir="auto"]')).toHaveTextContent('Body')
        expect(container.querySelector('[data-block-id="todo"] [data-type="checkbox_item"]')).toHaveTextContent('Task')
        expect(container.querySelector('[data-block-id="hr"] hr')).not.toBeNull()
      })
    })
  })

  describe('as is: heading block (EP: focused vs static must share the wrapper)', () => {
    describe('when the heading text is clicked', () => {
      it('to be: the ProseMirror surface mounts INSIDE the same <h2> wrapper', async () => {
        const user = userEvent.setup()
        const { container } = render(<SduiDocumentEditor content={createContent()} />)

        await user.click(screen.getByText('Title'))

        const wrapper = container.querySelector('[data-block-id="h2"] h2.heading-content')
        expect(wrapper?.querySelector('[contenteditable="true"]')).not.toBeNull()
        // still exactly one PM instance in the document
        expect(container.querySelectorAll('[contenteditable="true"]')).toHaveLength(1)
      })
    })
  })

  describe('as is: unchecked checklist block', () => {
    describe('when the checkbox is clicked (EP: toggle without focusing)', () => {
      it('to be: a block.update patch sets attributes.checked true and no PM mounts', async () => {
        const user = userEvent.setup()
        const onContentChange = jest.fn()
        const { container } = render(<SduiDocumentEditor content={createContent()} onContentChange={onContentChange} />)

        await user.click(screen.getByRole('checkbox'))

        expect(onContentChange).toHaveBeenCalledTimes(1)
        const [, patches] = onContentChange.mock.calls[0]
        expect(stripPatchOrigins(patches)).toEqual([
          { type: 'block.update', blockId: 'todo', attributes: { checked: true } },
        ])
        expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true')
        expect(container.querySelectorAll('[contenteditable="true"]')).toHaveLength(0)
      })
    })

    describe('when rendered readOnly (EP: no-interaction partition)', () => {
      it('to be: checkbox disabled', () => {
        render(<SduiDocumentEditor content={createContent()} readOnly />)

        expect(screen.getByRole('checkbox')).toBeDisabled()
      })
    })
  })
})
