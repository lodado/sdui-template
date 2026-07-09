import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { stripKeys } from '../shared'
import { isSafeHttpUrl } from '../shared/url'
import type { ContentBlockTypeModule } from '../types'
import { createDefaultBookmark } from './bookmark.default'
import { bookmarkToMarkdown } from './bookmark.markdown'
import { bookmarkAttributesSchema, type BookmarkBlockAttributes } from './bookmark.schema'
import { BOOKMARK_BLOCK_TYPE } from './bookmark.type'

export type { BookmarkBlockAttributes } from './bookmark.schema'
export { BOOKMARK_BLOCK_TYPE } from './bookmark.type'

export type BookmarkBlock = SduiDocumentBlock & {
  type: typeof BOOKMARK_BLOCK_TYPE
  attributes: BookmarkBlockAttributes
}

export function isBookmarkBlock(block: SduiDocumentBlock): block is BookmarkBlock {
  return block.type === BOOKMARK_BLOCK_TYPE
}

/** Card-style link preview; unfurl metadata is persisted so the viewer needs no network. */
export const bookmarkBlockModule = {
  type: BOOKMARK_BLOCK_TYPE,
  toSduiNode(block, { theme }) {
    return {
      id: block.id,
      type: 'Div',
      attributes: { ...block.attributes, 'data-block-type': BOOKMARK_BLOCK_TYPE, className: theme.paragraph },
    }
  },
  fromSduiNode(node, { id }) {
    const rest = stripKeys(node.attributes ?? {}, 'data-block-type', 'className')
    return { id, type: BOOKMARK_BLOCK_TYPE, attributes: rest }
  },
  createDefault: createDefaultBookmark,
  attributesSchema: bookmarkAttributesSchema,
  toMarkdown: bookmarkToMarkdown,
  canHostInlineText: false,
  extractLinks(block) {
    const url = block.attributes?.url
    return typeof url === 'string' && isSafeHttpUrl(url) ? [{ href: url }] : []
  },
} satisfies ContentBlockTypeModule
