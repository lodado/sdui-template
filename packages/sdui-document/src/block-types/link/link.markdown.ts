import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { sanitizeHref } from '../shared'
import { LINK_BLOCK_TYPE } from './link.type'

export function linkToMarkdown(block: SduiDocumentBlock): string {
  const href = sanitizeHref(block.attributes?.href) ?? ''
  const text = (typeof block.state?.text === 'string' && block.state.text) || href
  return `[${text}](${href})`
}
