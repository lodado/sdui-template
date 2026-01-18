'use client'

import { useRenderNode, useSduiNodeSubscription } from '@lodado/sdui-template'
import React from 'react'

import { List } from './List'
import { type ListProps,listStatesSchema } from './types'

interface ListContainerProps {
  id: string
  parentPath?: string[]
}

export const ListContainer = ({ id, parentPath = [] }: ListContainerProps) => {
  const { childrenIds, attributes, state } = useSduiNodeSubscription({
    nodeId: id,
    schema: listStatesSchema,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

  const children = childrenIds.length > 0 ? renderChildren(childrenIds) : undefined

  // Extract state values
  const disabled = state?.disabled as boolean | undefined

  return (
    <List
      nodeId={id}
      disabled={disabled}

      // eslint-disable-next-line react/jsx-props-no-spreading
      {...(attributes as ListProps)}
    >
      {children}
    </List>
  )
}

ListContainer.displayName = 'ListContainer'
