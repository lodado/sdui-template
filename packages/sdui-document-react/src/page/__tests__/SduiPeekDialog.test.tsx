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
})
