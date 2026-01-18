'use client'

import { type ComponentFactory } from '@lodado/sdui-template'

import { FormContainer } from './features/form/Form'
import { FormFieldContainer } from './features/form/FormField'
import { Title as TitleContainer, TitleLogo } from './features/title/components'
import { ButtonContainer } from './shared/ui/button/ButtonContainer'
import { Div } from './shared/ui/div'
import { IconContainer } from './shared/ui/icon/IconContainer'
import { Span, Text } from './shared/ui/text'
import { TextFieldContainer } from './shared/ui/textfield/TextFieldContainer'
import { TextFieldHelpMessageContainer } from './shared/ui/textfield/TextFieldHelpMessageContainer'
import { TextFieldInputContainer } from './shared/ui/textfield/TextFieldInputContainer'
import { TextFieldLabelContainer } from './shared/ui/textfield/TextFieldLabelContainer'
import { TextFieldWrapperContainer } from './shared/ui/textfield/TextFieldWrapperContainer'

export const defaultComponentMap: Record<string, ComponentFactory> = {
  Button: (id, parentPath) => <ButtonContainer id={id} parentPath={parentPath} />,
  Div: (id, parentPath) => <Div id={id} parentPath={parentPath} />,
  Text: (id) => <Text id={id} />,
  Span: (id) => <Span id={id} />,
  Icon: (id, parentPath) => <IconContainer id={id} parentPath={parentPath} />,
  TextField: (id, parentPath) => <TextFieldContainer id={id} parentPath={parentPath} />,
  TextFieldWrapper: (id, parentPath) => <TextFieldWrapperContainer id={id} parentPath={parentPath} />,
  TextFieldLabel: (id, parentPath) => <TextFieldLabelContainer id={id} parentPath={parentPath} />,
  TextFieldInput: (id, parentPath) => <TextFieldInputContainer id={id} parentPath={parentPath} />,
  TextFieldHelpMessage: (id, parentPath) => <TextFieldHelpMessageContainer id={id} parentPath={parentPath} />,
  Form: (id, parentPath) => <FormContainer id={id} parentPath={parentPath} />,
  FormField: (id) => <FormFieldContainer id={id} />,
  Title: (id) => <TitleContainer id={id} />,
  TitleLeft: (id, parentPath) => <Div id={id} parentPath={parentPath} />,
  TitleMiddle: (id, parentPath) => <Div id={id} parentPath={parentPath} />,
  TitleRight: (id, parentPath) => <Div id={id} parentPath={parentPath} />,
  TitleLogo: (id, parentPath) => <TitleLogo id={id} parentPath={parentPath} />,
}
