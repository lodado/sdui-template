import type React from 'react'
import type { FieldValues, UseFormProps, UseFormReturn } from 'react-hook-form'
import type { z } from 'zod'

/**
 * Schema Registry
 *
 * @description
 * Registry for zod schemas that can be referenced by name in SDUI attributes.
 * Allows schemas to be registered and retrieved by string identifier.
 */
export const schemaRegistry = new Map<string, z.ZodType<any, any, any>>()

/**
 * Register a zod schema with a name
 *
 * @param name - Schema identifier
 * @param schema - Zod schema to register
 */
export function registerSchema(name: string, schema: z.ZodType<any, any, any>): void {
  schemaRegistry.set(name, schema)
}

/**
 * Get a zod schema by name
 *
 * @param name - Schema identifier
 * @returns Zod schema or undefined if not found
 */
export function getSchema(name: string): z.ZodType<any, any, any> | undefined {
  return schemaRegistry.get(name)
}

/**
 * Form Root Props
 *
 * @description
 * Props for Form root component.
 * Extends react-hook-form's UseFormProps with zod schema support.
 */
export interface FormRootProps<TFieldValues extends FieldValues = FieldValues, TContext = unknown>
  extends Omit<UseFormProps<TFieldValues, TContext>, 'resolver'> {
  /** Zod schema for validation */
  schema?: z.ZodType<any, any, any>
  /** Form submission handler */
  onSubmit: (data: TFieldValues) => void | Promise<void>
  /** Form children (can access form methods via FormProvider) */
  children: React.ReactNode | ((methods: UseFormReturn<TFieldValues, TContext>) => React.ReactNode)
  /** Additional CSS classes */
  className?: string
  /** Form HTML attributes */
  [key: string]: unknown
}

/**
 * Form Field Props
 *
 * @description
 * Props for FormField component.
 * Integrates TextField with react-hook-form's Controller.
 */
export interface FormFieldProps<TFieldValues extends FieldValues = FieldValues> {
  /** Field name in form values */
  name: keyof TFieldValues & string
  /** Field label */
  label?: string
  /** Help message (displayed when no error) */
  helpMessage?: string
  /** Required field indicator */
  required?: boolean
  /** Disabled state */
  disabled?: boolean
  /** TextField Input props (onChange/onBlur are merged with form handlers) */
  inputProps?: Partial<
    Omit<
      React.ComponentPropsWithoutRef<typeof import('../../shared/ui/textfield').TextField.Input>,
      'value' | 'name' | 'ref' | 'id'
    >
  >
  /** Input type (shorthand for inputProps.type) */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  /** Placeholder text (shorthand for inputProps.placeholder) */
  placeholder?: string
  /** Additional CSS classes passed to TextField root */
  className?: string
  /** Additional props passed to TextField root */
  [key: string]: unknown
}

/**
 * Form Context Value
 *
 * @description
 * Context value provided by Form component.
 * Contains react-hook-form methods and form state.
 */
export interface FormContextValue<TFieldValues extends FieldValues = FieldValues, TContext = unknown> {
  formMethods: UseFormReturn<TFieldValues, TContext>
}
