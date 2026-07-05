import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiDocumentBlockId } from '../../blocks/schema/ids'
import { emptyTextState, optionalAttributes } from '../shared'
import { HEADING_BLOCK_TYPE } from './heading.type'

export function createDefaultHeading(id: SduiDocumentBlockId, attributes?: Record<string, unknown>): SduiDocumentBlock {
  return { id, type: HEADING_BLOCK_TYPE, state: emptyTextState(), ...optionalAttributes(attributes) }
}
