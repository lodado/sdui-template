import type { DateRangeValue, PropertyDef } from '@lodado/sdui-document'
import { findPropertyOption, parsePropertyValue } from '@lodado/sdui-document'
import React from 'react'

function formatDate(iso: string): string {
  const parsed = Date.parse(iso)
  return Number.isNaN(parsed) ? iso : new Date(parsed).toISOString().slice(0, 10)
}

/** Renders a single property value as a Notion-style chip / text, by type. */
export const PropertyChip = ({ def, value }: { def: PropertyDef; value: unknown }) => {
  const parsed = parsePropertyValue(def, value)
  if (parsed === undefined) {
    return null
  }

  switch (def.type) {
    case 'select': {
      const option = findPropertyOption(def, parsed as string)
      return (
        <span className="sdui-doc-chip" data-color={option?.color ?? 'gray'}>
          {option?.label ?? (parsed as string)}
        </span>
      )
    }
    case 'multiSelect':
      return (
        <span className="sdui-doc-chip-group">
          {(parsed as string[]).map((optionId) => {
            const option = findPropertyOption(def, optionId)
            return (
              <span key={optionId} className="sdui-doc-chip" data-color={option?.color ?? 'gray'}>
                {option?.label ?? optionId}
              </span>
            )
          })}
        </span>
      )
    case 'date':
      return <span className="sdui-doc-prop-date">{formatDate(parsed as string)}</span>
    case 'dateRange': {
      const range = parsed as DateRangeValue
      return (
        <span className="sdui-doc-prop-date">
          {formatDate(range.start)}
          {range.end ? ` → ${formatDate(range.end)}` : ''}
        </span>
      )
    }
    case 'url':
      return (
        <a className="sdui-doc-prop-url" href={parsed as string} target="_blank" rel="noopener noreferrer">
          {parsed as string}
        </a>
      )
    default:
      return <span className="sdui-doc-prop-text">{parsed as string}</span>
  }
}
