'use client'

import { useRenderNode, useSduiNodeSubscription } from '@lodado/sdui-template'
import React from 'react'

import { TextField } from './TextField'
import type { TextFieldInputProps, TextFieldRootProps, TextFieldWrapperProps } from './types'

interface TextFieldContainerProps {
  id: string
  parentPath?: string[]
}

export const TextFieldContainer = ({ id, parentPath = [] }: TextFieldContainerProps) => {
  const { childrenIds, attributes, state } = useSduiNodeSubscription({ nodeId: id })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

  // HTML attributes
  const disabled = attributes?.disabled as boolean | undefined
  const className = attributes?.className as string | undefined

  // State (component state, not HTML attributes)
  const error = state?.error as TextFieldRootProps['error'] | undefined
  const errorMessage = state?.errorMessage as string | undefined
  const helpMessage = state?.helpMessage as string | undefined
  const required = state?.required as boolean | undefined

  // Render children (should contain TextField.Wrapper with Label, Input, HelpMessage)
  const children = childrenIds.length > 0 ? renderChildren(childrenIds) : undefined

  return (
    <TextField
      error={error}
      errorMessage={errorMessage}
      helpMessage={helpMessage}
      disabled={disabled}
      required={required}
      className={className}
      nodeId={id}
    >
      {children}
    </TextField>
  )
}

TextFieldContainer.displayName = 'TextFieldContainer'
