/**
 * Server-Driven UI - 레이아웃 상태 스키마
 *
 * 레이아웃 위치 및 상태를 정의합니다.
 */

import type { GridLayoutConfig } from './grid'

/**
 * 레이아웃 위치 및 크기
 *
 * react-grid-layout의 각 아이템 위치와 크기 정보를 정의합니다.
 */
export interface LayoutPosition {
  /** 그리드 X 좌표 (0부터 시작) */
  x: number

  /** 그리드 Y 좌표 (0부터 시작) */
  y: number

  /** 그리드 너비 (단위) */
  w: number

  /** 그리드 높이 (단위) */
  h: number

  /** 최소 너비 (단위) */
  minW?: number

  /** 최소 높이 (단위) */
  minH?: number

  /** 최대 너비 (단위) */
  maxW?: number

  /** 최대 높이 (단위) */
  maxH?: number

  /** 고정 여부 (드래그/리사이즈 불가) */
  static?: boolean
}

/**
 * 기본 레이아웃 상태
 *
 * layout 위치와 편집 상태를 포함합니다.
 * 일반 노드들은 이 타입을 사용합니다.
 * Record<string, unknown>을 확장하여 SduiNode의 state 타입과 호환되도록 합니다.
 */
export interface BaseLayoutState extends Record<string, unknown> {
  /** 레이아웃 위치 및 크기 */
  layout: LayoutPosition

  /** 그리드 레이아웃 전역 설정 (선택적) */
  grid?: GridLayoutConfig

  /** 레이아웃 편집 상태 */
  edit?: {
    /** 드래그 중 여부 */
    isDragging?: boolean

    /** 리사이즈 중 여부 */
    isResizing?: boolean

    /** 편집 여부 (변경사항 있음) */
    isEdited?: boolean
  }
}

