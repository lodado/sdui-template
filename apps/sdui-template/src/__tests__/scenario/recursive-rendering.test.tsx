/**
 * @fileoverview Test for recursive rendering example from README
 * This test verifies that the recursive rendering example in README actually works
 */
import { render, screen } from '@testing-library/react'
import React from 'react'
import { z } from 'zod'

import { SduiLayoutRenderer, useRenderNode, useSduiNodeSubscription } from '../../react-wrapper'
import { ComponentFactory } from '../../store'
import { createTestDocument } from '../utils/test-utils'

// Step 4 example from README: Recursive Rendering - Container with Children

// 1. Create a Container component that renders its children
const Container = ({ id, parentPath = [] }: { id: string; parentPath?: string[] }) => {
  const { childrenIds } = useSduiNodeSubscription({ nodeId: id })
  const { renderNode, currentPath } = useRenderNode({ nodeId: id, parentPath })

  return (
    <div className="container p-4 border-2 border-gray-300 rounded-lg" data-testid={`container-${id}`}>
      <h3 className="mb-2">Container: {id}</h3>
      <div className="flex flex-col gap-2">
        {/* Recursively render each child */}
        {childrenIds.map((childId) => (
          <div key={childId}>{renderNode(childId, currentPath)}</div>
        ))}
      </div>
    </div>
  )
}

// 2. Create a simple Card component
const Card = ({ id }: { id: string }) => {
  const { state } = useSduiNodeSubscription({ nodeId: id })

  const title = typeof state.title === 'string' ? state.title : undefined
  const content = typeof state.content === 'string' ? state.content : undefined

  return (
    <div className="card p-3 bg-blue-100 rounded" data-testid={`card-${id}`}>
      <h4>{title || `Card ${id}`}</h4>
      {content && <p>{content}</p>}
    </div>
  )
}

// 3. Create factories
const ContainerFactory: ComponentFactory = (id, _renderNode, parentPath) => (
  <Container id={id} parentPath={parentPath} />
)
const CardFactory: ComponentFactory = (id) => <Card id={id} />

describe('README Example: Recursive Rendering', () => {
  describe('when: document with nested structure (Container > Container > Cards)', () => {
    it('to be: all nodes render recursively', () => {
      // 4. Document with nested structure (from README example)
      const document = createTestDocument({
        root: {
          id: 'root',
          type: 'Container',
          children: [
            {
              id: 'card-1',
              type: 'Card',
              state: {
                title: 'First Card',
                content: 'This is inside the root container',
              },
            },
            {
              id: 'container-1',
              type: 'Container',
              children: [
                {
                  id: 'card-2',
                  type: 'Card',
                  state: {
                    title: 'Nested Card',
                    content: 'This card is inside a nested container',
                  },
                },
                {
                  id: 'card-3',
                  type: 'Card',
                  state: {
                    title: 'Another Nested Card',
                    content: 'Also inside the nested container',
                  },
                },
              ],
            },
          ],
        },
      })

      render(
        <SduiLayoutRenderer
          document={document}
          components={{
            Container: ContainerFactory,
            Card: CardFactory,
          }}
        />,
      )

      // Root container should render
      expect(screen.getByTestId('container-root')).toBeInTheDocument()
      expect(screen.getByText('Container: root')).toBeInTheDocument()

      // First card (direct child of root) should render
      expect(screen.getByTestId('card-card-1')).toBeInTheDocument()
      expect(screen.getByText('First Card')).toBeInTheDocument()
      expect(screen.getByText('This is inside the root container')).toBeInTheDocument()

      // Nested container should render
      expect(screen.getByTestId('container-container-1')).toBeInTheDocument()
      expect(screen.getByText('Container: container-1')).toBeInTheDocument()

      // Nested cards should render
      expect(screen.getByTestId('card-card-2')).toBeInTheDocument()
      expect(screen.getByText('Nested Card')).toBeInTheDocument()
      expect(screen.getByText('This card is inside a nested container')).toBeInTheDocument()

      expect(screen.getByTestId('card-card-3')).toBeInTheDocument()
      expect(screen.getByText('Another Nested Card')).toBeInTheDocument()
      expect(screen.getByText('Also inside the nested container')).toBeInTheDocument()
    })
  })

  describe('when: deeply nested structure (3 levels)', () => {
    it('to be: all levels render correctly', () => {
      const document = createTestDocument({
        root: {
          id: 'level-1',
          type: 'Container',
          children: [
            {
              id: 'level-2',
              type: 'Container',
              children: [
                {
                  id: 'level-3',
                  type: 'Container',
                  children: [
                    {
                      id: 'deep-card',
                      type: 'Card',
                      state: {
                        title: 'Deep Card',
                        content: 'This is 3 levels deep',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      })

      render(
        <SduiLayoutRenderer
          document={document}
          components={{
            Container: ContainerFactory,
            Card: CardFactory,
          }}
        />,
      )

      // All containers should render
      expect(screen.getByTestId('container-level-1')).toBeInTheDocument()
      expect(screen.getByTestId('container-level-2')).toBeInTheDocument()
      expect(screen.getByTestId('container-level-3')).toBeInTheDocument()

      // Deep card should render
      expect(screen.getByTestId('card-deep-card')).toBeInTheDocument()
      expect(screen.getByText('Deep Card')).toBeInTheDocument()
      expect(screen.getByText('This is 3 levels deep')).toBeInTheDocument()
    })
  })

  describe('when: container with multiple children', () => {
    it('to be: all children render in order', () => {
      const document = createTestDocument({
        root: {
          id: 'root',
          type: 'Container',
          children: [
            {
              id: 'card-1',
              type: 'Card',
              state: {
                title: 'Card 1',
              },
            },
            {
              id: 'card-2',
              type: 'Card',
              state: {
                title: 'Card 2',
              },
            },
            {
              id: 'card-3',
              type: 'Card',
              state: {
                title: 'Card 3',
              },
            },
          ],
        },
      })

      render(
        <SduiLayoutRenderer
          document={document}
          components={{
            Container: ContainerFactory,
            Card: CardFactory,
          }}
        />,
      )

      // All cards should render
      expect(screen.getByText('Card 1')).toBeInTheDocument()
      expect(screen.getByText('Card 2')).toBeInTheDocument()
      expect(screen.getByText('Card 3')).toBeInTheDocument()
    })
  })

  describe('when: card without state', () => {
    it('to be: renders with default title', () => {
      const document = createTestDocument({
        root: {
          id: 'root',
          type: 'Container',
          children: [
            {
              id: 'card-no-state',
              type: 'Card',
            },
          ],
        },
      })

      render(
        <SduiLayoutRenderer
          document={document}
          components={{
            Container: ContainerFactory,
            Card: CardFactory,
          }}
        />,
      )

      // Should render with default title format
      expect(screen.getByText('Card card-no-state')).toBeInTheDocument()
    })
  })
})
