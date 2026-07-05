import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiDocumentBlockId } from '../../blocks/schema/ids'
import { emptyTextState, optionalAttributes } from '../shared'
import { CODE_BLOCK_TYPE } from './code.type'

export function createDefaultCode(id: SduiDocumentBlockId, attributes?: Record<string, unknown>): SduiDocumentBlock {
  return { id, type: CODE_BLOCK_TYPE, state: emptyTextState(), ...optionalAttributes(attributes) }
}
