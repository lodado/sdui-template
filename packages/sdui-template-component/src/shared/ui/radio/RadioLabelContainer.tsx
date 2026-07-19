'use client'

import { useRenderNode, useSduiNodeSubscription } from '@lodado/sdui-template'
import React from 'react'

import { Radio } from './Radio'

interface RadioLabelContainerProps {
  id: string
  parentPath?: string[]
}

/**
 * RadioLabelContainer - SDUI wrapper for Radio Label component
 *
 * @description
 * Connects the Radio Label component to the SDUI store.
 * Subscribes to node state and renders Radio.Label with text or children.
 *
 * @example
 * ```tsx
 * // In SDUI document
 * {
 *   id: 'radio-label',
 *   type: 'RadioLabel',
 *   state: {
 *     text: 'Option 1'
 *   }
 * }
 * ```
 */
export const RadioLabelContainer = ({ id, parentPath = [] }: RadioLabelContainerProps) => {
  const { childrenIds, attributes, state } = useSduiNodeSubscription({ nodeId: id })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

  const className = attributes?.className as string | undefined
  const labelText = state?.text as string | undefined

  // Render children if any, otherwise use state.text
  const children = childrenIds.length > 0 ? renderChildren(childrenIds) : labelText

  return <Radio.Label className={className}>{children}</Radio.Label>
}

RadioLabelContainer.displayName = 'RadioLabelContainer'
