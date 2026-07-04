import { findBlockById } from '../code'
import { BlockNotFoundError, InvalidBlockMoveError } from '../code/errors'
import type { SduiDocumentBlock, SduiDocumentContent, SduiDocumentPatch } from '../schema'
import { createBlockId } from '../schema/ids'
import { sortBlocksByPosition } from '../../ordering'

export type FlattenedDocumentBlock = {
  id: string
  parentId?: string
  depth: number
  index: number
}

export type NestedBlockDropPosition = 'before' | 'inside' | 'after'

export type CreateNestedBlockMovePatchInput = {
  content: SduiDocumentContent
  activeId: string
  overId: string
  position: NestedBlockDropPosition
}

export type IsBlockDragDisabledInput = {
  blockId: string
  rootId: string
  dragDropEnabled?: boolean
}

function flattenBlock(block: SduiDocumentBlock, parentId: string | undefined, depth: number): FlattenedDocumentBlock[] {
  const sortedChildren = sortBlocksByPosition(block.children ?? [])
  const childEntries = sortedChildren.flatMap((child, childIndex) => {
    const nested = flattenBlock(child, block.id, depth + 1)

    return nested.map((entry) => (entry.id === child.id ? { ...entry, index: childIndex } : entry))
  })

  return [{ id: block.id, parentId, depth, index: 0 }, ...childEntries]
}

export function flattenDocumentBlocks(content: SduiDocumentContent): FlattenedDocumentBlock[] {
  return flattenBlock(content.root, undefined, 0)
}

export function isBlockDragDisabled(input: IsBlockDragDisabledInput): boolean {
  return input.dragDropEnabled === false || input.blockId === input.rootId
}

export function createNestedBlockMovePatch(
  input: CreateNestedBlockMovePatchInput,
): Extract<SduiDocumentPatch, { type: 'block.move' }> {
  const { content, activeId, overId, position } = input

  if (activeId === content.root.id) {
    throw new InvalidBlockMoveError('Root block cannot be dragged')
  }

  const flattened = flattenDocumentBlocks(content)
  const active = flattened.find((block) => block.id === activeId)
  const over = flattened.find((block) => block.id === overId)
  const overBlock = findBlockById(content, overId)

  if (!active) {
    throw new BlockNotFoundError(activeId)
  }

  if (!over || !overBlock) {
    throw new BlockNotFoundError(overId)
  }

  if (position === 'inside') {
    return {
      type: 'block.move',
      blockId: createBlockId(activeId),
      parentId: createBlockId(overId),
      after: null,
    }
  }

  if (!over.parentId) {
    throw new InvalidBlockMoveError('Cannot drop beside the root block')
  }

  return {
    type: 'block.move',
    blockId: createBlockId(activeId),
    parentId: createBlockId(over.parentId),
    ...(position === 'before' ? { before: createBlockId(overId) } : { after: createBlockId(overId) }),
  }
}
