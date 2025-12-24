'use client'

import React from 'react'
import type { ComponentFactory, RenderNodeFn } from '@lodado/sdui-template'
import { useSduiNodeSubscription } from '@lodado/sdui-template'

interface GridLayoutProps {
  id: string
  renderNode: RenderNodeFn
}

const GridLayoutComponent: React.FC<GridLayoutProps> = ({ id, renderNode }) => {
  const { childrenIds } = useSduiNodeSubscription({
    nodeId: id,
  })

  return (
    <div className="w-full h-full">
      {childrenIds?.map((childId: string) => (
        <div key={childId}>{renderNode(childId)}</div>
      ))}
    </div>
  )
}

GridLayoutComponent.displayName = 'GridLayout'

export const GridLayout = GridLayoutComponent

export const GridLayoutFactory: ComponentFactory = (id, renderNode) => <GridLayout id={id} renderNode={renderNode} />
