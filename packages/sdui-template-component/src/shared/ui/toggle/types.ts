import type { VariantProps } from 'class-variance-authority'
import { z } from 'zod'

import type { toggleVariants } from './toggle-variants'

/**
 * Toggle size variants
 */
export type ToggleSize = 'regular' | 'large'

/**
 * Toggle component props
 */
export interface ToggleProps extends Omit<VariantProps<typeof toggleVariants>, 'isChecked'> {
  /**
   * Whether the toggle is checked
   * @default false
   */
  isChecked?: boolean

  /**
   * Default checked state (uncontrolled)
   */
  defaultChecked?: boolean

  /**
   * Whether the toggle is disabled
   * @default false
   */
  isDisabled?: boolean

  /**
   * Whether the toggle is in loading state
   * @default false
   */
  isLoading?: boolean

  /**
   * Size variant
   * @default 'regular'
   */
  size?: ToggleSize

  /**
   * Callback when toggle state changes
   */
  onChange?: (checked: boolean) => void

  /**
   * Accessible label for the toggle
   */
  label?: string

  /**
   * Additional CSS class name
   */
  className?: string

  /**
   * SDUI node ID for tracking
   */
  nodeId?: string

  /**
   * SDUI event ID for event handling
   */
  eventId?: string

  /**
   * HTML id attribute
   */
  id?: string

  /**
   * HTML name attribute
   */
  name?: string
}

/**
 * Toggle container props for SDUI integration
 */
export interface ToggleContainerProps {
  id: string
}

/**
 * Toggle state schema for SDUI validation
 *
 * @description
 * Zod schema for validating Toggle component state in SDUI.
 * Used with useSduiNodeSubscription to ensure type safety.
 */
export const toggleStateSchema = z.object({
  isChecked: z.boolean().optional(),
  isDisabled: z.boolean().optional(),
  isLoading: z.boolean().optional(),
  size: z.enum(['regular', 'large']).optional(),
  label: z.string().optional(),
})

export type ToggleState = z.infer<typeof toggleStateSchema>

/**
 * Toggle attributes schema for SDUI validation
 */
export const toggleAttributesSchema = z.object({
  className: z.string().optional(),
})

export type ToggleAttributes = z.infer<typeof toggleAttributesSchema>
