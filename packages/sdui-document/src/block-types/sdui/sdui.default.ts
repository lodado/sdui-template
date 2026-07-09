import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiDocumentBlockId } from '../../blocks/schema/ids'
import { SDUI_BLOCK_TYPE } from './sdui.type'

export function createDefaultSdui(id: SduiDocumentBlockId, attributes?: Record<string, unknown>): SduiDocumentBlock {
  return {
    id,
    type: SDUI_BLOCK_TYPE,
    attributes: {
      document: { version: '1.0', root: { id: `${id}-root`, type: 'Div' } },
      ...attributes,
    },
  }
}
