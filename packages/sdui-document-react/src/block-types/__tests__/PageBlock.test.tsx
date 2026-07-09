import { createDocumentBlock, PAGE_BLOCK_TYPE } from '@lodado/sdui-document'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { SduiPageProvider } from '../../page/SduiPageProvider'
import { BlockChrome } from '../BlockChrome'
import { PageBlock } from '../page/PageBlock'

const pageBlock = (attributes?: Record<string, unknown>, text = 'Project A') =>
  createDocumentBlock({ id: 'pb-1', type: PAGE_BLOCK_TYPE, state: { text }, attributes })

const renderWithProvider = (ui: React.ReactElement, navigator: { push?: jest.Mock; peek?: jest.Mock } = {}) => {
  const resolver = jest.fn().mockResolvedValue(undefined)
  return render(
    <SduiPageProvider resolver={resolver} navigator={navigator}>
      {ui}
    </SduiPageProvider>,
  )
}

describe('PageBlock', () => {
  describe('as is: rendering (EP: title/icon partitions)', () => {
    it('to be: shows icon and title', () => {
      renderWithProvider(<PageBlock block={pageBlock({ documentId: 'doc-a', icon: '🚀' })} />)
      expect(screen.getByText('🚀')).toBeInTheDocument()
      expect(screen.getByText('Project A')).toBeInTheDocument()
    })

    it('to be: falls back to a default icon and Untitled', () => {
      renderWithProvider(<PageBlock block={pageBlock({ documentId: 'doc-a' }, '')} />)
      expect(screen.getByText('Untitled')).toBeInTheDocument()
    })
  })

  describe('as is: navigation (EP: default push, explicit peek action)', () => {
    it('to be: click opens the page via navigator.push', async () => {
      const push = jest.fn()
      renderWithProvider(<PageBlock block={pageBlock({ documentId: 'doc-a' })} />, { push })

      await userEvent.click(screen.getByRole('button', { name: /Project A/ }))
      expect(push).toHaveBeenCalledWith('doc-a')
    })

    it('to be: the side-peek action opens via navigator.peek', async () => {
      const push = jest.fn()
      const peek = jest.fn()
      renderWithProvider(<PageBlock block={pageBlock({ documentId: 'doc-a' })} />, { push, peek })

      await userEvent.click(screen.getByRole('button', { name: 'Open in side peek' }))
      expect(peek).toHaveBeenCalledWith('doc-a')
      expect(push).not.toHaveBeenCalled()
    })

    it('to be: Enter key opens the page', async () => {
      const push = jest.fn()
      renderWithProvider(<PageBlock block={pageBlock({ documentId: 'doc-a' })} />, { push })

      screen.getByRole('button', { name: /Project A/ }).focus()
      await userEvent.keyboard('{Enter}')
      expect(push).toHaveBeenCalledWith('doc-a')
    })
  })

  describe('as is: degraded partitions (EP: no provider / no documentId)', () => {
    it('to be: renders inert (no button) outside a provider', () => {
      render(<PageBlock block={pageBlock({ documentId: 'doc-a' })} />)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
      expect(screen.getByText('Project A')).toBeInTheDocument()
    })

    it('to be: renders inert when documentId is missing', () => {
      renderWithProvider(<PageBlock block={pageBlock(undefined)} />)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  it('as is: BlockChrome dispatch — to be: document.page renders the PageBlock', () => {
    renderWithProvider(<BlockChrome block={pageBlock({ documentId: 'doc-a' })} />)
    expect(screen.getByText('Project A')).toBeInTheDocument()
  })
})
