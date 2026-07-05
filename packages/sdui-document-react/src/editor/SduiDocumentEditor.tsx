import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { SduiDocumentContent, SduiDocumentPatch } from '@lodado/sdui-document'
import {
  anchorAfterBlock,
  clearBlockSelection,
  createBlockId,
  createBlockSelection,
  createTrailingBlockPatch,
  findBlockById,
  flattenDocumentBlocks,
  isEmptyDocument,
} from '@lodado/sdui-document'
import React, { useMemo, useRef } from 'react'

import { cloneBlockWithNewIds, defaultGenerateBlockId, isTextBlock } from './blockContent'
import { BlockNode } from './BlockNode'
import { collisionDetection, DRAG_INDENT_WIDTH, POINTER_SENSOR_OPTIONS } from './editorConstants'
import { type EditorRuntime, EditorRuntimeContext, useEditorRuntime } from './EditorRuntimeContext'
import { useDocumentPatches } from './hooks/useDocumentPatches'
import { useEditorHandlers } from './hooks/useEditorHandlers'
import { useInlineTextDragDrop } from './hooks/useInlineTextDragDrop'
import { useNestedBlockDragDrop } from './hooks/useNestedBlockDragDrop'
import type { EditorUIStore } from './uiStore'
import { createEditorUIStore, useEditorUISelector } from './uiStore'

export { DRAG_INDENT_WIDTH } from './editorConstants'

export type SduiDocumentEditorProps = {
  /** Initial document content (uncontrolled after mount). */
  content: SduiDocumentContent
  onContentChange?(next: SduiDocumentContent, patches: SduiDocumentPatch[]): void
  /** Notified when a markdown shortcut requests a block type change. */
  onTurnInto?(blockId: string, type: string, attrs?: Record<string, unknown>): void
  /**
   * Uploads a picked image/file to the host's storage. Omitted → the editor
   * falls back to URL.createObjectURL (local-only, lost on reload).
   */
  onUploadFile?(file: File): Promise<{ url: string }>
  readOnly?: boolean
  /** Injectable for deterministic tests; defaults to a random id. */
  generateBlockId?(): string
  className?: string
}

/**
 * Hybrid notion-like document editor surface.
 *
 * Wires the three PM <-> block-layer channels to the patch engine:
 * inject (InlineContentView / FocusedBlockEditor mount), commit
 * (block.update), and keymap delegation (split/merge/indent/outdent/navigate).
 *
 * Policies:
 * - exactly one FocusedBlockEditor is mounted (the focused text block)
 * - all structure changes go through applyDocumentPatches — never direct
 * - uncontrolled: the `content` prop seeds initial state only
 * - render granularity: focus/selection live in an external store (per-row
 *   subscription), the drop indicator is a DOM-painted overlay — the container
 *   re-renders only when the document itself changes
 */
export const SduiDocumentEditor = (props: SduiDocumentEditorProps) => {
  const {
    content,
    onContentChange,
    onTurnInto,
    onUploadFile,
    readOnly = false,
    generateBlockId = defaultGenerateBlockId,
    className,
  } = props

  const { doc, docRef, applyPatches, undo, redo } = useDocumentPatches({
    content,
    onContentChange,
    generateBlockId,
    readOnly,
  })
  const containerRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const inlineCaretRef = useRef<HTMLDivElement>(null)
  const storeRef = useRef<EditorUIStore>()
  if (!storeRef.current) {
    storeRef.current = createEditorUIStore()
  }
  const store = storeRef.current

  const { handlers, fileInputRef } = useEditorHandlers({
    store,
    docRef,
    containerRef,
    applyPatches,
    generateBlockId,
    onTurnInto,
    onUploadFile,
  })
  const runtime = useMemo<EditorRuntime>(() => ({ store, handlers }), [store, handlers])

  useInlineTextDragDrop({
    docRef,
    containerRef,
    caretRef: inlineCaretRef,
    readOnly,
    applyPatches,
    onDropFocus: (blockId, caretOffset) => runtime.handlers.focusBlock(blockId, caretOffset),
    onDragStart: () => {
      // Same policy as the block drag: the focused PM editor must not survive
      // a drag — unmounting commits it, and the drop path sees only static rows.
      store.set({ focus: null, selection: clearBlockSelection() })
    },
  })

  const { handleDragStart, handleDragMove, handleDragEnd, handleDragCancel } = useNestedBlockDragDrop({
    docRef,
    indentWidth: DRAG_INDENT_WIDTH,
    containerRef,
    indicatorRef,
    applyPatches,
    onDragStart: () => {
      // Editing/selection state must not survive a drag: unmount commits the PM editor.
      store.set({ focus: null, selection: clearBlockSelection() })
    },
  })

  // Document-level undo/redo. The focused PM editor binds Mod-Z/Y to its own
  // per-session inline history FIRST; when that is empty its command returns
  // false, the key bubbles here unprevented, and the block-level stack takes
  // over — the same two-tier order Outline gets from a single PM history.
  const handleHistoryStep = (direction: 'undo' | 'redo') => {
    // Unmount the focused editor before touching the tree under it (the
    // unmount commit is a no-op: an empty PM history means nothing typed).
    store.set({ focus: null, selection: clearBlockSelection() })
    const applied = direction === 'undo' ? undo() : redo()
    if (!applied) {
      return
    }

    // Land the caret on the first surviving text block the step touched.
    const targetId = applied
      .map((patch) => {
        if (patch.type === 'block.insert') {
          return patch.block.id
        }

        if ('intoBlockId' in patch) {
          return patch.intoBlockId
        }

        return 'blockId' in patch ? patch.blockId : undefined
      })
      .find((id) => {
        const block = id ? findBlockById(docRef.current, id) : undefined

        return block !== undefined && isTextBlock(block)
      })

    if (targetId) {
      runtime.handlers.focusBlock(targetId, 'end')
    }
  }

  const handleSelectionKeyDown = (event: React.KeyboardEvent) => {
    // Keys already handled by the PM keymap (e.g. the Escape that just
    // CREATED this selection) bubble up defaultPrevented — don't double-handle.
    if (event.defaultPrevented) {
      return
    }

    const isMod = event.metaKey || event.ctrlKey

    // History keys work with or without a block selection.
    if (!readOnly && isMod && (event.key === 'z' || event.key === 'Z')) {
      event.preventDefault()
      handleHistoryStep(event.shiftKey ? 'redo' : 'undo')

      return
    }

    if (!readOnly && isMod && (event.key === 'y' || event.key === 'Y')) {
      event.preventDefault()
      handleHistoryStep('redo')

      return
    }

    const { selection } = store.get()
    if (selection.selectedIds.length === 0) {
      return
    }
    const orderedIds = () =>
      flattenDocumentBlocks(docRef.current)
        .map((item) => item.id)
        .filter((id) => id !== docRef.current.root.id)

    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault()
      applyPatches(selection.selectedIds.map((id) => ({ type: 'block.delete', blockId: createBlockId(id) })))
      store.set({ selection: clearBlockSelection() })

      return
    }

    // Notion block-selection keys: arrows walk the flattened order, Enter
    // re-enters inline editing, Mod-A selects everything, Mod-D duplicates.
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      const ids = orderedIds()
      const currentId = selection.anchorId ?? selection.selectedIds[selection.selectedIds.length - 1]
      const index = ids.indexOf(currentId)
      const nextId = ids[event.key === 'ArrowUp' ? index - 1 : index + 1]
      if (nextId) {
        store.set({ selection: createBlockSelection(nextId), focus: null })
      }

      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      const targetId = selection.anchorId ?? selection.selectedIds[0]
      const target = findBlockById(docRef.current, targetId)
      if (target && isTextBlock(target)) {
        const previous = store.get().focus
        store.set({
          selection: clearBlockSelection(),
          focus: { blockId: targetId, caret: 'end', session: (previous?.session ?? 0) + 1 },
        })
      }

      return
    }

    if (isMod && (event.key === 'a' || event.key === 'A')) {
      event.preventDefault()
      const ids = orderedIds()
      store.set({
        selection: { anchorId: selection.anchorId ?? ids[0], selectedIds: ids },
        focus: null,
      })

      return
    }

    if (isMod && (event.key === 'd' || event.key === 'D')) {
      event.preventDefault()
      const flattened = flattenDocumentBlocks(docRef.current)
      const duplicatedIds: string[] = []
      const patches = selection.selectedIds.reduce<SduiDocumentPatch[]>((accumulated, id) => {
        const item = flattened.find((candidate) => candidate.id === id)
        const source = findBlockById(docRef.current, id)
        if (!item?.parentId || !source) {
          return accumulated
        }

        const clone = cloneBlockWithNewIds(source, generateBlockId)
        duplicatedIds.push(clone.id)

        return [
          ...accumulated,
          {
            type: 'block.insert',
            parentId: createBlockId(item.parentId),
            ...anchorAfterBlock(docRef.current, item.parentId, id),
            block: clone,
          },
        ]
      }, [])

      if (patches.length > 0) {
        applyPatches(patches)
        store.set({
          selection: { anchorId: duplicatedIds[0], selectedIds: duplicatedIds },
          focus: null,
        })
      }

      return
    }

    if (event.key === 'Escape') {
      store.set({ selection: clearBlockSelection() })
    }
  }

  // Outline ClickablePadding: clicking the space below the document only
  // FOCUSES the trailing block — the trailing-block invariant (applied at
  // mount and after every patch batch) guarantees one exists, so the click
  // "feels" like it created a new line without ever inserting on click.
  const handlePaddingClick = () => {
    const children = docRef.current.root.children ?? []
    const last = children[children.length - 1]
    if (last && isTextBlock(last)) {
      runtime.handlers.focusBlock(last.id, 'end')

      return
    }

    // Defensive: only reachable when the invariant was bypassed (e.g. a
    // readOnly -> editable toggle) — restore it, then focus the new block.
    const trailing = createTrailingBlockPatch(docRef.current, generateBlockId)
    if (trailing && trailing.type === 'block.insert') {
      applyPatches([trailing])
      runtime.handlers.focusBlock(trailing.block.id, 'end')
    }
  }

  const sensors = useSensors(useSensor(PointerSensor, POINTER_SENSOR_OPTIONS))

  return (
    <EditorRuntimeContext.Provider value={runtime}>
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
        <div
          ref={containerRef}
          className={className}
          data-sdui-document-editor
          data-doc-empty={isEmptyDocument(doc) || undefined}
          role="tree"
          tabIndex={-1}
          onKeyDown={handleSelectionKeyDown}
          style={{ outline: 'none', position: 'relative' }}
        >
          {doc.root.children?.map((child) => (
            <BlockNode key={child.id} block={child} depth={1} readOnly={readOnly} />
          ))}
          {!readOnly && (
            // Outline ClickablePadding: a text-cursor strip below the last
            // block; keyboard users reach the same spot via ArrowDown.
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
            <div data-editor-clickable-padding onClick={handlePaddingClick} />
          )}
          {!readOnly && (
            // Hidden picker for the block menu's image/file items — clicked
            // programmatically, value reset so the same file can be re-picked.
            <input
              ref={fileInputRef}
              type="file"
              data-block-menu-file-input
              aria-hidden
              tabIndex={-1}
              style={{ display: 'none' }}
              onChange={(event) => {
                const file = event.target.files?.[0]
                // eslint-disable-next-line no-param-reassign -- reset the native picker for re-picks
                event.target.value = ''
                if (file) {
                  runtime.handlers.blockMenuFilePicked(file)
                }
              }}
            />
          )}
          {/* single drop indicator, painted via DOM during drags (no re-render) */}
          <div
            ref={indicatorRef}
            data-drop-indicator
            aria-hidden
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: 2,
              width: 0,
              display: 'none',
              pointerEvents: 'none',
            }}
          />
          {/* insertion caret for inline text drags — same DOM-painting policy */}
          <div
            ref={inlineCaretRef}
            data-drop-caret
            aria-hidden
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 2,
              height: 0,
              display: 'none',
              pointerEvents: 'none',
            }}
          />
        </div>
      </DndContext>
    </EditorRuntimeContext.Provider>
  )
}
