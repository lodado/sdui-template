// packages/sdui-document/src/block-types/paragraph/paragraph.ts
import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { blockText, stateText, stripKeys } from '../shared'
import type { SduiBlockTypeModule } from '../types'
import { createDefaultParagraph } from './paragraph.default'
import { paragraphToMarkdown } from './paragraph.markdown'
import { type ParagraphBlockState, paragraphStateSchema } from './paragraph.schema'
import { PARAGRAPH_BLOCK_TYPE } from './paragraph.type'

export type { ParagraphBlockState } from './paragraph.schema'
export { PARAGRAPH_BLOCK_TYPE } from './paragraph.type'

export type ParagraphBlock = SduiDocumentBlock & {
  type: typeof PARAGRAPH_BLOCK_TYPE
  state: ParagraphBlockState
}

export function isParagraphBlock(block: SduiDocumentBlock): block is ParagraphBlock {
  return block.type === PARAGRAPH_BLOCK_TYPE
}

/**
 * Also the fallback module for unknown block types in both directions,
 * matching the old switch `default` cases (toSduiLayout/fromSduiLayout).
 */
export const paragraphBlockModule: SduiBlockTypeModule = {
  type: PARAGRAPH_BLOCK_TYPE,
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
    const blockType = String(node.attributes?.['data-block-type'] ?? PARAGRAPH_BLOCK_TYPE)
    const restAttribs = stripKeys(node.attributes ?? {}, 'data-block-type', 'className')
    return {
      id,
      type: blockType as SduiDocumentBlock['type'],
      state: { text: stateText(node) },
      attributes: Object.keys(restAttribs).length > 0 ? restAttribs : undefined,
      children,
    }
  },
  createDefault: createDefaultParagraph,
  stateSchema: paragraphStateSchema,
  toMarkdown: paragraphToMarkdown,
}
