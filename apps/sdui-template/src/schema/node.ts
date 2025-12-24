/**
 * Server-Driven UI - Layout 전용 노드
 *
 * Layout 시스템을 위한 노드 타입 정의
 */

import type { SduiNode } from './base'
import type { BaseLayoutState } from './state'

/**
 * Layout 전용 노드
 *
 * SduiNode를 상속받아 state를 LayoutState로 구체화합니다.
 */
export interface SduiLayoutNode extends SduiNode {
  /** 컴포넌트 타입 */
  type: string

  /** 레이아웃 상태 */
  state: BaseLayoutState

  /** 자식 노드 배열 (재귀 구조) */
  children?: SduiLayoutNode[]
}



