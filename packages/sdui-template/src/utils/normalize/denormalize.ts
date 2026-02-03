/**
 * SDUI Layout Denormalize
 *
 * Restores a document from normalized entities.
 */

import type { SduiLayoutDocument, SduiLayoutNode } from '../../schema'
import type { NormalizedSduiEntities } from './types'

/**
 * Denormalize a node from normalized entities.
 *
 * @param nodeId - Node ID to restore
 * @param entities - Normalized entities
 * @returns Restored node
 */
export function denormalizeSduiNode(nodeId: string, entities: NormalizedSduiEntities): SduiLayoutNode | null {
  const node = entities.nodes?.[nodeId]
  if (!node) return null

  // Recursively restore children
  // Since children info is not stored separately, look it up in entities.nodes
  // Ideally traverse the node tree to find children,
  // but here we use childrenIds stored on nodes for simplicity
  const childrenIds: string[] = []

  // Find nodes whose parent is the current node by scanning entities.nodes
  // Or use childrenIds if present on the node
  if ((node as any).childrenIds) {
    childrenIds.push(...(node as any).childrenIds)
  }

  const children = childrenIds
    .map((childId: string) => denormalizeSduiNode(childId, entities))
    .filter((child): child is SduiLayoutNode => child !== null)

  return {
    id: node.id,
    type: node.type,
    // Default to an empty object when state is missing
    state: node.state || {},
    // Default to an empty object when attributes are missing
    attributes: node.attributes || {},
    // Pass reference through as-is
    ...(node.reference !== undefined && { reference: node.reference }),
    ...(children.length > 0 && { children }),
  }
}

/**
 * Denormalize a full document from normalized entities.
 *
 * @param rootId - Root node ID
 * @param entities - Normalized entities
 * @param metadata - Document metadata (optional)
 * @returns Restored document
 */
export function denormalizeSduiLayout(
  rootId: string,
  entities: NormalizedSduiEntities,
  metadata?: SduiLayoutDocument['metadata'],
): SduiLayoutDocument | null {
  const rootNode = denormalizeSduiNode(rootId, entities)
  if (!rootNode) return null

  return {
    version: '1.0.0',
    metadata,
    root: rootNode,
  }
}
