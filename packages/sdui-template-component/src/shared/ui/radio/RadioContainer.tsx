'use client'

import { useRenderNode, useSduiNodeReference, useSduiNodeSubscription } from '@lodado/sdui-template'
import React from 'react'

import { useRadioGroupContext } from './provider/RadioGroupContext'
import { Radio } from './Radio'
import { radioGroupStateSchema } from './RadioGroupTypes'
import type { RadioRootProps } from './types'
import { radioRootStateSchema } from './types'

interface RadioContainerProps {
  id: string
  parentPath?: string[]
}

/**
 * RadioContainer - SDUI wrapper for Radio Root component
 *
 * @description
 * Connects the Radio Root component to the SDUI store for state management.
 * Subscribes to node state changes and renders Radio.Root with children.
 * Also subscribes to RadioGroup state if inside a RadioGroup (via providerId).
 *
 * @example
 * ```tsx
 * // In SDUI document
 * {
 *   id: 'radio-root',
 *   type: 'Radio',
 *   state: {
 *     disabled: false,
 *     required: true,
 *     error: false,
 *     name: 'option',
 *     providerId: 'radio-group-1' // Optional - inherits from context
 *   },
 *   children: [
 *     { type: 'RadioLabel', ... },
 *     { type: 'RadioRadio', ... }
 *   ]
 * }
 * ```
 */
export const RadioContainer = ({ id, parentPath = [] }: RadioContainerProps) => {
  const { childrenIds, attributes, state } = useSduiNodeSubscription({
    nodeId: id,
    schema: radioRootStateSchema,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })
  const radioGroupContext = useRadioGroupContext()

  // Get providerId from state or context
  const providerId = (state?.providerId as string | undefined) ?? radioGroupContext?.providerId

  // Subscribe to RadioGroup state via reference if providerId exists
  // If providerId is set, use reference field; otherwise use direct subscription
  // Note: reference field takes precedence over state.providerId for better SDUI integration
  const { referencedNodesMap, reference } = useSduiNodeReference({
    nodeId: id,
    schema: radioGroupStateSchema,
  })

  // Get providerId from reference field (if exists) or from state/context
  // reference field takes precedence for better SDUI integration
  const referenceProviderId = Array.isArray(reference) ? reference[0] : reference
  const finalProviderId = referenceProviderId ?? providerId

  // Get referenced RadioGroup state if providerId exists
  const referencedGroup = finalProviderId ? referencedNodesMap[finalProviderId] : undefined
  const groupTypedStateFromReference = referencedGroup?.state as
    | { disabled?: boolean; error?: boolean; required?: boolean }
    | undefined

  // Fallback: if reference doesn't exist, use direct subscription
  // Only subscribe if we don't have reference data
  const { state: directGroupState } = useSduiNodeSubscription({
    nodeId: finalProviderId && !referencedGroup ? finalProviderId : '',
    schema: radioGroupStateSchema,
  })

  const groupTypedStateFromDirect = directGroupState as typeof groupTypedStateFromReference

  // Use referenced state if available, otherwise use direct subscription
  const effectiveGroupState = groupTypedStateFromReference ?? groupTypedStateFromDirect

  // HTML attributes
  const className = attributes?.className as string | undefined

  // State (component state, not HTML attributes)
  // RadioGroup state takes precedence over local state
  const error = (state?.error as RadioRootProps['error'] | undefined) ?? effectiveGroupState?.error
  const required = (state?.required as boolean | undefined) ?? effectiveGroupState?.required
  const disabled = (state?.disabled as boolean | undefined) ?? effectiveGroupState?.disabled
  const name = state?.name as string | undefined

  // Render children (should contain Radio.Label and Radio.Radio)
  const children = childrenIds.length > 0 ? renderChildren(childrenIds) : undefined

  return (
    <Radio.Root
      error={error}
      required={required}
      disabled={disabled}
      name={name}
      className={className}
      nodeId={id}
    >
      {children}
    </Radio.Root>
  )
}

RadioContainer.displayName = 'RadioContainer'
