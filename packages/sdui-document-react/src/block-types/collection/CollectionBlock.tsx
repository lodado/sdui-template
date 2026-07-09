import type { SduiDocumentBlock } from '@lodado/sdui-document'
import { findBlockById, sortByProperty } from '@lodado/sdui-document'
import React from 'react'

import { useDocumentContent } from '../../editor/DocumentContentContext'
import { useSduiPage } from '../../page/SduiPageContext'
import { BoardView } from './BoardView'
import { CollectionToolbar } from './CollectionToolbar'
import { GalleryView } from './GalleryView'
import { collectionConfig, collectionItems } from './items'
import { ListView } from './ListView'
import { TimelineView } from './TimelineView'

/** Editor-only mutation handlers; omitted entirely in read mode. */
export type CollectionEditorHandlers = {
  onAddItem(collectionId: string): void
  onSetCollectionAttrs(collectionId: string, partial: Record<string, unknown>): void
  onSetItemProperty(itemId: string, propertyId: string, value: unknown): void
}

export type CollectionBlockProps = {
  block: SduiDocumentBlock
  editor?: CollectionEditorHandlers
}

/**
 * Database-like block. Children (page items) live in the document tree, but the
 * entry-reconstructed `block` is childless — so the live children are read from
 * the document-content store and rendered by the selected view.
 */
export const CollectionBlock = ({ block, editor }: CollectionBlockProps) => {
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
  const onEditProperty = editor?.onSetItemProperty

  return (
    <div className="sdui-doc-collection" data-view={config.view} contentEditable={false}>
      {editor ? (
        <CollectionToolbar
          collectionId={block.id}
          view={config.view}
          properties={config.properties}
          groupBy={config.groupBy}
          sortBy={config.sortBy}
          onSetAttrs={editor.onSetCollectionAttrs}
        />
      ) : null}

      {config.view === 'list' && (
        <ListView items={sorted} properties={config.properties} onOpen={open} onEditProperty={onEditProperty} />
      )}
      {config.view === 'board' && (
        <BoardView
          items={sorted}
          properties={config.properties}
          groupBy={config.groupBy}
          onOpen={open}
          onEditProperty={onEditProperty}
        />
      )}
      {config.view === 'timeline' && (
        <TimelineView items={sorted} properties={config.properties} onOpen={open} onEditProperty={onEditProperty} />
      )}
      {config.view === 'gallery' && (
        <GalleryView
          items={sorted}
          properties={config.properties}
          onOpen={open}
          onEditProperty={onEditProperty}
          cardSize={config.cardSize}
        />
      )}

      {editor ? (
        <button type="button" className="sdui-doc-collection-add" onClick={() => editor.onAddItem(block.id)}>
          + New
        </button>
      ) : null}
    </div>
  )
}
