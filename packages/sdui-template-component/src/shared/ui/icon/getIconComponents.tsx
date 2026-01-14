'use client'

import { type ComponentFactory } from '@lodado/sdui-template'

import { Div } from '../div'
import { Span } from '../text'
import { IconContainer } from './IconContainer'

/**
 * Icon component map for SDUI Layout Renderer
 * @returns Component factory map for icon components
 */
export function getIconComponents(): Record<string, ComponentFactory> {
  return {
    Icon: (id, parentPath) => <IconContainer id={id} parentPath={parentPath} />,
    Div: (id, parentPath) => <Div id={id} parentPath={parentPath} />,
    Span: (id) => <Span id={id} />,
  }
}
