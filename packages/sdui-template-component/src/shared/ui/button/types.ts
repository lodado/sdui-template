import React from 'react'
import { z } from 'zod'

/**
 * Button appearance variants (ADS style)
 * @description
 * - default: Neutral button with border (outline style)
 * - primary: Brand blue filled button for primary actions
 * - subtle: Transparent button without border (text style)
 * - warning: Yellow/orange filled button for warning actions
 * - danger: Red filled button for destructive actions
 */
export type ButtonAppearance = 'default' | 'primary' | 'subtle' | 'warning' | 'danger'

/**
 * Button spacing options (ADS style)
 * @description
 * - default: 32px height, 12px horizontal padding
 * - compact: 24px height, 8px horizontal padding
 */
export type ButtonSpacing = 'default' | 'compact'

/**
 * Button component props (ADS style)
 *
 * @description
 * Button component following Atlassian Design System (ADS) specifications.
 * - Supports 5 appearance variants (default/primary/subtle/warning/danger)
 * - Supports 2 spacing sizes (default/compact)
 * - Includes loading, selected, and icon support
 * - Integrates with SDUI via nodeId prop
 * - Uses CSS variables from @lodado/sdui-design-files
 * - Full keyboard navigation support (Enter, Space)
 * - Accessible by default (ARIA attributes)
 *
 * @param appearance - Button appearance: default, primary, subtle, warning, or danger (default: 'default')
 * @param spacing - Button spacing: default or compact (default: 'default')
 * @param isDisabled - Whether button is disabled (default: false)
 * @param isLoading - Whether button is in loading state (default: false)
 * @param isSelected - Whether button is selected/toggled (default: false)
 * @param iconBefore - Icon element to render before label
 * @param iconAfter - Icon element to render after label
 * @param children - Button content
 * @param onClick - Click event handler
 * @param className - Additional CSS classes (merged with defaults)
 * @param nodeId - SDUI node ID for integration (optional)
 * @param eventId - Event ID for event emission (optional)
 * @param type - HTML button type (optional)
 * @param asChild - Render as child element instead of button
 *
 * @example
 * ```tsx
 * <Button appearance="primary" onClick={handleClick}>
 *   Submit
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * // Compact size with icon
 * <Button appearance="default" spacing="compact" iconBefore={<SearchIcon />}>
 *   Search
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * // Loading state
 * <Button appearance="primary" isLoading>
 *   Saving...
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * // SDUI integration
 * <Button nodeId="button-1" eventId="submit-click" appearance="primary">
 *   Submit
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * // Use asChild to apply Button styles to a Link
 * <Button asChild appearance="subtle">
 *   <Link href="/about">About</Link>
 * </Button>
 * ```
 */
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Button appearance: default, primary, subtle, warning, or danger */
  appearance?: ButtonAppearance
  /** Button spacing: default (32px) or compact (24px) */
  spacing?: ButtonSpacing
  /** Whether button is disabled */
  isDisabled?: boolean
  /** Whether button is in loading state */
  isLoading?: boolean
  /** Whether button is selected/toggled */
  isSelected?: boolean
  /** Icon element to render before label */
  iconBefore?: React.ReactNode
  /** Icon element to render after label */
  iconAfter?: React.ReactNode
  /** Button content */
  children?: React.ReactNode
  /** Click event handler */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  /** Additional CSS classes */
  className?: string
  /** SDUI node ID for integration */
  nodeId?: string
  /** Event ID for event emission */
  eventId?: string
  /** HTML button type (submit, reset, or button) - ignored when asChild is true */
  type?: 'submit' | 'reset' | 'button'
  /** Render as child element instead of button */
  asChild?: boolean
}

/**
 * Button state schema for component state validation
 *
 * @description
 * Zod schema for validating Button component state in SDUI.
 * Used with useSduiNodeSubscription to ensure type safety.
 */
export const buttonStatesSchema: z.ZodSchema<Record<string, unknown>> = z.object({
  appearance: z.enum(['default', 'primary', 'subtle', 'warning', 'danger']).optional(),
  spacing: z.enum(['default', 'compact']).optional(),
  isDisabled: z.boolean().optional(),
  isLoading: z.boolean().optional(),
  isSelected: z.boolean().optional(),
}) as z.ZodSchema<Record<string, unknown>>

export type ButtonState = z.infer<typeof buttonStatesSchema>
