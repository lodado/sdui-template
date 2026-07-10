import React, { useEffect, useRef, useState } from 'react'

import { turnIntoShortcutEntries } from '../../block-types/turnInto'
import ShortcutTooltip, { formatShortcut } from '../ShortcutTooltip'
import { BLOCK_COLOR_LABELS, BLOCK_COLOR_NAMES, type BlockColorName } from './blockColors'
import { TURN_INTO_ITEMS } from './blockMenuItems'

export type BlockColorChange = { textColor?: BlockColorName } | { backgroundColor?: BlockColorName }

export type BlockActionsMenuProps = {
  /** Handle rect the menu positions against (viewport coords). */
  rect: DOMRect
  onTurnInto(type: string, attrs?: Record<string, unknown>): void
  onDuplicate(): void
  onMoveUp(): void
  onMoveDown(): void
  onDelete(): void
  /** Copy a deep link to this block. Row is hidden when not provided. */
  onCopyLink?(): void
  /** Set block text/background color. Color row is hidden when not provided. */
  onSetColor?(change: BlockColorChange): void
  /** Current colors, for the check mark in the color submenu. */
  currentTextColor?: string
  currentBackgroundColor?: string
  onClose(): void
  onCancel(): void
}

const TURN_INTO_SHORTCUTS = turnIntoShortcutEntries()

const attrsMatch = (left?: Record<string, unknown>, right?: Record<string, unknown>) => {
  const leftEntries = Object.entries(left ?? {})
  const rightEntries = Object.entries(right ?? {})
  return leftEntries.length === rightEntries.length && leftEntries.every(([key, value]) => right?.[key] === value)
}

const turnIntoShortcut = (item: (typeof TURN_INTO_ITEMS)[number]) => {
  const shortcut = TURN_INTO_SHORTCUTS.find(
    (entry) => entry.type === item.type && attrsMatch(entry.attrs, item.attributes),
  )
  return shortcut ? formatShortcut(shortcut.key) : undefined
}

type ActionRow = {
  key: string
  label: string
  glyph: string
  shortcut?: string
  danger?: boolean
  run(): void
}

/**
 * Block-actions menu opened by clicking the ⠿ drag handle (Notion parity).
 * Fixed-positioned surface anchored to the handle; reuses the slash-menu tokens
 * (`.sdui-doc-block-menu-*`). Closes on outside pointer-down, Escape, or after
 * any leaf action. "Turn into" swaps to a submenu instead of closing.
 */
export const BlockActionsMenu = ({
  rect,
  onTurnInto,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onDelete,
  onCopyLink,
  onSetColor,
  currentTextColor,
  currentBackgroundColor,
  onClose,
  onCancel,
}: BlockActionsMenuProps) => {
  const [view, setView] = useState<'root' | 'turn-into' | 'color'>('root')
  const firstItemRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // Focus the first item so keyboard users land inside the menu (Enter/Space work).
    firstItemRef.current?.focus()
  }, [view])

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!(event.target as Element).closest('[data-block-actions]')) {
        onClose()
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onCancel()
      }
    }
    document.addEventListener('mousedown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown, true)

    return () => {
      document.removeEventListener('mousedown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [onClose])

  const rootRows: ActionRow[] = [
    { key: 'turn-into', label: 'Turn into', glyph: '⇄', run: () => setView('turn-into') },
    { key: 'duplicate', label: 'Duplicate', glyph: '⧉', shortcut: 'Ctrl/Cmd+D', run: onDuplicate },
    ...(onCopyLink ? [{ key: 'copy-link', label: 'Copy link to block', glyph: '🔗', run: onCopyLink }] : []),
    ...(onSetColor ? [{ key: 'color', label: 'Color', glyph: '🎨', run: () => setView('color') }] : []),
    { key: 'move-up', label: 'Move up', glyph: '↑', shortcut: 'Ctrl/Cmd+Alt+↑', run: onMoveUp },
    { key: 'move-down', label: 'Move down', glyph: '↓', shortcut: 'Ctrl/Cmd+Alt+↓', run: onMoveDown },
    { key: 'delete', label: 'Delete', glyph: '✕', shortcut: 'Backspace', danger: true, run: onDelete },
  ]

  return (
    <div
      data-block-actions
      className="sdui-doc-block-actions"
      role="menu"
      aria-label="Block actions"
      style={{ position: 'fixed', top: rect.bottom + 6, left: rect.left, zIndex: 40 }}
    >
      {view === 'root' &&
        rootRows.map((row, index) => (
          <ShortcutTooltip key={row.key} label={row.label} shortcut={row.shortcut}>
            <button
              ref={index === 0 ? firstItemRef : undefined}
              type="button"
              role="menuitem"
              className="sdui-doc-block-menu-option"
              data-danger={row.danger ? '' : undefined}
              aria-haspopup={row.key === 'turn-into' ? 'menu' : undefined}
              onClick={() => {
                row.run()
                // Submenu rows navigate; every other row is terminal and closes.
                if (row.key !== 'turn-into' && row.key !== 'color') onClose()
              }}
            >
              <span className="sdui-doc-block-menu-glyph" aria-hidden="true">
                {row.glyph}
              </span>
              <span>{row.label}</span>
              {row.key === 'turn-into' ? (
                <span className="sdui-doc-block-actions-chevron" aria-hidden="true">
                  ›
                </span>
              ) : null}
            </button>
          </ShortcutTooltip>
        ))}
      {view === 'turn-into' && (
        <>
          <button
            ref={firstItemRef}
            type="button"
            className="sdui-doc-block-menu-option sdui-doc-block-actions-back"
            onClick={() => setView('root')}
          >
            <span className="sdui-doc-block-menu-glyph" aria-hidden="true">
              ‹
            </span>
            <span>Turn into</span>
          </button>
          <div className="sdui-doc-block-actions-separator" role="separator" />
          {TURN_INTO_ITEMS.map((item) => (
            <ShortcutTooltip key={item.id} label={item.title} shortcut={turnIntoShortcut(item)}>
              <button
                type="button"
                role="menuitem"
                className="sdui-doc-block-menu-option"
                onClick={() => {
                  onTurnInto(item.type, item.attributes)
                  onClose()
                }}
              >
                <span className="sdui-doc-block-menu-glyph" aria-hidden="true">
                  {item.glyph}
                </span>
                <span>{item.title}</span>
              </button>
            </ShortcutTooltip>
          ))}
        </>
      )}
      {view === 'color' && (
        <>
          <button
            ref={firstItemRef}
            type="button"
            className="sdui-doc-block-menu-option sdui-doc-block-actions-back"
            onClick={() => setView('root')}
          >
            <span className="sdui-doc-block-menu-glyph" aria-hidden="true">
              ‹
            </span>
            <span>Color</span>
          </button>
          <div className="sdui-doc-block-actions-separator" role="separator" />
          <div className="sdui-doc-block-actions-section-label" aria-hidden="true">
            Text
          </div>
          {BLOCK_COLOR_NAMES.map((name) => (
            <button
              key={`text-${name}`}
              type="button"
              role="menuitemradio"
              aria-checked={(currentTextColor ?? 'default') === name}
              className="sdui-doc-block-menu-option"
              onClick={() => {
                onSetColor?.({ textColor: name })
                onClose()
              }}
            >
              <span
                className={`sdui-doc-block-color-swatch sdui-doc-block-color-swatch--text-${name}`}
                aria-hidden="true"
              >
                A
              </span>
              <span>{BLOCK_COLOR_LABELS[name]}</span>
              {(currentTextColor ?? 'default') === name ? (
                <span className="sdui-doc-block-actions-chevron" aria-hidden="true">
                  ✓
                </span>
              ) : null}
            </button>
          ))}
          <div className="sdui-doc-block-actions-separator" role="separator" />
          <div className="sdui-doc-block-actions-section-label" aria-hidden="true">
            Background
          </div>
          {BLOCK_COLOR_NAMES.map((name) => (
            <button
              key={`bg-${name}`}
              type="button"
              role="menuitemradio"
              aria-checked={(currentBackgroundColor ?? 'default') === name}
              className="sdui-doc-block-menu-option"
              onClick={() => {
                onSetColor?.({ backgroundColor: name })
                onClose()
              }}
            >
              <span
                className={`sdui-doc-block-color-swatch sdui-doc-block-color-swatch--bg-${name}`}
                aria-hidden="true"
              />
              <span>{BLOCK_COLOR_LABELS[name]} background</span>
              {(currentBackgroundColor ?? 'default') === name ? (
                <span className="sdui-doc-block-actions-chevron" aria-hidden="true">
                  ✓
                </span>
              ) : null}
            </button>
          ))}
        </>
      )}
    </div>
  )
}

export default BlockActionsMenu
