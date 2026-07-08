import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { blockText, stateText } from '../shared'
import type { ContentBlockTypeModule } from '../types'
import { createDefaultBulletedList } from './bulletedList.default'
import { bulletedListToMarkdown } from './bulletedList.markdown'
import { type BulletedListBlockState, bulletedListStateSchema } from './bulletedList.schema'
import { BULLETED_LIST_BLOCK_TYPE } from './bulletedList.type'

export type { BulletedListBlockState } from './bulletedList.schema'
export { BULLETED_LIST_BLOCK_TYPE } from './bulletedList.type'

export type BulletedListBlock = SduiDocumentBlock & {
  type: typeof BULLETED_LIST_BLOCK_TYPE
  state: BulletedListBlockState
}

export function isBulletedListBlock(block: SduiDocumentBlock): block is BulletedListBlock {
  return block.type === BULLETED_LIST_BLOCK_TYPE
}

export const bulletedListBlockModule = {
  type: BULLETED_LIST_BLOCK_TYPE,
  isListItem: true,
  toSduiNode(block, { theme, mapChildren }) {
    return {
      id: block.id,
      type: 'Div',
      state: { text: blockText(block) },
      attributes: { 'data-block-type': BULLETED_LIST_BLOCK_TYPE, className: theme.paragraph },
      children: mapChildren(block),
    }
  },
  fromSduiNode(node, { id, children }) {
    return { id, type: BULLETED_LIST_BLOCK_TYPE, state: { text: stateText(node) }, children }
  },
  createDefault: createDefaultBulletedList,
  stateSchema: bulletedListStateSchema,
  toMarkdown: bulletedListToMarkdown,
} satisfies ContentBlockTypeModule
