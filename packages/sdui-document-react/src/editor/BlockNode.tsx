import { useDraggable, useDroppable } from '@dnd-kit/core'
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
import { blockInlineContent, isTextBlock, numberedListOrdinals } from './blockContent'
import { DRAG_INDENT_WIDTH } from './editorConstants'
import { useEditorRuntime } from './EditorRuntimeContext'
import { useEditorUISelector } from './uiStore'

type BlockNodeProps = {
  block: SduiDocumentBlock
  depth: number
  readOnly: boolean
  /** Render-time ordinal for numbered list items — computed by the parent's children map. */
  listOrdinal?: number
}

function columnRatio(block: SduiDocumentBlock): number | undefined {
  const ratio = block.attributes?.ratio
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
const ColumnResizeGutter = ({
  leftId,
  rightId,
  leftRatio,
  rightRatio,
}: {
  leftId: string
  rightId: string
  leftRatio: number
  rightRatio: number
}) => {
  const { handlers } = useEditorRuntime()

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
const ColumnContainers = ({ block, depth, readOnly }: Omit<BlockNodeProps, 'listOrdinal'>) => {
  if (block.type === COLUMN_LIST_BLOCK_TYPE) {
    const columns = block.children ?? []

    return (
      <div data-block-id={block.id} data-depth={depth} data-column-list>
        {columns.map((child, index) => (
          <React.Fragment key={child.id}>
            {index > 0 && !readOnly && (
              <ColumnResizeGutter
                leftId={columns[index - 1].id}
                rightId={child.id}
                leftRatio={columnRatio(columns[index - 1]) ?? 1}
                rightRatio={columnRatio(child) ?? 1}
              />
            )}
            {/* eslint-disable-next-line no-use-before-define -- mutual recursion: containers render nested BlockNodes */}
            <BlockNode block={child} depth={depth} readOnly={readOnly} />
          </React.Fragment>
        ))}
      </div>
    )
  }

  const ratio = columnRatio(block)
  const ordinals = numberedListOrdinals(block.children ?? [])

  return (
    <div data-block-id={block.id} data-column style={ratio !== undefined ? { flexGrow: ratio } : undefined}>
      {block.children?.map((child) => (
        // eslint-disable-next-line no-use-before-define -- mutual recursion: containers render nested BlockNodes
        <BlockNode
          key={child.id}
          block={child}
          depth={depth}
          readOnly={readOnly}
          listOrdinal={ordinals.get(child.id)}
        />
      ))}
    </div>
  )
}

/**
 * One block row: droppable row + drag handle + type chrome + recursive
 * children. Memoized — re-renders only when its own block reference, its
 * focus/selection slice, or dnd state for this row changes. Focus, selection
 * and the drop indicator are NOT props, so sibling rows stay untouched.
 */
export const BlockNode = React.memo(({ block, depth, readOnly, listOrdinal }: BlockNodeProps) => {
  if (block.type === COLUMN_LIST_BLOCK_TYPE || block.type === COLUMN_BLOCK_TYPE) {
    return <ColumnContainers block={block} depth={depth} readOnly={readOnly} />
  }

  // eslint-disable-next-line no-use-before-define -- mutual recursion: rows render nested BlockNodes
  return <BlockRow block={block} depth={depth} readOnly={readOnly} listOrdinal={listOrdinal} />
})
BlockNode.displayName = 'BlockNode'

const BlockRow = React.memo(({ block, depth, readOnly, listOrdinal }: BlockNodeProps) => {
  const { store, handlers } = useEditorRuntime()
  const isSelected = useEditorUISelector(store, (state) => state.selection.selectedIds.includes(block.id))
  const focus = useEditorUISelector(store, (state) => (state.focus?.blockId === block.id ? state.focus : null))
  const { setNodeRef: setDropRef } = useDroppable({ id: block.id, disabled: readOnly })
  const {
    setNodeRef: setDragRef,
    listeners,
    attributes,
    isDragging,
  } = useDraggable({ id: block.id, disabled: readOnly })

  const isFocused = !readOnly && focus !== null && isTextBlock(block)

  // toggle collapse hides children at render time only — they stay in the document
  const isToggle = block.type === 'document.toggle'
  const isCollapsedToggle = isToggle && block.attributes?.collapsed === true
  const isExpandedEmptyToggle = isToggle && !isCollapsedToggle && !block.children?.length

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
      <div ref={setDropRef} data-block-row>
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
            ref={setDragRef}
            data-drag-handle
            data-dragging={isDragging || undefined}
            aria-label={`Drag block ${block.id}`}
            style={{ cursor: 'grab', border: 'none', background: 'transparent', padding: '2px 4px' }}
            onClick={(event) => handlers.handleClick(block.id, event.shiftKey)}
            onContextMenu={(event) => {
              // Right-click the handle → block-actions menu (turn into / duplicate / delete).
              event.preventDefault()
              handlers.openBlockActions(block.id, event.currentTarget.getBoundingClientRect())
            }}
            // eslint-disable-next-line react/jsx-props-no-spreading -- dnd-kit activator contract
            {...attributes}
            // eslint-disable-next-line react/jsx-props-no-spreading -- dnd-kit activator contract
            {...listeners}
            // aria-hidden + tabIndex must win over dnd-kit's own role/tabIndex,
            // so they are spread last.
            aria-hidden="true"
            tabIndex={-1}
          />
        )}
        <div data-block-content data-align={resolveBlockAlign(block.attributes?.align)}>
          <BlockChrome
            block={block}
            depth={depth}
            listOrdinal={listOrdinal}
            onToggleChecked={readOnly ? undefined : handlers.toggleChecked}
            onToggleCollapsed={readOnly ? undefined : handlers.toggleCollapsed}
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
      {block.children?.length && !isCollapsedToggle ? (
        // one visual indent level per tree level — same unit the drag depth
        // projection uses, so the drop indicator lines up with real indents
        <div data-block-nested style={{ paddingLeft: DRAG_INDENT_WIDTH }}>
          {(() => {
            const ordinals = numberedListOrdinals(block.children)
            return block.children.map((child) => (
              <BlockNode
                key={child.id}
                block={child}
                depth={depth + 1}
                readOnly={readOnly}
                listOrdinal={ordinals.get(child.id)}
              />
            ))
          })()}
        </div>
      ) : null}
      {isExpandedEmptyToggle ? (
        <div data-block-nested style={{ paddingLeft: DRAG_INDENT_WIDTH }}>
          <div className="toggle-empty-placeholder">Empty toggle. Press Enter, click, or drop blocks inside.</div>
        </div>
      ) : null}
    </div>
  )
})
BlockRow.displayName = 'BlockRow'
