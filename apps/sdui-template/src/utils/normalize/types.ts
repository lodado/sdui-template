/**
 * Server-Driven UI - Normalized Entities Types
 *
 * Normalize된 엔티티 구조 정의
 */

import type { SduiLayoutNode } from '../../schema'

/**
 * Normalize된 엔티티 구조
 *
 * id를 키로 사용하여 조회 가능한 형태로 변환됩니다.
 */
export interface NormalizedSduiEntities {
  /** 노드 엔티티 (id → SduiLayoutNode, state와 attributes 포함) */
  nodes?: Record<string, SduiLayoutNode>
}
