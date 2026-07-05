import { useDraggable, useDroppable } from '@dnd-kit/core'
import type { SduiDocumentBlock } from '@lodado/sdui-document'
import React from 'react'

import { BlockChrome } from '../block-types/BlockChrome'
import { FocusedBlockEditor } from '../focused-block/FocusedBlockEditor'
import { InlineContentView } from '../inline/InlineContentView'
import { blockInlineContent, isTextBlock } from './blockContent'
import { DRAG_INDENT_WIDTH } from './editorConstants'
import { useEditorRuntime } from './EditorRuntimeContext'
import { useEditorUISelector } from './uiStore'

type BlockNodeProps = {
  block: SduiDocumentBlock
  depth: number
  readOnly: boolean
}

/**
 * One block row: droppable row + drag handle + type chrome + recursive
 * children. Memoized — re-renders only when its own block reference, its
 * focus/selection slice, or dnd state for this row changes. Focus, selection
 * and the drop indicator are NOT props, so sibling rows stay untouched.
 */
export const BlockNode = React.memo(({ block, depth, readOnly }: BlockNodeProps) => {
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
    <div data-block-id={block.id} data-depth={depth} data-selected={isSelected || undefined}>
      {/* row layout (flex + vertical centering + Notion block height) lives in editor.css */}
      {/* the ROW is the droppable — not the subtree wrapper — so the drop
          projection's vertical zones are measured against this row only */}
      <div ref={setDropRef} data-block-row>
        {/* the ⠿ glyph is CSS ::before content — a real text node would join
            cross-block native selections and get copied between blocks */}
        {!readOnly && (
          <button
            type="button"
            data-plus-handle
            aria-label={`Add block below ${block.id}`}
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
            // eslint-disable-next-line react/jsx-props-no-spreading -- dnd-kit activator contract
            {...attributes}
            // eslint-disable-next-line react/jsx-props-no-spreading -- dnd-kit activator contract
            {...listeners}
          />
        )}
        <div data-block-content>
          <BlockChrome block={block} onToggleChecked={readOnly ? undefined : handlers.toggleChecked}>
            {isTextBlock(block) &&
              (isFocused && focus ? (
                <FocusedBlockEditor
                  key={focus.session}
                  content={blockInlineContent(block)}
                  autoFocus={focus.caret}
                  autoOpenBlockMenu={focus.openBlockMenu === true}
                  onCommit={(commit) => handlers.commit(block.id, commit)}
                  onSplit={(offset) => handlers.split(block.id, offset)}
                  onMergeBackward={() => handlers.mergeBackward(block.id)}
                  onIndent={() => handlers.indent(block.id)}
                  onOutdent={() => handlers.outdent(block.id)}
                  onNavigate={(direction) => handlers.navigate(block.id, direction)}
                  onTurnInto={(type, attrs) => handlers.turnInto(block.id, type, attrs)}
                  onMoveBlock={(direction) => handlers.moveBlock(block.id, direction)}
                  onBlockAction={() => handlers.blockAction(block.id)}
                  onEscape={() => handlers.escape(block.id)}
                  onBlockMenuSelect={(item, extra) => handlers.blockMenuSelect(block.id, item, extra)}
                />
              ) : (
                staticView
              ))}
          </BlockChrome>
        </div>
      </div>
      {block.children?.length ? (
        // one visual indent level per tree level — same unit the drag depth
        // projection uses, so the drop indicator lines up with real indents
        <div data-block-nested style={{ paddingLeft: DRAG_INDENT_WIDTH }}>
          {block.children.map((child) => (
            <BlockNode key={child.id} block={child} depth={depth + 1} readOnly={readOnly} />
          ))}
        </div>
      ) : null}
    </div>
  )
})
BlockNode.displayName = 'BlockNode'
