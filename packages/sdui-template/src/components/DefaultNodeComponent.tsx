'use client'

/**
 * 기본 노드 컴포넌트
 *
 * 노드 타입이 매핑되지 않았을 때 사용되는 기본 컴포넌트입니다.
 * 개발 환경에서 노드 정보를 표시합니다.
 */

import React from 'react'

import { useSduiNodeSubscription } from '../react-wrapper/hooks/useSduiNodeSubscription'
import type { SduiComponentProps } from './types'

/**
 * 기본 노드 컴포넌트
 *
 * 노드 타입이 매핑되지 않았을 때 사용되는 기본 컴포넌트입니다.
 * 개발 환경에서 노드 정보를 표시합니다.
 */
export const DefaultNodeComponent: React.FC<SduiComponentProps> = ({ nodeId: id, parentPath = [] }) => {
  const { type, childrenIds } = useSduiNodeSubscription({
    nodeId: id,
  })

  if (!type) return null

  return (
    <div data-sdui-node-id={id} data-sdui-node-type={type}>
      <div>Type: {type}</div>
      <div>ID: {id}</div>
    </div>
  )
}

DefaultNodeComponent.displayName = 'DefaultNodeComponent'
