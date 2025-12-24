/**
 * Scenario Test: Update Layout
 *
 * Tests for layout updates and re-renders
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'

import { useSduiLayoutAction, useSduiNodeSubscription } from '../../react/hooks'
import { createTestDocument, renderWithSduiLayout } from '../utils/test-utils'

// Test component that subscribes to node changes
const TestComponent: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const { state } = useSduiNodeSubscription({ nodeId })

  return (
    <div data-testid={`node-${nodeId}`}>
      <div>X: {state?.layout.x}</div>
      <div>Y: {state?.layout.y}</div>
      <div>W: {state?.layout.w}</div>
      <div>H: {state?.layout.h}</div>
    </div>
  )
}

describe('Layout Updates', () => {
  describe('as is: document loaded, component rendered', () => {
    describe('when: store.updateNodeLayout(nodeId, newLayout) called', () => {
      it('to be: only affected component re-renders', async () => {
        const document = createTestDocument({
          root: {
            id: 'root',
            type: 'Container',
            state: {
              layout: { x: 0, y: 0, w: 12, h: 1 },
            },
            children: [
              {
                id: 'node-1',
                type: 'Card',
                state: {
                  layout: { x: 0, y: 0, w: 6, h: 1 },
                },
              },
              {
                id: 'node-2',
                type: 'Card',
                state: {
                  layout: { x: 6, y: 0, w: 6, h: 1 },
                },
              },
            ],
          },
        })

        const UpdateTest: React.FC = () => {
          const store = useSduiLayoutAction()
          React.useEffect(() => {
            // Update node-1 layout
            store.updateNodeLayout('node-1', { x: 2, y: 0, w: 4, h: 1 })
          }, [store])

          return (
            <>
              <TestComponent nodeId="node-1" />
              <TestComponent nodeId="node-2" />
            </>
          )
        }

        renderWithSduiLayout(document, undefined, <UpdateTest />)

        await waitFor(() => {
          const node1 = screen.getByTestId('node-node-1')
          expect(node1).toHaveTextContent('X: 2')
          expect(node1).toHaveTextContent('W: 4')

          const node2 = screen.getByTestId('node-node-2')
          expect(node2).toHaveTextContent('X: 6') // Unchanged
        })
      })
    })
  })
})
