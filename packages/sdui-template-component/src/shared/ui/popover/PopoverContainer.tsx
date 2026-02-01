'use client'

import { useRenderNode, useSduiLayoutAction, useSduiNodeSubscription } from '@lodado/sdui-template'
import React, { useCallback } from 'react'

import { Popover, usePopoverContext } from './Popover'
import {
  type PopoverCloseState,
  popoverCloseStateSchema,
  type PopoverContainerProps,
  type PopoverContentState,
  popoverContentStateSchema,
  type PopoverRootState,
  popoverRootStateSchema,
  type PopoverTriggerState,
  popoverTriggerStateSchema,
} from './types'

/**
 * PopoverContainer - SDUI Container for Popover component
 *
 * @description
 * Integrates Popover with the SDUI template system.
 * Subscribes to node state changes and renders the Popover with current state.
 *
 * Provides PopoverContext for child components to inherit providerId.
 *
 * @example SDUI Document (compound pattern with providerId inheritance)
 * ```json
 * {
 *   "id": "popover-root",
 *   "type": "Popover",
 *   "state": { "open": false },
 *   "children": [
 *     { "type": "PopoverTrigger", "children": [...] },
 *     { "type": "PopoverContent", "state": { "size": "medium", "side": "bottom" }, "children": [...] }
 *   ]
 * }
 * ```
 */
export const PopoverContainer = ({ id, parentPath = [] }: PopoverContainerProps) => {
  const { childrenIds, state } = useSduiNodeSubscription({
    nodeId: id,
    schema: popoverRootStateSchema,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })
  const store = useSduiLayoutAction()

  const typedState = state as PopoverRootState

  // Handle open state change
  const handleOpenChange = useCallback(
    (open: boolean) => {
      store.updateNodeState(id, { open })
    },
    [id, store],
  )

  return (
    <Popover.Root id={id} open={typedState?.open ?? false} onOpenChange={handleOpenChange}>
      {renderChildren(childrenIds)}
    </Popover.Root>
  )
}

PopoverContainer.displayName = 'PopoverContainer'

// =============================================================================
// SDUI Sub-component Containers (providerId pattern)
// =============================================================================

/**
 * PopoverTriggerContainer - SDUI Container for Popover.Trigger
 *
 * @description
 * Subscribes to the provider (Popover) via providerId and controls open state.
 * Clicking the trigger toggles the provider's open state.
 *
 * If providerId is not specified, it inherits from parent Popover context.
 *
 * @example SDUI Document
 * ```json
 * {
 *   "type": "PopoverTrigger",
 *   "children": [{ "type": "Button", ... }]
 * }
 * ```
 */
export const PopoverTriggerContainer = ({ id, parentPath = [] }: PopoverContainerProps) => {
  const { childrenIds, state } = useSduiNodeSubscription({
    nodeId: id,
    schema: popoverTriggerStateSchema,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })
  const store = useSduiLayoutAction()
  const popoverContext = usePopoverContext()

  const typedState = state as PopoverTriggerState

  // Use providerId from state, fallback to context
  const providerId = typedState?.providerId ?? popoverContext?.providerId

  // Subscribe to provider state
  const { state: providerState } = useSduiNodeSubscription({
    nodeId: providerId ?? '',
    schema: popoverRootStateSchema,
  })

  const providerTypedState = providerState as PopoverRootState
  const isOpen = providerTypedState?.open ?? false

  // Toggle provider's open state on click
  const handleClick = useCallback(() => {
    if (providerId) {
      store.updateNodeState(providerId, { open: !isOpen })
    }
  }, [providerId, isOpen, store])

  // asChild requires exactly one child element
  if (childrenIds.length === 0) {
    return (
      <Popover.Trigger asChild={false} onClick={handleClick}>
        Open
      </Popover.Trigger>
    )
  }

  const children = renderChildren(childrenIds)
  const childArray = React.Children.toArray(children)

  // asChild requires exactly one child
  if (childArray.length === 1) {
    return (
      <Popover.Trigger asChild onClick={handleClick}>
        {childArray[0]}
      </Popover.Trigger>
    )
  }

  // Multiple children - wrap in div
  return (
    <Popover.Trigger asChild={false} onClick={handleClick}>
      {children}
    </Popover.Trigger>
  )
}

PopoverTriggerContainer.displayName = 'PopoverTriggerContainer'

/**
 * PopoverContentContainer - SDUI Container for Popover.Content
 *
 * @description
 * Subscribes to the provider (Popover) via providerId for open state.
 * Renders children when the popover is open.
 *
 * If providerId is not specified, it inherits from parent Popover context.
 *
 * Radix UI props (side, sideOffset, align, alignOffset) are read from state.
 *
 * @example SDUI Document
 * ```json
 * {
 *   "type": "PopoverContent",
 *   "state": { "size": "medium", "side": "bottom", "sideOffset": 4 },
 *   "children": [...]
 * }
 * ```
 */
export const PopoverContentContainer = ({ id, parentPath = [] }: PopoverContainerProps) => {
  const { childrenIds, state } = useSduiNodeSubscription({
    nodeId: id,
    schema: popoverContentStateSchema,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })
  const popoverContext = usePopoverContext()

  const typedState = state as PopoverContentState

  // Use providerId from state, fallback to context (for future use)
  const providerId = typedState?.providerId ?? popoverContext?.providerId

  // Read Radix UI props from state (not attributes!)
  const size = typedState?.size ?? 'medium'
  const side = typedState?.side ?? 'bottom'
  const sideOffset = typedState?.sideOffset ?? 4
  const align = typedState?.align ?? 'start'
  const alignOffset = typedState?.alignOffset

  return (
    <Popover.Content size={size} side={side} sideOffset={sideOffset} align={align} alignOffset={alignOffset}>
      {renderChildren(childrenIds)}
    </Popover.Content>
  )
}

PopoverContentContainer.displayName = 'PopoverContentContainer'

/**
 * PopoverCloseContainer - SDUI Container for Popover.Close
 *
 * @description
 * Subscribes to the provider (Popover) via providerId.
 * Close button updates provider's open state to false.
 *
 * If providerId is not specified, it inherits from parent Popover context.
 *
 * @example SDUI Document
 * ```json
 * {
 *   "type": "PopoverClose",
 *   "children": [{ "type": "Button", "state": { "text": "Close" } }]
 * }
 * ```
 */
export const PopoverCloseContainer = ({ id }: PopoverContainerProps) => {
  const { childrenIds, state } = useSduiNodeSubscription({
    nodeId: id,
    schema: popoverCloseStateSchema,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath: [] })
  const store = useSduiLayoutAction()
  const popoverContext = usePopoverContext()

  const typedState = state as PopoverCloseState

  // Use providerId from state, fallback to context
  const providerId = typedState?.providerId ?? popoverContext?.providerId

  // Handle close button click
  const handleClose = useCallback(() => {
    if (providerId) {
      store.updateNodeState(providerId, { open: false })
    }
  }, [providerId, store])

  // If has children, render them inside Close
  if (childrenIds.length > 0) {
    const children = renderChildren(childrenIds)
    const childArray = React.Children.toArray(children)

    if (childArray.length === 1) {
      return (
        <Popover.Close asChild onClick={handleClose}>
          {childArray[0]}
        </Popover.Close>
      )
    }

    return (
      <Popover.Close asChild={false} onClick={handleClose}>
        {children}
      </Popover.Close>
    )
  }

  // Default: render X icon
  return <Popover.Close onClick={handleClose} />
}

PopoverCloseContainer.displayName = 'PopoverCloseContainer'
