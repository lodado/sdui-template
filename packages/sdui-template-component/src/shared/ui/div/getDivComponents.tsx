'use client'

import { type ComponentFactory } from '@lodado/sdui-template'

import { Span,Text } from '../text'
import { Div } from './Div'

/**
 * Div component map for SDUI Layout Renderer
 * @returns Component factory map for div components
 */
export function getDivComponents(): Record<string, ComponentFactory> {
  return {
    Div: (id, parentPath) => <Div id={id} parentPath={parentPath} />,
    Text: (id) => <Text id={id} />,
    Span: (id) => <Span id={id} />,
  }
}
