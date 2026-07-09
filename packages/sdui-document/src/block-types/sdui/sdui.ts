import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { stripKeys } from '../shared'
import type { ContentBlockTypeModule } from '../types'
import { createDefaultSdui } from './sdui.default'
import { sduiToMarkdown } from './sdui.markdown'
import { sduiAttributesSchema, type SduiBlockAttributes } from './sdui.schema'
import { SDUI_BLOCK_TYPE } from './sdui.type'

export type { SduiBlockAttributes } from './sdui.schema'
export { SDUI_BLOCK_TYPE } from './sdui.type'

export type SduiBlock = SduiDocumentBlock & {
  type: typeof SDUI_BLOCK_TYPE
  attributes: SduiBlockAttributes
}

export function isSduiBlock(block: SduiDocumentBlock): block is SduiBlock {
  return block.type === SDUI_BLOCK_TYPE
}

/**
 * Embedded SDUI layout document — the render layer mounts SduiLayoutRenderer
 * over `attributes.document` with a host-provided component map.
 */
export const sduiBlockModule = {
  type: SDUI_BLOCK_TYPE,
  toSduiNode(block, { theme }) {
    return {
      id: block.id,
      type: 'Div',
      attributes: { ...block.attributes, 'data-block-type': SDUI_BLOCK_TYPE, className: theme.paragraph },
    }
  },
  fromSduiNode(node, { id }) {
    const rest = stripKeys(node.attributes ?? {}, 'data-block-type', 'className')
    return { id, type: SDUI_BLOCK_TYPE, attributes: rest }
  },
  createDefault: createDefaultSdui,
  attributesSchema: sduiAttributesSchema,
  toMarkdown: sduiToMarkdown,
  canHostInlineText: false,
} satisfies ContentBlockTypeModule
