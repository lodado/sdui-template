import type { BlockOrigin, SduiDocumentBlock } from './block'
import type { SduiDocumentBlockId } from './ids'

/**
 * Optional transport metadata shared by every patch variant.
 *
 * Policies:
 * - `expectedVersion` is the block-level version the client observed when
 *   producing the patch. The patch engine ignores it; realtime R1 (Phase 19)
 *   validates it server-side to detect concurrent edits on the same block.
 * - `origin` identifies the client + operation for deterministic tie-break
 *   when two patches produce the same fractional position key.
 */
type SduiDocumentPatchBase = {
  expectedVersion?: number
  origin?: BlockOrigin
}

/** Anchor-based sibling placement (replaces integer index). */
export type BlockPlacementAnchor = {
  /** Insert/move after this block id; `null` = front of parent. */
  after?: string | null
  /** Insert/move before this block id; `null` = end of parent. */
  before?: string | null
  /** When `after` was deleted, try these block ids in order. */
  fallbackAfter?: string[]
}

export type SduiDocumentPatch = SduiDocumentPatchBase &
  (
    | ({
        type: 'block.insert'
        parentId: SduiDocumentBlockId
        block: SduiDocumentBlock
      } & BlockPlacementAnchor)
    | {
        type: 'block.update'
        blockId: SduiDocumentBlockId
        state?: Record<string, unknown>
        attributes?: Record<string, unknown>
      }
    | {
        type: 'block.delete'
        blockId: SduiDocumentBlockId
      }
    | ({
        type: 'block.move'
        blockId: SduiDocumentBlockId
        parentId: SduiDocumentBlockId
      } & BlockPlacementAnchor)
    | {
        /**
         * Splits a text-bearing block at an inline offset.
         * The original block keeps [0, offset); a new next sibling of the same
         * type receives [offset, length). Children stay on the original block.
         */
        type: 'block.split'
        blockId: SduiDocumentBlockId
        offset: number
        newBlockId: SduiDocumentBlockId
      }
    | {
        /**
         * Merges `blockId`'s inline content into the end of `intoBlockId`,
         * removes `blockId`, and promotes its children to its former position.
         */
        type: 'block.merge'
        blockId: SduiDocumentBlockId
        intoBlockId: SduiDocumentBlockId
      }
    | {
        /**
         * Changes a block's type in place (turn-into). State and children are
         * kept; `attributes` REPLACES the whole attribute object — stale
         * attributes of the previous type (e.g. heading `level`) must not
         * leak into the new type. Omitting it clears attributes.
         */
        type: 'block.setType'
        blockId: SduiDocumentBlockId
        blockType: SduiDocumentBlock['type']
        attributes?: Record<string, unknown>
      }
    | {
        type: 'document.setTitle'
        title: string
      }
  )
