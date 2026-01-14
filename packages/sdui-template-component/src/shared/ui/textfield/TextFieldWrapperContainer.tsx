'use client'

import { useRenderNode, useSduiNodeSubscription } from '@lodado/sdui-template'
import React from 'react'

import { TextField } from './TextField'
import type { TextFieldWrapperProps } from './types'

interface TextFieldWrapperContainerProps {
  id: string
  parentPath?: string[]
}

export const TextFieldWrapperContainer = ({ id, parentPath = [] }: TextFieldWrapperContainerProps) => {
  const { childrenIds, attributes } = useSduiNodeSubscription({ nodeId: id })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

  const orientation = attributes?.orientation as TextFieldWrapperProps['orientation'] | undefined
  const className = attributes?.className as string | undefined

  // Render children (Label, Input, HelpMessage)
  const children = childrenIds.length > 0 ? renderChildren(childrenIds) : undefined

  return (
    <TextField.Wrapper orientation={orientation} className={className}>
      {children}
    </TextField.Wrapper>
  )
}

TextFieldWrapperContainer.displayName = 'TextFieldWrapperContainer'
