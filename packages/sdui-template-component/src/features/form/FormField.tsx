'use client'

import { useSduiNodeSubscription } from '@lodado/sdui-template'
import React from 'react'
import type { FieldValues, Path } from 'react-hook-form'
import { Controller, useFormContext as useReactHookFormContext } from 'react-hook-form'

import { TextField } from '../../shared/ui/textfield'
import { useFormContext } from './FormContext'
import { extractSchemaKeys, type FormFieldProps } from './types'

/**
 * FormField Component
 *
 * @description
 * Form field component that integrates TextField with react-hook-form.
 * Automatically handles validation, error display, and form state.
 *
 * @example
 * ```tsx
 * <Form.Field
 *   name="email"
 *   label="Email"
 *   required
 *   inputProps={{
 *     type: 'email',
 *     placeholder: 'Enter your email',
 *   }}
 * />
 * ```
 */
const FormField = <TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  helpMessage,
  required = false,
  disabled = false,
  type,
  placeholder,
  inputProps = {},
  ...textFieldProps
}: FormFieldProps<TFieldValues>) => {
  const {
    control,
    formState: { errors },
  } = useReactHookFormContext<TFieldValues>()

  const fieldName = name as Path<TFieldValues>
  const error = errors[fieldName]

  // Extract error message from zod validation
  // zodResolver returns errors in format: { message: string, type: string }
  // Handle both FieldError and FieldErrorWithMessage types
  // zodResolver automatically extracts custom error messages from zod schema
  const errorMessage = error?.message as string | undefined

  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field }) => (
        <TextField
          {...textFieldProps}
          error={Boolean(error)}
          errorMessage={errorMessage}
          helpMessage={helpMessage}
          required={required}
          disabled={disabled}
        >
          <TextField.Wrapper>
            {label && <TextField.Label>{label}</TextField.Label>}
            <TextField.Input
              {...inputProps}
              {...field}
              type={type ?? inputProps?.type ?? 'text'}
              placeholder={placeholder ?? inputProps?.placeholder}
              value={field.value ?? ''}
              onChange={(e) => {
                field.onChange(e)
                if (inputProps?.onChange) {
                  inputProps.onChange(e)
                }
              }}
              onBlur={(e) => {
                field.onBlur()
                if (inputProps?.onBlur) {
                  inputProps.onBlur(e)
                }
              }}
            />
            <TextField.HelpMessage />
          </TextField.Wrapper>
        </TextField>
      )}
    />
  )
}

FormField.displayName = 'Form.Field'

/**
 * FormField Container Component for SDUI Integration
 *
 * @description
 * SDUI-integrated FormField component that reads field props from attributes.
 * Must be used as a child of Form component.
 *
 * @example
 * ```tsx
 * // In SDUI document, FormField node should have attributes:
 * // {
 * //   name: "email",
 * //   label: "Email",
 * //   required: true,
 * //   type: "email"
 * // }
 * <FormFieldContainer id="field-1" />
 * ```
 */
interface FormFieldContainerProps {
  id: string
}

export const FormFieldContainer = ({ id }: FormFieldContainerProps) => {
  const { attributes } = useSduiNodeSubscription({ nodeId: id })
  const formContext = useFormContext<FieldValues>()

  if (!attributes?.name) {
    // eslint-disable-next-line no-console
    console.warn(`FormField with id "${id}" is missing name attribute`)
    return null
  }

  const name = attributes.name as string

  // Runtime validation: Check if field name exists in schema
  if (formContext.schema) {
    const schemaKeys = extractSchemaKeys(formContext.schema)
    if (schemaKeys.length > 0 && !schemaKeys.includes(name)) {
      throw new Error(
        `FormField with name "${name}" (id: "${id}") is not defined in the form schema. ` +
          `Expected fields: ${schemaKeys.join(', ')}`
      )
    }
  }

  // Extract FormField props from attributes
  const {
    name: _name,
    label,
    helpMessage,
    required,
    disabled,
    type,
    placeholder,
    inputProps,
    className,
    ...restAttributes
  } = attributes as Partial<FormFieldProps<FieldValues>> & { name: string }

  return (
    <FormField
      name={name as any}
      label={label}
      helpMessage={helpMessage}
      required={required}
      disabled={disabled}
      type={type}
      placeholder={placeholder}
      inputProps={inputProps}
      className={className}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...restAttributes}
    />
  )
}

FormFieldContainer.displayName = 'FormFieldContainer'

export { FormField }
