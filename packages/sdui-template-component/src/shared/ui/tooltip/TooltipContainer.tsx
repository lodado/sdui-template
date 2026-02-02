'use client'

import { useRenderNode, useSduiNodeSubscription } from '@lodado/sdui-template'
import React from 'react'

import { Tooltip } from './Tooltip'
import { type TooltipState, tooltipStatesSchema } from './types'
import { useTooltipState } from './useTooltipState'

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

  const renderedChildren = renderChildren(childrenIds)
  const { content, side, sideOffset, align, alignOffset, showArrow, delayDuration, open, defaultOpen } = state

  const { finalOpen, handleOpenChange, handleTouchStart } = useTooltipState({ open, defaultOpen })

  if (!content) {
    return <>{renderedChildren}</>
  }

  return (
    <Tooltip.Root open={finalOpen} defaultOpen={defaultOpen} onOpenChange={handleOpenChange} delayDuration={delayDuration}>
      <Tooltip.Trigger asChild nodeId={id} onTouchStart={handleTouchStart}>
        <span
          style={{ display: 'inline-block' }}

        >
          {renderedChildren}
        </span>
      </Tooltip.Trigger>
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
