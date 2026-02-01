'use client'

import { useRenderNode, useSduiLayoutAction, useSduiNodeSubscription } from '@lodado/sdui-template'
import React, { useCallback } from 'react'

import { DropdownMenu } from './Dropdown'
import { type DropdownMenuProps, dropdownMenuStatesSchema } from './types'

interface DropdownContainerProps {
  id: string
  parentPath?: string[]
}

/**
 * SDUI Container for DropdownMenu component
 *
 * @description
 * Integrates DropdownMenu with the SDUI template system.
 * Subscribes to node state changes and renders the DropdownMenu with current state.
 *
 * Supports:
 * - State-driven options and selection
 * - Multi-select mode with state synchronization
 *
 * @example SDUI Document
 * ```json
 * {
 *   "id": "dropdown-1",
 *   "type": "Dropdown",
 *   "attributes": {
 *     "triggerLabel": "Select items",
 *     "isMultiSelect": true,
 *     "options": [
 *       { "id": "1", "label": "Option 1" },
 *       { "id": "2", "label": "Option 2" }
 *     ]
 *   },
 *   "state": {
 *     "selectedIds": ["1"]
 *   }
 * }
 * ```
 */
export const DropdownContainer = ({ id, parentPath = [] }: DropdownContainerProps) => {
  const { childrenIds, attributes, state } = useSduiNodeSubscription({
    nodeId: id,
    schema: dropdownMenuStatesSchema,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })
  const store = useSduiLayoutAction()

  // Handle single select
  const handleSelect = useCallback(
    (selectedId: string) => {
      // Update node state
      store.updateNodeState(id, { selectedId })
    },
    [id, store],
  )

  // Handle multi-select
  const handleSelectionChange = useCallback(
    (selectedIds: string[]) => {
      // Update node state
      store.updateNodeState(id, { selectedIds })
    },
    [id, store],
  )

  // Render custom trigger if children exist
  const children = childrenIds.length > 0 ? renderChildren(childrenIds) : undefined

  // Merge attributes and state
  const mergedProps: DropdownMenuProps = {
    ...((attributes ?? {}) as DropdownMenuProps),
    ...((state ?? {}) as DropdownMenuProps),
    nodeId: id,
    onSelect: handleSelect,
    onSelectionChange: handleSelectionChange,
  }

  return <DropdownMenu {...mergedProps}>{children}</DropdownMenu>
}

DropdownContainer.displayName = 'DropdownContainer'
