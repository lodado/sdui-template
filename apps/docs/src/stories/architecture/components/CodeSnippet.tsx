import React from 'react'

interface CodeSnippetProps {
  file?: string
  code: string
}

const DOT_COLORS = ['#ff5f57', '#febc2e', '#28c840']

/** Plain (unhighlighted) code block with a window-style header. */
export const CodeSnippet = ({ file, code }: CodeSnippetProps) => {
  return (
    <div className="sdui-doc__code">
      <div className="sdui-doc__code-head">
        {DOT_COLORS.map((color) => (
          <span key={color} className="sdui-doc__code-dot" style={{ background: color }} />
        ))}
        {file && <span className="sdui-doc__code-file">{file}</span>}
      </div>
      <pre>
        <code>{code.replace(/^\n/, '').replace(/\n\s*$/, '')}</code>
      </pre>
    </div>
  )
}
