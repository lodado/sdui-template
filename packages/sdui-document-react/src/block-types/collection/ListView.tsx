import type { PropertyDef } from '@lodado/sdui-document'
import React from 'react'

import { type EditPropertyFn, ItemProperties } from './ItemProperties'
import type { CollectionItem } from './items'

/** List view: one row per item — title (navigates) + property cells (editable). */
export const ListView = ({
  items,
  properties,
  onOpen,
  onEditProperty,
}: {
  items: CollectionItem[]
  properties: PropertyDef[]
  onOpen(documentId: string): void
  onEditProperty?: EditPropertyFn
}) => (
  <ul className="sdui-doc-list">
    {items.map((item) => (
      <li key={item.id} className="sdui-doc-list-row">
        <button
          type="button"
          className="sdui-doc-list-open"
          onClick={(event) => {
            event.stopPropagation()
            if (item.documentId) {
              onOpen(item.documentId)
            }
          }}
        >
          <span className="sdui-doc-list-title">
            <span aria-hidden>{item.icon ?? '📄'} </span>
            {item.title}
          </span>
        </button>
        <ItemProperties item={item} properties={properties} onEdit={onEditProperty} className="sdui-doc-list-props" />
      </li>
    ))}
  </ul>
)
