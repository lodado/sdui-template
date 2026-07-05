import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiDocumentBlockId } from '../../blocks/schema/ids'
import { emptyTextState, optionalAttributes } from '../shared'
import { CALLOUT_BLOCK_TYPE } from './callout.type'

export function createDefaultCallout(id: SduiDocumentBlockId, attributes?: Record<string, unknown>): SduiDocumentBlock {
  return { id, type: CALLOUT_BLOCK_TYPE, state: emptyTextState(), ...optionalAttributes(attributes) }
}
