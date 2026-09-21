'use client'

import { useSduiLayoutAction, useSduiNodeSubscription } from '@lodado/sdui-template'
import React, { useCallback } from 'react'

import { useRadioGroupContext } from './provider/RadioGroupContext'
import { Radio } from './Radio'
import { radioGroupStateSchema } from './RadioGroupTypes'
import type { RadioRadioContainerProps, RadioRadioState } from './types'
import { radioRadioStateSchema } from './types'

/**
 * RadioRadioContainer - SDUI wrapper for Radio Radio component
 *
 * @description
 * Connects the Radio Radio component to the SDUI store for state management.
 * Subscribes to the provider (RadioGroup) via providerId for selection state.
 * On select, updates provider's value.
 *
 * If providerId is not specified, it inherits from parent RadioGroup context.
 *
 * @example
 * ```tsx
 * // In SDUI document
 * {
 *   id: 'radio-input',
 *   type: 'RadioRadio',
 *   state: {
 *     value: 'option1',
 *     providerId: 'radio-group-1' // Optional - inherits from context
 *   }
 * }
 * ```
 */
export const RadioRadioContainer = ({ id, parentPath = [] }: RadioRadioContainerProps) => {
  const store = useSduiLayoutAction()
  const { attributes, state } = useSduiNodeSubscription({
    nodeId: id,
    schema: radioRadioStateSchema,
  })
  const radioGroupContext = useRadioGroupContext()

  const radioState = state as RadioRadioState
  const radioAttributes = attributes as Partial<React.ComponentPropsWithoutRef<typeof Radio.Radio>> | undefined

  // Use providerId from state, fallback to context
  const providerId = radioState?.providerId ?? radioGroupContext?.providerId

  // Subscribe to provider's state
  const { state: providerState } = useSduiNodeSubscription({
    nodeId: providerId ?? '',
    schema: radioGroupStateSchema,
  })

  const providerTypedState = providerState as { value?: string; disabled?: boolean; error?: boolean }
  const groupValue = providerTypedState?.value
  
  // Determine checked state:
  // - If in RadioGroup (providerId exists): compare value with group's value
  // - If standalone (no providerId): use checked prop from state
  const isChecked = providerId
    ? groupValue === radioState?.value
    : radioState?.checked ?? false

  // On select: update provider's value
  const handleCheckedChange = useCallback(
    (checked: boolean) => {
      if (checked && providerId && radioState?.value) {
        store.updateNodeState(providerId, {
          ...providerTypedState,
          value: radioState.value,
        })
      }
      // Also update local state for non-group radios
      if (!providerId) {
        store.updateNodeState(id, {
          ...radioState,
          checked,
        })
      }
    },
    [id, providerId, radioState, providerTypedState, store],
  )

  return (
    <Radio.Radio
      checked={isChecked}
      defaultChecked={radioAttributes?.defaultChecked}
      disabled={radioState?.disabled ?? providerTypedState?.disabled}
      value={radioState?.value ?? ''}
      onCheckedChange={handleCheckedChange}
      className={radioAttributes?.className}
      nodeId={id}
      id={radioAttributes?.id}
      name={radioAttributes?.name}
    />
  )
}

RadioRadioContainer.displayName = 'RadioRadioContainer'
