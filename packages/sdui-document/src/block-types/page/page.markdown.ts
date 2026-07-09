import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { blockText } from '../shared'
import { PAGE_BLOCK_TYPE } from './page.type'

/** Custom scheme keeps the document reference round-trippable in markdown. */
export const SDUI_DOC_URL_SCHEME = 'sdui-doc://'

export function pageToMarkdown(block: SduiDocumentBlock): string {
  const documentId = typeof block.attributes?.documentId === 'string' ? block.attributes.documentId : ''
  const title = blockText(block) || 'Untitled'
  return `[${title}](${SDUI_DOC_URL_SCHEME}${documentId})`
}
