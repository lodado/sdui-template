import { findBlockById } from '../blocks';
import { BlockNotFoundError, InvalidBlockMoveError } from '../blocks/errors';
import type { SduiDocumentBlock, SduiDocumentContent, SduiDocumentPatch } from '../schema';

export type FlattenedDocumentBlock = {
  id: string;
  parentId?: string;
  depth: number;
  index: number;
};

export type NestedBlockDropPosition = 'before' | 'inside' | 'after';

export type CreateNestedBlockMovePatchInput = {
  content: SduiDocumentContent;
  activeId: string;
  overId: string;
  position: NestedBlockDropPosition;
};

export type IsBlockDragDisabledInput = {
  blockId: string;
  rootId: string;
  dragDropEnabled?: boolean;
};

function flattenBlock(
  block: SduiDocumentBlock,
  parentId: string | undefined,
  depth: number,
  index: number
): FlattenedDocumentBlock[] {
  const current = { id: block.id, parentId, depth, index };
  const children = (block.children ?? []).reduce<FlattenedDocumentBlock[]>(
    (flattenedChildren, child, childIndex) => [
      ...flattenedChildren,
      ...flattenBlock(child, block.id, depth + 1, childIndex),
    ],
    []
  );

  return [current, ...children];
}

export function flattenDocumentBlocks(content: SduiDocumentContent): FlattenedDocumentBlock[] {
  return flattenBlock(content.root, undefined, 0, 0);
}

function childCount(block?: SduiDocumentBlock): number {
  return block?.children?.length ?? 0;
}

export function isBlockDragDisabled(input: IsBlockDragDisabledInput): boolean {
  return input.dragDropEnabled === false || input.blockId === input.rootId;
}

export function createNestedBlockMovePatch(
  input: CreateNestedBlockMovePatchInput
): Extract<SduiDocumentPatch, { type: 'block.move' }> {
  const { content, activeId, overId, position } = input;

  if (activeId === content.root.id) {
    throw new InvalidBlockMoveError('Root block cannot be dragged');
  }

  const flattened = flattenDocumentBlocks(content);
  const active = flattened.find((block) => block.id === activeId);
  const over = flattened.find((block) => block.id === overId);
  const overBlock = findBlockById(content, overId);

  if (!active) {
    throw new BlockNotFoundError(activeId);
  }

  if (!over || !overBlock) {
    throw new BlockNotFoundError(overId);
  }

  if (position === 'inside') {
    return {
      type: 'block.move',
      blockId: activeId,
      parentId: overId,
      index: childCount(overBlock),
    };
  }

  if (!over.parentId) {
    throw new InvalidBlockMoveError('Cannot drop beside the root block');
  }

  const sameParent = active.parentId === over.parentId;
  const sourceWasBeforeTarget = sameParent && active.index < over.index;
  const baseIndex = position === 'before' ? over.index : over.index + 1;

  return {
    type: 'block.move',
    blockId: activeId,
    parentId: over.parentId,
    index: sourceWasBeforeTarget ? baseIndex - 1 : baseIndex,
  };
}
