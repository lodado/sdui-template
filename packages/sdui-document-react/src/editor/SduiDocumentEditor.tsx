import { DndContext, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import type {
  BlockSelectionState,
  SduiDocumentBlock,
  SduiDocumentContent,
  SduiDocumentPatch,
} from '@lodado/sdui-document'
import {
  anchorAfterBlock,
  anchorAppendToParent,
  anchorBeforeBlock,
  clearBlockSelection,
  createBlockId,
  createBlockSelection,
  createDefaultBlock,
  createTrailingBlockPatch,
  extendBlockSelection,
  findBlockById,
  flattenDocumentBlocks,
  getInlineContentLength,
  isEmptyDocument,
} from '@lodado/sdui-document'
import React, { useContext, useMemo, useRef } from 'react'

import { BlockChrome } from '../block-types/BlockChrome'
import type { FocusedBlockCommit } from '../focused-block/FocusedBlockEditor'
import { FocusedBlockEditor } from '../focused-block/FocusedBlockEditor'
import { InlineContentView } from '../inline/InlineContentView'
import type { BlockMenuItem } from './block-menu/blockMenuItems'
import {
  blockInlineContent,
  cloneBlockWithNewIds,
  defaultGenerateBlockId,
  isSameCommit,
  isTextBlock,
} from './blockContent'
import { collisionDetection, DRAG_INDENT_WIDTH, NON_TEXT_BLOCK_TYPES, POINTER_SENSOR_OPTIONS } from './editorConstants'
import { useDocumentPatches } from './hooks/useDocumentPatches'
import { useInlineTextDragDrop } from './hooks/useInlineTextDragDrop'
import { useNestedBlockDragDrop } from './hooks/useNestedBlockDragDrop'
import type { EditorUIStore, FocusTarget } from './uiStore'
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
  blockMenuSelect(blockId: string, item: BlockMenuItem, extraAttributes?: Record<string, unknown>): void
  blockMenuFilePicked(file: File): void
  insertBlockBelow(blockId: string): void
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
            data-plus-handle
            aria-label={`Add block below ${block.id}`}
            onClick={() => handlers.insertBlockBelow(block.id)}
          />
        )}
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
                  autoOpenBlockMenu={focus.openBlockMenu === true}
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
                  onBlockMenuSelect={(item, extra) => handlers.blockMenuSelect(block.id, item, extra)}
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

  // Live values behind a ref so the once-created handlers never go stale.
  const latest = useRef({ applyPatches, generateBlockId, onTurnInto, onUploadFile })
  latest.current = { applyPatches, generateBlockId, onTurnInto, onUploadFile }

  // Block-menu file picking: the hidden input is clicked for image/file items,
  // and the target block/item wait here until the user chooses a file.
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pendingFilePickRef = useRef<{ blockId: string; item: BlockMenuItem } | null>(null)

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

    /**
     * Notion semantics: an empty block converts in place (block.setType),
     * a non-empty block gets a new default sibling below (block.insert).
     * Returns the id that received the type, or null when the block has no
     * insert position (root-less).
     */
    const applyMenuType = (
      blockId: string,
      item: BlockMenuItem,
      attributes: Record<string, unknown> | undefined,
      extraState?: Record<string, unknown>,
    ): string | null => {
      const source = findBlockById(docRef.current, blockId)
      const isEmpty = getInlineContentLength(blockInlineContent(source)) === 0

      if (isEmpty) {
        const patches: SduiDocumentPatch[] = [
          {
            type: 'block.setType',
            blockId: createBlockId(blockId),
            blockType: item.type,
            ...(attributes ? { attributes } : {}),
          },
        ]
        if (extraState) {
          patches.push({ type: 'block.update', blockId: createBlockId(blockId), state: extraState })
        }

        latest.current.applyPatches(patches)

        return blockId
      }

      const flattened = flattenDocumentBlocks(docRef.current)
      const location = flattened.find((candidate) => candidate.id === blockId)
      if (!location?.parentId) {
        return null
      }

      const newId = latest.current.generateBlockId()
      const base = createDefaultBlock(item.type, newId, attributes)
      const block = extraState ? { ...base, state: { ...base.state, ...extraState } } : base
      latest.current.applyPatches([
        {
          type: 'block.insert',
          parentId: createBlockId(location.parentId),
          ...anchorAfterBlock(docRef.current, location.parentId, blockId),
          block,
        },
      ])

      return newId
    }

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
            ...anchorAppendToParent(docRef.current, previousSibling.id),
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
            ...anchorAfterBlock(docRef.current, parentItem.parentId, parentItem.id),
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

        const neighbor = flattenDocumentBlocks(docRef.current).find(
          (candidate) => candidate.parentId === item.parentId && candidate.index === targetIndex,
        )
        if (!neighbor) {
          return
        }

        latest.current.applyPatches([
          {
            type: 'block.move',
            blockId: createBlockId(blockId),
            parentId: createBlockId(item.parentId),
            ...(direction === 'up'
              ? anchorBeforeBlock(docRef.current, item.parentId, neighbor.id)
              : anchorAfterBlock(docRef.current, item.parentId, neighbor.id)),
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

      blockMenuSelect: (blockId, item, extraAttributes) => {
        if (item.action === 'file') {
          // no patches yet — a cancelled picker must leave the document untouched
          pendingFilePickRef.current = { blockId, item }
          fileInputRef.current?.click()

          return
        }

        const merged = { ...item.attributes, ...extraAttributes }
        const attributes = Object.keys(merged).length > 0 ? merged : undefined
        const targetId = applyMenuType(blockId, item, attributes)
        if (!targetId) {
          return
        }

        if (NON_TEXT_BLOCK_TYPES.has(item.type)) {
          selectBlocks(createBlockSelection(targetId))
        } else {
          refocus(targetId, 'start')
        }
      },

      blockMenuFilePicked: (file) => {
        const pending = pendingFilePickRef.current
        pendingFilePickRef.current = null
        if (!pending) {
          return
        }

        const isImage = pending.item.type === 'document.image'
        // FileBlock reads attributes.name (download label); ImageBlock reads alt
        const nameAttributes = isImage ? { alt: file.name } : { name: file.name }
        const targetId = applyMenuType(
          pending.blockId,
          pending.item,
          { ...pending.item.attributes, ...nameAttributes },
          { upload: 'uploading' },
        )
        if (!targetId) {
          return
        }

        selectBlocks(createBlockSelection(targetId))

        // The upload resolves after arbitrary user edits — the block may be
        // gone (undo, delete). Existence is re-checked before every patch.
        const finish = (attributes: Record<string, unknown>) => {
          if (!findBlockById(docRef.current, targetId)) {
            return
          }

          latest.current.applyPatches([
            { type: 'block.update', blockId: createBlockId(targetId), state: { upload: undefined }, attributes },
          ])
        }

        const upload = latest.current.onUploadFile
        if (!upload) {
          finish(isImage ? { src: URL.createObjectURL(file) } : { url: URL.createObjectURL(file) })

          return
        }

        upload(file).then(
          ({ url }) => finish(isImage ? { src: url } : { url }),
          () => {
            if (!findBlockById(docRef.current, targetId)) {
              return
            }

            latest.current.applyPatches([
              { type: 'block.update', blockId: createBlockId(targetId), state: { upload: 'error' } },
            ])
          },
        )
      },

      insertBlockBelow: (blockId) => {
        const flattened = flattenDocumentBlocks(docRef.current)
        const location = flattened.find((candidate) => candidate.id === blockId)
        if (!location?.parentId) {
          return
        }

        const newId = latest.current.generateBlockId()
        latest.current.applyPatches([
          {
            type: 'block.insert',
            parentId: createBlockId(location.parentId),
            ...anchorAfterBlock(docRef.current, location.parentId, blockId),
            block: createDefaultBlock('document.paragraph', newId),
          },
        ])

        const previous = store.get().focus
        store.set({
          selection: clearBlockSelection(),
          focus: { blockId: newId, caret: 'start', session: (previous?.session ?? 0) + 1, openBlockMenu: true },
        })
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
