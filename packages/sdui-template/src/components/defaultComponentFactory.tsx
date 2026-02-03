/**
 * Default component factory.
 *
 * Used when a node type is not present in the componentMap.
 * Displays node info and renders children.
 */

import React from 'react'

import { DefaultNodeComponent } from './DefaultNodeComponent'
import type { ComponentFactory } from './types'

/**
 * Default component factory.
 *
 * Used when a node type is not present in the componentMap.
 * Displays node info and renders children.
 */
export const defaultComponentFactory: ComponentFactory = (id, parentPath) => (
  <DefaultNodeComponent nodeId={id} parentPath={parentPath} />
)
