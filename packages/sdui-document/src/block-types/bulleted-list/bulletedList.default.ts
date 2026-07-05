import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiDocumentBlockId } from '../../blocks/schema/ids'
import { emptyTextState, optionalAttributes } from '../shared'
import { BULLETED_LIST_BLOCK_TYPE } from './bulletedList.type'

export function createDefaultBulletedList(
  id: SduiDocumentBlockId,
  attributes?: Record<string, unknown>,
): SduiDocumentBlock {
  return { id, type: BULLETED_LIST_BLOCK_TYPE, state: emptyTextState(), ...optionalAttributes(attributes) }
}
