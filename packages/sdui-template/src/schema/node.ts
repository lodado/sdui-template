/**
 * Server-Driven UI - Layout-specific node
 *
 * Node type definitions for the layout system.
 */

import type { SduiNode } from './base'

/**
 * Layout-specific node.
 *
 * Extends SduiNode and specializes state for layout.
 */
export interface SduiLayoutNode extends SduiNode {
  /** Component type */
  type: string

  /** Layout state */
  state?: Record<string, unknown>

  /** Child node array (recursive structure) */
  children?: SduiLayoutNode[]

  /** Child node ID array (added during normalization, not in the original document) */
  childrenIds?: string[]

  /** Parent node ID (added during normalization, root is undefined, not in the original document) */
  parentId?: string
}
