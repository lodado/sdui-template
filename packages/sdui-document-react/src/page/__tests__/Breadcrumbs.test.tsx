import { createDocumentId } from '@lodado/sdui-document'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { Breadcrumbs } from '../Breadcrumbs'
import { SduiPageProvider } from '../SduiPageProvider'
import { makeDocument } from './testDocuments'

describe('Breadcrumbs', () => {
  it('as is: parent chain — to be: renders root → … → current in order', async () => {
    const docs = {
      home: makeDocument('home', 'Home'),
      projects: makeDocument('projects', 'Projects', { parentDocumentId: createDocumentId('home') }),
      'doc-a': makeDocument('doc-a', 'Project A', { parentDocumentId: createDocumentId('projects') }),
    }
    const resolver = jest.fn(async (id: string) => docs[id as keyof typeof docs])
    const push = jest.fn()

    render(
      <SduiPageProvider resolver={resolver as never} navigator={{ push }}>
        <Breadcrumbs documentId="doc-a" />
      </SduiPageProvider>,
    )

    await waitFor(() => expect(screen.getByText('Home')).toBeInTheDocument())
    const nav = screen.getByRole('navigation', { name: /breadcrumb/i })
    expect(nav.textContent).toMatch(/Home.*Projects.*Project A/)

    await userEvent.click(screen.getByRole('button', { name: 'Home' }))
    expect(push).toHaveBeenCalledWith('home')
  })

  it('as is: cyclic parent references — to be: stops without hanging', async () => {
    const a = makeDocument('a', 'A', { parentDocumentId: createDocumentId('b') })
    const b = makeDocument('b', 'B', { parentDocumentId: createDocumentId('a') })
    const resolver = jest.fn(async (id: string) => (id === 'a' ? a : b))

    render(
      <SduiPageProvider resolver={resolver as never}>
        <Breadcrumbs documentId="a" />
      </SduiPageProvider>,
    )

    await waitFor(() => expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument())
    const items = await screen.findAllByText(/^A|B$/)
    expect(items.length).toBeLessThanOrEqual(3)
  })

  it('as is: current document — to be: rendered as plain text, not a navigation button', async () => {
    const resolver = jest.fn(async () => makeDocument('solo', 'Solo'))
    render(
      <SduiPageProvider resolver={resolver as never}>
        <Breadcrumbs documentId="solo" />
      </SduiPageProvider>,
    )

    await waitFor(() => expect(screen.getByText('Solo')).toBeInTheDocument())
    expect(screen.queryByRole('button', { name: 'Solo' })).not.toBeInTheDocument()
  })
})
