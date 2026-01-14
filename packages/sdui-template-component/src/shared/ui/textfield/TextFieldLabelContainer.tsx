'use client'

import { useRenderNode, useSduiNodeSubscription } from '@lodado/sdui-template'
import React from 'react'

import { TextField } from './TextField'

interface TextFieldLabelContainerProps {
  id: string
  parentPath?: string[]
}

export const TextFieldLabelContainer = ({ id, parentPath = [] }: TextFieldLabelContainerProps) => {
  const { childrenIds, attributes, state } = useSduiNodeSubscription({ nodeId: id })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

  const className = attributes?.className as string | undefined
  const labelText = state?.text as string | undefined

  // Render children if any, otherwise use state.text
  const children = childrenIds.length > 0 ? renderChildren(childrenIds) : labelText

  return <TextField.Label className={className}>{children}</TextField.Label>
}

TextFieldLabelContainer.displayName = 'TextFieldLabelContainer'
