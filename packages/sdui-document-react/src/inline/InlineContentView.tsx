import type { SduiInlineContent, SduiInlineMark, SduiInlineTextNode } from '@lodado/sdui-document'
import React from 'react'

import { staticMarkRenderers } from '../marks/staticRenderers'

function wrapWithMark(element: React.ReactNode, mark: SduiInlineMark): React.ReactNode {
  const renderer = staticMarkRenderers[mark.type]

  return renderer ? renderer(element, mark) : element
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
 * Per-mark rendering lives in the mark registry (src/marks/<name>/), keeping
 * the static view and the PM toDOM definitions side by side.
 */
export const InlineContentView = ({ content }: InlineContentViewProps) => {
  return (
    <>
      {content.map((node, nodeIndex) => {
        if (node.type === 'hard_break') {
          // eslint-disable-next-line react/no-array-index-key
          return <br key={nodeIndex} />
        }
        if (node.type === 'date') {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <time key={nodeIndex} className="inline-date" dateTime={node.iso}>
              {node.display || node.iso}
            </time>
          )
        }
        // eslint-disable-next-line react/no-array-index-key
        return <React.Fragment key={nodeIndex}>{renderTextNode(node)}</React.Fragment>
      })}
    </>
  )
}
