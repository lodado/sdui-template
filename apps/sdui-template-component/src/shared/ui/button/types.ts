import React from 'react'

/**
 * Button component variant styles
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'

/**
 * Button component size options
 */
export type ButtonSize = 'sm' | 'md' | 'lg'

/**
 * Button component props
 *
 * @description
 * - Supports multiple variants and sizes for flexible styling
 * - Integrates with SDUI via nodeId prop
 * - Supports event emission via eventId prop
 * - Full keyboard navigation support (Enter, Space)
 * - Accessible by default (ARIA attributes)
 *
 * @param variant - Visual style variant (default: 'primary')
 * @param size - Size of the button (default: 'md')
 * @param disabled - Whether button is disabled (default: false)
 * @param children - Button content
 * @param onClick - Click event handler
 * @param className - Additional CSS classes (merged with defaults)
 * @param nodeId - SDUI node ID for integration (optional)
 * @param eventId - Event ID for event emission (optional)
 * @param 'aria-label' - Accessible label (optional, uses children if not provided)
 * @param 'aria-describedby' - Element ID that describes button (optional)
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Submit
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * // SDUI integration
 * <Button nodeId="button-1" eventId="submit-click">
 *   Submit
 * </Button>
 * ```
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant
  /** Size of the button */
  size?: ButtonSize
  /** Whether button is disabled */
  disabled?: boolean
  /** Button content */
  children: React.ReactNode
  /** Click event handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  /** Additional CSS classes */
  className?: string
  /** SDUI node ID for integration */
  nodeId?: string
  /** Event ID for event emission */
  eventId?: string
}
