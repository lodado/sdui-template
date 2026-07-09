import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'

import { useResolvedDocument, useSduiPage } from '../SduiPageContext'
import { SduiPageProvider } from '../SduiPageProvider'
import { makeDocument } from './testDocuments'

const Probe = ({ id, refresh }: { id: string; refresh?: boolean }) => {
  const state = useResolvedDocument(id, { refresh })
  return <div data-testid="probe">{state.status === 'ready' ? state.document.title : state.status}</div>
}

describe('SduiPageProvider', () => {
  describe('as is: useResolvedDocument (EP: resolver outcomes)', () => {
    it('to be: loading then ready with the resolved document', async () => {
      const resolver = jest.fn().mockResolvedValue(makeDocument('doc-a', 'Project A'))
      render(
        <SduiPageProvider resolver={resolver}>
          <Probe id="doc-a" />
        </SduiPageProvider>,
      )

      expect(screen.getByTestId('probe')).toHaveTextContent('loading')
      await waitFor(() => expect(screen.getByTestId('probe')).toHaveTextContent('Project A'))
    })

    it('to be: missing when the resolver returns undefined', async () => {
      const resolver = jest.fn().mockResolvedValue(undefined)
      render(
        <SduiPageProvider resolver={resolver}>
          <Probe id="doc-x" />
        </SduiPageProvider>,
      )

      await waitFor(() => expect(screen.getByTestId('probe')).toHaveTextContent('missing'))
    })

    it('to be: error when the resolver rejects', async () => {
      const resolver = jest.fn().mockRejectedValue(new Error('boom'))
      render(
        <SduiPageProvider resolver={resolver}>
          <Probe id="doc-a" />
        </SduiPageProvider>,
      )

      await waitFor(() => expect(screen.getByTestId('probe')).toHaveTextContent('error'))
    })

    it('to be: cached — two consumers of the same id resolve with one fetch', async () => {
      const resolver = jest.fn().mockResolvedValue(makeDocument('doc-a', 'Project A'))
      render(
        <SduiPageProvider resolver={resolver}>
          <Probe id="doc-a" />
          <Probe id="doc-a" />
        </SduiPageProvider>,
      )

      await waitFor(() => expect(screen.getAllByText('Project A')).toHaveLength(2))
      expect(resolver).toHaveBeenCalledTimes(1)
    })

    it('to be: refresh bypasses the cache and refetches', async () => {
      const resolver = jest.fn().mockResolvedValue(makeDocument('doc-a', 'Project A'))
      const { rerender } = render(
        <SduiPageProvider resolver={resolver}>
          <Probe id="doc-a" />
        </SduiPageProvider>,
      )
      await waitFor(() => expect(screen.getByTestId('probe')).toHaveTextContent('Project A'))

      rerender(
        <SduiPageProvider resolver={resolver}>
          <Probe id="doc-a" refresh />
        </SduiPageProvider>,
      )

      await waitFor(() => expect(resolver).toHaveBeenCalledTimes(2))
    })
  })

  describe('as is: navigation ownership (EP: navigator injected vs absent)', () => {
    const OpenButton = ({ mode }: { mode: 'push' | 'peek' }) => {
      const page = useSduiPage()
      return (
        <button type="button" onClick={() => page?.open('doc-a', mode)}>
          open
        </button>
      )
    }

    it('to be: push delegates to the injected navigator', async () => {
      const push = jest.fn()
      const resolver = jest.fn().mockResolvedValue(undefined)
      render(
        <SduiPageProvider resolver={resolver} navigator={{ push }}>
          <OpenButton mode="push" />
        </SduiPageProvider>,
      )

      screen.getByRole('button', { name: 'open' }).click()
      expect(push).toHaveBeenCalledWith('doc-a')
    })

    it('to be: peek without navigator.peek falls back to the built-in dialog', async () => {
      const resolver = jest.fn().mockResolvedValue(makeDocument('doc-a', 'Project A'))
      render(
        <SduiPageProvider resolver={resolver}>
          <OpenButton mode="peek" />
        </SduiPageProvider>,
      )

      screen.getByRole('button', { name: 'open' }).click()
      await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument())
    })
  })

  it('as is: outside a provider — useSduiPage to be: null', () => {
    const Outside = () => {
      const page = useSduiPage()
      return <span>{page === null ? 'no-provider' : 'provider'}</span>
    }
    render(<Outside />)
    expect(screen.getByText('no-provider')).toBeInTheDocument()
  })
})
