import { inlineContentToPlainText, mergeInlineContent, splitInlineContent } from '../../content/inlineContent'
import { generatePositionBetween, generatePositions, resolvePositionBounds, sortBlocksByPosition } from '../../ordering'
import type { SduiDocumentBlock, SduiDocumentContent, SduiInlineContent } from '../schema'
import { createDocumentBlock } from '../schema'
import type { BlockOrigin } from '../schema/block'
import type { BlockPlacementAnchor } from '../schema/patch'
import {
  BlockNotFoundError,
  DuplicateBlockIdError,
  InvalidBlockMergeError,
  InvalidBlockMoveError,
  InvalidBlockSplitError,
  InvalidBlockTypeChangeError,
  ParentBlockNotFoundError,
  RootBlockCannotBeDeletedError,
} from './errors'
import { getBlockInline, stripUndefinedKeys, toInlineStatePatch } from './inlineState'
import { collectBlockIds, findBlock, findBlockById, findParent } from './traverse'

export function insertBlockAtAnchor(
  content: SduiDocumentContent,
  parentId: string,
  block: SduiDocumentBlock,
  anchor: BlockPlacementAnchor,
  origin?: BlockOrigin,
): void {
  const parent = findBlockById(content, parentId)
  if (!parent) {
    throw new ParentBlockNotFoundError(parentId)
  }

  const existingIds = new Set<string>()
  collectBlockIds(content.root, existingIds)

  const incomingIds = new Set<string>()
  collectBlockIds(block, incomingIds)

  const duplicate = Array.from(incomingIds).find((id) => existingIds.has(id))
  if (duplicate !== undefined) {
    throw new DuplicateBlockIdError(duplicate)
  }

  const bounds = resolvePositionBounds(parent, anchor)
  const position = generatePositionBetween(bounds.afterKey, bounds.beforeKey)
  const resolvedOrigin = origin ?? block.origin

  const inserted = createDocumentBlock({
    ...block,
    position,
    ...(resolvedOrigin ? { origin: resolvedOrigin } : {}),
  })

  parent.children = sortBlocksByPosition([...(parent.children ?? []), inserted])
}

export function updateBlock(
  content: SduiDocumentContent,
  blockId: string,
  state?: Record<string, unknown>,
  attributes?: Record<string, unknown>,
): void {
  const block = findBlockById(content, blockId)
  if (!block) {
    throw new BlockNotFoundError(blockId)
  }

  // Merging an explicit `undefined` value deletes the key; an empty result
  // normalizes to an absent object. Keeps update patches exactly invertible.
  if (state) {
    const merged = { ...(block.state ?? {}), ...state }
    // `text` is a derived cache of `content` (see inlineState policy). When the
    // merge lands in content mode, re-derive `text` so a patch that sets
    // `content` alone — or an incoming stale `text` — can never desync the cache.
    if (Array.isArray(merged.content)) {
      merged.text = inlineContentToPlainText(merged.content as SduiInlineContent)
    }
    block.state = stripUndefinedKeys(merged)
  }

  if (attributes) {
    block.attributes = stripUndefinedKeys({ ...(block.attributes ?? {}), ...attributes })
  }
}

export function deleteBlock(content: SduiDocumentContent, blockId: string): void {
  if (content.root.id === blockId) {
    throw new RootBlockCannotBeDeletedError()
  }

  const found = findParent(content.root, blockId)
  if (!found) {
    throw new BlockNotFoundError(blockId)
  }

  found.parent.children = sortBlocksByPosition(found.parent.children?.filter((child) => child.id !== blockId) ?? [])
}

export function moveBlockAtAnchor(
  content: SduiDocumentContent,
  blockId: string,
  parentId: string,
  anchor: BlockPlacementAnchor,
  origin?: BlockOrigin,
): void {
  if (blockId === content.root.id || blockId === parentId) {
    throw new InvalidBlockMoveError('Cannot move a block below itself')
  }

  const movingBlock = findBlockById(content, blockId)
  if (!movingBlock) {
    throw new BlockNotFoundError(blockId)
  }

  if (findBlock(movingBlock, parentId)) {
    throw new InvalidBlockMoveError('Cannot move a block below its descendant')
  }

  const found = findParent(content.root, blockId)
  if (!found) {
    throw new BlockNotFoundError(blockId)
  }

  found.parent.children = sortBlocksByPosition(found.parent.children?.filter((child) => child.id !== blockId) ?? [])

  insertBlockAtAnchor(content, parentId, movingBlock, anchor, origin ?? movingBlock.origin)
}

export function splitBlock(content: SduiDocumentContent, blockId: string, offset: number, newBlockId: string): void {
  if (content.root.id === blockId) {
    throw new InvalidBlockSplitError('Root block cannot be split')
  }

  const block = findBlockById(content, blockId)
  if (!block) {
    throw new BlockNotFoundError(blockId)
  }

  const found = findParent(content.root, blockId)
  if (!found) {
    throw new BlockNotFoundError(blockId)
  }

  const inline = getBlockInline(block)
  const [left, right] = splitInlineContent(inline.content, offset)

  const newBlock: SduiDocumentBlock = {
    id: newBlockId as SduiDocumentBlock['id'],
    type: block.type,
    ...(block.attributes ? { attributes: { ...block.attributes } } : {}),
    ...(inline.mode === 'empty' ? {} : { state: toInlineStatePatch(inline.mode, right) }),
  }

  insertBlockAtAnchor(content, found.parent.id, newBlock, { after: blockId })

  if (inline.mode !== 'empty') {
    block.state = { ...(block.state ?? {}), ...toInlineStatePatch(inline.mode, left) }
  }
}

export function mergeBlock(content: SduiDocumentContent, blockId: string, intoBlockId: string): void {
  if (blockId === intoBlockId) {
    throw new InvalidBlockMergeError('Cannot merge a block into itself')
  }

  if (content.root.id === blockId) {
    throw new InvalidBlockMergeError('Root block cannot be merged')
  }

  const block = findBlockById(content, blockId)
  if (!block) {
    throw new BlockNotFoundError(blockId)
  }

  const intoBlock = findBlockById(content, intoBlockId)
  if (!intoBlock) {
    throw new BlockNotFoundError(intoBlockId)
  }

  if (findBlock(block, intoBlockId)) {
    throw new InvalidBlockMergeError('Cannot merge a block into its own descendant')
  }

  const blockInline = getBlockInline(block)
  const intoInline = getBlockInline(intoBlock)

  if (!(blockInline.mode === 'empty' && intoInline.mode === 'empty')) {
    const resultMode = blockInline.mode === 'content' || intoInline.mode === 'content' ? 'content' : 'text'
    const merged = mergeInlineContent(intoInline.content, blockInline.content)
    intoBlock.state = { ...(intoBlock.state ?? {}), ...toInlineStatePatch(resultMode, merged) }
  }

  const found = findParent(content.root, blockId)
  if (!found) {
    throw new BlockNotFoundError(blockId)
  }

  const siblings = sortBlocksByPosition(found.parent.children ?? [])
  const mergeIndex = siblings.findIndex((child) => child.id === blockId)
  const prevSibling = mergeIndex > 0 ? siblings[mergeIndex - 1] : undefined
  const nextSibling = mergeIndex < siblings.length - 1 ? siblings[mergeIndex + 1] : undefined
  const promotedChildren = sortBlocksByPosition(block.children ?? [])
  const positions = generatePositions(
    prevSibling?.position ?? null,
    nextSibling?.position ?? null,
    promotedChildren.length,
  )
  const repositioned = promotedChildren.map((child, index) => ({
    ...child,
    position: positions[index],
  }))
  found.parent.children = sortBlocksByPosition([
    ...siblings.slice(0, mergeIndex),
    ...repositioned,
    ...siblings.slice(mergeIndex + 1),
  ])
}

export function setBlockType(
  content: SduiDocumentContent,
  blockId: string,
  blockType: SduiDocumentBlock['type'],
  attributes?: Record<string, unknown>,
): void {
  if (content.root.id === blockId) {
    throw new InvalidBlockTypeChangeError('Root block type cannot change')
  }

  const block = findBlockById(content, blockId)
  if (!block) {
    throw new BlockNotFoundError(blockId)
  }

  block.type = blockType

  // Whole-object replace, not merge — see the patch schema contract.
  const nextAttributes = attributes ? stripUndefinedKeys(attributes) : undefined
  if (nextAttributes) {
    block.attributes = nextAttributes
  } else {
    delete block.attributes
  }
}
