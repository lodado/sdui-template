'use client'

import { type ComponentFactory } from '@lodado/sdui-template'

import { ButtonContainer } from '../../shared/ui/button/ButtonContainer'
import { Div } from '../../shared/ui/div'
import { Span,Text } from '../../shared/ui/text'
import { FormContainer } from './Form'
import { FormFieldContainer } from './FormField'

/**
 * Form component map for SDUI Layout Renderer
 *
 * @description
 * Provides component factory map for form components.
 * Supports schema injection via attributes.schema or attributes.schemaName.
 *
 * @example
 * ```tsx
 * // Register schema
 * registerSchema('loginForm', z.object({
 *   email: z.string().email(),
 *   password: z.string().min(8),
 * }))
 *
 * // Use in SDUI
 * <SduiLayoutRenderer
 *   document={document}
 *   components={getFormComponents()}
 * />
 * ```
 *
 * @returns Component factory map for form components
 */
export function getFormComponents(): Record<string, ComponentFactory> {
  return {
    Form: (id, parentPath) => <FormContainer id={id} parentPath={parentPath} />,
    Div: (id, parentPath) => <Div id={id} parentPath={parentPath} />,
    FormField: (id) => <FormFieldContainer id={id} />,
    Button: (id, parentPath) => <ButtonContainer id={id} parentPath={parentPath} />,
    Text: (id) => <Text id={id} />,
    Span: (id) => <Span id={id} />,
  }
}
