import * as Popover from '@radix-ui/react-popover'
import React, { useEffect, useRef, useState } from 'react'

import { HighlightPalette } from './HighlightPalette'
import { LinkEditor } from './LinkEditor'
import type { SelectionSnapshot } from './selectionSnapshot'
import { ToolbarButton } from './ToolbarButton'

export type SelectionToolbarProps = {
  snapshot: SelectionSnapshot
  onToggleMark(name: 'bold' | 'italic' | 'strikethrough' | 'code'): void
  onSetHighlight(color: string | null): void
  onSetLink(href: string | null): void
}

type ToolbarView = 'menu' | 'highlight' | 'link'

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
export const SelectionToolbar = ({ snapshot, onToggleMark, onSetHighlight, onSetLink }: SelectionToolbarProps) => {
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
              <ToolbarButton label="Bold" active={snapshot.activeMarks.bold} onClick={() => onToggleMark('bold')}>
                <strong>B</strong>
              </ToolbarButton>
              <ToolbarButton label="Italic" active={snapshot.activeMarks.italic} onClick={() => onToggleMark('italic')}>
                <em>I</em>
              </ToolbarButton>
              <ToolbarButton
                label="Strikethrough"
                active={snapshot.activeMarks.strikethrough}
                onClick={() => onToggleMark('strikethrough')}
              >
                <del>S</del>
              </ToolbarButton>
              <ToolbarButton label="Code" active={snapshot.activeMarks.code} onClick={() => onToggleMark('code')}>
                {'</>'}
              </ToolbarButton>
              <span className="sdui-doc-toolbar-separator" />
              <ToolbarButton
                label="Highlight"
                active={snapshot.activeMarks.highlight}
                onClick={() => setView('highlight')}
              >
                <span
                  className="sdui-doc-toolbar-highlight-dot"
                  style={snapshot.highlightColor ? { backgroundColor: snapshot.highlightColor } : undefined}
                />
              </ToolbarButton>
              <ToolbarButton label="Link" active={snapshot.activeMarks.link} onClick={() => setView('link')}>
                ⌁
              </ToolbarButton>
            </div>
          )}
          {view === 'highlight' && (
            <HighlightPalette
              activeColor={snapshot.highlightColor}
              onSelect={(color) => {
                onSetHighlight(color)
                setView('menu')
              }}
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
