import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiDocumentBlockId } from '../../blocks/schema/ids'
import { emptyTextState, optionalAttributes } from '../shared'
import { NUMBERED_LIST_BLOCK_TYPE } from './numberedList.type'

export function createDefaultNumberedList(
  id: SduiDocumentBlockId,
  attributes?: Record<string, unknown>,
): SduiDocumentBlock {
  return { id, type: NUMBERED_LIST_BLOCK_TYPE, state: emptyTextState(), ...optionalAttributes(attributes) }
}
