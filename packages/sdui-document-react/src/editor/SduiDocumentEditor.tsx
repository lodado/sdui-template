import { DndContext, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import type {
  BlockSelectionState,
  SduiDocumentBlock,
  SduiDocumentContent,
  SduiDocumentPatch,
  SduiInlineContent,
} from '@lodado/sdui-document'
import {
  clearBlockSelection,
  createBlockId,
  createBlockSelection,
  extendBlockSelection,
  findBlockById,
  flattenDocumentBlocks,
  getInlineContentLength,
  textToInlineContent,
} from '@lodado/sdui-document'
import React, { useContext, useMemo, useRef } from 'react'

import { BlockChrome } from '../block-types/BlockChrome'
import type { FocusedBlockCommit } from '../focused-block/FocusedBlockEditor'
import { FocusedBlockEditor } from '../focused-block/FocusedBlockEditor'
import { InlineContentView } from '../inline/InlineContentView'
import { useDocumentPatches } from './hooks/useDocumentPatches'
import { useNestedBlockDragDrop } from './hooks/useNestedBlockDragDrop'
import type { EditorUIStore, FocusTarget } from './uiStore'
import { createEditorUIStore, useEditorUISelector } from './uiStore'

/** Pixel width of one indentation level for drag depth projection. */
export const DRAG_INDENT_WIDTH = 24

// Module-level constant: a fresh options object each render would change the
// sensors identity, recreate DndContext's internal context, and force every
// memoized row to re-render on any container render.
// distance constraint keeps plain clicks (selection) distinct from drags.
const POINTER_SENSOR_OPTIONS = { activationConstraint: { distance: 4 } }

const NON_TEXT_BLOCK_TYPES = new Set([
  'document.root',
  'document.divider',
  'document.image',
  'document.file',
  'document.link',
])

export type SduiDocumentEditorProps = {
  /** Initial document content (uncontrolled after mount). */
  content: SduiDocumentContent
  onContentChange?(next: SduiDocumentContent, patches: SduiDocumentPatch[]): void
  /** Notified when a markdown shortcut requests a block type change. */
  onTurnInto?(blockId: string, type: string, attrs?: Record<string, unknown>): void
  readOnly?: boolean
  /** Injectable for deterministic tests; defaults to a random id. */
  generateBlockId?(): string
  className?: string
}

function defaultGenerateBlockId(): string {
  return `block-${Math.random().toString(36).slice(2, 10)}`
}

function isTextBlock(block: SduiDocumentBlock): boolean {
  return !NON_TEXT_BLOCK_TYPES.has(block.type)
}

function blockInlineContent(block: SduiDocumentBlock | undefined): SduiInlineContent {
  const content = block?.state?.content
  if (Array.isArray(content)) {
    return content as SduiInlineContent
  }

  const text = block?.state?.text

  return typeof text === 'string' ? textToInlineContent(text) : []
}

function isSameCommit(block: SduiDocumentBlock | undefined, commit: FocusedBlockCommit): boolean {
  if (!block) {
    return true
  }

  const existing = blockInlineContent(block)

  return JSON.stringify(existing) === JSON.stringify(commit.content)
}

/**
 * Per-block interaction handlers. Created ONCE per editor instance (stable
 * identities) — they read live state through refs/store, never through
 * closures over render-scoped values, so memoized rows keep bailing out.
 */
type EditorHandlers = {
  handleClick(blockId: string, shiftKey: boolean): void
  toggleChecked(blockId: string, checked: boolean): void
  focusBlock(blockId: string, caret: FocusTarget['caret']): void
  commit(blockId: string, commit: FocusedBlockCommit): void
  split(blockId: string, offset: number): void
  mergeBackward(blockId: string): void
  indent(blockId: string): void
  outdent(blockId: string): void
  navigate(blockId: string, direction: 'up' | 'down'): void
  escape(blockId: string): void
  turnInto(blockId: string, type: string, attrs?: Record<string, unknown>): void
}

type EditorRuntime = {
  store: EditorUIStore
  handlers: EditorHandlers
}

const EditorRuntimeContext = React.createContext<EditorRuntime | null>(null)

function useEditorRuntime(): EditorRuntime {
  const runtime = useContext(EditorRuntimeContext)
  if (!runtime) {
    throw new Error('BlockNode must be rendered inside SduiDocumentEditor')
  }

  return runtime
}

type BlockNodeProps = {
  block: SduiDocumentBlock
  depth: number
  readOnly: boolean
}

/**
 * One block row: droppable row + drag handle + type chrome + recursive
 * children. Memoized — re-renders only when its own block reference, its
 * focus/selection slice, or dnd state for this row changes. Focus, selection
 * and the drop indicator are NOT props, so sibling rows stay untouched.
 */
const BlockNode = React.memo(({ block, depth, readOnly }: BlockNodeProps) => {
  const { store, handlers } = useEditorRuntime()
  const isSelected = useEditorUISelector(store, (state) => state.selection.selectedIds.includes(block.id))
  const focus = useEditorUISelector(store, (state) => (state.focus?.blockId === block.id ? state.focus : null))
  const { setNodeRef: setDropRef } = useDroppable({ id: block.id, disabled: readOnly })
  const { setNodeRef: setDragRef, listeners, attributes } = useDraggable({ id: block.id, disabled: readOnly })

  const isFocused = !readOnly && focus !== null && isTextBlock(block)

  // span keeps the chrome wrapper (<p>/<h1>…) valid — div may not nest there
  const staticView = readOnly ? (
    <span className="sdui-doc-static">
      <InlineContentView content={blockInlineContent(block)} />
    </span>
  ) : (
    <span
      className="sdui-doc-static"
      role="textbox"
      tabIndex={0}
      onClick={() => handlers.focusBlock(block.id, 'start')}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          handlers.focusBlock(block.id, 'start')
        }
      }}
    >
      <InlineContentView content={blockInlineContent(block)} />
    </span>
  )

  return (
    <div ref={setDropRef} data-block-id={block.id} data-depth={depth} data-selected={isSelected || undefined}>
      {/* center: the drag handle sits at the vertical middle of the block row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {!readOnly && (
          <button
            type="button"
            ref={setDragRef}
            data-drag-handle
            aria-label={`Drag block ${block.id}`}
            style={{ cursor: 'grab', border: 'none', background: 'transparent', padding: '2px 4px' }}
            onClick={(event) => handlers.handleClick(block.id, event.shiftKey)}
            // eslint-disable-next-line react/jsx-props-no-spreading -- dnd-kit activator contract
            {...attributes}
            // eslint-disable-next-line react/jsx-props-no-spreading -- dnd-kit activator contract
            {...listeners}
          >
            ⠿
          </button>
        )}
        <div style={{ flex: 1 }}>
          <BlockChrome block={block} onToggleChecked={readOnly ? undefined : handlers.toggleChecked}>
            {isTextBlock(block) &&
              (isFocused && focus ? (
                <FocusedBlockEditor
                  key={focus.session}
                  content={blockInlineContent(block)}
                  autoFocus={focus.caret}
                  onCommit={(commit) => handlers.commit(block.id, commit)}
                  onSplit={(offset) => handlers.split(block.id, offset)}
                  onMergeBackward={() => handlers.mergeBackward(block.id)}
                  onIndent={() => handlers.indent(block.id)}
                  onOutdent={() => handlers.outdent(block.id)}
                  onNavigate={(direction) => handlers.navigate(block.id, direction)}
                  onTurnInto={(type, attrs) => handlers.turnInto(block.id, type, attrs)}
                  onEscape={() => handlers.escape(block.id)}
                />
              ) : (
                staticView
              ))}
          </BlockChrome>
        </div>
      </div>
      {block.children?.length ? (
        // one visual indent level per tree level — same unit the drag depth
        // projection uses, so the drop indicator lines up with real indents
        <div data-block-nested style={{ paddingLeft: DRAG_INDENT_WIDTH }}>
          {block.children.map((child) => (
            <BlockNode key={child.id} block={child} depth={depth + 1} readOnly={readOnly} />
          ))}
        </div>
      ) : null}
    </div>
  )
})
BlockNode.displayName = 'BlockNode'

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
    readOnly = false,
    generateBlockId = defaultGenerateBlockId,
    className,
  } = props

  const { doc, docRef, applyPatches } = useDocumentPatches({ content, onContentChange })
  const containerRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const storeRef = useRef<EditorUIStore>()
  if (!storeRef.current) {
    storeRef.current = createEditorUIStore()
  }
  const store = storeRef.current

  // Live values behind a ref so the once-created handlers never go stale.
  const latest = useRef({ applyPatches, generateBlockId, onTurnInto })
  latest.current = { applyPatches, generateBlockId, onTurnInto }

  const runtime = useMemo<EditorRuntime>(() => {
    const selectBlocks = (next: BlockSelectionState) => {
      store.set({ selection: next, focus: null })
      if (next.selectedIds.length > 0) {
        containerRef.current?.focus()
      }
    }

    const refocus = (blockId: string, caret: FocusTarget['caret']) => {
      const previous = store.get().focus
      store.set({
        selection: clearBlockSelection(),
        focus: { blockId, caret, session: (previous?.session ?? 0) + 1 },
      })
    }

    const orderedTextBlocks = () =>
      flattenDocumentBlocks(docRef.current)
        .filter((item) => item.id !== docRef.current.root.id)
        .filter((item) => {
          const block = findBlockById(docRef.current, item.id)

          return block !== undefined && isTextBlock(block)
        })

    const handlers: EditorHandlers = {
      handleClick: (blockId, shiftKey) => {
        const { selection } = store.get()
        if (shiftKey && selection.anchorId) {
          selectBlocks(extendBlockSelection(selection, docRef.current, blockId))

          return
        }

        selectBlocks(createBlockSelection(blockId))
      },

      toggleChecked: (blockId, checked) => {
        latest.current.applyPatches([
          { type: 'block.update', blockId: createBlockId(blockId), attributes: { checked } },
        ])
      },

      focusBlock: refocus,

      commit: (blockId, commit) => {
        if (isSameCommit(findBlockById(docRef.current, blockId), commit)) {
          return
        }

        latest.current.applyPatches([
          {
            type: 'block.update',
            blockId: createBlockId(blockId),
            state: { content: commit.content, text: commit.text },
          },
        ])
      },

      split: (blockId, offset) => {
        const newBlockId = latest.current.generateBlockId()
        latest.current.applyPatches([
          { type: 'block.split', blockId: createBlockId(blockId), offset, newBlockId: createBlockId(newBlockId) },
        ])
        refocus(newBlockId, 'start')
      },

      mergeBackward: (blockId) => {
        const ordered = orderedTextBlocks()
        const index = ordered.findIndex((item) => item.id === blockId)
        const previous = index > 0 ? ordered[index - 1] : undefined
        if (!previous) {
          refocus(blockId, 'start')

          return
        }

        const caretOffset = getInlineContentLength(blockInlineContent(findBlockById(docRef.current, previous.id)))
        latest.current.applyPatches([
          { type: 'block.merge', blockId: createBlockId(blockId), intoBlockId: createBlockId(previous.id) },
        ])
        refocus(previous.id, caretOffset)
      },

      indent: (blockId) => {
        const flattened = flattenDocumentBlocks(docRef.current)
        const item = flattened.find((candidate) => candidate.id === blockId)
        const previousSibling = flattened.find(
          (candidate) => candidate.parentId === item?.parentId && candidate.index === (item?.index ?? 0) - 1,
        )
        if (!item || !previousSibling) {
          refocus(blockId, 'start')

          return
        }

        const newParent = findBlockById(docRef.current, previousSibling.id)
        latest.current.applyPatches([
          {
            type: 'block.move',
            blockId: createBlockId(blockId),
            parentId: createBlockId(previousSibling.id),
            index: newParent?.children?.length ?? 0,
          },
        ])
        refocus(blockId, 'start')
      },

      outdent: (blockId) => {
        const flattened = flattenDocumentBlocks(docRef.current)
        const item = flattened.find((candidate) => candidate.id === blockId)
        const parentItem = flattened.find((candidate) => candidate.id === item?.parentId)
        if (!item || !parentItem || !parentItem.parentId) {
          refocus(blockId, 'start')

          return
        }

        latest.current.applyPatches([
          {
            type: 'block.move',
            blockId: createBlockId(blockId),
            parentId: createBlockId(parentItem.parentId),
            index: parentItem.index + 1,
          },
        ])
        refocus(blockId, 'start')
      },

      navigate: (blockId, direction) => {
        const ordered = orderedTextBlocks()
        const index = ordered.findIndex((item) => item.id === blockId)
        const neighbor = direction === 'up' ? ordered[index - 1] : ordered[index + 1]
        if (!neighbor) {
          refocus(blockId, direction === 'up' ? 'start' : 'end')

          return
        }

        refocus(neighbor.id, direction === 'up' ? 'end' : 'start')
      },

      escape: (blockId) => {
        selectBlocks(createBlockSelection(blockId))
      },

      turnInto: (blockId, type, attrs) => {
        latest.current.onTurnInto?.(blockId, type, attrs)
      },
    }

    return { store, handlers }
    // store/docRef are stable per instance; live values go through `latest`
  }, [store, docRef])

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

  const handleSelectionKeyDown = (event: React.KeyboardEvent) => {
    // Keys already handled by the PM keymap (e.g. the Escape that just
    // CREATED this selection) bubble up defaultPrevented — don't double-handle.
    if (event.defaultPrevented) {
      return
    }

    const { selection } = store.get()
    if (selection.selectedIds.length === 0) {
      return
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault()
      applyPatches(selection.selectedIds.map((id) => ({ type: 'block.delete', blockId: createBlockId(id) })))
      store.set({ selection: clearBlockSelection() })
    }

    if (event.key === 'Escape') {
      store.set({ selection: clearBlockSelection() })
    }
  }

  const sensors = useSensors(useSensor(PointerSensor, POINTER_SENSOR_OPTIONS))

  return (
    <EditorRuntimeContext.Provider value={runtime}>
      <DndContext
        sensors={sensors}
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
          role="tree"
          tabIndex={-1}
          onKeyDown={handleSelectionKeyDown}
          style={{ outline: 'none', position: 'relative' }}
        >
          {doc.root.children?.map((child) => (
            <BlockNode key={child.id} block={child} depth={1} readOnly={readOnly} />
          ))}
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
        </div>
      </DndContext>
    </EditorRuntimeContext.Provider>
  )
}
