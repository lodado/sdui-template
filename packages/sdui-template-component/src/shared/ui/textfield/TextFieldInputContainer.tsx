/* eslint-disable prefer-destructuring */

'use client'

import { useRenderNode, useSduiNodeSubscription } from '@lodado/sdui-template'
import React from 'react'

import { TextField } from './TextField'
import type { TextFieldInputProps } from './types'

interface TextFieldInputContainerProps {
  id: string
  parentPath?: string[]
}

export const TextFieldInputContainer = ({ id, parentPath = [] }: TextFieldInputContainerProps) => {
  const { childrenIds, attributes, state } = useSduiNodeSubscription({ nodeId: id })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

  const placeholder = attributes?.placeholder as string | undefined
  const value = attributes?.value as string | undefined
  const defaultValue = state?.value as string | undefined
  const type = attributes?.type as TextFieldInputProps['type'] | undefined
  const maxLength = attributes?.maxLength as number | undefined
  const autocomplete = attributes?.autocomplete as string | undefined
  const className = attributes?.className as string | undefined
  const onChange = attributes?.onChange as TextFieldInputProps['onChange'] | undefined
  const onFocus = attributes?.onFocus as TextFieldInputProps['onFocus'] | undefined
  const onBlur = attributes?.onBlur as TextFieldInputProps['onBlur'] | undefined

  // Icon location from state ('left', 'right', 'both')
  const iconLocation = state?.iconLocation as 'left' | 'right' | 'both' | undefined

  // Left and right icons from children
  let leftIcon: React.ReactNode | undefined
  let rightIcon: React.ReactNode | undefined
  const onRightIconClick = attributes?.onRightIconClick as (() => void) | undefined

  if (childrenIds.length > 0) {
    const children = renderChildren(childrenIds)

    // Distribute children based on iconLocation
    if (iconLocation === 'left') {
      // First child goes to left
      if (children.length > 0) {
        leftIcon = children[0]
      }
    } else if (iconLocation === 'right') {
      // First child goes to right
      if (children.length > 0) {
        rightIcon = children[0]
      }
    } else if (iconLocation === 'both') {
      // First child goes to left, second child goes to right
      if (children.length > 0) {
        leftIcon = children[0]
      }
      if (children.length > 1) {
        rightIcon = children[1]
      }
    } else {
      // Default: first child to left, second child to right (backward compatibility)
      if (children.length > 0) {
        leftIcon = children[0]
      }
      if (children.length > 1) {
        rightIcon = children[1]
      }
    }
  }

  return (
    <TextField.Input
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      type={type}
      maxLength={maxLength}
      autocomplete={autocomplete}
      className={className}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      onRightIconClick={onRightIconClick}
    />
  )
}

TextFieldInputContainer.displayName = 'TextFieldInputContainer'
