import { render, screen } from '@testing-library/react'
import React from 'react'

import { Icon } from '../Icon'

describe('Icon - Logic Tests', () => {
  describe('as is: Icon with SVG child without width/height', () => {
    describe('when: component renders', () => {
      it('to be: SVG width and height automatically applied from size prop, should have correct dimensions', () => {
        render(
          <Icon size="24px" data-testid="icon">
            <svg viewBox="0 0 24 24" fill="none" data-testid="svg">
              <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" fill="currentColor" />
            </svg>
          </Icon>,
        )

        const svg = screen.getByTestId('svg')
        expect(svg).toHaveAttribute('width', '24')
        expect(svg).toHaveAttribute('height', '24')
      })
    })
  })

  describe('as is: Icon with SVG child that already has width/height', () => {
    describe('when: component renders', () => {
      it('to be: existing width/height preserved, should not override', () => {
        render(
          <Icon size="24px" data-testid="icon">
            <svg width="20" height="20" viewBox="0 0 24 24" data-testid="svg">
              <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" fill="currentColor" />
            </svg>
          </Icon>,
        )

        const svg = screen.getByTestId('svg')
        expect(svg).toHaveAttribute('width', '20')
        expect(svg).toHaveAttribute('height', '20')
        // Should not be overridden to 24
        expect(svg).not.toHaveAttribute('width', '24')
      })
    })
  })

  describe('as is: Icon with no children (placeholder)', () => {
    describe('when: component renders', () => {
      it('to be: role is "presentation", aria-hidden is true, should be hidden from screen readers', () => {
        render(<Icon size="24px" data-testid="icon" />)

        const icon = screen.getByTestId('icon')
        expect(icon).toHaveAttribute('role', 'presentation')
        expect(icon).toHaveAttribute('aria-hidden', 'true')
      })
    })
  })

  describe('as is: Icon with SVG children', () => {
    describe('when: component renders', () => {
      it('to be: role is "img", should be accessible as image', () => {
        render(
          <Icon size="24px" data-testid="icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" />
            </svg>
          </Icon>,
        )

        const icon = screen.getByTestId('icon')
        expect(icon).toHaveAttribute('role', 'img')
      })
    })
  })

  describe('as is: Icon with aria-label provided', () => {
    describe('when: component renders', () => {
      it('to be: aria-label attribute present, aria-hidden not set, should be accessible', () => {
        render(
          <Icon size="24px" aria-label="Close icon" data-testid="icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" />
            </svg>
          </Icon>,
        )

        const icon = screen.getByRole('img', { name: /close icon/i })
        expect(icon).toHaveAttribute('aria-label', 'Close icon')
        expect(icon).not.toHaveAttribute('aria-hidden', 'true')
      })
    })
  })

  describe('as is: Icon placeholder with aria-label', () => {
    describe('when: component renders', () => {
      it('to be: aria-label present, aria-hidden not set, should be accessible', () => {
        render(<Icon size="24px" aria-label="Loading icon" data-testid="icon" />)

        const icon = screen.getByRole('presentation', { name: /loading icon/i })
        expect(icon).toHaveAttribute('aria-label', 'Loading icon')
        expect(icon).not.toHaveAttribute('aria-hidden', 'true')
      })
    })
  })

  describe('as is: Icon with explicit aria-hidden="false"', () => {
    describe('when: component renders', () => {
      it('to be: aria-hidden="false" respected, should not be hidden', () => {
        render(
          <Icon size="24px" aria-hidden={false} data-testid="icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" />
            </svg>
          </Icon>,
        )

        const icon = screen.getByTestId('icon')
        expect(icon).toHaveAttribute('aria-hidden', 'false')
      })
    })
  })

  describe('as is: Icon with explicit role="img"', () => {
    describe('when: component renders', () => {
      it('to be: explicit role respected, should override default', () => {
        render(
          <Icon size="24px" role="img" data-testid="icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" />
            </svg>
          </Icon>,
        )

        const icon = screen.getByTestId('icon')
        expect(icon).toHaveAttribute('role', 'img')
      })
    })
  })

  describe('as is: Icon with nodeId prop', () => {
    describe('when: component renders', () => {
      it('to be: data-node-id attribute present, should support SDUI integration', () => {
        render(
          <Icon size="24px" nodeId="icon-1" data-testid="icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" />
            </svg>
          </Icon>,
        )

        const icon = screen.getByTestId('icon')
        expect(icon).toHaveAttribute('data-node-id', 'icon-1')
      })
    })
  })

  describe('as is: Icon with eventId prop', () => {
    describe('when: component renders', () => {
      it('to be: data-event-id attribute present, should support event emission', () => {
        render(
          <Icon size="24px" eventId="icon-click" data-testid="icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" />
            </svg>
          </Icon>,
        )

        const icon = screen.getByTestId('icon')
        expect(icon).toHaveAttribute('data-event-id', 'icon-click')
      })
    })
  })

  describe('as is: Icon with multiple SVG children', () => {
    describe('when: component renders', () => {
      it('to be: all SVG children processed, width/height applied to each', () => {
        render(
          <Icon size="24px" data-testid="icon">
            <svg viewBox="0 0 24 24" data-testid="svg1">
              <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" />
            </svg>
            <svg viewBox="0 0 24 24" data-testid="svg2">
              <circle cx="12" cy="12" r="10" />
            </svg>
          </Icon>,
        )

        const svg1 = screen.getByTestId('svg1')
        const svg2 = screen.getByTestId('svg2')
        expect(svg1).toHaveAttribute('width', '24')
        expect(svg1).toHaveAttribute('height', '24')
        expect(svg2).toHaveAttribute('width', '24')
        expect(svg2).toHaveAttribute('height', '24')
      })
    })
  })

  describe('as is: Icon with non-SVG children', () => {
    describe('when: component renders', () => {
      it('to be: non-SVG children rendered as-is, should not modify', () => {
        render(
          <Icon size="24px" data-testid="icon">
            <span data-testid="span">Fallback</span>
          </Icon>,
        )

        const span = screen.getByTestId('span')
        expect(span).toBeInTheDocument()
        expect(span).toHaveTextContent('Fallback')
      })
    })
  })

  describe('as is: Icon with mixed children (SVG and non-SVG)', () => {
    describe('when: component renders', () => {
      it('to be: SVG processed, non-SVG unchanged, should handle mixed content', () => {
        render(
          <Icon size="24px" data-testid="icon">
            <svg viewBox="0 0 24 24" data-testid="svg">
              <path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" />
            </svg>
            <span data-testid="span">Text</span>
          </Icon>,
        )

        const svg = screen.getByTestId('svg')
        const span = screen.getByTestId('span')
        expect(svg).toHaveAttribute('width', '24')
        expect(svg).toHaveAttribute('height', '24')
        expect(span).toBeInTheDocument()
      })
    })
  })
})
