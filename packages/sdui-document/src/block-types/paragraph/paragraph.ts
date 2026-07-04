// packages/sdui-document/src/block-types/paragraph/paragraph.ts
import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { blockText, stateText, stripKeys } from '../shared'
import type { SduiBlockTypeModule } from '../types'

export type ParagraphBlockState = { text?: string }

export type ParagraphBlock = SduiDocumentBlock & {
  type: 'document.paragraph'
  state: ParagraphBlockState
}

export function isParagraphBlock(block: SduiDocumentBlock): block is ParagraphBlock {
  return block.type === 'document.paragraph'
}

/**
 * Also the fallback module for unknown block types in both directions,
 * matching the old switch `default` cases (toSduiLayout/fromSduiLayout).
 */
export const paragraphBlockModule: SduiBlockTypeModule = {
  type: 'document.paragraph',
  toSduiNode(block, { theme }) {
    return {
      id: block.id,
      type: 'Span',
      state: { text: blockText(block) },
      attributes: {
        'data-block-type': block.type,
        className: theme.paragraph,
        ...block.attributes,
      },
    }
  },
  fromSduiNode(node, { id, children }) {
    const blockType = String(node.attributes?.['data-block-type'] ?? 'document.paragraph')
    const restAttribs = stripKeys(node.attributes ?? {}, 'data-block-type', 'className')
    return {
      id,
      type: blockType as SduiDocumentBlock['type'],
      state: { text: stateText(node) },
      attributes: Object.keys(restAttribs).length > 0 ? restAttribs : undefined,
      children,
    }
  },
}
