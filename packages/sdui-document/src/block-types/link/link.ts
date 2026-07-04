import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { blockText, sanitizeHref, stateText, stripKeys } from '../shared'
import type { SduiBlockTypeModule } from '../types'

export type LinkBlockAttributes = { href?: string; targetDocumentId?: string }

export type LinkBlock = SduiDocumentBlock & {
  type: 'document.link'
  attributes: LinkBlockAttributes
}

export function isLinkBlock(block: SduiDocumentBlock): block is LinkBlock {
  return block.type === 'document.link'
}

export const linkBlockModule: SduiBlockTypeModule = {
  type: 'document.link',
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
        'data-block-type': 'document.link',
        href: safeHref,
        rel: 'noopener noreferrer nofollow',
      },
    }
  },
  fromSduiNode(node, { id }) {
    const restAttribs = stripKeys(node.attributes ?? {}, 'data-block-type', 'rel', 'className')
    return {
      id,
      type: 'document.link',
      state: { text: stateText(node) },
      attributes: Object.keys(restAttribs).length > 0 ? restAttribs : undefined,
    }
  },
}
