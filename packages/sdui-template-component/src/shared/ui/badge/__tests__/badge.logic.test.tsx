import { render, screen } from '@testing-library/react'
import React from 'react'

import { Badge } from '../Badge'

describe('Badge - Logic Tests (ADS Style)', () => {
  describe('Appearance Variants', () => {
    describe('as is: Badge with appearance="default"', () => {
      it('to be: default badge rendered', () => {
        render(<Badge label={25} appearance="default" />)

        const labelElement = screen.getByText('25')
        expect(labelElement).toBeInTheDocument()
      })
    })
  })

  describe('Label Types', () => {
    describe('as is: Badge with numeric label', () => {
      it('to be: numeric label rendered', () => {
        render(<Badge label={99} />)

        const badge = screen.getByText('99')
        expect(badge).toBeInTheDocument()
      })
    })

    describe('as is: Badge with string label', () => {
      it('to be: string label rendered', () => {
        render(<Badge label="99+" />)

        const badge = screen.getByText('99+')
        expect(badge).toBeInTheDocument()
      })
    })

    describe('as is: Badge with zero label', () => {
      it('to be: zero label rendered', () => {
        render(<Badge label={0} />)

        const badge = screen.getByText('0')
        expect(badge).toBeInTheDocument()
      })
    })

    describe('as is: Badge with large number', () => {
      it('to be: large number rendered', () => {
        render(<Badge label={9999} />)

        const badge = screen.getByText('9999')
        expect(badge).toBeInTheDocument()
      })
    })
  })

  describe('Props Spread', () => {
    describe('as is: Badge with custom data attribute', () => {
      it('to be: data attribute spread to div', () => {
        render(<Badge label={25} data-testid="custom-badge" />)

        const badge = screen.getByTestId('custom-badge')
        expect(badge).toBeInTheDocument()
      })
    })

    describe('as is: Badge with className', () => {
      it('to be: className merged with variants', () => {
        render(<Badge label={25} className="custom-class" />)

        const badge = screen.getByText('25').parentElement
        expect(badge).toHaveClass('custom-class')
        expect(badge).toHaveClass('h-4')
      })
    })
  })

  describe('Default Appearance', () => {
    describe('as is: Badge without appearance prop', () => {
      it('to be: default appearance applied', () => {
        render(<Badge label={25} />)

        const badge = screen.getByText('25')
        expect(badge).toBeInTheDocument()
      })
    })
  })
})
