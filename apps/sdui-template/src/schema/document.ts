/**
 * Server-Driven UI - Layout 전용 문서
 *
 * Layout 시스템을 위한 문서 타입 정의
 */

import type { SduiDocument } from './base'
import type { SduiLayoutNode } from './node'

/**
 * Layout 전용 문서
 *
 * SduiDocument를 상속받아 root를 SduiLayoutNode로 구체화합니다.
 */
export interface SduiLayoutDocument extends SduiDocument {
  /** 루트 노드 (Layout 전용 노드) */
  root: SduiLayoutNode
}




