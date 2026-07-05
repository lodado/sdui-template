/**
 * Block patch engine — barrel.
 *
 * The implementation lives in `./patch/*` (one concern per file); this module
 * preserves the original import surface so existing consumers stay unchanged.
 */
export { applyDocumentPatch, applyDocumentPatches, type ApplyDocumentPatchResult } from './patch/apply'
export {
  applyPatchesToDocument,
  applyPatchesToDocumentWithInverse,
  applyPatchToDocument,
  type ApplyPatchToDocumentResult,
  applyPatchToDocumentWithInverse,
} from './patch/document'
export { type BlockInlineState, getBlockInline, toInlineStatePatch } from './patch/inlineState'
export { applyDocumentPatchesWithInverse, applyDocumentPatchWithInverse } from './patch/inverse'
export { findBlockById } from './patch/traverse'
