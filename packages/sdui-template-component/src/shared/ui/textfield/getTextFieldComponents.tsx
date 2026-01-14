'use client'

import { type ComponentFactory } from '@lodado/sdui-template'

import { Div } from '../div'
import { IconContainer } from '../icon/IconContainer'
import { Span,Text } from '../text'
import { TextFieldContainer } from './TextFieldContainer'
import { TextFieldHelpMessageContainer } from './TextFieldHelpMessageContainer'
import { TextFieldInputContainer } from './TextFieldInputContainer'
import { TextFieldLabelContainer } from './TextFieldLabelContainer'
import { TextFieldWrapperContainer } from './TextFieldWrapperContainer'

/**
 * TextField component map for SDUI Layout Renderer
 * @returns Component factory map for textfield components
 */
export function getTextFieldComponents(): Record<string, ComponentFactory> {
  return {
    TextField: (id, parentPath) => <TextFieldContainer id={id} parentPath={parentPath} />,
    TextFieldWrapper: (id, parentPath) => <TextFieldWrapperContainer id={id} parentPath={parentPath} />,
    TextFieldLabel: (id, parentPath) => <TextFieldLabelContainer id={id} parentPath={parentPath} />,
    TextFieldInput: (id, parentPath) => <TextFieldInputContainer id={id} parentPath={parentPath} />,
    TextFieldHelpMessage: (id, parentPath) => <TextFieldHelpMessageContainer id={id} parentPath={parentPath} />,
    Div: (id, parentPath) => <Div id={id} parentPath={parentPath} />,
    Text: (id) => <Text id={id} />,
    Span: (id) => <Span id={id} />,
    Icon: (id, parentPath) => <IconContainer id={id} parentPath={parentPath} />,
  }
}
