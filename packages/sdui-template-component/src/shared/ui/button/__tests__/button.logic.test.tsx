import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { Button } from '../Button'

describe('Button - Logic Tests (ADS Style)', () => {
  describe('Appearance Variants', () => {
    describe('as is: Button with appearance="default"', () => {
      it('to be: default button with border rendered', () => {
        render(<Button appearance="default">Default</Button>)

        const button = screen.getByRole('button', { name: /default/i })
        expect(button).toBeInTheDocument()
        expect(button).toHaveClass('border')
      })
    })

    describe('as is: Button with appearance="primary"', () => {
      it('to be: primary button without border rendered', () => {
        render(<Button appearance="primary">Primary</Button>)

        const button = screen.getByRole('button', { name: /primary/i })
        expect(button).toBeInTheDocument()
        expect(button).not.toHaveClass('border-solid')
      })
    })

    describe('as is: Button with appearance="subtle"', () => {
      it('to be: subtle button with transparent background rendered', () => {
        render(<Button appearance="subtle">Subtle</Button>)

        const button = screen.getByRole('button', { name: /subtle/i })
        expect(button).toBeInTheDocument()
        expect(button).toHaveClass('bg-transparent')
      })
    })

    describe('as is: Button with appearance="warning"', () => {
      it('to be: warning button rendered', () => {
        render(<Button appearance="warning">Warning</Button>)

        const button = screen.getByRole('button', { name: /warning/i })
        expect(button).toBeInTheDocument()
      })
    })

    describe('as is: Button with appearance="danger"', () => {
      it('to be: danger button rendered', () => {
        render(<Button appearance="danger">Danger</Button>)

        const button = screen.getByRole('button', { name: /danger/i })
        expect(button).toBeInTheDocument()
      })
    })
  })

  describe('Spacing Variants', () => {
    describe('as is: Button with spacing="default"', () => {
      it('to be: default spacing (32px height) applied', () => {
        render(<Button spacing="default">Default Spacing</Button>)

        const button = screen.getByRole('button', { name: /default spacing/i })
        expect(button).toHaveClass('min-h-[32px]')
      })
    })

    describe('as is: Button with spacing="compact"', () => {
      it('to be: compact spacing (24px height) applied', () => {
        render(<Button spacing="compact">Compact Spacing</Button>)

        const button = screen.getByRole('button', { name: /compact spacing/i })
        expect(button).toHaveClass('min-h-[24px]')
      })
    })
  })

  describe('Click Handlers', () => {
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
  })

  describe('Disabled State', () => {
    describe('as is: Button with isDisabled=true and onClick handler', () => {
      describe('when: user clicks button', () => {
        it('to be: onClick handler not called, button is non-interactive', async () => {
          const user = userEvent.setup()
          const handleClick = jest.fn()

          render(
            <Button isDisabled onClick={handleClick}>
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

    describe('as is: Button with isDisabled state', () => {
      describe('when: isDisabled prop is true', () => {
        it('to be: disabled styles applied, onClick not called', async () => {
          const user = userEvent.setup()
          const handleClick = jest.fn()

          render(
            <Button appearance="primary" isDisabled onClick={handleClick}>
              Disabled
            </Button>,
          )

          const button = screen.getByRole('button', { name: /disabled/i })
          expect(button).toBeDisabled()
          expect(button).toHaveClass('cursor-not-allowed')

          await user.click(button)
          expect(handleClick).not.toHaveBeenCalled()
        })
      })
    })
  })

  describe('Loading State', () => {
    describe('as is: Button with isLoading=true', () => {
      describe('when: rendered', () => {
        it('to be: loading spinner shown, button non-interactive', async () => {
          const user = userEvent.setup()
          const handleClick = jest.fn()

          render(
            <Button isLoading onClick={handleClick}>
              Loading
            </Button>,
          )

          const button = screen.getByRole('button', { name: /loading/i })
          expect(button).toBeDisabled()
          expect(button).toHaveAttribute('aria-busy', 'true')
          expect(button).toHaveClass('cursor-wait')

          // Loading spinner should be present
          const spinner = button.querySelector('svg')
          expect(spinner).toBeInTheDocument()
          expect(spinner).toHaveClass('animate-spin')

          await user.click(button)
          expect(handleClick).not.toHaveBeenCalled()
        })
      })
    })
  })

  describe('Selected State', () => {
    describe('as is: Button with isSelected=true', () => {
      describe('when: rendered', () => {
        it('to be: selected state applied with aria-pressed', () => {
          render(<Button isSelected>Selected</Button>)

          const button = screen.getByRole('button', { name: /selected/i })
          expect(button).toHaveAttribute('aria-pressed', 'true')
          expect(button).toHaveAttribute('data-selected', 'true')
        })
      })
    })
  })

  describe('Icon Support', () => {
    describe('as is: Button with iconBefore', () => {
      describe('when: rendered', () => {
        it('to be: icon rendered before label', () => {
          const TestIcon = () => <span data-testid="test-icon">Icon</span>

          render(<Button iconBefore={<TestIcon />}>With Icon</Button>)

          const button = screen.getByRole('button', { name: /with icon/i })
          const icon = screen.getByTestId('test-icon')

          expect(button).toBeInTheDocument()
          expect(icon).toBeInTheDocument()
        })
      })
    })

    describe('as is: Button with iconAfter', () => {
      describe('when: rendered', () => {
        it('to be: icon rendered after label', () => {
          const ChevronIcon = () => <span data-testid="chevron-icon">Chevron</span>

          render(<Button iconAfter={<ChevronIcon />}>Dropdown</Button>)

          const button = screen.getByRole('button', { name: /dropdown/i })
          const icon = screen.getByTestId('chevron-icon')

          expect(button).toBeInTheDocument()
          expect(icon).toBeInTheDocument()
        })
      })
    })

    describe('as is: Button with both iconBefore and iconAfter', () => {
      describe('when: rendered', () => {
        it('to be: both icons rendered', () => {
          const BeforeIcon = () => <span data-testid="before-icon">Before</span>
          const AfterIcon = () => <span data-testid="after-icon">After</span>

          render(
            <Button iconBefore={<BeforeIcon />} iconAfter={<AfterIcon />}>
              Both Icons
            </Button>,
          )

          expect(screen.getByTestId('before-icon')).toBeInTheDocument()
          expect(screen.getByTestId('after-icon')).toBeInTheDocument()
        })
      })
    })

    describe('as is: Button with isLoading=true and icons', () => {
      describe('when: rendered', () => {
        it('to be: icons hidden, only spinner shown', () => {
          const TestIcon = () => <span data-testid="test-icon">Icon</span>

          render(
            <Button isLoading iconBefore={<TestIcon />}>
              Loading
            </Button>,
          )

          // Icons should not be rendered when loading
          expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument()

          // Spinner should be present
          const button = screen.getByRole('button')
          const spinner = button.querySelector('svg')
          expect(spinner).toBeInTheDocument()
        })
      })
    })
  })

  describe('Keyboard Navigation', () => {
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
  })

  describe('Accessibility', () => {
    describe('as is: Button with aria-label', () => {
      describe('when: component renders', () => {
        it('to be: aria-label attribute present', () => {
          render(<Button aria-label="Close dialog">×</Button>)

          const button = screen.getByRole('button', { name: /close dialog/i })
          expect(button).toHaveAttribute('aria-label', 'Close dialog')
        })
      })
    })
  })

  describe('SDUI Integration', () => {
    describe('as is: Button with nodeId, SDUI document loaded', () => {
      describe('when: node state changes', () => {
        it('to be: button reflects state changes', () => {
          // This test verifies that nodeId prop is accepted
          // Full SDUI integration would require SduiLayoutRenderer setup
          const { rerender } = render(<Button nodeId="button-1">SDUI Button</Button>)

          let button = screen.getByRole('button', { name: /sdui button/i })
          expect(button).toBeInTheDocument()
          expect(button).toHaveAttribute('data-node-id', 'button-1')

          // Simulate state change by re-rendering with different props
          rerender(
            <Button nodeId="button-1" isDisabled>
              SDUI Button
            </Button>,
          )

          button = screen.getByRole('button', { name: /sdui button/i })
          expect(button).toBeDisabled()
        })
      })
    })

    describe('as is: Button with eventId', () => {
      describe('when: component renders', () => {
        it('to be: eventId data attribute present', () => {
          render(
            <Button nodeId="button-1" eventId="submit-click">
              Submit
            </Button>,
          )

          const button = screen.getByRole('button', { name: /submit/i })
          expect(button).toHaveAttribute('data-event-id', 'submit-click')
        })
      })
    })
  })

  describe('All Combinations', () => {
    const appearances = ['default', 'primary', 'subtle', 'warning', 'danger'] as const
    const spacings = ['default', 'compact'] as const

    appearances.forEach((appearance) => {
      spacings.forEach((spacing) => {
        describe(`as is: Button with appearance="${appearance}" and spacing="${spacing}"`, () => {
          it('to be: renders correctly', () => {
            render(
              <Button appearance={appearance} spacing={spacing}>
                {`${appearance} ${spacing}`}
              </Button>,
            )

            const button = screen.getByRole('button')
            expect(button).toBeInTheDocument()
          })
        })
      })
    })
  })
})
