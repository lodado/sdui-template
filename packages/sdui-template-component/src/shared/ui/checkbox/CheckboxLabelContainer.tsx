'use client'

import { useRenderNode, useSduiNodeSubscription } from '@lodado/sdui-template'
import React from 'react'

import { Checkbox } from './Checkbox'

interface CheckboxLabelContainerProps {
  id: string
  parentPath?: string[]
}

/**
 * CheckboxLabelContainer - SDUI wrapper for Checkbox Label component
 *
 * @description
 * Connects the Checkbox Label component to the SDUI store.
 * Subscribes to node state and renders Checkbox.Label with text or children.
 *
 * @example
 * ```tsx
 * // In SDUI document
 * {
 *   id: 'checkbox-label',
 *   type: 'CheckboxLabel',
 *   state: {
 *     text: 'Accept terms and conditions'
 *   }
 * }
 * ```
 */
export const CheckboxLabelContainer = ({ id, parentPath = [] }: CheckboxLabelContainerProps) => {
  const { childrenIds, attributes, state } = useSduiNodeSubscription({ nodeId: id })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

  const className = attributes?.className as string | undefined
  const labelText = state?.text as string | undefined

  // Render children if any, otherwise use state.text
  const children = childrenIds.length > 0 ? renderChildren(childrenIds) : labelText

  return <Checkbox.Label className={className}>{children}</Checkbox.Label>
}

CheckboxLabelContainer.displayName = 'CheckboxLabelContainer'
