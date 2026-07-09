import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import { CalloutBlock } from '../callout/CalloutBlock'

const calloutBlock = { id: 'c1', type: 'document.callout', attributes: { tone: 'info', icon: '🔥' } }

it('renders the emoji icon when attributes.icon is set (no handler)', () => {
  render(<CalloutBlock block={calloutBlock as any}>body</CalloutBlock>)

  expect(screen.getByText('🔥')).toBeInTheDocument()
})

it('renders no icon-change button without onSetCalloutIcon (readOnly contract)', () => {
  render(<CalloutBlock block={calloutBlock as any}>body</CalloutBlock>)

  expect(screen.queryByRole('button', { name: /change callout icon/i })).not.toBeInTheDocument()
})

it('opens the picker and updates the icon via onSetCalloutIcon', () => {
  const setCalloutIcon = jest.fn()

  render(
    <CalloutBlock
      block={{ id: 'c2', type: 'document.callout', attributes: { tone: 'info' } } as any}
      onSetCalloutIcon={setCalloutIcon}
    >
      body
    </CalloutBlock>,
  )

  fireEvent.click(screen.getByRole('button', { name: /change callout icon/i }))
  fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'rocket' } })
  fireEvent.click(screen.getByRole('button', { name: 'rocket' }))

  expect(setCalloutIcon).toHaveBeenCalledWith('c2', '🚀')
})
