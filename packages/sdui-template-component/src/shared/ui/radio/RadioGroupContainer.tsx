'use client'

import { useRenderNode, useSduiLayoutAction, useSduiNodeSubscription } from '@lodado/sdui-template'
import React, { useCallback } from 'react'

import { RadioGroup } from './RadioGroup'
import type { RadioGroupContainerProps, RadioGroupState } from './RadioGroupTypes'
import { radioGroupStateSchema } from './RadioGroupTypes'

/**
 * RadioGroupContainer - SDUI wrapper for RadioGroup component
 *
 * @description
 * Connects the RadioGroup component to the SDUI store for state management.
 * Subscribes to node state changes and renders RadioGroup with children.
 *
 * @example
 * ```tsx
 * // In SDUI document
 * {
 *   id: 'radio-group',
 *   type: 'RadioGroup',
 *   state: {
 *     value: 'option1',
 *     disabled: false,
 *     required: false,
 *     error: false,
 *     name: 'option'
 *   },
 *   children: [
 *     { type: 'Radio', ... },
 *     { type: 'Radio', ... }
 *   ]
 * }
 * ```
 */
export const RadioGroupContainer = ({ id, parentPath = [] }: RadioGroupContainerProps) => {
  const store = useSduiLayoutAction()
  const { childrenIds, attributes, state } = useSduiNodeSubscription({
    nodeId: id,
    schema: radioGroupStateSchema,
  })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

  const groupState = state as RadioGroupState
  const groupAttributes = attributes as Partial<React.ComponentPropsWithoutRef<typeof RadioGroup>> | undefined

  const handleValueChange = useCallback(
    (value: string) => {
      store.updateNodeState(id, {
        ...groupState,
        value,
      })
    },
    [id, store, groupState],
  )

  // HTML attributes
  const className = groupAttributes?.className as string | undefined

  // State (component state, not HTML attributes)
  const error = groupState?.error as boolean | undefined
  const required = groupState?.required as boolean | undefined
  const disabled = groupState?.disabled as boolean | undefined
  const name = groupState?.name as string | undefined
  const value = groupState?.value as string | undefined
  const defaultValue = groupState?.defaultValue as string | undefined

  // Render children (should contain Radio components)
  const children = childrenIds.length > 0 ? renderChildren(childrenIds) : undefined

  return (
    <RadioGroup
      id={id}
      name={name}
      value={value}
      defaultValue={defaultValue}
      onValueChange={handleValueChange}
      disabled={disabled}
      required={required}
      error={error}
      className={className}
      nodeId={id}
    >
      {children}
    </RadioGroup>
  )
}

RadioGroupContainer.displayName = 'RadioGroupContainer'
