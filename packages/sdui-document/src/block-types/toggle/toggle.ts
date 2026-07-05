import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { blockText, stateText } from '../shared'
import type { ContentBlockTypeModule } from '../types'
import { createDefaultToggle } from './toggle.default'
import { toggleToMarkdown } from './toggle.markdown'
import {
  toggleAttributesSchema,
  type ToggleBlockAttributes,
  type ToggleBlockState,
  toggleStateSchema,
} from './toggle.schema'
import { TOGGLE_BLOCK_TYPE } from './toggle.type'

export type { ToggleBlockAttributes, ToggleBlockState } from './toggle.schema'
export { TOGGLE_BLOCK_TYPE } from './toggle.type'

export type ToggleBlock = SduiDocumentBlock & {
  type: typeof TOGGLE_BLOCK_TYPE
  state: ToggleBlockState
  attributes?: ToggleBlockAttributes
}

export function isToggleBlock(block: SduiDocumentBlock): block is ToggleBlock {
  return block.type === TOGGLE_BLOCK_TYPE
}

export const toggleBlockModule = {
  type: TOGGLE_BLOCK_TYPE,
  toSduiNode(block, { theme, mapChildren }) {
    const collapsed = block.attributes?.collapsed === true
    return {
      id: block.id,
      type: 'Div',
      state: { text: blockText(block), collapsed },
      attributes: { 'data-block-type': TOGGLE_BLOCK_TYPE, className: theme.paragraph },
      // collapsed toggles keep children in the document; only rendering hides them
      children: mapChildren(block),
    }
  },
  fromSduiNode(node, { id, children }) {
    return {
      id,
      type: TOGGLE_BLOCK_TYPE,
      state: { text: stateText(node) },
      attributes: { collapsed: node.state?.collapsed === true },
      children,
    }
  },
  createDefault: createDefaultToggle,
  stateSchema: toggleStateSchema,
  attributesSchema: toggleAttributesSchema,
  toMarkdown: toggleToMarkdown,
} satisfies ContentBlockTypeModule
