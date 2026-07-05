import type { SduiDocumentPatch } from '../schema'

/**
 * Generic two-stack undo/redo.
 *
 * Each entry pairs both directions of one applied operation:
 * - `undo`: the payload that rolls the operation back
 * - `redo`: the payload that replays it
 *
 * Policies:
 * - recording a new entry clears the redo stack (a fresh edit forks history)
 * - an entry's undo/redo pair only round-trips against the exact states it
 *   was recorded between — appliers must not inject extra changes (e.g. the
 *   trailing-block invariant) when replaying history entries
 * - pure data + pure functions; the caller owns where the history lives
 */
export type HistoryEntry<T> = {
  undo: T
  redo: T
}

export type History<T> = {
  readonly undoStack: readonly HistoryEntry<T>[]
  readonly redoStack: readonly HistoryEntry<T>[]
}

/**
 * Document-level history over the patch engine: `undo` holds the inverse
 * patches from applyDocumentPatchesWithInverse, `redo` the original batch,
 * both applied in array order.
 */
export type DocumentHistoryEntry = HistoryEntry<SduiDocumentPatch[]>

export type DocumentHistory = History<SduiDocumentPatch[]>

export const DEFAULT_HISTORY_DEPTH = 100

export function createHistory<T>(): History<T> {
  return { undoStack: [], redoStack: [] }
}

export function createDocumentHistory(): DocumentHistory {
  return createHistory<SduiDocumentPatch[]>()
}

export function recordHistoryEntry<T>(
  history: History<T>,
  entry: HistoryEntry<T>,
  depth: number = DEFAULT_HISTORY_DEPTH,
): History<T> {
  const undoStack = [...history.undoStack, entry]

  return {
    undoStack: undoStack.length > depth ? undoStack.slice(undoStack.length - depth) : undoStack,
    redoStack: [],
  }
}

export type HistoryStepResult<T = SduiDocumentPatch[]> = {
  history: History<T>
  entry: HistoryEntry<T>
}

export function undoHistory<T>(history: History<T>): HistoryStepResult<T> | null {
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

export function redoHistory<T>(history: History<T>): HistoryStepResult<T> | null {
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
