import type {
  BlockSelectionState,
  SduiDocumentContent,
  SduiDocumentPatch,
  SduiInlineContent,
} from '@lodado/sdui-document'
import {
  anchorAfterBlock,
  clearBlockSelection,
  createBlockId,
  createBlockSelection,
  createColumnResizePatches,
  extendBlockSelection,
  findBlockById,
  flattenDocumentBlocks,
  PAGE_BLOCK_TYPE,
  TOGGLE_BLOCK_TYPE,
} from '@lodado/sdui-document'
import React, { useMemo, useRef } from 'react'

import { normalizeLinkHref } from '../../focused-block/linkHref'
import { updateLinkMark } from '../../inline/updateLinkMark'
import type { BlockMenuItem } from '../block-menu/blockMenuItems'
import { cloneBlockWithNewIds, isSameCommit } from '../blockContent'
import { NON_TEXT_BLOCK_TYPES } from '../editorConstants'
import type { EditorHandlers } from '../EditorRuntimeContext'
import type { HandlerDecision, HandlerFocusIntent } from '../handlerLogic'
import {
  blockAttrsPatch,
  computeAddCollectionItem,
  computeApplyMenuType,
  computeIndent,
  computeInsertBlockBelow,
  computeInsertToggleChild,
  computeMergeBackward,
  computeMoveBlock,
  computeNavigate,
  computeOutdent,
  computeSetCollectionAttrs,
  computeSetItemProperty,
  computeSplit,
  computeTurnInto,
} from '../handlerLogic'
import type { EditorUIStore } from '../uiStore'

export type UseEditorHandlersInput = {
  store: EditorUIStore
  docRef: React.MutableRefObject<SduiDocumentContent>
  containerRef: React.RefObject<HTMLDivElement>
  applyPatches: (patches: SduiDocumentPatch[]) => void
  generateBlockId: () => string
  /** Delegated document-level undo/redo (from a focused block's empty PM history). */
  onHistory: (direction: 'undo' | 'redo') => void
  onTurnInto?: (blockId: string, type: string, attrs?: Record<string, unknown>) => void
  onUploadFile?: (file: File) => Promise<{ url: string }>
  onCreatePage?: () => Promise<{ documentId: string; title?: string }>
}

export type UseEditorHandlersResult = {
  handlers: EditorHandlers
  fileInputRef: React.RefObject<HTMLInputElement>
}

/**
 * Imperative shell around the pure decision logic in `../handlerLogic`.
 *
 * Builds the per-block interaction handlers ONCE per editor instance. The
 * handlers read live values (applyPatches, generateBlockId, callbacks) through
 * a `latest` ref, never through render-scoped closures, so their identities
 * stay stable and memoized rows keep bailing out of re-render.
 */
export function useEditorHandlers(input: UseEditorHandlersInput): UseEditorHandlersResult {
  const {
    store,
    docRef,
    containerRef,
    applyPatches,
    generateBlockId,
    onHistory,
    onTurnInto,
    onUploadFile,
    onCreatePage,
  } = input

  // Live values behind a ref so the once-created handlers never go stale.
  const latest = useRef({ applyPatches, generateBlockId, onHistory, onTurnInto, onUploadFile, onCreatePage })
  latest.current = { applyPatches, generateBlockId, onHistory, onTurnInto, onUploadFile, onCreatePage }

  // Block-menu file picking: the hidden input is clicked for image/file items,
  // and the target block/item wait here until the user chooses a file.
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pendingFilePickRef = useRef<{ blockId: string; item: BlockMenuItem } | null>(null)

  const handlers = useMemo<EditorHandlers>(() => {
    const selectBlocks = (next: BlockSelectionState) => {
      store.set({ selection: next, focus: null, blockActions: null })
      if (next.selectedIds.length > 0) {
        containerRef.current?.focus()
      }
    }

    // The session bump lives here (shell state): it forces a fresh PM mount
    // even when blockId stays the same, so it must not leak into pure logic.
    const applyFocusIntent = (intent: HandlerFocusIntent) => {
      const previous = store.get().focus
      store.set({
        selection: clearBlockSelection(),
        blockActions: null,
        focus: {
          blockId: intent.blockId,
          caret: intent.caret,
          session: (previous?.session ?? 0) + 1,
          ...(intent.justInserted ? { justInserted: true } : {}),
          ...(intent.openBlockMenu ? { openBlockMenu: true } : {}),
        },
      })
    }

    const refocus = (blockId: string, caret: HandlerFocusIntent['caret'], justInserted?: boolean) => {
      applyFocusIntent({ blockId, caret, ...(justInserted ? { justInserted: true } : {}) })
    }

    // Effect runner for pure decisions: patches first, then focus/selection —
    // the order the store consumers depend on.
    const applyDecision = (decision: HandlerDecision | null) => {
      if (!decision) {
        return
      }
      if (decision.patches.length > 0) {
        latest.current.applyPatches(decision.patches)
      }
      if (decision.focus) {
        applyFocusIntent(decision.focus)
      }
      if (decision.selectBlockId) {
        selectBlocks(createBlockSelection(decision.selectBlockId))
      }
    }

    // id thunk: pure logic pulls fresh ids lazily so id consumption order
    // matches the legacy behavior (deterministic id seeds in tests)
    const nextBlockId = () => latest.current.generateBlockId()

    const insertToggleChild = (blockId: string) => {
      applyDecision(computeInsertToggleChild(docRef.current, blockId, nextBlockId))
    }

    const setCollectionAttrs = (collectionId: string, partial: Record<string, unknown>) => {
      applyDecision(computeSetCollectionAttrs(docRef.current, collectionId, partial))
    }

    const setItemProperty = (itemId: string, propertyId: string, value: unknown) => {
      applyDecision(computeSetItemProperty(docRef.current, itemId, propertyId, value))
    }

    const addCollectionItem = (collectionId: string) => {
      // Document first, item block second — a failed creation touches nothing.
      const createPage = latest.current.onCreatePage
      if (!createPage) {
        return
      }
      createPage().then(
        ({ documentId, title }) => {
          applyDecision(computeAddCollectionItem(docRef.current, collectionId, { documentId, title }, nextBlockId))
        },
        (error: unknown) => {
          // eslint-disable-next-line no-console
          console.warn('[sdui-document-react] onCreatePage failed — collection item not added', error)
        },
      )
    }

    const editorHandlers: EditorHandlers = {
      handleClick: (blockId, shiftKey) => {
        const { selection } = store.get()
        if (shiftKey && selection.anchorId) {
          selectBlocks(extendBlockSelection(selection, docRef.current, blockId))

          return
        }

        selectBlocks(createBlockSelection(blockId))
      },

      toggleChecked: (blockId, checked) => {
        latest.current.applyPatches([blockAttrsPatch(blockId, { checked })])
      },

      toggleCollapsed: (blockId, collapsed) => {
        latest.current.applyPatches([blockAttrsPatch(blockId, { collapsed })])
      },

      setCodeLanguage: (blockId, language) => {
        latest.current.applyPatches([blockAttrsPatch(blockId, { language })])
      },

      setCalloutIcon: (blockId, icon) => {
        latest.current.applyPatches([blockAttrsPatch(blockId, { icon })])
      },

      setBlockAlign: (blockId, align) => {
        latest.current.applyPatches([blockAttrsPatch(blockId, { align: align ?? undefined })])
      },

      setImageLayout: (blockId, layout) => {
        latest.current.applyPatches([blockAttrsPatch(blockId, { ...layout })])
      },

      updateLink: (blockId, href, nextHref) => {
        const block = findBlockById(docRef.current, blockId)
        const content = block?.state?.content as SduiInlineContent | undefined
        if (!content) {
          return
        }
        const normalized = nextHref === null ? null : normalizeLinkHref(nextHref)
        // A bad edit URL (normalize → null) is a no-op, not a silent link wipe.
        if (nextHref !== null && normalized === null) {
          return
        }
        const nextContent = updateLinkMark(content, href, normalized)
        latest.current.applyPatches([
          { type: 'block.update', blockId: createBlockId(blockId), state: { content: nextContent } },
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
        applyDecision(computeSplit(docRef.current, { blockId, offset, nextBlockId }))
      },

      mergeBackward: (blockId) => {
        applyDecision(computeMergeBackward(docRef.current, blockId))
      },

      indent: (blockId) => {
        applyDecision(computeIndent(docRef.current, blockId))
      },

      outdent: (blockId) => {
        applyDecision(computeOutdent(docRef.current, blockId))
      },

      navigate: (blockId, direction) => {
        applyDecision(computeNavigate(docRef.current, blockId, direction))
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

        applyDecision(computeTurnInto(docRef.current, blockId, type, attrs))
      },

      moveBlock: (blockId, direction) => {
        applyDecision(computeMoveBlock(docRef.current, blockId, direction))
      },

      openBlockActions: (blockId, rect) => {
        // Open the ⠿ menu and mark the block selected so its row highlights beneath the menu.
        store.set({ selection: createBlockSelection(blockId), focus: null, blockActions: { blockId, rect } })
      },

      closeBlockActions: () => {
        store.set({ blockActions: null })
      },

      duplicateBlock: (blockId) => {
        const flattened = flattenDocumentBlocks(docRef.current)
        const location = flattened.find((candidate) => candidate.id === blockId)
        const source = findBlockById(docRef.current, blockId)
        if (!location?.parentId || !source) {
          store.set({ blockActions: null })

          return
        }

        const clone = cloneBlockWithNewIds(source, latest.current.generateBlockId)
        latest.current.applyPatches([
          {
            type: 'block.insert',
            parentId: createBlockId(location.parentId),
            ...anchorAfterBlock(docRef.current, location.parentId, blockId),
            block: clone,
          },
        ])
        store.set({ selection: createBlockSelection(clone.id), focus: null, blockActions: null })
      },

      deleteBlock: (blockId) => {
        latest.current.applyPatches([{ type: 'block.delete', blockId: createBlockId(blockId) }])
        store.set({ selection: clearBlockSelection(), focus: null, blockActions: null })
      },

      history: (direction) => {
        latest.current.onHistory(direction)
      },

      blockAction: (blockId) => {
        const block = findBlockById(docRef.current, blockId)
        if (block?.type === 'document.checklist') {
          latest.current.applyPatches([blockAttrsPatch(blockId, { checked: block.attributes?.checked !== true })])
        }

        if (block?.type === TOGGLE_BLOCK_TYPE) {
          latest.current.applyPatches([blockAttrsPatch(blockId, { collapsed: block.attributes?.collapsed !== true })])
        }
      },

      blockMenuSelect: (blockId, item, extraAttributes) => {
        if (item.action === 'file') {
          // no patches yet — a cancelled picker must leave the document untouched
          pendingFilePickRef.current = { blockId, item }
          fileInputRef.current?.click()

          return
        }

        if (item.type === PAGE_BLOCK_TYPE) {
          // Document first, block second: no patch until the host created the
          // target, so a failed creation leaves the document untouched.
          const createPage = latest.current.onCreatePage
          if (!createPage) {
            return
          }

          createPage().then(
            ({ documentId, title }) => {
              const applied = computeApplyMenuType(docRef.current, {
                blockId,
                type: item.type,
                attributes: { ...item.attributes, documentId },
                ...(title ? { extraState: { text: title } } : {}),
                nextBlockId,
              })
              if (!applied) {
                return
              }

              latest.current.applyPatches(applied.patches)
              selectBlocks(createBlockSelection(applied.targetId))
            },
            (error: unknown) => {
              // eslint-disable-next-line no-console
              console.warn('[sdui-document-react] onCreatePage failed — page block not inserted', error)
            },
          )

          return
        }

        const merged = { ...item.attributes, ...extraAttributes }
        const attributes = Object.keys(merged).length > 0 ? merged : undefined
        const applied = computeApplyMenuType(docRef.current, {
          blockId,
          type: item.type,
          attributes,
          nextBlockId,
        })
        if (!applied) {
          return
        }

        latest.current.applyPatches(applied.patches)
        if (NON_TEXT_BLOCK_TYPES.has(item.type)) {
          selectBlocks(createBlockSelection(applied.targetId))
        } else {
          refocus(applied.targetId, 'start', true)
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
        const applied = computeApplyMenuType(docRef.current, {
          blockId: pending.blockId,
          type: pending.item.type,
          attributes: { ...pending.item.attributes, ...nameAttributes },
          extraState: { upload: 'uploading' },
          nextBlockId,
        })
        if (!applied) {
          return
        }

        latest.current.applyPatches(applied.patches)
        const { targetId } = applied
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

      insertToggleChild,

      addCollectionItem,
      setCollectionAttrs,
      setItemProperty,

      insertBlockBelow: (blockId) => {
        applyDecision(computeInsertBlockBelow(docRef.current, blockId, nextBlockId))
      },

      resizeColumnPair: (leftColumnId, rightColumnId, deltaFraction) => {
        const patches = createColumnResizePatches({
          content: docRef.current,
          leftColumnId,
          rightColumnId,
          deltaFraction,
        })
        if (patches) {
          latest.current.applyPatches(patches)
        }
      },
    }

    return editorHandlers
    // store/docRef are stable per instance; live values go through `latest`
  }, [store, docRef, containerRef])

  return { handlers, fileInputRef }
}
