'use client'

import type { ComponentFactory } from '@lodado/sdui-template'
import { sduiComponents as baseSduiComponents } from '@lodado/sdui-template-component'

import { GridLayoutFactory } from './GridLayout'
import { ShapeTileFactory } from './ShapeTile'

export const sduiComponents: Record<string, ComponentFactory> = {
  ...baseSduiComponents,
  GridLayout: GridLayoutFactory,
  ShapeTile: ShapeTileFactory,
}
