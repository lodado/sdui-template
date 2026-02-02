/**
 * Scenario Test: Timestamp Snapshot Tracking
 *
 * Tests for timestamp-based snapshot tracking and comparison
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

// Component that displays timestamp
const TimestampDisplayComponent: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const store = useSduiLayoutAction()
  const lastModified = store.getSnapshot()
  const timestamp = lastModified[nodeId]

  return (
    <div data-testid={`timestamp-${nodeId}`}>
      <div>Timestamp: {timestamp || 'undefined'}</div>
    </div>
  )
}

// Component that subscribes to a node
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

describe('Timestamp Snapshot Tracking', () => {
  describe('as is: document loaded with initial nodes', () => {
    describe('when: store.updateNodeState(nodeId, newState) is called', () => {
      it('to be: lastModified timestamp for that node is updated, should reflect current time', async () => {
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

        const UpdateTest: React.FC = () => {
          const store = useSduiLayoutAction()
          const [initialTimestamp, setInitialTimestamp] = React.useState<string | undefined>(undefined)
          const [updatedTimestamp, setUpdatedTimestamp] = React.useState<string | undefined>(undefined)

          React.useEffect(() => {
            // Get initial timestamp
            const lastModified = store.getSnapshot()
            const initial = lastModified['node-1']
            setInitialTimestamp(initial)

            // Wait a bit, then update
            setTimeout(() => {
              store.updateNodeState('node-1', { value: 15 })
              const updatedLastModified = store.getSnapshot()
              const updated = updatedLastModified['node-1']
              setUpdatedTimestamp(updated)
            }, 10)
          }, [store])

          return (
            <>
              <TimestampDisplayComponent nodeId="node-1" />
              <div data-testid="initial-timestamp">{initialTimestamp || 'undefined'}</div>
              <div data-testid="updated-timestamp">{updatedTimestamp || 'undefined'}</div>
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

        await waitFor(
          () => {
            const initialEl = screen.getByTestId('initial-timestamp')
            const updatedEl = screen.getByTestId('updated-timestamp')

            expect(initialEl.textContent).not.toBe('undefined')
            expect(updatedEl.textContent).not.toBe('undefined')
            expect(updatedEl.textContent).not.toBe(initialEl.textContent)
          },
          { timeout: 1000 },
        )
      })
    })
  })

  describe('as is: document loaded with multiple nodes', () => {
    describe('when: store.updateNodeAttributes(nodeId1, attributes) is called', () => {
      it('to be: only nodeId1 timestamp is updated, nodeId2 timestamp remains unchanged', async () => {
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

        const UpdateTest: React.FC = () => {
          const store = useSduiLayoutAction()
          const [node1Initial, setNode1Initial] = React.useState<string | undefined>(undefined)
          const [node2Initial, setNode2Initial] = React.useState<string | undefined>(undefined)
          const [node1After, setNode1After] = React.useState<string | undefined>(undefined)
          const [node2After, setNode2After] = React.useState<string | undefined>(undefined)

          React.useEffect(() => {
            const lastModified = store.getSnapshot()
            setNode1Initial(lastModified['node-1'])
            setNode2Initial(lastModified['node-2'])

            setTimeout(() => {
              store.updateNodeAttributes('node-1', { disabled: true })
              const updatedLastModified = store.getSnapshot()
              setNode1After(updatedLastModified['node-1'])
              setNode2After(updatedLastModified['node-2'])
            }, 10)
          }, [store])

          return (
            <>
              <div data-testid="node1-initial">{node1Initial || 'undefined'}</div>
              <div data-testid="node2-initial">{node2Initial || 'undefined'}</div>
              <div data-testid="node1-after">{node1After || 'undefined'}</div>
              <div data-testid="node2-after">{node2After || 'undefined'}</div>
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

        await waitFor(
          () => {
            const node1Initial = screen.getByTestId('node1-initial').textContent
            const node2Initial = screen.getByTestId('node2-initial').textContent
            const node1After = screen.getByTestId('node1-after').textContent
            const node2After = screen.getByTestId('node2-after').textContent

            // Both should have initial timestamps
            expect(node1Initial).not.toBe('undefined')
            expect(node2Initial).not.toBe('undefined')

            // After update, node1 should change, node2 should stay the same
            expect(node1After).not.toBe('undefined')
            expect(node1After).not.toBe(node1Initial)
            expect(node2After).toBe(node2Initial)
          },
          { timeout: 1000 },
        )
      })
    })
  })

  describe('as is: document loaded', () => {
    describe('when: store.updateNodeReference(nodeId, reference) is called', () => {
      it('to be: lastModified timestamp for that node is updated', async () => {
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

        const UpdateTest: React.FC = () => {
          const store = useSduiLayoutAction()
          const [initialTimestamp, setInitialTimestamp] = React.useState<string | undefined>(undefined)
          const [updatedTimestamp, setUpdatedTimestamp] = React.useState<string | undefined>(undefined)

          React.useEffect(() => {
            const lastModified = store.getSnapshot()
            setInitialTimestamp(lastModified['node-1'])

            setTimeout(() => {
              store.updateNodeReference('node-1', 'ref-node')
              const updatedLastModified = store.getSnapshot()
              setUpdatedTimestamp(updatedLastModified['node-1'])
            }, 10)
          }, [store])

          return (
            <>
              <div data-testid="initial">{initialTimestamp || 'undefined'}</div>
              <div data-testid="updated">{updatedTimestamp || 'undefined'}</div>
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

        await waitFor(
          () => {
            const initial = screen.getByTestId('initial').textContent
            const updated = screen.getByTestId('updated').textContent

            expect(initial).not.toBe('undefined')
            expect(updated).not.toBe('undefined')
            expect(updated).not.toBe(initial)
          },
          { timeout: 1000 },
        )
      })
    })
  })

  describe('as is: document loaded with nodes', () => {
    describe('when: store.updateLayout(newDocument) is called', () => {
      it('to be: all nodes in new document get updated timestamps', async () => {
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

        const UpdateTest: React.FC = () => {
          const store = useSduiLayoutAction()
          const [initialTimestamp, setInitialTimestamp] = React.useState<string | undefined>(undefined)
          const [updatedTimestamp, setUpdatedTimestamp] = React.useState<string | undefined>(undefined)

          React.useEffect(() => {
            const lastModified = store.getSnapshot()
            setInitialTimestamp(lastModified['node-1'])

            setTimeout(() => {
              const newDoc = createTestDocument({
                root: {
                  id: 'root',
                  type: 'Container',
                  children: [
                    {
                      id: 'node-1',
                      type: 'TestComponent',
                      state: { value: 20 },
                    },
                    {
                      id: 'node-2',
                      type: 'TestComponent',
                      state: { value: 30 },
                    },
                  ],
                },
              })
              store.updateLayout(newDoc)
              const updatedLastModified = store.getSnapshot()
              setUpdatedTimestamp(updatedLastModified['node-1'])
            }, 10)
          }, [store])

          return (
            <>
              <div data-testid="initial">{initialTimestamp || 'undefined'}</div>
              <div data-testid="updated">{updatedTimestamp || 'undefined'}</div>
            </>
          )
        }

        renderWithSduiLayout(
          initialDoc,
          {
            components: {
              TestComponent: TestComponentFactory,
            },
          },
          <UpdateTest />,
        )

        await waitFor(
          () => {
            const initial = screen.getByTestId('initial').textContent
            const updated = screen.getByTestId('updated').textContent

            expect(initial).not.toBe('undefined')
            expect(updated).not.toBe('undefined')
            expect(updated).not.toBe(initial)
          },
          { timeout: 1000 },
        )
      })
    })
  })

  describe('as is: snapshot with timestamp', () => {
    describe('when: getSnapshot() is called multiple times without updates', () => {
      it('to be: timestamps remain the same, should not change', () => {
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

        const SnapshotTest: React.FC = () => {
          const store = useSduiLayoutAction()
          const [snapshot1, setSnapshot1] = React.useState<string | undefined>(undefined)
          const [snapshot2, setSnapshot2] = React.useState<string | undefined>(undefined)

          React.useEffect(() => {
            const s1 = store.getSnapshot()
            setSnapshot1(s1['node-1'])

            // Get snapshot again immediately
            const s2 = store.getSnapshot()
            setSnapshot2(s2['node-1'])
          }, [store])

          return (
            <>
              <div data-testid="snapshot1">{snapshot1 || 'undefined'}</div>
              <div data-testid="snapshot2">{snapshot2 || 'undefined'}</div>
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
          <SnapshotTest />,
        )

        const snapshot1 = screen.getByTestId('snapshot1').textContent
        const snapshot2 = screen.getByTestId('snapshot2').textContent

        expect(snapshot1).not.toBe('undefined')
        expect(snapshot2).not.toBe('undefined')
        expect(snapshot1).toBe(snapshot2)
      })
    })
  })
})

