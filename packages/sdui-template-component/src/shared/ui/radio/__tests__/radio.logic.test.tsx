import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import { Radio } from '../Radio'
import { RadioGroup } from '../RadioGroup'

describe('Radio', () => {
  describe('Compound Pattern', () => {
    it('renders with Root, Radio, and Label', () => {
      render(
        <Radio.Root name="test">
          <Radio.Label>Option 1</Radio.Label>
          <Radio.Radio value="option1" />
        </Radio.Root>,
      )
      const radio = screen.getByRole('radio')
      const label = screen.getByText('Option 1')
      expect(radio).toBeInTheDocument()
      expect(label).toBeInTheDocument()
      // Label should be connected to radio
      expect(label).toHaveAttribute('for', radio.id)
    })

    it('connects label to radio via context', () => {
      render(
        <Radio.Root name="test">
          <Radio.Label>Test label</Radio.Label>
          <Radio.Radio value="option1" />
        </Radio.Root>,
      )
      const radio = screen.getByRole('radio')
      const label = screen.getByText('Test label')
      expect(label).toHaveAttribute('for', radio.id)
    })
  })

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(
        <Radio.Root name="test">
          <Radio.Label>Test radio</Radio.Label>
          <Radio.Radio value="option1" />
        </Radio.Root>,
      )
      const radio = screen.getByRole('radio')
      expect(radio).toBeInTheDocument()
      // Radio should be unchecked by default
      expect(radio).not.toBeChecked()
      expect(radio).toHaveAttribute('aria-checked', 'false')
    })

    it('renders with checked=true', () => {
      render(
        <Radio.Root name="test">
          <Radio.Label>Test radio</Radio.Label>
          <Radio.Radio value="option1" checked />
        </Radio.Root>,
      )
      const radio = screen.getByRole('radio')
      expect(radio).toBeChecked()
      expect(radio).toHaveAttribute('aria-checked', 'true')
    })

    it('renders with 14px size (Figma spec)', () => {
      render(
        <Radio.Root name="test">
          <Radio.Label>Test</Radio.Label>
          <Radio.Radio value="option1" />
        </Radio.Root>,
      )
      const radio = screen.getByRole('radio')
      expect(radio).toHaveClass('size-[14px]')
    })
  })

  describe('States', () => {
    it('handles disabled state from Root', () => {
      render(
        <Radio.Root name="test" disabled>
          <Radio.Label>Test</Radio.Label>
          <Radio.Radio value="option1" />
        </Radio.Root>,
      )
      const radio = screen.getByRole('radio')
      expect(radio).toBeDisabled()
      expect(radio).toHaveAttribute('aria-disabled', 'true')
    })

    it('handles disabled state from Radio prop', () => {
      render(
        <Radio.Root name="test">
          <Radio.Label>Test</Radio.Label>
          <Radio.Radio value="option1" disabled />
        </Radio.Root>,
      )
      const radio = screen.getByRole('radio')
      expect(radio).toBeDisabled()
    })

    it('handles error state from Root', () => {
      render(
        <Radio.Root name="test" error>
          <Radio.Label>Test</Radio.Label>
          <Radio.Radio value="option1" />
        </Radio.Root>,
      )
      const label = screen.getByText('Test')
      expect(label.className).toContain('text-[var(--color-text-danger)]')
    })

    it('handles required state from Root', () => {
      render(
        <Radio.Root name="test" required>
          <Radio.Label>Test</Radio.Label>
          <Radio.Radio value="option1" />
        </Radio.Root>,
      )
      const label = screen.getByText('Test')
      const asterisk = label.querySelector('span')
      expect(asterisk).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('calls onCheckedChange when clicked', () => {
      const handleChange = jest.fn()
      render(
        <Radio.Root name="test">
          <Radio.Label>Test</Radio.Label>
          <Radio.Radio value="option1" onCheckedChange={handleChange} />
        </Radio.Root>,
      )
      const radio = screen.getByRole('radio')
      fireEvent.click(radio)
      expect(handleChange).toHaveBeenCalledWith(true)
    })

    it('does not call onCheckedChange when disabled', () => {
      const handleChange = jest.fn()
      render(
        <Radio.Root name="test" disabled>
          <Radio.Label>Test</Radio.Label>
          <Radio.Radio value="option1" onCheckedChange={handleChange} />
        </Radio.Root>,
      )
      const radio = screen.getByRole('radio')
      fireEvent.click(radio)
      expect(handleChange).not.toHaveBeenCalled()
    })
  })
})

describe('RadioGroup', () => {
  describe('as is: RadioGroup with multiple radios', () => {
    describe('when: RadioGroup rendered with multiple radios', () => {
      it('to be: only one radio is selected, should have single selected value', () => {
        render(
          <RadioGroup name="options" value="option2">
            <Radio.Root>
              <Radio.Label>Option 1</Radio.Label>
              <Radio.Radio value="option1" />
            </Radio.Root>
            <Radio.Root>
              <Radio.Label>Option 2</Radio.Label>
              <Radio.Radio value="option2" />
            </Radio.Root>
            <Radio.Root>
              <Radio.Label>Option 3</Radio.Label>
              <Radio.Radio value="option3" />
            </Radio.Root>
          </RadioGroup>,
        )
        const radios = screen.getAllByRole('radio')
        expect(radios).toHaveLength(3)
        // Only option2 should be checked
        expect(radios[0]).not.toBeChecked()
        expect(radios[1]).toBeChecked()
        expect(radios[2]).not.toBeChecked()
      })
    })

    describe('when: clicking different radio in group', () => {
      it('to be: selection moves to clicked radio, should call onValueChange', () => {
        const handleChange = jest.fn()
        render(
          <RadioGroup name="options" value="option1" onValueChange={handleChange}>
            <Radio.Root>
              <Radio.Label>Option 1</Radio.Label>
              <Radio.Radio value="option1" />
            </Radio.Root>
            <Radio.Root>
              <Radio.Label>Option 2</Radio.Label>
              <Radio.Radio value="option2" />
            </Radio.Root>
          </RadioGroup>,
        )
        const radios = screen.getAllByRole('radio')
        expect(radios[0]).toBeChecked()
        expect(radios[1]).not.toBeChecked()

        fireEvent.click(radios[1])

        // onValueChange should be called with option2
        expect(handleChange).toHaveBeenCalledWith('option2')
      })
    })

    describe('when: RadioGroup is disabled', () => {
      it('to be: all radios are disabled, should have disabled attribute', () => {
        render(
          <RadioGroup name="options" disabled>
            <Radio.Root>
              <Radio.Label>Option 1</Radio.Label>
              <Radio.Radio value="option1" />
            </Radio.Root>
            <Radio.Root>
              <Radio.Label>Option 2</Radio.Label>
              <Radio.Radio value="option2" />
            </Radio.Root>
          </RadioGroup>,
        )
        const radios = screen.getAllByRole('radio')
        radios.forEach((radio) => {
          expect(radio).toBeDisabled()
        })
      })
    })

    describe('when: RadioGroup has error state', () => {
      it('to be: error styling is applied to all radios, should have error class', () => {
        render(
          <RadioGroup name="options" error>
            <Radio.Root>
              <Radio.Label>Option 1</Radio.Label>
              <Radio.Radio value="option1" />
            </Radio.Root>
            <Radio.Root>
              <Radio.Label>Option 2</Radio.Label>
              <Radio.Radio value="option2" />
            </Radio.Root>
          </RadioGroup>,
        )
        const labels = screen.getAllByText(/Option/)
        labels.forEach((label) => {
          expect(label.className).toContain('text-[var(--color-text-danger)]')
        })
      })
    })
  })
})
