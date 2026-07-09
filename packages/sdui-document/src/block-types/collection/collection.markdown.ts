import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { SDUI_DOC_URL_SCHEME } from '../page/page.markdown'
import { PAGE_BLOCK_TYPE } from '../page/page.type'

/** Collections degrade to a flat link list in markdown (view info is lossy). */
export function collectionToMarkdown(block: SduiDocumentBlock): string {
  const items = (block.children ?? []).filter((child) => child.type === PAGE_BLOCK_TYPE)
  if (items.length === 0) {
    return ''
  }

  return items
    .map((item) => {
      const documentId = typeof item.attributes?.documentId === 'string' ? item.attributes.documentId : ''
      const title = typeof item.state?.text === 'string' && item.state.text ? item.state.text : 'Untitled'
      return `- [${title}](${SDUI_DOC_URL_SCHEME}${documentId})`
    })
    .join('\n')
}
