import { inlineContentToPlainText, type SduiInlineContent } from '@lodado/sdui-document'
import React from 'react'

import type { BlockChromeProps } from '../BlockChrome'

/** Notion's picker list, trimmed to common languages — plain data, extend freely. */
const CODE_LANGUAGES = [
  'plain text',
  'bash',
  'c',
  'c++',
  'css',
  'go',
  'html',
  'java',
  'javascript',
  'json',
  'kotlin',
  'markdown',
  'python',
  'rust',
  'sql',
  'swift',
  'typescript',
  'yaml',
] as const

function isKnownLanguage(language: string): boolean {
  return (CODE_LANGUAGES as readonly string[]).includes(language)
}

function codeBlockText(block: BlockChromeProps['block']): string {
  const content = block.state?.content
  if (Array.isArray(content)) {
    return inlineContentToPlainText(content as SduiInlineContent)
  }

  const text = block.state?.text
  return typeof text === 'string' ? text : ''
}

export const CodeBlock = ({ block, onSetCodeLanguage, children }: BlockChromeProps) => {
  const language = typeof block.attributes?.language === 'string' ? block.attributes.language : 'plain text'
  const codeText = codeBlockText(block)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) {
      return undefined
    }

    const timeout = window.setTimeout(() => setCopied(false), 1500)
    return () => window.clearTimeout(timeout)
  }, [copied])

  const handleCopy = () => {
    if (!codeText || typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      return
    }

    try {
      navigator.clipboard.writeText(codeText).catch(() => undefined)
      setCopied(true)
    } catch {
      // Clipboard can be blocked by browser policy; copying should never break editing.
    }
  }

  return (
    <div className="code-block-wrapper">
      <span className="code-language" contentEditable={false}>
        {onSetCodeLanguage ? (
          <select
            aria-label="Code language"
            value={language}
            onChange={(event) => onSetCodeLanguage(block.id, event.target.value)}
          >
            {isKnownLanguage(language) ? null : <option value={language}>{language}</option>}
            {CODE_LANGUAGES.map((candidate) => (
              <option key={candidate} value={candidate}>
                {candidate}
              </option>
            ))}
          </select>
        ) : (
          language
        )}
      </span>
      {codeText ? (
        <button
          type="button"
          className={`code-copy-button${copied ? ' is-copied' : ''}`}
          aria-label={copied ? 'Copied' : 'Copy code'}
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleCopy}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      ) : null}
      <pre className="code-block">
        <code>{children}</code>
      </pre>
    </div>
  )
}
