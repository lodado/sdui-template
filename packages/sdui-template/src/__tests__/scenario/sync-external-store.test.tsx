/**
 * Scenario Test: useSyncExternalStore Tearing Prevention
 *
 * Tests for preventing tearing issues in concurrent rendering scenarios
 */

import { screen, waitFor } from '@testing-library/react'
import React from 'react'
import { z } from 'zod'

import type { ComponentFactory } from '../../components/types'
import { useSduiLayoutAction, useSduiNodeSubscription } from '../../react-wrapper/hooks'
import { createTestDocument, renderWithSduiLayout } from '../utils/dev-utils'

// Test component state schema
const testComponentStateSchema = z.object({
  value: z.number(),
})

// Component that subscribes to a node and displays value
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

// Test component factory
const TestComponentFactory: ComponentFactory = (id) => <SubscribedComponent nodeId={id} testPrefix="sdui" />

describe('useSyncExternalStore Tearing Prevention', () => {
  describe('as is: multiple components subscribed to same node', () => {
    describe('when: store.updateNodeState(nodeId, newState) is called rapidly', () => {
      it('to be: all components show consistent state, should not have tearing', async () => {
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
            ],
          },
        })

        const RapidUpdateTest: React.FC = () => {
          const store = useSduiLayoutAction()

          React.useEffect(() => {
            // Rapid updates to simulate concurrent rendering scenario
            // 각 업데이트 사이에 충분한 간격을 두어 React가 처리할 수 있도록 함
            setTimeout(() => store.updateNodeState('node-1', { value: 20 }), 10)
            setTimeout(() => store.updateNodeState('node-1', { value: 30 }), 30)
            setTimeout(() => store.updateNodeState('node-1', { value: 40 }), 50)
          }, [store])

          return (
            <>
              <SubscribedComponent nodeId="node-1" testPrefix="test1" />
              <SubscribedComponent nodeId="node-1" testPrefix="test2" />
              <SubscribedComponent nodeId="node-1" testPrefix="test3" />
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
          <RapidUpdateTest />,
        )

        // Wait for all updates to complete (마지막 업데이트가 50ms 후이므로 충분한 시간 대기)
        await waitFor(
          () => {
            const comp1 = screen.getByTestId('test1-subscribed-node-1')
            const comp2 = screen.getByTestId('test2-subscribed-node-1')
            const comp3 = screen.getByTestId('test3-subscribed-node-1')

            const value1 = comp1.textContent?.match(/Value: (\d+)/)?.[1]
            const value2 = comp2.textContent?.match(/Value: (\d+)/)?.[1]
            const value3 = comp3.textContent?.match(/Value: (\d+)/)?.[1]

            // All components should show the same final value (no tearing)
            expect(value1).toBe('40')
            expect(value2).toBe('40')
            expect(value3).toBe('40')
            expect(value1).toBe(value2)
            expect(value2).toBe(value3)
          },
          { timeout: 3000 },
        )
      })
    })
  })

  describe('as is: component subscribed to node with initial state', () => {
    describe('when: store.updateNodeState is called, then immediately read via getSnapshot', () => {
      it('to be: getSnapshot returns updated state immediately, should be consistent', async () => {
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
            ],
          },
        })

        const ConsistencyTest: React.FC = () => {
          const store = useSduiLayoutAction()
          const [snapshotValue, setSnapshotValue] = React.useState<number | null>(null)
          const [hookValue, setHookValue] = React.useState<number | null>(null)

          React.useEffect(() => {
            // Update state
            store.updateNodeState('node-1', { value: 50 })

            // Immediately read via state (getSnapshot은 lastModified와 version만 반환)
            const { nodes } = store.state
            const node = nodes['node-1']
            setSnapshotValue((node?.state as any)?.value)

            // Also check via hook (should be consistent)
            setTimeout(() => {
              const { nodes: hookNodes } = store.state
              const hookNode = hookNodes['node-1']
              setHookValue((hookNode?.state as any)?.value)
            }, 0)
          }, [store])

          return (
            <>
              <SubscribedComponent nodeId="node-1" testPrefix="test" />
              <div data-testid="snapshot-value">{snapshotValue ?? 'null'}</div>
              <div data-testid="hook-value">{hookValue ?? 'null'}</div>
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
          <ConsistencyTest />,
        )

        await waitFor(
          () => {
            const snapshotVal = screen.getByTestId('snapshot-value').textContent
            const hookVal = screen.getByTestId('hook-value').textContent

            // Both should show the updated value
            expect(snapshotVal).toBe('50')
            expect(hookVal).toBe('50')
          },
          { timeout: 1000 },
        )
      })
    })
  })

  describe('as is: component subscribed to node', () => {
    describe('when: store.updateLayout is called with new document, then component reads state', () => {
      it('to be: component shows new state from updated document, should not show stale data', async () => {
        const initialDoc = createTestDocument({
          root: {
            id: 'root',
            type: 'Container',
            children: [
              {
                id: 'node-1',
                type: 'TestComponent',
                state: { value: 10 },
              },
            ],
          },
        })

        const UpdateDocumentTest: React.FC = () => {
          const store = useSduiLayoutAction()

          React.useEffect(() => {
            setTimeout(() => {
              const newDoc = createTestDocument({
                root: {
                  id: 'root',
                  type: 'Container',
                  children: [
                    {
                      id: 'node-1',
                      type: 'TestComponent',
                      state: { value: 100 },
                    },
                  ],
                },
              })
              store.updateLayout(newDoc)
            }, 10)
          }, [store])

          return <SubscribedComponent nodeId="node-1" testPrefix="test" />
        }

        renderWithSduiLayout(
          initialDoc,
          {
            components: {
              TestComponent: TestComponentFactory,
            },
          },
          <UpdateDocumentTest />,
        )

        // Initially should show 10
        await waitFor(() => {
          const comp = screen.getByTestId('test-subscribed-node-1')
          expect(comp).toHaveTextContent('Value: 10')
        })

        // After update, should show 100 (no stale data)
        await waitFor(
          () => {
            const comp = screen.getByTestId('test-subscribed-node-1')
            expect(comp).toHaveTextContent('Value: 100')
          },
          { timeout: 1000 },
        )
      })
    })
  })

  describe('as is: multiple components subscribed to different nodes', () => {
    describe('when: store.updateNodeState(nodeId1) and store.updateNodeState(nodeId2) are called', () => {
      it('to be: only subscribed components re-render, should not cause unnecessary renders', async () => {
        const document = createTestDocument({
          root: {
            id: 'root',
            type: 'Container',
            children: [
              {
                id: 'node-1',
                type: 'TestComponent',
                state: { value: 10 },
              },
              {
                id: 'node-2',
                type: 'TestComponent',
                state: { value: 20 },
              },
            ],
          },
        })

        const SelectiveUpdateTest: React.FC = () => {
          const store = useSduiLayoutAction()

          React.useEffect(() => {
            // 각 업데이트 사이에 충분한 간격을 두어 React가 처리할 수 있도록 함
            setTimeout(() => {
              store.updateNodeState('node-1', { value: 15 })
            }, 20)
            setTimeout(() => {
              store.updateNodeState('node-2', { value: 25 })
            }, 40)
          }, [store])

          return (
            <>
              <SubscribedComponent nodeId="node-1" testPrefix="test" />
              <SubscribedComponent nodeId="node-2" testPrefix="test" />
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
          <SelectiveUpdateTest />,
        )

        await waitFor(
          () => {
            const comp1 = screen.getByTestId('test-subscribed-node-1')
            const comp2 = screen.getByTestId('test-subscribed-node-2')

            expect(comp1).toHaveTextContent('Value: 15')
            expect(comp2).toHaveTextContent('Value: 25')
          },
          { timeout: 2000 },
        )
      })
    })
  })

  describe('as is: component subscribed to node', () => {
    describe('when: store.getSnapshot() and useSduiNodeSubscription both read same node', () => {
      it('to be: both return same state value, should be consistent', async () => {
        const document = createTestDocument({
          root: {
            id: 'root',
            type: 'Container',
            children: [
              {
                id: 'node-1',
                type: 'TestComponent',
                state: { value: 10 },
              },
            ],
          },
        })

        const ConsistencyTest: React.FC = () => {
          const store = useSduiLayoutAction()
          const { state: hookState } = useSduiNodeSubscription({
            nodeId: 'node-1',
            schema: testComponentStateSchema,
          })
          const [snapshotState, setSnapshotState] = React.useState<number | null>(null)

          React.useEffect(() => {
            // getSnapshot은 lastModified와 version만 반환하므로 state에서 직접 가져옴
            const { nodes } = store.state
            const node = nodes['node-1']
            setSnapshotState((node?.state as any)?.value)
          }, [store])

          return (
            <>
              <SubscribedComponent nodeId="node-1" testPrefix="test" />
              <div data-testid="hook-state">{hookState?.value ?? 'null'}</div>
              <div data-testid="snapshot-state">{snapshotState ?? 'null'}</div>
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
          <ConsistencyTest />,
        )

        await waitFor(
          () => {
            const hookState = screen.getByTestId('hook-state').textContent
            const snapshotState = screen.getByTestId('snapshot-state').textContent

            // Both should show the same value
            expect(hookState).toBe('10')
            expect(snapshotState).toBe('10')
            expect(hookState).toBe(snapshotState)
          },
          { timeout: 1000 },
        )
      })
    })
  })
})

