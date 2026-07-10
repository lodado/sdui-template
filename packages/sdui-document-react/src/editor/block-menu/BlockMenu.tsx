import * as Popover from '@radix-ui/react-popover'
import React, { useEffect, useRef, useState } from 'react'

import { turnIntoShortcutEntries } from '../../block-types/turnInto'
import ShortcutTooltip, { formatShortcut } from '../ShortcutTooltip'
import type { BlockMenuItem } from './blockMenuItems'
import { BLOCK_MENU_GROUP_LABELS, blockMenuDescription } from './blockMenuItems'

export type BlockMenuAnchorRect = { left: number; top: number; bottom: number }

export type BlockMenuProps = {
  anchor: BlockMenuAnchorRect
  /** Already filtered/ordered by the owner (FocusedBlockEditor). */
  items: BlockMenuItem[]
  /** Keyboard highlight, owned by the parent — key events arrive via PM delegation. */
  activeIndex: number
  view: 'menu' | 'link'
  /** Active query — when non-empty, section labels are hidden (flat result list). */
  query?: string
  /** Leading item count belonging to the "Recent" section (0 when searching). */
  recentCount?: number
  onSelect(item: BlockMenuItem): void
  onSubmitLink(url: string): void
  onClose(): void
}

/**
 * Section label shown above `items[index]`, or null when none belongs there.
 * While searching (query set) the list is flat — no labels. Otherwise the first
 * `recentCount` items sit under a "Recent" label and the rest under group labels
 * that appear whenever the group changes.
 */
function sectionLabelAt(items: BlockMenuItem[], index: number, query: string, recentCount: number): string | null {
  if (query.trim() !== '') {
    return null
  }
  if (index < recentCount) {
    return index === 0 ? 'Recent' : null
  }
  if (index === recentCount) {
    return BLOCK_MENU_GROUP_LABELS[items[index].group]
  }
  return items[index - 1].group !== items[index].group ? BLOCK_MENU_GROUP_LABELS[items[index].group] : null
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

export const BlockMenu = ({
  anchor,
  items,
  activeIndex,
  view,
  query = '',
  recentCount = 0,
  onSelect,
  onSubmitLink,
  onClose,
}: BlockMenuProps) => {
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
                items.map((item, index) => {
                  const label = sectionLabelAt(items, index, query, recentCount)
                  const description = blockMenuDescription(item.id)
                  // Recent items duplicate their main-list entry, so the id alone
                  // isn't unique — prefix by section (not by array index).
                  const rowKey = index < recentCount ? `recent-${item.id}` : `block-${item.id}`
                  return (
                    <React.Fragment key={rowKey}>
                      {label !== null && (
                        <div className="sdui-doc-block-menu-group-label" aria-hidden="true">
                          {label}
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
                          <span className="sdui-doc-block-menu-body">
                            <span className="sdui-doc-block-menu-title">{item.title}</span>
                            {description && <span className="sdui-doc-block-menu-desc">{description}</span>}
                          </span>
                        </button>
                      </ShortcutTooltip>
                    </React.Fragment>
                  )
                })
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
