import type { SduiDocumentContent } from '@lodado/sdui-document'
import * as Dialog from '@radix-ui/react-dialog'
import React from 'react'

import { SduiDocumentEditor } from '../editor/SduiDocumentEditor'
import { useResolvedDocument, useSduiPage } from './SduiPageContext'

export type SduiPeekMode = 'side' | 'center'

export type SduiPeekDialogProps = {
  /** Target document to preview; null renders nothing. */
  documentId: string | null
  onClose(): void
  /**
   * Notion peek grammar: 'side' (default) slides a panel in from the right and
   * keeps the page behind visible; 'center' is a dimmed modal.
   */
  mode?: SduiPeekMode
  /** Render the peeked document read-only. Default false — like Notion, the peek is a full editor. */
  readOnly?: boolean
  /** Edits made inside the peek (documentId + next content) — wire to the host repository to persist. */
  onContentChange?(documentId: string, next: SduiDocumentContent): void
  className?: string
}

/**
 * Notion-style peek: hosts the target document in a dialog as a full,
 * independent editor instance (drag & drop, slash menu — everything), like an
 * iframe of another page. Content is refetched on every open (refresh) so
 * edits made elsewhere show up.
 */
export const SduiPeekDialog = ({
  documentId,
  onClose,
  mode = 'side',
  readOnly = false,
  onContentChange,
  className,
}: SduiPeekDialogProps) => {
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
        <Dialog.Overlay className="sdui-doc-peek-overlay" data-mode={mode} />
        <Dialog.Content className={className ?? 'sdui-doc-peek-content'} data-mode={mode} aria-describedby={undefined}>
          <div className="sdui-doc-peek-toolbar">
            <button
              type="button"
              className="sdui-doc-peek-open-full"
              onClick={openFull}
              aria-label="Open as full page"
              title="Open as full page"
            >
              ⤢
            </button>
            <Dialog.Close asChild>
              <button type="button" className="sdui-doc-peek-close" aria-label="Close preview" title="Close">
                ✕
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Title className="sdui-doc-peek-title">
            {resolved.status === 'ready' ? resolved.document.title : 'Preview'}
          </Dialog.Title>
          <div className="sdui-doc-peek-body">
            {resolved.status === 'loading' && (
              <div className="sdui-doc-peek-skeleton" aria-hidden>
                <span />
                <span />
                <span />
              </div>
            )}
            {resolved.status === 'missing' && <p className="sdui-doc-peek-status">Page not found.</p>}
            {resolved.status === 'error' && <p className="sdui-doc-peek-status">Failed to load this page.</p>}
            {resolved.status === 'ready' && (
              <SduiDocumentEditor
                key={documentId}
                content={resolved.document.content}
                readOnly={readOnly}
                onContentChange={onContentChange ? (next) => onContentChange(documentId, next) : undefined}
              />
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
