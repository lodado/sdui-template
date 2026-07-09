import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiDocumentBlockId } from '../../blocks/schema/ids'
import { TAGS_BLOCK_TYPE } from './tags.type'

export function createDefaultTags(id: SduiDocumentBlockId, attributes?: Record<string, unknown>): SduiDocumentBlock {
  return { id, type: TAGS_BLOCK_TYPE, attributes: { items: [], ...attributes } }
}
