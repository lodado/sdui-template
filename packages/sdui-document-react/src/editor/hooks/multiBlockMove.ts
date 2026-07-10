import type { SduiDocumentContent, SduiDocumentPatch } from '@lodado/sdui-document'
import { createBlockId, flattenDocumentBlocks } from '@lodado/sdui-document'

/**
 * When a drag starts on a block that is part of a multi-block selection, the
 * whole selection should travel together. Given the drop patches for the
 * dragged block, this appends `block.move` patches for the other selected
 * blocks so they land right after it, in document order.
 *
 * ponytail: only the simple single vertical-move drop is extended. Column-split
 * (horizontal) drops carry their own multi-patch batch and are left to move just
 * the dragged block — grouping into a new column is a rare multi-select case.
 */
export function appendMultiBlockMovePatches(
  base: SduiDocumentPatch[],
  activeId: string,
  selectedIds: readonly string[],
  content: SduiDocumentContent,
): SduiDocumentPatch[] {
  if (selectedIds.length <= 1 || !selectedIds.includes(activeId)) {
    return base
  }

  // Only extend the plain single-move drop; anything richer stays untouched.
  if (base.length !== 1) {
    return base
  }
  const move = base[0]
  if (move.type !== 'block.move' || move.blockId !== activeId) {
    return base
  }

  const order = new Map(flattenDocumentBlocks(content).map((item, index) => [item.id, index]))
  const others = selectedIds.filter((id) => id !== activeId).sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0))

  let previousId = activeId
  const extra: SduiDocumentPatch[] = others.map((id) => {
    const patch: SduiDocumentPatch = {
      type: 'block.move',
      blockId: createBlockId(id),
      parentId: move.parentId,
      after: createBlockId(previousId),
    }
    previousId = id
    return patch
  })

  return [...base, ...extra]
}
