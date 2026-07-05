import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiDocumentBlockId } from '../../blocks/schema/ids'
import { optionalAttributes } from '../shared'
import { FILE_BLOCK_TYPE } from './file.type'

export function createDefaultFile(id: SduiDocumentBlockId, attributes?: Record<string, unknown>): SduiDocumentBlock {
  return { id, type: FILE_BLOCK_TYPE, state: { text: '' }, ...optionalAttributes(attributes) }
}
