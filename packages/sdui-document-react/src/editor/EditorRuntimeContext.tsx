import React, { useContext } from 'react'

import type { FocusedBlockCommit } from '../focused-block/FocusedBlockEditor'
import type { BlockMenuItem } from './block-menu/blockMenuItems'
import type { EditorUIStore, FocusTarget } from './uiStore'

/**
 * Per-block interaction handlers. Created ONCE per editor instance (stable
 * identities) — they read live state through refs/store, never through
 * closures over render-scoped values, so memoized rows keep bailing out.
 */
export type EditorHandlers = {
  handleClick(blockId: string, shiftKey: boolean): void
  toggleChecked(blockId: string, checked: boolean): void
  /** Toggle block collapse — block.update on attributes.collapsed. */
  toggleCollapsed(blockId: string, collapsed: boolean): void
  /** Code block language picker — block.update on attributes.language. */
  setCodeLanguage(blockId: string, language: string): void
  focusBlock(blockId: string, caret: FocusTarget['caret']): void
  commit(blockId: string, commit: FocusedBlockCommit): void
  split(blockId: string, offset: number): void
  mergeBackward(blockId: string): void
  indent(blockId: string): void
  outdent(blockId: string): void
  navigate(blockId: string, direction: 'up' | 'down'): void
  escape(blockId: string): void
  turnInto(blockId: string, type: string, attrs?: Record<string, unknown>): void
  moveBlock(blockId: string, direction: 'up' | 'down'): void
  blockAction(blockId: string): void
  blockMenuSelect(blockId: string, item: BlockMenuItem, extraAttributes?: Record<string, unknown>): void
  blockMenuFilePicked(file: File): void
  insertBlockBelow(blockId: string): void
  /** Gutter resize between two sibling columns; delta is a fraction of the pair width. */
  resizeColumnPair(leftColumnId: string, rightColumnId: string, deltaFraction: number): void
}

export type EditorRuntime = {
  store: EditorUIStore
  handlers: EditorHandlers
}

export const EditorRuntimeContext = React.createContext<EditorRuntime | null>(null)

export function useEditorRuntime(): EditorRuntime {
  const runtime = useContext(EditorRuntimeContext)
  if (!runtime) {
    throw new Error('BlockNode must be rendered inside SduiDocumentEditor')
  }

  return runtime
}
