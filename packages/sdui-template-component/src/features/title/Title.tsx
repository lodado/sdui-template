'use client'

import { type ComponentFactory } from '@lodado/sdui-template'

import { Div } from '../../shared/ui/div'
import { Span } from '../../shared/ui/text'
import { Title as TitleContainer, TitleLogo } from './components'

/**
 * Title component map for SDUI Layout Renderer
 * @returns Component factory map for title components
 */
export function getTitleComponents(): Record<string, ComponentFactory> {
  return {
    Title: (id) => <TitleContainer id={id} />,
    Div: (id, parentPath) => <Div id={id} parentPath={parentPath} />,
    TitleLeft: (id, parentPath) => <Div id={id} parentPath={parentPath} />,
    TitleMiddle: (id, parentPath) => <Div id={id} parentPath={parentPath} />,
    TitleRight: (id, parentPath) => <Div id={id} parentPath={parentPath} />,
    TitleLogo: (id, parentPath) => <TitleLogo id={id} parentPath={parentPath} />,
    Span: (id) => <Span id={id} />,
  }
}
