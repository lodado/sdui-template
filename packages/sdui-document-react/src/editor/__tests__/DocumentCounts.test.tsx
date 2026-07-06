import type { SduiDocumentContent } from '@lodado/sdui-document'
import { render, screen } from '@testing-library/react'
import React from 'react'

import { DocumentCounts } from '../DocumentCounts'

const content: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: {
    id: 'root',
    type: 'document.root',
    children: [{ id: 'a', type: 'document.paragraph', state: { content: [{ type: 'text', text: 'one two' }] } }],
  },
}

it('renders word and block counts', () => {
  render(<DocumentCounts content={content} />)

  expect(screen.getByText(/2 words/)).toBeInTheDocument()
  expect(screen.getByText(/1 block/)).toBeInTheDocument()
})
