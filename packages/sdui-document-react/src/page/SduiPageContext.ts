import type { SduiDocument } from '@lodado/sdui-document'
import React, { useContext, useEffect, useState } from 'react'

/** Loads a referenced document by id — the host owns fetching/URL mapping. */
export type DocumentResolver = (id: string) => Promise<SduiDocument | undefined>

/**
 * Host-owned navigation. `push` maps the id to a full page transition
 * (e.g. Next.js router.push); `peek` opens a preview surface. Either may be
 * omitted — a missing `peek` falls back to the provider's built-in dialog.
 */
export type SduiDocumentNavigator = {
  push?(id: string): void
  peek?(id: string): void
}

export type PageOpenMode = 'push' | 'peek'

export type ResolvedDocumentState =
  | { status: 'loading' }
  | { status: 'ready'; document: SduiDocument }
  | { status: 'missing' }
  | { status: 'error'; error: unknown }

export type SduiPageContextValue = {
  /** Resolve with in-flight dedup and per-provider cache. `refresh` bypasses the cache read. */
  resolve(id: string, options?: { refresh?: boolean }): Promise<SduiDocument | undefined>
  /** Read the currently cached document synchronously (undefined when not loaded). */
  peekCache(id: string): SduiDocument | undefined
  open(id: string, mode?: PageOpenMode): void
  defaultOpenMode: PageOpenMode
}

/**
 * Kept in its own module (separate from the provider component) so consumers
 * like PageBlock only depend on the context — the provider renders the peek
 * dialog, which renders the editor, which renders blocks; importing the
 * provider from a block would be an import cycle.
 */
export const SduiPageContext = React.createContext<SduiPageContextValue | null>(null)

/** Page navigation context, or null outside a provider (blocks render inert). */
export function useSduiPage(): SduiPageContextValue | null {
  return useContext(SduiPageContext)
}

/**
 * Subscribe to a resolved document. Loading starts on mount; `refresh: true`
 * refetches on mount even when cached (peek surfaces use it to avoid staleness).
 */
export function useResolvedDocument(id: string | null, options?: { refresh?: boolean }): ResolvedDocumentState {
  const page = useSduiPage()
  const [state, setState] = useState<ResolvedDocumentState>({ status: 'loading' })
  const refresh = options?.refresh === true

  useEffect(() => {
    if (!page || id === null) {
      return undefined
    }

    let alive = true
    setState(() => {
      const cached = page.peekCache(id)
      return cached ? { status: 'ready', document: cached } : { status: 'loading' }
    })

    page
      .resolve(id, { refresh })
      .then((document) => {
        if (alive) {
          setState(document ? { status: 'ready', document } : { status: 'missing' })
        }
      })
      .catch((error: unknown) => {
        if (alive) {
          setState({ status: 'error', error })
        }
      })

    return () => {
      alive = false
    }
  }, [page, id, refresh])

  if (!page || id === null) {
    return { status: 'missing' }
  }

  return state
}
