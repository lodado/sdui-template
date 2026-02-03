/**
 * Scenario Test: Node Not Found Error
 *
 * Tests for NodeNotFoundError when accessing non-existent nodes
 */

import { render, screen } from '@testing-library/react'
import React from 'react'

import { useSduiLayoutAction } from '../../react-wrapper/hooks'
import { AttributesNotFoundError, NodeNotFoundError, RootNotFoundError } from '../../store'
import { createTestDocument, renderWithSduiLayout } from '../utils/dev-utils'

const NodeNotFoundTest: React.FC = () => {
  const store = useSduiLayoutAction()
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    const newErrors: Record<string, string> = {}

    // Test getNodeById
    try {
      store.getNodeById('non-existent-node')
    } catch (e) {
      newErrors.getNodeById = e instanceof Error ? e.message : String(e)
    }

    // Test getChildrenIdsById
    try {
      store.getChildrenIdsById('non-existent-node')
    } catch (e) {
      newErrors.getChildrenIdsById = e instanceof Error ? e.message : String(e)
    }

    // Test getNodeTypeById
    try {
      store.getNodeTypeById('non-existent-node')
    } catch (e) {
      newErrors.getNodeTypeById = e instanceof Error ? e.message : String(e)
    }

    // Test getLayoutStateById (NodeNotFoundError when the node is missing)
    try {
      store.getLayoutStateById('non-existent-node')
    } catch (e) {
      newErrors.getLayoutStateById = e instanceof Error ? e.message : String(e)
    }

    // Test getAttributesById
    try {
      store.getAttributesById('non-existent-node')
    } catch (e) {
      newErrors.getAttributesById = e instanceof Error ? e.message : String(e)
    }

    // Test updateNodeState
    try {
      store.updateNodeState('non-existent-node', { count: 5 })
    } catch (e) {
      newErrors.updateNodeState = e instanceof Error ? e.message : String(e)
    }

    // Test updateNodeAttributes
    try {
      store.updateNodeAttributes('non-existent-node', { test: 'value' })
    } catch (e) {
      newErrors.updateNodeAttributes = e instanceof Error ? e.message : String(e)
    }

    setErrors(newErrors)
  }, [store])

  return (
    <div>
      {errors.getNodeById && <div data-testid="error-getNodeById">{errors.getNodeById}</div>}
      {errors.getChildrenIdsById && <div data-testid="error-getChildrenIdsById">{errors.getChildrenIdsById}</div>}
      {errors.getNodeTypeById && <div data-testid="error-getNodeTypeById">{errors.getNodeTypeById}</div>}
      {errors.getLayoutStateById && <div data-testid="error-getLayoutStateById">{errors.getLayoutStateById}</div>}
      {errors.getAttributesById && <div data-testid="error-getAttributesById">{errors.getAttributesById}</div>}
      {errors.updateNodeState && <div data-testid="error-updateNodeState">{errors.updateNodeState}</div>}
      {errors.updateNodeAttributes && <div data-testid="error-updateNodeAttributes">{errors.updateNodeAttributes}</div>}
    </div>
  )
}

describe('Node Not Found Error', () => {
  describe('as is: document loaded with node-1', () => {
    const document = createTestDocument({
      root: {
        id: 'root',
        type: 'Container',
        children: [
          {
            id: 'node-1',
            type: 'Card',
          },
        ],
      },
    })

    describe('when: getNodeById("non-existent-node") called', () => {
      it('to be: NodeNotFoundError thrown with correct message', () => {
        renderWithSduiLayout(document, undefined, <NodeNotFoundTest />)

        const errorElement = screen.getByTestId('error-getNodeById')
        expect(errorElement).toBeInTheDocument()
        expect(errorElement).toHaveTextContent('Node not found: "non-existent-node"')
      })
    })

    describe('when: getChildrenIdsById("non-existent-node") called', () => {
      it('to be: NodeNotFoundError thrown with correct message', () => {
        renderWithSduiLayout(document, undefined, <NodeNotFoundTest />)

        const errorElement = screen.getByTestId('error-getChildrenIdsById')
        expect(errorElement).toBeInTheDocument()
        expect(errorElement).toHaveTextContent('Node not found: "non-existent-node"')
      })
    })

    describe('when: getNodeTypeById("non-existent-node") called', () => {
      it('to be: NodeNotFoundError thrown with correct message', () => {
        renderWithSduiLayout(document, undefined, <NodeNotFoundTest />)

        const errorElement = screen.getByTestId('error-getNodeTypeById')
        expect(errorElement).toBeInTheDocument()
        expect(errorElement).toHaveTextContent('Node not found: "non-existent-node"')
      })
    })

    describe('when: getLayoutStateById("non-existent-node") called', () => {
      it('to be: NodeNotFoundError thrown with correct message', () => {
        renderWithSduiLayout(document, undefined, <NodeNotFoundTest />)

        const errorElement = screen.getByTestId('error-getLayoutStateById')
        expect(errorElement).toBeInTheDocument()
        expect(errorElement).toHaveTextContent('Node not found: "non-existent-node"')
      })
    })

    describe('when: getAttributesById("non-existent-node") called', () => {
      it('to be: NodeNotFoundError thrown with correct message', () => {
        renderWithSduiLayout(document, undefined, <NodeNotFoundTest />)

        const errorElement = screen.getByTestId('error-getAttributesById')
        expect(errorElement).toBeInTheDocument()
        expect(errorElement).toHaveTextContent('Node not found: "non-existent-node"')
      })
    })

    describe('when: updateNodeState("non-existent-node", state) called', () => {
      it('to be: NodeNotFoundError thrown with correct message', () => {
        renderWithSduiLayout(document, undefined, <NodeNotFoundTest />)

        const errorElement = screen.getByTestId('error-updateNodeState')
        expect(errorElement).toBeInTheDocument()
        expect(errorElement).toHaveTextContent('Node not found: "non-existent-node"')
      })
    })

    describe('when: updateNodeAttributes("non-existent-node", attributes) called', () => {
      it('to be: NodeNotFoundError thrown with correct message', () => {
        renderWithSduiLayout(document, undefined, <NodeNotFoundTest />)

        const errorElement = screen.getByTestId('error-updateNodeAttributes')
        expect(errorElement).toBeInTheDocument()
        expect(errorElement).toHaveTextContent('Node not found: "non-existent-node"')
      })
    })
  })

  describe('as is: empty store (after reset)', () => {
    const RootNotFoundTest: React.FC = () => {
      const store = useSduiLayoutAction()
      const [error, setError] = React.useState<string | null>(null)

      React.useEffect(() => {
        store.reset()
        try {
          store.getRootId()
        } catch (e) {
          setError(e instanceof Error ? e.message : String(e))
        }
      }, [store])

      return <div>{error && <div data-testid="error-getRootId">{error}</div>}</div>
    }

    describe('when: getRootId() called on empty store', () => {
      it('to be: RootNotFoundError thrown with correct message', () => {
        const document = createTestDocument()
        renderWithSduiLayout(document, undefined, <RootNotFoundTest />)

        const errorElement = screen.getByTestId('error-getRootId')
        expect(errorElement).toBeInTheDocument()
        expect(errorElement).toHaveTextContent('Root node ID not found')
      })
    })
  })

  describe('as is: document without metadata', () => {
    const MetadataNotFoundTest: React.FC = () => {
      const store = useSduiLayoutAction()
      const [error, setError] = React.useState<string | null>(null)

      React.useEffect(() => {
        try {
          // Access metadata getter to trigger error
          const _metadata = store.metadata
          // Use the value to avoid unused variable warning
          if (_metadata) {
            // This should never execute if error is thrown correctly
            setError(null)
          }
        } catch (e) {
          setError(e instanceof Error ? e.message : String(e))
        }
      }, [store])

      return <div>{error && <div data-testid="error-metadata">{error}</div>}</div>
    }

    describe('when: metadata getter called on document without metadata', () => {
      it('to be: MetadataNotFoundError thrown with correct message', () => {
        const document = createTestDocument({
          metadata: undefined,
        })
        renderWithSduiLayout(document, undefined, <MetadataNotFoundTest />)

        const errorElement = screen.getByTestId('error-metadata')
        expect(errorElement).toBeInTheDocument()
        expect(errorElement).toHaveTextContent('Metadata not found')
      })
    })
  })
})
