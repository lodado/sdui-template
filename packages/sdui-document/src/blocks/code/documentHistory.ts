import type { SduiDocumentPatch } from '../schema'

/**
 * Two-stack document-level undo/redo over the patch engine.
 *
 * Each entry pairs both directions of one applied batch:
 * - `undo`: the inverse patches (from applyDocumentPatchesWithInverse),
 *   applied in array order to roll the batch back
 * - `redo`: the original batch, applied in array order to replay it
 *
 * Policies:
 * - recording a new entry clears the redo stack (a fresh edit forks history)
 * - applying history entries must bypass invariants that generate extra
 *   patches (e.g. the trailing-block invariant) — an entry's undo/redo pair
 *   only round-trips against the exact states it was recorded between
 * - pure data + pure functions; the caller owns where the history lives
 */
export type DocumentHistoryEntry = {
  undo: SduiDocumentPatch[]
  redo: SduiDocumentPatch[]
}

export type DocumentHistory = {
  readonly undoStack: readonly DocumentHistoryEntry[]
  readonly redoStack: readonly DocumentHistoryEntry[]
}

export const DEFAULT_HISTORY_DEPTH = 100

export function createDocumentHistory(): DocumentHistory {
  return { undoStack: [], redoStack: [] }
}

export function recordHistoryEntry(
  history: DocumentHistory,
  entry: DocumentHistoryEntry,
  depth: number = DEFAULT_HISTORY_DEPTH,
): DocumentHistory {
  const undoStack = [...history.undoStack, entry]

  return {
    undoStack: undoStack.length > depth ? undoStack.slice(undoStack.length - depth) : undoStack,
    redoStack: [],
  }
}

export type HistoryStepResult = {
  history: DocumentHistory
  entry: DocumentHistoryEntry
}

export function undoHistory(history: DocumentHistory): HistoryStepResult | null {
  const entry = history.undoStack[history.undoStack.length - 1]
  if (!entry) {
    return null
  }

  return {
    history: {
      undoStack: history.undoStack.slice(0, -1),
      redoStack: [...history.redoStack, entry],
    },
    entry,
  }
}

export function redoHistory(history: DocumentHistory): HistoryStepResult | null {
  const entry = history.redoStack[history.redoStack.length - 1]
  if (!entry) {
    return null
  }

  return {
    history: {
      undoStack: [...history.undoStack, entry],
      redoStack: history.redoStack.slice(0, -1),
    },
    entry,
  }
}
