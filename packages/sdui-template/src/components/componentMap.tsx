'use client'

/**
 * SDUI Component Map
 *
 * Defines component mappings by node type.
 * Render Props Pattern: inject renderNode from the parent to render children.
 *
 * @remarks
 * The default componentMap is empty. Consumers must provide their components
 * via the components prop.
 */

import type { ComponentFactory } from './types'

/**
 * Component map.
 *
 * Maps component factories by node type.
 * Empty by default; consumers provide components via the components prop.
 */
export const componentMap: Record<string, ComponentFactory> = {}
