/* eslint-disable no-underscore-dangle */
/**
 * LayoutStateRepository
 *
 * 레이아웃 상태 데이터를 저장하고 조회하는 Repository입니다.
 * 상태 저장소의 단일 책임을 담당합니다.
 */

import type { SduiLayoutNode } from '../../schema'
import type { SduiLayoutStoreState } from '../types'

/**
 * LayoutStateRepository
 *
 * 레이아웃 상태 데이터를 저장하고 조회합니다.
 */
export class LayoutStateRepository {
  /** Store 상태 (일반 변수) */
  private _state: SduiLayoutStoreState = {
    version: 0,
    rootId: undefined,
    nodes: {},
    selectedNodeId: undefined,
    isEdited: false,
    variables: {},
    lastModified: {},
  }

  // ==================== Getter ====================

  /**
   * Store 상태를 반환합니다.
   */
  get state(): SduiLayoutStoreState {
    return this._state
  }

  /**
   * 노드 엔티티를 반환합니다.
   */
  get nodes(): Record<string, SduiLayoutNode> {
    return this._state.nodes
  }

  // ==================== Query Methods ====================

  /**
   * ID로 노드를 조회합니다.
   *
   * @param nodeId - 조회할 노드 ID
   * @returns 노드 또는 undefined
   */
  getNodeById(nodeId: string): SduiLayoutNode | undefined {
    return this._state.nodes[nodeId]
  }

  /**
   * ID로 노드 타입을 조회합니다.
   *
   * @param nodeId - 조회할 노드 ID
   * @returns 노드 타입 또는 undefined
   */
  getNodeTypeById(nodeId: string): string | undefined {
    return this._state.nodes[nodeId]?.type
  }

  /**
   * ID로 자식 노드 ID 목록을 조회합니다.
   *
   * @param nodeId - 조회할 노드 ID
   * @returns 자식 노드 ID 배열 또는 빈 배열
   */
  getChildrenIdsById(nodeId: string): string[] {
    return (this._state.nodes[nodeId] as any)?.childrenIds || []
  }

  /**
   * 루트 노드 ID를 반환합니다.
   *
   * @returns 루트 노드 ID 또는 undefined
   */
  getRootId(): string | undefined {
    return this._state.rootId
  }

  /**
   * 노드의 마지막 수정 시간을 반환합니다.
   *
   * @param nodeId - 노드 ID
   * @returns 마지막 수정 시간 (ISO timestamp) 또는 undefined
   */
  getLastModified(nodeId: string): string | undefined {
    return this._state.lastModified[nodeId]
  }

  // ==================== Update Methods (Internal) ====================

  /**
   * 초기 상태를 설정합니다.
   *
   * @param initialState - 초기 상태
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
   * 노드 엔티티를 업데이트합니다.
   *
   * @param nodes - 노드 엔티티 맵
   */
  updateNodes(nodes: Record<string, SduiLayoutNode>): void {
    this._state.nodes = nodes
    // 모든 노드에 대한 타임스탬프 업데이트 (새 객체 생성하여 참조 변경)
    const timestamp = new Date().toISOString()
    const newLastModified: Record<string, string> = {}
    Object.keys(nodes).forEach((nodeId) => {
      newLastModified[nodeId] = timestamp
    })
    this._state.lastModified = newLastModified
  }

  /**
   * 특정 노드를 삭제합니다.
   *
   * @param nodeId - 삭제할 노드 ID
   */
  deleteNode(nodeId: string): void {
    // nodes에서 노드 제거
    const { [nodeId]: deleted, ...remainingNodes } = this._state.nodes
    this._state.nodes = remainingNodes

    // lastModified에서 타임스탬프 제거 (새 객체 생성하여 참조 변경)
    const { [nodeId]: deletedTimestamp, ...remainingLastModified } = this._state.lastModified
    this._state.lastModified = remainingLastModified
  }

  /**
   * 여러 노드를 일괄 삭제합니다.
   *
   * @param nodeIds - 삭제할 노드 ID 배열
   */
  deleteNodes(nodeIds: string[]): void {
    if (nodeIds.length === 0) return

    // nodes에서 노드 제거 (새 객체 생성하여 참조 변경)
    const remainingNodes: Record<string, SduiLayoutNode> = {}
    const nodeIdsSet = new Set(nodeIds)
    Object.keys(this._state.nodes).forEach((nodeId) => {
      if (!nodeIdsSet.has(nodeId)) {
        remainingNodes[nodeId] = this._state.nodes[nodeId]
      }
    })
    this._state.nodes = remainingNodes

    // lastModified에서 타임스탬프 제거 (새 객체 생성하여 참조 변경)
    const remainingLastModified: Record<string, string> = {}
    Object.keys(this._state.lastModified).forEach((nodeId) => {
      if (!nodeIdsSet.has(nodeId)) {
        remainingLastModified[nodeId] = this._state.lastModified[nodeId]
      }
    })
    this._state.lastModified = remainingLastModified
  }

  /**
   * 노드를 병합합니다. 새로운 노드는 추가하고, 기존 노드는 업데이트합니다.
   * 삭제된 노드 ID 목록을 반환합니다.
   *
   * @param nodes - 병합할 노드 엔티티 맵
   * @returns 삭제된 노드 ID 배열
   */
  mergeNodes(nodes: Record<string, SduiLayoutNode>): string[] {
    const existingNodeIds = new Set(Object.keys(this._state.nodes))
    const newNodeIds = new Set(Object.keys(nodes))
    const deletedNodeIds = [...existingNodeIds].filter((id) => !newNodeIds.has(id))

    const timestamp = new Date().toISOString()

    // 기존 노드와 새 노드를 병합 (새 객체 생성하여 참조 변경)
    // 삭제된 노드는 제외하고, 새 노드만 포함
    const mergedNodes: Record<string, SduiLayoutNode> = {}
    const mergedLastModified: Record<string, string> = {}

    // 새 노드 추가 또는 업데이트 (모든 새 노드 맵에 있는 노드는 업데이트된 것으로 간주)
    Object.keys(nodes).forEach((nodeId) => {
      mergedNodes[nodeId] = nodes[nodeId]
      mergedLastModified[nodeId] = timestamp
    })

    this._state.nodes = mergedNodes
    this._state.lastModified = mergedLastModified

    return deletedNodeIds
  }

  /**
   * 특정 노드의 상태를 업데이트합니다.
   *
   * @param nodeId - 노드 ID
   * @param state - 레이아웃 상태
   */
  updateNodeState(nodeId: string, state: Record<string, unknown>): void {
    const node = this._state.nodes[nodeId]
    if (node) {
      this._state.nodes[nodeId] = {
        ...node,
        state,
      }
      // 타임스탬프 업데이트 (새 객체 생성하여 참조 변경)
      this._state.lastModified = {
        ...this._state.lastModified,
        [nodeId]: new Date().toISOString(),
      }
    }
  }

  /**
   * 특정 노드의 속성을 업데이트합니다.
   *
   * @param nodeId - 노드 ID
   * @param attributes - 레이아웃 속성
   */
  updateNodeAttributes(nodeId: string, attributes: Record<string, unknown>): void {
    const node = this._state.nodes[nodeId]
    if (node) {
      this._state.nodes[nodeId] = {
        ...node,
        attributes,
      }
      // 타임스탬프 업데이트 (새 객체 생성하여 참조 변경)
      this._state.lastModified = {
        ...this._state.lastModified,
        [nodeId]: new Date().toISOString(),
      }
    }
  }

  /**
   * 특정 노드의 참조를 업데이트합니다.
   *
   * @param nodeId - 노드 ID
   * @param reference - 참조 (단일 ID 또는 ID 배열)
   */
  updateNodeReference(nodeId: string, reference: string | string[] | undefined): void {
    const node = this._state.nodes[nodeId]
    if (node) {
      this._state.nodes[nodeId] = {
        ...node,
        reference,
      }
      // 타임스탬프 업데이트 (새 객체 생성하여 참조 변경)
      this._state.lastModified = {
        ...this._state.lastModified,
        [nodeId]: new Date().toISOString(),
      }
    }
  }

  /**
   * 루트 노드 ID를 설정합니다.
   *
   * @param rootId - 루트 노드 ID
   */
  setRootId(rootId: string): void {
    this._state.rootId = rootId
  }

  /**
   * 선택된 노드 ID를 설정합니다.
   *
   * @param nodeId - 선택된 노드 ID
   */
  setSelectedNodeId(nodeId?: string): string | undefined {
    const previousId = this._state.selectedNodeId
    this._state.selectedNodeId = nodeId
    return previousId
  }

  /**
   * 편집 상태를 설정합니다.
   *
   * @param isEdited - 편집 여부
   */
  setEdited(isEdited: boolean): void {
    this._state.isEdited = isEdited
  }

  /**
   * 변수를 업데이트합니다.
   *
   * @param variables - 변수 맵
   */
  updateVariables(variables: Record<string, unknown>): void {
    this._state.variables = variables
  }

  /**
   * version을 증가시킵니다.
   */
  incrementVersion(): void {
    this._state.version += 1
  }

  /**
   * 상태를 초기화합니다.
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
