import type { SduiDocumentContent } from '@lodado/sdui-document'
import React from 'react'

import { numberedListOrdinals } from '../editor/blockContent'
import { createDocContentStore, DocumentContentProvider } from '../editor/DocumentContentContext'
import { ViewerBlockNode } from './ViewerBlockNode'

export interface SduiDocumentViewerProps {
  content: SduiDocumentContent
  className?: string
  /**
   * Visual theme, rendered as `data-sdui-doc-theme` on the root. Defaults to
   * 'swiss'; pass 'notion' for the base Notion-like look.
   */
  theme?: 'swiss' | 'notion' | (string & {})
}

/**
 * Read-only document renderer with visual parity to `SduiDocumentEditor`'s
 * readOnly mode, but with no ProseMirror/dnd-kit in its import graph — import
 * it from `@lodado/sdui-document-react/viewer` to keep editor code out of the
 * bundle (published pages, SSR).
 *
 * `data-sdui-document-editor` is load-bearing: every rule in the src/styles
 * stylesheets is scoped under it.
 */
export const SduiDocumentViewer = ({ content, className, theme = 'swiss' }: SduiDocumentViewerProps) => {
  const docStoreRef = React.useRef<ReturnType<typeof createDocContentStore> | null>(null)
  docStoreRef.current ??= createDocContentStore(content)

  React.useEffect(() => {
    docStoreRef.current?.setSnapshot(content)
  }, [content])

  const children = content.root.children ?? []
  const ordinals = numberedListOrdinals(children)

  return (
    <DocumentContentProvider value={docStoreRef.current}>
      <div className={className} data-sdui-document-editor data-sdui-document-viewer data-sdui-doc-theme={theme}>
        {children.map((child) => (
          <ViewerBlockNode key={child.id} block={child} depth={1} listOrdinal={ordinals.get(child.id)} />
        ))}
      </div>
    </DocumentContentProvider>
  )
}
