import React from 'react'

/**
 * Checkbox Context Value
 *
 * @description
 * Context value shared between Checkbox compound components.
 * Provides checkbox ID, error state, disabled state, and required state.
 */
export interface CheckboxContextValue {
  /** Unique checkbox ID for label-checkbox connection */
  checkboxId: string
  /** Error state */
  error: boolean
  /** Disabled state */
  disabled: boolean
  /** Required field indicator */
  required: boolean
}

/**
 * Checkbox Context
 *
 * @description
 * React Context for sharing state between Checkbox compound components.
 * Used to connect Label and Checkbox components.
 */
export const CheckboxContext = React.createContext<CheckboxContextValue | null>(null)

/**
 * Hook to access Checkbox context
 *
 * @throws Error if used outside Checkbox component
 */
export const useCheckboxContext = (): CheckboxContextValue => {
  const context = React.useContext(CheckboxContext)
  if (!context) {
    throw new Error('Checkbox compound components must be used within Checkbox.Root component')
  }
  return context
}
