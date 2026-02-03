/**
 * Server-Driven UI - Store Types
 *
 * Store state and option type definitions
 */

import type { ReactNode } from 'react'

import type { ParentPath } from '../components/types'
import type { SduiLayoutNode } from '../schema'

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

/**
 * Store state
 *
 * nodes, rootId, variables, etc. are stored as regular variables,
 * and changes are detected by subscribing to version.
 */
export interface SduiLayoutStoreState {
  /** Version for triggering full re-renders */
  version: number

  /** Root node ID (re-render needed when the tree structure changes) */
  rootId?: string

  /** Node entities (id → node) - defines the component structure */
  nodes: Record<string, SduiLayoutNode>

  /** Selected node ID */
  selectedNodeId?: string

  /** Layout edit state */
  isEdited?: boolean

  /** Global variables (deep copy triggers re-render) */
  variables: Record<string, unknown>

  /** Last modified time per node (nodeId → ISO timestamp) */
  lastModified: Record<string, string>
}

/**
 * SduiLayoutStore creation options
 */
export interface SduiLayoutStoreOptions {
  /** Component override map (prefer ID, fall back to type) */
  componentOverrides?: Record<string, ComponentFactory>
}
