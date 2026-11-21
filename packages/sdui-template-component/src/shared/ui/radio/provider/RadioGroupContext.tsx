'use client'

import { createContext, useContext } from 'react'

// ============================================
// RadioGroup Context for providerId inheritance (SDUI mode)
// ============================================

interface RadioGroupContextValue {
  providerId: string
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

/**
 * Hook to get providerId from context
 * Used by child components when providerId is not explicitly provided
 * Returns null if not inside a RadioGroup (does not throw)
 */
export const useRadioGroupContext = () => {
  return useContext(RadioGroupContext)
}

// ============================================
// Legacy RadioGroup Context (non-SDUI mode)
// ============================================

/**
 * Legacy RadioGroup Context Value
 * Used for non-SDUI mode to provide value, disabled, error, required
 */
export interface RadioGroupLegacyContextValue {
  groupName: string
  value?: string
  onValueChange?: (value: string) => void
  disabled: boolean
  required: boolean
  error: boolean
}

const RadioGroupLegacyContext = createContext<RadioGroupLegacyContextValue | null>(null)

/**
 * Hook to access RadioGroup legacy context (non-SDUI mode)
 * Returns null if not inside a RadioGroup (does not throw)
 */
export const useRadioGroupLegacyContext = (): RadioGroupLegacyContextValue | null => {
  return useContext(RadioGroupLegacyContext)
}

// Export contexts for use in RadioGroup component
export { RadioGroupContext, RadioGroupLegacyContext }
