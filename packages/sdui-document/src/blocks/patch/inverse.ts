import { ensureFractionalContent, siblingAnchorsForBlock } from '../../ordering'
import type { SduiDocumentContent, SduiDocumentPatch } from '../schema'
import { assertNever, createDocumentBlock } from '../schema'
import { findBlockById, findParent } from '../traverse'
import { applyDocumentPatch, type ApplyDocumentPatchResult } from './apply'
import { BlockNotFoundError } from './errors'

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

export function computeInverse(content: SduiDocumentContent, patch: SduiDocumentPatch): SduiDocumentPatch[] {
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
      // Content-level inverse is empty; the title's inverse is produced by
      // applyPatchToDocumentWithInverse at the document layer.
      return []

    default:
      return assertNever(patch, 'computeInverse')
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
