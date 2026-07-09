import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { SduiPageProvider } from '../SduiPageProvider'
import { SduiPeekDialog } from '../SduiPeekDialog'
import { makeDocument } from './testDocuments'

describe('SduiPeekDialog', () => {
  const setup = (documentId: string | null, navigator: { push?: jest.Mock } = {}, onClose = jest.fn()) => {
    const resolver = jest.fn(async (id: string) => (id === 'doc-a' ? makeDocument('doc-a', 'Project A') : undefined))
    render(
      <SduiPageProvider resolver={resolver as never} navigator={navigator}>
        <SduiPeekDialog documentId={documentId} onClose={onClose} />
      </SduiPageProvider>,
    )
    return { resolver, onClose }
  }

  it('as is: closed (documentId null) — to be: no dialog rendered', () => {
    setup(null)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('as is: open — to be: loads and renders the target document read-only', async () => {
    setup('doc-a')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText('Project A body')).toBeInTheDocument())
  })

  it('as is: open with unknown id — to be: missing message', async () => {
    setup('doc-x')
    await waitFor(() => expect(screen.getByText(/not found/i)).toBeInTheDocument())
  })

  it('as is: open-full action — to be: pushes the document and closes', async () => {
    const push = jest.fn()
    const onClose = jest.fn()
    setup('doc-a', { push }, onClose)

    await waitFor(() => expect(screen.getByText('Project A body')).toBeInTheDocument())
    await userEvent.click(screen.getByRole('button', { name: 'Open as full page' }))

    expect(push).toHaveBeenCalledWith('doc-a')
    expect(onClose).toHaveBeenCalled()
  })

  it('as is: documentId swaps while open (recursive nav) — to be: body shows the new document, not a stale editor', async () => {
    const resolver = jest.fn(async (id: string) => {
      if (id === 'doc-a') return makeDocument('doc-a', 'Project A')
      if (id === 'doc-b') return makeDocument('doc-b', 'Project B')
      return undefined
    })
    const { rerender } = render(
      <SduiPageProvider resolver={resolver as never}>
        <SduiPeekDialog documentId="doc-a" onClose={jest.fn()} />
      </SduiPageProvider>,
    )
    await waitFor(() => expect(screen.getByText('Project A body')).toBeInTheDocument())

    rerender(
      <SduiPageProvider resolver={resolver as never}>
        <SduiPeekDialog documentId="doc-b" onClose={jest.fn()} />
      </SduiPageProvider>,
    )
    await waitFor(() => expect(screen.getByText('Project B body')).toBeInTheDocument())
    expect(screen.queryByText('Project A body')).not.toBeInTheDocument()
  })

  it('as is: host content changed while closed, peek reopened — to be: fresh content, never the stale cache', async () => {
    // resolver serves whatever title the "store" currently holds
    let currentTitle = 'Project A'
    const resolver = jest.fn(async (id: string) => (id === 'doc-a' ? makeDocument('doc-a', currentTitle) : undefined))
    const view = (documentId: string | null) => (
      <SduiPageProvider resolver={resolver as never}>
        <SduiPeekDialog documentId={documentId} onClose={jest.fn()} />
      </SduiPageProvider>
    )
    const { rerender } = render(view('doc-a'))
    await waitFor(() => expect(screen.getByText('Project A body')).toBeInTheDocument())

    // close, mutate the host store (as a peek edit would), reopen the same id
    rerender(view(null))
    currentTitle = 'Project A v2'
    rerender(view('doc-a'))

    await waitFor(() => expect(screen.getByText('Project A v2 body')).toBeInTheDocument())
    expect(screen.queryByText('Project A body')).not.toBeInTheDocument()
  })

  it('as is: default mode — to be: side peek (data-mode="side" on the dialog)', () => {
    setup('doc-a')
    expect(screen.getByRole('dialog')).toHaveAttribute('data-mode', 'side')
  })

  it('as is: default — to be: a full editable editor inside the peek (drag handles present)', async () => {
    setup('doc-a')
    await waitFor(() => expect(screen.getByText('Project A body')).toBeInTheDocument())
    const dialog = screen.getByRole('dialog')
    expect(dialog.querySelector('[data-drag-handle]')).not.toBeNull()
  })

  it('as is: readOnly — to be: the lightweight viewer, no edit chrome', async () => {
    const resolver = jest.fn(async (id: string) => (id === 'doc-a' ? makeDocument('doc-a', 'Project A') : undefined))
    render(
      <SduiPageProvider resolver={resolver as never}>
        <SduiPeekDialog documentId="doc-a" readOnly onClose={jest.fn()} />
      </SduiPageProvider>,
    )
    await waitFor(() => expect(screen.getByText('Project A body')).toBeInTheDocument())
    const dialog = screen.getByRole('dialog')
    // read-only peek renders SduiDocumentViewer (no ProseMirror instantiation)
    expect(dialog.querySelector('[data-sdui-document-viewer]')).not.toBeNull()
    expect(dialog.querySelector('[data-drag-handle]')).toBeNull()
    expect(dialog.querySelector('[contenteditable="true"]')).toBeNull()
  })

  it('as is: mode="center" — to be: center peek (data-mode="center" on the dialog)', () => {
    const resolver = jest.fn(async () => undefined)
    render(
      <SduiPageProvider resolver={resolver as never}>
        <SduiPeekDialog documentId="doc-a" mode="center" onClose={jest.fn()} />
      </SduiPageProvider>,
    )
    expect(screen.getByRole('dialog')).toHaveAttribute('data-mode', 'center')
  })
})
