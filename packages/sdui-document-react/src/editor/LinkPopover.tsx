import React, { useEffect, useState } from 'react'

import { safeHref } from '../inline/safeHref'
import { LinkEditor } from '../selection-toolbar'

export type LinkPopoverTarget = {
  /** Anchor rect the popover positions against (viewport coords). */
  rect: DOMRect
  href: string
  blockId: string
}

type LinkPopoverProps = {
  target: LinkPopoverTarget
  onEdit(nextHref: string): void
  onRemove(): void
  onClose(): void
}

/**
 * Editable-mode link actions, Notion-style: clicking a link opens this instead
 * of navigating. Open/Copy/Edit/Remove; Edit reuses the toolbar's LinkEditor.
 * Closes on outside click or Escape. Cmd/Ctrl+click bypasses it (handled by the
 * editor's click-capture) and navigates directly.
 */
export const LinkPopover = ({ target, onEdit, onRemove, onClose }: LinkPopoverProps) => {
  const [view, setView] = useState<'menu' | 'edit'>('menu')
  const safe = safeHref(target.href)

  useEffect(() => {
    const onPointerDown = (event: Event) => {
      if (!(event.target as Element).closest('[data-link-popover]')) {
        onClose()
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    // pointerdown, not mousedown: on touch the compat mousedown only fires after
    // touchend, so an outside tap wouldn't dismiss the popover until too late.
    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [onClose])

  return (
    <div
      data-link-popover
      className="sdui-doc-link-popover"
      style={{ position: 'fixed', top: target.rect.bottom + 6, left: target.rect.left, zIndex: 40 }}
    >
      {view === 'menu' ? (
        <div className="sdui-doc-link-popover-menu" role="group" aria-label="Link actions">
          <span className="sdui-doc-link-popover-href" title={target.href}>
            {target.href}
          </span>
          <button
            type="button"
            className="sdui-doc-toolbar-button"
            disabled={!safe}
            onClick={() => {
              if (safe) {
                window.open(safe, '_blank', 'noopener,noreferrer')
              }
              onClose()
            }}
          >
            Open
          </button>
          <button
            type="button"
            className="sdui-doc-toolbar-button"
            onClick={() => {
              navigator.clipboard?.writeText(target.href)?.catch(() => {})
              onClose()
            }}
          >
            Copy
          </button>
          <button type="button" className="sdui-doc-toolbar-button" onClick={() => setView('edit')}>
            Edit
          </button>
          <button type="button" className="sdui-doc-toolbar-button" onClick={onRemove}>
            Remove
          </button>
        </div>
      ) : (
        <LinkEditor href={target.href} onSubmit={onEdit} onRemove={onRemove} onCancel={() => setView('menu')} />
      )}
    </div>
  )
}
