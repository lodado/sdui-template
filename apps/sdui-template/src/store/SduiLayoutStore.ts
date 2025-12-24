/* eslint-disable no-underscore-dangle */
/**
 * SDUI Layout Store
 *
 * ID 기반 구독 시스템을 사용하여 SDUI Layout 상태를 관리합니다.
 * 데이터는 일반 변수로 관리하고, 변경 시 해당 노드만 notify하여
 * 구독한 컴포넌트만 forceRender합니다.
 *
 * @description
 * - 성능 최적화: cloneDeep 제거, 변경된 노드만 리렌더링
 * - 구독 시스템: ID별 구독자 관리, 선택적 notify
 */

import { cloneDeep } from "lodash-es";

import type { ComponentFactory } from "../components/types";
import type {
  BaseLayoutState,
  SduiLayoutDocument,
} from "../schema";
import { normalizeSduiLayout } from "../utils/normalize";
import {
  DocumentManager,
  LayoutStateRepository,
  SubscriptionManager,
  VariablesManager,
} from "./managers";
import type {
  SduiLayoutStoreOptions,
  SduiLayoutStoreState,
} from "./types";

// ==================== Store Class ====================

/**
 * SduiLayoutStore
 *
 * Facade Pattern을 사용하여 SDUI Layout 상태를 관리합니다.
 * 여러 매니저 클래스를 조합하여 단일 인터페이스를 제공합니다.
 *
 * @description
 * - SubscriptionManager: 구독 시스템 관리
 * - LayoutStateRepository: 상태 저장소 관리
 * - DocumentManager: 문서 캐싱 및 직렬화
 * - VariablesManager: 전역 변수 관리
 *
 * 모든 데이터는 일반 변수로 관리하고, 구독 시스템을 통해 변경을 감지합니다.
 */
export class SduiLayoutStore {
  // ==================== 매니저 인스턴스 ====================

  /** 구독 시스템 매니저 */
  private _subscriptionManager = new SubscriptionManager();

  /** 상태 저장소 */
  private _repository = new LayoutStateRepository();

  /** 문서 관리자 */
  private _documentManager = new DocumentManager();

  /** 변수 관리자 */
  private _variablesManager: VariablesManager;

  /** 컴포넌트 오버라이드 (일반 변수) - ID와 타입을 하나의 맵으로 관리 */
  private _componentOverrides: Record<string, ComponentFactory> = {};

  constructor(
    initialState?: Partial<SduiLayoutStoreState>,
    options?: SduiLayoutStoreOptions
  ) {
    this._repository.initializeState(initialState);
    this._variablesManager = new VariablesManager(
      this._repository,
      this._subscriptionManager
    );
    this._componentOverrides = options?.componentOverrides || {};
  }

  // ==================== 구독 시스템 메서드 ====================

  /**
   * 특정 노드 ID를 구독합니다.
   *
   * @param nodeId - 구독할 노드 ID
   * @param callback - 변경 시 호출될 콜백 (forceRender)
   * @returns 구독 해제 함수
   */
  subscribeNode(nodeId: string, callback: () => void): () => void {
    return this._subscriptionManager.subscribeNode(nodeId, callback);
  }

  /**
   * version을 구독합니다. (nodes, rootId, variables 변경 감지용)
   *
   * @param callback - 변경 시 호출될 콜백 (forceRender)
   * @returns 구독 해제 함수
   */
  subscribeVersion(callback: () => void): () => void {
    return this._subscriptionManager.subscribeVersion(callback);
  }

  // ==================== Getter (동기적 데이터 접근) ====================

  /**
   * Store 상태를 반환합니다.
   */
  get state(): SduiLayoutStoreState {
    return this._repository.state;
  }

  /**
   * 노드 엔티티를 반환합니다.
   */
  get nodes() {
    return this._repository.nodes;
  }

  /**
   * 레이아웃 상태를 반환합니다.
   */
  get layoutStates() {
    return this._repository.layoutStates;
  }

  /**
   * 레이아웃 속성을 반환합니다.
   */
  get layoutAttributes() {
    return this._repository.layoutAttributes;
  }

  /**
   * 문서 메타데이터를 반환합니다.
   */
  get metadata(): SduiLayoutDocument["metadata"] | undefined {
    return this._documentManager.getMetadata();
  }

  /**
   * 컴포넌트 오버라이드 맵을 반환합니다.
   */
  getComponentOverrides(): Record<string, ComponentFactory> {
    return this._componentOverrides;
  }

  // ==================== Node Query Methods ====================

  /**
   * ID로 노드를 조회합니다.
   *
   * @param nodeId - 조회할 노드 ID
   * @returns 노드 또는 undefined
   */
  getNodeById(nodeId: string) {
    return this._repository.getNodeById(nodeId);
  }

  /**
   * ID로 노드 타입을 조회합니다.
   *
   * @param nodeId - 조회할 노드 ID
   * @returns 노드 타입 또는 undefined
   */
  getNodeTypeById(nodeId: string): string | undefined {
    return this._repository.getNodeTypeById(nodeId);
  }

  /**
   * ID로 자식 노드 ID 목록을 조회합니다.
   *
   * @param nodeId - 조회할 노드 ID
   * @returns 자식 노드 ID 배열 또는 빈 배열
   */
  getChildrenIdsById(nodeId: string): string[] {
    return this._repository.getChildrenIdsById(nodeId);
  }

  /**
   * ID로 레이아웃 상태를 조회합니다.
   *
   * @param nodeId - 조회할 노드 ID
   * @returns 레이아웃 상태 또는 undefined
   */
  getLayoutStateById(nodeId: string): BaseLayoutState | undefined {
    return this._repository.getLayoutStateById(nodeId);
  }

  /**
   * ID로 속성을 조회합니다.
   *
   * @param nodeId - 조회할 노드 ID
   * @returns 속성 또는 undefined
   */
  getAttributesById(nodeId: string): Record<string, unknown> | undefined {
    return this._repository.getAttributesById(nodeId);
  }

  /**
   * 루트 노드 ID를 반환합니다.
   *
   * @returns 루트 노드 ID 또는 undefined
   */
  getRootId(): string | undefined {
    return this._repository.getRootId();
  }

  // ==================== Layout Update Methods ====================

  /**
   * 레이아웃 문서를 업데이트하고 normalize합니다.
   * 전체 문서가 변경되는 경우이므로 version을 증가시켜 전체 리렌더를 트리거합니다.
   *
   * @param document - 업데이트할 레이아웃 문서
   */
  updateLayout(document: SduiLayoutDocument): void {
    const { entities } = normalizeSduiLayout(document);

    // Repository에 상태 업데이트
    this._repository.updateLayoutStates(entities.layoutStates || {});
    this._repository.updateLayoutAttributes(entities.layoutAttributes || {});
    this._repository.updateNodes(entities.nodes || {});
    this._repository.setRootId(document.root.id);
    this._repository.setEdited(false);
    this._repository.updateVariables(
      document.variables ? cloneDeep(document.variables) : {}
    );
    this._repository.incrementVersion();

    // 문서 관리자에 메타데이터 및 캐시 업데이트
    this._documentManager.setMetadata(document.metadata);
    this._documentManager.cacheDocument(document);

    // version 구독자에게 알림
    this._subscriptionManager.notifyVersion();
  }

  /**
   * 레이아웃 변경사항을 취소하고 원본으로 복원합니다.
   *
   * @param documentId - 복원할 문서 ID
   */
  cancelEdit(documentId?: string): void {
    const id =
      documentId ||
      this._documentManager.getDocumentId(this._repository.getRootId());
    if (!id) return;

    const original = this._documentManager.getOriginalDocument(id);
    if (original) {
      this.updateLayout(original);
    }
  }

  // ==================== Node State Update Methods ====================

  /**
   * 특정 노드의 레이아웃 위치를 업데이트합니다.
   * cloneDeep 없이 해당 노드만 업데이트하고 notify합니다.
   *
   * @param nodeId - 업데이트할 노드 ID
   * @param layout - 새로운 레이아웃 위치
   */
  updateNodeLayout(
    nodeId: string,
    layout: Partial<BaseLayoutState["layout"]>
  ): void {
    const currentState = this._repository.getLayoutStateById(nodeId);
    if (!currentState) return;

    // 해당 노드만 얕은 복사로 업데이트 (cloneDeep 없음)
    this._repository.updateNodeLayoutState(nodeId, {
      ...currentState,
      layout: {
        ...currentState.layout,
        ...layout,
      },
    });

    this._repository.setEdited(true);

    // 해당 노드의 구독자만 notify (forceRender)
    this._subscriptionManager.notifyNode(nodeId);
  }

  /**
   * 특정 노드의 상태를 업데이트합니다.
   *
   * @param nodeId - 업데이트할 노드 ID
   * @param state - 새로운 상태
   */
  updateNodeState(nodeId: string, state: Partial<BaseLayoutState>): void {
    const currentState = this._repository.getLayoutStateById(nodeId);
    if (!currentState) return;

    // 해당 노드만 얕은 복사로 업데이트
    this._repository.updateNodeLayoutState(nodeId, {
      ...currentState,
      ...state,
    });

    this._repository.setEdited(true);

    // 해당 노드의 구독자만 notify
    this._subscriptionManager.notifyNode(nodeId);
  }

  /**
   * 특정 노드의 속성을 업데이트합니다.
   *
   * @param nodeId - 업데이트할 노드 ID
   * @param attributes - 새로운 속성
   */
  updateNodeAttributes(
    nodeId: string,
    attributes: Partial<Record<string, unknown>>
  ): void {
    const currentAttributes = this._repository.getAttributesById(nodeId) || {};

    // 해당 노드만 얕은 복사로 업데이트
    this._repository.updateNodeAttributes(nodeId, {
      ...currentAttributes,
      ...attributes,
    });

    this._repository.setEdited(true);

    // 해당 노드의 구독자만 notify
    this._subscriptionManager.notifyNode(nodeId);
  }

  /**
   * 여러 노드의 레이아웃을 일괄 업데이트합니다.
   * 실제로 값이 변경된 노드만 업데이트하고 notify합니다.
   *
   * @param updates - 업데이트할 노드 목록
   */
  updateMultipleNodeLayouts(
    updates: Array<{
      nodeId: string;
      layout: Partial<BaseLayoutState["layout"]>;
    }>
  ): void {
    const changedIds: string[] = [];

    updates.forEach(({ nodeId, layout }) => {
      const currentState = this._repository.getLayoutStateById(nodeId);
      if (!currentState) return;

      const currentLayout = currentState.layout;

      // 실제로 변경되었는지 비교 (x, y, w, h만 비교)
      const hasChanged =
        currentLayout.x !== layout.x ||
        currentLayout.y !== layout.y ||
        currentLayout.w !== layout.w ||
        currentLayout.h !== layout.h;

      // 변경되지 않았으면 스킵
      if (!hasChanged) return;

      // 해당 노드만 얕은 복사로 업데이트
      this._repository.updateNodeLayoutState(nodeId, {
        ...currentState,
        layout: {
          ...currentState.layout,
          ...layout,
        },
      });

      changedIds.push(nodeId);
    });

    if (changedIds.length > 0) {
      this._repository.setEdited(true);

      // 실제로 변경된 노드들만 notify
      this._subscriptionManager.notifyNodes(changedIds);
    }
  }

  // ==================== Variables Update Methods ====================

  /**
   * 전역 변수를 업데이트합니다.
   * 깊은 복사로 새 객체를 생성하여 React 리렌더를 트리거합니다.
   *
   * @param variables - 새로운 전역 변수 객체
   */
  updateVariables(variables: Record<string, unknown>): void {
    this._variablesManager.updateVariables(variables);
  }

  /**
   * 개별 전역 변수를 업데이트합니다.
   * 깊은 복사로 새 객체를 생성하여 version을 증가시킵니다.
   *
   * @param key - 변수 키
   * @param value - 변수 값
   */
  updateVariable(key: string, value: unknown): void {
    this._variablesManager.updateVariable(key, value);
  }

  /**
   * 전역 변수를 삭제합니다.
   *
   * @param key - 삭제할 변수 키
   */
  deleteVariable(key: string): void {
    this._variablesManager.deleteVariable(key);
  }

  // ==================== Selection Methods ====================

  /**
   * 선택된 노드 ID를 설정합니다.
   *
   * @param nodeId - 선택할 노드 ID
   */
  setSelectedNodeId(nodeId?: string): void {
    const previousId = this._repository.setSelectedNodeId(nodeId);

    // 이전 선택 노드와 새 선택 노드 모두 notify
    if (previousId) this._subscriptionManager.notifyNode(previousId);
    if (nodeId) this._subscriptionManager.notifyNode(nodeId);
  }

  // ==================== Document Methods ====================

  /**
   * 현재 상태를 문서로 변환합니다.
   * 저장/내보내기 시에만 사용합니다.
   *
   * @returns 복원된 문서 또는 null
   */
  getDocument(): SduiLayoutDocument | null {
    return this._documentManager.getDocument(this._repository);
  }

  /**
   * 캐시를 초기화합니다.
   */
  clearCache(): void {
    this._documentManager.clearCache();
    this.reset();
  }

  /**
   * 상태를 초기화합니다.
   */
  reset(): void {
    this._documentManager.reset();
    this._repository.reset();
    this._subscriptionManager.notifyVersion();
  }
}


