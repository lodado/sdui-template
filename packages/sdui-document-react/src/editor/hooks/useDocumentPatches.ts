import type { SduiDocumentContent, SduiDocumentPatch } from '@lodado/sdui-document'
import {
  applyDocumentPatch,
  applyDocumentPatches,
  createTrailingBlockPatch,
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

  const applyPatches = (patches: SduiDocumentPatch[]) => {
    if (patches.length === 0) {
      return
    }

    let next = applyDocumentPatches(docRef.current, patches)
    let applied = patches

    // Restore the invariant in the SAME batch — consumers (and a future undo
    // stack) always observe a document that already ends in a text block.
    if (!readOnly && generateBlockId) {
      const trailing = createTrailingBlockPatch(next, generateBlockId)
      if (trailing) {
        next = applyDocumentPatch(next, trailing)
        applied = [...patches, trailing]
      }
    }

    docRef.current = next
    setDoc(next)
    onContentChange?.(next, applied)
  }

  return { doc, docRef, applyPatches }
}
