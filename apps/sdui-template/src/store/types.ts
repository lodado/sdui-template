/**
 * Server-Driven UI - Store Types
 *
 * Store 상태 및 옵션 타입 정의
 */

import type { ReactNode } from 'react'

import type { ParentPath } from '../components/types'
import type { SduiLayoutNode } from '../schema'

/**
 * 자식 노드 렌더링 함수 타입 (Render Props)
 *
 * 상위에서 주입되어 자식 노드를 렌더링할 때 사용합니다.
 * parentPath는 디버깅을 위한 부모 노드 ID 경로입니다.
 */
export type RenderNodeFn = (childId: string, parentPath?: ParentPath) => ReactNode

/**
 * 컴포넌트 팩토리 타입
 *
 * id, renderNode, parentPath를 받아서 컴포넌트를 렌더링합니다.
 * parentPath는 디버깅을 위한 부모 노드 ID 경로입니다 (예: ['root', 'container-1']).
 */
export type ComponentFactory = (id: string, renderNode: RenderNodeFn, parentPath?: ParentPath) => ReactNode

/**
 * Store 상태
 *
 * nodes, rootId, variables 등은 일반 변수로 관리하고
 * version을 구독하여 변경을 감지합니다.
 */
export interface SduiLayoutStoreState {
  /** 전체 리렌더 트리거용 버전 */
  version: number

  /** 루트 노드 ID (트리 구조 변경 시 리렌더 필요) */
  rootId?: string

  /** 노드 엔티티 (id → node) - 컴포넌트 구조 정의 */
  nodes: Record<string, SduiLayoutNode>

  /** 선택된 노드 ID */
  selectedNodeId?: string

  /** 레이아웃 편집 상태 */
  isEdited?: boolean

  /** 전역 변수 (깊은 복사로 리렌더 트리거) */
  variables: Record<string, unknown>

  /** 노드별 마지막 수정 시간 (nodeId → ISO timestamp) */
  lastModified: Record<string, string>
}

/**
 * SduiLayoutStore 생성 옵션
 */
export interface SduiLayoutStoreOptions {
  /** 컴포넌트 오버라이드 맵 (ID 우선, 없으면 타입으로 조회) */
  componentOverrides?: Record<string, ComponentFactory>
}
