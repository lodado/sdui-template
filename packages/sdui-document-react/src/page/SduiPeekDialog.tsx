import * as Dialog from '@radix-ui/react-dialog'
import React from 'react'

import { SduiDocumentEditor } from '../editor/SduiDocumentEditor'
import { useResolvedDocument, useSduiPage } from './SduiPageContext'

export type SduiPeekDialogProps = {
  /** Target document to preview; null renders nothing. */
  documentId: string | null
  onClose(): void
  className?: string
}

/**
 * Notion-style side peek: previews the target document read-only in a dialog.
 * Content is refetched on every open (refresh) so edits made elsewhere show up.
 */
export const SduiPeekDialog = ({ documentId, onClose, className }: SduiPeekDialogProps) => {
  const page = useSduiPage()
  const resolved = useResolvedDocument(documentId, { refresh: true })

  if (documentId === null) {
    return null
  }

  const openFull = () => {
    page?.open(documentId, 'push')
    onClose()
  }

  return (
    <Dialog.Root open onOpenChange={(next) => (next ? undefined : onClose())}>
      <Dialog.Portal>
        <Dialog.Overlay className="sdui-doc-peek-overlay" />
        <Dialog.Content className={className ?? 'sdui-doc-peek-content'} aria-describedby={undefined}>
          <div className="sdui-doc-peek-toolbar">
            <button type="button" className="sdui-doc-peek-open-full" onClick={openFull}>
              Open as full page
            </button>
            <Dialog.Close asChild>
              <button type="button" className="sdui-doc-peek-close" aria-label="Close preview">
                ✕
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Title className="sdui-doc-peek-title">
            {resolved.status === 'ready' ? resolved.document.title : 'Preview'}
          </Dialog.Title>
          <div className="sdui-doc-peek-body">
            {resolved.status === 'loading' && <p className="sdui-doc-peek-status">Loading…</p>}
            {resolved.status === 'missing' && <p className="sdui-doc-peek-status">Page not found.</p>}
            {resolved.status === 'error' && <p className="sdui-doc-peek-status">Failed to load this page.</p>}
            {resolved.status === 'ready' && (
              <SduiDocumentEditor key={documentId} content={resolved.document.content} readOnly />
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
