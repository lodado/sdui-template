import type { SduiDocumentContent } from '@lodado/sdui-document'
import React, { useContext, useSyncExternalStore } from 'react'

/**
 * Live document content, exposed through a STABLE external store — separate from
 * EditorRuntimeContext, and deliberately NOT the changing `doc` value itself.
 *
 * The context value is a fixed store object created once per editor; on each
 * commit the editor mutates the store's snapshot and notifies subscribers. So
 * whole-tree readers (the TOC, the empty-document flag) update via their own
 * `useSyncExternalStore` subscription without the editor container re-rendering
 * to push a new context value down.
 */
export interface DocContentStore {
  subscribe(listener: () => void): () => void
  getSnapshot(): SduiDocumentContent | null
}

/** Concrete store: the editor keeps the setter; consumers see only the readable half. */
export interface MutableDocContentStore extends DocContentStore {
  setSnapshot(next: SduiDocumentContent | null): void
}

const DocumentContentContext = React.createContext<DocContentStore | null>(null)

export const DocumentContentProvider = DocumentContentContext.Provider

/** Stable no-op store so `useDocumentContent` can subscribe unconditionally outside an editor. */
const EMPTY_STORE: DocContentStore = {
  subscribe: () => () => {},
  getSnapshot: () => null,
}

/**
 * Create the editor's doc store. Snapshot starts at `initial` and is swapped via
 * `setSnapshot` on every commit; the reference is compared by consumers, so a new
 * `doc` (structural-sharing immutable update) always re-renders subscribers.
 */
export function createDocContentStore(initial: SduiDocumentContent | null = null): MutableDocContentStore {
  let snapshot = initial
  const listeners = new Set<() => void>()

  return {
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    getSnapshot: () => snapshot,
    setSnapshot(next) {
      snapshot = next
      listeners.forEach((listener) => listener())
    },
  }
}

/** Current document content, or null when rendered outside an editor. */
export function useDocumentContent(): SduiDocumentContent | null {
  const store = useContext(DocumentContentContext) ?? EMPTY_STORE

  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
}
