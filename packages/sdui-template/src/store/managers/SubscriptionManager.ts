/* eslint-disable no-underscore-dangle */
/**
 * SubscriptionManager
 *
 * Observer Pattern을 구현하여 구독 시스템을 관리합니다.
 * ID별 구독자와 version 구독자를 관리합니다.
 */

/**
 * SubscriptionManager
 *
 * 구독 시스템을 독립적으로 관리하는 클래스입니다.
 */
export class SubscriptionManager {
  /** ID별 구독자 관리 (layoutStates/layoutAttributes 변경 감지용) */
  private _nodeListeners = new Map<string, Set<() => void>>()

  /** version 구독자 관리 (nodes, rootId, variables 변경 감지용) */
  private _versionListeners = new Set<() => void>()

  /**
   * 특정 노드 ID를 구독합니다.
   *
   * @param nodeId - 구독할 노드 ID
   * @param callback - 변경 시 호출될 콜백 (forceRender)
   * @returns 구독 해제 함수
   */
  subscribeNode(nodeId: string, callback: () => void): () => void {
    if (!this._nodeListeners.has(nodeId)) {
      this._nodeListeners.set(nodeId, new Set())
    }
    this._nodeListeners.get(nodeId)!.add(callback)

    return () => {
      this._nodeListeners.get(nodeId)?.delete(callback)
      // 구독자가 없으면 Map에서 제거 (메모리 정리)
      if (this._nodeListeners.get(nodeId)?.size === 0) {
        this._nodeListeners.delete(nodeId)
      }
    }
  }

  /**
   * version을 구독합니다. (nodes, rootId, variables 변경 감지용)
   *
   * @param callback - 변경 시 호출될 콜백 (forceRender)
   * @returns 구독 해제 함수
   */
  subscribeVersion(callback: () => void): () => void {
    this._versionListeners.add(callback)
    return () => {
      this._versionListeners.delete(callback)
    }
  }

  /**
   * 특정 노드의 구독자에게 변경을 알립니다.
   *
   * @param nodeId - 변경된 노드 ID
   */
  notifyNode(nodeId: string): void {
    this._nodeListeners.get(nodeId)?.forEach((callback) => callback())
  }

  /**
   * 여러 노드의 구독자에게 변경을 알립니다.
   *
   * @param nodeIds - 변경된 노드 ID 배열
   */
  notifyNodes(nodeIds: string[]): void {
    // 중복 제거 후 notify
    const uniqueIds = [...new Set(nodeIds)]
    uniqueIds.forEach((nodeId) => this.notifyNode(nodeId))
  }

  /**
   * version 구독자에게 변경을 알립니다.
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
