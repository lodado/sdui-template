/**
 * Block patch engine — barrel.
 *
 * The implementation lives in `./patch/*` (one concern per file); this module
 * preserves the original import surface so existing consumers stay unchanged.
 */
export { findBlockById } from '../traverse'
export {
  type AnchorDegradeReport,
  applyDocumentPatch,
  applyDocumentPatches,
  type ApplyDocumentPatchesReport,
  applyDocumentPatchesWithReport,
  type ApplyDocumentPatchResult,
  type PatchApplyOptions,
} from './apply'
export {
  applyPatchesToDocument,
  applyPatchesToDocumentWithInverse,
  applyPatchToDocument,
  type ApplyPatchToDocumentResult,
  applyPatchToDocumentWithInverse,
} from './document'
export { type BlockInlineState, getBlockInline, toInlineStatePatch } from './inlineState'
export { applyDocumentPatchesWithInverse, applyDocumentPatchWithInverse } from './inverse'
