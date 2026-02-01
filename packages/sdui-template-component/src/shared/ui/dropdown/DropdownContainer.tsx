'use client'

import { useRenderNode, useSduiLayoutAction, useSduiNodeSubscription } from '@lodado/sdui-template'
import React, { useCallback } from 'react'

import { Dropdown, DropdownMenu, useDropdownContext } from './Dropdown'
import {
  type DropdownContentState,
  dropdownContentStateSchema,
  type DropdownItemState,
  dropdownItemStateSchema,
  type DropdownMenuProps,
  type DropdownRootState,
  dropdownRootStateSchema,
  type DropdownTriggerState,
  dropdownTriggerStateSchema,
  type DropdownValueState,
  dropdownValueStateSchema,
} from './types'

interface DropdownContainerProps {
  id: string
  // eslint-disable-next-line react/no-unused-prop-types
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
 *     { "type": "DropdownTrigger", ... },
 *     { "type": "DropdownContent", ... }
 *   ]
 * }
 * ```
 */
export const DropdownContainer = ({ id, parentPath = [] }: DropdownContainerProps) => {
  const { childrenIds, attributes, state } = useSduiNodeSubscription({
    nodeId: id,
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
  // Pass id to Root so children can inherit providerId from context
  if (childrenIds.length > 0) {
    return (
      <Dropdown.Root id={id} open={typedState?.open ?? false} onOpenChange={handleOpenChange}>
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
 * If providerId is not specified, it inherits from parent Dropdown context.
 *
 * @example SDUI Document
 * ```json
 * {
 *   "id": "trigger",
 *   "type": "DropdownTrigger",
 *   "children": [{ "type": "Button", ... }]
 * }
 * ```
 */
export const DropdownTriggerContainer = ({ id, parentPath = [] }: DropdownContainerProps) => {
  const { childrenIds, state } = useSduiNodeSubscription({
    nodeId: id,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })
  const store = useSduiLayoutAction()
  const dropdownContext = useDropdownContext()

  const typedState = state as DropdownTriggerState

  // Use providerId from state, fallback to context
  const providerId = typedState?.providerId ?? dropdownContext?.providerId

  const { state: providerState } = useSduiNodeSubscription({
    nodeId: providerId ?? '',
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
 * If providerId is not specified, it inherits from parent Dropdown context.
 *
 * Radix UI props (side, sideOffset, align, alignOffset) are read from state.
 *
 * @example SDUI Document
 * ```json
 * {
 *   "id": "content",
 *   "type": "DropdownContent",
 *   "state": { "side": "bottom", "sideOffset": 4 },
 *   "children": [
 *     { "type": "DropdownItem", "state": { "value": "opt-1", "label": "Option 1" } }
 *   ]
 * }
 * ```
 */
export const DropdownContentContainer = ({ id, parentPath = [] }: DropdownContainerProps) => {
  const { childrenIds, state } = useSduiNodeSubscription({
    nodeId: id,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })
  const dropdownContext = useDropdownContext()

  const typedState = state as DropdownContentState

  // Use providerId from state, fallback to context
  const providerId = typedState?.providerId ?? dropdownContext?.providerId

  // NOTE: Do NOT add `if (!isOpen) return null` here!
  // Radix Portal must always be mounted for the dropdown to work.

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
 * If providerId is not specified, it inherits from parent Dropdown context.
 *
 * Props (label, disabled) are read from state (Radix UI convention).
 *
 * @example SDUI Document
 * ```json
 * {
 *   "id": "item-1",
 *   "type": "DropdownItem",
 *   "state": { "value": "opt-1", "label": "Option 1" }
 * }
 * ```
 */
export const DropdownItemContainer = ({ id }: DropdownContainerProps) => {
  const { state } = useSduiNodeSubscription({
    nodeId: id,
  })
  const store = useSduiLayoutAction()
  const dropdownContext = useDropdownContext()

  const typedState = state as DropdownItemState

  // Use providerId from state, fallback to context
  const providerId = typedState?.providerId ?? dropdownContext?.providerId
  const value = typedState?.value
  const label = typedState?.label
  const disabled = typedState?.disabled

  const { state: providerState } = useSduiNodeSubscription({
    nodeId: providerId ?? '',
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

/**
 * DropdownValueContainer - SDUI Container for Dropdown.Value
 *
 * @description
 * Displays the currently selected option's label inside the trigger.
 * Subscribes to the provider (Dropdown) via providerId and resolves
 * selectedId to the corresponding label from options.
 *
 * If providerId is not specified, it inherits from parent Dropdown context.
 *
 * @example SDUI Document
 * ```json
 * {
 *   "id": "dropdown-value",
 *   "type": "DropdownValue",
 *   "state": {
 *     "placeholder": "Select...",
 *     "options": [
 *       { "id": "opt-1", "label": "Option 1" },
 *       { "id": "opt-2", "label": "Option 2" }
 *     ]
 *   }
 * }
 * ```
 */
export const DropdownValueContainer = ({ id }: DropdownContainerProps) => {
  const { state, attributes } = useSduiNodeSubscription({
    nodeId: id,
  })
  const dropdownContext = useDropdownContext()

  const typedState = state as DropdownValueState

  // Use providerId from state, fallback to context
  const providerId = typedState?.providerId ?? dropdownContext?.providerId
  const options = typedState?.options ?? []
  const placeholder = typedState?.placeholder ?? 'Select...'

  const { state: providerState } = useSduiNodeSubscription({
    nodeId: providerId ?? '',
  })

  const providerTypedState = providerState as DropdownRootState
  const selectedId = providerTypedState?.selectedId

  // Find label for selected option
  const selectedOption = options.find((opt) => opt.id === selectedId)
  const label = selectedOption?.label

  const className = attributes?.className as string | undefined

  return <Dropdown.Value label={label} placeholder={placeholder} className={className} />
}

DropdownValueContainer.displayName = 'DropdownValueContainer'
