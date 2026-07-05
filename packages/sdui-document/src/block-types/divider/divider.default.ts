import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiDocumentBlockId } from '../../blocks/schema/ids'
import { optionalAttributes } from '../shared'
import { DIVIDER_BLOCK_TYPE } from './divider.type'

export function createDefaultDivider(id: SduiDocumentBlockId, attributes?: Record<string, unknown>): SduiDocumentBlock {
  return { id, type: DIVIDER_BLOCK_TYPE, ...optionalAttributes(attributes) }
}
