'use client'

import { useSduiLayoutAction, useSduiNodeSubscription } from '@lodado/sdui-template'
import React, { useCallback } from 'react'

import { Toggle } from './Toggle'
import type { ToggleContainerProps, ToggleProps } from './types'

/**
 * Toggle state schema for SDUI
 */
interface ToggleState {
  isChecked?: boolean
  isDisabled?: boolean
  isLoading?: boolean
  size?: ToggleProps['size']
  label?: string
}

/**
 * ToggleContainer - SDUI wrapper for Toggle component
 *
 * @description
 * Connects the Toggle component to the SDUI store for state management.
 * Subscribes to node state changes and updates the store on toggle.
 *
 * @example
 * ```tsx
 * // In SDUI document
 * {
 *   id: 'feature-toggle',
 *   type: 'Toggle',
 *   state: {
 *     isChecked: false,
 *     label: 'Enable dark mode'
 *   }
 * }
 * ```
 */
export const ToggleContainer: React.FC<ToggleContainerProps> = ({ id }) => {
  const store = useSduiLayoutAction()
  const { state, attributes } = useSduiNodeSubscription({ nodeId: id })

  const toggleState = state as ToggleState
  const toggleAttributes = attributes as Record<string, unknown>

  const handleChange = useCallback(
    (checked: boolean) => {
      store.updateNodeState(id, {
        ...toggleState,
        isChecked: checked,
      })
    },
    [id, store, toggleState],
  )

  return (
    <Toggle
      nodeId={id}
      eventId={`${id}-change`}
      isChecked={toggleState.isChecked ?? false}
      isDisabled={toggleState.isDisabled ?? false}
      isLoading={toggleState.isLoading ?? false}
      size={toggleState.size ?? 'regular'}
      label={toggleState.label}
      onChange={handleChange}
      className={toggleAttributes.className as string | undefined}
    />
  )
}

ToggleContainer.displayName = 'ToggleContainer'
