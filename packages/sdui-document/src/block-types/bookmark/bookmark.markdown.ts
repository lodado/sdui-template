import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { BOOKMARK_BLOCK_TYPE } from './bookmark.type'

export function bookmarkToMarkdown(block: SduiDocumentBlock): string {
  const url = typeof block.attributes?.url === 'string' ? block.attributes.url : ''
  const title = typeof block.attributes?.title === 'string' && block.attributes.title ? block.attributes.title : url
  return `[${title}](${url})`
}

export { BOOKMARK_BLOCK_TYPE }
