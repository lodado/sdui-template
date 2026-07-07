import type { BlockAlign, SduiInlineContent } from '@lodado/sdui-document'
import { toggleMark } from 'prosemirror-commands'
import { TextSelection } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { BlockMenu } from '../editor/block-menu/BlockMenu'
import type { BlockMenuItem } from '../editor/block-menu/blockMenuItems'
import { filterBlockMenuItems } from '../editor/block-menu/blockMenuItems'
import type { SelectionSnapshot } from '../selection-toolbar/selectionSnapshot'
import { buildSelectionSnapshot, selectionSnapshotsEqual } from '../selection-toolbar/selectionSnapshot'
import type { SelectionToolbarProps } from '../selection-toolbar/SelectionToolbar'
import { rafThrottle } from '../shared/rafThrottle'
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
  /**
   * Publishes this block's SelectionToolbar props (or null when there is no
   * ranged selection). The document renders a single, editor-level toolbar
   * from the published props instead of each block mounting its own.
   */
  // eslint-disable-next-line react/no-unused-prop-types -- consumed via latestProps ref
  onToolbarPropsChange?(props: SelectionToolbarProps | null): void
  /**
   * BlockMenuItem id matching this block's current type, shown as the active
   * entry in the toolbar's turn-into dropdown. `undefined` hides the dropdown.
   */
  turnIntoActiveId?: string | null
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
 * - a ranged selection publishes SelectionToolbar props (onToolbarPropsChange)
 *   live off the DOM selection (selectionchange), so the editor-level single
 *   toolbar tracks a drag in progress and appears without a trailing click;
 *   cross-block selections publish null and are ceded to the range toolbar.
 *   mark edits are plain PM transactions, persisted through the commit channel
 */
export const FocusedBlockEditor = (props: FocusedBlockEditorProps) => {
  // onCommit is intentionally not destructured: it is only reached through
  // latestProps so late prop swaps still land (react/no-unused-prop-types).
  const { content, autoFocus, className, blockAlign, onSetAlign, turnIntoActiveId } = props
  const containerRef = useRef<HTMLSpanElement>(null)
  const viewRef = useRef<EditorView>()
  const latestProps = useRef(props)
  latestProps.current = props

  const [snapshot, setSnapshot] = useState<SelectionSnapshot | null>(null)

  const { menu, menuRef, updateMenu } = useBlockMenuState()
  // Select/submit need commitNow/retired from the mount effect — bridged via refs.
  const selectItemRef = useRef<(item: BlockMenuItem) => void>()
  const submitLinkRef = useRef<(url: string) => void>()
  const toolbarTurnIntoRef = useRef<(type: string, attrs?: Record<string, unknown>) => void>()

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

  const handleToolbarTurnInto = useCallback((type: string, attrs?: Record<string, unknown>) => {
    toolbarTurnIntoRef.current?.(type, attrs)
  }, [])

  const toggleNamedMark = useCallback((name: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code') => {
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

  // Assembled once per selection change; SelectionToolbar self-gates on an
  // empty snapshot, so an empty snapshot still publishes (the editor decides
  // whether to render). Callbacks are stable, so identity tracks the snapshot.
  const toolbarProps = useMemo<SelectionToolbarProps | null>(
    () =>
      snapshot
        ? {
            snapshot,
            onToggleMark: toggleNamedMark,
            onSetHighlight: setHighlight,
            onSetColor: setColor,
            onSetLink: setLink,
            blockAlign: blockAlign ?? null,
            onSetAlign,
            turnInto:
              turnIntoActiveId !== undefined
                ? { activeId: turnIntoActiveId, onSelect: handleToolbarTurnInto }
                : undefined,
          }
        : null,
    [
      snapshot,
      toggleNamedMark,
      setHighlight,
      setColor,
      setLink,
      blockAlign,
      onSetAlign,
      turnIntoActiveId,
      handleToolbarTurnInto,
    ],
  )

  // Publish to the editor-level single toolbar; clear on unmount so a stale
  // block's props never outlive it.
  useEffect(() => {
    latestProps.current.onToolbarPropsChange?.(toolbarProps)
  }, [toolbarProps])
  useEffect(() => () => latestProps.current.onToolbarPropsChange?.(null), [])

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

    // Toolbar turn-into DOES commit first — unlike the input-rule path there
    // is no pending prefix deletion, so the current text must be persisted
    // before the block.setType patch lands.
    toolbarTurnIntoRef.current = (type, attrs) => {
      commitNow()
      latestProps.current.onTurnInto(type, attrs)
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

    // Drive the toolbar straight off the DOM selection — the same trigger the
    // cross-block range toolbar uses — so it tracks a drag live and appears
    // without a trailing click. A selection that leaves this block is cross-
    // block: hide here and let the range toolbar own it (avoids two toolbars).
    let pendingSelectionFrame = 0
    const handleSelectionChange = () => {
      const selection = container.ownerDocument.getSelection()
      if (
        selection &&
        !selection.isCollapsed &&
        (!container.contains(selection.anchorNode) || !container.contains(selection.focusNode))
      ) {
        setSnapshot(null)

        return
      }

      // buildSelectionSnapshot reads PM's *state* selection, which PM syncs from
      // the DOM a tick after this event, and coordsAtPos needs layout. A purely
      // synchronous read can miss a drag's final range (empty snapshot → no
      // toolbar). Read now for responsiveness, then re-read next frame so the
      // settled selection + measurable rect reliably land the toolbar.
      refreshSnapshot()
      // Only a non-collapsed selection can raise the toolbar; skipping the
      // deferred re-read for a collapsed caret avoids scheduling needless async
      // state updates during plain typing/keyboard flows.
      if (selection && !selection.isCollapsed && typeof requestAnimationFrame === 'function') {
        cancelAnimationFrame(pendingSelectionFrame)
        pendingSelectionFrame = requestAnimationFrame(() => refreshSnapshot())
      }
    }
    document.addEventListener('selectionchange', handleSelectionChange)

    // The SelectionToolbar anchor is position:fixed at the selection's viewport
    // rect (measured once via coordsAtPos). Scrolling moves the text but not the
    // fixed anchor, so the toolbar detaches. Re-measure on scroll/resize so it
    // tracks the selection. Capture phase catches nested scroll containers too
    // (scroll doesn't bubble). rAF-throttled: scroll may fire several times per
    // frame — one paint-aligned re-measure suffices (equality bail still skips
    // the setState when the rect is unchanged).
    const refreshSnapshotOnScroll = rafThrottle(refreshSnapshot)
    window.addEventListener('scroll', refreshSnapshotOnScroll, true)
    window.addEventListener('resize', refreshSnapshotOnScroll)

    // Same detachment problem as the toolbar: the slash-menu anchor is a
    // one-shot coordsAtPos snapshot, so any scroll after open (including PM's
    // own scrollIntoView on dispatch) strands the menu at stale viewport
    // coords. Re-measure while the menu is open.
    const refreshMenuAnchor = () => {
      const { current } = menuRef
      if (!current || !viewRef.current) {
        return
      }

      const range = getSlashRange(viewRef.current.state)
      if (!range) {
        return
      }

      try {
        const coords = viewRef.current.coordsAtPos(range.from)
        if (coords.left !== current.anchor.left || coords.top !== current.anchor.top) {
          updateMenu({ ...current, anchor: { left: coords.left, top: coords.top, bottom: coords.bottom } })
        }
      } catch {
        // coordsAtPos may throw in jsdom / SSR — keep the last anchor.
      }
    }
    const refreshMenuAnchorOnScroll = rafThrottle(refreshMenuAnchor)
    window.addEventListener('scroll', refreshMenuAnchorOnScroll, true)
    window.addEventListener('resize', refreshMenuAnchorOnScroll)

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
      document.removeEventListener('selectionchange', handleSelectionChange)
      refreshSnapshotOnScroll.cancel()
      window.removeEventListener('scroll', refreshSnapshotOnScroll, true)
      window.removeEventListener('resize', refreshSnapshotOnScroll)
      refreshMenuAnchorOnScroll.cancel()
      window.removeEventListener('scroll', refreshMenuAnchorOnScroll, true)
      window.removeEventListener('resize', refreshMenuAnchorOnScroll)
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
