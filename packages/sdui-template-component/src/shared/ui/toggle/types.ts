import type { VariantProps } from 'class-variance-authority'

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
