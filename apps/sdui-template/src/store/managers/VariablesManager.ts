/* eslint-disable no-useless-constructor */
/**
 * VariablesManager
 *
 * 전역 변수 관리를 담당합니다.
 */

import { cloneDeep } from "lodash-es";

import type { LayoutStateRepository } from "./LayoutStateRepository";
import type { SubscriptionManager } from "./SubscriptionManager";

/**
 * VariablesManager
 *
 * 전역 변수 관리를 담당합니다.
 */
export class VariablesManager {
  constructor(
    private repository: LayoutStateRepository,
    private subscriptionManager: SubscriptionManager
  ) {}

  /**
   * 전역 변수를 업데이트합니다.
   * 깊은 복사로 새 객체를 생성하여 version을 증가시킵니다.
   *
   * @param variables - 새로운 전역 변수 객체
   */
  updateVariables(variables: Record<string, unknown>): void {
    // 깊은 복사로 새 객체 생성 → version 증가 → 전체 리렌더
    this.repository.updateVariables(cloneDeep(variables));
    this.repository.setEdited(true);
    this.repository.incrementVersion();
    this.subscriptionManager.notifyVersion();
  }

  /**
   * 개별 전역 변수를 업데이트합니다.
   * 깊은 복사로 새 객체를 생성하여 version을 증가시킵니다.
   *
   * @param key - 변수 키
   * @param value - 변수 값
   */
  updateVariable(key: string, value: unknown): void {
    // 깊은 복사로 새 객체 생성 → version 증가 → 전체 리렌더
    const current = this.repository.state.variables;
    this.repository.updateVariables({
      ...cloneDeep(current),
      [key]: cloneDeep(value),
    });
    this.repository.setEdited(true);
    this.repository.incrementVersion();
    this.subscriptionManager.notifyVersion();
  }

  /**
   * 전역 변수를 삭제합니다.
   *
   * @param key - 삭제할 변수 키
   */
  deleteVariable(key: string): void {
    const newVariables = cloneDeep(this.repository.state.variables);
    delete newVariables[key];
    this.repository.updateVariables(newVariables);
    this.repository.setEdited(true);
    this.repository.incrementVersion();
    this.subscriptionManager.notifyVersion();
  }
}



