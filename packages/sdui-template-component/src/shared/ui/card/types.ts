import React from 'react'
import { z } from 'zod'

/**
 * Card component props
 *
 * @description
 * Card component for creating container cards with optional title.
 * Supports SDUI integration via nodeId prop.
 * Uses CSS variables from @lodado/sdui-design-files.
 *
 * @param children - Card content
 * @param className - Additional CSS classes (merged with defaults)
 * @param nodeId - SDUI node ID for integration (optional)
 * @param eventId - Event ID for event emission (optional)
 * @param title - Optional header text (optional)
 *
 * @example
 * ```tsx
 * <Card title="학습 가이드">
 *   <div>Card content</div>
 * </Card>
 * ```
 *
 * @example
 * ```tsx
 * // SDUI integration
 * <Card nodeId="card-1" title="Section Title">
 *   <div>Content</div>
 * </Card>
 * ```
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Card content */
  children?: React.ReactNode
  /** Additional CSS classes */
  className?: string
  /** SDUI node ID for integration */
  nodeId?: string
  /** Event ID for event emission */
  eventId?: string
  /** Optional header text */
  title?: string
}

/**
 * Card state schema for component state validation
 *
 * @description
 * Zod schema for validating Card component state in SDUI.
 * Used with useSduiNodeSubscription to ensure type safety.
 */
export const cardStatesSchema: z.ZodSchema<Record<string, unknown>> = z.object({
  title: z.string().optional(),
}) as z.ZodSchema<Record<string, unknown>>

export type CardState = z.infer<typeof cardStatesSchema>
