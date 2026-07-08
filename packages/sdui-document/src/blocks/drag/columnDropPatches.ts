import { COLUMN_BLOCK_TYPE } from '../../block-types/column/column.type'
import { COLUMN_LIST_BLOCK_TYPE } from '../../block-types/column-list/columnList.type'
import { generatePositions } from '../../ordering'
import { applyDocumentPatches, findBlockById } from '../patch'
import { deriveUniqueBlockId } from '../patch/columnStructure'
import { collectBlockIds, findBlock, findParent } from '../patch/traverse'
import type { SduiDocumentBlock, SduiDocumentContent, SduiDocumentPatch } from '../schema'
import { createDocumentBlock } from '../schema'
import { createBlockId } from '../schema/ids'

/** Which side of the over row the dragged block lands on. */
export type HorizontalDropSide = 'left' | 'right'

export type CreateHorizontalBlockDropPatchesInput = {
  content: SduiDocumentContent
  activeId: string
  overId: string
  side: HorizontalDropSide
}

const CONTAINER_TYPES = new Set<string>([COLUMN_BLOCK_TYPE, COLUMN_LIST_BLOCK_TYPE])

function emptyColumn(id: string, position: string): SduiDocumentBlock {
  return createDocumentBlock({ id, type: COLUMN_BLOCK_TYPE, position })
}

/**
 * Maps a horizontal (left/right edge) drop onto the patch sequence that
 * produces a column split.
 *
 * Policies:
 * - over already inside a column → a new column is inserted beside that
 *   column in its columnList, and the active block moves into it
 * - otherwise → a fresh columnList takes the over row's slot, with over and
 *   active split into two columns ordered by `side`
 * - new container ids derive deterministically from the participating block
 *   ids (`<id>-cols` / `<id>-col`), counter-suffixed on collision
 * - leftover empty columns are NOT cleaned here — run
 *   normalizeColumnStructure after applying the patches
 *
 * @returns the patch list, or null when the drop is invalid (root involved,
 *          self-drop, container blocks, over inside the dragged subtree,
 *          unknown ids)
 */
export function createHorizontalBlockDropPatches(
  input: CreateHorizontalBlockDropPatchesInput,
): SduiDocumentPatch[] | null {
  const { content, activeId, overId, side } = input

  if (activeId === overId || activeId === content.root.id || overId === content.root.id) {
    return null
  }

  const active = findBlockById(content, activeId)
  const over = findBlockById(content, overId)
  if (!active || !over) {
    return null
  }

  if (CONTAINER_TYPES.has(active.type) || CONTAINER_TYPES.has(over.type)) {
    return null
  }

  if (findBlock(active, overId)) {
    return null
  }

  const overParent = findParent(content.root, overId)
  if (!overParent) {
    return null
  }

  const takenIds = new Set<string>()
  collectBlockIds(content.root, takenIds)

  // Over already lives inside a split → add a sibling column beside its column.
  if (overParent.parent.type === COLUMN_BLOCK_TYPE) {
    const columnListParent = findParent(content.root, overParent.parent.id)
    if (!columnListParent || columnListParent.parent.type !== COLUMN_LIST_BLOCK_TYPE) {
      return null
    }

    const newColumnId = deriveUniqueBlockId(takenIds, `${activeId}-col`)
    const anchorColumnId = createBlockId(overParent.parent.id)

    return [
      {
        type: 'block.insert',
        parentId: createBlockId(columnListParent.parent.id),
        block: createDocumentBlock({ id: newColumnId, type: COLUMN_BLOCK_TYPE }),
        ...(side === 'left' ? { before: anchorColumnId } : { after: anchorColumnId }),
      },
      {
        type: 'block.move',
        blockId: createBlockId(activeId),
        parentId: createBlockId(newColumnId),
        after: null,
      },
    ]
  }

  // Fresh split: a columnList takes over's slot, over + active become columns.
  const columnListId = deriveUniqueBlockId(takenIds, `${overId}-cols`)
  const overColumnId = deriveUniqueBlockId(takenIds, `${overId}-col`)
  const activeColumnId = deriveUniqueBlockId(takenIds, `${activeId}-col`)

  const [firstPosition, secondPosition] = generatePositions(null, null, 2)
  const orderedColumns =
    side === 'left'
      ? [emptyColumn(activeColumnId, firstPosition), emptyColumn(overColumnId, secondPosition)]
      : [emptyColumn(overColumnId, firstPosition), emptyColumn(activeColumnId, secondPosition)]

  return [
    {
      type: 'block.insert',
      parentId: createBlockId(overParent.parent.id),
      before: createBlockId(overId),
      block: createDocumentBlock({
        id: columnListId,
        type: COLUMN_LIST_BLOCK_TYPE,
        children: orderedColumns,
      }),
    },
    {
      type: 'block.move',
      blockId: createBlockId(overId),
      parentId: createBlockId(overColumnId),
      after: null,
    },
    {
      type: 'block.move',
      blockId: createBlockId(activeId),
      parentId: createBlockId(activeColumnId),
      after: null,
    },
  ]
}

/**
 * Fixed pixel band hugging the over row's left/right edge — ONLY a pointer
 * inside this band reads as split intent. Deliberately narrow and non-scaling:
 * a ratio-based zone grows huge on wide rows and made splits fire on drags
 * that were really vertical moves.
 */
export const HORIZONTAL_DROP_EDGE_PX = 40

/** Narrow rows clamp the band to this fraction per side so a middle zone always survives. */
const MAX_EDGE_FRACTION = 0.25

export type ProjectHorizontalBlockDropInput = {
  content: SduiDocumentContent
  activeId: string
  overId: string
  /**
   * Pointer X offset from the over row's LEFT edge, in px (may be negative or
   * beyond the width — overshooting past a real edge is still that edge).
   * Omitted (keyboard activation / unmeasurable) → never a horizontal drop.
   */
  overOffsetX?: number
  /** Over row width in px; non-positive → never a horizontal drop. */
  overWidth?: number
}

export type ProjectedHorizontalBlockDrop = {
  overId: string
  side: HorizontalDropSide
}

/**
 * Projects a pointer position onto a horizontal (column split) drop.
 *
 * Zones: within `min(HORIZONTAL_DROP_EDGE_PX, width × 0.25)` of the row's left
 * edge → left, of the right edge → right (both boundaries exclusive); anything
 * else → null so the vertical projection takes over. Target validity reuses
 * createHorizontalBlockDropPatches — an edge-band pointer over an invalid
 * target still returns null.
 */
export function projectHorizontalBlockDrop(
  input: ProjectHorizontalBlockDropInput,
): ProjectedHorizontalBlockDrop | null {
  const { content, activeId, overId, overOffsetX, overWidth } = input

  if (overOffsetX === undefined || overWidth === undefined || overWidth <= 0) {
    return null
  }

  const edge = Math.min(HORIZONTAL_DROP_EDGE_PX, overWidth * MAX_EDGE_FRACTION)

  let side: HorizontalDropSide | null = null
  if (overOffsetX < edge) {
    side = 'left'
  } else if (overOffsetX > overWidth - edge) {
    side = 'right'
  }

  if (!side) {
    return null
  }

  if (!createHorizontalBlockDropPatches({ content, activeId, overId, side })) {
    return null
  }

  return { overId, side }
}

const MAX_CLEANUP_ROUNDS = 10

type ViolationScan = SduiDocumentPatch[] | null

/** First column-invariant violation in the tree, as the patches that repair it. */
function findColumnViolationPatches(content: SduiDocumentContent): ViolationScan {
  const scan = (block: SduiDocumentBlock, parent: SduiDocumentBlock | null): ViolationScan => {
    if (block.type === COLUMN_LIST_BLOCK_TYPE && parent) {
      const columns = block.children ?? []

      const emptyColumns = columns.filter(
        (child) => child.type === COLUMN_BLOCK_TYPE && (child.children ?? []).length === 0,
      )
      if (emptyColumns.length > 0) {
        return emptyColumns.map((child) => ({ type: 'block.delete', blockId: child.id }))
      }

      if (columns.length === 0) {
        return [{ type: 'block.delete', blockId: block.id }]
      }

      if (columns.length === 1) {
        const promoted = (columns[0].children ?? []).map(
          (child): SduiDocumentPatch => ({
            type: 'block.move',
            blockId: child.id,
            parentId: createBlockId(parent.id),
            before: block.id,
          }),
        )
        return [...promoted, { type: 'block.delete', blockId: block.id }]
      }
    }

    return (block.children ?? []).map((child) => scan(child, block)).find(Boolean) ?? null
  }

  return scan(content.root, null)
}

/**
 * Appends the column-invariant cleanup a patch batch requires: simulates the
 * batch, then repairs empty columns / single-column lists with follow-up
 * patches so the WHOLE batch (edit + cleanup) is one atomic, invertible undo
 * step. Content with no violations returns the input patches unchanged.
 */
export function appendColumnCleanupPatches(
  content: SduiDocumentContent,
  patches: SduiDocumentPatch[],
): SduiDocumentPatch[] {
  let working = applyDocumentPatches(content, patches)
  const all = [...patches]

  for (let round = 0; round < MAX_CLEANUP_ROUNDS; round += 1) {
    const fixes = findColumnViolationPatches(working)
    if (!fixes) {
      return all
    }

    working = applyDocumentPatches(working, fixes)
    all.push(...fixes)
  }

  return all
}
