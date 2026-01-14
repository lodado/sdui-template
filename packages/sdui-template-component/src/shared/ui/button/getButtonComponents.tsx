'use client'

import { type ComponentFactory } from '@lodado/sdui-template'

import { Div } from '../div'
import { Span, Text } from '../text'
import { ButtonContainer } from './ButtonContainer'

/**
 * Button component map for SDUI Layout Renderer
 * @returns Component factory map for button components
 */
export function getButtonComponents(): Record<string, ComponentFactory> {
  return {
    Button: (id, parentPath) => <ButtonContainer id={id} parentPath={parentPath} />,
    Div: (id, parentPath) => <Div id={id} parentPath={parentPath} />,
    Text: (id) => <Text id={id} />,
    Span: (id) => <Span id={id} />,
  }
}
