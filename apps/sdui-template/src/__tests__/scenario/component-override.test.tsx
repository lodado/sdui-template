/**
 * Scenario Test: Component Override
 *
 * Tests for component override functionality
 */

import { render, screen } from '@testing-library/react'
import React from 'react'

import type { ComponentFactory } from '../../components/types'
import { SduiLayoutRenderer } from '../../react-wrapper/components/SduiLayoutRenderer'
import { createTestDocument, defaultTestComponentFactory } from '../utils/test-utils'

describe('Component Overrides', () => {
  describe('as is: document with node type CustomType', () => {
    describe('when: components={{ CustomType: customFactory }} passed to Renderer', () => {
      it('to be: custom factory used for that type', () => {
        const customFactory: ComponentFactory = (id) => <div data-testid={`custom-${id}`}>Custom Component: {id}</div>

        const document = createTestDocument({
          root: {
            id: 'root',
            type: 'CustomType',
          },
        })

        render(<SduiLayoutRenderer document={document} components={{ CustomType: customFactory }} />)

        expect(screen.getByTestId('custom-root')).toBeInTheDocument()
        expect(screen.getByText(/Custom Component: root/i)).toBeInTheDocument()
      })
    })
  })

  describe('as is: document with node id custom-id, type DefaultType', () => {
    describe('when: componentOverrides={{ byNodeId: { custom-id: customFactory } }} passed', () => {
      it('to be: custom factory used for that ID (overrides type)', () => {
        const customFactory: ComponentFactory = (id) => <div data-testid={`custom-by-id-${id}`}>Custom by ID: {id}</div>

        const document = createTestDocument({
          root: {
            id: 'root',
            type: 'Container',
            children: [
              {
                id: 'custom-id',
                type: 'DefaultType',
              },
            ],
          },
        })

        render(
          <SduiLayoutRenderer
            document={document}
            components={{ Container: defaultTestComponentFactory }}
            componentOverrides={{
              byNodeId: { 'custom-id': customFactory },
            }}
          />,
        )

        expect(screen.getByTestId('custom-by-id-custom-id')).toBeInTheDocument()
        expect(screen.getByText(/Custom by ID: custom-id/i)).toBeInTheDocument()
      })
    })
  })
})
