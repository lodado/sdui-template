import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { blockText, stateText, stripKeys } from '../shared'
import type { ContentBlockTypeModule } from '../types'
import { createDefaultPage } from './page.default'
import { pageToMarkdown } from './page.markdown'
import { pageAttributesSchema, type PageBlockAttributes, type PageBlockState, pageStateSchema } from './page.schema'
import { PAGE_BLOCK_TYPE } from './page.type'

export type { PageBlockAttributes, PageBlockState } from './page.schema'
export { PAGE_BLOCK_TYPE } from './page.type'

export type PageBlock = SduiDocumentBlock & {
  type: typeof PAGE_BLOCK_TYPE
  state?: PageBlockState
  attributes: PageBlockAttributes
}

export function isPageBlock(block: SduiDocumentBlock): block is PageBlock {
  return block.type === PAGE_BLOCK_TYPE
}

/**
 * Sub-page reference block — a leaf pointing at another document. Content is
 * owned by the target document; navigation (push/peek) is the renderer's job.
 */
export const pageBlockModule = {
  type: PAGE_BLOCK_TYPE,
  toSduiNode(block, { theme }) {
    return {
      id: block.id,
      type: 'Div',
      state: { text: blockText(block) },
      attributes: {
        ...block.attributes,
        'data-block-type': PAGE_BLOCK_TYPE,
        className: theme.paragraph,
      },
    }
  },
  fromSduiNode(node, { id }) {
    const restAttribs = stripKeys(node.attributes ?? {}, 'data-block-type', 'className')
    return {
      id,
      type: PAGE_BLOCK_TYPE,
      state: { text: stateText(node) },
      attributes: Object.keys(restAttribs).length > 0 ? restAttribs : undefined,
    }
  },
  createDefault: createDefaultPage,
  stateSchema: pageStateSchema,
  attributesSchema: pageAttributesSchema,
  toMarkdown: pageToMarkdown,
  canHostInlineText: false,
  extractLinks(block) {
    const targetDocumentId = block.attributes?.documentId
    return typeof targetDocumentId === 'string' && targetDocumentId.length > 0 ? [{ targetDocumentId }] : []
  },
} satisfies ContentBlockTypeModule
