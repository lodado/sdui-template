import React from 'react'

import { BlockNode } from './BlockNode'
import { useEditorRuntime } from './EditorRuntimeContext'
import { useBlockEntry } from './renderModel/useBlockEntry'

/**
 * The top-level block list, driven by the ROOT render entry instead of the
 * `doc` value — so it re-renders only when the top-level child-id list changes
 * (block added / removed / reordered), never on a text or state edit. This is
 * what keeps the editor container itself from re-rendering on every commit.
 */
export const RootBlockList = ({ rootId, readOnly }: { rootId: string; readOnly: boolean }) => {
  const { renderStore } = useEditorRuntime()
  const root = useBlockEntry(renderStore, rootId)

  if (!root) {
    return null
  }

  return (
    <>
      {root.childrenIds.map((childId) => (
        <BlockNode key={childId} id={childId} depth={1} readOnly={readOnly} />
      ))}
    </>
  )
}
