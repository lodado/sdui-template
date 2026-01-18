'use client'

import { useRenderNode, useSduiNodeSubscription } from '@lodado/sdui-template'
import React from 'react'

import { Card } from './Card'
import { type CardProps,cardStatesSchema } from './types'

interface CardContainerProps {
  id: string
  parentPath?: string[]
}

export const CardContainer = ({ id, parentPath = [] }: CardContainerProps) => {
  const { childrenIds, attributes, state } = useSduiNodeSubscription({
    nodeId: id,
    schema: cardStatesSchema,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

  const children = childrenIds.length > 0 ? renderChildren(childrenIds) : undefined

  return (
    <Card
      nodeId={id}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...(attributes as CardProps)}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...(state as CardProps)}
    >
      {children}
    </Card>
  )
}

CardContainer.displayName = 'CardContainer'
