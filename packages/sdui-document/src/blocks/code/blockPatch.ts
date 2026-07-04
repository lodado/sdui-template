import {
  getInlineContentLength,
  inlineContentToPlainText,
  mergeInlineContent,
  splitInlineContent,
  textToInlineContent,
} from '../../content/inlineContent'
import type {
  SduiDocument,
  SduiDocumentBlock,
  SduiDocumentContent,
  SduiDocumentPatch,
  SduiInlineContent,
} from '../schema'
import { createDocumentBlock } from '../schema'
import {
  BlockNotFoundError,
  DuplicateBlockIdError,
  InvalidBlockMergeError,
  InvalidBlockMoveError,
  InvalidBlockSplitError,
  ParentBlockNotFoundError,
  RootBlockCannotBeDeletedError,
} from './errors'

function clampIndex(index: number, length: number): number {
  if (index < 0) {
    return 0
  }

  if (index > length) {
    return length
  }

  return index
}

function cloneContent(content: SduiDocumentContent): SduiDocumentContent {
  return {
    ...content,
    root: createDocumentBlock(content.root),
  }
}

function collectBlockIds(block: SduiDocumentBlock, ids: Set<string>): void {
  ids.add(block.id)
  block.children?.forEach((child) => collectBlockIds(child, ids))
}

function findBlock(block: SduiDocumentBlock, blockId: string): SduiDocumentBlock | undefined {
  if (block.id === blockId) {
    return block
  }

  return (block.children ?? [])
    .map((child) => findBlock(child, blockId))
    .find((found): found is SduiDocumentBlock => Boolean(found))
}

function findParent(
  block: SduiDocumentBlock,
  blockId: string,
): { parent: SduiDocumentBlock; index: number } | undefined {
  const childIndex = block.children?.findIndex((child) => child.id === blockId) ?? -1
  if (childIndex >= 0) {
    return { parent: block, index: childIndex }
  }

  return (block.children ?? [])
    .map((child) => findParent(child, blockId))
    .find((found): found is { parent: SduiDocumentBlock; index: number } => Boolean(found))
}

export function findBlockById(content: SduiDocumentContent, blockId: string): SduiDocumentBlock | undefined {
  return findBlock(content.root, blockId)
}

/**
 * Inline representation of a block's text state.
 *
 * Policies:
 * - `content` mode: `state.content` is the rich source of truth, `state.text` is derived
 * - `text` mode: `state.text` plain string only, no `state.content` is introduced by the engine
 * - `empty` mode: block carries no inline text (offset 0 is the only valid split point)
 */
type BlockInlineState = {
  mode: 'content' | 'text' | 'empty'
  content: SduiInlineContent
}

function getBlockInline(block: SduiDocumentBlock): BlockInlineState {
  const stateContent = block.state?.content
  if (Array.isArray(stateContent)) {
    return { mode: 'content', content: stateContent as SduiInlineContent }
  }

  const stateText = block.state?.text
  if (typeof stateText === 'string') {
    return { mode: 'text', content: textToInlineContent(stateText) }
  }

  return { mode: 'empty', content: [] }
}

function toInlineStatePatch(mode: BlockInlineState['mode'], content: SduiInlineContent): Record<string, unknown> {
  if (mode === 'content') {
    return { content, text: inlineContentToPlainText(content) }
  }

  return { text: inlineContentToPlainText(content) }
}

function stripUndefinedKeys(record: Record<string, unknown>): Record<string, unknown> | undefined {
  const entries = Object.entries(record).filter(([, value]) => value !== undefined)
  if (entries.length === 0) {
    return undefined
  }

  return entries.reduce<Record<string, unknown>>((result, [key, value]) => ({ ...result, [key]: value }), {})
}

function insertBlock(content: SduiDocumentContent, parentId: string, index: number, block: SduiDocumentBlock): void {
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

  const children = [...(parent.children ?? [])]
  children.splice(clampIndex(index, children.length), 0, createDocumentBlock(block))
  parent.children = children
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

  found.parent.children = found.parent.children?.filter((child) => child.id !== blockId)
}

function moveBlock(content: SduiDocumentContent, blockId: string, parentId: string, index: number): void {
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

  found.parent.children = found.parent.children?.filter((child) => child.id !== blockId)
  insertBlock(content, parentId, index, movingBlock)
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

  insertBlock(content, found.parent.id, found.index + 1, newBlock)

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

  const siblings = found.parent.children ?? []
  found.parent.children = [
    ...siblings.slice(0, found.index),
    ...(block.children ?? []),
    ...siblings.slice(found.index + 1),
  ]
}

export function applyDocumentPatch(content: SduiDocumentContent, patch: SduiDocumentPatch): SduiDocumentContent {
  const next = cloneContent(content)

  switch (patch.type) {
    case 'block.insert':
      insertBlock(next, patch.parentId, patch.index, patch.block)
      return next
    case 'block.update':
      updateBlock(next, patch.blockId, patch.state, patch.attributes)
      return next
    case 'block.delete':
      deleteBlock(next, patch.blockId)
      return next
    case 'block.move':
      moveBlock(next, patch.blockId, patch.parentId, patch.index)
      return next
    case 'block.split':
      splitBlock(next, patch.blockId, patch.offset, patch.newBlockId)
      return next
    case 'block.merge':
      mergeBlock(next, patch.blockId, patch.intoBlockId)
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

      return [
        {
          type: 'block.insert',
          parentId: found.parent.id,
          index: found.index,
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

      return [
        {
          type: 'block.move',
          blockId: patch.blockId,
          parentId: found.parent.id,
          index: found.index,
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
          index: found.index,
          block: createDocumentBlock(block),
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
  const inverse = computeInverse(content, patch)

  return { content: applyDocumentPatch(content, patch), inverse }
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
