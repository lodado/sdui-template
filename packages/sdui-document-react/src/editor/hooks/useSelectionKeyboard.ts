import type { SduiDocumentContent, SduiDocumentPatch } from '@lodado/sdui-document'
import {
  anchorAfterBlock,
  clearBlockSelection,
  createBlockId,
  createBlockSelection,
  createTrailingBlockPatch,
  extendBlockSelection,
  findBlockById,
  flattenDocumentBlocks,
} from '@lodado/sdui-document'
import type React from 'react'

import { cloneBlockWithNewIds, isTextBlock } from '../blockContent'
import type { EditorUIStore, FocusTarget } from '../uiStore'

export type UseSelectionKeyboardInput = {
  store: EditorUIStore
  docRef: React.MutableRefObject<SduiDocumentContent>
  readOnly: boolean
  applyPatches: (patches: SduiDocumentPatch[]) => void
  undo: () => SduiDocumentPatch[] | null
  redo: () => SduiDocumentPatch[] | null
  generateBlockId: () => string
  focusBlock: (blockId: string, caret: FocusTarget['caret']) => void
}

export type UseSelectionKeyboardResult = {
  handleSelectionKeyDown: (event: React.KeyboardEvent) => void
  handlePaddingClick: () => void
  /**
   * Document-level undo/redo with caret landing. Exposed so a focused block
   * can delegate here when its own PM inline history is empty (the container
   * keydown path can't fire while PM owns Mod-Z).
   */
  historyStep: (direction: 'undo' | 'redo') => void
}

/**
 * Block-selection keyboard + clickable-padding behavior. Document-level
 * undo/redo, arrow/Enter/Mod-A/Mod-D block-selection keys, and the Outline
 * ClickablePadding that focuses the trailing block.
 */
export function useSelectionKeyboard(input: UseSelectionKeyboardInput): UseSelectionKeyboardResult {
  const { store, docRef, readOnly, applyPatches, undo, redo, generateBlockId, focusBlock } = input

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
      focusBlock(targetId, 'end')
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

    // Notion block-selection keys: arrows walk the flattened order (Shift
    // extends from the anchor), Enter re-enters inline editing, Mod-A selects
    // everything, Mod-D duplicates.
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      const ids = orderedIds()

      if (event.shiftKey && selection.anchorId) {
        // The moving edge is the selection end opposite the anchor; the arrow
        // moves that edge, growing or shrinking the anchor→edge range.
        const anchorIndex = ids.indexOf(selection.anchorId)
        const selectedIndexes = selection.selectedIds.map((id) => ids.indexOf(id)).filter((index) => index >= 0)
        const minIndex = Math.min(...selectedIndexes)
        const maxIndex = Math.max(...selectedIndexes)
        const edgeIndex = anchorIndex === minIndex ? maxIndex : minIndex
        const targetId = ids[edgeIndex + (event.key === 'ArrowUp' ? -1 : 1)]
        if (targetId) {
          store.set({ selection: extendBlockSelection(selection, docRef.current, targetId), focus: null })
        }

        return
      }

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
      focusBlock(last.id, 'end')

      return
    }

    // Defensive: only reachable when the invariant was bypassed (e.g. a
    // readOnly -> editable toggle) — restore it, then focus the new block.
    const trailing = createTrailingBlockPatch(docRef.current, generateBlockId)
    if (trailing && trailing.type === 'block.insert') {
      applyPatches([trailing])
      focusBlock(trailing.block.id, 'end')
    }
  }

  return { handleSelectionKeyDown, handlePaddingClick, historyStep: handleHistoryStep }
}
