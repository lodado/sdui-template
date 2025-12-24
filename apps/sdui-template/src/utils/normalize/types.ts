/**
 * Server-Driven UI - Normalized Entities Types
 *
 * Normalize된 엔티티 구조 정의
 */

import type { BaseLayoutState, SduiLayoutNode } from "../../schema";

/**
 * Normalize된 엔티티 구조
 *
 * id를 키로 사용하여 조회 가능한 형태로 변환됩니다.
 */
export interface NormalizedSduiEntities {
  /** 노드 엔티티 (id → SduiLayoutNode) */
  nodes?: Record<string, SduiLayoutNode>;

  /** 레이아웃 상태 엔티티 (id → LayoutState) */
  layoutStates?: Record<string, BaseLayoutState>;

  /** 레이아웃 속성 엔티티 (id → attributes) */
  layoutAttributes?: Record<string, Record<string, unknown>>;
}



