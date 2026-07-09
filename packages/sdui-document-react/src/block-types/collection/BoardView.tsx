import type { PropertyDef } from '@lodado/sdui-document'
import { groupByProperty } from '@lodado/sdui-document'
import React from 'react'

import { GalleryCard } from './GalleryView'
import type { EditPropertyFn } from './ItemProperties'
import type { CollectionItem } from './items'

/**
 * Board view: columns keyed by a select property's options (via groupBy). When
 * no groupBy is set, everything falls into one column.
 */
export const BoardView = ({
  items,
  properties,
  groupBy,
  onOpen,
  onEditProperty,
}: {
  items: CollectionItem[]
  properties: PropertyDef[]
  groupBy?: string
  onOpen(documentId: string): void
  onEditProperty?: EditPropertyFn
}) => {
  const groupDef = properties.find((property) => property.id === groupBy && property.type === 'select')
  const columns = groupDef
    ? groupByProperty(items, groupDef, (item) => item.properties[groupDef.id])
    : [{ key: 'all', option: undefined, items }]

  return (
    <div className="sdui-doc-board">
      {columns.map((column) => (
        <div key={column.key} className="sdui-doc-board-column">
          <div className="sdui-doc-board-column-header">
            {column.option?.label ?? (groupDef ? 'No value' : 'All')} · {column.items.length}
          </div>
          {column.items.map((item) => (
            <GalleryCard
              key={item.id}
              item={item}
              properties={properties}
              onOpen={onOpen}
              onEditProperty={onEditProperty}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
