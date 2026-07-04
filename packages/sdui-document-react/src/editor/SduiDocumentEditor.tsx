import type { CollisionDetection } from '@dnd-kit/core'
import {
  DndContext,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
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
  createTrailingBlockPatch,
  extendBlockSelection,
  findBlockById,
  flattenDocumentBlocks,
  getInlineContentLength,
  isEmptyDocument,
  textToInlineContent,
} from '@lodado/sdui-document'
import React, { useContext, useMemo, useRef } from 'react'

import { BlockChrome } from '../block-types/BlockChrome'
import type { FocusedBlockCommit } from '../focused-block/FocusedBlockEditor'
import { FocusedBlockEditor } from '../focused-block/FocusedBlockEditor'
import { InlineContentView } from '../inline/InlineContentView'
import { useDocumentPatches } from './hooks/useDocumentPatches'
import { useInlineTextDragDrop } from './hooks/useInlineTextDragDrop'
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

// The pointer decides the drop row (vertical zones need the exact row under
// the cursor); rect intersection only as a fallback when the pointer is
// between rows (e.g. heading margins).
const collisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args)

  return pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args)
}

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

/** Deep-clones a subtree with fresh ids — Mod-D duplicate (Notion behavior). */
function cloneBlockWithNewIds(block: SduiDocumentBlock, generateId: () => string): SduiDocumentBlock {
  return {
    ...block,
    id: createBlockId(generateId()),
    ...(block.children ? { children: block.children.map((child) => cloneBlockWithNewIds(child, generateId)) } : {}),
  }
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
  moveBlock(blockId: string, direction: 'up' | 'down'): void
  blockAction(blockId: string): void
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
  const {
    setNodeRef: setDragRef,
    listeners,
    attributes,
    isDragging,
  } = useDraggable({ id: block.id, disabled: readOnly })

  const isFocused = !readOnly && focus !== null && isTextBlock(block)

  // span keeps the chrome wrapper (<p>/<h1>…) valid — div may not nest there
  const staticView = readOnly ? (
    <span className="sdui-doc-static" data-inline-root>
      <InlineContentView content={blockInlineContent(block)} />
    </span>
  ) : (
    <span
      className="sdui-doc-static"
      data-inline-root
      role="textbox"
      tabIndex={0}
      onClick={() => {
        // a non-collapsed selection means the user just selected text to drag
        // (or copy) — focusing now would mount PM and destroy that selection
        const selection = window.getSelection()
        if (selection && !selection.isCollapsed) {
          return
        }

        handlers.focusBlock(block.id, 'start')
      }}
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
    <div data-block-id={block.id} data-depth={depth} data-selected={isSelected || undefined}>
      {/* row layout (flex + vertical centering + Notion block height) lives in editor.css */}
      {/* the ROW is the droppable — not the subtree wrapper — so the drop
          projection's vertical zones are measured against this row only */}
      <div ref={setDropRef} data-block-row>
        {/* the ⠿ glyph is CSS ::before content — a real text node would join
            cross-block native selections and get copied between blocks */}
        {!readOnly && (
          <button
            type="button"
            ref={setDragRef}
            data-drag-handle
            data-dragging={isDragging || undefined}
            aria-label={`Drag block ${block.id}`}
            style={{ cursor: 'grab', border: 'none', background: 'transparent', padding: '2px 4px' }}
            onClick={(event) => handlers.handleClick(block.id, event.shiftKey)}
            // eslint-disable-next-line react/jsx-props-no-spreading -- dnd-kit activator contract
            {...attributes}
            // eslint-disable-next-line react/jsx-props-no-spreading -- dnd-kit activator contract
            {...listeners}
          />
        )}
        <div data-block-content>
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
                  onMoveBlock={(direction) => handlers.moveBlock(block.id, direction)}
                  onBlockAction={() => handlers.blockAction(block.id)}
                  onEscape={() => handlers.escape(block.id)}
                  onBlockMenuSelect={() => {}}
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
        const source = findBlockById(docRef.current, blockId)
        const patches: SduiDocumentPatch[] = [
          { type: 'block.split', blockId: createBlockId(blockId), offset, newBlockId: createBlockId(newBlockId) },
        ]

        // Notion split policy: Enter never continues a heading — the
        // continuation block becomes body text (setType with no attributes
        // also clears the inherited heading level).
        if (source?.type === 'document.heading') {
          patches.push({ type: 'block.setType', blockId: createBlockId(newBlockId), blockType: 'document.paragraph' })
        }

        latest.current.applyPatches(patches)
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
        // consumer override wins (legacy contract); default is a block.setType patch
        if (latest.current.onTurnInto) {
          latest.current.onTurnInto(blockId, type, attrs)

          return
        }

        latest.current.applyPatches([
          {
            type: 'block.setType',
            blockId: createBlockId(blockId),
            blockType: type,
            ...(attrs ? { attributes: attrs } : {}),
          },
        ])

        // turning into a non-text type ends the inline session — select the block
        if (NON_TEXT_BLOCK_TYPES.has(type)) {
          selectBlocks(createBlockSelection(blockId))
        }
      },

      moveBlock: (blockId, direction) => {
        const flattened = flattenDocumentBlocks(docRef.current)
        const item = flattened.find((candidate) => candidate.id === blockId)
        if (!item?.parentId) {
          return
        }

        const parent = findBlockById(docRef.current, item.parentId)
        const siblingCount = parent?.children?.length ?? 0
        const targetIndex = item.index + (direction === 'up' ? -1 : 1)
        if (targetIndex < 0 || targetIndex >= siblingCount) {
          return
        }

        latest.current.applyPatches([
          {
            type: 'block.move',
            blockId: createBlockId(blockId),
            parentId: createBlockId(item.parentId),
            index: targetIndex,
          },
        ])
      },

      blockAction: (blockId) => {
        const block = findBlockById(docRef.current, blockId)
        if (block?.type === 'document.checklist') {
          latest.current.applyPatches([
            {
              type: 'block.update',
              blockId: createBlockId(blockId),
              attributes: { checked: block.attributes?.checked !== true },
            },
          ])
        }
      },
    }

    return { store, handlers }
    // store/docRef are stable per instance; live values go through `latest`
  }, [store, docRef])

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
          { type: 'block.insert', parentId: createBlockId(item.parentId), index: item.index + 1, block: clone },
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
