'use client'

import { useRenderNode, useSduiNodeSubscription } from '@lodado/sdui-template'
import React from 'react'

import { Checkbox } from './Checkbox'
import type { CheckboxRootProps } from './types'

interface CheckboxContainerProps {
  id: string
  parentPath?: string[]
}

/**
 * CheckboxContainer - SDUI wrapper for Checkbox Root component
 *
 * @description
 * Connects the Checkbox Root component to the SDUI store for state management.
 * Subscribes to node state changes and renders Checkbox.Root with children.
 *
 * @example
 * ```tsx
 * // In SDUI document
 * {
 *   id: 'checkbox-root',
 *   type: 'Checkbox',
 *   state: {
 *     disabled: false,
 *     required: true,
 *     error: false
 *   },
 *   children: [
 *     { type: 'CheckboxLabel', ... },
 *     { type: 'CheckboxCheckbox', ... }
 *   ]
 * }
 * ```
 */
export const CheckboxContainer = ({ id, parentPath = [] }: CheckboxContainerProps) => {
  const { childrenIds, attributes, state } = useSduiNodeSubscription({ nodeId: id })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

  // HTML attributes
  const className = attributes?.className as string | undefined

  // State (component state, not HTML attributes)
  const error = state?.error as CheckboxRootProps['error'] | undefined
  const required = state?.required as boolean | undefined
  const disabled = state?.disabled as boolean | undefined

  // Render children (should contain Checkbox.Label and Checkbox.Checkbox)
  const children = childrenIds.length > 0 ? renderChildren(childrenIds) : undefined

  return (
    <Checkbox.Root
      error={error}
      required={required}
      disabled={disabled}
      className={className}
      nodeId={id}
    >
      {children}
    </Checkbox.Root>
  )
}

CheckboxContainer.displayName = 'CheckboxContainer'
