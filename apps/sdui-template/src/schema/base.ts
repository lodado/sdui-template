/**
 * Server-Driven UI - 기본 스키마
 *
 * SDUI의 기본 노드와 문서 구조를 정의합니다.
 */

// ==================== 기본 SDUI 노드 ====================

/**
 * SDUI 노드 기본 인터페이스
 *
 * 재귀적 구조를 가지며, 각 노드는 id, type, state, children을 가집니다.
 */
export interface SduiNode {
  /** 노드 고유 식별자 */
  id: string

  /** 컴포넌트 타입 */
  type: string

  /** 상태 (모든 설정값 및 UI 상태) */
  state?: Record<string, unknown>

  /** 외형 스타일 속성 (순수 CSS 스타일만) */
  attributes?: {
    /** 인라인 스타일 */
    style?: Record<string, string | number>

    /** CSS 클래스명 */
    className?: string
  }

  /** 자식 노드 배열 (재귀 구조) */
  children?: SduiNode[]
}

// ==================== 기본 SDUI 문서 ====================

/**
 * SDUI 문서 기본 인터페이스
 *
 * 서버에서 내려주는 전체 UI 구조를 담는 루트 문서입니다.
 */
export interface SduiDocument {
  /** 스키마 버전 */
  version: string

  /** 문서 메타데이터 */
  metadata?: {
    id?: string
    name?: string
    description?: string
    createdAt?: string
    updatedAt?: string
    author?: string
  }

  /** 루트 노드 */
  root: SduiNode

  /** 전역 변수 */
  variables?: Record<string, unknown>
}
