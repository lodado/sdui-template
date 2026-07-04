import React from 'react'

export type ToolbarButtonProps = {
  label: string
  active?: boolean
  onClick(): void
  children: React.ReactNode
}

/**
 * 24x24 toolbar button — Outline ToolbarButton.tsx values via editor.css.
 *
 * mousedown is prevented so clicking never steals focus/selection from the
 * ProseMirror view (the toolbar operates ON the selection).
 */
export const ToolbarButton = ({ label, active, onClick, children }: ToolbarButtonProps) => {
  return (
    <button
      type="button"
      className="sdui-doc-toolbar-button"
      aria-label={label}
      aria-pressed={active ?? false}
      data-active={active || undefined}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
