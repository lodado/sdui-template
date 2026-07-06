import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiDocumentBlockId } from '../../blocks/schema/ids'
import { optionalAttributes } from '../shared'
import { TOC_BLOCK_TYPE } from './toc.type'

export function createDefaultToc(id: SduiDocumentBlockId, attributes?: Record<string, unknown>): SduiDocumentBlock {
  return { id, type: TOC_BLOCK_TYPE, ...optionalAttributes(attributes) }
}
