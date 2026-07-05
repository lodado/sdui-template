import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiBlockTypeModule } from '../types'
import { createDefaultDivider } from './divider.default'
import { dividerToMarkdown } from './divider.markdown'
import { DIVIDER_BLOCK_TYPE } from './divider.type'

export { DIVIDER_BLOCK_TYPE } from './divider.type'
export type DividerBlock = SduiDocumentBlock & { type: typeof DIVIDER_BLOCK_TYPE }

export function isDividerBlock(block: SduiDocumentBlock): block is DividerBlock {
  return block.type === DIVIDER_BLOCK_TYPE
}

export const dividerBlockModule: SduiBlockTypeModule = {
  type: DIVIDER_BLOCK_TYPE,
  toSduiNode(block, { theme }) {
    return {
      id: block.id,
      type: 'Div',
      attributes: { 'data-block-type': DIVIDER_BLOCK_TYPE, className: theme.divider },
    }
  },
  fromSduiNode(_node, { id }) {
    return { id, type: DIVIDER_BLOCK_TYPE }
  },
  createDefault: createDefaultDivider,
  toMarkdown: dividerToMarkdown,
  canHostInlineText: false,
}
