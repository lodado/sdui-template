import React from 'react'
import { z } from 'zod'

/**
 * RadioGroup Props
 *
 * @description
 * Props for RadioGroup component.
 * Manages multiple Radio buttons and ensures only one is selected.
 */
export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Radio group name (auto-generated if not provided)
   * All radios in the group share this name
   */
  name?: string

  /**
   * Currently selected value (controlled)
   */
  value?: string

  /**
   * Default selected value (uncontrolled)
   */
  defaultValue?: string

  /**
   * Callback when selected value changes
   */
  onValueChange?: (value: string) => void

  /**
   * Disabled state - applies to all child radios
   */
  disabled?: boolean

  /**
   * Required field indicator
   */
  required?: boolean

  /**
   * Error state
   */
  error?: boolean

  /**
   * SDUI node ID for integration
   */
  nodeId?: string

  /**
   * Event ID for event emission
   */
  eventId?: string

  /**
   * HTML id attribute
   */
  id?: string

  /**
   * Additional CSS classes
   */
  className?: string

  /**
   * Child Radio components
   */
  children: React.ReactNode
}

/**
 * RadioGroup container props for SDUI integration
 */
export interface RadioGroupContainerProps {
  id: string
  parentPath?: string[]
}

// ============================================
// SDUI State Schemas (Zod)
// ============================================

/**
 * RadioGroup state schema for SDUI validation
 *
 * @description
 * Zod schema for validating RadioGroup component state in SDUI.
 * Used with useSduiNodeSubscription to ensure type safety.
 */
export const radioGroupStateSchema = z.object({
  value: z.string().optional(),
  defaultValue: z.string().optional(),
  disabled: z.boolean().optional(),
  required: z.boolean().optional(),
  error: z.boolean().optional(),
  name: z.string().optional(),
})

export type RadioGroupState = z.infer<typeof radioGroupStateSchema>

/**
 * RadioGroup attributes schema for SDUI validation
 */
export const radioGroupAttributesSchema = z.object({
  className: z.string().optional(),
})

export type RadioGroupAttributes = z.infer<typeof radioGroupAttributesSchema>
