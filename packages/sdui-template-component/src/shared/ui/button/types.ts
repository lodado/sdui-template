import React from 'react'
import { z } from 'zod'

/**
 * Button style variants
 */
export type ButtonStyle = 'filled' | 'outline' | 'text'

/**
 * Button size options (design system)
 */
export type ButtonSize = 'L' | 'M' | 'S'

/**
 * Button type options
 */
export type ButtonType = 'primary' | 'secondary'

/**
 * Button component props
 *
 * @description
 * Button component supporting design system specifications.
 * - Supports buttonStyle (filled/outline/text), size (L/M/S), buttonType (primary/secondary)
 * - Integrates with SDUI via nodeId prop
 * - Uses CSS variables from @lodado/sdui-design-files
 * - Full keyboard navigation support (Enter, Space)
 * - Accessible by default (ARIA attributes)
 *
 * @param buttonStyle - Button style: filled, outline, or text (default: 'filled')
 * @param size - Button size: L, M, or S (default: 'M')
 * @param buttonType - Button type: primary or secondary (default: 'primary')
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
 * <Button buttonStyle="filled" size="L" buttonType="primary" onClick={handleClick}>
 *   Submit
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * // SDUI integration
 * <Button nodeId="button-1" eventId="submit-click" buttonStyle="outline" size="M">
 *   Submit
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * // asChild를 사용하여 Link에 Button 스타일 적용
 * <Button asChild buttonStyle="text" size="S" buttonType="secondary">
 *   <Link href="/about">About</Link>
 * </Button>
 * ```
 */
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Button style: filled, outline, or text */
  buttonStyle?: ButtonStyle
  /** Button size: L, M, or S */
  size?: ButtonSize
  /** Button type: primary or secondary */
  buttonType?: ButtonType
  /** Whether button is disabled */
  disabled?: boolean
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
  buttonStyle: z.enum(['filled', 'outline', 'text']).optional(),
  size: z.enum(['L', 'M', 'S']).optional(),
  buttonType: z.enum(['primary', 'secondary']).optional(),
  disabled: z.boolean().optional(),
}) as z.ZodSchema<Record<string, unknown>>

export type ButtonState = z.infer<typeof buttonStatesSchema>
