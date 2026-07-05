import type { BlockAlign, SduiInlineContent } from '@lodado/sdui-document'
import { toggleMark } from 'prosemirror-commands'
import { TextSelection } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'

import { BlockMenu } from '../editor/block-menu/BlockMenu'
import type { BlockMenuItem } from '../editor/block-menu/blockMenuItems'
import { filterBlockMenuItems } from '../editor/block-menu/blockMenuItems'
import type { SelectionSnapshot } from '../selection-toolbar/selectionSnapshot'
import { buildSelectionSnapshot, selectionSnapshotsEqual } from '../selection-toolbar/selectionSnapshot'
import { SelectionToolbar } from '../selection-toolbar/SelectionToolbar'
import { resolveCaretOffset } from './caret'
import { normalizeLinkHref } from './linkHref'
import { handleMultilinePaste, insertLineBreaksBetweenBlocks } from './pm/clipboard'
import { createFocusedBlockEditorState, editorStateToInline } from './pm/editorState'
import type { FocusedBlockCallbacks } from './pm/keymapDelegation'
import { focusedBlockSchema } from './pm/schema'
import { getSlashRange } from './pm/slashMenuPlugin'
import { useBlockMenuState } from './useBlockMenuState'

export type FocusedBlockCommit = {
  content: SduiInlineContent
  text: string
}

export type FocusedBlockEditorProps = Omit<
  FocusedBlockCallbacks,
  'onSlashMenuOpen' | 'onSlashMenuQueryChange' | 'onSlashMenuClose' | 'isSlashMenuOpen' | 'onSlashMenuKey'
> & {
  /** Inline JSON injected once on mount (channel 1 of 3). */
  content: SduiInlineContent
  /** Caret placement on mount: start / end / explicit offset. */
  autoFocus?: 'start' | 'end' | number
  /** Called on blur, unmount, and before boundary delegation (channel 2 of 3). */
  // eslint-disable-next-line react/no-unused-prop-types -- consumed via latestProps ref
  onCommit(result: FocusedBlockCommit): void
  /** Block-menu item chosen. `extraAttributes` carries e.g. `{ url }` from the link view. */
  // eslint-disable-next-line react/no-unused-prop-types -- consumed via latestProps ref
  onBlockMenuSelect(item: BlockMenuItem, extraAttributes?: Record<string, unknown>): void
  /** '+' button flow: insert '/' on mount so the slash plugin opens the menu. */
  // eslint-disable-next-line react/no-unused-prop-types -- consumed via latestProps ref
  autoOpenBlockMenu?: boolean
  /** Code blocks: Enter inserts a newline, Tab inserts two spaces (no split/indent). */
  // eslint-disable-next-line react/no-unused-prop-types -- consumed via latestProps ref
  rawTextMode?: boolean
  /** Current horizontal alignment of the block, shown as active state in the toolbar. */
  blockAlign?: BlockAlign | null
  /** Set/clear the block's horizontal alignment from the selection toolbar. */
  onSetAlign?(align: BlockAlign | null): void
  className?: string
}

/**
 * The single ProseMirror instance of the document, mounted only on the
 * focused text block. Unfocused blocks render via InlineContentView.
 *
 * Policies:
 * - mounts once per focus session; `content` changes after mount are ignored
 *   (the editor is the source of truth until commit)
 * - commit fires on blur and unmount, but never mid-composition (IME safety)
 * - structural delegations (split/merge/navigate) commit FIRST so typed text
 *   is never lost, then RETIRE this editor — its content authority is gone,
 *   so later blur/unmount commits are suppressed (they would be stale)
 * - indent/outdent commit first but do not retire (content is unaffected)
 * - block-boundary keys are delegated via FocusedBlockCallbacks (channel 3)
 * - a ranged selection raises the SelectionToolbar (hidden while the mouse
 *   drag is still in progress — Outline's isSelectingText rule); mark edits
 *   are plain PM transactions, persisted through the normal commit channel
 */
export const FocusedBlockEditor = (props: FocusedBlockEditorProps) => {
  // onCommit is intentionally not destructured: it is only reached through
  // latestProps so late prop swaps still land (react/no-unused-prop-types).
  const { content, autoFocus, className, blockAlign, onSetAlign } = props
  const containerRef = useRef<HTMLSpanElement>(null)
  const viewRef = useRef<EditorView>()
  const latestProps = useRef(props)
  latestProps.current = props

  const [snapshot, setSnapshot] = useState<SelectionSnapshot | null>(null)
  const [isSelectingText, setIsSelectingText] = useState(false)

  const { menu, menuRef, updateMenu } = useBlockMenuState()
  // Select/submit need commitNow/retired from the mount effect — bridged via refs.
  const selectItemRef = useRef<(item: BlockMenuItem) => void>()
  const submitLinkRef = useRef<(url: string) => void>()

  const refreshSnapshot = useCallback(() => {
    const view = viewRef.current
    if (!view) {
      return
    }

    const next = buildSelectionSnapshot(view)
    setSnapshot((previous) => {
      // collapsed -> collapsed changes (typing) never affect a hidden toolbar
      if (next.empty && (previous === null || previous.empty)) {
        return previous
      }

      return previous && selectionSnapshotsEqual(previous, next) ? previous : next
    })
  }, [])

  const toggleNamedMark = useCallback((name: 'bold' | 'italic' | 'strikethrough' | 'code') => {
    const view = viewRef.current
    if (!view) {
      return
    }

    toggleMark(focusedBlockSchema.marks[name])(view.state, view.dispatch)
    view.focus()
  }, [])

  const setHighlight = useCallback((color: string | null) => {
    const view = viewRef.current
    if (!view) {
      return
    }

    const { from, to } = view.state.selection
    const markType = focusedBlockSchema.marks.highlight
    const transaction = view.state.tr.removeMark(from, to, markType)
    view.dispatch(color ? transaction.addMark(from, to, markType.create({ color })) : transaction)
    view.focus()
  }, [])

  const setColor = useCallback((color: string | null) => {
    const view = viewRef.current
    if (!view) {
      return
    }

    const { from, to } = view.state.selection
    const markType = focusedBlockSchema.marks.color
    const transaction = view.state.tr.removeMark(from, to, markType)
    view.dispatch(color ? transaction.addMark(from, to, markType.create({ color })) : transaction)
    view.focus()
  }, [])

  const setLink = useCallback((href: string | null) => {
    const view = viewRef.current
    if (!view) {
      return
    }

    const { from, to } = view.state.selection
    const markType = focusedBlockSchema.marks.link
    const normalized = href === null ? null : normalizeLinkHref(href)
    const transaction = view.state.tr.removeMark(from, to, markType)
    view.dispatch(normalized ? transaction.addMark(from, to, markType.create({ href: normalized })) : transaction)
    view.focus()
  }, [])

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) {
      return undefined
    }

    const retired = { current: false }

    const commitNow = () => {
      if (retired.current || !viewRef.current || viewRef.current.composing) {
        return
      }

      latestProps.current.onCommit(editorStateToInline(viewRef.current.state))
    }

    const callbacks: FocusedBlockCallbacks = {
      onSplit: (offset) => {
        commitNow()
        retired.current = true
        latestProps.current.onSplit(offset)
      },
      onMergeBackward: () => {
        commitNow()
        retired.current = true
        latestProps.current.onMergeBackward()
      },
      onIndent: () => {
        commitNow()
        latestProps.current.onIndent()
      },
      onOutdent: () => {
        commitNow()
        latestProps.current.onOutdent()
      },
      onNavigate: (direction, offset) => {
        commitNow()
        retired.current = true
        latestProps.current.onNavigate(direction, offset)
      },
      // No commit here: the input-rule transaction (prefix deletion) has not
      // been dispatched yet, so committing now would persist the raw "# ".
      onTurnInto: (type, attrs) => latestProps.current.onTurnInto(type, attrs),
      onMoveBlock: (direction) => {
        commitNow()
        latestProps.current.onMoveBlock(direction)
      },
      onHistory: (direction) => {
        // PM inline history is empty (chain fell through). Commit any pending
        // text, retire this editor — the block-level step re-focuses the block
        // it lands on — then delegate to the document undo/redo stack.
        commitNow()
        retired.current = true
        latestProps.current.onHistory(direction)
      },
      onBlockAction: () => {
        commitNow()
        latestProps.current.onBlockAction()
      },
      onEscape: () => {
        commitNow()
        retired.current = true
        latestProps.current.onEscape()
      },
      onSlashMenuOpen: (anchor) => {
        updateMenu({ anchor, query: '', activeIndex: 0, view: 'menu' })
      },
      onSlashMenuQueryChange: (query) => {
        const { current } = menuRef
        if (current) {
          updateMenu({ ...current, query, activeIndex: 0 })
        }
      },
      onSlashMenuClose: () => {
        // selecting a link item deletes the slash range (plugin fires close),
        // but the URL input must stay open until submit/escape
        const { current } = menuRef
        if (current && current.view !== 'link') {
          updateMenu(null)
        }
      },
      isSlashMenuOpen: () => menuRef.current !== null && menuRef.current.view === 'menu',
      onSlashMenuKey: (key) => {
        const { current } = menuRef
        if (!current) {
          return false
        }

        const items = filterBlockMenuItems(current.query)
        if (key === 'escape') {
          // close the menu only — the typed /query text stays (Notion behavior)
          updateMenu(null)

          return true
        }

        if (key === 'up' || key === 'down') {
          if (items.length === 0) {
            return true
          }

          const delta = key === 'up' ? -1 : 1
          const activeIndex = Math.min(Math.max(current.activeIndex + delta, 0), items.length - 1)
          updateMenu({ ...current, activeIndex })

          return true
        }

        // enter: no matches → let the keymap handle Enter (split)
        const item = items[current.activeIndex]
        if (!item) {
          return false
        }

        selectItemRef.current?.(item)

        return true
      },
    }

    selectItemRef.current = (item: BlockMenuItem) => {
      const view = viewRef.current
      if (!view) {
        return
      }

      // Switch to the link view BEFORE deleting the slash range: the deletion
      // fires the plugin's close event synchronously, and only view==='link'
      // survives onSlashMenuClose.
      if (item.action === 'link') {
        const { current } = menuRef
        if (current) {
          updateMenu({ ...current, view: 'link', pendingLinkItem: item })
        }
      }

      // remove the "/query" trigger text before anything is committed
      const range = getSlashRange(view.state)
      if (range) {
        view.dispatch(view.state.tr.delete(range.from, range.to))
      }

      if (item.action === 'link') {
        return
      }

      updateMenu(null)
      commitNow()
      retired.current = true
      latestProps.current.onBlockMenuSelect(item)
    }

    submitLinkRef.current = (url: string) => {
      const item = menuRef.current?.pendingLinkItem
      const normalized = normalizeLinkHref(url)
      if (!item || !normalized) {
        // unsafe/empty URL: keep the input open, nothing to insert
        return
      }

      updateMenu(null)
      commitNow()
      retired.current = true
      latestProps.current.onBlockMenuSelect(item, { url: normalized })
    }

    const initialState = createFocusedBlockEditorState(content, callbacks, {
      rawTextMode: latestProps.current.rawTextMode,
    })
    const caret = resolveCaretOffset(autoFocus, initialState.doc.content.size)
    const stateWithCaret = initialState.apply(
      initialState.tr.setSelection(TextSelection.create(initialState.doc, caret)),
    )

    // `mount` makes the span itself the contenteditable root — the editor adds
    // no extra <div>, so the chrome wrapper (<p>/<h1>…) keeps valid nesting.
    const view = new EditorView(
      { mount: container },
      {
        state: stateWithCaret,
        dispatchTransaction: (transaction) => {
          view.updateState(view.state.apply(transaction))
          refreshSnapshot()
        },
        // rich (text/html) pastes keep marks on PM's default path; block
        // boundaries become hard_breaks via the HTML transform. Plain-text
        // multiline pastes get the same line structure via handlePaste.
        transformPastedHTML: insertLineBreaksBetweenBlocks,
        handlePaste: (pasteView, event) => handleMultilinePaste(pasteView, event),
        handleDOMEvents: {
          blur: () => {
            commitNow()

            return false
          },
        },
      },
    )
    viewRef.current = view
    // jsdom cannot type into contenteditable — tests drive PM through this handle.
    ;(container as HTMLElement & { pmView?: EditorView }).pmView = view

    // Outline's isSelectingText: hide the toolbar while the mouse is dragging
    // out a selection, show it on release.
    let pendingSelectionFrame = 0
    const handleMouseDown = () => setIsSelectingText(true)
    const handleMouseUp = () => {
      setIsSelectingText(false)
      refreshSnapshot()
      // ProseMirror's DOM observer can finalize the drag selection a tick after
      // this native mouseup, so a synchronous read may still see the pre-release
      // (or empty) range. Re-read next frame so the toolbar reliably sees the
      // full selection and appears. Without this the popover is flaky on drag.
      if (typeof requestAnimationFrame === 'function') {
        cancelAnimationFrame(pendingSelectionFrame)
        pendingSelectionFrame = requestAnimationFrame(() => refreshSnapshot())
      }
    }
    container.addEventListener('mousedown', handleMouseDown)
    // Capture phase: fire even if a descendant (inline drag/menu) stops the
    // bubbling mouseup, otherwise isSelectingText could stay stuck true and the
    // toolbar would never re-appear.
    document.addEventListener('mouseup', handleMouseUp, true)

    view.focus()

    // Keep a freshly focused block (e.g. one just inserted below the fold) in
    // view. 'nearest' is a no-op when the block is already visible.
    if (typeof container.scrollIntoView === 'function') {
      container.scrollIntoView({ block: 'nearest' })
    }

    // '+' button flow: a typed '/' opens the menu through the plugin's normal
    // path (single code path for both entry points); it is deleted on select.
    if (latestProps.current.autoOpenBlockMenu) {
      view.dispatch(view.state.tr.insertText('/', view.state.selection.from))
    }

    return () => {
      cancelAnimationFrame(pendingSelectionFrame)
      container.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp, true)
      delete (container as HTMLElement & { pmView?: EditorView }).pmView
      const finalCommit = retired.current ? undefined : editorStateToInline(view.state)
      viewRef.current = undefined
      view.destroy()
      if (finalCommit) {
        latestProps.current.onCommit(finalCommit)
      }
    }
    // Mount-once per focus session: content/autoFocus are init-only inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <span ref={containerRef} className={className} data-inline-root data-testid="focused-block-editor" />
      {snapshot && !isSelectingText ? (
        <SelectionToolbar
          snapshot={snapshot}
          onToggleMark={toggleNamedMark}
          onSetHighlight={setHighlight}
          onSetColor={setColor}
          onSetLink={setLink}
          blockAlign={blockAlign ?? null}
          onSetAlign={onSetAlign}
        />
      ) : null}
      {menu ? (
        <BlockMenu
          anchor={menu.anchor}
          items={filterBlockMenuItems(menu.query)}
          activeIndex={menu.activeIndex}
          view={menu.view}
          onSelect={(item) => selectItemRef.current?.(item)}
          onSubmitLink={(url) => submitLinkRef.current?.(url)}
          onClose={() => updateMenu(null)}
        />
      ) : null}
    </>
  )
}
