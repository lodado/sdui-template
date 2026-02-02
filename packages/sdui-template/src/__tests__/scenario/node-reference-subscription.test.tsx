/* eslint-disable max-classes-per-file */
/* eslint-disable import/no-extraneous-dependencies */
/**
 * Test: Node Reference Subscription
 *
 * Tests to verify that referenced nodes' state changes trigger re-renders
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { z } from 'zod'

import type { ComponentFactory } from '../../components/types'
import { SduiLayoutRenderer } from '../../react-wrapper/components/SduiLayoutRenderer'
import { useSduiLayoutAction, useSduiNodeReference, useSduiNodeSubscription } from '../../react-wrapper/hooks'
import { NodeNotFoundError } from '../../store'
import { createTestDocument, defaultTestComponentFactory } from '../utils/dev-utils'

// Toggle state schema
const toggleStateSchema = z.object({
  checked: z.boolean(),
  label: z.string().optional(),
})

describe('Node Reference Subscription', () => {
  it('should re-render when referenced node state changes', async () => {
    const document = createTestDocument({
      root: {
        id: 'root',
        type: 'Container',
        children: [
          {
            id: 'source-node',
            type: 'Card',
            reference: 'target-node',
          },
          {
            id: 'target-node',
            type: 'Card',
            state: {
              count: 0,
            },
          },
        ],
      },
    })

    const ReferenceComponent: React.FC<{ nodeId: string }> = ({ nodeId }) => {
      const { referencedNodesMap } = useSduiNodeReference({ nodeId })
      const store = useSduiLayoutAction()

      const targetNode = referencedNodesMap['target-node']

      React.useEffect(() => {
        // 100ms 후에 참조된 노드의 state를 변경
        const timer = setTimeout(() => {
          store.updateNodeState('target-node', { count: 42 })
        }, 100)
        return () => clearTimeout(timer)
      }, [store])

      return (
        <div data-testid={`node-${nodeId}`}>
          {targetNode && <div data-testid={`target-count-${nodeId}`}>{String(targetNode.state.count)}</div>}
        </div>
      )
    }

    const componentFactory: ComponentFactory = (id) => {
      if (id === 'source-node') {
        return <ReferenceComponent nodeId={id} />
      }
      return <div data-testid={`default-${id}`}>Default</div>
    }

    render(
      <SduiLayoutRenderer
        document={document}
        components={{ Container: defaultTestComponentFactory, Card: componentFactory }}
      />,
    )

    // 초기값 확인
    expect(screen.getByTestId('target-count-source-node')).toHaveTextContent('0')

    // state 변경 후 리렌더링 확인
    await waitFor(
      () => {
        expect(screen.getByTestId('target-count-source-node')).toHaveTextContent('42')
      },
      { timeout: 500 },
    )
  })

  it('should update referenced component when toggle is clicked', async () => {
    const document = createTestDocument({
      root: {
        id: 'root',
        type: 'Container',
        children: [
          {
            id: 'toggle-node',
            type: 'Toggle',
            state: {
              checked: false,
              label: 'Power',
            },
          },
          {
            id: 'status-display',
            type: 'StatusDisplay',
            reference: 'toggle-node',
          },
        ],
      },
    })

    // Toggle 컴포넌트: 클릭하면 자신의 state를 변경
    const ToggleComponent: React.FC<{ nodeId: string }> = ({ nodeId }) => {
      const { state } = useSduiNodeSubscription({
        nodeId,
        schema: toggleStateSchema,
      })
      const store = useSduiLayoutAction()

      const handleClick = () => {
        store.updateNodeState(nodeId, { checked: !state.checked })
      }

      return (
        <div data-testid={`toggle-${nodeId}`}>
          <button type="button" onClick={handleClick} data-testid={`toggle-button-${nodeId}`}>
            {state.label || 'Toggle'}
          </button>
          <span data-testid={`toggle-status-${nodeId}`}>{state.checked ? 'ON' : 'OFF'}</span>
        </div>
      )
    }

    // StatusDisplay 컴포넌트: reference를 통해 toggle-node의 상태를 표시
    const StatusDisplayComponent: React.FC<{ nodeId: string }> = ({ nodeId }) => {
      const { referencedNodesMap } = useSduiNodeReference({ nodeId })

      const toggleNode = referencedNodesMap['toggle-node']

      if (!toggleNode) {
        return <div data-testid={`status-${nodeId}`}>No reference</div>
      }

      return (
        <div data-testid={`status-${nodeId}`}>
          <div data-testid={`status-value-${nodeId}`}>{toggleNode.state.checked ? 'ON' : 'OFF'}</div>
          <div data-testid={`status-label-${nodeId}`}>
            {toggleNode.state.label ? `Label: ${String(toggleNode.state.label)}` : ''}
          </div>
        </div>
      )
    }

    const toggleFactory: ComponentFactory = (id) => <ToggleComponent nodeId={id} />
    const statusDisplayFactory: ComponentFactory = (id) => <StatusDisplayComponent nodeId={id} />

    render(
      <SduiLayoutRenderer
        document={document}
        components={{
          Container: defaultTestComponentFactory,
          Toggle: toggleFactory,
          StatusDisplay: statusDisplayFactory,
        }}
      />,
    )

    // 초기 상태 확인: toggle은 OFF, status-display도 OFF 표시
    expect(screen.getByTestId('toggle-status-toggle-node')).toHaveTextContent('OFF')
    expect(screen.getByTestId('status-value-status-display')).toHaveTextContent('OFF')

    // Toggle 버튼 클릭
    const toggleButton = screen.getByTestId('toggle-button-toggle-node')
    fireEvent.click(toggleButton)

    // 상태가 ON으로 변경되었는지 확인
    await waitFor(
      () => {
        expect(screen.getByTestId('toggle-status-toggle-node')).toHaveTextContent('ON')
        expect(screen.getByTestId('status-value-status-display')).toHaveTextContent('ON')
      },
      { timeout: 500 },
    )

    // 다시 클릭하여 OFF로 변경
    fireEvent.click(toggleButton)

    // 상태가 OFF로 변경되었는지 확인
    await waitFor(
      () => {
        expect(screen.getByTestId('toggle-status-toggle-node')).toHaveTextContent('OFF')
        expect(screen.getByTestId('status-value-status-display')).toHaveTextContent('OFF')
      },
      { timeout: 500 },
    )
  })

  it('should throw NodeNotFoundError when referenced node does not exist', () => {
    const document = createTestDocument({
      root: {
        id: 'root',
        type: 'Container',
        children: [
          {
            id: 'source-node',
            type: 'Card',
            reference: 'non-existent-node',
          },
        ],
      },
    })

    // React의 에러 경계를 사용하여 에러를 catch
    class TestErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
      constructor(props: { children: React.ReactNode }) {
        super(props)
        const { error } = { error: null }
        this.state = { error }
      }

      static getDerivedStateFromError(error: Error) {
        return { error }
      }

      componentDidCatch(error: Error) {
        // 에러 로깅 등
      }

      render() {
        const { error } = this.state
        const { children } = this.props
        if (error) {
          return (
            <div data-testid="error-boundary">{error instanceof NodeNotFoundError ? error.message : String(error)}</div>
          )
        }
        return children
      }
    }

    // useSduiNodeReference를 호출하는 컴포넌트
    // 참조된 노드가 없으면 exists: false를 반환합니다 (에러를 throw하지 않음)
    const ReferenceTestComponent: React.FC<{ nodeId: string }> = ({ nodeId }) => {
      const { referencedNodes, hasReference } = useSduiNodeReference({ nodeId })
      const nonExistentNode = referencedNodes.find((n) => n.id === 'non-existent-node')

      return (
        <div data-testid={`node-${nodeId}`}>
          <div data-testid="has-reference">{String(hasReference)}</div>
          {nonExistentNode && <div data-testid="non-existent-exists">{String(nonExistentNode.exists)}</div>}
        </div>
      )
    }

    const componentFactory: ComponentFactory = (id) => {
      if (id === 'source-node') {
        return <ReferenceTestComponent nodeId={id} />
      }
      return <div data-testid={`default-${id}`}>Default</div>
    }

    render(
      <SduiLayoutRenderer
        document={document}
        components={{ Container: defaultTestComponentFactory, Card: componentFactory }}
      />,
    )

    // 참조는 있지만 존재하지 않는 노드는 exists: false를 반환
    expect(screen.getByTestId('has-reference')).toHaveTextContent('true')
    expect(screen.getByTestId('non-existent-exists')).toHaveTextContent('false')
  })

  it('should re-render when multiple referenced nodes state changes', async () => {
    const document = createTestDocument({
      root: {
        id: 'root',
        type: 'Container',
        children: [
          {
            id: 'source-node',
            type: 'Card',
            reference: ['target-1', 'target-2'],
          },
          {
            id: 'target-1',
            type: 'Card',
            state: {
              count: 0,
            },
          },
          {
            id: 'target-2',
            type: 'Card',
            state: {
              count: 10,
            },
          },
        ],
      },
    })

    const MultipleReferenceComponent: React.FC<{ nodeId: string }> = ({ nodeId }) => {
      const { referencedNodesMap } = useSduiNodeReference({ nodeId })
      const store = useSduiLayoutAction()

      const target1 = referencedNodesMap['target-1']
      const target2 = referencedNodesMap['target-2']

      React.useEffect(() => {
        // 100ms 후에 첫 번째 참조된 노드의 state를 변경
        const timer1 = setTimeout(() => {
          store.updateNodeState('target-1', { count: 42 })
        }, 100)

        // 200ms 후에 두 번째 참조된 노드의 state를 변경
        const timer2 = setTimeout(() => {
          store.updateNodeState('target-2', { count: 99 })
        }, 200)

        return () => {
          clearTimeout(timer1)
          clearTimeout(timer2)
        }
      }, [store])

      return (
        <div data-testid={`node-${nodeId}`}>
          {target1 && <div data-testid={`target-1-count-${nodeId}`}>{String(target1.state.count)}</div>}
          {target2 && <div data-testid={`target-2-count-${nodeId}`}>{String(target2.state.count)}</div>}
        </div>
      )
    }

    const componentFactory: ComponentFactory = (id) => {
      if (id === 'source-node') {
        return <MultipleReferenceComponent nodeId={id} />
      }
      return <div data-testid={`default-${id}`}>Default</div>
    }

    render(
      <SduiLayoutRenderer
        document={document}
        components={{ Container: defaultTestComponentFactory, Card: componentFactory }}
      />,
    )

    // 초기값 확인
    expect(screen.getByTestId('target-1-count-source-node')).toHaveTextContent('0')
    expect(screen.getByTestId('target-2-count-source-node')).toHaveTextContent('10')

    // 첫 번째 노드 state 변경 후 리렌더링 확인
    await waitFor(
      () => {
        expect(screen.getByTestId('target-1-count-source-node')).toHaveTextContent('42')
      },
      { timeout: 500 },
    )

    // 두 번째 노드 state 변경 후 리렌더링 확인
    await waitFor(
      () => {
        expect(screen.getByTestId('target-2-count-source-node')).toHaveTextContent('99')
      },
      { timeout: 500 },
    )
  })

  it('should throw NodeNotFoundError when one of multiple referenced nodes does not exist', () => {
    const document = createTestDocument({
      root: {
        id: 'root',
        type: 'Container',
        children: [
          {
            id: 'source-node',
            type: 'Card',
            reference: ['target-1', 'non-existent-node'],
          },
          {
            id: 'target-1',
            type: 'Card',
            state: {
              count: 0,
            },
          },
        ],
      },
    })

    // React의 에러 경계를 사용하여 에러를 catch
    class TestErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
      constructor(props: { children: React.ReactNode }) {
        super(props)
        const { error } = { error: null }
        this.state = { error }
      }

      static getDerivedStateFromError(error: Error) {
        return { error }
      }

      componentDidCatch(error: Error) {
        // 에러 로깅 등
      }

      render() {
        const { error } = this.state
        const { children } = this.props
        if (error) {
          return (
            <div data-testid="error-boundary">{error instanceof NodeNotFoundError ? error.message : String(error)}</div>
          )
        }
        return children
      }
    }

    // useSduiNodeReference를 호출하는 컴포넌트
    // 여러 reference 중 존재하지 않는 노드는 exists: false를 반환합니다 (에러를 throw하지 않음)
    const ReferenceTestComponent: React.FC<{ nodeId: string }> = ({ nodeId }) => {
      const { referencedNodes, hasReference } = useSduiNodeReference({ nodeId })
      const target1 = referencedNodes.find((n) => n.id === 'target-1')
      const nonExistentNode = referencedNodes.find((n) => n.id === 'non-existent-node')

      return (
        <div data-testid={`node-${nodeId}`}>
          <div data-testid="has-reference">{String(hasReference)}</div>
          {target1 && <div data-testid="target-1-exists">{String(target1.exists)}</div>}
          {nonExistentNode && <div data-testid="non-existent-exists">{String(nonExistentNode.exists)}</div>}
        </div>
      )
    }

    const componentFactory: ComponentFactory = (id) => {
      if (id === 'source-node') {
        return <ReferenceTestComponent nodeId={id} />
      }
      return <div data-testid={`default-${id}`}>Default</div>
    }

    render(
      <SduiLayoutRenderer
        document={document}
        components={{ Container: defaultTestComponentFactory, Card: componentFactory }}
      />,
    )

    // 참조는 있지만 존재하지 않는 노드는 exists: false를 반환
    expect(screen.getByTestId('has-reference')).toHaveTextContent('true')
    expect(screen.getByTestId('target-1-exists')).toHaveTextContent('true')
    expect(screen.getByTestId('non-existent-exists')).toHaveTextContent('false')
  })
})
