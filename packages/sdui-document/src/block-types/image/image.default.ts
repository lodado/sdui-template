import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiDocumentBlockId } from '../../blocks/schema/ids'
import { optionalAttributes } from '../shared'
import { IMAGE_BLOCK_TYPE } from './image.type'

export function createDefaultImage(id: SduiDocumentBlockId, attributes?: Record<string, unknown>): SduiDocumentBlock {
  return { id, type: IMAGE_BLOCK_TYPE, state: { text: '' }, ...optionalAttributes(attributes) }
}
