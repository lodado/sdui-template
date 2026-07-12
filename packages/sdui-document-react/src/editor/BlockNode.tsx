import type { SduiDocumentBlock } from '@lodado/sdui-document'
import {
  CODE_BLOCK_TYPE,
  COLLECTION_BLOCK_TYPE,
  COLUMN_BLOCK_TYPE,
  COLUMN_LIST_BLOCK_TYPE,
  resolveBlockAlign,
  TOGGLE_BLOCK_TYPE,
} from '@lodado/sdui-document'
import React from 'react'

import { BlockChrome } from '../block-types/BlockChrome'
import { FocusedBlockEditor } from '../focused-block/FocusedBlockEditor'
import { InlineContentView } from '../inline/InlineContentView'
import { blockColorAttr } from './block-menu/blockColors'
import { blockMenuItemIdFor } from './block-menu/blockMenuItems'
import { blockInlineContent, isTextBlock } from './blockContent'
import { attributeRatio, ColumnResizeGutter } from './ColumnResizeGutter'
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
      <div data-block-id={entry.id} data-block-type={entry.type} data-depth={depth} data-column-list>
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
    <div
      data-block-id={entry.id}
      data-block-type={entry.type}
      data-column
      style={ratio !== undefined ? { flexGrow: ratio } : undefined}
    >
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
  const { store, handlers, capabilities } = useEditorRuntime()
  const block = React.useMemo(() => entryToBlock(entry), [entry])
  const { id } = entry
  const { childrenIds, listOrdinal } = entry
  const isSelected = useEditorUISelector(store, (state) => state.selection.selectedIds.includes(id))
  const focus = useEditorUISelector(store, (state) => (state.focus?.blockId === id ? state.focus : null))

  const isFocused = !readOnly && focus !== null && isTextBlock(block)

  // toggle collapse hides children at render time only — they stay in the document
  const isToggle = block.type === TOGGLE_BLOCK_TYPE
  // collection renders its page-item children itself (as cards/rows), not as block rows
  const isCollection = block.type === COLLECTION_BLOCK_TYPE
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
      data-block-type={block.type}
      data-depth={depth}
      data-selected={isSelected || undefined}
      data-focused={isFocused || undefined}
      data-just-inserted={focus?.justInserted || undefined}
      data-block-text-color={blockColorAttr(block.attributes?.textColor)}
      data-block-bg-color={blockColorAttr(block.attributes?.backgroundColor)}
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
            onClick={(event) => {
              // Notion parity: plain click adds below, Alt/Option+click adds above.
              if (event.altKey) {
                handlers.insertBlockAbove(block.id)
                return
              }
              handlers.insertBlockBelow(block.id)
            }}
          />
        )}
        {!readOnly && (
          <button
            type="button"
            data-drag-handle
            aria-label={`Drag block ${block.id}`}
            style={{ cursor: 'grab' }}
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
            onSetCodeWrap={readOnly ? undefined : handlers.setCodeWrap}
            onSetCalloutIcon={readOnly ? undefined : handlers.setCalloutIcon}
            onSetImageLayout={readOnly ? undefined : handlers.setImageLayout}
            collectionEditor={
              readOnly
                ? undefined
                : {
                    onAddItem: handlers.addCollectionItem,
                    onSetCollectionAttrs: handlers.setCollectionAttrs,
                    onSetItemProperty: handlers.setItemProperty,
                  }
            }
            tagsEditor={
              readOnly
                ? undefined
                : {
                    onSetItems: (blockId, items) => handlers.updateBlockAttributes(blockId, { items }),
                    generateId: handlers.generateId,
                  }
            }
            buttonEditor={
              readOnly
                ? undefined
                : { onSetLabel: handlers.updateBlockText, onSetAttrs: handlers.updateBlockAttributes }
            }
          >
            {isTextBlock(block) &&
              (isFocused && focus ? (
                <FocusedBlockEditor
                  key={focus.session}
                  content={blockInlineContent(block)}
                  autoFocus={focus.caret}
                  autoOpenBlockMenu={focus.openBlockMenu === true}
                  rawTextMode={block.type === CODE_BLOCK_TYPE}
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
                  canCreatePage={capabilities.canCreatePage}
                  onToolbarPropsChange={(toolbarProps) => store.set({ selectionToolbar: toolbarProps })}
                />
              ) : (
                staticView
              ))}
          </BlockChrome>
        </div>
      </div>
      {childrenIds.length > 0 && !isCollapsedToggle && !isCollection ? (
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
