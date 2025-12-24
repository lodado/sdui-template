/**
 * Scenario Test: Subscription System
 *
 * Tests for subscription-based re-renders
 */

import { screen, waitFor } from '@testing-library/react'
import React from 'react'
import { z } from 'zod'

import type { ComponentFactory } from '../../components/types'
import { useSduiLayoutAction, useSduiNodeSubscription } from '../../react-wrapper/hooks'
import { createTestDocument, renderWithSduiLayout } from '../utils/test-utils'

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

// Test component factory (for SDUI document rendering)
const TestComponentFactory: ComponentFactory = (id) => <SubscribedComponent nodeId={id} testPrefix="sdui" />

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

        const UpdateTest: React.FC = () => {
          const store = useSduiLayoutAction()
          React.useEffect(() => {
            // Update only node-1
            store.updateNodeState('node-1', { value: 15 })
          }, [store])

          return (
            <>
              <SubscribedComponent nodeId="node-1" testPrefix="test" />
              <SubscribedComponent nodeId="node-2" testPrefix="test" />
              <SubscribedComponent nodeId="node-3" testPrefix="test" />
            </>
          )
        }

        renderWithSduiLayout(
          document,
          {
            components: {
              TestComponent: TestComponentFactory,
            },
          },
          <UpdateTest />,
        )

        // All components should render initially (both SDUI and test components)
        expect(screen.getByTestId('test-subscribed-node-1')).toBeInTheDocument()
        expect(screen.getByTestId('test-subscribed-node-2')).toBeInTheDocument()
        expect(screen.getByTestId('test-subscribed-node-3')).toBeInTheDocument()

        await waitFor(() => {
          // Test components (from UpdateTest) - these are the ones we're testing
          const node1 = screen.getByTestId('test-subscribed-node-1')
          expect(node1).toHaveTextContent('Value: 15')
          expect(node1).toHaveTextContent('Render Count: 2') // Re-rendered

          const node2 = screen.getByTestId('test-subscribed-node-2')
          expect(node2).toHaveTextContent('Value: 20') // Unchanged
          expect(node2).toHaveTextContent('Render Count: 1') // Not re-rendered

          const node3 = screen.getByTestId('test-subscribed-node-3')
          expect(node3).toHaveTextContent('Value: 30') // Unchanged
          expect(node3).toHaveTextContent('Render Count: 1') // Not re-rendered
        })
      })
    })
  })
})
