import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiDocumentBlockId } from '../../blocks/schema/ids'
import { optionalAttributes } from '../shared'
import { PAGE_BLOCK_TYPE } from './page.type'

export function createDefaultPage(id: SduiDocumentBlockId, attributes?: Record<string, unknown>): SduiDocumentBlock {
  return { id, type: PAGE_BLOCK_TYPE, state: { text: '' }, ...optionalAttributes(attributes) }
}
