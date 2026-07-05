import { render, screen } from '@testing-library/react'
import React from 'react'

import { Tag } from '../Tag'

describe('Tag - Logic Tests (ADS Style)', () => {
  describe('Color Variants', () => {
    describe('as is: Tag with color="standard"', () => {
      it('to be: standard tag rendered with border', () => {
        render(<Tag text="Standard" color="standard" />)

        const textElement = screen.getByText('Standard')
        expect(textElement).toBeInTheDocument()
        // Border class is on the parent span (root element)
        const tag = textElement.parentElement
        expect(tag).toHaveClass('border')
      })
    })

    describe('as is: Tag with color="blue"', () => {
      it('to be: blue tag rendered', () => {
        render(<Tag text="Blue" color="blue" />)

        const tag = screen.getByText('Blue')
        expect(tag).toBeInTheDocument()
      })
    })
  })

  describe('Icon Support', () => {
    describe('as is: Tag with iconBefore', () => {
      it('to be: icon rendered before text', () => {
        const TestIcon = () => <span data-testid="test-icon">Icon</span>

        render(<Tag text="With Icon" iconBefore={<TestIcon />} />)

        const tag = screen.getByText('With Icon')
        const icon = screen.getByTestId('test-icon')

        expect(tag).toBeInTheDocument()
        expect(icon).toBeInTheDocument()
      })
    })
  })

  describe('Props Spread', () => {
    describe('as is: Tag with custom data attribute', () => {
      it('to be: data attribute spread to span', () => {
        render(<Tag text="Custom" data-testid="custom-tag" />)

        const tag = screen.getByTestId('custom-tag')
        expect(tag).toBeInTheDocument()
      })
    })

    describe('as is: Tag with className', () => {
      it('to be: className merged with variants', () => {
        render(<Tag text="Styled" className="custom-class" />)

        const tag = screen.getByText('Styled').parentElement
        expect(tag).toHaveClass('custom-class')
        expect(tag).toHaveClass('border')
      })
    })
  })
})
