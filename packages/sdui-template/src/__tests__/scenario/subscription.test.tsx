/**
 * Scenario Test: Subscription System
 *
 * Tests for subscription-based re-renders.
 * Note: This test now uses useSyncExternalStore internally (via useSduiNodeSubscription)
 * to prevent tearing issues in concurrent rendering.
 */

import { screen, waitFor } from '@testing-library/react'
import React from 'react'
import { z } from 'zod'

import type { ComponentFactory } from '../../components/types'
import { useSduiLayoutAction, useSduiNodeSubscription } from '../../react-wrapper/hooks'
import { createTestDocument, defaultTestComponentFactory, renderWithSduiLayout } from '../utils/dev-utils'

// Test component state schema
const testComponentStateSchema = z.object({
  value: z.number(),
})

// Component that subscribes to a specific node
const SubscribedComponent: React.FC<{ nodeId: string; testPrefix?: string }> = ({ nodeId, testPrefix = 'test' }) => {
  const { state } = useSduiNodeSubscription({
    nodeId,
    schema: testComponentStateSchema,
  })
  const renderCount = React.useRef(0)
  renderCount.current += 1

  return (
    <div data-testid={`${testPrefix}-subscribed-${nodeId}`}>
      <div>Render Count: {renderCount.current}</div>
      <div>Value: {state?.value}</div>
    </div>
  )
}

// Component with update button (only for node-1)
const ComponentWithUpdateButton: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const store = useSduiLayoutAction()
  const handleUpdate = () => {
    // Update only node-1
    store.updateNodeState('node-1', { value: 15 })
  }

  return (
    <>
      <SubscribedComponent nodeId={nodeId} testPrefix="sdui" />
      {nodeId === 'node-1' && (
        <button data-testid="update-button" onClick={handleUpdate}>
          Update node-1
        </button>
      )}
    </>
  )
}

// Test component factory (for SDUI document rendering)
const TestComponentFactory: ComponentFactory = (id) => <ComponentWithUpdateButton nodeId={id} />

describe('Subscription System', () => {
  describe('as is: document loaded, 3 components subscribed to different nodes', () => {
    describe('when: store.updateNodeState(nodeId1, state) called', () => {
      it('to be: only component subscribed to nodeId1 re-renders', async () => {
        const document = createTestDocument({
          root: {
            id: 'root',
            type: 'Container',
            children: [
              {
                id: 'node-1',
                type: 'TestComponent',
                state: {
                  value: 10,
                },
              },
              {
                id: 'node-2',
                type: 'TestComponent',
                state: {
                  value: 20,
                },
              },
              {
                id: 'node-3',
                type: 'TestComponent',
                state: {
                  value: 30,
                },
              },
            ],
          },
        })

        // Use only the SDUI renderer (no separate components)
        renderWithSduiLayout(
          document,
          {
            components: {
              Container: defaultTestComponentFactory, // Use the default component to render children
              TestComponent: TestComponentFactory,
            },
          },
        )

        // All components should render initially (SDUI components only)
        expect(screen.getByTestId('sdui-subscribed-node-1')).toBeInTheDocument()
        expect(screen.getByTestId('sdui-subscribed-node-2')).toBeInTheDocument()
        expect(screen.getByTestId('sdui-subscribed-node-3')).toBeInTheDocument()

        // Verify initial state
        const node1Initial = screen.getByTestId('sdui-subscribed-node-1')
        expect(node1Initial).toHaveTextContent('Value: 10')
        expect(node1Initial).toHaveTextContent('Render Count: 1')

        const node2Initial = screen.getByTestId('sdui-subscribed-node-2')
        expect(node2Initial).toHaveTextContent('Value: 20')
        expect(node2Initial).toHaveTextContent('Render Count: 1')

        const node3Initial = screen.getByTestId('sdui-subscribed-node-3')
        expect(node3Initial).toHaveTextContent('Value: 30')
        expect(node3Initial).toHaveTextContent('Render Count: 1')

        // Click the button to update
        const updateButton = screen.getByTestId('update-button')
        updateButton.click()

        await waitFor(() => {
          // SDUI components - these are the ones we're testing
          const node1 = screen.getByTestId('sdui-subscribed-node-1')
          expect(node1).toHaveTextContent('Value: 15')
          expect(node1).toHaveTextContent('Render Count: 2') // Re-rendered

          const node2 = screen.getByTestId('sdui-subscribed-node-2')
          expect(node2).toHaveTextContent('Value: 20') // Unchanged
          expect(node2).toHaveTextContent('Render Count: 1') // Not re-rendered

          const node3 = screen.getByTestId('sdui-subscribed-node-3')
          expect(node3).toHaveTextContent('Value: 30') // Unchanged
          expect(node3).toHaveTextContent('Render Count: 1') // Not re-rendered
        })
      })
    })
  })
})
