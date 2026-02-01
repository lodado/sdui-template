import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import { Toggle } from '../Toggle'

describe('Toggle', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<Toggle label="Test toggle" />)
      const toggle = screen.getByRole('switch')
      expect(toggle).toBeInTheDocument()
      expect(toggle).toHaveAttribute('aria-checked', 'false')
    })

    it('renders with isChecked=true', () => {
      render(<Toggle isChecked label="Test toggle" />)
      const toggle = screen.getByRole('switch')
      expect(toggle).toHaveAttribute('aria-checked', 'true')
    })

    it('renders with defaultChecked (uncontrolled)', () => {
      render(<Toggle defaultChecked label="Test toggle" />)
      const toggle = screen.getByRole('switch')
      expect(toggle).toHaveAttribute('aria-checked', 'true')
    })

    it('renders with accessible label', () => {
      render(<Toggle label="Enable notifications" />)
      const toggle = screen.getByRole('switch')
      expect(toggle).toHaveAttribute('aria-label', 'Enable notifications')
    })
  })

  describe('Sizes', () => {
    it('renders regular size by default', () => {
      render(<Toggle label="Test" />)
      const toggle = screen.getByRole('switch')
      expect(toggle).toHaveClass('w-8', 'h-4')
    })

    it('renders large size', () => {
      render(<Toggle size="large" label="Test" />)
      const toggle = screen.getByRole('switch')
      expect(toggle).toHaveClass('w-10', 'h-5')
    })
  })

  describe('States', () => {
    it('handles disabled state', () => {
      render(<Toggle isDisabled label="Test" />)
      const toggle = screen.getByRole('switch')
      expect(toggle).toBeDisabled()
      expect(toggle).toHaveAttribute('aria-disabled', 'true')
    })

    it('handles loading state', () => {
      render(<Toggle isLoading label="Test" />)
      const toggle = screen.getByRole('switch')
      expect(toggle).toHaveAttribute('aria-busy', 'true')
      expect(toggle).toBeDisabled()
    })
  })

  describe('Interactions', () => {
    it('calls onChange when clicked (controlled)', () => {
      const handleChange = jest.fn()
      render(<Toggle isChecked={false} onChange={handleChange} label="Test" />)

      const toggle = screen.getByRole('switch')
      fireEvent.click(toggle)

      expect(handleChange).toHaveBeenCalledWith(true)
    })

    it('toggles state when clicked (uncontrolled)', () => {
      render(<Toggle defaultChecked={false} label="Test" />)
      const toggle = screen.getByRole('switch')

      expect(toggle).toHaveAttribute('aria-checked', 'false')

      fireEvent.click(toggle)
      expect(toggle).toHaveAttribute('aria-checked', 'true')

      fireEvent.click(toggle)
      expect(toggle).toHaveAttribute('aria-checked', 'false')
    })

    it('does not toggle when disabled', () => {
      const handleChange = jest.fn()
      render(<Toggle isDisabled onChange={handleChange} label="Test" />)

      const toggle = screen.getByRole('switch')
      fireEvent.click(toggle)

      expect(handleChange).not.toHaveBeenCalled()
    })

    it('does not toggle when loading', () => {
      const handleChange = jest.fn()
      render(<Toggle isLoading onChange={handleChange} label="Test" />)

      const toggle = screen.getByRole('switch')
      fireEvent.click(toggle)

      expect(handleChange).not.toHaveBeenCalled()
    })

    it('handles keyboard interaction (Space)', () => {
      const handleChange = jest.fn()
      render(<Toggle isChecked={false} onChange={handleChange} label="Test" />)

      const toggle = screen.getByRole('switch')
      fireEvent.keyDown(toggle, { key: ' ' })

      expect(handleChange).toHaveBeenCalledWith(true)
    })

    it('handles keyboard interaction (Enter)', () => {
      const handleChange = jest.fn()
      render(<Toggle isChecked={false} onChange={handleChange} label="Test" />)

      const toggle = screen.getByRole('switch')
      fireEvent.keyDown(toggle, { key: 'Enter' })

      expect(handleChange).toHaveBeenCalledWith(true)
    })
  })

  describe('SDUI Integration', () => {
    it('renders with nodeId data attribute', () => {
      render(<Toggle nodeId="toggle-1" label="Test" />)
      const toggle = screen.getByRole('switch')
      expect(toggle).toHaveAttribute('data-node-id', 'toggle-1')
    })

    it('renders with eventId data attribute', () => {
      render(<Toggle eventId="toggle-event" label="Test" />)
      const toggle = screen.getByRole('switch')
      expect(toggle).toHaveAttribute('data-event-id', 'toggle-event')
    })

    it('renders with data-checked attribute when checked', () => {
      render(<Toggle isChecked label="Test" />)
      const toggle = screen.getByRole('switch')
      expect(toggle).toHaveAttribute('data-checked')
    })

    it('renders with data-loading attribute when loading', () => {
      render(<Toggle isLoading label="Test" />)
      const toggle = screen.getByRole('switch')
      expect(toggle).toHaveAttribute('data-loading')
    })
  })

  describe('Form Integration', () => {
    it('renders hidden input with name attribute', () => {
      const { container } = render(<Toggle name="feature-toggle" isChecked label="Test" />)
      const hiddenInput = container.querySelector('input[type="hidden"]')
      expect(hiddenInput).toBeInTheDocument()
      expect(hiddenInput).toHaveAttribute('name', 'feature-toggle')
      expect(hiddenInput).toHaveAttribute('value', 'true')
    })

    it('hidden input value reflects checked state', () => {
      const { container, rerender } = render(<Toggle name="feature-toggle" isChecked={false} label="Test" />)
      let hiddenInput = container.querySelector('input[type="hidden"]')
      expect(hiddenInput).toHaveAttribute('value', 'false')

      rerender(<Toggle name="feature-toggle" isChecked label="Test" />)
      hiddenInput = container.querySelector('input[type="hidden"]')
      expect(hiddenInput).toHaveAttribute('value', 'true')
    })
  })
})
