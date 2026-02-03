/**
 * Scenario Test: Dynamic Document Merge
 *
 * Tests for dynamic document updates using mergeLayout
 * Verifies that existing node states are preserved when documents are merged
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { z } from 'zod'

import type { ComponentFactory } from '../../components/types'
import { useSduiLayoutAction, useSduiNodeSubscription } from '../../react-wrapper/hooks'
import type { SduiLayoutDocument } from '../../schema'
import { createTestDocument, defaultTestComponentFactory, renderWithSduiLayout } from '../utils/dev-utils'

// Toggle state schema
const toggleStateSchema = z.object({
  isChecked: z.boolean(),
  label: z.string().optional(),
})

// Toggle component that subscribes to node changes
const ToggleComponent: React.FC<{ nodeId: string; testPrefix?: string }> = ({ nodeId, testPrefix = 'test' }) => {
  const store = useSduiLayoutAction()

  const { state, exists } = useSduiNodeSubscription({
    nodeId,
    schema: toggleStateSchema,
  })

  const handleToggle = () => {
    if (exists && state) {
      store.updateNodeState(nodeId, {
        isChecked: !state.isChecked,
      })
    }
  }

  // Don't render if node doesn't exist
  if (!exists) {
    return null
  }

  return (
    <div data-testid={`${testPrefix}-toggle-${nodeId}`}>
      <button onClick={handleToggle} type="button">
        {state?.label || `Toggle ${nodeId}`}
      </button>
      <span data-testid={`${testPrefix}-toggle-state-${nodeId}`}>
        {state?.isChecked ? 'ON' : 'OFF'}
      </span>
    </div>
  )
}

// Toggle component factory (for SDUI document rendering)
const ToggleComponentFactory: ComponentFactory = (id) => <ToggleComponent nodeId={id} testPrefix="sdui" />

/**
 * Helper function to create a document with toggles
 */
function createDocumentWithToggles(toggleCount: number): SduiLayoutDocument {
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

describe('Dynamic Document Merge', () => {
  describe('as is: document loaded with 3 toggles, user changes toggle states', () => {
    describe('when: mergeLayout is called with new document that adds a toggle', () => {
      it('to be: existing toggle states are preserved, new toggle starts with initial state', async () => {
        const initialDocument = createDocumentWithToggles(3)

        const MergeTest: React.FC = () => {
          const store = useSduiLayoutAction()
          const [hasMerged, setHasMerged] = React.useState(false)

          const handleMerge = () => {
            const newDocument = createDocumentWithToggles(4)
            store.mergeLayout(newDocument)
            setHasMerged(true)
          }

          return (
            <button onClick={handleMerge} type="button" data-testid="merge-button">
              Add Toggle
            </button>
          )
        }

        renderWithSduiLayout(
          initialDocument,
          {
            components: {
              Toggle: ToggleComponentFactory,
              Container: defaultTestComponentFactory,
            },
          },
          <MergeTest />,
        )

        // Wait for initial render (SDUI renders with sdui prefix)
        await waitFor(() => {
          expect(screen.getByTestId('sdui-toggle-toggle-1')).toBeInTheDocument()
          expect(screen.getByTestId('sdui-toggle-toggle-2')).toBeInTheDocument()
          expect(screen.getByTestId('sdui-toggle-toggle-3')).toBeInTheDocument()
        })

        // Initially all toggles should be OFF
        expect(screen.getByTestId('sdui-toggle-state-toggle-1')).toHaveTextContent('OFF')
        expect(screen.getByTestId('sdui-toggle-state-toggle-2')).toHaveTextContent('OFF')
        expect(screen.getByTestId('sdui-toggle-state-toggle-3')).toHaveTextContent('OFF')

        // User clicks toggle-1 and toggle-2 to change their states
        const user = userEvent.setup()
        await user.click(screen.getByTestId('sdui-toggle-toggle-1').querySelector('button')!)
        await user.click(screen.getByTestId('sdui-toggle-toggle-2').querySelector('button')!)

        // Verify toggle-1 and toggle-2 are now ON
        await waitFor(() => {
          expect(screen.getByTestId('sdui-toggle-state-toggle-1')).toHaveTextContent('ON')
          expect(screen.getByTestId('sdui-toggle-state-toggle-2')).toHaveTextContent('ON')
          expect(screen.getByTestId('sdui-toggle-state-toggle-3')).toHaveTextContent('OFF')
        })

        // User clicks merge button to add toggle-4
        await user.click(screen.getByTestId('merge-button'))

        // Wait for toggle-4 to appear
        await waitFor(() => {
          expect(screen.getByTestId('sdui-toggle-toggle-4')).toBeInTheDocument()
        })

        // After merge, existing toggle states should be preserved
        expect(screen.getByTestId('sdui-toggle-state-toggle-1')).toHaveTextContent('ON')
        expect(screen.getByTestId('sdui-toggle-state-toggle-2')).toHaveTextContent('ON')
        expect(screen.getByTestId('sdui-toggle-state-toggle-3')).toHaveTextContent('OFF')

        // New toggle should start with initial state (OFF)
        expect(screen.getByTestId('sdui-toggle-state-toggle-4')).toHaveTextContent('OFF')
      })
    })
  })

  describe('as is: document loaded with toggles, store instance exists', () => {
    describe('when: mergeLayout is called', () => {
      it('to be: store instance is maintained, subscribers are not disconnected', async () => {
        const initialDocument = createDocumentWithToggles(2)

        let storeInstance: ReturnType<typeof useSduiLayoutAction> | null = null

        const MergeTest: React.FC = () => {
          const store = useSduiLayoutAction()
          const [hasMerged, setHasMerged] = React.useState(false)

          React.useEffect(() => {
            storeInstance = store
          }, [store])

          const handleMerge = () => {
            const newDocument = createDocumentWithToggles(3)
            store.mergeLayout(newDocument)
            setHasMerged(true)
          }

          return (
            <button onClick={handleMerge} type="button" data-testid="merge-button">
              Merge Layout
            </button>
          )
        }

        renderWithSduiLayout(
          initialDocument,
          {
            components: {
              Toggle: ToggleComponentFactory,
              Container: defaultTestComponentFactory,
            },
          },
          <MergeTest />,
        )

        // Wait for initial render (SDUI renders with sdui prefix)
        await waitFor(() => {
          expect(screen.getByTestId('sdui-toggle-toggle-1')).toBeInTheDocument()
        })

        const initialStoreInstance = storeInstance

        // User clicks toggle-1
        const user = userEvent.setup()
        await user.click(screen.getByTestId('sdui-toggle-toggle-1').querySelector('button')!)

        await waitFor(() => {
          expect(screen.getByTestId('sdui-toggle-state-toggle-1')).toHaveTextContent('ON')
        })

        // User clicks merge button to add toggle-3
        await user.click(screen.getByTestId('merge-button'))

        // Wait for toggle-3 to appear
        await waitFor(() => {
          expect(screen.getByTestId('sdui-toggle-toggle-3')).toBeInTheDocument()
        })

        // Store instance should be the same (not recreated)
        expect(storeInstance).toBe(initialStoreInstance)

        // Toggle state should still be preserved
        expect(screen.getByTestId('sdui-toggle-state-toggle-1')).toHaveTextContent('ON')
      })
    })
  })

  describe('as is: document loaded with toggles, some toggles are deleted in new document', () => {
    describe('when: mergeLayout is called with document that removes some toggles', () => {
      it('to be: deleted toggles are removed, remaining toggles preserve their states', async () => {
        const initialDocument = createDocumentWithToggles(3)

        const MergeTest: React.FC = () => {
          const store = useSduiLayoutAction()

          const handleMerge = () => {
            // New document with only 2 toggles (toggle-3 is deleted)
            const newDocument = createDocumentWithToggles(2)
            store.mergeLayout(newDocument)
          }

          return (
            <button onClick={handleMerge} type="button" data-testid="merge-button">
              Remove Toggle
            </button>
          )
        }

        renderWithSduiLayout(
          initialDocument,
          {
            components: {
              Toggle: ToggleComponentFactory,
              Container: defaultTestComponentFactory,
            },
          },
          <MergeTest />,
        )

        // Wait for initial render (SDUI renders with sdui prefix)
        await waitFor(() => {
          expect(screen.getByTestId('sdui-toggle-toggle-1')).toBeInTheDocument()
          expect(screen.getByTestId('sdui-toggle-toggle-3')).toBeInTheDocument()
        })

        // User clicks toggle-1 and toggle-2
        const user = userEvent.setup()
        await user.click(screen.getByTestId('sdui-toggle-toggle-1').querySelector('button')!)
        await user.click(screen.getByTestId('sdui-toggle-toggle-2').querySelector('button')!)

        await waitFor(() => {
          expect(screen.getByTestId('sdui-toggle-state-toggle-1')).toHaveTextContent('ON')
          expect(screen.getByTestId('sdui-toggle-state-toggle-2')).toHaveTextContent('ON')
        })

        // User clicks merge button to remove toggle-3
        await user.click(screen.getByTestId('merge-button'))

        // Wait for toggle-3 to be removed
        await waitFor(() => {
          expect(screen.queryByTestId('sdui-toggle-toggle-3')).not.toBeInTheDocument()
        })

        // Remaining toggles should preserve their states
        expect(screen.getByTestId('sdui-toggle-state-toggle-1')).toHaveTextContent('ON')
        expect(screen.getByTestId('sdui-toggle-state-toggle-2')).toHaveTextContent('ON')
      })
    })
  })

  describe('as is: document loaded with toggles, same position but different ID', () => {
    describe('when: mergeLayout is called with document that replaces a toggle with different ID', () => {
      it('to be: old toggle is deleted, new toggle is added with initial state, other toggles preserve states', async () => {
        const initialDocument = createDocumentWithToggles(3)

        const MergeTest: React.FC = () => {
          const store = useSduiLayoutAction()
          const [hasMerged, setHasMerged] = React.useState(false)

          const handleMerge = () => {
            // Create document with toggle-4 instead of toggle-3 (same position, different ID)
            const toggles = [
              {
                id: 'toggle-1',
                type: 'Toggle',
                state: {
                  isChecked: false,
                  label: 'Toggle 1',
                },
              },
              {
                id: 'toggle-2',
                type: 'Toggle',
                state: {
                  isChecked: false,
                  label: 'Toggle 2',
                },
              },
              {
                id: 'toggle-4', // Different ID at same position (was toggle-3)
                type: 'Toggle',
                state: {
                  isChecked: false,
                  label: 'Toggle 4',
                },
              },
            ]

            const newDocument = createTestDocument({
              root: {
                id: 'root',
                type: 'Container',
                children: toggles,
              },
            })

            store.mergeLayout(newDocument)
            setHasMerged(true)
          }

          return (
            <button onClick={handleMerge} type="button" data-testid="merge-button">
              Replace Toggle
            </button>
          )
        }

        renderWithSduiLayout(
          initialDocument,
          {
            components: {
              Toggle: ToggleComponentFactory,
              Container: defaultTestComponentFactory,
            },
          },
          <MergeTest />,
        )

        // Wait for initial render (SDUI renders with sdui prefix)
        await waitFor(() => {
          expect(screen.getByTestId('sdui-toggle-toggle-1')).toBeInTheDocument()
          expect(screen.getByTestId('sdui-toggle-toggle-2')).toBeInTheDocument()
          expect(screen.getByTestId('sdui-toggle-toggle-3')).toBeInTheDocument()
        })

        // Initially all toggles should be OFF
        expect(screen.getByTestId('sdui-toggle-state-toggle-1')).toHaveTextContent('OFF')
        expect(screen.getByTestId('sdui-toggle-state-toggle-2')).toHaveTextContent('OFF')
        expect(screen.getByTestId('sdui-toggle-state-toggle-3')).toHaveTextContent('OFF')

        // User clicks toggle-1, toggle-2, and toggle-3 to change their states
        const user = userEvent.setup()
        await user.click(screen.getByTestId('sdui-toggle-toggle-1').querySelector('button')!)
        await user.click(screen.getByTestId('sdui-toggle-toggle-2').querySelector('button')!)
        await user.click(screen.getByTestId('sdui-toggle-toggle-3').querySelector('button')!)

        // Verify all toggles are now ON
        await waitFor(() => {
          expect(screen.getByTestId('sdui-toggle-state-toggle-1')).toHaveTextContent('ON')
          expect(screen.getByTestId('sdui-toggle-state-toggle-2')).toHaveTextContent('ON')
          expect(screen.getByTestId('sdui-toggle-state-toggle-3')).toHaveTextContent('ON')
        })

        // User clicks merge button to replace toggle-3 with toggle-4
        await user.click(screen.getByTestId('merge-button'))

        // Wait for toggle-3 to be removed and toggle-4 to appear
        await waitFor(() => {
          expect(screen.queryByTestId('sdui-toggle-toggle-3')).not.toBeInTheDocument()
          expect(screen.getByTestId('sdui-toggle-toggle-4')).toBeInTheDocument()
        })

        // toggle-1 and toggle-2 should preserve their states (ON)
        expect(screen.getByTestId('sdui-toggle-state-toggle-1')).toHaveTextContent('ON')
        expect(screen.getByTestId('sdui-toggle-state-toggle-2')).toHaveTextContent('ON')

        // toggle-4 should start with initial state (OFF) - different ID means new component
        expect(screen.getByTestId('sdui-toggle-state-toggle-4')).toHaveTextContent('OFF')
      })
    })
  })
})
