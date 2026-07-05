import {
  getInlineContentLength,
  inlineContentToPlainText,
  mergeInlineContent,
  splitInlineContent,
  textToInlineContent,
} from '../../content/inlineContent'
import {
  ensureFractionalContent,
  generatePositionBetween,
  generatePositions,
  resolvePositionBounds,
  siblingAnchorsForBlock,
  sortBlocksByPosition,
} from '../../ordering'
import type {
  SduiDocument,
  SduiDocumentBlock,
  SduiDocumentContent,
  SduiDocumentPatch,
  SduiInlineContent,
} from '../schema'
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
import { getBlockInline, stripUndefinedKeys, toInlineStatePatch } from './patch/inlineState'
import { cloneTouchedPaths, touchedBlockIds } from './patch/structuralSharing'
import { collectBlockIds, findBlock, findBlockById, findParent } from './patch/traverse'

export { type BlockInlineState,getBlockInline, toInlineStatePatch } from './patch/inlineState'
export { findBlockById } from './patch/traverse'

function insertBlockAtAnchor(
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

function updateBlock(
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
    block.state = stripUndefinedKeys({ ...(block.state ?? {}), ...state })
  }

  if (attributes) {
    block.attributes = stripUndefinedKeys({ ...(block.attributes ?? {}), ...attributes })
  }
}

function deleteBlock(content: SduiDocumentContent, blockId: string): void {
  if (content.root.id === blockId) {
    throw new RootBlockCannotBeDeletedError()
  }

  const found = findParent(content.root, blockId)
  if (!found) {
    throw new BlockNotFoundError(blockId)
  }

  found.parent.children = sortBlocksByPosition(found.parent.children?.filter((child) => child.id !== blockId) ?? [])
}

function moveBlockAtAnchor(
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

function splitBlock(content: SduiDocumentContent, blockId: string, offset: number, newBlockId: string): void {
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

function mergeBlock(content: SduiDocumentContent, blockId: string, intoBlockId: string): void {
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

function setBlockType(
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

export function applyDocumentPatch(content: SduiDocumentContent, patch: SduiDocumentPatch): SduiDocumentContent {
  const migrated = ensureFractionalContent(content)
  const next = cloneTouchedPaths(migrated, touchedBlockIds(patch))

  switch (patch.type) {
    case 'block.insert':
      insertBlockAtAnchor(
        next,
        patch.parentId,
        patch.block,
        { after: patch.after, before: patch.before, fallbackAfter: patch.fallbackAfter },
        patch.origin,
      )
      return next
    case 'block.update':
      updateBlock(next, patch.blockId, patch.state, patch.attributes)
      return next
    case 'block.delete':
      deleteBlock(next, patch.blockId)
      return next
    case 'block.move':
      moveBlockAtAnchor(
        next,
        patch.blockId,
        patch.parentId,
        { after: patch.after, before: patch.before, fallbackAfter: patch.fallbackAfter },
        patch.origin,
      )
      return next
    case 'block.split':
      splitBlock(next, patch.blockId, patch.offset, patch.newBlockId)
      return next
    case 'block.merge':
      mergeBlock(next, patch.blockId, patch.intoBlockId)
      return next
    case 'block.setType':
      setBlockType(next, patch.blockId, patch.blockType, patch.attributes)
      return next
    default:
      return next
  }
}

export function applyDocumentPatches(content: SduiDocumentContent, patches: SduiDocumentPatch[]): SduiDocumentContent {
  return patches.reduce(applyDocumentPatch, content)
}

export type ApplyDocumentPatchResult = {
  content: SduiDocumentContent
  /** Patches that undo the applied patch when applied in array order. */
  inverse: SduiDocumentPatch[]
}

function previousValuesOf(
  current: Record<string, unknown> | undefined,
  touched: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  if (!touched) {
    return undefined
  }

  return Object.keys(touched).reduce<Record<string, unknown>>(
    (previous, key) => ({ ...previous, [key]: current?.[key] }),
    {},
  )
}

function computeInverse(content: SduiDocumentContent, patch: SduiDocumentPatch): SduiDocumentPatch[] {
  switch (patch.type) {
    case 'block.insert':
      return [{ type: 'block.delete', blockId: patch.block.id }]

    case 'block.delete': {
      const found = findParent(content.root, patch.blockId)
      const block = findBlockById(content, patch.blockId)
      if (!found || !block) {
        throw new BlockNotFoundError(patch.blockId)
      }

      const { after } = siblingAnchorsForBlock(found.parent, patch.blockId)

      return [
        {
          type: 'block.insert',
          parentId: found.parent.id,
          after,
          block: createDocumentBlock(block),
        },
      ]
    }

    case 'block.update': {
      const block = findBlockById(content, patch.blockId)
      if (!block) {
        throw new BlockNotFoundError(patch.blockId)
      }

      return [
        {
          type: 'block.update',
          blockId: patch.blockId,
          state: previousValuesOf(block.state, patch.state),
          attributes: previousValuesOf(block.attributes, patch.attributes),
        },
      ]
    }

    case 'block.move': {
      const found = findParent(content.root, patch.blockId)
      if (!found) {
        throw new BlockNotFoundError(patch.blockId)
      }

      const { after, before } = siblingAnchorsForBlock(found.parent, patch.blockId)

      return [
        {
          type: 'block.move',
          blockId: patch.blockId,
          parentId: found.parent.id,
          after,
          before,
        },
      ]
    }

    case 'block.split':
      return [{ type: 'block.merge', blockId: patch.newBlockId, intoBlockId: patch.blockId }]

    case 'block.merge': {
      const block = findBlockById(content, patch.blockId)
      const intoBlock = findBlockById(content, patch.intoBlockId)
      const found = findParent(content.root, patch.blockId)
      if (!block || !found) {
        throw new BlockNotFoundError(patch.blockId)
      }

      if (!intoBlock) {
        throw new BlockNotFoundError(patch.intoBlockId)
      }

      // Restore the merge target's inline state, drop the promoted children,
      // then re-insert the full pre-merge snapshot (children included).
      const intoState = intoBlock.state
      return [
        {
          type: 'block.update',
          blockId: patch.intoBlockId,
          state: { content: intoState?.content, text: intoState?.text },
        },
        ...(block.children ?? []).map((child): SduiDocumentPatch => ({ type: 'block.delete', blockId: child.id })),
        {
          type: 'block.insert',
          parentId: found.parent.id,
          after: siblingAnchorsForBlock(found.parent, patch.blockId).after,
          block: createDocumentBlock(block),
        },
      ]
    }

    case 'block.setType': {
      const block = findBlockById(content, patch.blockId)
      if (!block) {
        throw new BlockNotFoundError(patch.blockId)
      }

      return [
        {
          type: 'block.setType',
          blockId: patch.blockId,
          blockType: block.type,
          ...(block.attributes ? { attributes: { ...block.attributes } } : {}),
        },
      ]
    }

    case 'document.setTitle':
      return []

    default:
      return []
  }
}

/**
 * Applies a patch and returns the inverse patches that undo it.
 *
 * @returns next content plus `inverse`, to be applied in array order for undo
 *
 * Policies:
 * - the inverse is computed against the pre-patch content (snapshot semantics)
 * - inverse of a patch sequence is each patch's inverse in reverse order
 */
export function applyDocumentPatchWithInverse(
  content: SduiDocumentContent,
  patch: SduiDocumentPatch,
): ApplyDocumentPatchResult {
  const migrated = ensureFractionalContent(content)
  const inverse = computeInverse(migrated, patch)

  return { content: applyDocumentPatch(migrated, patch), inverse }
}

export function applyDocumentPatchesWithInverse(
  content: SduiDocumentContent,
  patches: SduiDocumentPatch[],
): ApplyDocumentPatchResult {
  return patches.reduce<ApplyDocumentPatchResult>(
    (acc, patch) => {
      const result = applyDocumentPatchWithInverse(acc.content, patch)

      return { content: result.content, inverse: [...result.inverse, ...acc.inverse] }
    },
    { content, inverse: [] },
  )
}

export function applyPatchToDocument(document: SduiDocument, patch: SduiDocumentPatch): SduiDocument {
  if (patch.type === 'document.setTitle') {
    return { ...document, title: patch.title }
  }

  return {
    ...document,
    content: applyDocumentPatch(document.content, patch),
  }
}

export function applyPatchesToDocument(document: SduiDocument, patches: SduiDocumentPatch[]): SduiDocument {
  return patches.reduce(applyPatchToDocument, document)
}

export type ApplyPatchToDocumentResult = {
  document: SduiDocument
  inverse: SduiDocumentPatch[]
}

export function applyPatchToDocumentWithInverse(
  document: SduiDocument,
  patch: SduiDocumentPatch,
): ApplyPatchToDocumentResult {
  if (patch.type === 'document.setTitle') {
    return {
      document: { ...document, title: patch.title },
      inverse: [{ type: 'document.setTitle', title: document.title }],
    }
  }

  const result = applyDocumentPatchWithInverse(document.content, patch)

  return { document: { ...document, content: result.content }, inverse: result.inverse }
}

/**
 * Applies a batch to the document (title + content) and returns the combined
 * inverse: each patch's inverse accumulated in reverse order, so applying
 * `inverse` in array order rolls the whole batch back — including
 * `document.setTitle`, which the content-level pipeline cannot invert.
 */
export function applyPatchesToDocumentWithInverse(
  document: SduiDocument,
  patches: SduiDocumentPatch[],
): ApplyPatchToDocumentResult {
  return patches.reduce<ApplyPatchToDocumentResult>(
    (acc, patch) => {
      const result = applyPatchToDocumentWithInverse(acc.document, patch)

      return { document: result.document, inverse: [...result.inverse, ...acc.inverse] }
    },
    { document, inverse: [] },
  )
}
