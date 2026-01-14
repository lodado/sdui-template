/**
 * Scenario Test: Zod Schema Validation
 *
 * Tests for using Zod schemas with useSduiNodeSubscription hook
 * Demonstrates how to validate component state using Zod schemas
 */

import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { z } from 'zod'

import type { ComponentFactory } from '../../components/types'
import { useSduiLayoutAction, useSduiNodeSubscription } from '../../react-wrapper/hooks'
import { createTestDocument, defaultTestComponentFactory, renderWithSduiLayout } from '../utils/test-utils'

// ==================== Zod Schemas ====================

/**
 * Toggle component state Zod schema
 * Validates only checked and label fields
 */
const toggleStateSchema = z.object({
  checked: z.boolean(),
  label: z.string().optional(),
})

// ==================== Test Components ====================

/**
 * Simple Toggle component for testing
 * Uses useSduiNodeSubscription with Zod schema validation
 */
const Toggle: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  // Subscribe to node with Zod schema validation
  // If validation fails, hook will throw an error
  // If validation succeeds, state is guaranteed to be non-null and typed correctly
  const { state } = useSduiNodeSubscription({
    nodeId,
    schema: toggleStateSchema,
  })

  // No null check needed: schema validation ensures state is always defined
  // If rawState is missing or validation fails, hook throws error (handled by error boundary)
  // TypeScript knows state is non-nullable (z.infer<TSchema>)
  const { checked } = state
  const { label } = state

  return (
    <div data-testid={`toggle-${nodeId}`}>
      {label && <span data-testid={`toggle-label-${nodeId}`}>{label}</span>}
      <input
        type="checkbox"
        checked={checked}
        readOnly
        data-testid={`toggle-checkbox-${nodeId}`}
        aria-label={label || 'Toggle'}
      />
    </div>
  )
}

/**
 * Toggle component factory for use in component map
 */
const toggleComponentFactory: ComponentFactory = (id) => (<Toggle nodeId={id} />) as React.ReactElement

/**
 * Component that updates toggle state
 */
const ToggleUpdater: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const store = useSduiLayoutAction()

  React.useEffect(() => {
    // Update toggle state
    store.updateNodeState(nodeId, {
      checked: true,
    })
  }, [store, nodeId])

  return null
}

describe('Zod Schema Validation', () => {
  describe('as is: document with toggle node, valid state', () => {
    describe('when: useSduiNodeSubscription with toggleStateSchema', () => {
      it('to be: state is validated and typed correctly, component renders', () => {
        const document = createTestDocument({
          root: {
            id: 'toggle-1',
            type: 'Toggle',
            state: {
              checked: false,
              label: 'Enable notifications',
            },
          },
        })

        renderWithSduiLayout(document, {
          components: {
            Container: defaultTestComponentFactory,
            Toggle: toggleComponentFactory,
          },
        })

        // Component should render without errors
        expect(screen.getByTestId('toggle-toggle-1')).toBeInTheDocument()
        expect(screen.getByTestId('toggle-label-toggle-1')).toHaveTextContent('Enable notifications')
        expect(screen.getByTestId('toggle-checkbox-toggle-1')).not.toBeChecked()
      })
    })
  })

  describe('as is: document with toggle node, state updated', () => {
    describe('when: store.updateNodeState updates checked to true', () => {
      it('to be: component re-renders with updated checked state', async () => {
        const document = createTestDocument({
          root: {
            id: 'toggle-1',
            type: 'Toggle',
            state: {
              checked: false,
              label: 'Enable notifications',
            },
          },
        })

        // Render without updater first to verify initial state
        renderWithSduiLayout(document, {
          components: {
            Container: defaultTestComponentFactory,
            Toggle: toggleComponentFactory,
          },
        })

        // Initially unchecked
        expect(screen.getByTestId('toggle-checkbox-toggle-1')).not.toBeChecked()

        // Now add updater to trigger state change
        const { rerender } = renderWithSduiLayout(
          document,
          {
            components: {
              Toggle: toggleComponentFactory,
            },
          },
          <ToggleUpdater nodeId="toggle-1" />,
        )

        // After update, should be checked
        await waitFor(
          () => {
            const checkboxes = screen.getAllByTestId('toggle-checkbox-toggle-1')
            // Get the last one (from the second render)
            expect(checkboxes[checkboxes.length - 1]).toBeChecked()
          },
          { timeout: 2000 },
        )
      })
    })
  })

  describe('as is: document with toggle node, invalid state', () => {
    describe('when: state missing required checked field', () => {
      it('to be: validation error thrown, error message indicates missing field', () => {
        const document = createTestDocument({
          root: {
            id: 'toggle-1',
            type: 'Toggle',
            state: {
              layout: { x: 0, y: 0, w: 3, h: 1 },
              // Missing checked field - should cause validation error
            },
          },
        })

        // Suppress console.error for this test since we expect an error
        const originalError = console.error
        const consoleErrorSpy = jest.fn()
        console.error = consoleErrorSpy

        try {
          // Render should throw an error due to validation failure
          expect(() => {
            renderWithSduiLayout(document, {
              components: {
                Toggle: toggleComponentFactory,
              },
            })
          }).toThrow()

          // Verify error message contains validation details
          expect(consoleErrorSpy).toHaveBeenCalled()
          const errorCall = consoleErrorSpy.mock.calls.find((call) =>
            call[0]?.toString().includes('State validation failed'),
          )
          expect(errorCall).toBeDefined()
        } finally {
          console.error = originalError
        }
      })
    })
  })

  describe('as is: document with toggle node, optional label field', () => {
    describe('when: label is provided', () => {
      it('to be: label is rendered', () => {
        const document = createTestDocument({
          root: {
            id: 'toggle-1',
            type: 'Toggle',
            state: {
              layout: { x: 0, y: 0, w: 3, h: 1 },
              checked: false,
              label: 'Custom label',
            },
          },
        })

        renderWithSduiLayout(document, {
          components: {
            Container: defaultTestComponentFactory,
            Toggle: toggleComponentFactory,
          },
        })

        expect(screen.getByTestId('toggle-label-toggle-1')).toHaveTextContent('Custom label')
      })
    })

    describe('when: label is not provided', () => {
      it('to be: label is not rendered, checkbox has default aria-label', () => {
        const document = createTestDocument({
          root: {
            id: 'toggle-1',
            type: 'Toggle',
            state: {
              layout: { x: 0, y: 0, w: 3, h: 1 },
              checked: false,
              // label not provided
            },
          },
        })

        renderWithSduiLayout(document, {
          components: {
            Container: defaultTestComponentFactory,
            Toggle: toggleComponentFactory,
          },
        })

        expect(screen.queryByTestId('toggle-label-toggle-1')).not.toBeInTheDocument()
        expect(screen.getByTestId('toggle-checkbox-toggle-1')).toHaveAttribute('aria-label', 'Toggle')
      })
    })
  })

  describe('as is: multiple toggle nodes with different states', () => {
    describe('when: both toggles subscribe with same schema', () => {
      it('to be: both toggles render correctly with their respective states', () => {
        const document = createTestDocument({
          root: {
            id: 'root',
            type: 'Container',
            children: [
              {
                id: 'toggle-1',
                type: 'Toggle',
                state: {
                  checked: false,
                  label: 'Toggle 1',
                },
              },
              {
                id: 'toggle-2',
                type: 'Toggle',
                state: {
                  checked: true,
                  label: 'Toggle 2',
                },
              },
            ],
          },
        })

        renderWithSduiLayout(document, {
          components: {
            Container: defaultTestComponentFactory,
            Toggle: toggleComponentFactory,
          },
        })

        // Both toggles should render (SDUI renders them via component map)
        expect(screen.getByTestId('toggle-toggle-1')).toBeInTheDocument()
        expect(screen.getByTestId('toggle-toggle-2')).toBeInTheDocument()

        // Toggle 1 should be unchecked
        expect(screen.getByTestId('toggle-checkbox-toggle-1')).not.toBeChecked()
        expect(screen.getByTestId('toggle-label-toggle-1')).toHaveTextContent('Toggle 1')

        // Toggle 2 should be checked
        expect(screen.getByTestId('toggle-checkbox-toggle-2')).toBeChecked()
        expect(screen.getByTestId('toggle-label-toggle-2')).toHaveTextContent('Toggle 2')
      })
    })
  })
})
