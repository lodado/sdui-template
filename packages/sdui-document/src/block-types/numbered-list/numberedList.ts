import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { blockText, stateText } from '../shared'
import type { ContentBlockTypeModule } from '../types'
import { createDefaultNumberedList } from './numberedList.default'
import { numberedListToMarkdown } from './numberedList.markdown'
import { type NumberedListBlockState, numberedListStateSchema } from './numberedList.schema'
import { NUMBERED_LIST_BLOCK_TYPE } from './numberedList.type'

export type { NumberedListBlockState } from './numberedList.schema'
export { NUMBERED_LIST_BLOCK_TYPE } from './numberedList.type'

export type NumberedListBlock = SduiDocumentBlock & {
  type: typeof NUMBERED_LIST_BLOCK_TYPE
  state: NumberedListBlockState
}

export function isNumberedListBlock(block: SduiDocumentBlock): block is NumberedListBlock {
  return block.type === NUMBERED_LIST_BLOCK_TYPE
}

export const numberedListBlockModule = {
  type: NUMBERED_LIST_BLOCK_TYPE,
  toSduiNode(block, { theme, mapChildren }) {
    return {
      id: block.id,
      type: 'Div',
      state: { text: blockText(block) },
      attributes: { 'data-block-type': NUMBERED_LIST_BLOCK_TYPE, className: theme.paragraph },
      children: mapChildren(block),
    }
  },
  fromSduiNode(node, { id, children }) {
    return { id, type: NUMBERED_LIST_BLOCK_TYPE, state: { text: stateText(node) }, children }
  },
  createDefault: createDefaultNumberedList,
  stateSchema: numberedListStateSchema,
  toMarkdown: numberedListToMarkdown,
} satisfies ContentBlockTypeModule
