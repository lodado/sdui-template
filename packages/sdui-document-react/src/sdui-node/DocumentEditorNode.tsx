import type { SduiDocumentContent } from '@lodado/sdui-document'
import type { ComponentFactory } from '@lodado/sdui-template'
import { useSduiLayoutAction, useSduiNodeSubscription } from '@lodado/sdui-template'
import React from 'react'

import { SduiDocumentEditor } from '../editor/SduiDocumentEditor'

// Editable reverse of document.sdui: an editable document region inside an SDUI
// layout (page builder: SDUI shell owns sidebar/header, this node owns an
// editable body). Pulls the editor bundle, so this lives in the main entry
// only — the /viewer subpath exports documentViewerComponent instead.

function nodeContent(state: Record<string, unknown>): SduiDocumentContent | null {
  const content = state.content as SduiDocumentContent | undefined

  return content && typeof content === 'object' && 'root' in content ? content : null
}

const DocumentEditorNode = ({ nodeId }: { nodeId: string }) => {
  const store = useSduiLayoutAction()
  const { state } = useSduiNodeSubscription({ nodeId })
  const content = nodeContent(state)

  if (!content) {
    return <div className="sdui-document-node sdui-document-node--empty">No document content</div>
  }

  // Editor is uncontrolled (content seeds initial state); it owns the region
  // after mount and pushes edits back to the store, which stays the source of
  // truth for readers/persistence. External store.content writes are not
  // re-seeded — acceptable for a page-builder body region.
  return (
    <SduiDocumentEditor
      content={content}
      readOnly={state.readOnly === true}
      onContentChange={(next) => store.updateNodeState(nodeId, { content: next })}
    />
  )
}

/**
 * Component factory for an editable document region inside an SDUI layout.
 * Register it in the layout renderer's component map, e.g. `{ Document: documentEditorComponent }`.
 */
export const documentEditorComponent: ComponentFactory = (id) => <DocumentEditorNode nodeId={id} />
