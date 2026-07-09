import type { CollectionBlockAttributes, PropertyValueMap, SduiDocumentBlock } from '@lodado/sdui-document'
import { PAGE_BLOCK_TYPE } from '@lodado/sdui-document'

/** Flattened page item for the collection views. */
export type CollectionItem = {
  id: string
  documentId: string
  title: string
  icon?: string
  coverUrl?: string
  description?: string
  properties: PropertyValueMap
}

function stringAttr(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

/** Extract renderable page items from a collection block's children (non-page children ignored). */
export function collectionItems(block: SduiDocumentBlock): CollectionItem[] {
  return (block.children ?? [])
    .filter((child) => child.type === PAGE_BLOCK_TYPE)
    .map((child) => ({
      id: child.id,
      documentId: stringAttr(child.attributes?.documentId) ?? '',
      title: (typeof child.state?.text === 'string' && child.state.text) || 'Untitled',
      icon: stringAttr(child.attributes?.icon),
      coverUrl: stringAttr(child.attributes?.coverUrl),
      description: stringAttr(child.attributes?.description),
      properties: (child.attributes?.properties as PropertyValueMap) ?? {},
    }))
}

/** Read the collection's view config with defaults applied. */
export function collectionConfig(
  block: SduiDocumentBlock,
): Required<Pick<CollectionBlockAttributes, 'view' | 'properties'>> &
  Pick<CollectionBlockAttributes, 'groupBy' | 'sortBy' | 'cardSize'> {
  const attrs = (block.attributes ?? {}) as CollectionBlockAttributes
  return {
    view: attrs.view ?? 'gallery',
    properties: attrs.properties ?? [],
    groupBy: attrs.groupBy,
    sortBy: attrs.sortBy,
    cardSize: attrs.cardSize,
  }
}
