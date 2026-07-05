import type { SduiDocumentContent, SduiDocumentPatch } from '@lodado/sdui-document'
import { toSduiLayoutDocument } from '@lodado/sdui-document'
import { SduiDocumentEditor } from '@lodado/sdui-document-react'
import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { SduiLayoutStateInspector } from '@lodado/sdui-template'
import React, { useMemo, useState } from 'react'

function patchTargetId(patch: SduiDocumentPatch): string {
  if ('blockId' in patch) {
    return patch.blockId
  }
  if ('block' in patch) {
    return patch.block.id
  }
  return ''
}

function formatPatch(patch: SduiDocumentPatch): string {
  const { type } = patch
  const id = patchTargetId(patch)

  return id ? `${type}  ${id}` : type
}

const PatchLog = ({ patches }: { patches: SduiDocumentPatch[] }) => {
  if (patches.length === 0) {
    return <pre className="sdui-doc__log">문서를 편집하면 여기에 패치가 순서대로 쌓입니다.</pre>
  }

  return (
    <pre className="sdui-doc__log">
      {patches
        .slice(-10)
        .map(
          (patch, i) =>
            `${String(patches.length - Math.min(10, patches.length) + i + 1).padStart(2, '0')}  ${formatPatch(patch)}`,
        )
        .join('\n')}
    </pre>
  )
}

const DomainContentPanel = ({ content }: { content: SduiDocumentContent }) => {
  return (
    <section aria-label="SduiDocumentContent" style={{ display: 'grid', gap: 8 }}>
      <strong style={{ fontSize: 13 }}>Domain · SduiDocumentContent</strong>
      <pre
        style={{
          margin: 0,
          padding: 12,
          borderRadius: 8,
          border: '1px solid #cbd5e1',
          background: '#fff7ed',
          color: '#0f172a',
          overflow: 'auto',
          maxHeight: 280,
          fontSize: 12,
          lineHeight: 1.45,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {JSON.stringify(content, null, 2)}
      </pre>
    </section>
  )
}

interface EditorWithStateInspectorProps {
  content: SduiDocumentContent
  readOnly?: boolean
  documentId?: string
  title?: string
}

/**
 * SduiDocumentEditor + live domain/layout JSON panels for Storybook debugging.
 * Each edit updates SduiDocumentContent, then lowers it through toSduiLayoutDocument
 * for the sdui-template state inspector.
 */
export const EditorWithStateInspector = ({
  content: initialContent,
  readOnly,
  documentId = 'storybook-doc',
  title = 'Editor → SDUI layout state',
}: EditorWithStateInspectorProps) => {
  const [content, setContent] = useState(initialContent)
  const [patches, setPatches] = useState<SduiDocumentPatch[]>([])

  const layoutDocument = useMemo(
    () => toSduiLayoutDocument(content, { documentId, title }) as SduiLayoutDocument,
    [content, documentId, title],
  )

  return (
    <div
      style={{
        display: 'grid',
        gap: 16,
        gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
        alignItems: 'start',
      }}
    >
      <div style={{ display: 'grid', gap: 12 }}>
        <SduiDocumentEditor
          content={initialContent}
          readOnly={readOnly}
          onContentChange={(next, applied) => {
            setContent(next)
            setPatches((previous) => [...previous, ...applied])
          }}
        />
        {!readOnly && <PatchLog patches={patches} />}
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        <DomainContentPanel content={content} />
        <SduiLayoutStateInspector document={layoutDocument} title={title} maxHeight={420} />
      </div>
    </div>
  )
}
