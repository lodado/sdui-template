import type { PropertyDef } from '@lodado/sdui-document'
import React from 'react'

import { type EditPropertyFn, ItemProperties } from './ItemProperties'
import type { CollectionItem } from './items'

/**
 * Seeded cover palettes: items without a cover image get a soft two-tone
 * gradient derived from their title, so every card looks intentional instead
 * of falling back to a flat gray box. Pairs stay pastel so the icon and any
 * overlaid text keep contrast in both themes.
 */
const COVER_PALETTES: ReadonlyArray<readonly [string, string]> = [
  ['#dbeafe', '#e0e7ff'],
  ['#dcfce7', '#d1fae5'],
  ['#fef3c7', '#ffedd5'],
  ['#fce7f3', '#ede9fe'],
  ['#e0f2fe', '#dcfce7'],
  ['#ffe4e6', '#fef3c7'],
]

function hashString(value: string): number {
  let hash = 5381
  for (let index = 0; index < value.length; index += 1) {
    hash = hash * 33 + value.charCodeAt(index)
  }
  return Math.abs(hash)
}

export function coverGradient(seed: string): string {
  const [from, to] = COVER_PALETTES[hashString(seed) % COVER_PALETTES.length]
  return `linear-gradient(135deg, ${from}, ${to})`
}

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
          <span className="sdui-doc-gallery-cover-fill" style={{ background: coverGradient(item.title) }} aria-hidden>
            <span className="sdui-doc-gallery-cover-icon">{item.icon ?? '📄'}</span>
          </span>
        )}
      </div>
      <span className="sdui-doc-gallery-text">
        <span className="sdui-doc-gallery-title">
          {/* gradient covers already show the icon at 44px — repeating it in the
              title reads as noise, so only image covers get the title icon */}
          {item.icon && item.coverUrl ? <span aria-hidden>{item.icon} </span> : null}
          {item.title}
        </span>
        {item.description ? <span className="sdui-doc-gallery-desc">{item.description}</span> : null}
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
    {items.map((item, index) => (
      <div
        key={item.id}
        className="sdui-doc-gallery-slot"
        style={{ '--card-i': Math.min(index, 8) } as React.CSSProperties}
      >
        <GalleryCard item={item} properties={properties} onOpen={onOpen} onEditProperty={onEditProperty} />
      </div>
    ))}
  </div>
)
