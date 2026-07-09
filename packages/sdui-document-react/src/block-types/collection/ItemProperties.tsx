import type { PropertyDef } from '@lodado/sdui-document'
import React from 'react'

import type { CollectionItem } from './items'
import { PropertyChip } from './PropertyChip'
import { EditablePropertyCell } from './PropertyValueEditor'

export type EditPropertyFn = (itemId: string, propertyId: string, value: unknown) => void

/**
 * Renders an item's property values: static chips in read mode, editable cells
 * (chip → value-editor popover) when `onEdit` is provided.
 */
export const ItemProperties = ({
  item,
  properties,
  onEdit,
  className = 'sdui-doc-gallery-props',
}: {
  item: CollectionItem
  properties: PropertyDef[]
  onEdit?: EditPropertyFn
  className?: string
}) => (
  <span className={className}>
    {properties.map((def) =>
      onEdit ? (
        <EditablePropertyCell
          key={def.id}
          def={def}
          value={item.properties[def.id]}
          onChange={(value) => onEdit(item.id, def.id, value)}
        />
      ) : (
        <PropertyChip key={def.id} def={def} value={item.properties[def.id]} />
      ),
    )}
  </span>
)
