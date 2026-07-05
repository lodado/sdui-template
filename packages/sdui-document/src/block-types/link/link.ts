import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { blockText, sanitizeHref, stateText, stripKeys } from '../shared'
import type { SduiBlockTypeModule } from '../types'
import { createDefaultLink } from './link.default'
import { linkToMarkdown } from './link.markdown'
import { linkAttributesSchema, type LinkBlockAttributes } from './link.schema'
import { LINK_BLOCK_TYPE } from './link.type'

export type { LinkBlockAttributes } from './link.schema'
export { LINK_BLOCK_TYPE } from './link.type'

export type LinkBlock = SduiDocumentBlock & {
  type: typeof LINK_BLOCK_TYPE
  attributes: LinkBlockAttributes
}

export function isLinkBlock(block: SduiDocumentBlock): block is LinkBlock {
  return block.type === LINK_BLOCK_TYPE
}

export const linkBlockModule: SduiBlockTypeModule = {
  type: LINK_BLOCK_TYPE,
  toSduiNode(block, { theme }) {
    const safeHref = sanitizeHref(block.attributes?.href)

    return {
      id: block.id,
      type: 'Span',
      state: { text: blockText(block) || safeHref || '' },
      attributes: {
        className: theme.link,
        ...block.attributes,
        // sanitized href, rel, and data-block-type override any values from block.attributes
        'data-block-type': LINK_BLOCK_TYPE,
        href: safeHref,
        rel: 'noopener noreferrer nofollow',
      },
    }
  },
  fromSduiNode(node, { id }) {
    const restAttribs = stripKeys(node.attributes ?? {}, 'data-block-type', 'rel', 'className')
    return {
      id,
      type: LINK_BLOCK_TYPE,
      state: { text: stateText(node) },
      attributes: Object.keys(restAttribs).length > 0 ? restAttribs : undefined,
    }
  },
  createDefault: createDefaultLink,
  attributesSchema: linkAttributesSchema,
  toMarkdown: linkToMarkdown,
  canHostInlineText: false,
  extractLinks(block) {
    const targetDocumentId = block.attributes?.targetDocumentId
    const href = block.attributes?.href
    return [
      {
        targetDocumentId: typeof targetDocumentId === 'string' ? targetDocumentId : undefined,
        href: typeof href === 'string' ? href : undefined,
      },
    ]
  },
}
