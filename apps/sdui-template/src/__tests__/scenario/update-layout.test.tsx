/**
 * Scenario Test: Update State
 *
 * Tests for state updates and re-renders using custom components
 */

import { render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { z } from 'zod'

import type { ComponentFactory } from '../../components/types'
import { useSduiLayoutAction, useSduiNodeSubscription } from '../../react-wrapper/hooks'
import { createTestDocument, renderWithSduiLayout } from '../utils/test-utils'

// Test component state schema
const testComponentStateSchema = z.object({
  value: z.number(),
  label: z.string().optional(),
})

// Test component that subscribes to node changes
const TestComponent: React.FC<{ nodeId: string; testPrefix?: string }> = ({ nodeId, testPrefix = 'test' }) => {
  const { state } = useSduiNodeSubscription({
    nodeId,
    schema: testComponentStateSchema,
  })

  return (
    <div data-testid={`${testPrefix}-node-${nodeId}`}>
      <div>Value: {state?.value}</div>
      {state?.label && <div>Label: {state.label}</div>}
    </div>
  )
}

// Test component factory (for SDUI document rendering)
const TestComponentFactory: ComponentFactory = (id) => <TestComponent nodeId={id} testPrefix="sdui" />

describe('State Updates', () => {
  describe('as is: document loaded, component rendered', () => {
    describe('when: store.updateNodeState(nodeId, newState) called', () => {
      it('to be: only affected component re-renders', async () => {
        const document = createTestDocument({
          root: {
            id: 'root',
            type: 'Container',
            state: {},
            children: [
              {
                id: 'node-1',
                type: 'TestComponent',
                state: {
                  value: 10,
                  label: 'First',
                },
              },
              {
                id: 'node-2',
                type: 'TestComponent',
                state: {
                  value: 20,
                  label: 'Second',
                },
              },
            ],
          },
        })

        const UpdateTest: React.FC = () => {
          const store = useSduiLayoutAction()
          React.useEffect(() => {
            // Update node-1 state
            store.updateNodeState('node-1', { value: 15 })
          }, [store])

          return (
            <>
              <TestComponent nodeId="node-1" testPrefix="test" />
              <TestComponent nodeId="node-2" testPrefix="test" />
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

        await waitFor(() => {
          const node1 = screen.getByTestId('test-node-node-1')
          expect(node1).toHaveTextContent('Value: 15')

          const node2 = screen.getByTestId('test-node-node-2')
          expect(node2).toHaveTextContent('Value: 20') // Unchanged
        })
      })
    })
  })
})
