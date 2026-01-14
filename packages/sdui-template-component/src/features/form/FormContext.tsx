'use client'

import React, { createContext, useContext } from 'react'
import type { FieldValues } from 'react-hook-form'

import type { FormContextValue } from './types'

const FormContext = createContext<FormContextValue<FieldValues> | null>(null)

/**
 * Hook to access Form context
 *
 * @description
 * Returns form methods from Form context.
 * Must be used within Form component.
 *
 * @throws Error if used outside Form component
 */
export function useFormContext<TFieldValues extends FieldValues = FieldValues>() {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error('useFormContext must be used within Form component')
  }
  return context as FormContextValue<TFieldValues>
}

export { FormContext }
