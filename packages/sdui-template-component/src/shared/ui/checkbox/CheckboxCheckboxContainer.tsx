'use client'

import { useSduiLayoutAction, useSduiNodeSubscription } from '@lodado/sdui-template'
import React, { useCallback } from 'react'

import { Checkbox } from './Checkbox'
import type { CheckboxCheckboxContainerProps,CheckboxCheckboxState } from './types'
import { checkboxCheckboxStateSchema } from './types'

/**
 * CheckboxCheckboxContainer - SDUI wrapper for Checkbox Checkbox component
 *
 * @description
 * Connects the Checkbox Checkbox component to the SDUI store for state management.
 * Subscribes to node state changes and updates the store on checkbox change.
 *
 * @example
 * ```tsx
 * // In SDUI document
 * {
 *   id: 'checkbox-input',
 *   type: 'CheckboxCheckbox',
 *   state: {
 *     checked: false,
 *     indeterminate: false,
 *     disabled: false
 *   }
 * }
 * ```
 */
export const CheckboxCheckboxContainer = ({ id, parentPath = [] }: CheckboxCheckboxContainerProps) => {
  const store = useSduiLayoutAction()
  const { attributes, state } = useSduiNodeSubscription({
    nodeId: id,
    schema: checkboxCheckboxStateSchema,
  })

  const checkboxState = state as CheckboxCheckboxState
  const checkboxAttributes = attributes as Partial<React.ComponentPropsWithoutRef<typeof Checkbox.Checkbox>> | undefined

  const handleCheckedChange = useCallback(
    (checked: boolean) => {
      store.updateNodeState(id, {
        ...checkboxState,
        checked,
        // Clear indeterminate when explicitly checked/unchecked
        indeterminate: false,
      })
    },
    [id, store, checkboxState],
  )

  return (
    <Checkbox.Checkbox
      checked={checkboxState?.checked ?? false}
      defaultChecked={checkboxAttributes?.defaultChecked}
      indeterminate={checkboxState?.indeterminate ?? false}
      disabled={checkboxState?.disabled}
      onCheckedChange={handleCheckedChange}
      className={checkboxAttributes?.className}
      nodeId={id}
      id={checkboxAttributes?.id}
      name={checkboxAttributes?.name}
    />
  )
}

CheckboxCheckboxContainer.displayName = 'CheckboxCheckboxContainer'
