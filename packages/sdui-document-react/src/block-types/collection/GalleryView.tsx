import type { PropertyDef } from '@lodado/sdui-document'
import React from 'react'

import type { CollectionItem } from './items'
import { PropertyChip } from './PropertyChip'

export type CollectionCardProps = {
  item: CollectionItem
  properties: PropertyDef[]
  onOpen(documentId: string): void
}

/** Gallery card: cover (or icon) + title + property chips. */
export const GalleryCard = ({ item, properties, onOpen }: CollectionCardProps) => (
  <button
    type="button"
    className="sdui-doc-gallery-card"
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
    <div className="sdui-doc-gallery-body">
      <span className="sdui-doc-gallery-title">
        {item.icon ? <span aria-hidden>{item.icon} </span> : null}
        {item.title}
      </span>
      <div className="sdui-doc-gallery-props">
        {properties.map((def) => (
          <PropertyChip key={def.id} def={def} value={item.properties[def.id]} />
        ))}
      </div>
    </div>
  </button>
)

export const GalleryView = ({
  items,
  properties,
  onOpen,
  cardSize,
}: {
  items: CollectionItem[]
  properties: PropertyDef[]
  onOpen(documentId: string): void
  cardSize?: 'small' | 'medium' | 'large'
}) => (
  <div className="sdui-doc-gallery" data-size={cardSize ?? 'medium'}>
    {items.map((item) => (
      <GalleryCard key={item.id} item={item} properties={properties} onOpen={onOpen} />
    ))}
  </div>
)
