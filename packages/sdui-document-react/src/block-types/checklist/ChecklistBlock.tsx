import React from 'react'

import type { BlockChromeProps } from '../BlockChrome'

const Checkbox = ({ checked, onToggle }: { checked: boolean; onToggle?(next: boolean): void }) => (
  <span contentEditable={false}>
    <button
      type="button"
      className="checkbox"
      role="checkbox"
      aria-checked={checked}
      disabled={!onToggle}
      onClick={() => onToggle?.(!checked)}
    >
      <svg viewBox="0 0 16 16" aria-hidden focusable="false">
        <rect className="checkbox-box" x="1" y="1" width="14" height="14" rx="3" />
        <path className="checkbox-tick" d="M4.5 8.5 7 11l4.5-5.5" />
      </svg>
    </button>
  </span>
)

export const ChecklistBlock = ({ block, onToggleChecked, children }: BlockChromeProps) => {
  const checked = block.attributes?.checked === true

  return (
    <div data-type="checkbox_item" className={checked ? 'checked' : undefined}>
      <Checkbox checked={checked} onToggle={onToggleChecked ? (next) => onToggleChecked(block.id, next) : undefined} />
      <div className="content">{children}</div>
    </div>
  )
}
