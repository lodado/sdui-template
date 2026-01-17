'use client'

import { type ComponentFactory } from '@lodado/sdui-template'

import { Div } from '../div'
import { Span, Text } from '../text'
import { ListContainer } from './ListContainer'

/**
 * List component map for SDUI Layout Renderer
 * @returns Component factory map for list components
 */
export function getListComponents(): Record<string, ComponentFactory> {
  return {
    List: (id, parentPath) => <ListContainer id={id} parentPath={parentPath} />,
    Div: (id, parentPath) => <Div id={id} parentPath={parentPath} />,
    Text: (id) => <Text id={id} />,
    Span: (id) => <Span id={id} />,
  }
}
