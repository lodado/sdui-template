'use client'

import { useRenderNode, useSduiNodeSubscription } from '@lodado/sdui-template'
import React from 'react'

import { Icon } from './Icon'
import type { IconProps } from './types'

interface IconContainerProps {
  id: string
  parentPath?: string[]
}

export const IconContainer = ({ id, parentPath = [] }: IconContainerProps) => {
  const { childrenIds, attributes, state } = useSduiNodeSubscription({ nodeId: id })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

  // HTML attributes
  const className = attributes?.className as string | undefined
  const ariaLabel = attributes?.['aria-label'] as string | undefined
  const ariaHidden = attributes?.['aria-hidden'] as boolean | undefined
  const role = attributes?.role as IconProps['role'] | undefined

  // State (component state, not HTML attributes)
  const size = state?.size as IconProps['size'] | undefined

  // Render children if any (for SVG icons)
  const children = childrenIds.length > 0 ? renderChildren(childrenIds) : undefined

  return (
    <Icon
      size={size}
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={role}
      nodeId={id}
    >
      {children}
    </Icon>
  )
}

IconContainer.displayName = 'IconContainer'
