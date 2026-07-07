import { useCallback , useSyncExternalStore } from 'react'

import type { RenderEntry } from './entry'
import type { RenderModelStore } from './RenderModelStore'

/**
 * Subscribe a block row to just its own render entry.
 *
 * The row re-renders only when its own entry reference changes — a sibling or
 * ancestor edit never wakes it, because the store notifies per id and the entry
 * is value-stabilized. This is the O(1) hook.
 */
export function useBlockEntry(store: RenderModelStore, id: string): RenderEntry | undefined {
  const subscribe = useCallback((listener: () => void) => store.subscribe(id, listener), [store, id])
  const getSnapshot = useCallback(() => store.entryFor(id), [store, id])

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
