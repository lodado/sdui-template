import { DndContext, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import type {
  BlockSelectionState,
  ProjectedNestedBlockDrop,
  SduiDocumentBlock,
  SduiDocumentContent,
  SduiDocumentPatch,
  SduiInlineContent,
} from '@lodado/sdui-document'
import {
  clearBlockSelection,
  createBlockId,
  createBlockSelection,
  extendBlockSelection,
  findBlockById,
  flattenDocumentBlocks,
  getInlineContentLength,
  textToInlineContent,
} from '@lodado/sdui-document'
import React, { useRef, useState } from 'react'

import { useDocumentPatches } from '../blocks/code/useDocumentPatches'
import { useNestedBlockDragDrop } from '../blocks/code/useNestedBlockDragDrop'
import type { FocusedBlockCommit } from './FocusedBlockEditor'
import { FocusedBlockEditor } from './FocusedBlockEditor'
import { InlineContentView } from './InlineContentView'

/** Pixel width of one indentation level for drag depth projection. */
export const DRAG_INDENT_WIDTH = 24

const NON_TEXT_BLOCK_TYPES = new Set([
  'document.root',
  'document.divider',
  'document.image',
  'document.file',
  'document.link',
])

type FocusTarget = {
  blockId: string
  caret: 'start' | 'end' | number
  /** Bumped to force a fresh PM mount even when blockId stays the same. */
  session: number
}

export type SduiDocumentEditorProps = {
  /** Initial document content (uncontrolled after mount). */
  content: SduiDocumentContent
  onContentChange?(next: SduiDocumentContent, patches: SduiDocumentPatch[]): void
  /** Notified when a markdown shortcut requests a block type change. */
  onTurnInto?(blockId: string, type: string, attrs?: Record<string, unknown>): void
  readOnly?: boolean
  /** Injectable for deterministic tests; defaults to a random id. */
  generateBlockId?(): string
  className?: string
}

function defaultGenerateBlockId(): string {
  return `block-${Math.random().toString(36).slice(2, 10)}`
}

function isTextBlock(block: SduiDocumentBlock): boolean {
  return !NON_TEXT_BLOCK_TYPES.has(block.type)
}

function blockInlineContent(block: SduiDocumentBlock | undefined): SduiInlineContent {
  const content = block?.state?.content
  if (Array.isArray(content)) {
    return content as SduiInlineContent
  }

  const text = block?.state?.text

  return typeof text === 'string' ? textToInlineContent(text) : []
}

function isSameCommit(block: SduiDocumentBlock | undefined, commit: FocusedBlockCommit): boolean {
  if (!block) {
    return true
  }

  const existing = blockInlineContent(block)

  return JSON.stringify(existing) === JSON.stringify(commit.content)
}

type BlockRowProps = {
  block: SduiDocumentBlock
  depth: number
  readOnly: boolean
  isSelected: boolean
  dropIndicator: ProjectedNestedBlockDrop | null
  onHandleClick(blockId: string, shiftKey: boolean): void
  children: React.ReactNode
  nested: React.ReactNode
}

/**
 * Block chrome: droppable row + drag handle + drop indicator + selection state.
 * Purely block-layer — the PM editor inside `children` is untouched.
 */
const BlockRow = ({
  block,
  depth,
  readOnly,
  isSelected,
  dropIndicator,
  onHandleClick,
  children,
  nested,
}: BlockRowProps) => {
  const { setNodeRef: setDropRef } = useDroppable({ id: block.id, disabled: readOnly })
  const { setNodeRef: setDragRef, listeners, attributes } = useDraggable({ id: block.id, disabled: readOnly })
  const indicator = dropIndicator?.overId === block.id ? dropIndicator : null

  return (
    <div ref={setDropRef} data-block-id={block.id} data-depth={depth} data-selected={isSelected || undefined}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
        {!readOnly && (
          <button
            type="button"
            ref={setDragRef}
            data-drag-handle
            aria-label={`Drag block ${block.id}`}
            style={{ cursor: 'grab', border: 'none', background: 'transparent', padding: '2px 4px' }}
            onClick={(event) => onHandleClick(block.id, event.shiftKey)}
            // eslint-disable-next-line react/jsx-props-no-spreading -- dnd-kit activator contract
            {...attributes}
            // eslint-disable-next-line react/jsx-props-no-spreading -- dnd-kit activator contract
            {...listeners}
          >
            ⠿
          </button>
        )}
        <div style={{ flex: 1 }}>{children}</div>
      </div>
      {indicator && (
        <div
          data-drop-indicator
          data-drop-position={indicator.position}
          style={{
            height: 2,
            background: 'currentColor',
            opacity: 0.6,
            marginLeft: (indicator.depth - depth) * DRAG_INDENT_WIDTH,
          }}
        />
      )}
      {nested}
    </div>
  )
}

/**
 * Hybrid notion-like document editor surface.
 *
 * Wires the three PM <-> block-layer channels to the patch engine:
 * inject (InlineContentView / FocusedBlockEditor mount), commit
 * (block.update), and keymap delegation (split/merge/indent/outdent/navigate).
 *
 * Policies:
 * - exactly one FocusedBlockEditor is mounted (the focused text block)
 * - all structure changes go through applyDocumentPatches — never direct
 * - uncontrolled: the `content` prop seeds initial state only
 */
export const SduiDocumentEditor = (props: SduiDocumentEditorProps) => {
  const {
    content,
    onContentChange,
    onTurnInto,
    readOnly = false,
    generateBlockId = defaultGenerateBlockId,
    className,
  } = props

  const { doc, docRef, applyPatches } = useDocumentPatches({ content, onContentChange })
  const [focus, setFocus] = useState<FocusTarget | null>(null)
  const [selection, setSelection] = useState<BlockSelectionState>(clearBlockSelection())
  const containerRef = useRef<HTMLDivElement>(null)
  const sensors = useSensors(
    // distance constraint keeps plain clicks (selection) distinct from drags
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  )

  const selectBlocks = (next: BlockSelectionState) => {
    setSelection(next)
    setFocus(null)
    if (next.selectedIds.length > 0) {
      containerRef.current?.focus()
    }
  }

  const refocus = (blockId: string, caret: FocusTarget['caret']) => {
    setSelection(clearBlockSelection())
    setFocus((previous) => ({ blockId, caret, session: (previous?.session ?? 0) + 1 }))
  }

  const orderedTextBlocks = () =>
    flattenDocumentBlocks(docRef.current)
      .filter((item) => item.id !== docRef.current.root.id)
      .filter((item) => {
        const block = findBlockById(docRef.current, item.id)

        return block !== undefined && isTextBlock(block)
      })

  const handleCommit = (blockId: string) => (commit: FocusedBlockCommit) => {
    if (isSameCommit(findBlockById(docRef.current, blockId), commit)) {
      return
    }

    applyPatches([
      { type: 'block.update', blockId: createBlockId(blockId), state: { content: commit.content, text: commit.text } },
    ])
  }

  const handleSplit = (blockId: string) => (offset: number) => {
    const newBlockId = generateBlockId()
    applyPatches([
      { type: 'block.split', blockId: createBlockId(blockId), offset, newBlockId: createBlockId(newBlockId) },
    ])
    refocus(newBlockId, 'start')
  }

  const handleMergeBackward = (blockId: string) => () => {
    const ordered = orderedTextBlocks()
    const index = ordered.findIndex((item) => item.id === blockId)
    const previous = index > 0 ? ordered[index - 1] : undefined
    if (!previous) {
      refocus(blockId, 'start')

      return
    }

    const caretOffset = getInlineContentLength(blockInlineContent(findBlockById(docRef.current, previous.id)))
    applyPatches([{ type: 'block.merge', blockId: createBlockId(blockId), intoBlockId: createBlockId(previous.id) }])
    refocus(previous.id, caretOffset)
  }

  const handleIndent = (blockId: string) => () => {
    const flattened = flattenDocumentBlocks(docRef.current)
    const item = flattened.find((candidate) => candidate.id === blockId)
    const previousSibling = flattened.find(
      (candidate) => candidate.parentId === item?.parentId && candidate.index === (item?.index ?? 0) - 1,
    )
    if (!item || !previousSibling) {
      refocus(blockId, 'start')

      return
    }

    const newParent = findBlockById(docRef.current, previousSibling.id)
    applyPatches([
      {
        type: 'block.move',
        blockId: createBlockId(blockId),
        parentId: createBlockId(previousSibling.id),
        index: newParent?.children?.length ?? 0,
      },
    ])
    refocus(blockId, 'start')
  }

  const handleOutdent = (blockId: string) => () => {
    const flattened = flattenDocumentBlocks(docRef.current)
    const item = flattened.find((candidate) => candidate.id === blockId)
    const parentItem = flattened.find((candidate) => candidate.id === item?.parentId)
    if (!item || !parentItem || !parentItem.parentId) {
      refocus(blockId, 'start')

      return
    }

    applyPatches([
      {
        type: 'block.move',
        blockId: createBlockId(blockId),
        parentId: createBlockId(parentItem.parentId),
        index: parentItem.index + 1,
      },
    ])
    refocus(blockId, 'start')
  }

  const handleNavigate = (blockId: string) => (direction: 'up' | 'down') => {
    const ordered = orderedTextBlocks()
    const index = ordered.findIndex((item) => item.id === blockId)
    const neighbor = direction === 'up' ? ordered[index - 1] : ordered[index + 1]
    if (!neighbor) {
      refocus(blockId, direction === 'up' ? 'start' : 'end')

      return
    }

    refocus(neighbor.id, direction === 'up' ? 'end' : 'start')
  }

  const renderStaticBlock = (block: SduiDocumentBlock): React.ReactNode => {
    const view = <InlineContentView content={blockInlineContent(block)} />

    if (readOnly || !isTextBlock(block)) {
      return <div>{view}</div>
    }

    return (
      <div
        role="textbox"
        tabIndex={0}
        onClick={() => refocus(block.id, 'start')}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            refocus(block.id, 'start')
          }
        }}
      >
        {view}
      </div>
    )
  }

  const { dropIndicator, handleDragStart, handleDragMove, handleDragEnd, handleDragCancel } = useNestedBlockDragDrop({
    docRef,
    indentWidth: DRAG_INDENT_WIDTH,
    applyPatches,
    onDragStart: () => {
      // Editing/selection state must not survive a drag: unmount commits the PM editor.
      setFocus(null)
      setSelection(clearBlockSelection())
    },
  })

  const handleEscapeFromEditor = (blockId: string) => () => {
    selectBlocks(createBlockSelection(blockId))
  }

  const handleHandleClick = (blockId: string, shiftKey: boolean) => {
    if (shiftKey && selection.anchorId) {
      selectBlocks(extendBlockSelection(selection, docRef.current, blockId))

      return
    }

    selectBlocks(createBlockSelection(blockId))
  }

  const handleSelectionKeyDown = (event: React.KeyboardEvent) => {
    if (selection.selectedIds.length === 0) {
      return
    }

    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault()
      applyPatches(selection.selectedIds.map((id) => ({ type: 'block.delete', blockId: createBlockId(id) })))
      setSelection(clearBlockSelection())
    }

    if (event.key === 'Escape') {
      setSelection(clearBlockSelection())
    }
  }

  const renderBlock = (block: SduiDocumentBlock, depth: number): React.ReactNode => {
    const isFocused = !readOnly && focus?.blockId === block.id && isTextBlock(block)

    return (
      <BlockRow
        key={block.id}
        block={block}
        depth={depth}
        readOnly={readOnly}
        isSelected={selection.selectedIds.includes(block.id)}
        dropIndicator={dropIndicator}
        onHandleClick={handleHandleClick}
        nested={block.children?.map((child) => renderBlock(child, depth + 1))}
      >
        {isFocused ? (
          <FocusedBlockEditor
            key={focus.session}
            content={blockInlineContent(block)}
            autoFocus={focus.caret}
            onCommit={handleCommit(block.id)}
            onSplit={handleSplit(block.id)}
            onMergeBackward={handleMergeBackward(block.id)}
            onIndent={handleIndent(block.id)}
            onOutdent={handleOutdent(block.id)}
            onNavigate={handleNavigate(block.id)}
            onTurnInto={(type, attrs) => onTurnInto?.(block.id, type, attrs)}
            onEscape={handleEscapeFromEditor(block.id)}
          />
        ) : (
          renderStaticBlock(block)
        )}
      </BlockRow>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
      <div
        ref={containerRef}
        className={className}
        data-sdui-document-editor
        role="tree"
        tabIndex={-1}
        onKeyDown={handleSelectionKeyDown}
        style={{ outline: 'none' }}
      >
        {doc.root.children?.map((child) => renderBlock(child, 1))}
      </div>
    </DndContext>
  )
}
