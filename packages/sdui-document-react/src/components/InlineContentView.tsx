import type { SduiInlineContent, SduiInlineMark, SduiInlineTextNode } from '@lodado/sdui-document'
import React from 'react'

const SAFE_LINK_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:']

function safeHref(href: string): string | undefined {
  try {
    // Relative hrefs resolve against the dummy https base and stay allowed.
    const { protocol } = new URL(href, 'https://relative.invalid')

    return SAFE_LINK_PROTOCOLS.includes(protocol) ? href : undefined
  } catch {
    return undefined
  }
}

function wrapWithMark(element: React.ReactNode, mark: SduiInlineMark): React.ReactNode {
  switch (mark.type) {
    case 'bold':
      return <strong>{element}</strong>
    case 'italic':
      return <em>{element}</em>
    case 'code':
      return <code>{element}</code>
    case 'link': {
      const href = safeHref(mark.attrs.href)

      return href ? <a href={href}>{element}</a> : <span>{element}</span>
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
