import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import { Checkbox } from '../Checkbox'

describe('Checkbox', () => {
  describe('Compound Pattern', () => {
    it('renders with Root, Checkbox, and Label', () => {
      render(
        <Checkbox.Root>
          <Checkbox.Label>Accept terms</Checkbox.Label>
          <Checkbox.Checkbox />
        </Checkbox.Root>,
      )
      const checkbox = screen.getByRole('checkbox')
      const label = screen.getByText('Accept terms')
      expect(checkbox).toBeInTheDocument()
      expect(label).toBeInTheDocument()
      // Label should be connected to checkbox
      expect(label).toHaveAttribute('for', checkbox.id)
    })

    it('connects label to checkbox via context', () => {
      render(
        <Checkbox.Root>
          <Checkbox.Label>Test label</Checkbox.Label>
          <Checkbox.Checkbox />
        </Checkbox.Root>,
      )
      const checkbox = screen.getByRole('checkbox')
      const label = screen.getByText('Test label')
      expect(label).toHaveAttribute('for', checkbox.id)
    })
  })

  describe('Rendering', () => {
    it('renders with default props', () => {
      render(
        <Checkbox.Root>
          <Checkbox.Label>Test checkbox</Checkbox.Label>
          <Checkbox.Checkbox />
        </Checkbox.Root>,
      )
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeInTheDocument()
      // Radix Checkbox uses data-state attribute
      expect(checkbox).toHaveAttribute('data-state', 'unchecked')
    })

    it('renders with checked=true', () => {
      render(
        <Checkbox.Root>
          <Checkbox.Label>Test checkbox</Checkbox.Label>
          <Checkbox.Checkbox checked />
        </Checkbox.Root>,
      )
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('data-state', 'checked')
    })

    it('renders with defaultChecked (uncontrolled)', () => {
      render(
        <Checkbox.Root>
          <Checkbox.Label>Test checkbox</Checkbox.Label>
          <Checkbox.Checkbox defaultChecked />
        </Checkbox.Root>,
      )
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('data-state', 'checked')
    })

    it('renders with 14px size (Figma spec)', () => {
      render(
        <Checkbox.Root>
          <Checkbox.Label>Test</Checkbox.Label>
          <Checkbox.Checkbox />
        </Checkbox.Root>,
      )
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveClass('size-[14px]')
    })
  })

  describe('States', () => {
    it('handles disabled state from Root', () => {
      render(
        <Checkbox.Root disabled>
          <Checkbox.Label>Test</Checkbox.Label>
          <Checkbox.Checkbox />
        </Checkbox.Root>,
      )
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeDisabled()
      // Radix uses data-disabled attribute
      expect(checkbox).toHaveAttribute('data-disabled', '')
    })

    it('handles disabled state from Checkbox prop', () => {
      render(
        <Checkbox.Root>
          <Checkbox.Label>Test</Checkbox.Label>
          <Checkbox.Checkbox disabled />
        </Checkbox.Root>,
      )
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toBeDisabled()
    })

    it('handles indeterminate state', () => {
      render(
        <Checkbox.Root>
          <Checkbox.Label>Select all</Checkbox.Label>
          <Checkbox.Checkbox indeterminate />
        </Checkbox.Root>,
      )
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAttribute('data-indeterminate', '')
    })

    it('handles required state', () => {
      render(
        <Checkbox.Root required>
          <Checkbox.Label>Accept terms</Checkbox.Label>
          <Checkbox.Checkbox />
        </Checkbox.Root>,
      )
      const label = screen.getByText('Accept terms')
      const asterisk = label.querySelector('span')
      expect(asterisk).toBeInTheDocument()
    })

    it('handles error state', () => {
      render(
        <Checkbox.Root error>
          <Checkbox.Label>Accept terms</Checkbox.Label>
          <Checkbox.Checkbox />
        </Checkbox.Root>,
      )
      const label = screen.getByText('Accept terms')
      expect(label.className).toContain('text-[var(--color-text-danger)]')
    })
  })

  describe('Interactions', () => {
    it('calls onCheckedChange when clicked (controlled)', () => {
      const handleChange = jest.fn()
      render(
        <Checkbox.Root>
          <Checkbox.Label>Test</Checkbox.Label>
          <Checkbox.Checkbox checked={false} onCheckedChange={handleChange} />
        </Checkbox.Root>,
      )

      const checkbox = screen.getByRole('checkbox')
      fireEvent.click(checkbox)

      expect(handleChange).toHaveBeenCalledWith(true)
    })

    it('toggles state when clicked (uncontrolled)', () => {
      render(
        <Checkbox.Root>
          <Checkbox.Label>Test</Checkbox.Label>
          <Checkbox.Checkbox defaultChecked={false} />
        </Checkbox.Root>,
      )
      const checkbox = screen.getByRole('checkbox')

      expect(checkbox).toHaveAttribute('data-state', 'unchecked')

      fireEvent.click(checkbox)
      expect(checkbox).toHaveAttribute('data-state', 'checked')

      fireEvent.click(checkbox)
      expect(checkbox).toHaveAttribute('data-state', 'unchecked')
    })

    it('does not toggle when disabled', () => {
      const handleChange = jest.fn()
      render(
        <Checkbox.Root disabled>
          <Checkbox.Label>Test</Checkbox.Label>
          <Checkbox.Checkbox onCheckedChange={handleChange} />
        </Checkbox.Root>,
      )

      const checkbox = screen.getByRole('checkbox')
      fireEvent.click(checkbox)

      expect(handleChange).not.toHaveBeenCalled()
    })

    it('toggles when label is clicked', () => {
      const handleChange = jest.fn()
      render(
        <Checkbox.Root>
          <Checkbox.Label>Test label</Checkbox.Label>
          <Checkbox.Checkbox checked={false} onCheckedChange={handleChange} />
        </Checkbox.Root>,
      )

      const label = screen.getByText('Test label')
      fireEvent.click(label)

      expect(handleChange).toHaveBeenCalledWith(true)
    })
  })

  describe('Focus Ring', () => {
    it('applies focus ring styles on focus', () => {
      render(
        <Checkbox.Root>
          <Checkbox.Label>Test</Checkbox.Label>
          <Checkbox.Checkbox />
        </Checkbox.Root>,
      )
      const checkbox = screen.getByRole('checkbox')
      // Focus ring should be applied via focus-visible:before styles
      expect(checkbox).toHaveClass('focus-visible:before:border-[length:var(--stroke/bold,2px)]')
    })
  })
})
