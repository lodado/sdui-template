'use client'

import { useRenderNode, useSduiLayoutAction, useSduiNodeSubscription } from '@lodado/sdui-template'
import React, { useCallback } from 'react'

import { Dropdown, DropdownMenu } from './Dropdown'
import {
  type DropdownContentState,
  dropdownContentStateSchema,
  type DropdownItemState,
  dropdownItemStateSchema,
  type DropdownMenuProps,
  dropdownMenuStatesSchema,
  type DropdownRootState,
  dropdownRootStateSchema,
  type DropdownTriggerState,
  dropdownTriggerStateSchema,
} from './types'

interface DropdownContainerProps {
  id: string
  parentPath?: string[]
}

/**
 * SDUI Container for DropdownMenu component (legacy)
 *
 * @description
 * Integrates DropdownMenu with the SDUI template system.
 * Subscribes to node state changes and renders the DropdownMenu with current state.
 *
 * If children exist, it renders as a compound pattern Root.
 * Otherwise, it renders the legacy DropdownMenu.
 *
 * @example SDUI Document (compound pattern)
 * ```json
 * {
 *   "id": "dropdown-root",
 *   "type": "Dropdown",
 *   "state": { "open": false, "selectedId": "opt-1" },
 *   "children": [
 *     { "type": "DropdownTrigger", "state": { "providerId": "dropdown-root" }, ... },
 *     { "type": "DropdownContent", "state": { "providerId": "dropdown-root" }, ... }
 *   ]
 * }
 * ```
 */
export const DropdownContainer = ({ id, parentPath = [] }: DropdownContainerProps) => {
  // @ts-expect-error - Zod version compatibility
  const { childrenIds, attributes, state } = useSduiNodeSubscription<typeof dropdownRootStateSchema>({
    nodeId: id,
    schema: dropdownRootStateSchema,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })
  const store = useSduiLayoutAction()

  const typedState = state as DropdownRootState

  // Handle open state change
  const handleOpenChange = useCallback(
    (open: boolean) => {
      store.updateNodeState(id, { open })
    },
    [id, store],
  )

  // If children exist, use compound pattern
  if (childrenIds.length > 0) {
    return (
      <Dropdown.Root open={typedState?.open ?? false} onOpenChange={handleOpenChange}>
        {renderChildren(childrenIds)}
      </Dropdown.Root>
    )
  }

  // Legacy DropdownMenu fallback
  const handleSelect = (selectedId: string) => {
    store.updateNodeState(id, { selectedId })
  }

  const handleSelectionChange = (selectedIds: string[]) => {
    store.updateNodeState(id, { selectedIds })
  }

  const mergedProps: DropdownMenuProps = {
    ...((attributes ?? {}) as DropdownMenuProps),
    ...((state ?? {}) as DropdownMenuProps),
    nodeId: id,
    onSelect: handleSelect,
    onSelectionChange: handleSelectionChange,
  }

  return <DropdownMenu {...mergedProps} />
}

DropdownContainer.displayName = 'DropdownContainer'

// ============================================
// Compound Container Components (providerId pattern)
// ============================================

/**
 * DropdownTriggerContainer - SDUI Container for Dropdown.Trigger
 *
 * @description
 * Subscribes to the provider (Dropdown) via providerId and controls open state.
 * Clicking the trigger toggles the provider's open state.
 *
 * @example SDUI Document
 * ```json
 * {
 *   "id": "trigger",
 *   "type": "DropdownTrigger",
 *   "state": { "providerId": "dropdown-root" },
 *   "children": [{ "type": "Button", ... }]
 * }
 * ```
 */
export const DropdownTriggerContainer = ({ id, parentPath = [] }: DropdownContainerProps) => {
  // @ts-expect-error - Zod version compatibility
  const { childrenIds, state } = useSduiNodeSubscription<typeof dropdownTriggerStateSchema>({
    nodeId: id,
    schema: dropdownTriggerStateSchema,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })
  const store = useSduiLayoutAction()

  const typedState = state as DropdownTriggerState

  // Subscribe to provider state
  const providerId = typedState?.providerId
  // @ts-expect-error - Zod version compatibility
  const { state: providerState } = useSduiNodeSubscription<typeof dropdownRootStateSchema>({
    nodeId: providerId ?? '',
    schema: dropdownRootStateSchema,
  })

  const providerTypedState = providerState as DropdownRootState
  const isOpen = providerTypedState?.open ?? false

  // Toggle provider's open state on click
  const handleClick = useCallback(() => {
    if (providerId) {
      store.updateNodeState(providerId, { open: !isOpen })
    }
  }, [providerId, isOpen, store])

  const children = renderChildren(childrenIds)
  const childArray = React.Children.toArray(children)

  // For asChild pattern, pass single child
  if (childArray.length === 1) {
    return (
      <Dropdown.Trigger asChild onClick={handleClick}>
        {childArray[0]}
      </Dropdown.Trigger>
    )
  }

  // Multiple children: wrap in div
  return (
    <Dropdown.Trigger asChild={false} onClick={handleClick}>
      {children}
    </Dropdown.Trigger>
  )
}

DropdownTriggerContainer.displayName = 'DropdownTriggerContainer'

/**
 * DropdownContentContainer - SDUI Container for Dropdown.Content
 *
 * @description
 * Subscribes to the provider (Dropdown) via providerId for open state.
 * Renders children (DropdownItem) when open.
 *
 * Radix UI props (side, sideOffset, align, alignOffset) are read from state.
 *
 * @example SDUI Document
 * ```json
 * {
 *   "id": "content",
 *   "type": "DropdownContent",
 *   "state": { "providerId": "dropdown-root", "side": "bottom", "sideOffset": 4 },
 *   "children": [
 *     { "type": "DropdownItem", "state": { "providerId": "dropdown-root", "value": "opt-1", "label": "Option 1" } }
 *   ]
 * }
 * ```
 */
export const DropdownContentContainer = ({ id, parentPath = [] }: DropdownContainerProps) => {
  // @ts-expect-error - Zod version compatibility
  const { childrenIds, state } = useSduiNodeSubscription<typeof dropdownContentStateSchema>({
    nodeId: id,
    schema: dropdownContentStateSchema,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

  const typedState = state as DropdownContentState

  // Subscribe to provider state for open check
  const providerId = typedState?.providerId
  // @ts-expect-error - Zod version compatibility
  const { state: providerState } = useSduiNodeSubscription<typeof dropdownRootStateSchema>({
    nodeId: providerId ?? '',
    schema: dropdownRootStateSchema,
  })

  const providerTypedState = providerState as DropdownRootState
  const isOpen = providerTypedState?.open ?? false

  // Don't render if not open (Radix Portal handles this, but explicit for clarity)
  if (!isOpen) return null

  // Read Radix UI props from state (not attributes!)
  const side = typedState?.side
  const sideOffset = typedState?.sideOffset ?? 8
  const align = typedState?.align ?? 'start'
  const alignOffset = typedState?.alignOffset
  const spacing = typedState?.spacing

  return (
    <Dropdown.Content side={side} sideOffset={sideOffset} align={align} alignOffset={alignOffset} spacing={spacing}>
      {renderChildren(childrenIds)}
    </Dropdown.Content>
  )
}

DropdownContentContainer.displayName = 'DropdownContentContainer'

/**
 * DropdownItemContainer - SDUI Container for Dropdown.Item
 *
 * @description
 * Subscribes to the provider (Dropdown) via providerId for selection state.
 * On select, updates provider's selectedId and closes the dropdown.
 *
 * Props (label, disabled) are read from state (Radix UI convention).
 *
 * @example SDUI Document
 * ```json
 * {
 *   "id": "item-1",
 *   "type": "DropdownItem",
 *   "state": { "providerId": "dropdown-root", "value": "opt-1", "label": "Option 1" }
 * }
 * ```
 */
export const DropdownItemContainer = ({ id, parentPath = [] }: DropdownContainerProps) => {
  // @ts-expect-error - Zod version compatibility
  const { state } = useSduiNodeSubscription<typeof dropdownItemStateSchema>({
    nodeId: id,
    schema: dropdownItemStateSchema,
  })
  const store = useSduiLayoutAction()

  const typedState = state as DropdownItemState

  // Subscribe to provider state for selection comparison
  const providerId = typedState?.providerId
  const value = typedState?.value
  const label = typedState?.label
  const disabled = typedState?.disabled

  // @ts-expect-error - Zod version compatibility
  const { state: providerState } = useSduiNodeSubscription<typeof dropdownRootStateSchema>({
    nodeId: providerId ?? '',
    schema: dropdownRootStateSchema,
  })

  const providerTypedState = providerState as DropdownRootState
  const selectedId = providerTypedState?.selectedId
  const isSelected = selectedId === value

  // On select: update provider's selectedId and close dropdown
  const handleSelect = useCallback(() => {
    if (providerId) {
      store.updateNodeState(providerId, { selectedId: value, open: false })
    }
  }, [providerId, value, store])

  return <Dropdown.Item label={label} disabled={disabled} isSelected={isSelected} onSelect={handleSelect} />
}

DropdownItemContainer.displayName = 'DropdownItemContainer'
