import type { BlockAlign } from '@lodado/sdui-document'
import React, { useContext } from 'react'

import type { FocusedBlockCommit } from '../focused-block/FocusedBlockEditor'
import type { BlockMenuItem } from './block-menu/blockMenuItems'
import type { RenderModelStore } from './renderModel/RenderModelStore'
import type { EditorUIStore, FocusTarget } from './uiStore'

/** Image layout attributes settable from the image block's inline controls. */
export type ImageLayoutPatch = { width?: number; height?: number; align?: BlockAlign; alt?: string }

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
  /** Callout emoji icon — block.update on attributes.icon. */
  setCalloutIcon(blockId: string, icon: string): void
  /** Horizontal alignment for a text block — block.update on attributes.align (null clears). */
  setBlockAlign(blockId: string, align: BlockAlign | null): void
  /** Image size/position — block.update merging attributes.width / attributes.align. */
  setImageLayout(blockId: string, layout: ImageLayoutPatch): void
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
  /** Open the block-actions menu (turn into / duplicate / delete) anchored to the ⠿ handle. */
  openBlockActions(blockId: string, rect: DOMRect): void
  closeBlockActions(): void
  /** Deep-clone a block with fresh ids and insert it directly below (Notion duplicate). */
  duplicateBlock(blockId: string): void
  /** Remove a block via block.delete (trailing-block invariant reapplied by the patch engine). */
  deleteBlock(blockId: string): void
  /** Delegated document-level undo/redo from a focused block's empty PM history. */
  history(direction: 'undo' | 'redo'): void
  blockAction(blockId: string): void
  blockMenuSelect(blockId: string, item: BlockMenuItem, extraAttributes?: Record<string, unknown>): void
  /** Collection "+ New": create a page document (host) and insert it as a collection item. */
  addCollectionItem(collectionId: string): void
  blockMenuFilePicked(file: File): void
  insertBlockBelow(blockId: string): void
  /** Insert (and focus) a paragraph as a toggle's first child; expands it if collapsed. */
  insertToggleChild(blockId: string): void
  /** Gutter resize between two sibling columns; delta is a fraction of the pair width. */
  resizeColumnPair(leftColumnId: string, rightColumnId: string, deltaFraction: number): void
  /** Rewrite (nextHref: string) or remove (nextHref: null) every link mark matching `href` in a block. */
  updateLink(blockId: string, href: string, nextHref: string | null): void
}

export type EditorRuntime = {
  store: EditorUIStore
  handlers: EditorHandlers
  /** Per-id render-model store: block rows subscribe to their own entry for O(1) re-render. */
  renderStore: RenderModelStore
  /** Host-adapter availability flags (e.g. Page menu item needs onCreatePage). */
  capabilities: { canCreatePage: boolean }
}

export const EditorRuntimeContext = React.createContext<EditorRuntime | null>(null)

export function useEditorRuntime(): EditorRuntime {
  const runtime = useContext(EditorRuntimeContext)
  if (!runtime) {
    throw new Error('BlockNode must be rendered inside SduiDocumentEditor')
  }

  return runtime
}
