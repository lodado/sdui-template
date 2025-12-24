/* eslint-disable no-underscore-dangle */
/**
 * LayoutStateRepository
 *
 * 레이아웃 상태 데이터를 저장하고 조회하는 Repository입니다.
 * 상태 저장소의 단일 책임을 담당합니다.
 */

import type { BaseLayoutState, SduiLayoutNode } from "../../schema";
import type { SduiLayoutStoreState } from "../types";

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
  };

  /** 레이아웃 상태 (id → LayoutState) - 구독 시스템으로 관리 */
  private _layoutStates: Record<string, BaseLayoutState> = {};

  /** 레이아웃 속성 (id → attributes) - 구독 시스템으로 관리 */
  private _layoutAttributes: Record<string, Record<string, unknown>> = {};

  // ==================== Getter ====================

  /**
   * Store 상태를 반환합니다.
   */
  get state(): SduiLayoutStoreState {
    return this._state;
  }

  /**
   * 노드 엔티티를 반환합니다.
   */
  get nodes(): Record<string, SduiLayoutNode> {
    return this._state.nodes;
  }

  /**
   * 레이아웃 상태를 반환합니다.
   */
  get layoutStates(): Record<string, BaseLayoutState> {
    return this._layoutStates;
  }

  /**
   * 레이아웃 속성을 반환합니다.
   */
  get layoutAttributes(): Record<string, Record<string, unknown>> {
    return this._layoutAttributes;
  }

  // ==================== Query Methods ====================

  /**
   * ID로 노드를 조회합니다.
   *
   * @param nodeId - 조회할 노드 ID
   * @returns 노드 또는 undefined
   */
  getNodeById(nodeId: string): SduiLayoutNode | undefined {
    return this._state.nodes[nodeId];
  }

  /**
   * ID로 노드 타입을 조회합니다.
   *
   * @param nodeId - 조회할 노드 ID
   * @returns 노드 타입 또는 undefined
   */
  getNodeTypeById(nodeId: string): string | undefined {
    return this._state.nodes[nodeId]?.type;
  }

  /**
   * ID로 자식 노드 ID 목록을 조회합니다.
   *
   * @param nodeId - 조회할 노드 ID
   * @returns 자식 노드 ID 배열 또는 빈 배열
   */
  getChildrenIdsById(nodeId: string): string[] {
    return (this._state.nodes[nodeId] as any)?.childrenIds || [];
  }

  /**
   * ID로 레이아웃 상태를 조회합니다.
   *
   * @param nodeId - 조회할 노드 ID
   * @returns 레이아웃 상태 또는 undefined
   */
  getLayoutStateById(nodeId: string): BaseLayoutState | undefined {
    return this._layoutStates[nodeId];
  }

  /**
   * ID로 속성을 조회합니다.
   *
   * @param nodeId - 조회할 노드 ID
   * @returns 속성 또는 undefined
   */
  getAttributesById(nodeId: string): Record<string, unknown> | undefined {
    return this._layoutAttributes[nodeId];
  }

  /**
   * 루트 노드 ID를 반환합니다.
   *
   * @returns 루트 노드 ID 또는 undefined
   */
  getRootId(): string | undefined {
    return this._state.rootId;
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
      ...initialState,
    };
  }

  /**
   * 노드 엔티티를 업데이트합니다.
   *
   * @param nodes - 노드 엔티티 맵
   */
  updateNodes(nodes: Record<string, SduiLayoutNode>): void {
    this._state.nodes = nodes;
  }

  /**
   * 레이아웃 상태를 업데이트합니다.
   *
   * @param layoutStates - 레이아웃 상태 맵
   */
  updateLayoutStates(layoutStates: Record<string, BaseLayoutState>): void {
    this._layoutStates = layoutStates;
  }

  /**
   * 레이아웃 속성을 업데이트합니다.
   *
   * @param layoutAttributes - 레이아웃 속성 맵
   */
  updateLayoutAttributes(
    layoutAttributes: Record<string, Record<string, unknown>>
  ): void {
    this._layoutAttributes = layoutAttributes;
  }

  /**
   * 특정 노드의 레이아웃 상태를 업데이트합니다.
   *
   * @param nodeId - 노드 ID
   * @param state - 레이아웃 상태
   */
  updateNodeLayoutState(nodeId: string, state: BaseLayoutState): void {
    this._layoutStates[nodeId] = state;
  }

  /**
   * 특정 노드의 레이아웃 속성을 업데이트합니다.
   *
   * @param nodeId - 노드 ID
   * @param attributes - 레이아웃 속성
   */
  updateNodeAttributes(
    nodeId: string,
    attributes: Record<string, unknown>
  ): void {
    this._layoutAttributes[nodeId] = attributes;
  }

  /**
   * 루트 노드 ID를 설정합니다.
   *
   * @param rootId - 루트 노드 ID
   */
  setRootId(rootId: string): void {
    this._state.rootId = rootId;
  }

  /**
   * 선택된 노드 ID를 설정합니다.
   *
   * @param nodeId - 선택된 노드 ID
   */
  setSelectedNodeId(nodeId?: string): string | undefined {
    const previousId = this._state.selectedNodeId;
    this._state.selectedNodeId = nodeId;
    return previousId;
  }

  /**
   * 편집 상태를 설정합니다.
   *
   * @param isEdited - 편집 여부
   */
  setEdited(isEdited: boolean): void {
    this._state.isEdited = isEdited;
  }

  /**
   * 변수를 업데이트합니다.
   *
   * @param variables - 변수 맵
   */
  updateVariables(variables: Record<string, unknown>): void {
    this._state.variables = variables;
  }

  /**
   * version을 증가시킵니다.
   */
  incrementVersion(): void {
    this._state.version += 1;
  }

  /**
   * 상태를 초기화합니다.
   */
  reset(): void {
    this._layoutStates = {};
    this._layoutAttributes = {};
    this._state.nodes = {};
    this._state.rootId = undefined;
    this._state.isEdited = false;
    this._state.selectedNodeId = undefined;
    this._state.variables = {};
    this._state.version += 1;
  }
}


