import type { SduiInlineContent } from '@lodado/sdui-document'
import { render, screen } from '@testing-library/react'
import React from 'react'

import { InlineContentView } from '../InlineContentView'

it('renders a date node as a time chip', () => {
  const content: SduiInlineContent = [{ type: 'date', iso: '2026-07-06', display: 'Jul 6' }]
  render(<InlineContentView content={content} />)

  const chip = screen.getByText('Jul 6')
  expect(chip.tagName.toLowerCase()).toBe('time')
  expect(chip).toHaveAttribute('datetime', '2026-07-06')
})
