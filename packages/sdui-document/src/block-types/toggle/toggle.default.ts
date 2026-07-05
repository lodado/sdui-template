import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiDocumentBlockId } from '../../blocks/schema/ids'
import { emptyTextState } from '../shared'
import { TOGGLE_BLOCK_TYPE } from './toggle.type'

export function createDefaultToggle(id: SduiDocumentBlockId, attributes?: Record<string, unknown>): SduiDocumentBlock {
  return { id, type: TOGGLE_BLOCK_TYPE, state: emptyTextState(), attributes: { collapsed: false, ...attributes } }
}
