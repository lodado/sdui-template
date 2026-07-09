import type { SduiDocument, SduiDocumentContent } from '@lodado/sdui-document'
import React, { useCallback, useMemo, useRef, useState } from 'react'

import type { DocumentResolver, PageOpenMode, SduiDocumentNavigator, SduiPageContextValue } from './SduiPageContext'
import { SduiPageContext } from './SduiPageContext'
import type { SduiPeekMode } from './SduiPeekDialog'
import { SduiPeekDialog } from './SduiPeekDialog'

export type SduiPageProviderProps = {
  resolver: DocumentResolver
  navigator?: SduiDocumentNavigator
  /** What a plain click on a page block does. Default 'push'. */
  defaultOpenMode?: PageOpenMode
  /** Presentation of the built-in fallback peek dialog. Default 'side'. */
  peekMode?: SduiPeekMode
  /** Render the fallback peek read-only. Default false — the peek is a full editor. */
  peekReadOnly?: boolean
  /** Edits made inside the fallback peek — wire to the host repository to persist. */
  onPeekContentChange?(documentId: string, next: SduiDocumentContent): void
  children: React.ReactNode
}

/**
 * Headless page-navigation boundary: document resolution (cached), and
 * push/peek dispatch to the host navigator. When the host provides no `peek`,
 * the provider renders its own SduiPeekDialog as a fallback.
 */
export const SduiPageProvider = ({
  resolver,
  navigator,
  defaultOpenMode = 'push',
  peekMode = 'side',
  peekReadOnly = false,
  onPeekContentChange,
  children,
}: SduiPageProviderProps) => {
  const cacheRef = useRef(new Map<string, SduiDocument | 'missing'>())
  const inflightRef = useRef(new Map<string, Promise<SduiDocument | undefined>>())
  const [fallbackPeekId, setFallbackPeekId] = useState<string | null>(null)

  const resolverRef = useRef(resolver)
  resolverRef.current = resolver
  const navigatorRef = useRef(navigator)
  navigatorRef.current = navigator

  const resolve = useCallback(async (id: string, options?: { refresh?: boolean }) => {
    const cached = cacheRef.current.get(id)
    if (!options?.refresh && cached !== undefined) {
      return cached === 'missing' ? undefined : cached
    }

    const inflight = inflightRef.current.get(id)
    if (inflight) {
      return inflight
    }

    const request = resolverRef
      .current(id)
      .then((document) => {
        cacheRef.current.set(id, document ?? 'missing')
        return document
      })
      .finally(() => {
        inflightRef.current.delete(id)
      })
    inflightRef.current.set(id, request)
    return request
  }, [])

  const peekCache = useCallback((id: string) => {
    const cached = cacheRef.current.get(id)
    return cached === 'missing' ? undefined : cached
  }, [])

  const open = useCallback(
    (id: string, mode: PageOpenMode = defaultOpenMode) => {
      const nav = navigatorRef.current
      if (mode === 'push') {
        if (nav?.push) {
          nav.push(id)
        } else {
          // eslint-disable-next-line no-console
          console.warn('[sdui-document-react] navigator.push is not provided — page push ignored')
        }
        return
      }

      if (nav?.peek) {
        nav.peek(id)
      } else {
        setFallbackPeekId(id)
      }
    },
    [defaultOpenMode],
  )

  const value = useMemo<SduiPageContextValue>(
    () => ({ resolve, peekCache, open, defaultOpenMode }),
    [resolve, peekCache, open, defaultOpenMode],
  )

  return (
    <SduiPageContext.Provider value={value}>
      {children}
      {navigator?.peek ? null : (
        <SduiPeekDialog
          documentId={fallbackPeekId}
          mode={peekMode}
          readOnly={peekReadOnly}
          onContentChange={onPeekContentChange}
          onClose={() => setFallbackPeekId(null)}
        />
      )}
    </SduiPageContext.Provider>
  )
}
