import { markdownToSduiDocumentContent, type SduiDocumentContent } from '@lodado/sdui-document'
import { SduiDocumentEditor } from '@lodado/sdui-document-react'
import React, { useMemo, useState } from 'react'

const SAMPLE = `# 마크다운 임포트

일반 문단과 **굵게**, \`인라인 코드\` 를 지원합니다.

- [ ] 체크리스트 항목
- [x] 완료된 항목

> 인용문은 callout 블록으로 변환됩니다.

![캡션](https://picsum.photos/seed/md/480/180)
`

/**
 * markdownToSduiDocumentContent runs the marked lexer and maps tokens onto the
 * document schema — headings, paragraphs, task lists, blockquotes→callouts,
 * images. The parsed tree is rendered read-only by the same editor.
 */
export const MarkdownImportDemo = () => {
  const [source, setSource] = useState(SAMPLE)

  const parsed = useMemo<{ content?: SduiDocumentContent; error?: string }>(() => {
    try {
      return { content: markdownToSduiDocumentContent(source) }
    } catch (error) {
      return { error: error instanceof Error ? error.message : '파싱 실패' }
    }
  }, [source])

  return (
    <>
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--doc-text-subtle)' }}>Markdown 입력</label>
        <textarea
          className="sdui-doc__textarea"
          value={source}
          spellCheck={false}
          onChange={(e) => setSource(e.target.value)}
          style={{ marginTop: 6 }}
        />
      </div>
      <div>
        <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--doc-text-subtle)' }}>변환된 문서</label>
        <div
          style={{
            marginTop: 6,
            padding: 12,
            borderRadius: 8,
            border: '1px solid var(--doc-border)',
            background: 'var(--doc-surface-raised)',
            minHeight: 150,
          }}
        >
          {parsed.content ? (
            <SduiDocumentEditor content={parsed.content} readOnly />
          ) : (
            <span style={{ color: 'var(--color-text-danger, #c9372c)', fontSize: 13 }}>{parsed.error}</span>
          )}
        </div>
      </div>
    </>
  )
}
