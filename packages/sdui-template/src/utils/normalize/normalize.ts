/* eslint-disable no-lonely-if */
/**
 * SDUI Layout Normalize
 *
 * Uses normalizr to normalize SduiLayoutDocument
 * and converts it into entities that can be looked up by id.
 */

import { normalize, schema } from 'normalizr'

import type { SduiLayoutDocument, SduiLayoutNode } from '../../schema'
import type { NormalizedSduiEntities } from './types'

// ==================== Schema Definitions ====================

/**
 * SduiLayoutNode Schema (recursive)
 *
 * Recursively normalizes children.
 * state and attributes are included in the node.
 */
const sduiLayoutNodeSchema = new schema.Entity<Omit<SduiLayoutNode, 'children'>>(
  'nodes',
  {},
  {
    idAttribute: 'id',
    processStrategy: (value: SduiLayoutNode): Omit<SduiLayoutNode, 'children'> => {
      return {
        id: value.id,
        type: value.type,
        // Default to an empty object when state is missing
        state: value.state || {},
        // Default to an empty object when attributes are missing
        attributes: value.attributes || {},
        // Pass reference through as-is
        ...(value.reference !== undefined && { reference: value.reference }),
      }
    },
  },
)

// Define children for the recursive structure (handle circular references)
sduiLayoutNodeSchema.define({
  children: [sduiLayoutNodeSchema],
})

// ==================== Normalize Functions ====================

/**
 * Normalize a SduiLayoutNode into entities.
 *
 * @param node - Node to normalize
 * @returns Normalized result (entities and result)
 */
export function normalizeSduiNode(node: SduiLayoutNode) {
  // Normalize the children array
  const childrenArray = node.children || []
  const normalizedChildren =
    childrenArray.length > 0
      ? normalize(childrenArray, [sduiLayoutNodeSchema])
      : { result: [], entities: { nodes: {} } }

  // Normalize the current node (includes state and attributes)
  const nodeWithoutChildren: Omit<SduiLayoutNode, 'children'> = {
    id: node.id,
    type: node.type,
    // Default to an empty object when state is missing
    state: node.state || {},
    // Default to an empty object when attributes are missing
    attributes: node.attributes || {},
    // Pass reference through as-is
    ...(node.reference !== undefined && { reference: node.reference }),
  }

  const normalizedData = normalize<Omit<SduiLayoutNode, 'children'>, { nodes?: Record<string, any> }, string>(
    nodeWithoutChildren,
    sduiLayoutNodeSchema,
  )

  // Merge entities
  const entities: NormalizedSduiEntities = {
    nodes: {
      ...normalizedData.entities.nodes,
      ...normalizedChildren.entities.nodes,
    },
  }

  // Add childrenIds and parentId to nodes (recursively traverse all nodes)
  const collectNodes = (currentNode: SduiLayoutNode, parentId?: string) => {
    // If the current node exists in entities, add childrenIds and parentId
    if (entities.nodes && entities.nodes[currentNode.id]) {
      entities.nodes[currentNode.id] = {
        ...entities.nodes[currentNode.id],
        childrenIds: currentNode.children?.map((child) => child.id) || [],
        parentId,
      }
    } else {
      // Add node when missing from entities (should not happen, but a safeguard)
      if (entities.nodes) {
        entities.nodes[currentNode.id] = {
          id: currentNode.id,
          type: currentNode.type,
          // Default to an empty object when state is missing
          state: currentNode.state || {},
          // Default to an empty object when attributes are missing
          attributes: currentNode.attributes || {},
          // Pass reference through as-is
          ...(currentNode.reference !== undefined && { reference: currentNode.reference }),
          childrenIds: currentNode.children?.map((child) => child.id) || [],
          parentId,
        }
      }
    }

    // Recursively process child nodes (pass current node ID as parentId)
    if (currentNode.children) {
      currentNode.children.forEach((child) => collectNodes(child, currentNode.id))
    }
  }

  collectNodes(node, undefined) // Root node has parentId set to undefined

  return {
    result: normalizedData.result,
    entities,
  }
}

/**
 * Normalize a SduiLayoutDocument.
 *
 * @param document - Document to normalize
 * @returns Normalized result
 */
export function normalizeSduiLayout(document: SduiLayoutDocument) {
  const { result, entities } = normalizeSduiNode(document.root)

  return {
    result,
    entities,
  }
}
