import type { SduiDocumentContent } from '@lodado/sdui-document'
import type { ComponentFactory } from '@lodado/sdui-template'
import { useSduiNodeSubscription } from '@lodado/sdui-template'
import React from 'react'

import { SduiDocumentViewer } from '../viewer/SduiDocumentViewer'

// Reverse of document.sdui: a document rendered as an SDUI layout node, so an
// SDUI-driven page (page builder: SDUI shell, document body) can host
// read-only document regions. The node's `state.content` holds the
// SduiDocumentContent; changes to it re-render the (controlled) viewer.

function nodeContent(state: Record<string, unknown>): SduiDocumentContent | null {
  const content = state.content as SduiDocumentContent | undefined

  return content && typeof content === 'object' && 'root' in content ? content : null
}

const DocumentViewerNode = ({ nodeId }: { nodeId: string }) => {
  const { state } = useSduiNodeSubscription({ nodeId })
  const content = nodeContent(state)

  if (!content) {
    return <div className="sdui-document-node sdui-document-node--empty">No document content</div>
  }

  return <SduiDocumentViewer content={content} />
}

/**
 * Component factory for a read-only document region inside an SDUI layout.
 * Register it in the layout renderer's component map, e.g. `{ Document: documentViewerComponent }`.
 */
export const documentViewerComponent: ComponentFactory = (id) => <DocumentViewerNode nodeId={id} />
