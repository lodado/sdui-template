import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import { EmojiPicker } from './EmojiPicker'

it('filters and selects an emoji', () => {
  const onSelect = jest.fn()
  render(<EmojiPicker onSelect={onSelect} />)

  fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'rocket' } })
  fireEvent.click(screen.getByRole('button', { name: 'rocket' }))

  expect(onSelect).toHaveBeenCalledWith('🚀')
})
