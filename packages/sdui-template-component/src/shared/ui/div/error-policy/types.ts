import type React from 'react'

/**
 * Error Context
 * 에러가 발생한 위치와 관련 메타데이터
 */
export interface ErrorContext {
  /** SDUI 노드 ID */
  nodeId?: string
  /** 컴포넌트 이름 */
  componentName?: string
  /** 에러 발생 시각 */
  timestamp: number
  /** ErrorBoundary ID (여러 Boundary가 있을 경우 구분) */
  errorBoundaryId?: string
  /** 부모 경로 (SDUI 계층 구조) */
  parentPath?: string[]
  /** 추가 메타데이터 */
  metadata?: Record<string, unknown>
}

/**
 * Error Situation
 * ErrorBoundary에서 Policy로 전달하는 상황 정보
 */
export interface ErrorSituation {
  /** 에러 객체 */
  error: Error
  /** React ErrorInfo (componentDidCatch에서 제공) */
  errorInfo?: React.ErrorInfo

  /** 컨텍스트 정보 */
  context: ErrorContext

  /** 생명주기 정보 */
  lifecycle: {
    /** 현재 생명주기 단계 */
    phase: 'mount' | 'update' | 'unmount' | 'catch' | 'recovery'
    /** 이전 상태 */
    previousState?: {
      hasError: boolean
      error: Error | null
    }
    /** 현재 상태 */
    currentState: {
      hasError: boolean
      error: Error | null
    }
  }

  /** 추가 메타데이터 */
  metadata?: Record<string, unknown>
}

/**
 * Error Policy
 * 에러 상황을 처리하는 정책 인터페이스
 */
export interface ErrorPolicy {
  /**
   * 에러 상황을 처리합니다.
   * @param situation - 에러 상황 정보
   */
  handleSituation(situation: ErrorSituation): void | Promise<void>
}
