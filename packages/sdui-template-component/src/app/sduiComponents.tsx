'use client'

import { type ComponentFactory } from '@lodado/sdui-template'

import { FormContainer } from '../features/form/Form'
import { FormFieldContainer } from '../features/form/FormField'
import { Title, TitleLogo } from '../features/title/components'
import { ButtonContainer } from '../shared/ui/button/ButtonContainer'
import { CardContainer } from '../shared/ui/card/CardContainer'
import { Div } from '../shared/ui/div/Div'
import { DropdownContainer } from '../shared/ui/dropdown/DropdownContainer'
import { IconContainer } from '../shared/ui/icon/IconContainer'
import { ListContainer } from '../shared/ui/list/ListContainer'
import { TagContainer } from '../shared/ui/tag/TagContainer'
import { Span, Text } from '../shared/ui/text'
import { TextFieldContainer } from '../shared/ui/textfield/TextFieldContainer'
import { TextFieldHelpMessageContainer } from '../shared/ui/textfield/TextFieldHelpMessageContainer'
import { TextFieldInputContainer } from '../shared/ui/textfield/TextFieldInputContainer'
import { TextFieldLabelContainer } from '../shared/ui/textfield/TextFieldLabelContainer'
import { TextFieldWrapperContainer } from '../shared/ui/textfield/TextFieldWrapperContainer'
import { ToggleContainer } from '../shared/ui/toggle/ToggleContainer'
import { TooltipContainer } from '../shared/ui/tooltip/TooltipContainer'

/**
 * Unified SDUI component map for SDUI Layout Renderer
 *
 * Contains all available SDUI components in a flat structure.
 * Use this map with SduiLayoutRenderer to render any SDUI document.
 *
 * @example
 * ```tsx
 * import { sduiComponents } from '@lodado/sdui-template-component'
 * import { SduiLayoutRenderer } from '@lodado/sdui-template'
 *
 * <SduiLayoutRenderer document={document} components={sduiComponents} />
 * ```
 *
 * For forms with validation, register schemas first:
 * @example
 * ```tsx
 * import { sduiComponents, registerSchemas } from '@lodado/sdui-template-component'
 * import { z } from 'zod'
 *
 * const schemas = {
 *   loginForm: z.object({
 *     email: z.string().email(),
 *     password: z.string().min(8),
 *   }),
 * }
 *
 * registerSchemas(schemas)
 * <SduiLayoutRenderer document={document} components={sduiComponents} />
 * ```
 */
export const sduiComponents: Record<string, ComponentFactory> = {
  // Base components
  Div: (id, parentPath) => <Div id={id} parentPath={parentPath} />,
  Text: (id) => <Text id={id} />,
  Span: (id) => <Span id={id} />,

  // Button
  Button: (id, parentPath) => <ButtonContainer id={id} parentPath={parentPath} />,

  // Card
  Card: (id, parentPath) => <CardContainer id={id} parentPath={parentPath} />,

  // Dropdown
  Dropdown: (id, parentPath) => <DropdownContainer id={id} parentPath={parentPath} />,

  // Icon
  Icon: (id, parentPath) => <IconContainer id={id} parentPath={parentPath} />,

  // List
  List: (id, parentPath) => <ListContainer id={id} parentPath={parentPath} />,

  // Tag
  Tag: (id) => <TagContainer id={id} />,

  // TextField
  TextField: (id, parentPath) => <TextFieldContainer id={id} parentPath={parentPath} />,
  TextFieldWrapper: (id, parentPath) => <TextFieldWrapperContainer id={id} parentPath={parentPath} />,
  TextFieldLabel: (id, parentPath) => <TextFieldLabelContainer id={id} parentPath={parentPath} />,
  TextFieldInput: (id, parentPath) => <TextFieldInputContainer id={id} parentPath={parentPath} />,
  TextFieldHelpMessage: (id, parentPath) => <TextFieldHelpMessageContainer id={id} parentPath={parentPath} />,

  // Form
  Form: (id, parentPath) => <FormContainer id={id} parentPath={parentPath} />,
  FormField: (id) => <FormFieldContainer id={id} />,

  // Title
  Title: (id) => <Title id={id} />,
  TitleLeft: (id, parentPath) => <Div id={id} parentPath={parentPath} />,
  TitleMiddle: (id, parentPath) => <Div id={id} parentPath={parentPath} />,
  TitleRight: (id, parentPath) => <Div id={id} parentPath={parentPath} />,
  TitleLogo: (id, parentPath) => <TitleLogo id={id} parentPath={parentPath} />,

  // Toggle
  Toggle: (id) => <ToggleContainer id={id} />,

  // Tooltip
  Tooltip: (id, parentPath) => <TooltipContainer id={id} parentPath={parentPath} />,
}
