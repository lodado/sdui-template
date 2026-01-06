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

import type { ComponentFactory } from './types'

/**
 * 컴포넌트 맵
 *
 * 노드 타입별로 컴포넌트 팩토리를 매핑합니다.
 * 기본적으로 비어있으며, consumers가 components prop을 통해 제공합니다.
 */
export const componentMap: Record<string, ComponentFactory> = {}
