import type { SduiDocumentContent, SduiDocumentPatch } from '@lodado/sdui-document'
import { SduiDocumentEditor } from '@lodado/sdui-document-react'
import React, { useState } from 'react'

function formatPatch(patch: SduiDocumentPatch): string {
  const { type } = patch
  const id = 'blockId' in patch ? patch.blockId : 'block' in patch ? patch.block.id : ''
  return id ? `${type}  ${id}` : type
}

export const PatchLog = ({ patches }: { patches: SduiDocumentPatch[] }) => {
  if (patches.length === 0) {
    return <pre className="sdui-doc__log">문서를 편집하면 여기에 패치가 순서대로 쌓입니다.</pre>
  }
  return (
    <pre className="sdui-doc__log">
      {patches
        .slice(-14)
        .map(
          (patch, i) =>
            `${String(patches.length - Math.min(14, patches.length) + i + 1).padStart(2, '0')}  ${formatPatch(patch)}`,
        )
        .join('\n')}
    </pre>
  )
}

interface EditorWithPatchLogProps {
  content: SduiDocumentContent
  readOnly?: boolean
}

/** Editor wired to a live patch log — the workhorse for most core demos. */
export const EditorWithPatchLog = ({ content, readOnly }: EditorWithPatchLogProps) => {
  const [patches, setPatches] = useState<SduiDocumentPatch[]>([])

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <SduiDocumentEditor
        content={content}
        readOnly={readOnly}
        onContentChange={(_next, applied) => setPatches((prev) => [...prev, ...applied])}
      />
      {!readOnly && <PatchLog patches={patches} />}
    </div>
  )
}
