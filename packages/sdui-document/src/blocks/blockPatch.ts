import type { SduiDocumentBlock, SduiDocumentContent, SduiDocumentPatch } from '../schema';
import { createDocumentBlock } from '../schema';
import {
  BlockNotFoundError,
  InvalidBlockMoveError,
  ParentBlockNotFoundError,
  RootBlockCannotBeDeletedError,
} from './errors';

function clampIndex(index: number, length: number): number {
  if (index < 0) {
    return 0;
  }

  if (index > length) {
    return length;
  }

  return index;
}

function cloneContent(content: SduiDocumentContent): SduiDocumentContent {
  return {
    ...content,
    root: createDocumentBlock(content.root),
  };
}

function findBlock(block: SduiDocumentBlock, blockId: string): SduiDocumentBlock | undefined {
  if (block.id === blockId) {
    return block;
  }

  return (block.children ?? [])
    .map((child) => findBlock(child, blockId))
    .find((found): found is SduiDocumentBlock => Boolean(found));
}

function findParent(
  block: SduiDocumentBlock,
  blockId: string
): { parent: SduiDocumentBlock; index: number } | undefined {
  const childIndex = block.children?.findIndex((child) => child.id === blockId) ?? -1;
  if (childIndex >= 0) {
    return { parent: block, index: childIndex };
  }

  return (block.children ?? [])
    .map((child) => findParent(child, blockId))
    .find((found): found is { parent: SduiDocumentBlock; index: number } => Boolean(found));
}

export function findBlockById(
  content: SduiDocumentContent,
  blockId: string
): SduiDocumentBlock | undefined {
  return findBlock(content.root, blockId);
}

function insertBlock(
  content: SduiDocumentContent,
  parentId: string,
  index: number,
  block: SduiDocumentBlock
): void {
  const parent = findBlockById(content, parentId);
  if (!parent) {
    throw new ParentBlockNotFoundError(parentId);
  }

  const children = [...(parent.children ?? [])];
  children.splice(clampIndex(index, children.length), 0, createDocumentBlock(block));
  parent.children = children;
}

function updateBlock(
  content: SduiDocumentContent,
  blockId: string,
  state?: Record<string, unknown>,
  attributes?: Record<string, unknown>
): void {
  const block = findBlockById(content, blockId);
  if (!block) {
    throw new BlockNotFoundError(blockId);
  }

  if (state) {
    block.state = { ...(block.state ?? {}), ...state };
  }

  if (attributes) {
    block.attributes = { ...(block.attributes ?? {}), ...attributes };
  }
}

function deleteBlock(content: SduiDocumentContent, blockId: string): void {
  if (content.root.id === blockId) {
    throw new RootBlockCannotBeDeletedError();
  }

  const found = findParent(content.root, blockId);
  if (!found) {
    throw new BlockNotFoundError(blockId);
  }

  found.parent.children = found.parent.children?.filter((child) => child.id !== blockId);
}

function moveBlock(
  content: SduiDocumentContent,
  blockId: string,
  parentId: string,
  index: number
): void {
  if (blockId === content.root.id || blockId === parentId) {
    throw new InvalidBlockMoveError('Cannot move a block below itself');
  }

  const movingBlock = findBlockById(content, blockId);
  if (!movingBlock) {
    throw new BlockNotFoundError(blockId);
  }

  if (findBlock(movingBlock, parentId)) {
    throw new InvalidBlockMoveError('Cannot move a block below its descendant');
  }

  const found = findParent(content.root, blockId);
  if (!found) {
    throw new BlockNotFoundError(blockId);
  }

  found.parent.children = found.parent.children?.filter((child) => child.id !== blockId);
  insertBlock(content, parentId, index, movingBlock);
}

export function applyDocumentPatch(
  content: SduiDocumentContent,
  patch: SduiDocumentPatch
): SduiDocumentContent {
  const next = cloneContent(content);

  switch (patch.type) {
    case 'block.insert':
      insertBlock(next, patch.parentId, patch.index, patch.block);
      return next;
    case 'block.update':
      updateBlock(next, patch.blockId, patch.state, patch.attributes);
      return next;
    case 'block.delete':
      deleteBlock(next, patch.blockId);
      return next;
    case 'block.move':
      moveBlock(next, patch.blockId, patch.parentId, patch.index);
      return next;
    default:
      return next;
  }
}

export function applyDocumentPatches(
  content: SduiDocumentContent,
  patches: SduiDocumentPatch[]
): SduiDocumentContent {
  return patches.reduce(applyDocumentPatch, content);
}
