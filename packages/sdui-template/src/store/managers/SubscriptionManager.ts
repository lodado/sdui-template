/* eslint-disable no-underscore-dangle */
/**
 * SubscriptionManager
 *
 * Manages the subscription system using the Observer pattern.
 * Manages per-ID subscribers and version subscribers.
 */

/**
 * SubscriptionManager
 *
 * A class that manages the subscription system independently.
 */
export class SubscriptionManager {
  /** Per-ID subscriber management (for detecting layoutStates/layoutAttributes changes) */
  private _nodeListeners = new Map<string, Set<() => void>>()

  /** Version subscriber management (for detecting nodes, rootId, variables changes) */
  private _versionListeners = new Set<() => void>()

  /**
   * Subscribe to a specific node ID.
   *
   * @param nodeId - Node ID to subscribe to
   * @param callback - Callback invoked on changes (forceRender)
   * @returns Unsubscribe function
   */
  subscribeNode(nodeId: string, callback: () => void): () => void {
    if (!this._nodeListeners.has(nodeId)) {
      this._nodeListeners.set(nodeId, new Set())
    }
    this._nodeListeners.get(nodeId)!.add(callback)

    return () => {
      this._nodeListeners.get(nodeId)?.delete(callback)
      // Remove from the map when no subscribers remain (memory cleanup)
      if (this._nodeListeners.get(nodeId)?.size === 0) {
        this._nodeListeners.delete(nodeId)
      }
    }
  }

  /**
   * Subscribe to version changes. (for detecting nodes, rootId, variables changes)
   *
   * @param callback - Callback invoked on changes (forceRender)
   * @returns Unsubscribe function
   */
  subscribeVersion(callback: () => void): () => void {
    this._versionListeners.add(callback)
    return () => {
      this._versionListeners.delete(callback)
    }
  }

  /**
   * Notify subscribers of a specific node.
   *
   * @param nodeId - Updated node ID
   */
  notifyNode(nodeId: string): void {
    this._nodeListeners.get(nodeId)?.forEach((callback) => callback())
  }

  /**
   * Notify subscribers of multiple nodes.
   *
   * @param nodeIds - Array of updated node IDs
   */
  notifyNodes(nodeIds: string[]): void {
    // Remove duplicates before notifying
    const uniqueIds = [...new Set(nodeIds)]
    uniqueIds.forEach((nodeId) => this.notifyNode(nodeId))
  }

  /**
   * Notify version subscribers of changes.
   */
  notifyVersion(): void {
    this._versionListeners.forEach((callback) => callback())
  }

  /**
   * Cleans up subscribers for a specific node.
   * Removes the subscriber map for deleted nodes to prevent memory leaks.
   *
   * @param nodeId - Node ID to clean up
   */
  cleanupNode(nodeId: string): void {
    this._nodeListeners.delete(nodeId)
  }

  /**
   * Cleans up subscribers for multiple nodes in batch.
   * Removes subscriber maps for deleted nodes to prevent memory leaks.
   *
   * @param nodeIds - Array of node IDs to clean up
   */
  cleanupNodes(nodeIds: string[]): void {
    nodeIds.forEach((nodeId) => {
      this._nodeListeners.delete(nodeId)
    })
  }
}
