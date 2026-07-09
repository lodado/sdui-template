import type { SduiDocumentBlock } from '@lodado/sdui-document'
import { findBlockById, sortByProperty } from '@lodado/sdui-document'
import React from 'react'

import { useDocumentContent } from '../../editor/DocumentContentContext'
import { useSduiPage } from '../../page/SduiPageContext'
import { GalleryView } from './GalleryView'
import { collectionConfig, collectionItems } from './items'
import { ListView } from './ListView'

export type CollectionBlockProps = {
  block: SduiDocumentBlock
  /** Editor-only: add a new page item to this collection (omitted in read mode). */
  onAddItem?(collectionId: string): void
}

/**
 * Database-like block. Children (page items) live in the document tree, but the
 * entry-reconstructed `block` is childless — so the live children are read from
 * the document-content store and rendered by the selected view.
 */
export const CollectionBlock = ({ block, onAddItem }: CollectionBlockProps) => {
  const content = useDocumentContent()
  const page = useSduiPage()

  // Prefer the live tree (has children); fall back to the passed block (tests / static).
  const liveBlock = (content ? findBlockById(content, block.id) : undefined) ?? block
  const config = collectionConfig(liveBlock)
  const items = collectionItems(liveBlock)

  const sorted = React.useMemo(() => {
    if (!config.sortBy) {
      return items
    }
    const def = config.properties.find((property) => property.id === config.sortBy!.propertyId)
    if (!def) {
      return items
    }
    return sortByProperty(items, def, config.sortBy.direction, (item) => item.properties[def.id])
  }, [items, config.sortBy, config.properties])

  const open = (documentId: string) => page?.open(documentId)

  return (
    <div className="sdui-doc-collection" data-view={config.view} contentEditable={false}>
      {config.view === 'list' ? (
        <ListView items={sorted} properties={config.properties} onOpen={open} />
      ) : (
        <GalleryView items={sorted} properties={config.properties} onOpen={open} cardSize={config.cardSize} />
      )}
      {onAddItem ? (
        <button type="button" className="sdui-doc-collection-add" onClick={() => onAddItem(block.id)}>
          + New
        </button>
      ) : null}
    </div>
  )
}
