import type { PropertyDef } from '@lodado/sdui-document'
import React from 'react'

import { type EditPropertyFn, ItemProperties } from './ItemProperties'
import type { CollectionItem } from './items'

export type CollectionCardProps = {
  item: CollectionItem
  properties: PropertyDef[]
  onOpen(documentId: string): void
  onEditProperty?: EditPropertyFn
}

/**
 * Gallery card: cover/title is the navigation trigger; the property strip is a
 * sibling (not nested in the button) so editable cells stay valid interactive
 * elements.
 */
export const GalleryCard = ({ item, properties, onOpen, onEditProperty }: CollectionCardProps) => (
  <div className="sdui-doc-gallery-card">
    <button
      type="button"
      className="sdui-doc-gallery-open"
      onClick={(event) => {
        event.stopPropagation()
        if (item.documentId) {
          onOpen(item.documentId)
        }
      }}
    >
      <div className="sdui-doc-gallery-cover">
        {item.coverUrl ? (
          <img src={item.coverUrl} alt="" loading="lazy" />
        ) : (
          <span className="sdui-doc-gallery-cover-icon" aria-hidden>
            {item.icon ?? '📄'}
          </span>
        )}
      </div>
      <span className="sdui-doc-gallery-title">
        {item.icon ? <span aria-hidden>{item.icon} </span> : null}
        {item.title}
      </span>
    </button>
    {properties.length > 0 && (
      <div className="sdui-doc-gallery-body">
        <ItemProperties item={item} properties={properties} onEdit={onEditProperty} />
      </div>
    )}
  </div>
)

export const GalleryView = ({
  items,
  properties,
  onOpen,
  onEditProperty,
  cardSize,
}: {
  items: CollectionItem[]
  properties: PropertyDef[]
  onOpen(documentId: string): void
  onEditProperty?: EditPropertyFn
  cardSize?: 'small' | 'medium' | 'large'
}) => (
  <div className="sdui-doc-gallery" data-size={cardSize ?? 'medium'}>
    {items.map((item) => (
      <GalleryCard key={item.id} item={item} properties={properties} onOpen={onOpen} onEditProperty={onEditProperty} />
    ))}
  </div>
)
