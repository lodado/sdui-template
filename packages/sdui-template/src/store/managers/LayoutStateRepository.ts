/* eslint-disable no-underscore-dangle */
/**
 * LayoutStateRepository
 *
 * Repository for storing and querying layout state data.
 * Handles the single responsibility of state storage.
 */

import type { SduiLayoutNode } from '../../schema'
import type { SduiLayoutStoreState } from '../types'

/**
 * LayoutStateRepository
 *
 * Stores and queries layout state data.
 * Manages normalized node entities with parent-child relationships.
 */
export class LayoutStateRepository {
  /** Store state (plain object) */
  private _state: SduiLayoutStoreState = {
    version: 0,
    rootId: undefined,
    nodes: {},
    selectedNodeId: undefined,
    isEdited: false,
    variables: {},
    lastModified: {},
  }

  // ==================== Getters ====================

  /**
   * Returns the current store state.
   *
   * @returns Current store state
   */
  get state(): SduiLayoutStoreState {
    return this._state
  }

  /**
   * Returns all node entities.
   *
   * @returns Node entities map (nodeId → SduiLayoutNode)
   */
  get nodes(): Record<string, SduiLayoutNode> {
    return this._state.nodes
  }

  // ==================== Query Methods ====================

  /**
   * Gets a node by its ID.
   *
   * @param nodeId - Node ID to query
   * @returns Node entity or undefined if not found
   */
  getNodeById(nodeId: string): SduiLayoutNode | undefined {
    return this._state.nodes[nodeId]
  }

  /**
   * Gets the node type by node ID.
   *
   * @param nodeId - Node ID to query
   * @returns Node type or undefined if not found
   */
  getNodeTypeById(nodeId: string): string | undefined {
    return this._state.nodes[nodeId]?.type
  }

  /**
   * Gets child node IDs by parent node ID.
   *
   * @param nodeId - Parent node ID to query
   * @returns Array of child node IDs, or empty array if not found
   */
  getChildrenIdsById(nodeId: string): string[] {
    return (this._state.nodes[nodeId] as any)?.childrenIds || []
  }

  /**
   * Returns the root node ID.
   *
   * @returns Root node ID or undefined if not set
   */
  getRootId(): string | undefined {
    return this._state.rootId
  }

  /**
   * Gets the last modified timestamp for a node.
   *
   * @param nodeId - Node ID to query
   * @returns Last modified timestamp (ISO string) or undefined if not found
   */
  getLastModified(nodeId: string): string | undefined {
    return this._state.lastModified[nodeId]
  }

  // ==================== Update Methods (Internal) ====================

  /**
   * Initializes the store state.
   *
   * @param initialState - Optional initial state to merge
   */
  initializeState(initialState?: Partial<SduiLayoutStoreState>): void {
    this._state = {
      version: 0,
      rootId: undefined,
      nodes: {},
      selectedNodeId: undefined,
      isEdited: false,
      variables: {},
      lastModified: {},
      ...initialState,
    }
  }

  /**
   * Updates all node entities.
   * Replaces the entire nodes map and updates lastModified timestamps for all nodes.
   *
   * @param nodes - Node entities map to set
   */
  updateNodes(nodes: Record<string, SduiLayoutNode>): void {
    this._state.nodes = nodes
    // Update timestamps for all nodes (create new object to change reference)
    const timestamp = new Date().toISOString()
    const newLastModified: Record<string, string> = {}
    Object.keys(nodes).forEach((nodeId) => {
      newLastModified[nodeId] = timestamp
    })
    this._state.lastModified = newLastModified
  }

  /**
   * Deletes a specific node and its lastModified timestamp.
   *
   * @param nodeId - Node ID to delete
   */
  deleteNode(nodeId: string): void {
    // Remove node from nodes
    const { [nodeId]: deleted, ...remainingNodes } = this._state.nodes
    this._state.nodes = remainingNodes

    // Remove timestamp from lastModified (create new object to change reference)
    const { [nodeId]: deletedTimestamp, ...remainingLastModified } = this._state.lastModified
    this._state.lastModified = remainingLastModified
  }

  /**
   * Deletes multiple nodes in batch.
   * Removes nodes and their lastModified timestamps.
   *
   * @param nodeIds - Array of node IDs to delete
   */
  deleteNodes(nodeIds: string[]): void {
    if (nodeIds.length === 0) return

    // Remove nodes from nodes (create new object to change reference)
    const remainingNodes: Record<string, SduiLayoutNode> = {}
    const nodeIdsSet = new Set(nodeIds)
    Object.keys(this._state.nodes).forEach((nodeId) => {
      if (!nodeIdsSet.has(nodeId)) {
        remainingNodes[nodeId] = this._state.nodes[nodeId]
      }
    })
    this._state.nodes = remainingNodes

    // Remove timestamps from lastModified (create new object to change reference)
    const remainingLastModified: Record<string, string> = {}
    Object.keys(this._state.lastModified).forEach((nodeId) => {
      if (!nodeIdsSet.has(nodeId)) {
        remainingLastModified[nodeId] = this._state.lastModified[nodeId]
      }
    })
    this._state.lastModified = remainingLastModified
  }

  /**
   * Merges nodes into the existing state.
   *
   * This method performs an incremental update of the node tree:
   * - Adds new nodes
   * - Updates existing nodes (preserving their state)
   * - Tracks deleted nodes
   * - Updates lastModified timestamps strategically
   *
   * **Key Mechanism: Parent-only lastModified Update**
   *
   * When nodes are updated, only their **parent nodes'** lastModified timestamps
   * are updated to the current timestamp. The updated nodes themselves keep their
   * existing lastModified values. This allows tracking when a node's children change
   * without marking the children themselves as modified.
   *
   * **Process:**
   * 1. Calculate deleted nodes (nodes that exist in state but not in the new nodes map)
   * 2. Copy existing lastModified map to preserve timestamps for unchanged nodes
   * 3. For each node in the new nodes map:
   *    - If node exists: merge with existing node, preserving its state and lastModified
   *    - If node is new: add as-is and set new timestamp
   *    - Collect parentId of each updated/new node
   * 4. Update lastModified timestamps only for parent nodes of updated/new nodes
   * 5. Replace state with merged results
   *
   * **Example:**
   * ```
   * Before: root (parent: undefined) -> child1 (parent: "root")
   * After merge: child1 is updated
   * Result: root.lastModified = new timestamp (updated)
   *         child1.lastModified = old timestamp (preserved)
   * ```
   *
   * @param nodes - Node entity map to merge (must be normalized with parentId and childrenIds)
   * @returns Array of deleted node IDs (nodes that were in state but not in the new map)
   */
  mergeNodes(nodes: Record<string, SduiLayoutNode>): string[] {
    const existingNodeIds = new Set(Object.keys(this._state.nodes))
    const newNodeIds = new Set(Object.keys(nodes))
    const deletedNodeIds = [...existingNodeIds].filter((id) => !newNodeIds.has(id))

    const timestamp = new Date().toISOString()

    // Merge existing and new nodes (create new object to change reference)
    const mergedNodes: Record<string, SduiLayoutNode> = {}

    // Step 1: Copy existing lastModified to preserve timestamps for unchanged nodes
    const { lastModified } = this._state
    const mergedLastModified: Record<string, string> = { ...lastModified }

    // Step 2: Collect parent IDs of all updated/new nodes
    const parentIdsToUpdate = new Set<string>()

    // Add or update nodes
    Object.keys(nodes).forEach((nodeId) => {
      const existingNode = this._state.nodes[nodeId]
      const newNode = nodes[nodeId]
      const { parentId } = newNode

      if (existingNode) {
        // If existing node exists, preserve state and update only other properties
        mergedNodes[nodeId] = {
          ...newNode,
          // Preserve existing state (preserve user-modified state)
          state: existingNode.state || newNode.state || {},
        }
        // Updated node keeps its existing lastModified (already copied in step 1)
        // mergedLastModified[nodeId] already has the existing value, so it remains unchanged
      } else {
        // Add new nodes as-is
        mergedNodes[nodeId] = newNode
        // New nodes get new timestamp
        mergedLastModified[nodeId] = timestamp
      }

      // Collect parentId of updated/new node
      if (parentId) {
        parentIdsToUpdate.add(parentId)
      }
    })

    // Step 3: Update lastModified timestamps only for parent nodes
    parentIdsToUpdate.forEach((parentId) => {
      // Check if parent node exists in merged nodes or current state
      if (mergedNodes[parentId] || this._state.nodes[parentId]) {
        mergedLastModified[parentId] = timestamp
      }
    })

    this._state.nodes = mergedNodes
    this._state.lastModified = mergedLastModified

    return deletedNodeIds
  }

  /**
   * Updates the state of a specific node.
   *
   * @param nodeId - Node ID to update
   * @param state - Layout state to set
   */
  updateNodeState(nodeId: string, state: Record<string, unknown>): void {
    const node = this._state.nodes[nodeId]
    if (node) {
      this._state.nodes[nodeId] = {
        ...node,
        state,
      }
      // Update timestamp (create new object to change reference)
      this._state.lastModified = {
        ...this._state.lastModified,
        [nodeId]: new Date().toISOString(),
      }
    }
  }

  /**
   * Updates the attributes of a specific node.
   *
   * @param nodeId - Node ID to update
   * @param attributes - Layout attributes to set
   */
  updateNodeAttributes(nodeId: string, attributes: Record<string, unknown>): void {
    const node = this._state.nodes[nodeId]
    if (node) {
      this._state.nodes[nodeId] = {
        ...node,
        attributes,
      }
      // Update timestamp (create new object to change reference)
      this._state.lastModified = {
        ...this._state.lastModified,
        [nodeId]: new Date().toISOString(),
      }
    }
  }

  /**
   * Updates the reference of a specific node.
   *
   * @param nodeId - Node ID to update
   * @param reference - Reference (single ID, array of IDs, or undefined)
   */
  updateNodeReference(nodeId: string, reference: string | string[] | undefined): void {
    const node = this._state.nodes[nodeId]
    if (node) {
      this._state.nodes[nodeId] = {
        ...node,
        reference,
      }
      // Update timestamp (create new object to change reference)
      this._state.lastModified = {
        ...this._state.lastModified,
        [nodeId]: new Date().toISOString(),
      }
    }
  }

  /**
   * Sets the root node ID.
   *
   * @param rootId - Root node ID to set
   */
  setRootId(rootId: string): void {
    this._state.rootId = rootId
  }

  /**
   * Sets the selected node ID.
   *
   * @param nodeId - Selected node ID (undefined to deselect)
   * @returns Previous selected node ID
   */
  setSelectedNodeId(nodeId?: string): string | undefined {
    const previousId = this._state.selectedNodeId
    this._state.selectedNodeId = nodeId
    return previousId
  }

  /**
   * Sets the edited state.
   *
   * @param isEdited - Whether the layout is being edited
   */
  setEdited(isEdited: boolean): void {
    this._state.isEdited = isEdited
  }

  /**
   * Updates global variables.
   *
   * @param variables - Variables map to set
   */
  updateVariables(variables: Record<string, unknown>): void {
    this._state.variables = variables
  }

  /**
   * Increments the version number.
   * Used to trigger re-renders when state changes.
   */
  incrementVersion(): void {
    this._state.version += 1
  }

  /**
   * Resets the state to initial values.
   * Clears all nodes, variables, and resets flags.
   */
  reset(): void {
    this._state.nodes = {}
    this._state.rootId = undefined
    this._state.isEdited = false
    this._state.selectedNodeId = undefined
    this._state.variables = {}
    this._state.lastModified = {}
    this._state.version += 1
  }
}
