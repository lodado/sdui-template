import type {
  DocumentTreeClock,
  History,
  HistoryStepResult,
  MoveDocumentInverseInput,
  SduiDocument,
  SduiDocumentEvent,
} from '@lodado/sdui-document'
import {
  createHistory,
  DocumentNotFoundError,
  InvalidDocumentDestinationError,
  moveDocument as applyMoveDocument,
  moveDocumentWithInverse,
  redoHistory,
  undoHistory,
} from '@lodado/sdui-document'
import { useRef, useState } from 'react'

type TreeHistoryOptions = {
  documents: SduiDocument[]
  onDocumentsChange?(next: SduiDocument[], events: SduiDocumentEvent[]): void
  /** Injectable clock for deterministic updatedAt/occurredAt stamps. */
  now?: DocumentTreeClock
}

type TreeHistoryPayload = MoveDocumentInverseInput

/**
 * Two-stack undo/redo for document tree moves.
 *
 * Deliberately a SEPARATE stack from useDocumentPatches — Ctrl+Z inside a
 * document must not roll back sidebar moves, and vice versa.
 *
 * Policies:
 * - an entry only round-trips against the exact tree it was recorded between;
 *   if a referenced document has since disappeared, the entry is dropped
 *   silently (drop-on-conflict) and undo/redo returns null
 * - archive/restore are not history-tracked (product decision)
 */
export function useDocumentTreeHistory({ documents, onDocumentsChange, now }: TreeHistoryOptions) {
  const [docs, setDocs] = useState(documents)
  const docsRef = useRef(docs)
  const historyRef = useRef<History<TreeHistoryPayload>>(createHistory<TreeHistoryPayload>())

  const publish = (next: SduiDocument[], events: SduiDocumentEvent[]) => {
    docsRef.current = next
    setDocs(next)
    onDocumentsChange?.(next, events)
  }

  const moveDocument = (input: TreeHistoryPayload) => {
    const result = moveDocumentWithInverse({ documents: docsRef.current, ...input }, now)

    historyRef.current = {
      undoStack: [...historyRef.current.undoStack, { undo: result.inverse, redo: input }],
      redoStack: [],
    }
    publish(result.documents, result.events)
  }

  const applyHistoryStep = (
    step: HistoryStepResult<TreeHistoryPayload> | null,
    direction: 'undo' | 'redo',
  ): TreeHistoryPayload | null => {
    if (!step) {
      return null
    }

    const op = direction === 'undo' ? step.entry.undo : step.entry.redo

    try {
      const result = applyMoveDocument({ documents: docsRef.current, ...op }, now)
      historyRef.current = step.history
      publish(result.documents, result.events)

      return op
    } catch (error) {
      if (error instanceof DocumentNotFoundError || error instanceof InvalidDocumentDestinationError) {
        // Entry can never round-trip again — drop it from both stacks.
        historyRef.current =
          direction === 'undo'
            ? { undoStack: step.history.undoStack, redoStack: step.history.redoStack.slice(0, -1) }
            : { undoStack: step.history.undoStack.slice(0, -1), redoStack: step.history.redoStack }

        return null
      }

      throw error
    }
  }

  const undo = () => applyHistoryStep(undoHistory(historyRef.current), 'undo')
  const redo = () => applyHistoryStep(redoHistory(historyRef.current), 'redo')

  return { documents: docs, moveDocument, undo, redo }
}
