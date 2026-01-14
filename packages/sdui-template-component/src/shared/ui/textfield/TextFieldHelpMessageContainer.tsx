'use client'

import { useRenderNode, useSduiNodeSubscription } from '@lodado/sdui-template'
import React from 'react'

import { TextField } from './TextField'

interface TextFieldHelpMessageContainerProps {
  id: string
  parentPath?: string[]
}

export const TextFieldHelpMessageContainer = ({ id, parentPath = [] }: TextFieldHelpMessageContainerProps) => {
  const { childrenIds, attributes, state } = useSduiNodeSubscription({ nodeId: id })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

  const className = attributes?.className as string | undefined
  const error = attributes?.error as boolean | undefined
  const messageText = state?.text as string | undefined

  // Render children if any, otherwise use state.text
  const children = childrenIds.length > 0 ? renderChildren(childrenIds) : messageText

  return (
    <TextField.HelpMessage className={className} error={error}>
      {children}
    </TextField.HelpMessage>
  )
}

TextFieldHelpMessageContainer.displayName = 'TextFieldHelpMessageContainer'
