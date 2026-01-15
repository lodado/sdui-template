import type React from 'react'
import type { FieldValues, UseFormProps, UseFormReturn } from 'react-hook-form'
import type { z } from 'zod'

/**
 * Extract keys from a zod object schema
 *
 * @template T - Zod object schema type
 * @example
 * ```ts
 * const schema = z.object({ email: z.string(), password: z.string() })
 * type SchemaKeys = ExtractSchemaKeys<typeof schema> // "email" | "password"
 * ```
 */
export type ExtractSchemaKeys<T> = T extends z.ZodObject<infer TShape, any, any, any, any>
  ? keyof TShape
  : never

/**
 * Extract keys from a zod schema (handles refined schemas)
 *
 * @template T - Zod schema type (can be ZodObject or refined ZodObject)
 * @example
 * ```ts
 * const schema = z.object({ email: z.string() }).refine(...)
 * type SchemaKeys = ExtractSchemaKeysFromRefined<typeof schema> // "email"
 * ```
 */
export type ExtractSchemaKeysFromRefined<T> = T extends z.ZodEffects<infer TInput, any, any>
  ? ExtractSchemaKeys<TInput>
  : ExtractSchemaKeys<T>

/**
 * Extract field names from a schemas object
 *
 * @template TSchemas - Schemas object type
 * @template TSchemaName - Schema name key
 * @example
 * ```ts
 * const schemas = {
 *   loginForm: z.object({ email: z.string(), password: z.string() }),
 *   registerForm: z.object({ name: z.string() })
 * }
 * type LoginFields = ExtractSchemaFields<typeof schemas, 'loginForm'> // "email" | "password"
 * ```
 */
export type ExtractSchemaFields<
  TSchemas extends Record<string, any>,
  TSchemaName extends keyof TSchemas,
> = TSchemas[TSchemaName] extends z.ZodType<any, any, any>
  ? ExtractSchemaKeysFromRefined<TSchemas[TSchemaName]>
  : never

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
 * Extract keys from a zod object schema at runtime
 *
 * @param schema - Zod schema to extract keys from
 * @returns Array of field names or empty array if not a ZodObject
 */
export function extractSchemaKeys(schema: z.ZodType<any, any, any>): string[] {
  // Handle ZodObject
  if ('shape' in schema) {
    const shape = schema.shape as Record<string, unknown> | null | undefined
    if (shape && typeof shape === 'object') {
      return Object.keys(shape)
    }
  }

  // Handle ZodEffects (refined schemas)
  if ('_def' in schema && typeof schema._def === 'object' && schema._def !== null) {
    const def = schema._def as { schema?: z.ZodType<any, any, any> }
    if ('schema' in def && def.schema) {
      const innerSchema = def.schema
      if ('shape' in innerSchema) {
        const innerShape = innerSchema.shape as Record<string, unknown> | null | undefined
        if (innerShape && typeof innerShape === 'object') {
          return Object.keys(innerShape)
        }
      }
    }
  }

  return []
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
  /** Schema for validation (optional, used for runtime field validation) */
  schema?: z.ZodType<any, any, any>
}
