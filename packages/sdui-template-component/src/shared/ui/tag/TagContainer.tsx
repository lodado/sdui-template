'use client'

import { useSduiNodeSubscription } from '@lodado/sdui-template'

import { Tag } from './Tag'
import { type TagProps, type TagState, tagStatesSchema } from './types'

interface TagContainerProps {
  id: string
  parentPath?: string[]
}

export const TagContainer = ({ id, parentPath = [] }: TagContainerProps) => {
  const { attributes, state } = useSduiNodeSubscription({
    nodeId: id,
    schema: tagStatesSchema,
  })

  const tagState = state as TagState
  const tagAttributes = attributes as Partial<TagProps> | undefined

  // Tag uses the 'text' prop from state or attributes
  const text = tagState?.text ?? tagAttributes?.text ?? ''

  return <Tag text={text} color={tagState?.color} className={tagAttributes?.className} />
}

TagContainer.displayName = 'TagContainer'
