import React from 'react'
import { z } from 'zod'

/**
 * Tag color variants (ADS style)
 * @description
 * - standard: Default neutral gray
 * - blue: Blue accent color
 * - red: Red/danger color
 * - yellow: Yellow/warning color
 * - green: Green/success color
 * - teal: Teal accent color
 * - purple: Purple accent color
 * - grey: Grey/muted color
 * - lime: Lime accent color
 * - orange: Orange accent color
 * - magenta: Magenta accent color
 */
export type TagColor =
  | 'standard'
  | 'blue'
  | 'red'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'purple'
  | 'grey'
  | 'lime'
  | 'orange'
  | 'magenta'

/**
 * Tag component props (ADS style)
 *
 * @description
 * Tag component following Atlassian Design System (ADS) specifications.
 * A tag labels UI objects for quick recognition and navigation.
 *
 * @see https://atlassian.design/components/tag/usage
 *
 * @param text - Tag text content
 * @param color - Tag color variant (default: 'standard')
 * @param isRemovable - Whether to show remove button (default: false)
 * @param isLink - Whether to render as link style with underline (default: false)
 * @param iconBefore - Icon element to render before text
 * @param onRemove - Callback when remove button is clicked
 * @param onClick - Callback when tag is clicked
 * @param href - URL for link tags
 * @param className - Additional CSS classes
 * @param nodeId - SDUI node ID for integration
 * @param eventId - Event ID for event emission
 *
 * @example
 * ```tsx
 * <Tag text="Label" color="blue" />
 * ```
 *
 * @example
 * ```tsx
 * // Removable tag
 * <Tag text="React" isRemovable onRemove={() => handleRemove('react')} />
 * ```
 *
 * @example
 * ```tsx
 * // Link tag
 * <Tag text="Documentation" isLink href="/docs" />
 * ```
 *
 * @example
 * ```tsx
 * // With icon
 * <Tag text="Settings" iconBefore={<SettingsIcon />} />
 * ```
 */
export interface TagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onClick'> {
  /** Tag text content */
  text: string
  /** Tag color variant */
  color?: TagColor
  /** Whether to show remove button */
  isRemovable?: boolean
  /** Whether to render as link style with underline */
  isLink?: boolean
  /** Icon element to render before text */
  iconBefore?: React.ReactNode
  /** Callback when remove button is clicked */
  onRemove?: () => void
  /** Callback when tag is clicked */
  onClick?: (event: React.MouseEvent<HTMLSpanElement | HTMLAnchorElement>) => void
  /** URL for link tags */
  href?: string
  /** Additional CSS classes */
  className?: string
  /** SDUI node ID for integration */
  nodeId?: string
  /** Event ID for event emission */
  eventId?: string
}

/**
 * Tag state schema for component state validation
 *
 * @description
 * Zod schema for validating Tag component state in SDUI.
 * Used with useSduiNodeSubscription to ensure type safety.
 */
export const tagStatesSchema: z.ZodSchema<Record<string, unknown>> = z.object({
  text: z.string().optional(),
  color: z
    .enum(['standard', 'blue', 'red', 'yellow', 'green', 'teal', 'purple', 'grey', 'lime', 'orange', 'magenta'])
    .optional(),
  isRemovable: z.boolean().optional(),
  isLink: z.boolean().optional(),
}) as z.ZodSchema<Record<string, unknown>>

export type TagState = z.infer<typeof tagStatesSchema>
