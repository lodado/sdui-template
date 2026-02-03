'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRenderNode, useSduiNodeSubscription } from '@lodado/sdui-template'
import React from 'react'
import { type FieldValues, FormProvider, useForm, type UseFormReturn } from 'react-hook-form'
import type { z } from 'zod'

import { FormContext } from './FormContext'
import { FormField } from './FormField'
import type { FormRootProps } from './types'
import { extractSchemaKeys, getSchema } from './types'

/**
 * Form Root Component
 *
 * @description
 * Form component that integrates react-hook-form with zod validation.
 * Provides form methods via FormProvider and custom FormContext.
 *
 * @example
 * ```tsx
 * const schema = z.object({
 *   email: z.string().email('Invalid email'),
 *   password: z.string().min(8, 'Password must be at least 8 characters'),
 * })
 *
 * <Form
 *   schema={schema}
 *   onSubmit={(data) => console.log(data)}
 * >
 *   <Form.Field name="email" label="Email" required />
 *   <Form.Field name="password" label="Password" type="password" required />
 *   <button type="submit">Submit</button>
 * </Form>
 * ```
 */
const FormRoot = <TFieldValues extends FieldValues = FieldValues, TContext = unknown>({
  schema,
  onSubmit,
  children,
  className,
  ...formOptions
}: FormRootProps<TFieldValues, TContext>) => {
  // Create zodResolver - it automatically extracts error messages from zod schema
  const resolver = schema ? zodResolver<TFieldValues, TContext, TFieldValues>(schema) : undefined

  const methods = useForm<TFieldValues, TContext>({
    mode: 'onSubmit', // Run validation only on the first submit
    reValidateMode: 'onChange', // Revalidate on change after submission
    ...formOptions,
    resolver: resolver as never,
  })

  const handleSubmit = methods.handleSubmit(
    async (data) => {
      await onSubmit(data)
    },
    (errors) => {},
  )

  const contextValue = React.useMemo<{
    formMethods: UseFormReturn<TFieldValues, TContext>
    schema?: z.ZodType<TFieldValues, TFieldValues>
  }>(
    () => ({
      formMethods: methods,
      schema,
    }),
    [methods, schema],
  )

  return (
    <FormContext.Provider value={contextValue as never}>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit} className={className} noValidate>
          {typeof children === 'function' ? children(methods) : children}
        </form>
      </FormProvider>
    </FormContext.Provider>
  )
}

FormRoot.displayName = 'Form'

export const Form = Object.assign(FormRoot, {
  Field: FormField,
})

/**
 * Form Container Component for SDUI Integration
 *
 * @description
 * SDUI-integrated Form component that reads schema from attributes.
 * Supports schema injection via:
 * - Direct schema in attributes.schema
 * - Schema name in attributes.schemaName (looked up in schemaRegistry)
 *
 * @example
 * ```tsx
 * // Register schema first
 * registerSchema('loginForm', z.object({
 *   email: z.string().email(),
 *   password: z.string().min(8),
 * }))
 *
 * // Use in SDUI
 * <FormContainer id="form-1" />
 * ```
 */
interface FormContainerProps {
  id: string
  parentPath?: string[]
}

export const FormContainer = ({ id, parentPath = [] }: FormContainerProps) => {
  const { childrenIds, attributes } = useSduiNodeSubscription({ nodeId: id })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

  // Get schema from attributes
  const schemaFromAttributes = attributes?.schema as z.ZodType<FieldValues, FieldValues> | undefined
  const schemaName = attributes?.schemaName as string | undefined
  const schemaFromRegistry = schemaName
    ? (getSchema(schemaName) as z.ZodType<FieldValues, FieldValues> | undefined)
    : undefined
  const schema = schemaFromAttributes || schemaFromRegistry

  // Get onSubmit handler from attributes (can be a function name or handler)
  // For SDUI, we'll use a default handler that logs the data
  const onSubmitHandlerName = attributes?.onSubmit as string | undefined
  const onSubmitHandler = attributes?.onSubmitHandler as ((data: FieldValues) => void | Promise<void>) | undefined

  // Default handler if none provided
  const defaultOnSubmit = async (data: FieldValues) => {
    // In a real app, you would dispatch an event or call an API based on onSubmitHandlerName
    // For now, log the submission for debugging
  }

  const handleSubmit = onSubmitHandler || defaultOnSubmit

  // Get className from attributes
  const className = attributes?.className as string | undefined

  // Get other form options from attributes
  const formOptions = attributes?.formOptions as
    | Omit<FormRootProps, 'schema' | 'onSubmit' | 'children' | 'className'>
    | undefined

  return (
    <FormRoot
      schema={schema}
      onSubmit={handleSubmit}
      className={className}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...formOptions}
    >
      {renderChildren(childrenIds)}
    </FormRoot>
  )
}

FormContainer.displayName = 'FormContainer'
