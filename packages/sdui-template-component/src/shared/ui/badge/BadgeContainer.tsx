'use client'

import { useSduiNodeSubscription } from '@lodado/sdui-template'

import { Badge } from './Badge'
import { type BadgeProps, type BadgeState, badgeStatesSchema } from './types'

interface BadgeContainerProps {
  id: string
  parentPath?: string[]
}

export const BadgeContainer = ({ id, parentPath = [] }: BadgeContainerProps) => {
  const { attributes, state } = useSduiNodeSubscription({
    nodeId: id,
    schema: badgeStatesSchema,
  })

  const badgeState = state as BadgeState
  const badgeAttributes = attributes as Partial<BadgeProps> | undefined

  // Badge uses the 'label' prop from state or attributes
  const label = badgeState?.label ?? badgeAttributes?.label ?? ''

  return (
    <Badge
      label={label}
      appearance={badgeState?.appearance ?? badgeAttributes?.appearance}
      className={badgeAttributes?.className}
    />
  )
}

BadgeContainer.displayName = 'BadgeContainer'
