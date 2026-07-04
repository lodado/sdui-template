import { flattenDocumentBlocks } from '../drag/dragHelpers'
import type { SduiDocumentContent } from '../schema'

/**
 * Notion-style block selection mode state.
 *
 * Lives in the block (React) layer — entered when the user escapes inline
 * editing (Esc, handle click, cross-block drag). The PM editor is never
 * mounted while block selection is active.
 */
export type BlockSelectionState = {
  /** Selected block ids in flattened document order, ancestor-normalized. */
  selectedIds: string[]
  /** Range anchor for shift-selection. */
  anchorId: string | undefined
}

export function clearBlockSelection(): BlockSelectionState {
  return { selectedIds: [], anchorId: undefined }
}

export function createBlockSelection(blockId: string): BlockSelectionState {
  return { selectedIds: [blockId], anchorId: blockId }
}

export function toggleBlockSelection(state: BlockSelectionState, blockId: string): BlockSelectionState {
  if (state.selectedIds.includes(blockId)) {
    const selectedIds = state.selectedIds.filter((id) => id !== blockId)
    const anchorId = state.anchorId === blockId ? selectedIds[selectedIds.length - 1] : state.anchorId

    return { selectedIds, anchorId }
  }

  return { selectedIds: [...state.selectedIds, blockId], anchorId: blockId }
}

/**
 * Extends the selection from the anchor to the target (shift-click semantics).
 *
 * Policies:
 * - the range is inclusive over the flattened document order, either direction
 * - a block whose ancestor is also selected is dropped from the id list
 *   (operating on the ancestor already covers the whole subtree)
 * - without an anchor this degenerates to a fresh single selection
 */
export function extendBlockSelection(
  state: BlockSelectionState,
  content: SduiDocumentContent,
  targetId: string,
): BlockSelectionState {
  if (!state.anchorId) {
    return createBlockSelection(targetId)
  }

  const flattened = flattenDocumentBlocks(content).filter((item) => item.id !== content.root.id)
  const anchorIndex = flattened.findIndex((item) => item.id === state.anchorId)
  const targetIndex = flattened.findIndex((item) => item.id === targetId)
  if (anchorIndex < 0 || targetIndex < 0) {
    return createBlockSelection(targetId)
  }

  const [start, end] = anchorIndex <= targetIndex ? [anchorIndex, targetIndex] : [targetIndex, anchorIndex]
  const range = flattened.slice(start, end + 1)
  const rangeIds = new Set(range.map((item) => item.id))

  const hasSelectedAncestor = (item: (typeof range)[number]): boolean => {
    const parent = flattened.find((candidate) => candidate.id === item.parentId)
    if (!parent) {
      return false
    }

    return rangeIds.has(parent.id) || hasSelectedAncestor(parent)
  }

  return {
    selectedIds: range.filter((item) => !hasSelectedAncestor(item)).map((item) => item.id),
    anchorId: state.anchorId,
  }
}
