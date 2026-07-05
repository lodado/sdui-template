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
  test('the + and drag handles are hidden from AT and out of the tab order', () => {
    const { container } = render(<SduiDocumentEditor content={twoParagraphs()} />)

    const handles = container.querySelectorAll('[data-plus-handle], [data-drag-handle]')
    expect(handles.length).toBeGreaterThan(0)
    handles.forEach((handle) => {
      expect(handle).toHaveAttribute('aria-hidden', 'true')
      expect(handle).toHaveAttribute('tabindex', '-1')
    })
  })
})
