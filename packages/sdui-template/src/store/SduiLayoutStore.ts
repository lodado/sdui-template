/* eslint-disable no-underscore-dangle */
/**
 * SDUI Layout Store
 *
 * Manages SDUI Layout state using an ID-based subscription system.
 * Data is stored as regular variables, and on change it notifies only the node
 * so only subscribed components are forced to re-render.
 *
 * @description
 * - Performance optimization: remove cloneDeep, re-render only changed nodes
 * - Subscription system: manage per-ID subscribers, selective notify
 */

import { cloneDeep } from 'lodash-es'

import type { ComponentFactory } from '../components/types'
import type { SduiLayoutDocument } from '../schema'
import { normalizeSduiLayout } from '../utils/normalize'
import { MetadataNotFoundError, NodeNotFoundError, RootNotFoundError } from './errors'
import { DocumentManager, LayoutStateRepository, SubscriptionManager, VariablesManager } from './managers'
import type { SduiLayoutStoreOptions, SduiLayoutStoreState } from './types'

// ==================== Store Class ====================

/**
 * SduiLayoutStore
 *
 * Uses the Facade pattern to manage SDUI Layout state.
 * Combines multiple manager classes into a single interface.
 *
 * @description
 * - SubscriptionManager: manage the subscription system
 * - LayoutStateRepository: manage the state repository
 * - DocumentManager: document caching and serialization
 * - VariablesManager: global variable management
 *
 * All data is stored as regular variables, and changes are detected via the subscription system.
 */
export class SduiLayoutStore {
  // ==================== Manager Instances ====================

  /** Subscription system manager */
  private _subscriptionManager = new SubscriptionManager()

  /** State repository */
  private _repository = new LayoutStateRepository()

  /** Document manager */
  private _documentManager = new DocumentManager()

  /** Variables manager */
  private _variablesManager: VariablesManager

  /** Component overrides (regular variables) - manage ID and type in one map */
  private _componentOverrides: Record<string, ComponentFactory> = {}

  constructor(initialState?: Partial<SduiLayoutStoreState>, options?: SduiLayoutStoreOptions) {
    this._repository.initializeState(initialState)
    this._variablesManager = new VariablesManager(this._repository, this._subscriptionManager)
    this._componentOverrides = options?.componentOverrides || {}
  }

  // ==================== Subscription System Methods ====================

  /**
   * Subscribe to a specific node ID.
   *
   * @param nodeId - Node ID to subscribe to
   * @param callback - Callback invoked on changes (forceRender)
   * @returns Unsubscribe function
   */
  subscribeNode(nodeId: string, callback: () => void): () => void {
    return this._subscriptionManager.subscribeNode(nodeId, callback)
  }

  /**
   * Subscribe to version changes. (for detecting nodes, rootId, variables changes)
   *
   * @param callback - Callback invoked on changes (forceRender)
   * @returns Unsubscribe function
   */
  subscribeVersion(callback: () => void): () => void {
    return this._subscriptionManager.subscribeVersion(callback)
  }

  // ==================== Getter (Synchronous Data Access) ====================

  /**
   * Return store state.
   */
  get state(): SduiLayoutStoreState {
    return this._repository.state
  }

  /**
   * Return a snapshot for useSyncExternalStore.
   * Return the lastModified object reference directly for efficient comparison.
   * Since lastModified is recreated on updates, reference comparison is enough to detect changes.
   *
   * @returns lastModified object reference
   */
  getSnapshot(): Record<string, string> {
    // Return the lastModified object reference directly (reference comparison is enough)
    return this._repository.state.lastModified
  }

  /**
   * Return a server snapshot for useSyncExternalStore.
   * Ensures hydration safety in SSR.
   *
   * @returns lastModified object reference (same as getSnapshot)
   */
  getServerSnapshot(): Record<string, string> {
    return this.getSnapshot()
  }

  /**
   * Return node entities.
   */
  get nodes() {
    return this._repository.nodes
  }

  /**
   * Return document metadata.
   *
   * @throws {MetadataNotFoundError} When metadata is missing
   */
  get metadata(): SduiLayoutDocument['metadata'] {
    const metadata = this._documentManager.getMetadata()
    if (!metadata) {
      throw new MetadataNotFoundError()
    }
    return metadata
  }

  /**
   * Return the component override map.
   */
  getComponentOverrides(): Record<string, ComponentFactory> {
    return this._componentOverrides
  }

  // ==================== Node Query Methods ====================

  /**
   * Get a node by ID.
   *
   * @param nodeId - Node ID to look up
   * @returns Node
   * @throws {NodeNotFoundError} When the node does not exist
   */
  getNodeById(nodeId: string) {
    const node = this._repository.getNodeById(nodeId)
    if (!node) {
      throw new NodeNotFoundError(nodeId)
    }
    return node
  }

  /**
   * Get a node type by ID.
   *
   * @param nodeId - Node ID to look up
   * @returns Node type
   * @throws {NodeNotFoundError} When the node does not exist
   */
  getNodeTypeById(nodeId: string): string {
    const nodeType = this._repository.getNodeTypeById(nodeId)
    if (!nodeType) {
      throw new NodeNotFoundError(nodeId)
    }
    return nodeType
  }

  /**
   * Get child node IDs by ID.
   *
   * @param nodeId - Node ID to look up
   * @returns Array of child node IDs
   * @throws {NodeNotFoundError} When the node does not exist
   */
  getChildrenIdsById(nodeId: string): string[] {
    const node = this._repository.getNodeById(nodeId)
    if (!node) {
      throw new NodeNotFoundError(nodeId)
    }
    return this._repository.getChildrenIdsById(nodeId)
  }

  /**
   * Get layout state by ID.
   *
   * @param nodeId - Node ID to look up
   * @returns Layout state (returns an empty object if missing)
   * @throws {NodeNotFoundError} When the node does not exist
   */
  getLayoutStateById(nodeId: string): Record<string, unknown> {
    const node = this.getNodeById(nodeId)
    // Return an empty object if state is missing (instead of error)
    return node.state || {}
  }

  /**
   * Get attributes by ID.
   *
   * @param nodeId - Node ID to look up
   * @returns Attributes (returns an empty object if missing)
   * @throws {NodeNotFoundError} When the node does not exist
   */
  getAttributesById(nodeId: string): Record<string, unknown> {
    const node = this.getNodeById(nodeId)
    // Return an empty object if attributes are missing (instead of error)
    return node.attributes || {}
  }

  /**
   * Get reference by ID.
   *
   * @param nodeId - Node ID to look up
   * @returns Reference (returns undefined if missing)
   * @throws {NodeNotFoundError} When the node does not exist
   */
  getReferenceById(nodeId: string): string | string[] | undefined {
    const node = this.getNodeById(nodeId)
    return node.reference
  }

  /**
   * Return the root node ID.
   *
   * @returns Root node ID
   * @throws {RootNotFoundError} When the root node ID does not exist
   */
  getRootId(): string {
    const rootId = this._repository.getRootId()
    if (!rootId) {
      throw new RootNotFoundError()
    }
    return rootId
  }

  // ==================== Layout Update Methods ====================

  /**
   * Update and normalize the layout document.
   * Increment version to trigger a full re-render when the entire document changes.
   *
   * @param document - Layout document to update
   */
  updateLayout(document: SduiLayoutDocument): void {
    const { entities } = normalizeSduiLayout(document)

    // Update state in the repository
    this._repository.updateNodes(entities.nodes || {})
    this._repository.setRootId(document.root.id)
    this._repository.setEdited(false)
    this._repository.updateVariables(document.variables ? cloneDeep(document.variables) : {})
    this._repository.incrementVersion()

    // Update metadata and cache in the document manager
    this._documentManager.setMetadata(document.metadata)
    this._documentManager.cacheDocument(document)

    // Notify version subscribers
    this._subscriptionManager.notifyVersion()
  }

  /**
   * Merges layout document.
   * Iterates through nodes, adding/updating only new nodes and removing all states related to deleted nodes.
   *
   * @param document - Layout document to merge
   */
  mergeLayout(document: SduiLayoutDocument): void {
    const { entities } = normalizeSduiLayout(document)
    const newNodes = entities.nodes || {}

    // 1. Calculate deleted node IDs
    const deletedNodeIds = this._repository.mergeNodes(newNodes)

    // 2. Check and reset selectedNodeId
    const currentSelectedNodeId = this._repository.state.selectedNodeId
    if (currentSelectedNodeId && deletedNodeIds.includes(currentSelectedNodeId)) {
      this._repository.setSelectedNodeId(undefined)
    }

    // 3. Clean up subscribers (prevent memory leaks)
    if (deletedNodeIds.length > 0) {
      this._subscriptionManager.cleanupNodes(deletedNodeIds)
    }

    // 4. Remove deleted node states (already handled in mergeNodes, but explicitly cleaned up)
    // mergeNodes already cleaned up nodes and lastModified, so no additional work needed

    // 5. Update root ID
    this._repository.setRootId(document.root.id)

    // 6. Update variables
    this._repository.updateVariables(document.variables ? cloneDeep(document.variables) : {})

    // 7. Reset edit state
    this._repository.setEdited(false)

    // 8. Update metadata and cache in document manager
    this._documentManager.setMetadata(document.metadata)
    this._documentManager.cacheDocument(document)

    // 9. Increment version and notify
    this._repository.incrementVersion()
    this._subscriptionManager.notifyVersion()
  }

  /**
   * Cancel layout changes and restore the original.
   *
   * @param documentId - Document ID to restore
   */
  cancelEdit(documentId?: string): void {
    const rootId = this._repository.getRootId()
    const id = documentId || (rootId ? this._documentManager.getDocumentId(rootId) : undefined)
    if (!id) return

    const original = this._documentManager.getOriginalDocument(id)
    if (original) {
      this.updateLayout(original)
    }
  }
  /**
   * Update a specific node's state.
   *
   * @param nodeId - Node ID to update
   * @param state - New state
   * @throws {NodeNotFoundError} When the node does not exist
   */
  updateNodeState(nodeId: string, state: Partial<Record<string, unknown>>): void {
    const node = this.getNodeById(nodeId)

    // Update the node's state (start with an empty object if state is missing)
    this._repository.updateNodeState(nodeId, {
      ...(node.state || {}),
      ...state,
    })

    this._repository.setEdited(true)

    // Notify subscribers of the node only
    this._subscriptionManager.notifyNode(nodeId)
  }

  /**
   * Update a specific node's attributes.
   *
   * @param nodeId - Node ID to update
   * @param attributes - New attributes
   * @throws {NodeNotFoundError} When the node does not exist
   */
  updateNodeAttributes(nodeId: string, attributes: Partial<Record<string, unknown>>): void {
    const node = this.getNodeById(nodeId)

    // Update the node's attributes
    this._repository.updateNodeAttributes(nodeId, {
      ...(node.attributes || {}),
      ...attributes,
    })

    this._repository.setEdited(true)

    // Notify subscribers of the node only
    this._subscriptionManager.notifyNode(nodeId)
  }

  /**
   * Update a specific node's reference.
   *
   * @param nodeId - Node ID to update
   * @param reference - New reference (single ID or array of IDs, removable with undefined)
   * @throws {NodeNotFoundError} When the node does not exist
   */
  updateNodeReference(nodeId: string, reference: string | string[] | undefined): void {
    // Ensure the node exists
    this.getNodeById(nodeId)

    // Update the node's reference
    this._repository.updateNodeReference(nodeId, reference)

    this._repository.setEdited(true)

    // Notify subscribers of the node only
    this._subscriptionManager.notifyNode(nodeId)
  }

  // ==================== Variables Update Methods ====================

  /**
   * Update global variables.
   * Create a new object via deep copy to trigger a React re-render.
   *
   * @param variables - New global variables object
   */
  updateVariables(variables: Record<string, unknown>): void {
    this._variablesManager.updateVariables(variables)
  }

  /**
   * Update an individual global variable.
   * Increase version by creating a new object via deep copy.
   *
   * @param key - Variable key
   * @param value - Variable value
   */
  updateVariable(key: string, value: unknown): void {
    this._variablesManager.updateVariable(key, value)
  }

  /**
   * Delete a global variable.
   *
   * @param key - Variable key to delete
   */
  deleteVariable(key: string): void {
    this._variablesManager.deleteVariable(key)
  }

  // ==================== Selection Methods ====================

  /**
   * Set the selected node ID.
   *
   * @param nodeId - Node ID to select
   */
  setSelectedNodeId(nodeId?: string): void {
    const previousId = this._repository.setSelectedNodeId(nodeId)

    // Notify both the previous and new selected nodes
    if (previousId) this._subscriptionManager.notifyNode(previousId)
    if (nodeId) this._subscriptionManager.notifyNode(nodeId)
  }

  // ==================== Document Methods ====================

  /**
   * Convert the current state into a document.
   * Used only for save/export.
   *
   * @returns Restored document or null
   */
  getDocument(): SduiLayoutDocument | null {
    return this._documentManager.getDocument(this._repository)
  }

  /**
   * Clear the cache.
   */
  clearCache(): void {
    this._documentManager.clearCache()
    this.reset()
  }

  /**
   * Reset the state.
   */
  reset(): void {
    this._documentManager.reset()
    this._repository.reset()
    this._subscriptionManager.notifyVersion()
  }
}
