import type { AnchorPositionHints } from '../../ordering'
import { ensureFractionalContent } from '../../ordering'
import type { SduiDocumentContent, SduiDocumentPatch } from '../schema'
import { assertNever } from '../schema'
import {
  deleteBlock,
  insertBlockAtAnchor,
  mergeBlock,
  moveBlockAtAnchor,
  setBlockType,
  splitBlock,
  updateBlock,
} from './operations'
import { createPatchWriteScope } from './writeScope'

export type PatchApplyOptions = {
  /**
   * What to do when an insert/move anchor (and every fallback) is dead:
   * - `append` (default) — place at parent tail and report it as degraded
   * - `throw` — throw `StaleAnchorError`; collaboration rebase turns this
   *   into a dropped envelope instead of committing a wrong order
   */
  onAnchorMiss?: 'append' | 'throw'
  /** Rebase-scoped tombstones: deleted block id → its old position. */
  positionHints?: AnchorPositionHints
}

/** An insert/move that lost its position and fell to the parent tail. */
export type AnchorDegradeReport = {
  patchIndex: number
  blockId: string
  parentId: string
}

type SinglePatchResult = {
  content: SduiDocumentContent
  degraded: Array<Omit<AnchorDegradeReport, 'patchIndex'>>
}

/** Single-patch apply that also surfaces degraded anchor placements. */
export function applyDocumentPatchCollect(
  content: SduiDocumentContent,
  patch: SduiDocumentPatch,
  options?: PatchApplyOptions,
): SinglePatchResult {
  const scope = createPatchWriteScope(ensureFractionalContent(content), options)

  switch (patch.type) {
    case 'block.insert':
      insertBlockAtAnchor(
        scope,
        patch.parentId,
        patch.block,
        {
          after: patch.after,
          before: patch.before,
          fallbackAfter: patch.fallbackAfter,
          fallbackBefore: patch.fallbackBefore,
        },
        patch.origin,
      )
      break
    case 'block.update':
      updateBlock(scope, patch.blockId, patch.state, patch.attributes)
      break
    case 'block.delete':
      deleteBlock(scope, patch.blockId)
      break
    case 'block.move':
      moveBlockAtAnchor(
        scope,
        patch.blockId,
        patch.parentId,
        {
          after: patch.after,
          before: patch.before,
          fallbackAfter: patch.fallbackAfter,
          fallbackBefore: patch.fallbackBefore,
        },
        patch.origin,
      )
      break
    case 'block.split':
      splitBlock(scope, patch.blockId, patch.offset, patch.newBlockId)
      break
    case 'block.merge':
      mergeBlock(scope, patch.blockId, patch.intoBlockId)
      break
    case 'block.setType':
      setBlockType(scope, patch.blockId, patch.blockType, patch.attributes)
      break
    case 'document.setTitle':
      // Title lives on the document, not the content tree. Collaboration replays
      // mixed batches (title + block edits) through this content-level pipeline,
      // so setTitle is an intentional no-op here — applyPatchToDocument owns it.
      break
    default:
      return assertNever(patch, 'applyDocumentPatch')
  }

  return { content: scope.content(), degraded: scope.degradedAnchors() }
}

export function applyDocumentPatch(
  content: SduiDocumentContent,
  patch: SduiDocumentPatch,
  options?: PatchApplyOptions,
): SduiDocumentContent {
  return applyDocumentPatchCollect(content, patch, options).content
}

export function applyDocumentPatches(content: SduiDocumentContent, patches: SduiDocumentPatch[]): SduiDocumentContent {
  return patches.reduce((next, patch) => applyDocumentPatch(next, patch), content)
}

export type ApplyDocumentPatchesReport = {
  content: SduiDocumentContent
  degraded: AnchorDegradeReport[]
}

/**
 * Applies patches and reports every insert/move whose anchor was unrecoverable
 * (fell to the parent tail). Callers must surface `degraded` to the user —
 * a silently wrong order is worse than a visible warning.
 */
export function applyDocumentPatchesWithReport(
  content: SduiDocumentContent,
  patches: SduiDocumentPatch[],
  options?: PatchApplyOptions,
): ApplyDocumentPatchesReport {
  return patches.reduce<ApplyDocumentPatchesReport>(
    (acc, patch, patchIndex) => {
      const result = applyDocumentPatchCollect(acc.content, patch, options)

      return {
        content: result.content,
        degraded: [...acc.degraded, ...result.degraded.map((report) => ({ ...report, patchIndex }))],
      }
    },
    { content, degraded: [] },
  )
}

export type ApplyDocumentPatchResult = {
  content: SduiDocumentContent
  /** Patches that undo the applied patch when applied in array order. */
  inverse: SduiDocumentPatch[]
  /** Anchors that fell to the parent tail during apply. */
  degraded: AnchorDegradeReport[]
}
