import type { BlockAlign } from '@lodado/sdui-document'
import * as Popover from '@radix-ui/react-popover'
import React, { useEffect, useRef, useState } from 'react'

import { TURN_INTO_ITEMS } from '../editor/block-menu/blockMenuItems'
import { highlightBackground } from '../marks'
import { ColorMenu } from './ColorMenu'
import { LinkEditor } from './LinkEditor'
import type { SelectionSnapshot } from './selectionSnapshot'
import { ToolbarButton } from './ToolbarButton'

export type SelectionToolbarProps = {
  snapshot: SelectionSnapshot
  onToggleMark(name: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code'): void
  onSetHighlight(color: string | null): void
  onSetColor(color: string | null): void
  onSetLink(href: string | null): void
  /** Current block alignment (for active state); omitted when align is unsupported here. */
  blockAlign?: BlockAlign | null
  /** Set/clear the focused block's alignment; toggling the active one clears it. */
  onSetAlign?(align: BlockAlign | null): void
  /**
   * Turn-into dropdown (Notion's leading "Text ▾" toolbar control). Only
   * provided for single-block selections — block type is ambiguous across a
   * cross-block range.
   */
  turnInto?: {
    /** BlockMenuItem id matching the current block, for the active check + label. */
    activeId: string | null
    onSelect(type: string, attrs?: Record<string, unknown>): void
  }
}

const ALIGN_OPTIONS: ReadonlyArray<{ value: BlockAlign; label: string; glyph: string }> = [
  { value: 'left', label: 'Align left', glyph: '⇤' },
  { value: 'center', label: 'Align center', glyph: '↔' },
  { value: 'right', label: 'Align right', glyph: '⇥' },
]

type ToolbarView = 'menu' | 'color' | 'link' | 'turn-into'

/**
 * Floating formatting toolbar over the current text selection.
 *
 * Behavior + design ported from Outline (SelectionToolbar.tsx /
 * FloatingToolbar.tsx / menus/formatting.tsx); positioning is delegated to
 * Radix Popover instead of Outline's hand-rolled coordinate math.
 *
 * Policies:
 * - the anchor is a fixed-position zero-size element moved to the selection
 *   rect (view.coordsAtPos) — Radix handles collision/flip from there
 * - every control prevents mousedown default so the PM selection survives
 * - opening never auto-focuses the popover (the editor keeps focus), except
 *   the explicit link-edit state
 * - button order is Outline formatting.tsx: bold, italic, strikethrough,
 *   code | highlight | link
 */
export const SelectionToolbar = ({
  snapshot,
  onToggleMark,
  onSetHighlight,
  onSetColor,
  onSetLink,
  blockAlign = null,
  onSetAlign,
  turnInto,
}: SelectionToolbarProps) => {
  const [view, setView] = useState<ToolbarView>('menu')
  const anchorRef = useRef<HTMLSpanElement>(null)
  const open = !snapshot.empty && snapshot.anchorRect !== null

  // reset submenu whenever the selection collapses/changes identity
  useEffect(() => {
    setView('menu')
  }, [snapshot.empty, snapshot.from, snapshot.to])

  useEffect(() => {
    const anchor = anchorRef.current
    if (!anchor || !snapshot.anchorRect) {
      return
    }

    anchor.style.left = `${snapshot.anchorRect.left}px`
    anchor.style.top = `${snapshot.anchorRect.top}px`
    anchor.style.width = `${snapshot.anchorRect.width}px`
    anchor.style.height = `${snapshot.anchorRect.height}px`
  }, [snapshot.anchorRect])

  return (
    <Popover.Root open={open} modal={false}>
      <Popover.Anchor asChild>
        <span ref={anchorRef} data-selection-anchor aria-hidden style={{ position: 'fixed', pointerEvents: 'none' }} />
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content
          className="sdui-doc-toolbar"
          side="top"
          sideOffset={8}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
        >
          {view === 'menu' && (
            <div className="sdui-doc-toolbar-menu" role="toolbar" aria-label="Text formatting">
              {turnInto && (
                <>
                  <button
                    type="button"
                    className="sdui-doc-toolbar-turninto-trigger"
                    aria-label="Turn into"
                    aria-haspopup="menu"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => setView('turn-into')}
                  >
                    {TURN_INTO_ITEMS.find((item) => item.id === turnInto.activeId)?.title ?? 'Turn into'}
                    <span aria-hidden="true">▾</span>
                  </button>
                  <span className="sdui-doc-toolbar-separator" />
                </>
              )}
              <ToolbarButton
                label="Bold"
                shortcut="Ctrl/Cmd+B"
                active={snapshot.activeMarks.bold}
                onClick={() => onToggleMark('bold')}
              >
                <strong>B</strong>
              </ToolbarButton>
              <ToolbarButton
                label="Italic"
                shortcut="Ctrl/Cmd+I"
                active={snapshot.activeMarks.italic}
                onClick={() => onToggleMark('italic')}
              >
                <em>I</em>
              </ToolbarButton>
              <ToolbarButton
                label="Underline"
                shortcut="Ctrl/Cmd+U"
                active={snapshot.activeMarks.underline}
                onClick={() => onToggleMark('underline')}
              >
                <u>U</u>
              </ToolbarButton>
              <ToolbarButton
                label="Strikethrough"
                shortcut="Ctrl/Cmd+D"
                active={snapshot.activeMarks.strikethrough}
                onClick={() => onToggleMark('strikethrough')}
              >
                <del>S</del>
              </ToolbarButton>
              <ToolbarButton
                label="Code"
                shortcut="Ctrl/Cmd+E"
                active={snapshot.activeMarks.code}
                onClick={() => onToggleMark('code')}
              >
                {'</>'}
              </ToolbarButton>
              <span className="sdui-doc-toolbar-separator" />
              <ToolbarButton
                label="Color"
                shortcut="Ctrl/Cmd+Shift+H"
                active={snapshot.activeMarks.color || snapshot.activeMarks.highlight}
                onClick={() => setView('color')}
              >
                <span
                  className="sdui-doc-toolbar-color-dot"
                  style={{
                    color: snapshot.textColor ?? undefined,
                    backgroundColor: snapshot.highlightColor ? highlightBackground(snapshot.highlightColor) : undefined,
                  }}
                >
                  A
                </span>
              </ToolbarButton>
              <ToolbarButton label="Link" active={snapshot.activeMarks.link} onClick={() => setView('link')}>
                ⌁
              </ToolbarButton>
              {onSetAlign && (
                <>
                  <span className="sdui-doc-toolbar-separator" />
                  {ALIGN_OPTIONS.map((option) => (
                    <ToolbarButton
                      key={option.value}
                      label={option.label}
                      active={blockAlign === option.value}
                      onClick={() => onSetAlign(blockAlign === option.value ? null : option.value)}
                    >
                      {option.glyph}
                    </ToolbarButton>
                  ))}
                </>
              )}
            </div>
          )}
          {view === 'turn-into' && turnInto && (
            <div className="sdui-doc-block-menu-list" role="menu" aria-label="Turn into">
              {TURN_INTO_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  className="sdui-doc-block-menu-option"
                  data-active={item.id === turnInto.activeId || undefined}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    turnInto.onSelect(item.type, item.attributes)
                    setView('menu')
                  }}
                >
                  <span className="sdui-doc-block-menu-glyph" aria-hidden="true">
                    {item.glyph}
                  </span>
                  {item.title}
                </button>
              ))}
            </div>
          )}
          {view === 'color' && (
            <ColorMenu
              activeTextColor={snapshot.textColor}
              activeHighlight={snapshot.highlightColor}
              onSetColor={(color) => onSetColor(color)}
              onSetHighlight={(color) => onSetHighlight(color)}
            />
          )}
          {view === 'link' && (
            <LinkEditor
              href={snapshot.linkHref}
              onSubmit={(href) => {
                onSetLink(href)
                setView('menu')
              }}
              onRemove={() => {
                onSetLink(null)
                setView('menu')
              }}
              onCancel={() => setView('menu')}
            />
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
