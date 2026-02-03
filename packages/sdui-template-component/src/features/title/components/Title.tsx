'use client'

import { useRenderNode, useSduiLayoutAction, useSduiNodeSubscription } from '@lodado/sdui-template'
import React, { useMemo } from 'react'

interface TitleProps {
  id: string
  parentPath?: string[]
}

export const Title = ({ id, parentPath = [] }: TitleProps) => {
  const { childrenIds } = useSduiNodeSubscription({ nodeId: id })
  const { renderNode, currentPath } = useRenderNode({ nodeId: id, parentPath })
  const store = useSduiLayoutAction()

  // Group children by type
  const childrenIdsKey = childrenIds.join(',')
  const { leftChildren, middleChildren, rightChildren } = useMemo(() => {
    const left: string[] = []
    const middle: string[] = []
    const right: string[] = []

    childrenIds.forEach((childId) => {
      try {
        const childType = store.getNodeTypeById(childId)
        if (childType === 'TitleLeft') {
          left.push(childId)
        } else if (childType === 'TitleMiddle') {
          middle.push(childId)
        } else if (childType === 'TitleRight') {
          right.push(childId)
        }
      } catch {
        // Node not found or error, skip
      }
    })

    return { leftChildren: left, middleChildren: middle, rightChildren: right }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childrenIdsKey, store])

  return (
    <header
      className="bg-[var(--elevation-surface-default)] relative shrink-0 w-full border-b border-[var(--color-border-default)] flex items-center h-[48px] min-h-[48px] max-h-[48px] px-3 box-content"
      data-node-id={id}
      data-testid={`title-${id}`}
    >
      <div className="w-full flex items-center justify-between relative">
        {/* Left section */}
        {leftChildren.length > 0 && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {leftChildren.map((childId) => (
              <React.Fragment key={childId}>{renderNode(childId, currentPath)}</React.Fragment>
            ))}
          </div>
        )}

        {/* Middle section - centered with absolute positioning */}
        {middleChildren.length > 0 && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
            {middleChildren.map((childId) => (
              <React.Fragment key={childId}>{renderNode(childId, currentPath)}</React.Fragment>
            ))}
          </div>
        )}

        {/* Right section */}
        {rightChildren.length > 0 && (
          <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
            {rightChildren.map((childId) => (
              <React.Fragment key={childId}>{renderNode(childId, currentPath)}</React.Fragment>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
