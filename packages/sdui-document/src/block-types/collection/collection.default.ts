import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiDocumentBlockId } from '../../blocks/schema/ids'
import { COLLECTION_BLOCK_TYPE } from './collection.type'

export function createDefaultCollection(
  id: SduiDocumentBlockId,
  attributes?: Record<string, unknown>,
): SduiDocumentBlock {
  return {
    id,
    type: COLLECTION_BLOCK_TYPE,
    attributes: { view: 'gallery', properties: [], ...attributes },
    children: [],
  }
}
