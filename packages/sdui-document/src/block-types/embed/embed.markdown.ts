import type { SduiDocumentBlock } from '../../blocks/schema/block'

export function embedToMarkdown(block: SduiDocumentBlock): string {
  const url = typeof block.attributes?.url === 'string' ? block.attributes.url : ''
  return `[embed](${url})`
}
