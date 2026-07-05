import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiDocumentBlockId } from '../../blocks/schema/ids'
import { emptyTextState, optionalAttributes } from '../shared'
import { PARAGRAPH_BLOCK_TYPE } from './paragraph.type'

export function createDefaultParagraph(
  id: SduiDocumentBlockId,
  attributes?: Record<string, unknown>,
): SduiDocumentBlock {
  return { id, type: PARAGRAPH_BLOCK_TYPE, state: emptyTextState(), ...optionalAttributes(attributes) }
}
