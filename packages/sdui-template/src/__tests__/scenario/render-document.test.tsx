/**
 * Scenario Test: Render Document
 *
 * Tests for rendering SDUI documents
 */

import { render, screen } from '@testing-library/react'
import React from 'react'

import { SduiLayoutRenderer } from '../../react-wrapper/components/SduiLayoutRenderer'
import {
  createNestedTestDocument,
  createTestDocument,
  defaultTestComponentFactory,
  renderWithProvider,
} from '../utils/test-utils'

describe('SduiLayoutRenderer', () => {
  describe('as is: empty store', () => {
    describe('when: SduiLayoutRenderer receives document with single root node (no children)', () => {
      it('to be: root node renders, no errors', () => {
        const document = createTestDocument()
        render(<SduiLayoutRenderer document={document} components={{ Container: defaultTestComponentFactory }} />)

        // Check that root node is rendered (default component shows node info)
        expect(screen.getByText(/Type: Container/i)).toBeInTheDocument()
        expect(screen.getByText(/ID: root/i)).toBeInTheDocument()
      })
    })

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

    describe('when: document with root node, children: []', () => {
      it('to be: root renders, no children rendered, no errors', () => {
        const document = createTestDocument({
          root: {
            id: 'root',
            type: 'Container',
            children: [],
          },
        })
        render(<SduiLayoutRenderer document={document} components={{ Container: defaultTestComponentFactory }} />)

        expect(screen.getByText(/ID: root/i)).toBeInTheDocument()
        // No children should be rendered
        expect(screen.queryByText(/ID: child/i)).not.toBeInTheDocument()
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
        // Performance check (should be under 200ms)
        expect(duration).toBeLessThan(200)
      })
    })
  })
})
