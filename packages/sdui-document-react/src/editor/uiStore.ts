import type { BlockSelectionState } from '@lodado/sdui-document'
import { clearBlockSelection } from '@lodado/sdui-document'
import { useSyncExternalStore } from 'react'

import type { SelectionToolbarProps } from '../selection-toolbar/SelectionToolbar'

export type FocusTarget = {
  blockId: string
  caret: 'start' | 'end' | number
  /** Bumped to force a fresh PM mount even when blockId stays the same. */
  session: number
  /** '+' button flow: the mounting editor opens the block menu immediately. */
  openBlockMenu?: boolean
  /** Freshly created block: triggers a one-shot insert highlight on its row. */
  justInserted?: boolean
}

/** Block-actions menu opened from the ⠿ drag handle (turn into / duplicate / delete). */
export type BlockActionsTarget = {
  blockId: string
  /** Handle rect the menu positions against (viewport coords). */
  rect: DOMRect
}

export type EditorUIState = {
  focus: FocusTarget | null
  selection: BlockSelectionState
  blockActions: BlockActionsTarget | null
  /**
   * Props for the single, editor-level SelectionToolbar, published by the
   * focused block editor. The document owns exactly one toolbar instance;
   * a cross-block range toolbar takes precedence over this when present.
   */
  selectionToolbar: SelectionToolbarProps | null
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
  let state: EditorUIState = {
    focus: null,
    selection: clearBlockSelection(),
    blockActions: null,
    selectionToolbar: null,
  }
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
  const getSnapshot = () => selector(store.get())

  // same snapshot on the server: SSR renders the initial UI state
  return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot)
}
