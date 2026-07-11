import { inlineContentToPlainText, mergeInlineContent, splitInlineContent } from '../../content/inlineContent'
import { generatePositionBetween, generatePositions, resolvePositionBounds, sortBlocksByPosition } from '../../ordering'
import type { SduiDocumentBlock, SduiInlineContent } from '../schema'
import { createDocumentBlock } from '../schema'
import type { BlockOrigin } from '../schema/block'
import type { BlockPlacementAnchor } from '../schema/patch'
import { collectBlockIds, findBlock } from '../traverse'
import {
  BlockNotFoundError,
  DuplicateBlockIdError,
  InvalidBlockMergeError,
  InvalidBlockMoveError,
  InvalidBlockSplitError,
  InvalidBlockTypeChangeError,
  ParentBlockNotFoundError,
  RootBlockCannotBeDeletedError,
  StaleAnchorError,
} from './errors'
import { getBlockInline, stripUndefinedKeys, toInlineStatePatch } from './inlineState'
import type { PatchWriteScope } from './writeScope'

export function insertBlockAtAnchor(
  scope: PatchWriteScope,
  parentId: string,
  block: SduiDocumentBlock,
  anchor: BlockPlacementAnchor,
  origin?: BlockOrigin,
): void {
  const parent = scope.writableBlock(parentId)
  if (!parent) {
    throw new ParentBlockNotFoundError(parentId)
  }

  const existingIds = new Set<string>()
  collectBlockIds(scope.root(), existingIds)

  const incomingIds = new Set<string>()
  collectBlockIds(block, incomingIds)

  const duplicate = Array.from(incomingIds).find((id) => existingIds.has(id))
  if (duplicate !== undefined) {
    throw new DuplicateBlockIdError(duplicate)
  }

  const bounds = resolvePositionBounds(parent, anchor, scope.anchorOptions.positionHints)
  if (bounds.resolution === 'degraded') {
    if (scope.anchorOptions.onAnchorMiss === 'throw') {
      throw new StaleAnchorError(block.id, parentId)
    }

    scope.reportDegradedAnchor({ blockId: block.id, parentId })
  }

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
  scope: PatchWriteScope,
  blockId: string,
  state?: Record<string, unknown>,
  attributes?: Record<string, unknown>,
): void {
  const block = scope.writableBlock(blockId)
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

export function deleteBlock(scope: PatchWriteScope, blockId: string): void {
  if (scope.rootId === blockId) {
    throw new RootBlockCannotBeDeletedError()
  }

  const found = scope.writableParentOf(blockId)
  if (!found) {
    throw new BlockNotFoundError(blockId)
  }

  found.parent.children = sortBlocksByPosition(found.parent.children?.filter((child) => child.id !== blockId) ?? [])
}

export function moveBlockAtAnchor(
  scope: PatchWriteScope,
  blockId: string,
  parentId: string,
  anchor: BlockPlacementAnchor,
  origin?: BlockOrigin,
): void {
  if (blockId === scope.rootId || blockId === parentId) {
    throw new InvalidBlockMoveError('Cannot move a block below itself')
  }

  // The moved subtree is unchanged — read it (shared) and re-parent as-is.
  const movingBlock = scope.block(blockId)
  if (!movingBlock) {
    throw new BlockNotFoundError(blockId)
  }

  if (findBlock(movingBlock, parentId)) {
    throw new InvalidBlockMoveError('Cannot move a block below its descendant')
  }

  const found = scope.writableParentOf(blockId)
  if (!found) {
    throw new BlockNotFoundError(blockId)
  }

  found.parent.children = sortBlocksByPosition(found.parent.children?.filter((child) => child.id !== blockId) ?? [])

  insertBlockAtAnchor(scope, parentId, movingBlock, anchor, origin ?? movingBlock.origin)
}

export function splitBlock(scope: PatchWriteScope, blockId: string, offset: number, newBlockId: string): void {
  if (scope.rootId === blockId) {
    throw new InvalidBlockSplitError('Root block cannot be split')
  }

  const block = scope.writableBlock(blockId)
  if (!block) {
    throw new BlockNotFoundError(blockId)
  }

  const found = scope.parentOf(blockId)
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

  insertBlockAtAnchor(scope, found.parent.id, newBlock, { after: blockId })

  if (inline.mode !== 'empty') {
    block.state = { ...(block.state ?? {}), ...toInlineStatePatch(inline.mode, left) }
  }
}

export function mergeBlock(scope: PatchWriteScope, blockId: string, intoBlockId: string): void {
  if (blockId === intoBlockId) {
    throw new InvalidBlockMergeError('Cannot merge a block into itself')
  }

  if (scope.rootId === blockId) {
    throw new InvalidBlockMergeError('Root block cannot be merged')
  }

  // Validate against the read tree before committing any write.
  const blockRead = scope.block(blockId)
  if (!blockRead) {
    throw new BlockNotFoundError(blockId)
  }

  if (!scope.block(intoBlockId)) {
    throw new BlockNotFoundError(intoBlockId)
  }

  if (findBlock(blockRead, intoBlockId)) {
    throw new InvalidBlockMergeError('Cannot merge a block into its own descendant')
  }

  // Copy every write path up front, then read the (now writable) nodes, then
  // mutate — so a later copy can never re-clone a node an earlier write touched.
  scope.ensure(intoBlockId)
  scope.ensure(blockId)
  const intoBlock = scope.block(intoBlockId)!
  const block = scope.block(blockId)!
  const found = scope.parentOf(blockId)!

  const blockInline = getBlockInline(block)
  const intoInline = getBlockInline(intoBlock)

  if (!(blockInline.mode === 'empty' && intoInline.mode === 'empty')) {
    const resultMode = blockInline.mode === 'content' || intoInline.mode === 'content' ? 'content' : 'text'
    const merged = mergeInlineContent(intoInline.content, blockInline.content)
    intoBlock.state = { ...(intoBlock.state ?? {}), ...toInlineStatePatch(resultMode, merged) }
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
  scope: PatchWriteScope,
  blockId: string,
  blockType: SduiDocumentBlock['type'],
  attributes?: Record<string, unknown>,
): void {
  if (scope.rootId === blockId) {
    throw new InvalidBlockTypeChangeError('Root block type cannot change')
  }

  const block = scope.writableBlock(blockId)
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
