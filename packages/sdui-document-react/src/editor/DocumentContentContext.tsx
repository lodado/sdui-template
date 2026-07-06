import type { SduiDocumentContent } from '@lodado/sdui-document'
import React, { useContext } from 'react'

/**
 * Live document content, exposed on its OWN context — separate from
 * EditorRuntimeContext so that content changes re-render only the blocks that
 * actually read the whole tree (e.g. the TOC), not every memoized block row.
 */
const DocumentContentContext = React.createContext<SduiDocumentContent | null>(null)

export const DocumentContentProvider = DocumentContentContext.Provider

/** Current document content, or null when rendered outside an editor. */
export function useDocumentContent(): SduiDocumentContent | null {
  return useContext(DocumentContentContext)
}
