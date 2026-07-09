import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiDocumentBlockId } from '../../blocks/schema/ids'
import { emptyTextState } from '../shared'
import { BUTTON_BLOCK_TYPE } from './button.type'

export function createDefaultButton(id: SduiDocumentBlockId, attributes?: Record<string, unknown>): SduiDocumentBlock {
  return {
    id,
    type: BUTTON_BLOCK_TYPE,
    state: emptyTextState(),
    attributes: { href: '', variant: 'primary', ...attributes },
  }
}
