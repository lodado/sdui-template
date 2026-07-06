import React from 'react'

import ShortcutTooltip from '../editor/ShortcutTooltip'

export type ToolbarButtonProps = {
  label: string
  shortcut?: string
  active?: boolean
  onClick(): void
  children: React.ReactNode
}

/**
 * 24x24 toolbar button — Outline ToolbarButton.tsx values via editor.css.
 *
 * mousedown is prevented so clicking never steals focus/selection from the
 * ProseMirror view.
 */
export const ToolbarButton = ({ label, shortcut, active, onClick, children }: ToolbarButtonProps) => {
  return (
    <ShortcutTooltip label={label} shortcut={shortcut}>
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
    </ShortcutTooltip>
  )
}
