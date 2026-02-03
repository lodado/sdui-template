/**
 * Server-Driven UI - Layout-specific document
 *
 * Document type definitions for the layout system.
 */

import type { SduiDocument } from './base'
import type { SduiLayoutNode } from './node'

/**
 * Layout-specific document.
 *
 * Extends SduiDocument and specializes root to SduiLayoutNode.
 */
export interface SduiLayoutDocument extends SduiDocument {
  /** Root node (layout-specific node) */
  root: SduiLayoutNode
}






