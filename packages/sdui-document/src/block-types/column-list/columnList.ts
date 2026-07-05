// packages/sdui-document/src/block-types/column-list/columnList.ts
import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiBlockTypeModule } from '../types'
import { columnListToMarkdown } from './columnList.markdown'
import { COLUMN_LIST_BLOCK_TYPE } from './columnList.type'

export { COLUMN_LIST_BLOCK_TYPE } from './columnList.type'

export function isColumnListBlock(block: SduiDocumentBlock): boolean {
  return block.type === COLUMN_LIST_BLOCK_TYPE
}

/**
 * Horizontal container — children are column blocks only, laid out as a flex
 * row. Never menu-inserted (no createDefault): columnLists exist only through
 * the horizontal drag-drop wrap operation, mirroring Notion.
 */
export const columnListBlockModule: SduiBlockTypeModule = {
  type: COLUMN_LIST_BLOCK_TYPE,
  toSduiNode(block, { theme, mapChildren }) {
    return {
      id: block.id,
      type: 'Div',
      attributes: {
        'data-block-type': COLUMN_LIST_BLOCK_TYPE,
        className: theme.columnList,
      },
      children: mapChildren(block),
    }
  },
  fromSduiNode(_node, { id, children }) {
    return { id, type: COLUMN_LIST_BLOCK_TYPE, children }
  },
  toMarkdown: columnListToMarkdown,
  canHostInlineText: false,
}
