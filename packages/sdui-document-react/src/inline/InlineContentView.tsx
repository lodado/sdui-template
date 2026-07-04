import type { SduiInlineContent, SduiInlineMark, SduiInlineTextNode } from '@lodado/sdui-document'
import React from 'react'

import { markDefinitionByName } from '../marks'

function wrapWithMark(element: React.ReactNode, mark: SduiInlineMark): React.ReactNode {
  const definition = markDefinitionByName[mark.type]

  return definition ? definition.renderStatic(element, mark) : element
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
