import type { SduiDocumentBlock } from '@lodado/sdui-document'

import { type RenderEntry, type RenderEntryCache, syncTree } from './entry'

/**
 * Per-id external store over the render model.
 *
 * Unlike the editor UI store (which notifies every listener and relies on
 * selector bail-out), this store notifies ONLY the ids whose entry actually
 * changed — so a single-block edit wakes exactly one subscribed row. Combined
 * with the value-stabilized entries from `entry.ts`, that gives O(1) re-render.
 *
 * The store never mutates entries in place: `syncTree` replaces changed slices
 * immutably, which is what keeps `useSyncExternalStore` snapshots consistent
 * (no tearing).
 */
export interface RenderModelStore {
  /** Current entry for a block id, or undefined if it is not in the tree. */
  entryFor(id: string): RenderEntry | undefined
  /** Subscribe a row to changes of a single block id. */
  subscribe(id: string, listener: () => void): () => void
  /**
   * Reconcile from the previous tree to the next and notify only changed ids.
   * Pass `null` as `prevRoot` on the first sync (initial render).
   */
  sync(prevRoot: SduiDocumentBlock | null, nextRoot: SduiDocumentBlock): void
}

export function createRenderModelStore(): RenderModelStore {
  const cache: RenderEntryCache = new Map()
  const listeners = new Map<string, Set<() => void>>()

  return {
    entryFor: (id) => cache.get(id),

    subscribe: (id, listener) => {
      let set = listeners.get(id)
      if (!set) {
        set = new Set()
        listeners.set(id, set)
      }
      set.add(listener)

      return () => {
        const current = listeners.get(id)
        if (!current) return
        current.delete(listener)
        if (current.size === 0) {
          listeners.delete(id)
        }
      }
    },

    sync: (prevRoot, nextRoot) => {
      const changed = syncTree(prevRoot, nextRoot, cache)
      changed.forEach((id) => {
        listeners.get(id)?.forEach((listener) => listener())
      })
    },
  }
}
