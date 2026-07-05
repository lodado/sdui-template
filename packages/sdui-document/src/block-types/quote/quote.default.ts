import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiDocumentBlockId } from '../../blocks/schema/ids'
import { emptyTextState, optionalAttributes } from '../shared'
import { QUOTE_BLOCK_TYPE } from './quote.type'

export function createDefaultQuote(id: SduiDocumentBlockId, attributes?: Record<string, unknown>): SduiDocumentBlock {
  return { id, type: QUOTE_BLOCK_TYPE, state: emptyTextState(), ...optionalAttributes(attributes) }
}
