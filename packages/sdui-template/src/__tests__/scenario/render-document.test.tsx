/**
 * Scenario Test: Render Document
 *
 * Tests for rendering SDUI documents
 */

import { render, screen } from '@testing-library/react'
import React from 'react'

import { SduiLayoutRenderer } from '../../react-wrapper/components/SduiLayoutRenderer'
import { createNestedTestDocument, createTestDocument, defaultTestComponentFactory } from '../utils/dev-utils'

describe('SduiLayoutRenderer', () => {
  describe('as is: empty store', () => {
    describe('when: SduiLayoutRenderer receives document with 3 levels of nesting', () => {
      it('to be: all nodes render in correct hierarchy', () => {
        const document = createNestedTestDocument()
        render(
          <SduiLayoutRenderer
            document={document}
            components={{ Container: defaultTestComponentFactory, Card: defaultTestComponentFactory }}
          />,
        )

        // Check that all nodes are rendered
        expect(screen.getByText(/Type: Container/i)).toBeInTheDocument()
        expect(screen.getByText(/ID: root/i)).toBeInTheDocument()
        expect(screen.getByText(/ID: child-1/i)).toBeInTheDocument()
        expect(screen.getByText(/ID: child-2/i)).toBeInTheDocument()
        expect(screen.getByText(/ID: grandchild-1/i)).toBeInTheDocument()
      })
    })

    describe('when: document with 10 levels of nesting', () => {
      it('to be: all nodes render, performance acceptable', () => {
        // Create deeply nested document
        let current: any = {
          id: 'root',
          type: 'Container',
        }

        for (let i = 0; i < 10; i += 1) {
          current = {
            id: `level-${i}`,
            type: 'Container',
            children: [current],
          }
        }

        const document: any = {
          version: '1.0.0',
          root: current,
        }

        const start = performance.now()
        render(<SduiLayoutRenderer document={document} components={{ Container: defaultTestComponentFactory }} />)
        const duration = performance.now() - start

        // Should render without errors
        expect(screen.getByText(/ID: level-0/i)).toBeInTheDocument()
        // Pathological-regression guard, not a tight budget: this 11-node render
        // is <10ms normally, but a wall-clock assertion flakes under CI load
        // (turbo runs suites concurrently → CPU starvation). A generous ceiling
        // still catches an O(n^2)/infinite-loop blowup without failing on jitter.
        expect(duration).toBeLessThan(1000)
      })
    })
  })
})
