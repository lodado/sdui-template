'use client'

import { createContext, useContext } from 'react'

/**
 * Radio Context Value
 *
 * @description
 * Context value shared between Radio.Root and its child components (Radio, Label).
 */
export interface RadioContextValue {
  /** Unique ID for the radio input (for label-radio connection) */
  radioId: string
  /** Error state */
  error: boolean
  /** Disabled state */
  disabled: boolean
  /** Required field indicator */
  required: boolean
  /** Radio group name */
  name?: string
}

/**
 * Radio Context
 *
 * @description
 * React Context for sharing state between Radio.Root and its child components.
 */
const RadioContext = createContext<RadioContextValue | null>(null)

/**
 * Hook to access Radio context
 *
 * @throws Error if used outside Radio.Root component
 */
export const useRadioContext = (): RadioContextValue => {
  const context = useContext(RadioContext)
  if (!context) {
    throw new Error('Radio components must be used within Radio.Root')
  }
  return context
}

// Export context for use in Radio component
export { RadioContext }
