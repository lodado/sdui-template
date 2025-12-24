/**
 * Test Utilities
 *
 * Helper functions and fixtures for testing
 */

import React from 'react'
import { render, RenderResult } from '@testing-library/react'

import { SduiLayoutProvider } from '../../react/context'
import { SduiLayoutRendererInner } from '../../react/components/SduiLayoutRenderer'
import type { ComponentFactory } from '../../components/types'
import type { SduiLayoutDocument } from '../../schema'
import { SduiLayoutStore } from '../../store'
import type { SduiLayoutStoreOptions } from '../../store/types'

/**
 * Create a test document with a single root node
 */
export function createTestDocument(overrides?: Partial<SduiLayoutDocument>): SduiLayoutDocument {
  return {
    version: '1.0.0',
    metadata: {
      id: 'test-doc',
      name: 'Test Document',
    },
    root: {
      id: 'root',
      type: 'Container',
      state: {},
      children: [],
    },
    ...overrides,
  }
}

/**
 * Create a test document with nested children
 */
export function createNestedTestDocument(): SduiLayoutDocument {
  return {
    version: '1.0.0',
    metadata: {
      id: 'nested-doc',
      name: 'Nested Document',
    },
    root: {
      id: 'root',
      type: 'Container',
      state: {},
      children: [
        {
          id: 'child-1',
          type: 'Card',
          state: {},
          children: [
            {
              id: 'grandchild-1',
              type: 'Panel',
              state: {},
            },
          ],
        },
        {
          id: 'child-2',
          type: 'Card',
          state: {},
        },
      ],
    },
  }
}

/**
 * Render component with SduiLayoutProvider
 */
export function renderWithProvider(ui: React.ReactElement, store?: SduiLayoutStore) {
  const testStore = store || new SduiLayoutStore()
  return render(<SduiLayoutProvider store={testStore}>{ui}</SduiLayoutProvider>)
}

/**
 * Render SDUI Layout with test components
 *
 * This helper function creates a store from a document and renders
 * both the SDUI layout and additional test components together.
 * Useful for testing store interactions while verifying SDUI rendering.
 *
 * @param document - SDUI Layout Document
 * @param options - Optional store options and component map
 * @param children - Additional test components to render alongside SDUI
 * @returns Render result with both SDUI and test components
 */
export function renderWithSduiLayout(
  document: SduiLayoutDocument,
  options?: {
    components?: Record<string, ComponentFactory>
    componentOverrides?: SduiLayoutStoreOptions['componentOverrides']
    onError?: (error: Error) => void
  },
  children?: React.ReactNode,
): RenderResult {
  const { components, componentOverrides, onError } = options || {}

  // Create store with document
  const storeOptions: SduiLayoutStoreOptions = {
    componentOverrides: {
      ...components,
      ...componentOverrides,
    },
  }

  const store = new SduiLayoutStore(undefined, storeOptions)

  try {
    store.updateLayout(document)
  } catch (error) {
    if (onError) {
      onError(error instanceof Error ? error : new Error(String(error)))
    }
  }

  // Merge component map
  const mergedComponentMap = components || {}

  const rootId = document?.root?.id
  if (!rootId) {
    return render(<div>Invalid document: missing root.id</div>)
  }

  return render(
    <SduiLayoutProvider store={store}>
      <SduiLayoutRendererInner id={rootId} componentMap={mergedComponentMap} />
      {children}
    </SduiLayoutProvider>,
  )
}
