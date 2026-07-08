import { COLUMN_BLOCK_TYPE } from '../../block-types/column/column.type'
import { COLUMN_LIST_BLOCK_TYPE } from '../../block-types/column-list/columnList.type'
import { generatePositions } from '../../ordering'
import type { SduiDocumentBlock, SduiDocumentContent } from '../schema'
import { createBlockId } from '../schema/ids'
import { collectBlockIds } from '../traverse'

/**
 * Derives a deterministic child-scoped id (`<base>`, `<base>-2`, `<base>-3`, …)
 * that does not collide with any id in `takenIds`. The chosen id is added to
 * the set so successive calls stay mutually unique. Deterministic derivation
 * keeps concurrent replicas convergent — both sides derive the same ids from
 * the same content.
 */
export function deriveUniqueBlockId(takenIds: Set<string>, base: string): string {
  const pick = (candidate: string): string => {
    takenIds.add(candidate)
    return candidate
  }

  if (!takenIds.has(base)) {
    return pick(base)
  }

  let suffix = 2
  while (takenIds.has(`${base}-${suffix}`)) {
    suffix += 1
  }

  return pick(`${base}-${suffix}`)
}

type NormalizeResult = {
  /** Replacement blocks for the input block (empty = removed, >1 = dissolved). */
  blocks: SduiDocumentBlock[]
  changed: boolean
}

function isColumn(block: SduiDocumentBlock): boolean {
  return block.type === COLUMN_BLOCK_TYPE
}

function isColumnList(block: SduiDocumentBlock): boolean {
  return block.type === COLUMN_LIST_BLOCK_TYPE
}

/** Evenly re-keys sibling positions after a structural change (order-preserving). */
function rekeyPositions(blocks: SduiDocumentBlock[]): SduiDocumentBlock[] {
  const positions = generatePositions(null, null, blocks.length)
  return blocks.map((block, index) => ({ ...block, position: positions[index] }))
}

function normalizeChildren(
  children: SduiDocumentBlock[] | undefined,
  insideColumn: boolean,
  takenIds: Set<string>,
): NormalizeResult {
  // eslint-disable-next-line no-use-before-define -- mutual recursion over the block tree
  const results = (children ?? []).map((child) => normalizeBlock(child, insideColumn, takenIds))
  const changed = results.some((result) => result.changed)
  return { blocks: results.flatMap((result) => result.blocks), changed }
}

/** Flattens a columnList to its columns' contents, vertically, in column order. */
function dissolveColumnList(block: SduiDocumentBlock, insideColumn: boolean, takenIds: Set<string>): NormalizeResult {
  const flattened = (block.children ?? []).flatMap((child) =>
    isColumn(child)
      ? normalizeChildren(child.children, insideColumn, takenIds).blocks
      : // eslint-disable-next-line no-use-before-define -- mutual recursion over the block tree
        normalizeBlock(child, insideColumn, takenIds).blocks,
  )

  return { blocks: flattened, changed: true }
}

function normalizeColumnList(block: SduiDocumentBlock, insideColumn: boolean, takenIds: Set<string>): NormalizeResult {
  // Nesting is forbidden: a columnList anywhere below a column flattens vertically.
  if (insideColumn) {
    return dissolveColumnList(block, insideColumn, takenIds)
  }

  let changed = false
  const columns = (block.children ?? []).flatMap((child): SduiDocumentBlock[] => {
    if (isColumn(child)) {
      const inner = normalizeChildren(child.children, true, takenIds)
      if (inner.blocks.length === 0) {
        // Empty columns carry no content — drop them.
        changed = true
        return []
      }
      if (!inner.changed) {
        return [child]
      }
      changed = true
      return [{ ...child, children: rekeyPositions(inner.blocks) }]
    }

    // Stray non-column child — wrap it into a fresh column (preserves the split).
    changed = true
    // eslint-disable-next-line no-use-before-define -- mutual recursion over the block tree
    const wrapped = normalizeBlock(child, true, takenIds)
    if (wrapped.blocks.length === 0) {
      return []
    }
    return [
      {
        id: createBlockId(deriveUniqueBlockId(takenIds, `${child.id}-col`)),
        type: COLUMN_BLOCK_TYPE,
        children: rekeyPositions(wrapped.blocks),
      },
    ]
  })

  if (columns.length === 0) {
    return { blocks: [], changed: true }
  }

  // A single remaining column is no longer a split — promote its children.
  if (columns.length === 1) {
    return { blocks: columns[0].children ?? [], changed: true }
  }

  if (!changed) {
    return { blocks: [block], changed: false }
  }

  return { blocks: [{ ...block, children: rekeyPositions(columns) }], changed: true }
}

function normalizeBlock(block: SduiDocumentBlock, insideColumn: boolean, takenIds: Set<string>): NormalizeResult {
  if (isColumnList(block)) {
    return normalizeColumnList(block, insideColumn, takenIds)
  }

  // Columns inside a columnList are handled by normalizeColumnList — reaching
  // here means the column is orphaned, so it dissolves into its children.
  if (isColumn(block)) {
    return { ...normalizeChildren(block.children, insideColumn, takenIds), changed: true }
  }

  const inner = normalizeChildren(block.children, insideColumn, takenIds)
  if (!inner.changed) {
    return { blocks: [block], changed: false }
  }

  return {
    blocks: [{ ...block, children: inner.blocks.length > 0 ? rekeyPositions(inner.blocks) : undefined }],
    changed: true,
  }
}

/**
 * Repairs column structural invariants after any patch application:
 * - a columnList holds only columns (stray children get wrapped into one)
 * - empty columns are dropped
 * - a columnList with fewer than two columns dissolves in place
 * - columns outside a columnList dissolve into their children
 * - nested columnLists (below a column) flatten vertically
 *
 * Pure and idempotent; returns the SAME reference when no repair was needed,
 * so callers can cheaply detect "already normalized".
 */
export function normalizeColumnStructure(content: SduiDocumentContent): SduiDocumentContent {
  const takenIds = new Set<string>()
  collectBlockIds(content.root, takenIds)

  const result = normalizeBlock(content.root, false, takenIds)
  if (!result.changed) {
    return content
  }

  return { ...content, root: result.blocks[0] }
}
