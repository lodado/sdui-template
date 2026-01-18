'use client'

import { type ComponentFactory } from '@lodado/sdui-template'

import { Div } from '../div'
import { Span, Text } from '../text'
import { CardContainer } from './CardContainer'

/**
 * Card component map for SDUI Layout Renderer
 * @returns Component factory map for card components
 */
export function getCardComponents(): Record<string, ComponentFactory> {
  return {
    Card: (id, parentPath) => <CardContainer id={id} parentPath={parentPath} />,
    Div: (id, parentPath) => <Div id={id} parentPath={parentPath} />,
    Text: (id) => <Text id={id} />,
    Span: (id) => <Span id={id} />,
  }
}
