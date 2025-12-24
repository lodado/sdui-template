'use client'

/**
 * SDUI Render Node Hook
 *
 * Render Props Pattern을 위한 renderNode 함수를 생성하는 hook입니다.
 * nodes는 React 상태로 관리되므로 useSduiLayoutStores를 통해 가져옵니다.
 */

import { useCallback, useRef } from 'react'

import { defaultComponentFactory } from '../../components/componentMap'
import type { ComponentFactory, RenderNodeFn } from '../../components/types'
import { useSduiLayoutContext } from '../context'

/**
 * renderNode 함수를 생성하는 hook
 *
 * nodes는 React 상태로 관리되므로 변경 시 자동으로 리렌더링됩니다.
 *
 * @param componentMap - 기본 컴포넌트 맵 (선택적)
 * @returns 자식 노드를 렌더링하는 함수
 */
export const useRenderNode = (componentMap?: Record<string, ComponentFactory>): RenderNodeFn => {
  const { store } = useSduiLayoutContext()
  const { nodes } = store

  // renderNode 함수가 자기 자신을 참조할 수 있도록 ref 사용
  const renderNodeRef = useRef<RenderNodeFn | null>(null)

  /**
   * 노드 렌더링 함수 (Render Props)
   *
   * ID를 받아서 해당 노드의 타입에 맞는 컴포넌트를 렌더링합니다.
   * 우선순위: byNodeId[id] > byNodeType[node.type] > componentMap[node.type] > defaultComponentFactory
   */
  const renderNode: RenderNodeFn = useCallback(
    (id: string) => {
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

      // ref를 통해 최신 renderNode 함수 참조
      return factory(id, renderNodeRef.current!)
    },
    [nodes, store, componentMap],
  )

  // ref에 최신 함수 저장
  renderNodeRef.current = renderNode

  return renderNode
}
