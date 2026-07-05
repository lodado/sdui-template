// packages/sdui-document/src/block-types/column/column.ts
import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiBlockTypeModule } from '../types'
import { columnToMarkdown } from './column.markdown'
import { columnAttributesSchema, normalizeColumnRatio } from './column.schema'
import { COLUMN_BLOCK_TYPE } from './column.type'

export type { ColumnBlockAttributes } from './column.schema'
export { COLUMN_BLOCK_TYPE } from './column.type'

export function isColumnBlock(block: SduiDocumentBlock): boolean {
  return block.type === COLUMN_BLOCK_TYPE
}

/**
 * One vertical stack inside a columnList. `attributes.ratio` weights the
 * column's width among siblings (grow factor); invalid or absent ratios fall
 * back to an equal split. Never menu-inserted (no createDefault).
 */
export const columnBlockModule: SduiBlockTypeModule = {
  type: COLUMN_BLOCK_TYPE,
  toSduiNode(block, { theme, mapChildren }) {
    const ratio = normalizeColumnRatio(block.attributes?.ratio)

    return {
      id: block.id,
      type: 'Div',
      attributes: {
        'data-block-type': COLUMN_BLOCK_TYPE,
        ...(ratio !== undefined ? { 'data-ratio': ratio } : {}),
        className: ratio !== undefined ? `${theme.column} grow-[${ratio}]` : theme.column,
      },
      children: mapChildren(block),
    }
  },
  fromSduiNode(node, { id, children }) {
    const ratio = normalizeColumnRatio(node.attributes?.['data-ratio'])

    return {
      id,
      type: COLUMN_BLOCK_TYPE,
      ...(ratio !== undefined ? { attributes: { ratio } } : {}),
      children,
    }
  },
  attributesSchema: columnAttributesSchema,
  toMarkdown: columnToMarkdown,
  canHostInlineText: false,
}
