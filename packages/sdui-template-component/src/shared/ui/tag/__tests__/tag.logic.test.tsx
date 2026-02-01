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

    describe('as is: Tag with color="red"', () => {
      it('to be: red tag rendered', () => {
        render(<Tag text="Red" color="red" />)

        const tag = screen.getByText('Red')
        expect(tag).toBeInTheDocument()
      })
    })

    describe('as is: Tag with color="yellow"', () => {
      it('to be: yellow tag rendered', () => {
        render(<Tag text="Yellow" color="yellow" />)

        const tag = screen.getByText('Yellow')
        expect(tag).toBeInTheDocument()
      })
    })

    describe('as is: Tag with color="green"', () => {
      it('to be: green tag rendered', () => {
        render(<Tag text="Green" color="green" />)

        const tag = screen.getByText('Green')
        expect(tag).toBeInTheDocument()
      })
    })

    describe('as is: Tag with color="teal"', () => {
      it('to be: teal tag rendered', () => {
        render(<Tag text="Teal" color="teal" />)

        const tag = screen.getByText('Teal')
        expect(tag).toBeInTheDocument()
      })
    })

    describe('as is: Tag with color="purple"', () => {
      it('to be: purple tag rendered', () => {
        render(<Tag text="Purple" color="purple" />)

        const tag = screen.getByText('Purple')
        expect(tag).toBeInTheDocument()
      })
    })

    describe('as is: Tag with color="grey"', () => {
      it('to be: grey tag rendered', () => {
        render(<Tag text="Grey" color="grey" />)

        const tag = screen.getByText('Grey')
        expect(tag).toBeInTheDocument()
      })
    })

    describe('as is: Tag with color="lime"', () => {
      it('to be: lime tag rendered', () => {
        render(<Tag text="Lime" color="lime" />)

        const tag = screen.getByText('Lime')
        expect(tag).toBeInTheDocument()
      })
    })

    describe('as is: Tag with color="orange"', () => {
      it('to be: orange tag rendered', () => {
        render(<Tag text="Orange" color="orange" />)

        const tag = screen.getByText('Orange')
        expect(tag).toBeInTheDocument()
      })
    })

    describe('as is: Tag with color="magenta"', () => {
      it('to be: magenta tag rendered', () => {
        render(<Tag text="Magenta" color="magenta" />)

        const tag = screen.getByText('Magenta')
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

  describe('All Color Combinations', () => {
    const colors = [
      'standard',
      'blue',
      'red',
      'yellow',
      'green',
      'teal',
      'purple',
      'grey',
      'lime',
      'orange',
      'magenta',
    ] as const

    colors.forEach((color) => {
      describe(`as is: Tag with color="${color}"`, () => {
        it('to be: renders correctly', () => {
          render(<Tag text={color} color={color} />)

          const tag = screen.getByText(color)
          expect(tag).toBeInTheDocument()
        })
      })
    })
  })
})
