import type { CreateDocumentBlockInput } from '../../blocks/schema/block'
import { nextBlockId } from '../authoring/blockId'
import { BOOKMARK_BLOCK_TYPE } from './bookmark.type'

export type BookmarkBuilderOptions = { id?: string; title?: string; description?: string }

/** Author a bookmark card. `url` must be http(s) — schema-enforced. */
export function bookmark(
  url: string,
  { id, title, description }: BookmarkBuilderOptions = {},
): CreateDocumentBlockInput {
  return {
    id: id ?? nextBlockId('bookmark'),
    type: BOOKMARK_BLOCK_TYPE,
    attributes: { url, ...(title ? { title } : {}), ...(description ? { description } : {}) },
  }
}
