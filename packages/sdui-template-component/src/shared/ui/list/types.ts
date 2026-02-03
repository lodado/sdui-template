import React from 'react'
import { z } from 'zod'

/**
 * List component props (Root)
 *
 * @description
 * Root component for List compound component pattern.
 * Renders as div element.
 * Integrates with SDUI template system.
 *
 * @param onClick - Click event handler (optional)
 * @param href - Link URL (optional, for reference only)
 * @param disabled - Whether list item is disabled (optional)
 * @param className - Additional CSS classes (optional)
 * @param nodeId - SDUI node ID for integration (optional)
 * @param eventId - Event ID for event emission (optional)
 *
 * @example
 * ```tsx
 * <List onClick={handleClick}>
 *   <List.Icon color="blue">
 *     <BookIcon />
 *   </List.Icon>
 *   <List.Content>
 *     <List.Title>Read Article</List.Title>
 *     <List.Description>Read today’s recommended article and save new words.</List.Description>
 *   </List.Content>
 *   <List.Arrow />
 * </List>
 * ```
 */
export interface ListProps extends React.HTMLAttributes<HTMLDivElement> {

  /** Whether list item is disabled */
  disabled?: boolean
  /** Additional CSS classes */
  className?: string
  /** SDUI node ID for integration */
  nodeId?: string
  /** Event ID for event emission */
  eventId?: string
  /** List content */
  children?: React.ReactNode
}

/**
 * List icon color variants
 */
export type ListIconColor = 'blue' | 'green' | 'purple' | 'red' | 'default'

/**
 * List Icon component props
 *
 * @description
 * Icon component for List compound pattern.
 * Wraps shared Icon component with circular colored background.
 */
export interface ListIconProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon content (usually SVG, will be wrapped in shared Icon component) */
  children?: React.ReactNode
  /** Additional CSS classes */
  className?: string
  /** Icon background color */
  color?: ListIconColor
}

/**
 * List Content component props
 *
 * @description
 * Content container for List compound pattern.
 * Wraps title and description.
 */
export interface ListContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Content children (usually List.Title and List.Description) */
  children?: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

/**
 * List Title component props
 *
 * @description
 * Title component for List compound pattern.
 */
export interface ListTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Title text */
  children?: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

/**
 * List Description component props
 *
 * @description
 * Description component for List compound pattern.
 */
export interface ListDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Description text */
  children?: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

/**
 * List Arrow component props
 *
 * @description
 * Arrow indicator component for List compound pattern.
 */
export interface ListArrowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional CSS classes */
  className?: string
}

/**
 * List state schema for component state validation
 *
 * @description
 * Zod schema for validating List component state in SDUI.
 * Used with useSduiNodeSubscription to ensure type safety.
 */
export const listStatesSchema: z.ZodSchema<Record<string, unknown>> = z.object({
  disabled: z.boolean().optional(),
}) as z.ZodSchema<Record<string, unknown>>

export type ListState = z.infer<typeof listStatesSchema>
