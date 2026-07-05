import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiDocumentBlockId } from '../../blocks/schema/ids'
import { emptyTextState } from '../shared'
import { CHECKLIST_BLOCK_TYPE } from './checklist.type'

export function createDefaultChecklist(
  id: SduiDocumentBlockId,
  attributes?: Record<string, unknown>,
): SduiDocumentBlock {
  return { id, type: CHECKLIST_BLOCK_TYPE, state: emptyTextState(), attributes: { checked: false, ...attributes } }
}
