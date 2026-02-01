import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  describe('Removable Tags', () => {
    describe('as is: Tag with isRemovable=true', () => {
      it('to be: remove button rendered', () => {
        render(<Tag text="Removable" isRemovable />)

        const removeButton = screen.getByRole('button', { name: /remove removable/i })
        expect(removeButton).toBeInTheDocument()
      })
    })

    describe('as is: Tag with isRemovable=true and onRemove handler', () => {
      describe('when: user clicks remove button', () => {
        it('to be: onRemove handler called', async () => {
          const user = userEvent.setup()
          const handleRemove = jest.fn()

          render(<Tag text="Removable" isRemovable onRemove={handleRemove} />)

          const removeButton = screen.getByRole('button', { name: /remove removable/i })
          await user.click(removeButton)

          expect(handleRemove).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('as is: Tag with isRemovable=true', () => {
      describe('when: user presses Backspace on tag', () => {
        it('to be: onRemove handler called', async () => {
          const user = userEvent.setup()
          const handleRemove = jest.fn()

          render(<Tag text="Removable" isRemovable onRemove={handleRemove} />)

          // Get the root span element (parent of text span)
          const tag = screen.getByText('Removable').parentElement as HTMLElement
          tag.focus()
          await user.keyboard('{Backspace}')

          expect(handleRemove).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('as is: Tag with isRemovable=true', () => {
      describe('when: user presses Delete on tag', () => {
        it('to be: onRemove handler called', async () => {
          const user = userEvent.setup()
          const handleRemove = jest.fn()

          render(<Tag text="Removable" isRemovable onRemove={handleRemove} />)

          // Get the root span element (parent of text span)
          const tag = screen.getByText('Removable').parentElement as HTMLElement
          tag.focus()
          await user.keyboard('{Delete}')

          expect(handleRemove).toHaveBeenCalledTimes(1)
        })
      })
    })
  })

  describe('Link Tags', () => {
    describe('as is: Tag with isLink=true', () => {
      it('to be: tag rendered with underline style', () => {
        render(<Tag text="Link Tag" isLink />)

        const tag = screen.getByText('Link Tag')
        expect(tag).toHaveClass('underline')
      })
    })

    describe('as is: Tag with href', () => {
      it('to be: tag rendered as anchor element', () => {
        render(<Tag text="Link Tag" href="/test" />)

        const tag = screen.getByRole('link', { name: /link tag/i })
        expect(tag).toBeInTheDocument()
        expect(tag).toHaveAttribute('href', '/test')
      })
    })
  })

  describe('Clickable Tags', () => {
    describe('as is: Tag with onClick handler', () => {
      describe('when: user clicks tag', () => {
        it('to be: onClick handler called', async () => {
          const user = userEvent.setup()
          const handleClick = jest.fn()

          render(<Tag text="Clickable" onClick={handleClick} />)

          const tag = screen.getByText('Clickable').closest('span')
          await user.click(tag!)

          expect(handleClick).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('as is: Tag with onClick handler', () => {
      it('to be: tag has role="button" and is focusable', () => {
        render(<Tag text="Clickable" onClick={() => {}} />)

        const tag = screen.getByRole('button', { name: /clickable/i })
        expect(tag).toBeInTheDocument()
        expect(tag).toHaveAttribute('tabindex', '0')
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

  describe('Accessibility', () => {
    describe('as is: Tag with isRemovable=true', () => {
      it('to be: remove button has aria-label', () => {
        render(<Tag text="React" isRemovable />)

        const removeButton = screen.getByRole('button', { name: /remove react/i })
        expect(removeButton).toHaveAttribute('aria-label', 'Remove React')
      })
    })
  })

  describe('SDUI Integration', () => {
    describe('as is: Tag with nodeId', () => {
      it('to be: data-node-id attribute present', () => {
        render(<Tag text="SDUI Tag" nodeId="tag-1" />)

        // Get the root span element (parent of text span)
        const tag = screen.getByText('SDUI Tag').parentElement
        expect(tag).toHaveAttribute('data-node-id', 'tag-1')
      })
    })

    describe('as is: Tag with eventId', () => {
      it('to be: data-event-id attribute present', () => {
        render(<Tag text="Event Tag" nodeId="tag-1" eventId="tag-click" />)

        // Get the root span element (parent of text span)
        const tag = screen.getByText('Event Tag').parentElement
        expect(tag).toHaveAttribute('data-event-id', 'tag-click')
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
