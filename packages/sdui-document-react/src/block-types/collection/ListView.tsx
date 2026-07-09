import type { PropertyDef } from '@lodado/sdui-document'
import React from 'react'

import type { CollectionItem } from './items'
import { PropertyChip } from './PropertyChip'

/** List view: one row per item, title + property columns. */
export const ListView = ({
  items,
  properties,
  onOpen,
}: {
  items: CollectionItem[]
  properties: PropertyDef[]
  onOpen(documentId: string): void
}) => (
  <ul className="sdui-doc-list">
    {items.map((item) => (
      <li key={item.id}>
        <button
          type="button"
          className="sdui-doc-list-row"
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
          <span className="sdui-doc-list-props">
            {properties.map((def) => (
              <PropertyChip key={def.id} def={def} value={item.properties[def.id]} />
            ))}
          </span>
        </button>
      </li>
    ))}
  </ul>
)
