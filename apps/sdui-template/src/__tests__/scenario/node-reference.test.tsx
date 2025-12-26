/**
 * Scenario Test: Node Reference
 *
 * Tests for node reference functionality
 */

import { render, screen } from '@testing-library/react'
import React from 'react'

import type { ComponentFactory } from '../../components/types'
import { SduiLayoutRenderer } from '../../react-wrapper/components/SduiLayoutRenderer'
import { useSduiLayoutAction, useSduiNodeReference, useSduiNodeSubscription } from '../../react-wrapper/hooks'
import { createTestDocument, renderWithSduiLayout } from '../utils/test-utils'

describe('Node Reference', () => {
  describe('as is: document with node having single reference', () => {
    describe('when: node has reference="target-node-id"', () => {
      it('to be: reference accessible via useSduiNodeSubscription', () => {
        const document = createTestDocument({
          root: {
            id: 'root',
            type: 'Container',
            children: [
              {
                id: 'source-node',
                type: 'Card',
                reference: 'target-node-id',
              },
              {
                id: 'target-node-id',
                type: 'Card',
                state: {
                  title: 'Target Node',
                },
              },
            ],
          },
        })

        const ReferenceTestComponent: React.FC<{ nodeId: string }> = ({ nodeId }) => {
          const { reference } = useSduiNodeSubscription({ nodeId })

          return (
            <div data-testid={`node-${nodeId}`}>
              {reference && (
                <div data-testid={`reference-${nodeId}`}>
                  Reference: {typeof reference === 'string' ? reference : reference.join(', ')}
                </div>
              )}
            </div>
          )
        }

        const componentFactory: ComponentFactory = (id) => {
          if (id === 'source-node' || id === 'target-node-id') {
            return <ReferenceTestComponent nodeId={id} />
          }
          return <div data-testid={`default-${id}`}>Default</div>
        }

        render(<SduiLayoutRenderer document={document} components={{ Card: componentFactory }} />)

        expect(screen.getByTestId('node-source-node')).toBeInTheDocument()
        expect(screen.getByTestId('reference-source-node')).toBeInTheDocument()
        expect(screen.getByText(/Reference: target-node-id/i)).toBeInTheDocument()
      })

      it('to be: reference accessible via store.getReferenceById', () => {
        const document = createTestDocument({
          root: {
            id: 'root',
            type: 'Container',
            children: [
              {
                id: 'source-node',
                type: 'Card',
                reference: 'target-node-id',
              },
            ],
          },
        })

        const StoreTestComponent: React.FC = () => {
          const store = useSduiLayoutAction()
          const [reference, setReference] = React.useState<string | string[] | undefined>()

          React.useEffect(() => {
            try {
              const ref = store.getReferenceById('source-node')
              setReference(ref)
            } catch (e) {
              // Ignore errors
            }
          }, [store])

          return (
            <div data-testid="store-test">
              {reference && <div data-testid="reference-value">{String(reference)}</div>}
            </div>
          )
        }

        renderWithSduiLayout(document, {}, <StoreTestComponent />)

        expect(screen.getByTestId('store-test')).toBeInTheDocument()
        expect(screen.getByTestId('reference-value')).toBeInTheDocument()
        expect(screen.getByText('target-node-id')).toBeInTheDocument()
      })
    })
  })

  describe('as is: document with node having multiple references', () => {
    describe('when: node has reference=["ref-1", "ref-2"]', () => {
      it('to be: multiple references accessible as array', () => {
        const document = createTestDocument({
          root: {
            id: 'root',
            type: 'Container',
            children: [
              {
                id: 'source-node',
                type: 'Card',
                reference: ['ref-1', 'ref-2'],
              },
            ],
          },
        })

        const ReferenceTestComponent: React.FC<{ nodeId: string }> = ({ nodeId }) => {
          const { reference } = useSduiNodeSubscription({ nodeId })

          return (
            <div data-testid={`node-${nodeId}`}>
              {reference && (
                <div data-testid={`reference-${nodeId}`}>
                  {Array.isArray(reference) ? (
                    <div>
                      {reference.map((ref) => (
                        <span key={ref} data-testid={`ref-item-${ref}`}>
                          {ref}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div>{reference}</div>
                  )}
                </div>
              )}
            </div>
          )
        }

        const componentFactory: ComponentFactory = (id) => {
          if (id === 'source-node') {
            return <ReferenceTestComponent nodeId={id} />
          }
          return <div data-testid={`default-${id}`}>Default</div>
        }

        render(<SduiLayoutRenderer document={document} components={{ Card: componentFactory }} />)

        expect(screen.getByTestId('node-source-node')).toBeInTheDocument()
        expect(screen.getByTestId('reference-source-node')).toBeInTheDocument()
        expect(screen.getByTestId('ref-item-ref-1')).toHaveTextContent('ref-1')
        expect(screen.getByTestId('ref-item-ref-2')).toHaveTextContent('ref-2')
      })
    })
  })

  describe('as is: document with node without reference', () => {
    describe('when: node has no reference field', () => {
      it('to be: reference is undefined', () => {
        const document = createTestDocument({
          root: {
            id: 'root',
            type: 'Container',
            children: [
              {
                id: 'no-ref-node',
                type: 'Card',
              },
            ],
          },
        })

        const ReferenceTestComponent: React.FC<{ nodeId: string }> = ({ nodeId }) => {
          const { reference } = useSduiNodeSubscription({ nodeId })

          return (
            <div data-testid={`node-${nodeId}`}>
              {reference === undefined && <div data-testid={`no-reference-${nodeId}`}>No reference</div>}
            </div>
          )
        }

        const componentFactory: ComponentFactory = (id) => {
          if (id === 'no-ref-node') {
            return <ReferenceTestComponent nodeId={id} />
          }
          return <div data-testid={`default-${id}`}>Default</div>
        }

        render(<SduiLayoutRenderer document={document} components={{ Card: componentFactory }} />)

        expect(screen.getByTestId('node-no-ref-node')).toBeInTheDocument()
        expect(screen.getByTestId('no-reference-no-ref-node')).toBeInTheDocument()
      })
    })
  })

  describe('as is: using reference to access other node state', () => {
    describe('when: node references another node and accesses its state', () => {
      it('to be: can access referenced node state via store', () => {
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
                  title: 'Target Title',
                  count: 42,
                },
              },
            ],
          },
        })

        const ReferenceAccessComponent: React.FC<{ nodeId: string }> = ({ nodeId }) => {
          const { reference } = useSduiNodeSubscription({ nodeId })
          const store = useSduiLayoutAction()
          const [targetState, setTargetState] = React.useState<Record<string, unknown> | null>(null)

          React.useEffect(() => {
            if (reference) {
              const refId = Array.isArray(reference) ? reference[0] : reference
              try {
                const state = store.getLayoutStateById(refId)
                setTargetState(state)
              } catch (e) {
                // Ignore errors
              }
            }
          }, [reference, store])

          return (
            <div data-testid={`node-${nodeId}`}>
              {targetState && (
                <div data-testid={`target-state-${nodeId}`}>
                  Title: {String(targetState.title)}, Count: {String(targetState.count)}
                </div>
              )}
            </div>
          )
        }

        const componentFactory: ComponentFactory = (id) => {
          if (id === 'source-node') {
            return <ReferenceAccessComponent nodeId={id} />
          }
          return <div data-testid={`default-${id}`}>Default</div>
        }

        render(<SduiLayoutRenderer document={document} components={{ Card: componentFactory }} />)

        expect(screen.getByTestId('node-source-node')).toBeInTheDocument()
        expect(screen.getByTestId('target-state-source-node')).toBeInTheDocument()
        expect(screen.getByText(/Title: Target Title/i)).toBeInTheDocument()
        expect(screen.getByText(/Count: 42/i)).toBeInTheDocument()
      })

      it('to be: can access referenced node state via useSduiNodeReference hook', () => {
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
                  title: 'Target Title',
                  count: 42,
                },
              },
            ],
          },
        })

        const ReferenceHookComponent: React.FC<{ nodeId: string }> = ({ nodeId }) => {
          const { referencedNodes, hasReference } = useSduiNodeReference({ nodeId })

          return (
            <div data-testid={`node-${nodeId}`}>
              {hasReference && referencedNodes.length > 0 && (
                <div data-testid={`referenced-info-${nodeId}`}>
                  {referencedNodes.map((refNode) => (
                    <div key={refNode.id} data-testid={`ref-node-${refNode.id}`}>
                      Title: {String(refNode.state.title)}, Count: {String(refNode.state.count)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        }

        const componentFactory: ComponentFactory = (id) => {
          if (id === 'source-node') {
            return <ReferenceHookComponent nodeId={id} />
          }
          return <div data-testid={`default-${id}`}>Default</div>
        }

        render(<SduiLayoutRenderer document={document} components={{ Card: componentFactory }} />)

        expect(screen.getByTestId('node-source-node')).toBeInTheDocument()
        expect(screen.getByTestId('referenced-info-source-node')).toBeInTheDocument()
        expect(screen.getByTestId('ref-node-target-node')).toBeInTheDocument()
        expect(screen.getByText(/Title: Target Title/i)).toBeInTheDocument()
        expect(screen.getByText(/Count: 42/i)).toBeInTheDocument()
      })

      it('to be: can access multiple referenced nodes via useSduiNodeReference hook', () => {
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
                  title: 'Target 1',
                  count: 10,
                },
              },
              {
                id: 'target-2',
                type: 'Card',
                state: {
                  title: 'Target 2',
                  count: 20,
                },
              },
            ],
          },
        })

        const MultipleReferenceComponent: React.FC<{ nodeId: string }> = ({ nodeId }) => {
          const { referencedNodes, hasReference } = useSduiNodeReference({ nodeId })

          return (
            <div data-testid={`node-${nodeId}`}>
              {hasReference && (
                <div data-testid={`referenced-list-${nodeId}`}>
                  {referencedNodes.map((refNode) => (
                    <div key={refNode.id} data-testid={`ref-item-${refNode.id}`}>
                      {String(refNode.state.title)}: {String(refNode.state.count)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        }

        const componentFactory: ComponentFactory = (id) => {
          if (id === 'source-node') {
            return <MultipleReferenceComponent nodeId={id} />
          }
          return <div data-testid={`default-${id}`}>Default</div>
        }

        render(<SduiLayoutRenderer document={document} components={{ Card: componentFactory }} />)

        expect(screen.getByTestId('node-source-node')).toBeInTheDocument()
        expect(screen.getByTestId('referenced-list-source-node')).toBeInTheDocument()
        expect(screen.getByTestId('ref-item-target-1')).toHaveTextContent('Target 1: 10')
        expect(screen.getByTestId('ref-item-target-2')).toHaveTextContent('Target 2: 20')
      })

      it('to be: can access referenced nodes by ID using referencedNodesMap', () => {
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
                  title: 'Target 1',
                  count: 10,
                },
              },
              {
                id: 'target-2',
                type: 'Card',
                state: {
                  title: 'Target 2',
                  count: 20,
                },
              },
            ],
          },
        })

        const MapAccessComponent: React.FC<{ nodeId: string }> = ({ nodeId }) => {
          const { referencedNodesMap, hasReference } = useSduiNodeReference({ nodeId })

          return (
            <div data-testid={`node-${nodeId}`}>
              {hasReference && (
                <div data-testid={`map-access-${nodeId}`}>
                  {referencedNodesMap['target-1'] && (
                    <div data-testid="target-1-from-map">
                      {String(referencedNodesMap['target-1'].state.title)}:{' '}
                      {String(referencedNodesMap['target-1'].state.count)}
                    </div>
                  )}
                  {referencedNodesMap['target-2'] && (
                    <div data-testid="target-2-from-map">
                      {String(referencedNodesMap['target-2'].state.title)}:{' '}
                      {String(referencedNodesMap['target-2'].state.count)}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        }

        const componentFactory: ComponentFactory = (id) => {
          if (id === 'source-node') {
            return <MapAccessComponent nodeId={id} />
          }
          return <div data-testid={`default-${id}`}>Default</div>
        }

        render(<SduiLayoutRenderer document={document} components={{ Card: componentFactory }} />)

        expect(screen.getByTestId('node-source-node')).toBeInTheDocument()
        expect(screen.getByTestId('map-access-source-node')).toBeInTheDocument()
        expect(screen.getByTestId('target-1-from-map')).toHaveTextContent('Target 1: 10')
        expect(screen.getByTestId('target-2-from-map')).toHaveTextContent('Target 2: 20')
      })
    })
  })

  describe('as is: updating node reference', () => {
    describe('when: updating reference via store.updateNodeReference', () => {
      it('to be: reference updated correctly', () => {
        const document = createTestDocument({
          root: {
            id: 'root',
            type: 'Container',
            children: [
              {
                id: 'source-node',
                type: 'Card',
                reference: 'target-1',
              },
              {
                id: 'target-1',
                type: 'Card',
                state: { count: 10 },
              },
              {
                id: 'target-2',
                type: 'Card',
                state: { count: 20 },
              },
            ],
          },
        })

        const UpdateReferenceComponent: React.FC = () => {
          const store = useSduiLayoutAction()
          const [reference, setReference] = React.useState<string | string[] | undefined>()

          React.useEffect(() => {
            // 초기 reference 가져오기
            const initialRef = store.getReferenceById('source-node')
            setReference(initialRef)

            // reference 업데이트
            store.updateNodeReference('source-node', 'target-2')
            const updatedRef = store.getReferenceById('source-node')
            setReference(updatedRef)
          }, [store])

          return (
            <div data-testid="update-reference-test">
              {reference && (
                <div data-testid="reference-value">
                  {typeof reference === 'string' ? reference : reference.join(', ')}
                </div>
              )}
            </div>
          )
        }

        renderWithSduiLayout(document, {}, <UpdateReferenceComponent />)

        expect(screen.getByTestId('update-reference-test')).toBeInTheDocument()
        expect(screen.getByTestId('reference-value')).toBeInTheDocument()
        expect(screen.getByText('target-2')).toBeInTheDocument()
      })

      it('to be: can update to multiple references', () => {
        const document = createTestDocument({
          root: {
            id: 'root',
            type: 'Container',
            children: [
              {
                id: 'source-node',
                type: 'Card',
              },
              {
                id: 'target-1',
                type: 'Card',
                state: { count: 10 },
              },
              {
                id: 'target-2',
                type: 'Card',
                state: { count: 20 },
              },
            ],
          },
        })

        const UpdateMultipleReferenceComponent: React.FC = () => {
          const store = useSduiLayoutAction()
          const [reference, setReference] = React.useState<string | string[] | undefined>()

          React.useEffect(() => {
            // 여러 reference로 업데이트
            store.updateNodeReference('source-node', ['target-1', 'target-2'])
            const updatedRef = store.getReferenceById('source-node')
            setReference(updatedRef)
          }, [store])

          return (
            <div data-testid="update-multiple-reference-test">
              {reference && Array.isArray(reference) && (
                <div data-testid="reference-list">
                  {reference.map((ref) => (
                    <span key={ref} data-testid={`ref-${ref}`}>
                      {ref}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        }

        renderWithSduiLayout(document, {}, <UpdateMultipleReferenceComponent />)

        expect(screen.getByTestId('update-multiple-reference-test')).toBeInTheDocument()
        expect(screen.getByTestId('ref-target-1')).toBeInTheDocument()
        expect(screen.getByTestId('ref-target-2')).toBeInTheDocument()
      })

      it('to be: can remove reference by setting to undefined', () => {
        const document = createTestDocument({
          root: {
            id: 'root',
            type: 'Container',
            children: [
              {
                id: 'source-node',
                type: 'Card',
                reference: 'target-1',
              },
              {
                id: 'target-1',
                type: 'Card',
                state: { count: 10 },
              },
            ],
          },
        })

        const RemoveReferenceComponent: React.FC = () => {
          const store = useSduiLayoutAction()
          const [reference, setReference] = React.useState<string | string[] | undefined>()

          React.useEffect(() => {
            // reference 제거
            store.updateNodeReference('source-node', undefined)
            const updatedRef = store.getReferenceById('source-node')
            setReference(updatedRef)
          }, [store])

          return (
            <div data-testid="remove-reference-test">
              {reference === undefined && <div data-testid="no-reference">No reference</div>}
            </div>
          )
        }

        renderWithSduiLayout(document, {}, <RemoveReferenceComponent />)

        expect(screen.getByTestId('remove-reference-test')).toBeInTheDocument()
        expect(screen.getByTestId('no-reference')).toBeInTheDocument()
      })
    })
  })
})
