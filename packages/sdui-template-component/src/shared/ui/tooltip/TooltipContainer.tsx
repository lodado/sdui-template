'use client'

import { useRenderNode, useSduiNodeSubscription } from '@lodado/sdui-template'
import React from 'react'

import { Tooltip } from './Tooltip'
import type { TooltipAlign, TooltipSide } from './types'
import { tooltipStatesSchema } from './types'

interface TooltipContainerProps {
  id: string
  parentPath?: string[]
}

/**
 * TooltipContainer component for SDUI integration
 *
 * @description
 * SDUI wrapper component for Tooltip using compound pattern.
 * Subscribes to node state and renders the Tooltip with server-driven props.
 *
 * @example
 * ```json
 * {
 *   "id": "tooltip-1",
 *   "type": "Tooltip",
 *   "state": {
 *     "content": "Add to library",
 *     "side": "top",
 *     "showArrow": true
 *   },
 *   "children": [
 *     {
 *       "id": "button-1",
 *       "type": "Button",
 *       "children": [{ "id": "text-1", "type": "Text", "state": { "content": "+" } }]
 *     }
 *   ]
 * }
 * ```
 */
export const TooltipContainer = ({ id, parentPath = [] }: TooltipContainerProps) => {
  const { childrenIds, attributes, state } = useSduiNodeSubscription({
    nodeId: id,
    schema: tooltipStatesSchema,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

  // Render children as trigger element
  const children = childrenIds.length > 0 ? renderChildren(childrenIds) : null

  // Get content from state, default to empty string
  const content = (state?.content as string) ?? ''

  // Don't render tooltip if no content or children
  if (!content || !children) {
    return <>{children}</>
  }

  // Extract tooltip props from state
  const side = state?.side ?? 'top'
  const sideOffset = state?.sideOffset ?? 4
  const align = state?.align ?? 'center'
  const alignOffset = state?.alignOffset ?? 0
  const showArrow = state?.showArrow ?? false
  const delayDuration = state?.delayDuration
  const open = state?.open
  const defaultOpen = state?.defaultOpen ?? false

  return (
    <Tooltip.Root open={open} defaultOpen={defaultOpen} delayDuration={delayDuration}>
      <Tooltip.Trigger nodeId={id}>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          nodeId={id}
          {...(attributes as Record<string, unknown>)}
        >
          {content}
          {showArrow && <Tooltip.Arrow />}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}

TooltipContainer.displayName = 'TooltipContainer'
