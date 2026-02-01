'use client'

import { type ComponentFactory } from '@lodado/sdui-template'

import {
  DialogBodyContainer,
  DialogContainer,
  DialogContentContainer,
  DialogFooterContainer,
  DialogHeaderContainer,
  DialogPortalContainer,
  DialogTriggerContainer,
} from '../features/dialog/DialogContainer'
import { FormContainer } from '../features/form/Form'
import { FormFieldContainer } from '../features/form/FormField'
import { Title, TitleLogo } from '../features/title/components'
import { ButtonContainer } from '../shared/ui/button/ButtonContainer'
import { CardContainer } from '../shared/ui/card/CardContainer'
import { Div } from '../shared/ui/div/Div'
import {
  DropdownContainer,
  DropdownContentContainer,
  DropdownItemContainer,
  DropdownTriggerContainer,
  DropdownValueContainer,
} from '../shared/ui/dropdown/DropdownContainer'
import { IconContainer } from '../shared/ui/icon/IconContainer'
import { ListContainer } from '../shared/ui/list/ListContainer'
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

  // Dialog
  Dialog: (id, parentPath) => <DialogContainer id={id} parentPath={parentPath} />,
  DialogTrigger: (id, parentPath) => <DialogTriggerContainer id={id} parentPath={parentPath} />,
  DialogPortal: (id, parentPath) => <DialogPortalContainer id={id} parentPath={parentPath} />,
  DialogContent: (id, parentPath) => <DialogContentContainer id={id} parentPath={parentPath} />,
  DialogHeader: (id, parentPath) => <DialogHeaderContainer id={id} parentPath={parentPath} />,
  DialogBody: (id, parentPath) => <DialogBodyContainer id={id} parentPath={parentPath} />,
  DialogFooter: (id, parentPath) => <DialogFooterContainer id={id} parentPath={parentPath} />,

  // Dropdown (compound pattern with providerId)
  Dropdown: (id, parentPath) => <DropdownContainer id={id} parentPath={parentPath} />,
  DropdownTrigger: (id, parentPath) => <DropdownTriggerContainer id={id} parentPath={parentPath} />,
  DropdownContent: (id, parentPath) => <DropdownContentContainer id={id} parentPath={parentPath} />,
  DropdownItem: (id, parentPath) => <DropdownItemContainer id={id} parentPath={parentPath} />,
  DropdownValue: (id) => <DropdownValueContainer id={id} />,

  // Icon
  Icon: (id, parentPath) => <IconContainer id={id} parentPath={parentPath} />,

  // List
  List: (id, parentPath) => <ListContainer id={id} parentPath={parentPath} />,

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
