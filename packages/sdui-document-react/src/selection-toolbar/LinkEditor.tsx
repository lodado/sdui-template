import React, { useState } from 'react'

export type LinkEditorProps = {
  href: string | null
  onSubmit(href: string): void
  onRemove(): void
  onCancel(): void
}

/**
 * Link edit state of the toolbar (Outline LinkEditor, reduced to href input).
 *
 * Policies:
 * - Enter applies, Escape returns to the mark menu
 * - an empty submit removes the link (matches Outline's clear behavior)
 */
export const LinkEditor = ({ href, onSubmit, onRemove, onCancel }: LinkEditorProps) => {
  const [value, setValue] = useState(href ?? '')

  return (
    <div className="sdui-doc-toolbar-link">
      <input
        className="sdui-doc-toolbar-link-input"
        type="text"
        placeholder="https://…"
        aria-label="Link URL"
        value={value}
        // eslint-disable-next-line jsx-a11y/no-autofocus -- entering link mode is an explicit user action
        autoFocus
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            if (value.trim()) {
              onSubmit(value.trim())
            } else {
              onRemove()
            }
          }
          if (event.key === 'Escape') {
            event.preventDefault()
            onCancel()
          }
        }}
      />
      {href ? (
        <button
          type="button"
          className="sdui-doc-toolbar-button"
          aria-label="Remove link"
          onMouseDown={(event) => event.preventDefault()}
          onClick={onRemove}
        >
          ✕
        </button>
      ) : null}
    </div>
  )
}
