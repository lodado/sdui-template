/**
 * Server-Driven UI - Normalized Entities Types
 *
 * Normalized entity structure definitions
 */

import type { SduiLayoutNode } from '../../schema'

/**
 * Normalized entity structure
 *
 * Converted into a lookup-friendly shape using id as the key.
 */
export interface NormalizedSduiEntities {
  /** Node entities (id → SduiLayoutNode, includes state and attributes) */
  nodes?: Record<string, SduiLayoutNode>
}
