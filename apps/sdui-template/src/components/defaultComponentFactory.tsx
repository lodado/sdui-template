/**
 * 기본 컴포넌트 팩토리
 *
 * 노드 타입이 componentMap에 없을 때 사용되는 기본 팩토리입니다.
 * 노드 정보를 표시하고 자식을 렌더링합니다.
 */

import React from 'react'

import { DefaultNodeComponent } from './DefaultNodeComponent'
import type { ComponentFactory } from './types'

/**
 * 기본 컴포넌트 팩토리
 *
 * 노드 타입이 componentMap에 없을 때 사용되는 기본 팩토리입니다.
 * 노드 정보를 표시하고 자식을 렌더링합니다.
 */
export const defaultComponentFactory: ComponentFactory = (id, parentPath) => (
  <DefaultNodeComponent nodeId={id} parentPath={parentPath} />
)
