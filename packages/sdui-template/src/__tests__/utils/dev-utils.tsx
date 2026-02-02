/**
 * Test Utilities
 *
 * Helper functions and fixtures for testing
 */

import { render, RenderResult } from '@testing-library/react'
import React from 'react'

import type { ComponentFactory, SduiComponentProps } from '../../components/types'
import { SduiLayoutRendererInner } from '../../react-wrapper/components/SduiLayoutRenderer'
import { SduiLayoutProvider } from '../../react-wrapper/context'
import { useRenderNode } from '../../react-wrapper/hooks/useRenderNode'
import { useSduiNodeSubscription } from '../../react-wrapper/hooks/useSduiNodeSubscription'
import type { SduiLayoutDocument } from '../../schema'
import { SduiLayoutStore } from '../../store'
import type { SduiLayoutStoreOptions } from '../../store/types'

/**
 * 테스트용 기본 노드 컴포넌트 (자식 렌더링 포함)
 *
 * 노드 정보를 표시하고 자식 노드를 렌더링합니다.
 * 테스트에서 기본 컴포넌트로 사용됩니다.
 */
export const TestDefaultNodeComponent: React.FC<SduiComponentProps> = ({ nodeId: id, parentPath = [] }) => {
  const { type, childrenIds } = useSduiNodeSubscription({
    nodeId: id,
  })
  const { renderNode, currentPath } = useRenderNode({ nodeId: id, parentPath })

  if (!type) return null

  return (
    <div data-sdui-node-id={id} data-sdui-node-type={type}>
      <div>Type: {type}</div>
      <div>ID: {id}</div>
      {childrenIds && childrenIds.length > 0 && (
        <div>
          {childrenIds.map((childId: string) => (
            <div key={childId}>{renderNode(childId, currentPath)}</div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * 테스트용 기본 컴포넌트 팩토리
 *
 * 테스트에서 기본 컴포넌트로 사용되는 팩토리입니다.
 */
export const defaultTestComponentFactory: ComponentFactory = (id, parentPath) => (
  <TestDefaultNodeComponent nodeId={id} parentPath={parentPath} />
)

/**
 * Create a test document with a single root node
 */
export function createTestDocument(overrides?: Partial<SduiLayoutDocument>): SduiLayoutDocument {
  const defaultRoot = {
    id: 'root',
    type: 'Container',
    children: [],
  }

  // overrides가 있으면 병합 (state와 attributes는 normalize에서 자동 처리되므로 명시하지 않아도 됨)
  const mergedRoot = overrides?.root
    ? {
        ...defaultRoot,
        ...overrides.root,
        // state와 attributes는 normalize에서 자동으로 {}로 설정되므로 명시하지 않아도 됨
      }
    : defaultRoot

  return {
    version: '1.0.0',
    metadata: {
      id: 'test-doc',
      name: 'Test Document',
    },
    ...overrides,
    root: mergedRoot, // root는 항상 병합된 결과 사용
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
      children: [
        {
          id: 'child-1',
          type: 'Card',
          children: [
            {
              id: 'grandchild-1',
              type: 'Panel',
            },
          ],
        },
        {
          id: 'child-2',
          type: 'Card',
        },
      ],
    },
  }
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
