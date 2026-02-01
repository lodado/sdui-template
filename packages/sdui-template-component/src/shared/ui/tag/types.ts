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
 * @example
 * ```tsx
 * <Tag text="Label" color="blue" />
 * ```
 *
 * @example
 * ```tsx
 * <Tag text="Label" color="green" iconBefore={<Icon />} />
 * ```
 */
export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Tag text content */
  text: string
  /** Tag color variant */
  color?: TagColor
  /** Icon element to render before text */
  iconBefore?: React.ReactNode
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
}) as z.ZodSchema<Record<string, unknown>>

export type TagState = z.infer<typeof tagStatesSchema>
