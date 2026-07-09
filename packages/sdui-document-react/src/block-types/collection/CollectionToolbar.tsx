import type { CollectionView, PropertyDef, PropertyType } from '@lodado/sdui-document'
import { COLLECTION_VIEWS } from '@lodado/sdui-document'
import * as Popover from '@radix-ui/react-popover'
import React, { useState } from 'react'

const VIEW_LABELS: Record<CollectionView, string> = {
  gallery: 'Gallery',
  list: 'List',
  board: 'Board',
  timeline: 'Timeline',
}

const PROPERTY_TYPE_OPTIONS: { value: PropertyType; label: string }[] = [
  { value: 'text', label: 'Text' },
  { value: 'select', label: 'Select' },
  { value: 'multiSelect', label: 'Multi-select' },
  { value: 'date', label: 'Date' },
  { value: 'dateRange', label: 'Date range' },
  { value: 'url', label: 'URL' },
]

function slug(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '') || 'prop'
  )
}

export type CollectionSort = { propertyId: string; direction: 'asc' | 'desc' }

export type CollectionToolbarProps = {
  collectionId: string
  view: CollectionView
  properties: PropertyDef[]
  groupBy?: string
  sortBy?: CollectionSort
  onSetAttrs(collectionId: string, partial: Record<string, unknown>): void
}

/** Editor-only header: view switcher + sort + property manager (add/remove, groupBy). */
export const CollectionToolbar = ({
  collectionId,
  view,
  properties,
  groupBy,
  sortBy,
  onSetAttrs,
}: CollectionToolbarProps) => {
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<PropertyType>('text')

  const selectProps = properties.filter((property) => property.type === 'select')

  const setSort = (propertyId: string) => {
    if (!propertyId) {
      onSetAttrs(collectionId, { sortBy: undefined })
      return
    }
    onSetAttrs(collectionId, { sortBy: { propertyId, direction: sortBy?.direction ?? 'asc' } })
  }

  const toggleDirection = () => {
    if (!sortBy) {
      return
    }
    onSetAttrs(collectionId, { sortBy: { ...sortBy, direction: sortBy.direction === 'asc' ? 'desc' : 'asc' } })
  }

  const addProperty = () => {
    const name = newName.trim()
    if (!name) {
      return
    }
    const base = slug(name)
    const id = properties.some((property) => property.id === base) ? `${base}-${properties.length}` : base
    onSetAttrs(collectionId, {
      properties: [
        ...properties,
        { id, name, type: newType, ...(newType === 'select' || newType === 'multiSelect' ? { options: [] } : {}) },
      ],
    })
    setNewName('')
    setNewType('text')
  }

  const removeProperty = (id: string) => {
    onSetAttrs(collectionId, {
      properties: properties.filter((property) => property.id !== id),
      ...(groupBy === id ? { groupBy: undefined } : {}),
    })
  }

  return (
    <div className="sdui-doc-collection-toolbar" contentEditable={false}>
      <div className="sdui-doc-collection-views" role="tablist" aria-label="Collection view">
        {COLLECTION_VIEWS.map((viewOption) => (
          <button
            key={viewOption}
            type="button"
            role="tab"
            aria-selected={viewOption === view}
            data-active={viewOption === view || undefined}
            className="sdui-doc-collection-view-tab"
            onClick={() => onSetAttrs(collectionId, { view: viewOption })}
          >
            {VIEW_LABELS[viewOption]}
          </button>
        ))}
      </div>

      {view === 'board' && (
        <span className="sdui-doc-collection-groupby">
          <span aria-hidden>Group:</span>
          <select
            aria-label="Group by"
            value={groupBy ?? ''}
            onChange={(event) => onSetAttrs(collectionId, { groupBy: event.target.value || undefined })}
          >
            <option value="">None</option>
            {selectProps.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
        </span>
      )}

      <span className="sdui-doc-collection-sort">
        <span aria-hidden>Sort:</span>
        <select aria-label="Sort by" value={sortBy?.propertyId ?? ''} onChange={(event) => setSort(event.target.value)}>
          <option value="">None</option>
          {properties.map((property) => (
            <option key={property.id} value={property.id}>
              {property.name}
            </option>
          ))}
        </select>
        {sortBy ? (
          <button type="button" aria-label="Toggle sort direction" onClick={toggleDirection}>
            {sortBy.direction === 'asc' ? '↑' : '↓'}
          </button>
        ) : null}
      </span>

      <Popover.Root>
        <Popover.Trigger asChild>
          <button type="button" className="sdui-doc-collection-props-btn" aria-label="Manage properties">
            ⚙ Properties
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="sdui-doc-collection-props-panel" sideOffset={4} align="end">
            <div className="sdui-doc-collection-props-list">
              {properties.length === 0 && <p className="sdui-doc-collection-props-empty">No properties yet.</p>}
              {properties.map((property) => (
                <div key={property.id} className="sdui-doc-collection-props-row">
                  <span>{property.name}</span>
                  <span className="sdui-doc-collection-props-type">{property.type}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${property.name}`}
                    onClick={() => removeProperty(property.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <form
              className="sdui-doc-collection-props-add"
              onSubmit={(event) => {
                event.preventDefault()
                addProperty()
              }}
            >
              <input
                aria-label="Property name"
                placeholder="Property name"
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
              />
              <select
                aria-label="Property type"
                value={newType}
                onChange={(event) => setNewType(event.target.value as PropertyType)}
              >
                {PROPERTY_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button type="submit">Add</button>
            </form>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}
