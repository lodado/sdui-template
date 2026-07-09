import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { blockText } from '../shared'

export function buttonToMarkdown(block: SduiDocumentBlock): string {
  const href = typeof block.attributes?.href === 'string' ? block.attributes.href : ''
  const label = blockText(block) || href
  return `[${label}](${href})`
}
