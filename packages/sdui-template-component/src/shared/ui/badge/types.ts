import React from 'react'
import { z } from 'zod'

/**
 * Badge appearance variants (ADS style)
 * @description
 * - default: Default neutral appearance
 * - primary: Primary blue appearance
 * - primaryInverted: Primary inverted appearance (white background, brand text)
 * - important: Important red appearance
 * - added: Success appearance with "+" prefix
 * - removed: Danger appearance with "-" prefix
 */
export type BadgeAppearance =
  | 'default'
  | 'primary'
  | 'primaryInverted'
  | 'important'
  | 'added'
  | 'removed'

/**
 * Badge component props (ADS style)
 *
 * @description
 * Badge component following Atlassian Design System (ADS) specifications.
 * A badge is a visual indicator for numeric values such as tallies and scores.
 *
 * @example
 * ```tsx
 * <Badge label={25} />
 * ```
 *
 * @example
 * ```tsx
 * <Badge label="99+" appearance="default" />
 * ```
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Badge label content (numeric value or string) */
  label: string | number
  /** Badge appearance variant */
  appearance?: BadgeAppearance
}

/**
 * Badge state interface for component state
 *
 * @description
 * Interface for Badge component state in SDUI.
 */
export interface BadgeState {
  label?: string | number
  appearance?: BadgeAppearance
}

/**
 * Badge state schema for component state validation
 *
 * @description
 * Zod schema for validating Badge component state in SDUI.
 * Used with useSduiNodeSubscription to ensure type safety.
 */
export const badgeStatesSchema: z.ZodSchema<Record<string, unknown>> = z.object({
  label: z.union([z.string(), z.number()]).optional(),
  appearance: z
    .enum(['default', 'primary', 'primaryInverted', 'important', 'added', 'removed'])
    .optional(),
}) as z.ZodSchema<Record<string, unknown>>
