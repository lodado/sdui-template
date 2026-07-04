import type { BlockSelectionState } from '@lodado/sdui-document'
import { clearBlockSelection } from '@lodado/sdui-document'
import { useSyncExternalStore } from 'react'

export type FocusTarget = {
  blockId: string
  caret: 'start' | 'end' | number
  /** Bumped to force a fresh PM mount even when blockId stays the same. */
  session: number
}

export type EditorUIState = {
  focus: FocusTarget | null
  selection: BlockSelectionState
}

export type EditorUIStore = {
  get(): EditorUIState
  set(partial: Partial<EditorUIState>): void
  subscribe(listener: () => void): () => void
}

/**
 * Minimal external store for per-frame/per-interaction editor UI state
 * (focus target, block selection).
 *
 * Same idea as the sdui-template core's subscription-based rendering: this
 * state deliberately lives OUTSIDE React state so changing it never re-renders
 * the editor container — each block row subscribes to just its own slice via
 * useEditorUISelector and only affected rows re-render.
 */
export function createEditorUIStore(): EditorUIStore {
  let state: EditorUIState = { focus: null, selection: clearBlockSelection() }
  const listeners = new Set<() => void>()

  return {
    get: () => state,
    set: (partial) => {
      state = { ...state, ...partial }
      listeners.forEach((listener) => listener())
    },
    subscribe: (listener) => {
      listeners.add(listener)

      return () => {
        listeners.delete(listener)
      }
    },
  }
}

/**
 * Subscribes to a slice of the editor UI store.
 *
 * The selector must return a stable value for unchanged state (primitives or
 * objects taken directly from the state) so React can bail out of re-renders.
 */
export function useEditorUISelector<T>(store: EditorUIStore, selector: (state: EditorUIState) => T): T {
  return useSyncExternalStore(store.subscribe, () => selector(store.get()))
}
