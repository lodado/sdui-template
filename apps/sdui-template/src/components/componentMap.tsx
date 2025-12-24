'use client'

/**
 * SDUI Component Map
 *
 * 노드 타입별 컴포넌트 매핑을 정의합니다.
 * Render Props Pattern: renderNode 함수를 상위에서 주입받아 자식을 렌더링합니다.
 *
 * @remarks
 * 기본 componentMap은 비어있습니다. Consumers는 components prop을 통해
 * 자신의 컴포넌트를 제공해야 합니다.
 */

import React, { ReactNode } from 'react'

import { useSduiNodeSubscription } from '../react-wrapper/hooks/useSduiNodeSubscription'
import type { ComponentFactory, RenderNodeFn } from './types'

/**
 * 컴포넌트 맵
 *
 * 노드 타입별로 컴포넌트 팩토리를 매핑합니다.
 * 기본적으로 비어있으며, consumers가 components prop을 통해 제공합니다.
 */
export const componentMap: Record<string, ComponentFactory> = {}

/**
 * 기본 노드 컴포넌트
 *
 * 노드 타입이 매핑되지 않았을 때 사용되는 기본 컴포넌트입니다.
 * 개발 환경에서 노드 정보를 표시합니다.
 */
const DefaultNodeComponent: React.FC<{
  id: string
  renderNode: RenderNodeFn
}> = ({ id, renderNode }) => {
  const { type, childrenIds } = useSduiNodeSubscription({
    nodeId: id,
  })

  if (!type) return null

  return (
    <div data-sdui-node-id={id} data-sdui-node-type={type}>
      <div>Type: {type}</div>
      <div>ID: {id}</div>
      {childrenIds && childrenIds.length > 0 && (
        <div>
          {childrenIds.map((childId: string) => (
            <div key={childId}>{renderNode(childId)}</div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * 기본 컴포넌트 팩토리
 *
 * 노드 타입이 componentMap에 없을 때 사용되는 기본 팩토리입니다.
 * 노드 정보를 표시하고 자식을 렌더링합니다.
 */
export const defaultComponentFactory: ComponentFactory = (id, renderNode) => (
  <DefaultNodeComponent id={id} renderNode={renderNode} />
)

