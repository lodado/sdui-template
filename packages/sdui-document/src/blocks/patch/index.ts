// Curated public surface of the block patch engine. Leaf files are re-exported
// by name (not `export *`) so a new export in a leaf does not silently become
// public API. Engine internals — operations, writeScope, apply/inverse bodies,
// traverse, inlineState — are intentionally absent; only the entry points below
// are public. `blockGuards`, `blockPatch`, and `errors` are themselves curated
// barrels (named / one-class-per-file), so `export *` from them leaks nothing.
export * from './blockGuards'
export * from './blockPatch'
export {
  createColumnResizePatches,
  type CreateColumnResizePatchesInput,
  MIN_COLUMN_RATIO,
  resizeColumnPair,
  type ResizeColumnPairInput,
  type ResizedColumnPair,
} from './columnResize'
export * from './errors'
// deriveUniqueBlockId stays internal (imported directly by blocks/drag).
export { normalizeColumnStructure } from './columnStructure'
export {
  createDocumentHistory,
  createHistory,
  DEFAULT_HISTORY_DEPTH,
  type DocumentHistory,
  type DocumentHistoryEntry,
  type History,
  type HistoryEntry,
  type HistoryStepResult,
  recordHistoryEntry,
  redoHistory,
  undoHistory,
} from './documentHistory'
export { anchorAfterBlock, anchorAppendToParent, anchorBeforeBlock, anchorPrependToParent } from './patchAnchors'
// createEmptyParagraphBlock stays internal.
export { createTrailingBlockPatch, isEmptyDocument, requiresTrailingBlock, withTrailingBlock } from './trailingBlock'
