import * as Popover from '@radix-ui/react-popover'
import React, { useEffect, useRef, useState } from 'react'

import { turnIntoShortcutEntries } from '../../block-types/turnInto'
import ShortcutTooltip, { formatShortcut } from '../ShortcutTooltip'
import type { BlockMenuItem } from './blockMenuItems'
import { BLOCK_MENU_GROUP_LABELS } from './blockMenuItems'

export type BlockMenuAnchorRect = { left: number; top: number; bottom: number }

export type BlockMenuProps = {
  anchor: BlockMenuAnchorRect
  /** Already filtered by the owner (FocusedBlockEditor). */
  items: BlockMenuItem[]
  /** Keyboard highlight, owned by the parent — key events arrive via PM delegation. */
  activeIndex: number
  view: 'menu' | 'link'
  onSelect(item: BlockMenuItem): void
  onSubmitLink(url: string): void
  onClose(): void
}

/**
 * Block-type insert menu (slash command / '+' button).
 *
 * Same Radix pattern as SelectionToolbar: a fixed zero-size anchor moved to
 * the slash coordinates, Radix handles placement/collision from there.
 *
 * Policies:
 * - presentation only: filtering and keyboard state live in the owner, because
 *   the PM editor keeps focus and routes keys here via onSlashMenuKey
 * - the menu view never auto-focuses (the editor keeps typing focus); the
 *   link view DOES focus its URL input — it is an explicit text-entry step
 * - options prevent mousedown default so the PM selection survives the click
 */
const TURN_INTO_SHORTCUTS = turnIntoShortcutEntries()

const attrsMatch = (left?: Record<string, unknown>, right?: Record<string, unknown>) => {
  const leftEntries = Object.entries(left ?? {})
  const rightEntries = Object.entries(right ?? {})
  return leftEntries.length === rightEntries.length && leftEntries.every(([key, value]) => right?.[key] === value)
}

// Keyboard shortcut when one exists, otherwise the item's own markdown
// prefix hint (single source: blockMenuItems.ts).
const blockMenuShortcut = (item: BlockMenuItem) => {
  const turnInto = TURN_INTO_SHORTCUTS.find(
    (entry) => entry.type === item.type && attrsMatch(entry.attrs, item.attributes),
  )
  return turnInto ? formatShortcut(turnInto.key) : item.hint
}

export const BlockMenu = ({ anchor, items, activeIndex, view, onSelect, onSubmitLink, onClose }: BlockMenuProps) => {
  const anchorRef = useRef<HTMLSpanElement>(null)
  const [linkValue, setLinkValue] = useState('')

  useEffect(() => {
    const element = anchorRef.current
    if (!element) {
      return
    }

    element.style.left = `${anchor.left}px`
    element.style.top = `${anchor.top}px`
    element.style.height = `${Math.max(0, anchor.bottom - anchor.top)}px`
  }, [anchor])

  return (
    <Popover.Root open modal={false}>
      <Popover.Anchor asChild>
        <span ref={anchorRef} data-block-menu-anchor aria-hidden style={{ position: 'fixed', pointerEvents: 'none' }} />
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content
          className="sdui-doc-block-menu"
          side="bottom"
          align="start"
          sideOffset={4}
          onOpenAutoFocus={(event) => {
            // the editor keeps typing focus in menu view; the link input takes it
            if (view === 'menu') {
              event.preventDefault()
            }
          }}
          onCloseAutoFocus={(event) => event.preventDefault()}
          // Radix's DismissableLayer preventDefaults Escape at the document
          // capture phase, so PM never sees it — close the menu here. This
          // also keeps Escape from exiting the block while the menu is open.
          onEscapeKeyDown={() => onClose()}
        >
          {view === 'menu' ? (
            <div role="listbox" aria-label="Insert block" className="sdui-doc-block-menu-list">
              {items.length === 0 ? (
                <div className="sdui-doc-block-menu-empty">No results</div>
              ) : (
                items.map((item, index) => (
                  <React.Fragment key={item.id}>
                    {(index === 0 || items[index - 1].group !== item.group) && (
                      <div className="sdui-doc-block-menu-group-label" aria-hidden="true">
                        {BLOCK_MENU_GROUP_LABELS[item.group]}
                      </div>
                    )}
                    <ShortcutTooltip label={item.title} shortcut={blockMenuShortcut(item)}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={index === activeIndex}
                        data-active={index === activeIndex || undefined}
                        className="sdui-doc-block-menu-option"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => onSelect(item)}
                      >
                        <span className="sdui-doc-block-menu-glyph" aria-hidden>
                          {item.glyph}
                        </span>
                        {item.title}
                      </button>
                    </ShortcutTooltip>
                  </React.Fragment>
                ))
              )}
            </div>
          ) : (
            <form
              className="sdui-doc-block-menu-link"
              onSubmit={(event) => {
                event.preventDefault()
                onSubmitLink(linkValue)
              }}
            >
              <input
                // eslint-disable-next-line jsx-a11y/no-autofocus -- explicit URL-entry step, matches toolbar LinkEditor
                autoFocus
                className="sdui-doc-toolbar-link-input"
                placeholder="https://…"
                value={linkValue}
                onChange={(event) => setLinkValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    event.stopPropagation()
                    onClose()
                  }
                }}
              />
            </form>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
