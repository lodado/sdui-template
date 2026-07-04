import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiBlockTypeModule } from '../types'

export type DividerBlock = SduiDocumentBlock & { type: 'document.divider' }

export function isDividerBlock(block: SduiDocumentBlock): block is DividerBlock {
  return block.type === 'document.divider'
}

export const dividerBlockModule: SduiBlockTypeModule = {
  type: 'document.divider',
  toSduiNode(block, { theme }) {
    return {
      id: block.id,
      type: 'Div',
      attributes: { 'data-block-type': 'document.divider', className: theme.divider },
    }
  },
  fromSduiNode(_node, { id }) {
    return { id, type: 'document.divider' }
  },
}
