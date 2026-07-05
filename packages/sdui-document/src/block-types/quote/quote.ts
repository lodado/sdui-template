import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { blockText, stateText } from '../shared'
import type { SduiBlockTypeModule } from '../types'
import { createDefaultQuote } from './quote.default'
import { quoteToMarkdown } from './quote.markdown'
import { type QuoteBlockState, quoteStateSchema } from './quote.schema'
import { QUOTE_BLOCK_TYPE } from './quote.type'

export type { QuoteBlockState } from './quote.schema'
export { QUOTE_BLOCK_TYPE } from './quote.type'

export type QuoteBlock = SduiDocumentBlock & {
  type: typeof QUOTE_BLOCK_TYPE
  state: QuoteBlockState
}

export function isQuoteBlock(block: SduiDocumentBlock): block is QuoteBlock {
  return block.type === QUOTE_BLOCK_TYPE
}

export const quoteBlockModule: SduiBlockTypeModule = {
  type: QUOTE_BLOCK_TYPE,
  toSduiNode(block, { theme, mapChildren }) {
    return {
      id: block.id,
      type: 'Div',
      state: { text: blockText(block) },
      attributes: { 'data-block-type': QUOTE_BLOCK_TYPE, className: theme.paragraph },
      children: mapChildren(block),
    }
  },
  fromSduiNode(node, { id, children }) {
    return { id, type: QUOTE_BLOCK_TYPE, state: { text: stateText(node) }, children }
  },
  createDefault: createDefaultQuote,
  stateSchema: quoteStateSchema,
  toMarkdown: quoteToMarkdown,
}
