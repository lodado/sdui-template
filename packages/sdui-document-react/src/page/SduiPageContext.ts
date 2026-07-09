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
  const refresh = options?.refresh === true

  // State is keyed by the id it was resolved for and reset DURING render when
  // the id changes (React's derived-state reset pattern). Without the reset
  // there is an intermediate render where the new id is paired with the
  // previous document — a consumer keying children by id (the peek dialog keys
  // its editor that way) would mount them with stale content and, the key now
  // being final, never remount.
  const [snapshot, setSnapshot] = useState<{ id: string | null; value: ResolvedDocumentState }>(() => ({
    id,
    value: { status: 'loading' },
  }))
  // refresh mode never serves the cache — not even for the first paint. The
  // cached object can be stale relative to the host store (e.g. edits saved
  // from a previous peek), and an uncontrolled consumer seeded from it would
  // keep the stale content after the fresh document arrives under the same id.
  if (snapshot.id !== id) {
    const cached = !refresh && page && id !== null ? page.peekCache(id) : undefined
    setSnapshot({ id, value: cached ? { status: 'ready', document: cached } : { status: 'loading' } })
  }

  useEffect(() => {
    if (!page || id === null) {
      return undefined
    }

    let alive = true
    setSnapshot(() => {
      const cached = refresh ? undefined : page.peekCache(id)
      return { id, value: cached ? { status: 'ready', document: cached } : { status: 'loading' } }
    })

    page
      .resolve(id, { refresh })
      .then((document) => {
        if (alive) {
          setSnapshot({ id, value: document ? { status: 'ready', document } : { status: 'missing' } })
        }
      })
      .catch((error: unknown) => {
        if (alive) {
          setSnapshot({ id, value: { status: 'error', error } })
        }
      })

    return () => {
      alive = false
    }
  }, [page, id, refresh])

  if (!page || id === null) {
    return { status: 'missing' }
  }

  return snapshot.value
}
