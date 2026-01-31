import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { SduiLayoutRenderer, useRenderNode, useSduiLayoutAction, useSduiNodeSubscription } from '@lodado/sdui-template'
import { render, screen, waitFor } from '@testing-library/react'
import React, { useEffect } from 'react'

import { ProseMirrorRenderer } from '../prosemirror/ProseMirrorRenderer'
import { createProseMirrorDoc } from '../prosemirror/schema'

const Container = ({ id }: { id: string }) => {
  const { childrenIds, attributes } = useSduiNodeSubscription({ nodeId: id })
  const { renderChildren } = useRenderNode({ nodeId: id })
  const className = typeof attributes?.className === 'string' ? attributes.className : undefined

  return <div className={className}>{renderChildren(childrenIds)}</div>
}

const Updater = ({ targetId, nextDoc }: { targetId: string; nextDoc: Record<string, unknown> }) => {
  const store = useSduiLayoutAction()

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      store.updateNodeState(targetId, { doc: nextDoc })
    }, 50)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [nextDoc, store, targetId])

  return null
}

describe('ProseMirrorRenderer', () => {
  it('renders initial content and updates when SDUI state changes', async () => {
    const initialDoc = createProseMirrorDoc('Hello ProseMirror')
    const updatedDoc = createProseMirrorDoc('Updated Content')

    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Container',
        attributes: {
          className: 'p-2',
        },
        children: [
          {
            id: 'editor-1',
            type: 'ProseMirrorRenderer',
            state: {
              doc: initialDoc,
              editable: false,
            },
          },
          {
            id: 'updater-1',
            type: 'Updater',
            state: {
              targetId: 'editor-1',
              nextDoc: updatedDoc,
            },
          },
        ],
      },
    }

    const components = {
      Container: (id: string) => <Container id={id} />,
      ProseMirrorRenderer: (id: string) => <ProseMirrorRenderer id={id} />,
      Updater: (id: string) => {
        const { state } = useSduiNodeSubscription({ nodeId: id }) as {
          state?: { targetId?: string; nextDoc?: Record<string, unknown> }
        }

        if (!state?.targetId || !state.nextDoc) {
          return null
        }

        return <Updater targetId={state.targetId} nextDoc={state.nextDoc} />
      },
    }

    render(<SduiLayoutRenderer document={document} components={components} />)

    await waitFor(() => {
      expect(screen.getByText('Hello ProseMirror')).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByText('Updated Content')).toBeInTheDocument()
    })
  })
})
