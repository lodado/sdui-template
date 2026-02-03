'use client'

/**
 * Default node component.
 *
 * Used when a node type is not mapped.
 * Displays node information in the development environment.
 */

import React from 'react'

import { useSduiNodeSubscription } from '../react-wrapper/hooks/useSduiNodeSubscription'
import type { SduiComponentProps } from './types'

/**
 * Default node component.
 *
 * Used when a node type is not mapped.
 * Displays node information in the development environment.
 */
export const DefaultNodeComponent: React.FC<SduiComponentProps> = ({ nodeId: id, parentPath = [] }) => {
  const { type, childrenIds } = useSduiNodeSubscription({
    nodeId: id,
  })

  if (!type) return null

  return (
    <div data-sdui-node-id={id} data-sdui-node-type={type}>
      <div>Type: {type}</div>
      <div>ID: {id}</div>
    </div>
  )
}

DefaultNodeComponent.displayName = 'DefaultNodeComponent'
