import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { SduiDocumentContent, SduiDocumentPatch } from '@lodado/sdui-document'
import { clearBlockSelection, isEmptyDocument } from '@lodado/sdui-document'
import { useMemo, useRef } from 'react'

import { defaultGenerateBlockId, numberedListOrdinals } from './blockContent'
import { BlockNode } from './BlockNode'
import { collisionDetection, DRAG_INDENT_WIDTH, POINTER_SENSOR_OPTIONS } from './editorConstants'
import { type EditorRuntime, EditorRuntimeContext, useEditorRuntime } from './EditorRuntimeContext'
import { useDocumentPatches } from './hooks/useDocumentPatches'
import { useEditorHandlers } from './hooks/useEditorHandlers'
import { useInlineTextDragDrop } from './hooks/useInlineTextDragDrop'
import { useNestedBlockDragDrop } from './hooks/useNestedBlockDragDrop'
import { useSelectionKeyboard } from './hooks/useSelectionKeyboard'
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

  const { handleSelectionKeyDown, handlePaddingClick } = useSelectionKeyboard({
    store,
    docRef,
    readOnly,
    applyPatches,
    undo,
    redo,
    generateBlockId,
    focusBlock: runtime.handlers.focusBlock,
  })

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
          {(() => {
            const ordinals = numberedListOrdinals(doc.root.children ?? [])
            return doc.root.children?.map((child) => (
              <BlockNode
                key={child.id}
                block={child}
                depth={1}
                readOnly={readOnly}
                listOrdinal={ordinals.get(child.id)}
              />
            ))
          })()}
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
