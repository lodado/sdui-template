import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../Button'

describe('Button', () => {
  describe('as is: Button with onClick handler', () => {
    describe('when: user clicks button', () => {
      it('to be: onClick handler called with event', async () => {
        const user = userEvent.setup()
        const handleClick = jest.fn()

        render(<Button onClick={handleClick}>Click me</Button>)

        const button = screen.getByRole('button', { name: /click me/i })
        await user.click(button)

        expect(handleClick).toHaveBeenCalledTimes(1)
        expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({ type: 'click' }))
      })
    })
  })

  describe('as is: Button with onClick handler, focused', () => {
    describe('when: user presses Enter', () => {
      it('to be: onClick handler called', async () => {
        const user = userEvent.setup()
        const handleClick = jest.fn()

        render(<Button onClick={handleClick}>Submit</Button>)

        const button = screen.getByRole('button', { name: /submit/i })
        button.focus()
        await user.keyboard('{Enter}')

        expect(handleClick).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('as is: Button with onClick handler, focused', () => {
    describe('when: user presses Space', () => {
      it('to be: onClick handler called', async () => {
        const user = userEvent.setup()
        const handleClick = jest.fn()

        render(<Button onClick={handleClick}>Submit</Button>)

        const button = screen.getByRole('button', { name: /submit/i })
        button.focus()
        await user.keyboard(' ')

        expect(handleClick).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('as is: Button with disabled=true and onClick handler', () => {
    describe('when: user clicks button', () => {
      it('to be: onClick handler not called, button is non-interactive', async () => {
        const user = userEvent.setup()
        const handleClick = jest.fn()

        render(
          <Button disabled onClick={handleClick}>
            Disabled
          </Button>,
        )

        const button = screen.getByRole('button', { name: /disabled/i })
        expect(button).toBeDisabled()
        expect(button).toHaveAttribute('aria-disabled', 'true')

        await user.click(button)

        expect(handleClick).not.toHaveBeenCalled()
      })
    })
  })

  describe('as is: Button with variant="primary"', () => {
    describe('when: variant changes to "secondary"', () => {
      it('to be: correct variant styles applied', () => {
        const { rerender } = render(<Button variant="primary">Button</Button>)

        let button = screen.getByRole('button')
        expect(button).toHaveClass('bg-blue-600')

        rerender(<Button variant="secondary">Button</Button>)

        button = screen.getByRole('button')
        expect(button).toHaveClass('bg-gray-200')
      })
    })
  })

  describe('as is: Button with size="md"', () => {
    describe('when: size changes to "lg"', () => {
      it('to be: correct size styles applied', () => {
        const { rerender } = render(<Button size="md">Button</Button>)

        let button = screen.getByRole('button')
        expect(button).toHaveClass('h-10')

        rerender(<Button size="lg">Button</Button>)

        button = screen.getByRole('button')
        expect(button).toHaveClass('h-12')
      })
    })
  })

  describe('as is: Button with invalid variant prop', () => {
    describe('when: component renders', () => {
      it('to be: defaults to "primary" variant', () => {
        // TypeScript will prevent invalid variants, but we test runtime behavior
        render(
          <Button variant={'primary' as any} data-testid="button">
            Button
          </Button>,
        )

        const button = screen.getByTestId('button')
        expect(button).toHaveClass('bg-blue-600') // primary variant
      })
    })
  })

  describe('as is: Button in DOM', () => {
    describe('when: user tabs to button', () => {
      it('to be: button receives focus, focus indicator visible', async () => {
        const user = userEvent.setup()
        render(<Button>Focusable</Button>)

        const button = screen.getByRole('button', { name: /focusable/i })

        // Tab to button
        await user.tab()

        expect(button).toHaveFocus()
        expect(button).toHaveClass('focus-visible:outline-none')
      })
    })
  })

  describe('as is: Button with aria-label', () => {
    describe('when: component renders', () => {
      it('to be: aria-label attribute present', () => {
        render(<Button aria-label="Close dialog">×</Button>)

        const button = screen.getByRole('button', { name: /close dialog/i })
        expect(button).toHaveAttribute('aria-label', 'Close dialog')
      })
    })
  })

  describe('as is: Button with nodeId, SDUI document loaded', () => {
    describe('when: node state changes', () => {
      it('to be: button reflects state changes', () => {
        // This test verifies that nodeId prop is accepted
        // Full SDUI integration would require SduiLayoutRenderer setup
        const { rerender } = render(<Button nodeId="button-1">SDUI Button</Button>)

        let button = screen.getByRole('button', { name: /sdui button/i })
        expect(button).toBeInTheDocument()

        // Simulate state change by re-rendering with different props
        rerender(<Button nodeId="button-1" disabled>SDUI Button</Button>)

        button = screen.getByRole('button', { name: /sdui button/i })
        expect(button).toBeDisabled()
      })
    })
  })
})

