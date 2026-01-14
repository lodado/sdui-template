'use client'

/**
 * SDUI Render Node Hook
 *
 * Render Props Pattern을 위한 renderNode 함수를 생성하는 hook입니다.
 * useSyncExternalStore를 사용하여 nodes 변경을 구독합니다.
 * 현재 노드의 정보와 currentPath를 자동으로 계산하여 반환합니다.
 */

import React, { useCallback, useMemo } from 'react'

import { defaultComponentFactory } from '../../components/defaultComponentFactory'
import type { ComponentFactory, ParentPath, RenderNodeFn } from '../../components/types'
import { buildCurrentPath, buildCurrentPathArray } from '../../utils/parentPath'
import { useSduiLayoutContext } from '../context'

/**
 * useRenderNode hook의 파라미터 타입
 */
export interface UseRenderNodeParams {
  /** 현재 노드 ID */
  nodeId: string
  /** 기본 컴포넌트 맵 (선택적) */
  componentMap?: Record<string, ComponentFactory>
  /** 부모 노드 ID 경로 (기본값: []) */
  parentPath?: ParentPath
}

/**
 * useRenderNode hook의 반환 타입
 */
export interface UseRenderNodeReturn {
  /** 자식 노드를 렌더링하는 함수 */
  renderNode: RenderNodeFn
  /** 자식 노드 ID 배열을 받아서 React children 배열로 변환하는 함수 */
  renderChildren: (childrenIds: string[]) => React.ReactNode[]
  /** 현재 노드까지의 경로 배열 (자동 계산) */
  currentPath: ParentPath
  /** 현재 노드까지의 경로 문자열 (자동 계산) */
  pathString: string
  /** 현재 노드 ID */
  nodeId: string
  /** 부모 노드 ID 경로 */
  parentPath: ParentPath
}

/**
 * renderNode 함수를 생성하는 hook
 *
 * useSyncExternalStore를 사용하여 nodes 변경을 구독하고,
 * 변경 시 자동으로 리렌더링됩니다.
 * 현재 노드의 정보와 currentPath를 자동으로 계산하여 반환합니다.
 *
 * @param params - 노드 정보를 포함한 파라미터 객체
 * @param params.nodeId - 현재 노드 ID
 * @param params.componentMap - 기본 컴포넌트 맵 (선택적)
 * @param params.parentPath - 부모 노드 ID 경로 (기본값: [])
 * @returns 노드 정보와 렌더링 함수를 포함한 객체
 */
export const useRenderNode = ({ nodeId, componentMap, parentPath = [] }: UseRenderNodeParams): UseRenderNodeReturn => {
  const { store } = useSduiLayoutContext()

  // lastModified 객체 참조가 변경되면 nodes를 다시 읽어옴
  // useSyncExternalStore가 lastModified 객체 참조 변경을 감지하면 리렌더링됨
  const { nodes } = store.state

  // currentPath와 pathString을 자동으로 계산
  const currentPath = useMemo(() => buildCurrentPathArray(parentPath, nodeId), [parentPath, nodeId])
  const pathString = useMemo(() => buildCurrentPath(parentPath, nodeId), [parentPath, nodeId])

  /**
   * 노드 렌더링 함수 (Render Props)
   *
   * ID를 받아서 해당 노드의 타입에 맞는 컴포넌트를 렌더링합니다.
   * 우선순위: byNodeId[id] > byNodeType[node.type] > componentMap[node.type] > defaultComponentFactory
   * parentPath는 디버깅을 위한 부모 노드 ID 경로입니다.
   */
  const renderNode: RenderNodeFn = useCallback(
    (id: string, parentPathForChild: ParentPath = []) => {
      const node = nodes[id]
      if (!node) return null

      const overrides = store.getComponentOverrides()
      const componentMapEntries = componentMap || {}

      // 우선순위에 따라 팩토리 선택
      // 1. ID 기반 오버라이드 (최우선)
      // 2. 타입 기반 오버라이드 (store의 componentOverrides)
      // 3. componentMap의 타입 기반 매핑
      // 4. 기본 팩토리
      const factory = overrides[id] || overrides[node.type] || componentMapEntries[node.type] || defaultComponentFactory

      // factory에는 현재 노드의 parentPath를 전달
      // 컴포넌트 내부에서 useRenderNode hook을 사용하여 자식 노드를 렌더링할 수 있습니다
      return factory(id, parentPathForChild)
    },
    [nodes, store, componentMap],
  )

  /**
   * 자식 노드 ID 배열을 받아서 React children 배열로 변환하는 함수
   *
   * @param childrenIds - 자식 노드 ID 배열
   * @returns React children 배열 (각 요소에 key가 포함됨)
   */
  const renderChildren = useCallback(
    (childrenIds: string[]): React.ReactNode[] => {
      return childrenIds.map((childId) => {
        const child = renderNode(childId, currentPath)
        return React.isValidElement(child) ? React.cloneElement(child, { key: childId }) : child
      })
    },
    [renderNode, currentPath],
  )

  return {
    renderNode,
    renderChildren,
    currentPath,
    pathString,
    nodeId,
    parentPath,
  }
}
