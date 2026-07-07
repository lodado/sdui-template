import type { SduiDocumentBlock } from '@lodado/sdui-document'
import {
  COLUMN_BLOCK_TYPE,
  COLUMN_LIST_BLOCK_TYPE,
  MIN_COLUMN_RATIO,
  resizeColumnPair,
  resolveBlockAlign,
} from '@lodado/sdui-document'
import React from 'react'

import { BlockChrome } from '../block-types/BlockChrome'
import { FocusedBlockEditor } from '../focused-block/FocusedBlockEditor'
import { InlineContentView } from '../inline/InlineContentView'
import { blockMenuItemIdFor } from './block-menu/blockMenuItems'
import { blockInlineContent, isTextBlock } from './blockContent'
import { DRAG_INDENT_WIDTH } from './editorConstants'
import { useEditorRuntime } from './EditorRuntimeContext'
import type { RenderEntry } from './renderModel/entry'
import { useBlockEntry } from './renderModel/useBlockEntry'
import { useEditorUISelector } from './uiStore'

type BlockNodeProps = {
  /** Block id; the row subscribes to its own render entry via this id. */
  id: string
  depth: number
  readOnly: boolean
}

type BlockViewProps = {
  entry: RenderEntry
  depth: number
  readOnly: boolean
}

/**
 * A childless block object reconstructed from a render entry. Everything a row
 * or its BlockChrome needs (type/state/attributes) is here; children are
 * rendered separately by id, so no block-type reads `.children`.
 */
function entryToBlock(entry: RenderEntry): SduiDocumentBlock {
  return {
    id: entry.id as SduiDocumentBlock['id'],
    type: entry.type,
    position: entry.position,
    origin: entry.origin,
    state: entry.state,
    attributes: entry.attributes,
  }
}

function attributeRatio(attributes: Record<string, unknown> | undefined): number | undefined {
  const ratio = attributes?.ratio
  return typeof ratio === 'number' && Number.isFinite(ratio) && ratio > 0 ? ratio : undefined
}

/** One ArrowLeft/ArrowRight press moves the gutter by this fraction of the pair width. */
const KEYBOARD_RESIZE_STEP = 0.05

function escapeAttributeValue(value: string): string {
  return value.replace(/["\\]/g, '\\$&')
}

/** Reads a column's current grow weight from its inline style; absent = the equal-split default (1). */
function currentColumnRatio(element: HTMLElement | null): number | undefined {
  const value = element?.style.flexGrow
  if (!value) {
    return undefined
  }
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

/**
 * Draggable/keyboard-operable divider between two sibling columns. Commits a
 * ratio update on pointerup (drag) or per arrow press — the patch pair is one
 * undo step. Pointer travel is measured against the two columns' current
 * rendered widths so a 10% drag is a 10% visual change.
 *
 * While dragging, the two columns' flex-grow is repainted live on every
 * pointermove (inline style, no patch/re-render) using the same clamped math as
 * the commit; the preview is torn down on pointerup or Escape, then the final
 * position is committed as one undo step. Escape cancels without committing.
 */
const ColumnResizeGutter = ({ leftId, rightId }: { leftId: string; rightId: string }) => {
  const { handlers, renderStore } = useEditorRuntime()
  // subscribe to both columns' entries so a committed resize updates the
  // splitter's ARIA value reactively (ratio lives on each column's attributes)
  const leftRatio = attributeRatio(useBlockEntry(renderStore, leftId)?.attributes) ?? 1
  const rightRatio = attributeRatio(useBlockEntry(renderStore, rightId)?.attributes) ?? 1

  // Left column's share of the pair, as a percentage, for the splitter's ARIA
  // value. The pair total is preserved on resize and each side clamps at
  // MIN_COLUMN_RATIO, so the reachable range is [minPct, 100 - minPct].
  const total = leftRatio + rightRatio
  const leftPct = Math.round((leftRatio / total) * 100)
  const minPct = Math.round((MIN_COLUMN_RATIO / total) * 100)

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- focusable separator IS the resize widget (window-splitter pattern)
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={`Resize columns ${leftId} and ${rightId}`}
      aria-valuenow={leftPct}
      aria-valuemin={minPct}
      aria-valuemax={100 - minPct}
      aria-valuetext={`${leftPct}%`}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- focusable separator IS the resize widget (window-splitter pattern)
      tabIndex={0}
      data-column-resize
      onKeyDown={(event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
          return
        }

        event.preventDefault()
        handlers.resizeColumnPair(
          leftId,
          rightId,
          event.key === 'ArrowRight' ? KEYBOARD_RESIZE_STEP : -KEYBOARD_RESIZE_STEP,
        )
      }}
      onPointerDown={(event) => {
        if (event.button !== 0) {
          return
        }

        // a drag, not a click — keep the gesture out of text selection
        event.preventDefault()
        // preventDefault suppresses the browser's focus-on-mousedown, so without
        // this the gutter never receives focus and a follow-up ArrowLeft/Right
        // (keyboard resize) goes nowhere.
        const gutter = event.currentTarget
        gutter.focus({ preventScroll: true })
        const list = gutter.parentElement
        const leftEl = list?.querySelector<HTMLElement>(`[data-block-id="${escapeAttributeValue(leftId)}"]`) ?? null
        const rightEl = list?.querySelector<HTMLElement>(`[data-block-id="${escapeAttributeValue(rightId)}"]`) ?? null
        const startX = event.clientX
        const pairWidth = (leftEl?.getBoundingClientRect().width ?? 0) + (rightEl?.getBoundingClientRect().width ?? 0)
        const startLeftRatio = currentColumnRatio(leftEl)
        const startRightRatio = currentColumnRatio(rightEl)
        // restore exactly what React had rendered so a cancelled/committed drag leaves no orphan inline style
        const restoreLeft = leftEl?.style.flexGrow ?? ''
        const restoreRight = rightEl?.style.flexGrow ?? ''

        // Live percentage readout that follows the gutter while dragging.
        const tooltip = gutter.ownerDocument.createElement('div')
        tooltip.dataset.resizeTooltip = ''
        gutter.appendChild(tooltip)

        const deltaFractionAt = (clientX: number) => (pairWidth > 0 ? (clientX - startX) / pairWidth : 0)

        const controller = new AbortController()
        const { signal } = controller
        const teardown = () => {
          controller.abort()
          tooltip.remove()
          if (leftEl) leftEl.style.flexGrow = restoreLeft
          if (rightEl) rightEl.style.flexGrow = restoreRight
        }

        window.addEventListener(
          'pointermove',
          (move: PointerEvent) => {
            const delta = deltaFractionAt(move.clientX)
            if (delta === 0) {
              return
            }
            const preview = resizeColumnPair({
              leftRatio: startLeftRatio,
              rightRatio: startRightRatio,
              deltaFraction: delta,
            })
            if (leftEl) leftEl.style.flexGrow = String(preview.leftRatio)
            if (rightEl) rightEl.style.flexGrow = String(preview.rightRatio)
            const previewTotal = preview.leftRatio + preview.rightRatio
            tooltip.textContent = `${Math.round((preview.leftRatio / previewTotal) * 100)}%`
          },
          { signal },
        )
        window.addEventListener(
          'pointerup',
          (up: PointerEvent) => {
            const delta = deltaFractionAt(up.clientX)
            teardown()
            if (delta !== 0) {
              handlers.resizeColumnPair(leftId, rightId, delta)
            }
          },
          { signal },
        )
        window.addEventListener(
          'keydown',
          (key: KeyboardEvent) => {
            if (key.key === 'Escape') {
              teardown()
            }
          },
          { signal },
        )
      }}
    />
  )
}

/**
 * Layout-only containers for horizontal splits — no row chrome (drag handle /
 * plus button / BlockChrome): only the content rows inside the columns are
 * interactive. Column children do NOT get the [data-block-nested] indent —
 * horizontal layout replaces vertical indentation at this level.
 */
const ColumnContainers = ({ entry, depth, readOnly }: BlockViewProps) => {
  const { childrenIds } = entry

  if (entry.type === COLUMN_LIST_BLOCK_TYPE) {
    return (
      <div data-block-id={entry.id} data-depth={depth} data-column-list>
        {childrenIds.map((childId, index) => (
          <React.Fragment key={childId}>
            {index > 0 && !readOnly && <ColumnResizeGutter leftId={childrenIds[index - 1]} rightId={childId} />}
            {/* eslint-disable-next-line no-use-before-define -- mutual recursion: containers render nested BlockNodes */}
            <BlockNode id={childId} depth={depth} readOnly={readOnly} />
          </React.Fragment>
        ))}
      </div>
    )
  }

  const ratio = attributeRatio(entry.attributes)

  return (
    <div data-block-id={entry.id} data-column style={ratio !== undefined ? { flexGrow: ratio } : undefined}>
      {childrenIds.map((childId) => (
        // eslint-disable-next-line no-use-before-define -- mutual recursion: containers render nested BlockNodes
        <BlockNode key={childId} id={childId} depth={depth} readOnly={readOnly} />
      ))}
    </div>
  )
}

/**
 * Subscribes a row to its own render entry (per-id) and dispatches to the right
 * view. Memoized on {id, depth, readOnly}, so a parent re-render never cascades;
 * the row re-renders only when ITS entry changes — that is the O(1) boundary.
 */
export const BlockNode = React.memo(({ id, depth, readOnly }: BlockNodeProps) => {
  const { renderStore } = useEditorRuntime()
  const entry = useBlockEntry(renderStore, id)

  if (!entry) {
    return null
  }

  if (entry.type === COLUMN_LIST_BLOCK_TYPE || entry.type === COLUMN_BLOCK_TYPE) {
    return <ColumnContainers entry={entry} depth={depth} readOnly={readOnly} />
  }

  // eslint-disable-next-line no-use-before-define -- mutual recursion: rows render nested BlockNodes
  return <BlockRow entry={entry} depth={depth} readOnly={readOnly} />
})
BlockNode.displayName = 'BlockNode'

const BlockRow = ({ entry, depth, readOnly }: BlockViewProps) => {
  const { store, handlers } = useEditorRuntime()
  const block = React.useMemo(() => entryToBlock(entry), [entry])
  const { id } = entry
  const { childrenIds, listOrdinal } = entry
  const isSelected = useEditorUISelector(store, (state) => state.selection.selectedIds.includes(id))
  const focus = useEditorUISelector(store, (state) => (state.focus?.blockId === id ? state.focus : null))

  const isFocused = !readOnly && focus !== null && isTextBlock(block)

  // toggle collapse hides children at render time only — they stay in the document
  const isToggle = block.type === 'document.toggle'
  const documentCollapsed = block.attributes?.collapsed === true
  const [readCollapsed, setReadCollapsed] = React.useState(documentCollapsed)

  React.useEffect(() => {
    if (readOnly && isToggle) {
      setReadCollapsed(documentCollapsed)
    }
  }, [readOnly, isToggle, documentCollapsed])

  const isCollapsedToggle = isToggle && (readOnly ? readCollapsed : documentCollapsed)
  const isExpandedEmptyToggle = isToggle && !isCollapsedToggle && childrenIds.length === 0
  const chromeBlock =
    readOnly && isToggle ? { ...block, attributes: { ...block.attributes, collapsed: readCollapsed } } : block

  let onToggleCollapsed: ((blockId: string, collapsed: boolean) => void) | undefined
  if (readOnly) {
    onToggleCollapsed = isToggle ? (_blockId, collapsed) => setReadCollapsed(collapsed) : undefined
  } else {
    onToggleCollapsed = handlers.toggleCollapsed
  }

  // span keeps the chrome wrapper (<p>/<h1>…) valid — div may not nest there
  const staticView = readOnly ? (
    <span className="sdui-doc-static" data-inline-root>
      <InlineContentView content={blockInlineContent(block)} />
    </span>
  ) : (
    <span
      className="sdui-doc-static"
      data-inline-root
      role="textbox"
      tabIndex={0}
      onClick={() => {
        // a non-collapsed selection means the user just selected text to drag
        // (or copy) — focusing now would mount PM and destroy that selection
        const selection = window.getSelection()
        if (selection && !selection.isCollapsed) {
          return
        }

        handlers.focusBlock(block.id, 'start')
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          handlers.focusBlock(block.id, 'start')
        }
      }}
    >
      <InlineContentView content={blockInlineContent(block)} />
    </span>
  )

  return (
    <div
      data-block-id={block.id}
      data-depth={depth}
      data-selected={isSelected || undefined}
      data-focused={isFocused || undefined}
      data-just-inserted={focus?.justInserted || undefined}
    >
      {/* row layout (flex + vertical centering + Notion block height) lives in editor.css */}
      {/* the ROW is the droppable — not the subtree wrapper — so the drop
          projection's vertical zones are measured against this row only */}
      {/* the ROW is the drop hit-test target (useBlockPointerDrag reads its rect
          via elementFromPoint) — the vertical zones measure against this row only */}
      <div data-block-row>
        {/* the ⠿ glyph is CSS ::before content — a real text node would join
            cross-block native selections and get copied between blocks */}
        {/* Mouse-only affordances: hidden from the a11y tree and tab order so a
            document of N blocks does not add 2N controls before the content.
            Every action has a keyboard path (Enter split + '/', Escape to select
            a block, Mod+Shift+Arrow to move), so nothing is lost for AT users. */}
        {!readOnly && (
          <button
            type="button"
            data-plus-handle
            aria-label={`Add block below ${block.id}`}
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => handlers.insertBlockBelow(block.id)}
          />
        )}
        {!readOnly && (
          <button
            type="button"
            data-drag-handle
            aria-label={`Drag block ${block.id}`}
            style={{ cursor: 'grab', border: 'none', background: 'transparent', padding: '2px 4px' }}
            onClick={(event) => {
              // Notion parity: plain click opens the block-actions menu (which
              // also selects the block); Shift+click extends the selection.
              if (event.shiftKey) {
                handlers.handleClick(block.id, true)

                return
              }

              handlers.openBlockActions(block.id, event.currentTarget.getBoundingClientRect())
            }}
            onContextMenu={(event) => {
              // Right-click the handle → same block-actions menu.
              event.preventDefault()
              handlers.openBlockActions(block.id, event.currentTarget.getBoundingClientRect())
            }}
            // pointerdown on this handle starts the drag (delegated on the
            // container by useBlockPointerDrag); onClick still opens the menu.
            aria-hidden="true"
            tabIndex={-1}
          />
        )}
        <div data-block-content data-align={resolveBlockAlign(block.attributes?.align)}>
          <BlockChrome
            block={chromeBlock}
            depth={depth}
            listOrdinal={listOrdinal}
            onToggleChecked={readOnly ? undefined : handlers.toggleChecked}
            onToggleCollapsed={onToggleCollapsed}
            onSetCodeLanguage={readOnly ? undefined : handlers.setCodeLanguage}
            onSetImageLayout={readOnly ? undefined : handlers.setImageLayout}
          >
            {isTextBlock(block) &&
              (isFocused && focus ? (
                <FocusedBlockEditor
                  key={focus.session}
                  content={blockInlineContent(block)}
                  autoFocus={focus.caret}
                  autoOpenBlockMenu={focus.openBlockMenu === true}
                  rawTextMode={block.type === 'document.code'}
                  blockAlign={resolveBlockAlign(block.attributes?.align) ?? null}
                  onSetAlign={(align) => handlers.setBlockAlign(block.id, align)}
                  onCommit={(commit) => handlers.commit(block.id, commit)}
                  onSplit={(offset) => handlers.split(block.id, offset)}
                  onMergeBackward={() => handlers.mergeBackward(block.id)}
                  onIndent={() => handlers.indent(block.id)}
                  onOutdent={() => handlers.outdent(block.id)}
                  onNavigate={(direction) => handlers.navigate(block.id, direction)}
                  onTurnInto={(type, attrs) => handlers.turnInto(block.id, type, attrs)}
                  turnIntoActiveId={blockMenuItemIdFor(block.type, block.attributes)}
                  onMoveBlock={(direction) => handlers.moveBlock(block.id, direction)}
                  onHistory={(direction) => handlers.history(direction)}
                  onBlockAction={() => handlers.blockAction(block.id)}
                  onEscape={() => handlers.escape(block.id)}
                  onBlockMenuSelect={(item, extra) => handlers.blockMenuSelect(block.id, item, extra)}
                  onToolbarPropsChange={(toolbarProps) => store.set({ selectionToolbar: toolbarProps })}
                />
              ) : (
                staticView
              ))}
          </BlockChrome>
        </div>
      </div>
      {childrenIds.length > 0 && !isCollapsedToggle ? (
        // one visual indent level per tree level — same unit the drag depth
        // projection uses, so the drop indicator lines up with real indents
        <div data-block-nested data-nested-toggle={isToggle || undefined} style={{ paddingLeft: DRAG_INDENT_WIDTH }}>
          {childrenIds.map((childId) => (
            <BlockNode key={childId} id={childId} depth={depth + 1} readOnly={readOnly} />
          ))}
        </div>
      ) : null}
      {isExpandedEmptyToggle ? (
        <div data-block-nested data-nested-toggle style={{ paddingLeft: DRAG_INDENT_WIDTH }}>
          <button
            type="button"
            className="toggle-empty-placeholder"
            disabled={readOnly}
            onClick={() => handlers.insertToggleChild(block.id)}
          >
            Empty toggle. Press Enter, click, or drop blocks inside.
          </button>
        </div>
      ) : null}
    </div>
  )
}
BlockRow.displayName = 'BlockRow'
