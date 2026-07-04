import type { SduiDocumentContent, SduiDocumentPatch } from '@lodado/sdui-document'
import { applyDocumentPatches } from '@lodado/sdui-document'
import { useRef, useState } from 'react'

type DocumentPatchesOptions = {
  content: SduiDocumentContent
  onContentChange?(next: SduiDocumentContent, patches: SduiDocumentPatch[]): void
}

export function useDocumentPatches({ content, onContentChange }: DocumentPatchesOptions) {
  const [doc, setDoc] = useState(content)
  const docRef = useRef(doc)

  const applyPatches = (patches: SduiDocumentPatch[]) => {
    if (patches.length === 0) {
      return
    }

    const next = applyDocumentPatches(docRef.current, patches)
    docRef.current = next
    setDoc(next)
    onContentChange?.(next, patches)
  }

  return { doc, docRef, applyPatches }
}
