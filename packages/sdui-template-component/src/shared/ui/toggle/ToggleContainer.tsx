'use client'

import { useSduiLayoutAction, useSduiNodeSubscription } from '@lodado/sdui-template'
import React, { useCallback } from 'react'

import { Toggle } from './Toggle'
import type { ToggleContainerProps } from './types'
import { toggleStateSchema } from './types'

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
  const { state, attributes } = useSduiNodeSubscription({
    nodeId: id,
    schema: toggleStateSchema,
  })

  const handleChange = useCallback(
    (checked: boolean) => {
      store.updateNodeState(id, {
        ...state,
        isChecked: checked,
      })
    },
    [id, store, state],
  )

  return (
    <Toggle
      nodeId={id}
      eventId={`${id}-change`}
      isChecked={state.isChecked ?? false}
      isDisabled={state.isDisabled ?? false}
      isLoading={state.isLoading ?? false}
      size={state.size ?? 'regular'}
      label={state.label}
      onChange={handleChange}
      className={attributes?.className as string | undefined}
    />
  )
}

ToggleContainer.displayName = 'ToggleContainer'
