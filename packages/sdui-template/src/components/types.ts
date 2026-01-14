/**
 * Server-Driven UI - Component System Types
 *
 * 컴포넌트 팩토리 및 렌더링 함수 타입 정의
 */

import type { ReactNode } from 'react'

/**
 * 부모 노드 ID 경로 타입
 *
 * 디버깅을 위한 부모 노드 ID 경로입니다.
 * 예: ['root', 'container-1', 'button-1']
 */
export type ParentPath = string[]

/**
 * SDUI 컴포넌트의 공통 Props 타입
 *
 * 모든 SDUI 컴포넌트가 공통으로 사용하는 props입니다.
 * ComponentFactory에서 컴포넌트로 전달할 때 사용합니다.
 */
export interface SduiComponentProps {
  /** 노드 ID */
  nodeId: string
  /** 디버깅을 위한 부모 노드 ID 경로 */
  parentPath?: ParentPath
}

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
 * id, parentPath를 받아서 컴포넌트를 렌더링합니다.
 * parentPath는 디버깅을 위한 부모 노드 ID 경로입니다 (예: ['root', 'container-1']).
 * 컴포넌트 내부에서 useRenderNode hook을 사용하여 자식 노드를 렌더링할 수 있습니다.
 */
export type ComponentFactory = (id: string, parentPath?: ParentPath) => ReactNode
