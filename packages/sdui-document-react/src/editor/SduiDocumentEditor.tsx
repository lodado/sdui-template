import type { SduiDocumentContent, SduiDocumentPatch } from '@lodado/sdui-document'
import { clearBlockSelection, findBlockById } from '@lodado/sdui-document'
import {
  type MouseEvent as ReactMouseEvent,
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'

import type { SelectionToolbarProps } from '../selection-toolbar/SelectionToolbar'
import { SelectionToolbar } from '../selection-toolbar/SelectionToolbar'
import { rafThrottle } from '../shared/rafThrottle'
import { BlockActionsMenu } from './block-menu/BlockActionsMenu'
import { defaultGenerateBlockId } from './blockContent'
import { DocEmptyFlag } from './DocEmptyFlag'
import { createDocContentStore, DocumentContentProvider, type MutableDocContentStore } from './DocumentContentContext'
import { DRAG_INDENT_WIDTH } from './editorConstants'
import { type EditorRuntime, EditorRuntimeContext, useEditorRuntime } from './EditorRuntimeContext'
import { collectDeletedPageDocumentIds } from './handlerLogic'
import { useBlockPointerDrag } from './hooks/useBlockPointerDrag'
import { useDocumentPatches } from './hooks/useDocumentPatches'
import { type UnfurlResult, useEditorHandlers } from './hooks/useEditorHandlers'
import { useInlineTextDragDrop } from './hooks/useInlineTextDragDrop'
import { useRangeOperations } from './hooks/useRangeOperations'
import { useSelectionKeyboard } from './hooks/useSelectionKeyboard'
import { LinkPopover, type LinkPopoverTarget } from './LinkPopover'
import { createRenderModelStore } from './renderModel/RenderModelStore'
import { RootBlockList } from './RootBlockList'
import type { EditorUIStore } from './uiStore'
import { createEditorUIStore, useEditorUISelector } from './uiStore'

export { DRAG_INDENT_WIDTH } from './editorConstants'

/** Imperative handle for host chrome (toolbars): history + a content snapshot. */
export type SduiDocumentEditorApi = {
  undo(): void
  redo(): void
  getContent(): SduiDocumentContent
}

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
  /**
   * Creates an empty sub-page document for the "Page" menu item (host wires
   * its repository). Omitted → the Page item is hidden from the block menu.
   */
  onCreatePage?(): Promise<{ documentId: string; title?: string }>
  /**
   * Fired for every page block removed from the document (subtree deletions
   * included) so the host can archive the target document — orphan prevention.
   */
  onArchivePage?(documentId: string): void | Promise<void>
  /**
   * Fetches link-preview metadata for a bookmark URL (host server route — the
   * browser can't fetch cross-origin). Omitted → bookmarks stay URL-only cards.
   */
  onUnfurl?(url: string): Promise<UnfurlResult | undefined>
  readOnly?: boolean
  /** Injectable for deterministic tests; defaults to a random id. */
  generateBlockId?(): string
  className?: string
  /** Optional imperative handle for host chrome (undo/redo/getContent). */
  apiRef?: Ref<SduiDocumentEditorApi>
}

/**
 * The document's single SelectionToolbar. Subscribes to the focused block's
 * published props on its own so a selection change re-renders only this leaf,
 * never the block rows. A cross-block range toolbar takes precedence.
 */
const DocumentSelectionToolbar = ({
  store,
  rangeToolbar,
}: {
  store: EditorUIStore
  rangeToolbar: SelectionToolbarProps | null
}) => {
  const focusToolbar = useEditorUISelector(store, (state) => state.selectionToolbar)
  const activeToolbar = rangeToolbar ?? focusToolbar

  return activeToolbar ? <SelectionToolbar {...activeToolbar} /> : null
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
    onCreatePage,
    onArchivePage,
    onUnfurl,
    readOnly = false,
    generateBlockId = defaultGenerateBlockId,
    className,
    apiRef,
  } = props

  // Render model: rows subscribe per-id so a single-block edit re-renders only
  // that row (O(1)) instead of the root->block ancestor path. Kept in sync at
  // the document's single publish choke point (onPublish) — synchronously,
  // before the state update re-renders, so a freshly inserted block already has
  // an entry by the time its row mounts.
  const renderStoreRef = useRef<ReturnType<typeof createRenderModelStore>>()
  if (!renderStoreRef.current) {
    renderStoreRef.current = createRenderModelStore()
  }
  const renderStore = renderStoreRef.current

  // Whole-tree readers (TOC, empty-flag) subscribe to this stable store instead
  // of a changing context value, so they update on commit without re-rendering
  // the container. Created once; snapshot is swapped at the publish choke point.
  const docStoreRef = useRef<MutableDocContentStore>()
  if (!docStoreRef.current) {
    docStoreRef.current = createDocContentStore()
  }
  const docStore = docStoreRef.current

  const {
    docRef,
    applyPatches: applyPatchesRaw,
    undo,
    redo,
  } = useDocumentPatches({
    content,
    onContentChange,
    onPublish: (prev, next) => {
      renderStore.sync(prev.root, next.root)
      docStore.setSnapshot(next)
    },
    generateBlockId,
    readOnly,
  })

  // Archive choke point: every deletion path (block actions, backspace, range
  // delete) funnels through applyPatches, so removed page blocks are collected
  // here — BEFORE apply — and their target documents reported to the host.
  const onArchivePageRef = useRef(onArchivePage)
  onArchivePageRef.current = onArchivePage
  const applyPatches = useCallback(
    (patches: SduiDocumentPatch[]) => {
      const archive = onArchivePageRef.current
      const removedPageDocIds = archive ? collectDeletedPageDocumentIds(docRef.current, patches) : []
      applyPatchesRaw(patches)
      removedPageDocIds.forEach((documentId) => {
        Promise.resolve(archive?.(documentId)).catch((error: unknown) => {
          // eslint-disable-next-line no-console
          console.warn('[sdui-document-react] onArchivePage failed', documentId, error)
        })
      })
    },
    [applyPatchesRaw, docRef],
  )

  // Seed both derived stores once, before children first render.
  const seededRef = useRef(false)
  if (!seededRef.current) {
    renderStore.sync(null, docRef.current.root)
    docStore.setSnapshot(docRef.current)
    seededRef.current = true
  }
  const rootId = docRef.current.root.id

  const containerRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const inlineCaretRef = useRef<HTMLDivElement>(null)
  const storeRef = useRef<EditorUIStore>()
  if (!storeRef.current) {
    storeRef.current = createEditorUIStore()
  }
  const store = storeRef.current

  // useEditorHandlers is built before useSelectionKeyboard (which owns the
  // history step with caret landing), so a focused block's Mod-Z delegation
  // reaches it through this ref, assigned once the keyboard hook exists below.
  const historyStepRef = useRef<(direction: 'undo' | 'redo') => void>(() => {})

  const { handlers, fileInputRef } = useEditorHandlers({
    store,
    docRef,
    containerRef,
    applyPatches,
    generateBlockId,
    onHistory: (direction) => historyStepRef.current(direction),
    onTurnInto,
    onUploadFile,
    onCreatePage,
    onUnfurl,
  })
  const canCreatePage = onCreatePage !== undefined
  const runtime = useMemo<EditorRuntime>(
    () => ({ store, handlers, renderStore, capabilities: { canCreatePage } }),
    [store, handlers, renderStore, canCreatePage],
  )

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

  // Selection at drag start, captured before onDragStart clears it — lets a drag
  // that began on a selected block move the whole selection together.
  const dragSelectionRef = useRef<string[]>([])
  useBlockPointerDrag({
    docRef,
    indentWidth: DRAG_INDENT_WIDTH,
    containerRef,
    indicatorRef,
    applyPatches,
    onDragStart: () => {
      dragSelectionRef.current = store.get().selection.selectedIds
      // Editing/selection state must not survive a drag: unmount commits the PM editor.
      store.set({ focus: null, selection: clearBlockSelection() })
    },
    getSelectedIds: () => dragSelectionRef.current,
  })

  const { handleSelectionKeyDown, handlePaddingClick, historyStep, handleBlockClipboard } = useSelectionKeyboard({
    store,
    docRef,
    readOnly,
    applyPatches,
    undo,
    redo,
    generateBlockId,
    focusBlock: runtime.handlers.focusBlock,
  })
  historyStepRef.current = historyStep

  // Route undo/redo through historyStep (not raw undo/redo) so the focused PM
  // editor unmounts first — a pending blur-commit can't stomp the undone state.
  useImperativeHandle(
    apiRef,
    () => ({
      undo: () => historyStepRef.current('undo'),
      redo: () => historyStepRef.current('redo'),
      getContent: () => docRef.current,
    }),
    [docRef, historyStepRef],
  )

  const [linkTarget, setLinkTarget] = useState<LinkPopoverTarget | null>(null)
  // The clicked link element; the popover is position:fixed at its viewport rect,
  // so we re-measure from the live element on scroll/resize to keep it attached.
  const linkAnchorRef = useRef<Element | null>(null)
  const isLinkPopoverOpen = linkTarget !== null

  useEffect(() => {
    if (!isLinkPopoverOpen) {
      return undefined
    }
    const reposition = rafThrottle(() => {
      const el = linkAnchorRef.current
      if (!el || !el.isConnected) {
        setLinkTarget(null)
        return
      }
      setLinkTarget((prev) => (prev ? { ...prev, rect: el.getBoundingClientRect() } : prev))
    })
    // Capture phase catches nested scroll containers (scroll doesn't bubble).
    window.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
    return () => {
      reposition.cancel()
      window.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
    }
  }, [isLinkPopoverOpen])
  const blockActions = useEditorUISelector(store, (state) => state.blockActions)
  // Current colors of the block whose actions menu is open (for the check mark).
  const blockActionsColors = (() => {
    const attrs = blockActions ? findBlockById(docRef.current, blockActions.blockId)?.attributes : undefined
    return {
      textColor: typeof attrs?.textColor === 'string' ? attrs.textColor : undefined,
      backgroundColor: typeof attrs?.backgroundColor === 'string' ? attrs.backgroundColor : undefined,
    }
  })()

  // Cross-block native selections have no focused PM to own them, so their
  // keyboard ops (delete, mark toggles) are handled at the document level.
  const {
    handleRangeKeyDown,
    handleClipboard,
    toolbar: rangeToolbar,
  } = useRangeOperations({
    store,
    docRef,
    containerRef,
    readOnly,
    applyPatches,
    focusBlock: runtime.handlers.focusBlock,
  })
  const rangeKeyRef = useRef(handleRangeKeyDown)
  rangeKeyRef.current = handleRangeKeyDown
  const clipboardRef = useRef(handleClipboard)
  clipboardRef.current = handleClipboard
  const blockClipboardRef = useRef(handleBlockClipboard)
  blockClipboardRef.current = handleBlockClipboard
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      rangeKeyRef.current(event)
    }
    const onClipboard = (event: ClipboardEvent) => {
      // Block-selection copy/cut owns the event first; otherwise fall through to
      // the cross-block range clipboard (which no-ops when blocks are selected).
      if (blockClipboardRef.current(event)) {
        return
      }
      clipboardRef.current(event)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('copy', onClipboard)
    document.addEventListener('cut', onClipboard)
    document.addEventListener('paste', onClipboard)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('copy', onClipboard)
      document.removeEventListener('cut', onClipboard)
      document.removeEventListener('paste', onClipboard)
    }
  }, [])

  // Editable mode: intercept a link click so it opens the action popover instead
  // of navigating. Cmd/Ctrl+click and links inside the focused PM editor pass
  // through (the toolbar's link editor owns the latter). Read-only keeps native
  // navigation — correct for a viewer.
  const handleLinkClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (readOnly || event.metaKey || event.ctrlKey) {
      return
    }
    const anchor = (event.target as Element).closest?.('a.sdui-doc-link')
    if (!anchor || anchor.closest('[data-testid="focused-block-editor"]')) {
      return
    }
    const blockId = anchor.closest('[data-block-id]')?.getAttribute('data-block-id')
    const href = anchor.getAttribute('href')
    if (!blockId || !href) {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    linkAnchorRef.current = anchor
    setLinkTarget({ rect: anchor.getBoundingClientRect(), href, blockId })
  }

  return (
    <EditorRuntimeContext.Provider value={runtime}>
      <DocumentContentProvider value={docStore}>
        {/* Block drag & drop is native-pointer (useBlockPointerDrag) — no dnd-kit
            context, so a drag never re-renders the block tree. */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
        <div
          ref={containerRef}
          className={className}
          data-sdui-document-editor
          role="tree"
          tabIndex={-1}
          onKeyDown={handleSelectionKeyDown}
          onClickCapture={handleLinkClickCapture}
          style={{ outline: 'none', position: 'relative' }}
        >
          <RootBlockList rootId={rootId} readOnly={readOnly} />
          {/* null leaf: paints data-doc-empty on the container via ref, no container re-render */}
          <DocEmptyFlag containerRef={containerRef} />
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
          {/* one toolbar for the whole document; range (cross-block) wins over
              the focused block's own selection. Isolated in its own subscriber so
              a selection change never re-renders the block rows. */}
          <DocumentSelectionToolbar store={store} rangeToolbar={rangeToolbar} />
          {linkTarget && (
            <LinkPopover
              target={linkTarget}
              onEdit={(nextHref) => {
                runtime.handlers.updateLink(linkTarget.blockId, linkTarget.href, nextHref)
                setLinkTarget(null)
              }}
              onRemove={() => {
                runtime.handlers.updateLink(linkTarget.blockId, linkTarget.href, null)
                setLinkTarget(null)
              }}
              onClose={() => setLinkTarget(null)}
            />
          )}
          {!readOnly && blockActions && (
            <BlockActionsMenu
              rect={blockActions.rect}
              onTurnInto={(type, attrs) => {
                runtime.handlers.turnInto(blockActions.blockId, type, attrs)
                runtime.handlers.closeBlockActions()
              }}
              onDuplicate={() => runtime.handlers.duplicateBlock(blockActions.blockId)}
              onMoveUp={() => {
                runtime.handlers.moveBlock(blockActions.blockId, 'up')
                runtime.handlers.closeBlockActions()
              }}
              onMoveDown={() => {
                runtime.handlers.moveBlock(blockActions.blockId, 'down')
                runtime.handlers.closeBlockActions()
              }}
              onDelete={() => runtime.handlers.deleteBlock(blockActions.blockId)}
              onCopyLink={() => {
                // Deep link to the block via a URL fragment (BlockNode renders data-block-id).
                if (typeof window !== 'undefined') {
                  const { origin, pathname } = window.location
                  window.navigator?.clipboard
                    ?.writeText(`${origin}${pathname}#${blockActions.blockId}`)
                    ?.catch(() => {})
                }
                runtime.handlers.closeBlockActions()
              }}
              onSetColor={(change) => runtime.handlers.setBlockColor(blockActions.blockId, change)}
              currentTextColor={blockActionsColors.textColor}
              currentBackgroundColor={blockActionsColors.backgroundColor}
              onClose={() => runtime.handlers.closeBlockActions()}
              onCancel={() => store.set({ selection: clearBlockSelection(), blockActions: null })}
            />
          )}
        </div>
      </DocumentContentProvider>
    </EditorRuntimeContext.Provider>
  )
}
