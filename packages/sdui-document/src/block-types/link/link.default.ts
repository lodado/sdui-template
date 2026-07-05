import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiDocumentBlockId } from '../../blocks/schema/ids'
import { optionalAttributes } from '../shared'
import { LINK_BLOCK_TYPE } from './link.type'

export function createDefaultLink(id: SduiDocumentBlockId, attributes?: Record<string, unknown>): SduiDocumentBlock {
  return { id, type: LINK_BLOCK_TYPE, state: { text: '' }, ...optionalAttributes(attributes) }
}
