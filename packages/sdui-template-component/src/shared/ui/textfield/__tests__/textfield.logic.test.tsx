import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { TextField } from '../TextField'

describe('TextField - Logic Tests', () => {
  describe('as is: TextField with label and input', () => {
    describe('when: user types text', () => {
      it('to be: value updates, onChange handler called', async () => {
        const user = userEvent.setup()
        const handleChange = jest.fn()

        render(
          <TextField>
            <TextField.Wrapper>
              <TextField.Label>Email</TextField.Label>
              <TextField.Input placeholder="Enter your email" onChange={handleChange} data-testid="textfield" />
            </TextField.Wrapper>
          </TextField>,
        )

        const input = screen.getByTestId('textfield')
        await user.type(input, 'test@example.com')

        expect(input).toHaveValue('test@example.com')
        expect(handleChange).toHaveBeenCalledTimes(16) // Called for each character
      })
    })
  })

  describe('as is: TextField with controlled value', () => {
    describe('when: value prop changes', () => {
      it('to be: input value updates to match prop', () => {
        const { rerender } = render(
          <TextField>
            <TextField.Wrapper>
              <TextField.Input value="initial" onChange={jest.fn()} data-testid="textfield" />
            </TextField.Wrapper>
          </TextField>,
        )

        const input = screen.getByTestId('textfield')
        expect(input).toHaveValue('initial')

        rerender(
          <TextField>
            <TextField.Wrapper>
              <TextField.Input value="updated" onChange={jest.fn()} data-testid="textfield" />
            </TextField.Wrapper>
          </TextField>,
        )

        expect(input).toHaveValue('updated')
      })
    })
  })

  describe('as is: TextField with error state', () => {
    describe('when: error=true and errorMessage provided', () => {
      it('to be: error message displayed, aria-invalid set, accessibility attributes set', () => {
        render(
          <TextField error errorMessage="Invalid email format">
            <TextField.Wrapper>
              <TextField.Label>Email</TextField.Label>
              <TextField.Input data-testid="textfield" />
              <TextField.HelpMessage />
            </TextField.Wrapper>
          </TextField>,
        )

        const input = screen.getByTestId('textfield')
        const errorMessage = screen.getByText('Invalid email format')

        expect(errorMessage).toBeInTheDocument()
        expect(input).toHaveAttribute('aria-invalid', 'true')
        expect(errorMessage).toHaveAttribute('role', 'alert')
        expect(errorMessage).toHaveAttribute('aria-live', 'polite')
      })
    })
  })

  describe('as is: TextField with disabled state', () => {
    describe('when: disabled=true', () => {
      it('to be: input disabled, not focusable, onClick not called', async () => {
        const user = userEvent.setup()
        const handleChange = jest.fn()

        render(
          <TextField disabled>
            <TextField.Wrapper>
              <TextField.Input onChange={handleChange} data-testid="textfield" />
            </TextField.Wrapper>
          </TextField>,
        )

        const input = screen.getByTestId('textfield')

        expect(input).toBeDisabled()
        expect(input).toHaveAttribute('tabIndex', '-1')

        await user.click(input)
        await user.type(input, 'test')

        expect(handleChange).not.toHaveBeenCalled()
        expect(input).toHaveValue('')
      })
    })
  })

  describe('as is: TextField with keyboard navigation', () => {
    describe('when: user presses Tab key', () => {
      it('to be: input receives focus', async () => {
        const user = userEvent.setup()

        render(
          <TextField>
            <TextField.Wrapper>
              <TextField.Input data-testid="textfield" />
            </TextField.Wrapper>
          </TextField>,
        )

        const input = screen.getByTestId('textfield')

        await user.tab()

        expect(input).toHaveFocus()
      })
    })
  })

  describe('as is: TextField with onFocus and onBlur handlers', () => {
    describe('when: input receives and loses focus', () => {
      it('to be: onFocus called on focus, onBlur called on blur', async () => {
        const user = userEvent.setup()
        const handleFocus = jest.fn()
        const handleBlur = jest.fn()

        render(
          <TextField>
            <TextField.Wrapper>
              <TextField.Input onFocus={handleFocus} onBlur={handleBlur} data-testid="textfield" />
            </TextField.Wrapper>
          </TextField>,
        )

        const input = screen.getByTestId('textfield')

        await user.click(input)
        expect(handleFocus).toHaveBeenCalledTimes(1)

        await user.tab()
        expect(handleBlur).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('as is: TextField with rightIcon and onRightIconClick', () => {
    describe('when: user clicks right icon', () => {
      it('to be: onRightIconClick handler called', async () => {
        const user = userEvent.setup()
        const handleRightIconClick = jest.fn()

        render(
          <TextField>
            <TextField.Wrapper>
              <TextField.Input
                rightIcon={<span data-testid="right-icon">X</span>}
                onRightIconClick={handleRightIconClick}
                data-testid="textfield"
              />
            </TextField.Wrapper>
          </TextField>,
        )

        const rightIcon = screen.getByTestId('right-icon').closest('button')
        expect(rightIcon).toBeInTheDocument()

        await user.click(rightIcon!)

        expect(handleRightIconClick).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('as is: TextField with leftIcon', () => {
    describe('when: component renders', () => {
      it('to be: left icon displayed', () => {
        render(
          <TextField>
            <TextField.Wrapper>
              <TextField.Input leftIcon={<span data-testid="left-icon">🔍</span>} data-testid="textfield" />
            </TextField.Wrapper>
          </TextField>,
        )

        const leftIcon = screen.getByTestId('left-icon')

        expect(leftIcon).toBeInTheDocument()
      })
    })
  })

  describe('as is: TextField with helpMessage', () => {
    describe('when: helpMessage provided and error=false', () => {
      it('to be: help message displayed', () => {
        render(
          <TextField helpMessage="Enter a valid email address">
            <TextField.Wrapper>
              <TextField.Input data-testid="textfield" />
              <TextField.HelpMessage />
            </TextField.Wrapper>
          </TextField>,
        )

        const helpMessage = screen.getByText('Enter a valid email address')

        expect(helpMessage).toBeInTheDocument()
      })
    })
  })

  describe('as is: TextField with error=true and helpMessage', () => {
    describe('when: errorMessage provided', () => {
      it('to be: errorMessage displayed instead of helpMessage', () => {
        render(
          <TextField error helpMessage="Help message" errorMessage="Error message">
            <TextField.Wrapper>
              <TextField.Input data-testid="textfield" />
              <TextField.HelpMessage />
            </TextField.Wrapper>
          </TextField>,
        )

        expect(screen.getByText('Error message')).toBeInTheDocument()
        expect(screen.queryByText('Help message')).not.toBeInTheDocument()
      })
    })
  })

  describe('as is: TextField with label and id', () => {
    describe('when: component renders', () => {
      it('to be: label connected to input via htmlFor/id', () => {
        render(
          <TextField id="email-input">
            <TextField.Wrapper>
              <TextField.Label>Email</TextField.Label>
              <TextField.Input data-testid="textfield" />
            </TextField.Wrapper>
          </TextField>,
        )

        const label = screen.getByText('Email')
        const input = screen.getByTestId('textfield')

        expect(label).toHaveAttribute('for', 'email-input')
        expect(input).toHaveAttribute('id', 'email-input')
        expect(input).toHaveAttribute('aria-labelledby', expect.stringContaining('label'))
      })
    })
  })

  describe('as is: TextField with required prop', () => {
    describe('when: required=true', () => {
      it('to be: required indicator displayed, aria-required set', () => {
        render(
          <TextField required>
            <TextField.Wrapper>
              <TextField.Label>Email</TextField.Label>
              <TextField.Input data-testid="textfield" />
            </TextField.Wrapper>
          </TextField>,
        )

        const label = screen.getByText('Email')
        const input = screen.getByTestId('textfield')

        expect(label).toHaveTextContent('Email*')
        expect(input).toHaveAttribute('aria-required', 'true')
        expect(input).toHaveAttribute('required')
      })
    })
  })

  describe('as is: TextField with maxLength', () => {
    describe('when: user types beyond maxLength', () => {
      it('to be: input limited to maxLength characters', async () => {
        const user = userEvent.setup()

        render(
          <TextField>
            <TextField.Wrapper>
              <TextField.Input maxLength={10} data-testid="textfield" />
            </TextField.Wrapper>
          </TextField>,
        )

        const input = screen.getByTestId('textfield')
        await user.type(input, '123456789012345')

        expect(input).toHaveValue('1234567890') // Limited to 10 characters
      })
    })
  })

  describe('as is: TextField with different input types', () => {
    describe('when: type="email"', () => {
      it('to be: email input type applied', () => {
        render(
          <TextField>
            <TextField.Wrapper>
              <TextField.Input type="email" data-testid="textfield" />
            </TextField.Wrapper>
          </TextField>,
        )

        const input = screen.getByTestId('textfield')
        expect(input).toHaveAttribute('type', 'email')
      })
    })

    describe('when: type="password"', () => {
      it('to be: password input type applied', () => {
        render(
          <TextField>
            <TextField.Wrapper>
              <TextField.Input type="password" data-testid="textfield" />
            </TextField.Wrapper>
          </TextField>,
        )

        const input = screen.getByTestId('textfield')
        expect(input).toHaveAttribute('type', 'password')
      })
    })
  })

  describe('as is: TextField with uncontrolled defaultValue', () => {
    describe('when: defaultValue provided', () => {
      it('to be: initial value set, can be changed by user', async () => {
        const user = userEvent.setup()

        render(
          <TextField>
            <TextField.Wrapper>
              <TextField.Input defaultValue="initial value" data-testid="textfield" />
            </TextField.Wrapper>
          </TextField>,
        )

        const input = screen.getByTestId('textfield')
        expect(input).toHaveValue('initial value')

        await user.clear(input)
        await user.type(input, 'new value')

        expect(input).toHaveValue('new value')
      })
    })
  })

  describe('as is: TextField with disabled rightIcon', () => {
    describe('when: disabled=true and rightIcon provided', () => {
      it('to be: right icon button disabled, not clickable', async () => {
        const user = userEvent.setup()
        const handleRightIconClick = jest.fn()

        render(
          <TextField disabled>
            <TextField.Wrapper>
              <TextField.Input
                rightIcon={<span data-testid="right-icon">X</span>}
                onRightIconClick={handleRightIconClick}
                data-testid="textfield"
              />
            </TextField.Wrapper>
          </TextField>,
        )

        const rightIconButton = screen.getByTestId('right-icon').closest('button')

        expect(rightIconButton).toBeDisabled()
        expect(rightIconButton).toHaveAttribute('tabIndex', '-1')

        await user.click(rightIconButton!)

        expect(handleRightIconClick).not.toHaveBeenCalled()
      })
    })
  })

  describe('as is: TextField with aria-describedby', () => {
    describe('when: helpMessage or errorMessage provided', () => {
      it('to be: input has aria-describedby pointing to message', () => {
        render(
          <TextField helpMessage="Help message">
            <TextField.Wrapper>
              <TextField.Input data-testid="textfield" />
              <TextField.HelpMessage />
            </TextField.Wrapper>
          </TextField>,
        )

        const input = screen.getByTestId('textfield')
        const helpMessage = screen.getByText('Help message')

        expect(input).toHaveAttribute('aria-describedby', helpMessage.id)
      })
    })
  })

  describe('as is: TextField with rapid input', () => {
    describe('when: user types quickly', () => {
      it('to be: all keystrokes captured, no performance issues', async () => {
        const user = userEvent.setup()
        const handleChange = jest.fn()

        render(
          <TextField>
            <TextField.Wrapper>
              <TextField.Input onChange={handleChange} data-testid="textfield" />
            </TextField.Wrapper>
          </TextField>,
        )

        const input = screen.getByTestId('textfield')
        const rapidInput = 'abcdefghijklmnopqrstuvwxyz'

        await user.type(input, rapidInput)

        expect(input).toHaveValue(rapidInput)
        expect(handleChange).toHaveBeenCalledTimes(rapidInput.length)
      })
    })
  })

  describe('as is: TextField with horizontal orientation', () => {
    describe('when: orientation="horizontal"', () => {
      it('to be: label and input arranged horizontally', () => {
        render(
          <TextField>
            <TextField.Wrapper orientation="horizontal">
              <TextField.Label>Email</TextField.Label>
              <TextField.Input data-testid="textfield" />
            </TextField.Wrapper>
          </TextField>,
        )

        const wrapper = screen.getByTestId('textfield').closest('div')?.parentElement
        expect(wrapper).toHaveClass('flex', 'items-center', 'gap-2')
      })
    })
  })

  describe('as is: TextField with vertical orientation', () => {
    describe('when: orientation="vertical"', () => {
      it('to be: label and input arranged vertically', () => {
        render(
          <TextField>
            <TextField.Wrapper orientation="vertical">
              <TextField.Label>Email</TextField.Label>
              <TextField.Input data-testid="textfield" />
            </TextField.Wrapper>
          </TextField>,
        )

        const wrapper = screen.getByTestId('textfield').closest('div')?.parentElement
        expect(wrapper).toHaveClass('flex', 'flex-col', 'gap-2')
      })
    })
  })

  describe('as is: TextField with custom orientation', () => {
    describe('when: orientation="custom"', () => {
      it('to be: no default layout classes applied', () => {
        render(
          <TextField>
            <TextField.Wrapper orientation="custom" className="custom-layout">
              <TextField.Label>Email</TextField.Label>
              <TextField.Input data-testid="textfield" />
            </TextField.Wrapper>
          </TextField>,
        )

        const wrapper = screen.getByTestId('textfield').closest('div')?.parentElement
        expect(wrapper).toHaveClass('custom-layout')
        expect(wrapper).not.toHaveClass('flex', 'flex-col', 'items-center')
      })
    })
  })

  describe('as is: TextField compound components used outside TextField', () => {
    describe('when: Label used without TextField context', () => {
      it('to be: throws error', () => {
        // Suppress console.error for this test
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

        expect(() => {
          render(<TextField.Label>Email</TextField.Label>)
        }).toThrow('TextField compound components must be used within TextField component')

        consoleSpy.mockRestore()
      })
    })
  })

  describe('as is: TextField with custom HelpMessage children', () => {
    describe('when: children provided to HelpMessage', () => {
      it('to be: custom children displayed instead of Context message', () => {
        render(
          <TextField helpMessage="Context help message">
            <TextField.Wrapper>
              <TextField.Input data-testid="textfield" />
              <TextField.HelpMessage>Custom message</TextField.HelpMessage>
            </TextField.Wrapper>
          </TextField>,
        )

        expect(screen.getByText('Custom message')).toBeInTheDocument()
        expect(screen.queryByText('Context help message')).not.toBeInTheDocument()
      })
    })
  })
})
