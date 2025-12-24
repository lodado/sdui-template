/**
 * Scenario Test: Node Not Found Error
 *
 * Tests for NodeNotFoundError when accessing non-existent nodes
 */

import { render, screen } from '@testing-library/react'
import React from 'react'

import { useSduiLayoutAction } from '../../react-wrapper/hooks'
import { createTestDocument, renderWithSduiLayout } from '../utils/test-utils'

const NodeNotFoundTest: React.FC = () => {
  const store = useSduiLayoutAction()
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    try {
      // Try to update non-existent node
      store.updateNodeState('non-existent-node', { count: 5 })
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }, [store])

  const node = store.getNodeById('non-existent-node')
  const childrenIds = store.getChildrenIdsById('non-existent-node')

  return (
    <div>
      <div data-testid="node-exists">{node ? 'exists' : 'not-found'}</div>
      <div data-testid="children-count">{childrenIds.length}</div>
      {error && <div data-testid="error-message">{error}</div>}
    </div>
  )
}

describe('Node Not Found Error', () => {
  describe('as is: document loaded with node-1', () => {
    describe('when: getNodeById("non-existent-node") called', () => {
      it('to be: returns undefined, no error thrown', () => {
        const document = createTestDocument({
          root: {
            id: 'root',
            type: 'Container',
            state: {},
            children: [
              {
                id: 'node-1',
                type: 'Card',
                state: {},
              },
            ],
          },
        })

        renderWithSduiLayout(document, undefined, <NodeNotFoundTest />)

        expect(screen.getByTestId('node-exists')).toHaveTextContent('not-found')
        expect(screen.getByTestId('children-count')).toHaveTextContent('0')
      })
    })

    describe('when: getChildrenIdsById("non-existent-node") called', () => {
      it('to be: returns empty array, no error thrown', () => {
        const document = createTestDocument({
          root: {
            id: 'root',
            type: 'Container',
            state: {},
            children: [
              {
                id: 'node-1',
                type: 'Card',
                state: {},
              },
            ],
          },
        })

        renderWithSduiLayout(document, undefined, <NodeNotFoundTest />)

        expect(screen.getByTestId('children-count')).toHaveTextContent('0')
      })
    })

    describe('when: updateNodeState("non-existent-node", state) called', () => {
      it('to be: no error thrown, update silently ignored', () => {
        const document = createTestDocument({
          root: {
            id: 'root',
            type: 'Container',
            state: {},
            children: [
              {
                id: 'node-1',
                type: 'Card',
                state: {},
              },
            ],
          },
        })

        renderWithSduiLayout(document, undefined, <NodeNotFoundTest />)

        // updateNodeState should not throw, but should not update anything
        // The error should be null (no error thrown)
        const errorElement = screen.queryByTestId('error-message')
        expect(errorElement).not.toBeInTheDocument()
      })
    })
  })
})

