import type { SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'
import { render } from '@testing-library/react'
import React from 'react'

import { SduiDocumentEditor } from '../SduiDocumentEditor'

function twoParagraphs(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        { id: 'p1', type: 'document.paragraph', state: { text: 'First' } },
        { id: 'p2', type: 'document.paragraph', state: { text: 'Second' } },
      ],
    }),
  }
}

describe('block handle accessibility', () => {
  test('plus handles stay decorative while move handles expose the block menu', () => {
    const { container } = render(<SduiDocumentEditor content={twoParagraphs()} />)

    container.querySelectorAll('[data-plus-handle]').forEach((handle) => {
      expect(handle).toHaveAttribute('aria-hidden', 'true')
      expect(handle).toHaveAttribute('tabindex', '-1')
    })
    container.querySelectorAll<HTMLButtonElement>('[data-drag-handle]').forEach((handle) => {
      expect(handle).toHaveAccessibleName('Block actions and move handle')
      expect(handle).toHaveAttribute('aria-haspopup', 'menu')
      expect(handle.tabIndex).toBe(0)
    })
  })
})
