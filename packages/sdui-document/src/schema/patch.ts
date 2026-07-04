import type { SduiDocumentBlock } from './block'
import type { SduiDocumentBlockId } from './ids'

/**
 * Optional transport metadata shared by every patch variant.
 *
 * Policies:
 * - `expectedVersion` is the block-level version the client observed when
 *   producing the patch. The patch engine ignores it; realtime R1 (Phase 19)
 *   validates it server-side to detect concurrent edits on the same block.
 */
type SduiDocumentPatchBase = {
  expectedVersion?: number
}

export type SduiDocumentPatch = SduiDocumentPatchBase &
  (
    | {
        type: 'block.insert'
        parentId: SduiDocumentBlockId
        index: number
        block: SduiDocumentBlock
      }
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
    | {
        type: 'block.move'
        blockId: SduiDocumentBlockId
        parentId: SduiDocumentBlockId
        index: number
      }
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
        type: 'document.setTitle'
        title: string
      }
  )
