import { ensureFractionalContent, siblingAnchorsForBlock } from '../../ordering'
import type { SduiDocument, SduiDocumentContent, SduiDocumentPatch } from '../schema'
import { createDocumentBlock } from '../schema'
import { BlockNotFoundError } from './errors'
import { applyDocumentPatch, type ApplyDocumentPatchResult } from './patch/apply'
import { findBlockById, findParent } from './patch/traverse'

export { applyDocumentPatch, applyDocumentPatches, type ApplyDocumentPatchResult } from './patch/apply'
export { type BlockInlineState, getBlockInline, toInlineStatePatch } from './patch/inlineState'
export { findBlockById } from './patch/traverse'

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
