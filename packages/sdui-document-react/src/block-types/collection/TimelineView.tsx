import type { DateRangeValue, PropertyDef } from '@lodado/sdui-document'
import { parsePropertyValue } from '@lodado/sdui-document'
import React from 'react'

import type { CollectionItem } from './items'
import { PropertyChip } from './PropertyChip'

function formatDate(iso: string): string {
  const parsed = Date.parse(iso)
  return Number.isNaN(parsed) ? iso : new Date(parsed).toISOString().slice(0, 10)
}

/** Resolve an item's period label from its first date / dateRange property. */
function periodLabel(item: CollectionItem, dateDef?: PropertyDef): string {
  if (!dateDef) {
    return ''
  }
  const value = parsePropertyValue(dateDef, item.properties[dateDef.id])
  if (value === undefined) {
    return ''
  }
  if (dateDef.type === 'dateRange') {
    const range = value as DateRangeValue
    return `${formatDate(range.start)}${range.end ? ` → ${formatDate(range.end)}` : ''}`
  }
  return formatDate(value as string)
}

/**
 * Timeline view: vertical list keyed off the first date/dateRange property
 * (career-timeline shape). Items are rendered in their sorted order; the period
 * column shows the resolved date.
 */
export const TimelineView = ({
  items,
  properties,
  onOpen,
}: {
  items: CollectionItem[]
  properties: PropertyDef[]
  onOpen(documentId: string): void
}) => {
  const dateDef = properties.find((property) => property.type === 'dateRange' || property.type === 'date')
  const otherProps = properties.filter((property) => property.id !== dateDef?.id)

  return (
    <div className="sdui-doc-timeline">
      {items.map((item) => (
        <div key={item.id} className="sdui-doc-timeline-row">
          <span className="sdui-doc-timeline-period">{periodLabel(item, dateDef)}</span>
          <button
            type="button"
            className="sdui-doc-timeline-card"
            onClick={(event) => {
              event.stopPropagation()
              if (item.documentId) {
                onOpen(item.documentId)
              }
            }}
          >
            <span className="sdui-doc-timeline-title">
              <span aria-hidden>{item.icon ?? '📄'} </span>
              {item.title}
            </span>
            <span className="sdui-doc-list-props">
              {otherProps.map((def) => (
                <PropertyChip key={def.id} def={def} value={item.properties[def.id]} />
              ))}
            </span>
          </button>
        </div>
      ))}
    </div>
  )
}
