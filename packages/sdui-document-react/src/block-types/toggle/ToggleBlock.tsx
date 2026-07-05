import React from 'react'

import type { BlockChromeProps } from '../BlockChrome'

/** Notion toggle: 24px triangle button, rotates 90° when open, 200ms ease. */
export const ToggleBlock = ({ block, onToggleCollapsed, children }: BlockChromeProps) => {
  const collapsed = block.attributes?.collapsed === true

  return (
    <div data-type="toggle" className="toggle-block">
      <span contentEditable={false}>
        <button
          type="button"
          className="toggle-triangle"
          aria-expanded={!collapsed}
          aria-label={`Toggle ${block.id}`}
          data-collapsed={collapsed || undefined}
          disabled={!onToggleCollapsed}
          onClick={() => onToggleCollapsed?.(block.id, !collapsed)}
        >
          <svg viewBox="0 0 16 16" aria-hidden focusable="false">
            <path d="M5 3.5 11 8l-6 4.5v-9Z" />
          </svg>
        </button>
      </span>
      <div className="content">{children}</div>
    </div>
  )
}
