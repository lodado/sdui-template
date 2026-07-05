import type { BlockSelectionState, SduiDocumentContent, SduiDocumentPatch } from '@lodado/sdui-document'
import {
  anchorAfterBlock,
  anchorAppendToParent,
  anchorBeforeBlock,
  clearBlockSelection,
  createBlockId,
  createBlockSelection,
  createColumnResizePatches,
  createDefaultBlock,
  extendBlockSelection,
  findBlockById,
  flattenDocumentBlocks,
  getInlineContentLength,
} from '@lodado/sdui-document'
import React, { useMemo, useRef } from 'react'

import type { BlockMenuItem } from '../block-menu/blockMenuItems'
import { blockInlineContent, isSameCommit, isTextBlock } from '../blockContent'
import { NON_TEXT_BLOCK_TYPES } from '../editorConstants'
import type { EditorHandlers } from '../EditorRuntimeContext'
import type { EditorUIStore, FocusTarget } from '../uiStore'

export type UseEditorHandlersInput = {
  store: EditorUIStore
  docRef: React.MutableRefObject<SduiDocumentContent>
  containerRef: React.RefObject<HTMLDivElement>
  applyPatches: (patches: SduiDocumentPatch[]) => void
  generateBlockId: () => string
  onTurnInto?: (blockId: string, type: string, attrs?: Record<string, unknown>) => void
  onUploadFile?: (file: File) => Promise<{ url: string }>
}

export type UseEditorHandlersResult = {
  handlers: EditorHandlers
  fileInputRef: React.RefObject<HTMLInputElement>
}

/**
 * Builds the per-block interaction handlers ONCE per editor instance. The
 * handlers read live values (applyPatches, generateBlockId, callbacks) through
 * a `latest` ref, never through render-scoped closures, so their identities
 * stay stable and memoized rows keep bailing out of re-render.
 */
export function useEditorHandlers(input: UseEditorHandlersInput): UseEditorHandlersResult {
  const { store, docRef, containerRef, applyPatches, generateBlockId, onTurnInto, onUploadFile } = input

  // Live values behind a ref so the once-created handlers never go stale.
  const latest = useRef({ applyPatches, generateBlockId, onTurnInto, onUploadFile })
  latest.current = { applyPatches, generateBlockId, onTurnInto, onUploadFile }

  // Block-menu file picking: the hidden input is clicked for image/file items,
  // and the target block/item wait here until the user chooses a file.
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pendingFilePickRef = useRef<{ blockId: string; item: BlockMenuItem } | null>(null)

  const handlers = useMemo<EditorHandlers>(() => {
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
        latest.current.applyPatches([
          { type: 'block.update', blockId: createBlockId(blockId), attributes: { checked } },
        ])
      },

      toggleCollapsed: (blockId, collapsed) => {
        latest.current.applyPatches([
          { type: 'block.update', blockId: createBlockId(blockId), attributes: { collapsed } },
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

        if (block?.type === 'document.toggle') {
          latest.current.applyPatches([
            {
              type: 'block.update',
              blockId: createBlockId(blockId),
              attributes: { collapsed: block.attributes?.collapsed !== true },
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
