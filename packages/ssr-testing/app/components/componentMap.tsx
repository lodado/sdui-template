'use client'

import type { ComponentFactory } from '@lodado/sdui-template'
import { GridLayoutFactory } from './GridLayout'
import { ToggleFactory } from './Toggle'

/**
 * Component map.
 *
 * Maps component factories by node type.
 */
export const componentMap: Record<string, ComponentFactory> = {
  GridLayout: GridLayoutFactory,
  Toggle: ToggleFactory,
}




