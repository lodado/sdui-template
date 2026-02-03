/**
 * Server-Driven UI - Base schema
 *
 * Defines the base node and document structure for SDUI.
 */

// ==================== Base SDUI Node ====================

/**
 * Base interface for SDUI nodes.
 *
 * Has a recursive structure where each node has id, type, state, and children.
 */
export interface SduiNode {
  /** Node unique identifier */
  id: string

  /** Component type */
  type: string

  /** State (all configuration values and UI state) */
  state?: Record<string, unknown>

  /** Visual style attributes (pure CSS styles only) */
  attributes?: Record<string, unknown>

  /** References to other nodes (single or multiple) */
  reference?: string | string[]

  /** Child node array (recursive structure) */
  children?: SduiNode[]
}

// ==================== Base SDUI Document ====================

/**
 * Base interface for SDUI documents.
 *
 * Root document containing the entire UI structure delivered from the server.
 */
export interface SduiDocument {
  /** Schema version */
  version: string

  /** Document metadata */
  metadata?: {
    id?: string
    name?: string
    description?: string
    createdAt?: string
    updatedAt?: string
    author?: string
  }

  /** Root node */
  root: SduiNode

  /** Global variables */
  variables?: Record<string, unknown>
}
