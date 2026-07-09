import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiDocumentBlockId } from '../../blocks/schema/ids'
import { BOOKMARK_BLOCK_TYPE } from './bookmark.type'

export function createDefaultBookmark(
  id: SduiDocumentBlockId,
  attributes?: Record<string, unknown>,
): SduiDocumentBlock {
  return { id, type: BOOKMARK_BLOCK_TYPE, attributes: { url: '', ...attributes } }
}
