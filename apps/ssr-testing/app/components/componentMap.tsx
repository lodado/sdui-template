'use client'

import type { ComponentFactory } from '@lodado/sdui-template'
import { GridLayoutFactory } from './GridLayout'
import { ToggleFactory } from './Toggle'

/**
 * 컴포넌트 맵
 *
 * 노드 타입별로 컴포넌트 팩토리를 매핑합니다.
 */
export const componentMap: Record<string, ComponentFactory> = {
  GridLayout: GridLayoutFactory,
  Toggle: ToggleFactory,
}

