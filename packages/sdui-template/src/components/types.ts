/**
 * Server-Driven UI - Component System Types
 *
 * Component factory and render function type definitions
 */

import type { ReactNode } from 'react'

/**
 * Parent node ID path type
 *
 * Parent node ID path for debugging.
 * Example: ['root', 'container-1', 'button-1']
 */
export type ParentPath = string[]

/**
 * Common props type for SDUI components
 *
 * Props shared across all SDUI components.
 * Used when ComponentFactory passes props to components.
 */
export interface SduiComponentProps {
  /** Node ID */
  nodeId: string
  /** Parent node ID path for debugging */
  parentPath?: ParentPath
}

/**
 * Child node rendering function type (Render Props)
 *
 * Injected from the parent and used to render child nodes.
 * parentPath is the parent node ID path for debugging.
 */
export type RenderNodeFn = (childId: string, parentPath?: ParentPath) => ReactNode

/**
 * Component factory type
 *
 * Renders a component given id and parentPath.
 * parentPath is the parent node ID path for debugging (e.g., ['root', 'container-1']).
 * Components can render child nodes using the useRenderNode hook.
 */
export type ComponentFactory = (id: string, parentPath?: ParentPath) => ReactNode
