'use client'

import { useSduiNodeSubscription } from '@lodado/sdui-template'
import React from 'react'

import { Tag } from './Tag'
import { type TagColor, tagStatesSchema } from './types'

interface TagContainerProps {
  id: string
  parentPath?: string[]
}

interface TagStateValues {
  text?: string
  color?: TagColor
  isRemovable?: boolean
  isLink?: boolean
}

export const TagContainer = ({ id, parentPath = [] }: TagContainerProps) => {
  const { attributes, state } = useSduiNodeSubscription({
    nodeId: id,
    schema: tagStatesSchema,
  })

  // Merge attributes and state with proper typing
  const tagState = state as TagStateValues | undefined
  const tagAttributes = attributes as Record<string, unknown> | undefined

  // Tag doesn't render children, it uses the 'text' prop
  const text = tagState?.text || (tagAttributes?.text as string) || ''

  return (
    <Tag
      nodeId={id}
      text={text}
      color={tagState?.color}
      isRemovable={tagState?.isRemovable}
      isLink={tagState?.isLink}
      className={tagAttributes?.className as string | undefined}
    />
  )
}

TagContainer.displayName = 'TagContainer'
