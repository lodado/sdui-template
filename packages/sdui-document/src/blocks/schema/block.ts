import { BOOKMARK_BLOCK_TYPE } from '../../block-types/bookmark/bookmark.type'
import { BULLETED_LIST_BLOCK_TYPE } from '../../block-types/bulleted-list/bulletedList.type'
import { BUTTON_BLOCK_TYPE } from '../../block-types/button/button.type'
import { CALLOUT_BLOCK_TYPE } from '../../block-types/callout/callout.type'
import { CHECKLIST_BLOCK_TYPE } from '../../block-types/checklist/checklist.type'
import { CODE_BLOCK_TYPE } from '../../block-types/code/code.type'
import { COLLECTION_BLOCK_TYPE } from '../../block-types/collection/collection.type'
import { COLUMN_BLOCK_TYPE } from '../../block-types/column/column.type'
import { COLUMN_LIST_BLOCK_TYPE } from '../../block-types/column-list/columnList.type'
import { DIVIDER_BLOCK_TYPE } from '../../block-types/divider/divider.type'
import { EMBED_BLOCK_TYPE } from '../../block-types/embed/embed.type'
import { FILE_BLOCK_TYPE } from '../../block-types/file/file.type'
import { HEADING_BLOCK_TYPE } from '../../block-types/heading/heading.type'
import { IMAGE_BLOCK_TYPE } from '../../block-types/image/image.type'
import { LINK_BLOCK_TYPE } from '../../block-types/link/link.type'
import { NUMBERED_LIST_BLOCK_TYPE } from '../../block-types/numbered-list/numberedList.type'
import { PAGE_BLOCK_TYPE } from '../../block-types/page/page.type'
import { PARAGRAPH_BLOCK_TYPE } from '../../block-types/paragraph/paragraph.type'
import { QUOTE_BLOCK_TYPE } from '../../block-types/quote/quote.type'
import { ROOT_BLOCK_TYPE } from '../../block-types/root/root.type'
import { SDUI_BLOCK_TYPE } from '../../block-types/sdui/sdui.type'
import { TAGS_BLOCK_TYPE } from '../../block-types/tags/tags.type'
import { TOC_BLOCK_TYPE } from '../../block-types/toc/toc.type'
import { TOGGLE_BLOCK_TYPE } from '../../block-types/toggle/toggle.type'
import { VIDEO_BLOCK_TYPE } from '../../block-types/video/video.type'
import { createBlockId, type SduiDocumentBlockId } from './ids'

/** Tie-break metadata for deterministic sibling ordering when fractional keys collide. */
export type BlockOrigin = {
  clientId: string
  opId: string
}

/**
 * Union of built-in block types, derived from the per-folder type constants
 * (`block-types/<name>/<name>.type.ts`) — the single source of truth. Adding a
 * block folder's constant here is the only central edit needed for the type.
 */
export type SduiDocumentBlockType =
  | typeof ROOT_BLOCK_TYPE
  | typeof PARAGRAPH_BLOCK_TYPE
  | typeof HEADING_BLOCK_TYPE
  | typeof BULLETED_LIST_BLOCK_TYPE
  | typeof NUMBERED_LIST_BLOCK_TYPE
  | typeof CHECKLIST_BLOCK_TYPE
  | typeof DIVIDER_BLOCK_TYPE
  | typeof CALLOUT_BLOCK_TYPE
  | typeof IMAGE_BLOCK_TYPE
  | typeof FILE_BLOCK_TYPE
  | typeof LINK_BLOCK_TYPE
  | typeof QUOTE_BLOCK_TYPE
  | typeof TOGGLE_BLOCK_TYPE
  | typeof CODE_BLOCK_TYPE
  | typeof COLUMN_LIST_BLOCK_TYPE
  | typeof COLUMN_BLOCK_TYPE
  | typeof TOC_BLOCK_TYPE
  | typeof PAGE_BLOCK_TYPE
  | typeof COLLECTION_BLOCK_TYPE
  | typeof BOOKMARK_BLOCK_TYPE
  | typeof VIDEO_BLOCK_TYPE
  | typeof EMBED_BLOCK_TYPE
  | typeof TAGS_BLOCK_TYPE
  | typeof BUTTON_BLOCK_TYPE
  | typeof SDUI_BLOCK_TYPE

export type SduiDocumentBlock = {
  id: SduiDocumentBlockId
  type: SduiDocumentBlockType | (string & {})
  /** Fractional ordering key among siblings (root block omits this). */
  position?: string
  /** Deterministic tie-break when two blocks share the same position key. */
  origin?: BlockOrigin
  state?: Record<string, unknown>
  attributes?: Record<string, unknown>
  children?: SduiDocumentBlock[]
}

/**
 * Factory input accepts raw string ids for ergonomics; the factory is the
 * branding boundary (mirrors createBlockId).
 */
export type CreateDocumentBlockInput = Omit<SduiDocumentBlock, 'id' | 'children'> & {
  id: string
  children?: CreateDocumentBlockInput[]
}

export function createDocumentBlock(input: CreateDocumentBlockInput): SduiDocumentBlock {
  return {
    ...input,
    id: createBlockId(input.id),
    ...(input.position !== undefined ? { position: input.position } : {}),
    ...(input.origin ? { origin: { ...input.origin } } : {}),
    state: input.state ? { ...input.state } : undefined,
    attributes: input.attributes ? { ...input.attributes } : undefined,
    children: input.children ? input.children.map(createDocumentBlock) : undefined,
  }
}
