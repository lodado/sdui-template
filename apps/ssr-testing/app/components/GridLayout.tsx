'use client'

import React from 'react'
import type { ComponentFactory, ParentPath } from '@lodado/sdui-template'
import { useRenderNode, useSduiNodeSubscription } from '@lodado/sdui-template'

interface GridLayoutProps {
  id: string
  parentPath?: ParentPath
}

const GridLayoutComponent: React.FC<GridLayoutProps> = ({ id, parentPath = [] }) => {
  const { childrenIds } = useSduiNodeSubscription({
    nodeId: id,
  })
  const { renderNode, currentPath } = useRenderNode({ nodeId: id, parentPath })

  return (
    <div className="w-full h-full" data-testid="grid-layout">
      {childrenIds?.map((childId: string) => (
        <div key={childId}>{renderNode(childId, currentPath)}</div>
      ))}
    </div>
  )
}

GridLayoutComponent.displayName = 'GridLayout'

export const GridLayout = GridLayoutComponent

export const GridLayoutFactory: ComponentFactory = (id, parentPath) => <GridLayout id={id} parentPath={parentPath} />
