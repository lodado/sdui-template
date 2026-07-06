import type { SduiDocumentContent } from '@lodado/sdui-document'
import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import { DocumentContentProvider } from '../../editor/DocumentContentContext'
import { TocBlock } from '../toc/TocBlock'

const content: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: {
    id: 'root',
    type: 'document.root',
    children: [
      {
        id: 'h1',
        type: 'document.heading',
        attributes: { level: 1 },
        state: { content: [{ type: 'text', text: 'Intro' }] },
      },
      {
        id: 'h2',
        type: 'document.heading',
        attributes: { level: 2 },
        state: { content: [{ type: 'text', text: 'Details' }] },
      },
    ],
  },
}

it('lists headings and scrolls to the target on click', () => {
  const scrollSpy = jest.fn()
  window.HTMLElement.prototype.scrollIntoView = scrollSpy

  render(
    <div>
      <div data-block-id="h1" tabIndex={-1} />
      <DocumentContentProvider value={content}>
        <TocBlock />
      </DocumentContentProvider>
    </div>,
  )

  expect(screen.getByRole('link', { name: 'Intro' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Details' })).toBeInTheDocument()

  fireEvent.click(screen.getByRole('link', { name: 'Intro' }))
  expect(scrollSpy).toHaveBeenCalled()
})

it('shows an empty state when there is no content', () => {
  render(<TocBlock />)

  expect(screen.getByText(/Add headings/)).toBeInTheDocument()
})
