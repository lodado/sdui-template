'use client'

import { useRenderNode, useSduiNodeSubscription } from '@lodado/sdui-template'
import React from 'react'

import { Button } from './Button'
import { type ButtonProps, buttonStatesSchema } from './types'

interface ButtonContainerProps {
  id: string
  parentPath?: string[]
}

export const ButtonContainer = ({ id, parentPath = [] }: ButtonContainerProps) => {
  const { childrenIds, attributes, state } = useSduiNodeSubscription({
    nodeId: id,
    schema: buttonStatesSchema,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

  const children = childrenIds.length > 0 ? renderChildren(childrenIds) : undefined

  return (
    <Button
      nodeId={id}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...(attributes as ButtonProps)}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...(state as ButtonProps)}
    >
      {children}
    </Button>
  )
}

ButtonContainer.displayName = 'ButtonContainer'
