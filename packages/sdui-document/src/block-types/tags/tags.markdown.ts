import type { SduiDocumentBlock } from '../../blocks/schema/block'

export function tagsToMarkdown(block: SduiDocumentBlock): string {
  const items = Array.isArray(block.attributes?.items) ? block.attributes.items : []
  return items
    .map((item) =>
      typeof (item as { label?: unknown }).label === 'string' ? `\`${(item as { label: string }).label}\`` : '',
    )
    .filter(Boolean)
    .join(' ')
}
