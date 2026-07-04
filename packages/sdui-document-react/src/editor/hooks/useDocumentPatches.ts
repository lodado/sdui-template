import type { DocumentHistory, SduiDocumentContent, SduiDocumentPatch } from '@lodado/sdui-document'
import {
  applyDocumentPatches,
  applyDocumentPatchesWithInverse,
  applyDocumentPatchWithInverse,
  createDocumentHistory,
  createTrailingBlockPatch,
  recordHistoryEntry,
  redoHistory,
  undoHistory,
  withTrailingBlock,
} from '@lodado/sdui-document'
import { useRef, useState } from 'react'

type DocumentPatchesOptions = {
  content: SduiDocumentContent
  onContentChange?(next: SduiDocumentContent, patches: SduiDocumentPatch[]): void
  /**
   * Enables the trailing-block invariant (Outline TrailingNode): the document
   * always ends in a block that can host inline text. Omit to opt out.
   */
  generateBlockId?(): string
  readOnly?: boolean
}

export function useDocumentPatches({
  content,
  onContentChange,
  generateBlockId,
  readOnly = false,
}: DocumentPatchesOptions) {
  // Load normalization mirrors Outline's withTrailingNode: seed the invariant
  // silently — opening a document is not an edit, so no patch event fires.
  const [doc, setDoc] = useState(() =>
    readOnly || !generateBlockId ? content : withTrailingBlock(content, generateBlockId),
  )
  const docRef = useRef(doc)
  // Two-stack undo/redo (PM history covers only inline text within one focus
  // session; everything that lands here as a patch batch is one undo step).
  const historyRef = useRef<DocumentHistory>(createDocumentHistory())

  const publish = (next: SduiDocumentContent, patches: SduiDocumentPatch[]) => {
    docRef.current = next
    setDoc(next)
    onContentChange?.(next, patches)
  }

  const applyPatches = (patches: SduiDocumentPatch[]) => {
    if (patches.length === 0) {
      return
    }

    const first = applyDocumentPatchesWithInverse(docRef.current, patches)
    let next = first.content
    let applied = patches
    let inverse = first.inverse

    // Restore the invariant in the SAME batch — consumers and the undo stack
    // always observe a document that already ends in a text block, and one
    // undo step removes the trailing block together with the edit it rode on.
    if (!readOnly && generateBlockId) {
      const trailing = createTrailingBlockPatch(next, generateBlockId)
      if (trailing) {
        const second = applyDocumentPatchWithInverse(next, trailing)
        next = second.content
        applied = [...patches, trailing]
        inverse = [...second.inverse, ...inverse]
      }
    }

    historyRef.current = recordHistoryEntry(historyRef.current, { undo: inverse, redo: applied })
    publish(next, applied)
  }

  /**
   * Applies one history entry's patches RAW: no recording, and no trailing
   * invariant — an entry only round-trips against the exact states it was
   * recorded between, so an extra invariant insert would corrupt redo.
   */
  const applyHistoryStep = (
    step: { history: DocumentHistory; entry: { undo: SduiDocumentPatch[]; redo: SduiDocumentPatch[] } } | null,
    direction: 'undo' | 'redo',
  ): SduiDocumentPatch[] | null => {
    if (!step) {
      return null
    }

    const patches = direction === 'undo' ? step.entry.undo : step.entry.redo
    historyRef.current = step.history
    publish(applyDocumentPatches(docRef.current, patches), patches)

    return patches
  }

  const undo = () => applyHistoryStep(undoHistory(historyRef.current), 'undo')
  const redo = () => applyHistoryStep(redoHistory(historyRef.current), 'redo')

  return { doc, docRef, applyPatches, undo, redo }
}
