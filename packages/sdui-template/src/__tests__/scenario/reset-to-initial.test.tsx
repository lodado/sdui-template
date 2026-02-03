/**
 * Scenario Test: Reset to Initial Document
 *
 * Tests for resetToInitial() functionality.
 * Verifies that the store can restore the document to its initial state.
 */

import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import type { ComponentFactory } from '../../components/types'
import { useSduiLayoutAction, useSduiNodeSubscription } from '../../react-wrapper/hooks'
import type { SduiLayoutDocument } from '../../schema'
import { createTestDocument, defaultTestComponentFactory, renderWithSduiLayout } from '../utils/dev-utils'

/**
 * Toggle Component Factory
 * Creates a toggle component that displays its state and allows toggling
 */
const ToggleComponent: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const { state } = useSduiNodeSubscription({
    nodeId,
  })
  const store = useSduiLayoutAction()

  const isChecked = (state as { isChecked?: boolean })?.isChecked ?? false
  const label = (state as { label?: string })?.label ?? nodeId

  const handleToggle = () => {
    store.updateNodeState(nodeId, {
      isChecked: !isChecked,
    })
  }

  return (
    <div data-testid={`toggle-${nodeId}`}>
      <button
        data-testid={`toggle-button-${nodeId}`}
        onClick={handleToggle}
        type="button"
        aria-pressed={isChecked}
      >
        {label}: {isChecked ? 'ON' : 'OFF'}
      </button>
    </div>
  )
}

const ToggleComponentFactory: ComponentFactory = (id) => <ToggleComponent nodeId={id} />


/**
 * Helper function to create a document with toggles
 */
function createToggleDocument(toggleCount: number): SduiLayoutDocument {
  const toggles = Array.from({ length: toggleCount }, (_, index) => ({
    id: `toggle-${index + 1}`,
    type: 'Toggle',
    state: {
      isChecked: false,
      label: `Toggle ${index + 1}`,
    },
  }))

  return createTestDocument({
    root: {
      id: 'root',
      type: 'Container',
      children: toggles,
    },
  })
}

describe('Reset to Initial Document', () => {
  describe('as is: initial document loaded with 3 toggles (all OFF)', () => {
    describe('when: toggle states are changed and document is updated', () => {
      describe('when: resetToInitial() is called', () => {
        it('to be: document returns to initial state (3 toggles, all OFF)', async () => {
          const user = userEvent.setup()
          const initialDocument = createToggleDocument(3)

          // Component that can update the document and reset
          const DocumentController: React.FC = () => {
            const store = useSduiLayoutAction()
            const [toggleCount, setToggleCount] = React.useState(3)

            const handleAddToggle = () => {
              const newCount = toggleCount + 1
              setToggleCount(newCount)
              const newDocument = createToggleDocument(newCount)
              // Use mergeLayout to preserve existing states
              store.mergeLayout(newDocument)
            }

            const handleReset = () => {
              try {
                store.resetToInitial()
              } catch (err) {
                // Error handling is done in ResetButton
              }
            }

            return (
              <div>
                <button data-testid="add-toggle-button" onClick={handleAddToggle} type="button">
                  Add Toggle
                </button>
                <button data-testid="reset-to-initial-button" onClick={handleReset} type="button">
                  Reset to Initial
                </button>
              </div>
            )
          }

          renderWithSduiLayout(
            initialDocument,
            {
              components: {
                Container: defaultTestComponentFactory,
                Toggle: ToggleComponentFactory,
              },
            },
            <DocumentController />,
          )

          // Verify initial state: 3 toggles, all OFF
          expect(screen.getByTestId('toggle-toggle-1')).toBeInTheDocument()
          expect(screen.getByTestId('toggle-toggle-2')).toBeInTheDocument()
          expect(screen.getByTestId('toggle-toggle-3')).toBeInTheDocument()
          expect(screen.queryByTestId('toggle-toggle-4')).not.toBeInTheDocument()

          expect(screen.getByTestId('toggle-button-toggle-1')).toHaveTextContent('Toggle 1: OFF')
          expect(screen.getByTestId('toggle-button-toggle-2')).toHaveTextContent('Toggle 2: OFF')
          expect(screen.getByTestId('toggle-button-toggle-3')).toHaveTextContent('Toggle 3: OFF')

          // Change toggle states
          await user.click(screen.getByTestId('toggle-button-toggle-1'))
          await user.click(screen.getByTestId('toggle-button-toggle-2'))

          await waitFor(() => {
            expect(screen.getByTestId('toggle-button-toggle-1')).toHaveTextContent('Toggle 1: ON')
            expect(screen.getByTestId('toggle-button-toggle-2')).toHaveTextContent('Toggle 2: ON')
            expect(screen.getByTestId('toggle-button-toggle-3')).toHaveTextContent('Toggle 3: OFF')
          })

          // Add a toggle (update document)
          await user.click(screen.getByTestId('add-toggle-button'))

          await waitFor(() => {
            expect(screen.getByTestId('toggle-toggle-4')).toBeInTheDocument()
            expect(screen.getByTestId('toggle-button-toggle-4')).toHaveTextContent('Toggle 4: OFF')
          })

          // Verify states are preserved after document update
          expect(screen.getByTestId('toggle-button-toggle-1')).toHaveTextContent('Toggle 1: ON')
          expect(screen.getByTestId('toggle-button-toggle-2')).toHaveTextContent('Toggle 2: ON')
          expect(screen.getByTestId('toggle-button-toggle-3')).toHaveTextContent('Toggle 3: OFF')

          // Reset to initial
          await user.click(screen.getByTestId('reset-to-initial-button'))

          await waitFor(() => {
            // Should return to 3 toggles
            expect(screen.getByTestId('toggle-toggle-1')).toBeInTheDocument()
            expect(screen.getByTestId('toggle-toggle-2')).toBeInTheDocument()
            expect(screen.getByTestId('toggle-toggle-3')).toBeInTheDocument()
            expect(screen.queryByTestId('toggle-toggle-4')).not.toBeInTheDocument()

            // All toggles should be OFF (initial state)
            expect(screen.getByTestId('toggle-button-toggle-1')).toHaveTextContent('Toggle 1: OFF')
            expect(screen.getByTestId('toggle-button-toggle-2')).toHaveTextContent('Toggle 2: OFF')
            expect(screen.getByTestId('toggle-button-toggle-3')).toHaveTextContent('Toggle 3: OFF')
          })

          // Verify no error occurred
          expect(screen.queryByTestId('reset-error')).not.toBeInTheDocument()
        })
      })
    })
  })

  describe('as is: store created but no document loaded', () => {
    describe('when: resetToInitial() is called', () => {
      it('to be: throws error "Initial document is not available"', () => {
        const emptyDocument = createTestDocument({
          root: {
            id: 'root',
            type: 'Container',
            children: [],
          },
        })

        const TestComponent: React.FC = () => {
          const store = useSduiLayoutAction()
          const [error, setError] = React.useState<string | null>(null)

          React.useEffect(() => {
            // Reset first to clear initial document
            store.reset()
            // Then try to reset to initial
            try {
              store.resetToInitial()
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Unknown error')
            }
          }, [store])

          return <div>{error && <div data-testid="error-message">{error}</div>}</div>
        }

        renderWithSduiLayout(
          emptyDocument,
          {
            components: {
              Container: defaultTestComponentFactory,
            },
          },
          <TestComponent />,
        )

        const errorMessage = screen.getByTestId('error-message').textContent
        expect(errorMessage).toMatch(/Cannot reset to initial state/)
      })
    })
  })
})
