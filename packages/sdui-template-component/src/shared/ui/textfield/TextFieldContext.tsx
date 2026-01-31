import React from 'react'

import type { TextFieldAppearance, TextFieldSize } from './types'

/**
 * TextField Context Value
 *
 * @description
 * Context value shared between TextField compound components.
 * Provides input ID, error state, disabled state, required state, size, and appearance.
 */
export interface TextFieldContextValue {
  /** Unique input ID for label-input connection */
  inputId: string
  /** Error state */
  error: boolean
  /** Disabled state */
  disabled: boolean
  /** Required field indicator */
  required: boolean
  /** Error message (if error is true) */
  errorMessage?: string
  /** Help message (if error is false) */
  helpMessage?: string
  /** Size variant - default (40px) or compact (32px) */
  size: TextFieldSize
  /** Appearance style - standard, subtle, or none */
  appearance: TextFieldAppearance
}

/**
 * TextField Context
 *
 * @description
 * React Context for sharing state between TextField compound components.
 * Used to connect Label, Input, and HelpMessage components.
 */
export const TextFieldContext = React.createContext<TextFieldContextValue | null>(null)

/**
 * Hook to access TextField context
 *
 * @throws Error if used outside TextField component
 */
export const useTextFieldContext = (): TextFieldContextValue => {
  const context = React.useContext(TextFieldContext)
  if (!context) {
    throw new Error('TextField compound components must be used within TextField component')
  }
  return context
}
