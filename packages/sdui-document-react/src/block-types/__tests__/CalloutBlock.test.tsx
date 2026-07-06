import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import { EditorRuntimeContext } from '../../editor/EditorRuntimeContext'
import { CalloutBlock } from '../callout/CalloutBlock'

const calloutBlock = { id: 'c1', type: 'document.callout', attributes: { tone: 'info', icon: '🔥' } }

it('renders the emoji icon when attributes.icon is set (no runtime)', () => {
  render(<CalloutBlock block={calloutBlock as any}>body</CalloutBlock>)

  expect(screen.getByText('🔥')).toBeInTheDocument()
})

it('opens the picker and updates the icon via the runtime handler', () => {
  const setCalloutIcon = jest.fn()
  const runtime = { store: {}, handlers: { setCalloutIcon }, content: {} } as any

  render(
    <EditorRuntimeContext.Provider value={runtime}>
      <CalloutBlock block={{ id: 'c2', type: 'document.callout', attributes: { tone: 'info' } } as any}>
        body
      </CalloutBlock>
    </EditorRuntimeContext.Provider>,
  )

  fireEvent.click(screen.getByRole('button', { name: /change callout icon/i }))
  fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'rocket' } })
  fireEvent.click(screen.getByRole('button', { name: 'rocket' }))

  expect(setCalloutIcon).toHaveBeenCalledWith('c2', '🚀')
})
