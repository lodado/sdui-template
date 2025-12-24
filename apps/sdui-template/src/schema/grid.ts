/**
 * Server-Driven UI - 그리드 레이아웃 설정
 *
 * react-grid-layout 기반 레이아웃 시스템을 위한 그리드 설정 정의
 */

/**
 * 그리드 레이아웃 전역 설정
 *
 * react-grid-layout의 전역 설정값을 정의합니다.
 */
export interface GridLayoutConfig {
  /** 그리드 컬럼 수 (기본값: 12) */
  cols: number

  /** 행 높이 (픽셀, 기본값: 180) */
  rowHeight: number

  /** 마진 [x, y] (픽셀, 기본값: [8, 8]) */
  margin: [number, number]

  /** 컴팩트 타입 */
  compactType?: 'vertical' | 'horizontal' | null

  /** 충돌 방지 여부 */
  preventCollision?: boolean

  /** 최대 행 수 */
  maxRows?: number

  /** 드래그 가능 여부 */
  isDraggable?: boolean

  /** 리사이즈 가능 여부 */
  isResizable?: boolean
}


