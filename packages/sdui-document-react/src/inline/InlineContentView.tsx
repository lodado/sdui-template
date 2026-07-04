import type { SduiInlineContent, SduiInlineMark, SduiInlineTextNode } from '@lodado/sdui-document'
import React from 'react'

import { safeHref } from './safeHref'

function wrapWithMark(element: React.ReactNode, mark: SduiInlineMark): React.ReactNode {
  switch (mark.type) {
    case 'bold':
      return <strong>{element}</strong>
    case 'italic':
      return <em>{element}</em>
    case 'code':
      // Outline marks/Code.ts: <code class="inline">
      return <code className="inline">{element}</code>
    case 'link': {
      const href = safeHref(mark.attrs.href)

      return href ? (
        <a href={href} rel="noopener noreferrer nofollow">
          {element}
        </a>
      ) : (
        <span>{element}</span>
      )
    }
    default:
      return element
  }
}

function renderTextNode(node: SduiInlineTextNode): React.ReactNode {
  return (node.marks ?? []).reduce<React.ReactNode>((element, mark) => wrapWithMark(element, mark), node.text)
}

export type InlineContentViewProps = {
  content: SduiInlineContent
}

/**
 * Static React renderer for unfocused blocks.
 *
 * Renders `state.content` inline JSON as plain semantic tags — no ProseMirror
 * involved, which is what keeps the document at one PM instance total.
 *
 * Policies:
 * - link hrefs are scheme-whitelisted (http/https/mailto/tel); anything else
 *   renders as a plain span (no navigable href emitted)
 */
export const InlineContentView = ({ content }: InlineContentViewProps) => {
  return (
    <>
      {content.map((node, nodeIndex) =>
        node.type === 'hard_break' ? (
          // eslint-disable-next-line react/no-array-index-key
          <br key={nodeIndex} />
        ) : (
          // eslint-disable-next-line react/no-array-index-key
          <React.Fragment key={nodeIndex}>{renderTextNode(node)}</React.Fragment>
        ),
      )}
    </>
  )
}
