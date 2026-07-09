import type { DateRangeValue, PropertyDef } from '@lodado/sdui-document'
import { parsePropertyValue } from '@lodado/sdui-document'
import * as Popover from '@radix-ui/react-popover'
import React, { useState } from 'react'

import { PropertyChip } from './PropertyChip'

export type PropertyValueEditorProps = {
  def: PropertyDef
  value: unknown
  onChange(value: unknown): void
}

const SelectEditor = ({ def, value, onChange }: PropertyValueEditorProps) => {
  const current = parsePropertyValue(def, value) as string | undefined
  return (
    <div className="sdui-doc-prop-editor-options">
      <button type="button" className="sdui-doc-prop-editor-clear" onClick={() => onChange(undefined)}>
        Clear
      </button>
      {(def.options ?? []).map((option) => (
        <button
          key={option.id}
          type="button"
          data-active={option.id === current || undefined}
          className="sdui-doc-chip"
          data-color={option.color ?? 'gray'}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

const MultiSelectEditor = ({ def, value, onChange }: PropertyValueEditorProps) => {
  const current = (parsePropertyValue(def, value) as string[] | undefined) ?? []
  const toggle = (optionId: string) =>
    onChange(current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId])
  return (
    <div className="sdui-doc-prop-editor-options">
      {(def.options ?? []).map((option) => (
        <button
          key={option.id}
          type="button"
          data-active={current.includes(option.id) || undefined}
          className="sdui-doc-chip"
          data-color={option.color ?? 'gray'}
          onClick={() => toggle(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

const TextEditor = ({ def, value, onChange }: PropertyValueEditorProps) => {
  const [draft, setDraft] = useState((parsePropertyValue(def, value) as string | undefined) ?? '')
  return (
    <input
      aria-label={`${def.name} value`}
      className="sdui-doc-prop-editor-input"
      type={def.type === 'url' ? 'url' : 'text'}
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => onChange(draft || undefined)}
    />
  )
}

const DateEditor = ({ def, value, onChange }: PropertyValueEditorProps) => {
  const current = parsePropertyValue(def, value) as string | undefined
  return (
    <input
      aria-label={`${def.name} date`}
      className="sdui-doc-prop-editor-input"
      type="date"
      value={current ?? ''}
      onChange={(event) => onChange(event.target.value || undefined)}
    />
  )
}

const DateRangeEditor = ({ def, value, onChange }: PropertyValueEditorProps) => {
  const range = (parsePropertyValue(def, value) as DateRangeValue | undefined) ?? { start: '' }
  return (
    <div className="sdui-doc-prop-editor-range">
      <input
        aria-label={`${def.name} start`}
        type="date"
        value={range.start}
        onChange={(event) => onChange(event.target.value ? { ...range, start: event.target.value } : undefined)}
      />
      <span aria-hidden>→</span>
      <input
        aria-label={`${def.name} end`}
        type="date"
        value={range.end ?? ''}
        onChange={(event) => onChange({ ...range, end: event.target.value || undefined })}
      />
    </div>
  )
}

const EDITORS: Record<PropertyDef['type'], React.ComponentType<PropertyValueEditorProps>> = {
  select: SelectEditor,
  multiSelect: MultiSelectEditor,
  text: TextEditor,
  url: TextEditor,
  date: DateEditor,
  dateRange: DateRangeEditor,
}

/** Chip trigger that opens a type-specific value editor popover. */
export const EditablePropertyCell = ({ def, value, onChange }: PropertyValueEditorProps) => {
  const Editor = EDITORS[def.type]
  const hasValue = parsePropertyValue(def, value) !== undefined

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button type="button" className="sdui-doc-prop-cell" aria-label={`Edit ${def.name}`}>
          {hasValue ? <PropertyChip def={def} value={value} /> : <span className="sdui-doc-prop-empty">Empty</span>}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="sdui-doc-prop-editor" sideOffset={4} align="start">
          <div className="sdui-doc-prop-editor-name">{def.name}</div>
          <Editor def={def} value={value} onChange={onChange} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
