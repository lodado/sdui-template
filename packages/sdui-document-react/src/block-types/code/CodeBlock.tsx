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

export const CodeBlock = ({ block, onSetCodeLanguage, children }: BlockChromeProps) => {
  const language = typeof block.attributes?.language === 'string' ? block.attributes.language : 'plain text'

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
      <pre className="code-block">
        <code>{children}</code>
      </pre>
    </div>
  )
}
