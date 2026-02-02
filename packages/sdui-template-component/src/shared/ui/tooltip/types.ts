import React from 'react'
import { z } from 'zod'

/**
 * Tooltip side position options
 * @description
 * - top: Tooltip appears above the trigger
 * - right: Tooltip appears to the right of the trigger
 * - bottom: Tooltip appears below the trigger
 * - left: Tooltip appears to the left of the trigger
 */
export type TooltipSide = 'top' | 'right' | 'bottom' | 'left'

/**
 * Tooltip alignment options
 * @description
 * - start: Tooltip aligns to the start of the trigger
 * - center: Tooltip aligns to the center of the trigger
 * - end: Tooltip aligns to the end of the trigger
 */
export type TooltipAlign = 'start' | 'center' | 'end'

/**
 * TooltipProvider component props
 *
 * @description
 * Provider component for global tooltip configuration.
 * Wraps the application to provide consistent tooltip behavior.
 *
 * @param delayDuration - Global delay before tooltip opens (default: 300ms)
 * @param skipDelayDuration - Delay to skip when hovering between tooltips (default: 300ms)
 * @param disableHoverableContent - Disable hovering over tooltip content (default: false)
 * @param children - Application content
 */
export interface TooltipProviderProps {
  /** Global delay before tooltip opens (default: 300ms) */
  delayDuration?: number
  /** Delay to skip when hovering between tooltips (default: 300ms) */
  skipDelayDuration?: number
  /** Disable hovering over tooltip content (default: false) */
  disableHoverableContent?: boolean
  /** Application content */
  children: React.ReactNode
}

/**
 * TooltipRoot component props (Compound Pattern)
 *
 * @description
 * Root component props for the Tooltip compound pattern.
 * Controls the open/close state and delay timing.
 */
export interface TooltipProps {
  /** Controlled open state */
  open?: boolean
  /** Default open state (default: false) */
  defaultOpen?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Delay before tooltip opens in ms (default: 300) */
  delayDuration?: number
  /** Disable hovering over tooltip content */
  disableHoverableContent?: boolean
  /** Child components (Trigger, Portal, etc.) */
  children: React.ReactNode
}

/**
 * TooltipTrigger component props
 *
 * @description
 * The element that triggers the tooltip when hovered or focused.
 */
export interface TooltipTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Use asChild pattern to merge props with child (default: true) */
  asChild?: boolean
  /** Trigger element */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
  /** SDUI node ID for integration */
  nodeId?: string
}

/**
 * TooltipPortal component props
 *
 * @description
 * Portals the tooltip content to document.body.
 */
export interface TooltipPortalProps {
  /** Portal content */
  children: React.ReactNode
  /** Custom container element for portal */
  container?: HTMLElement
  /** Force mount the portal */
  forceMount?: true
}

/**
 * TooltipContent component props
 *
 * @description
 * The content that appears when the tooltip is open.
 * Styled according to ADS specifications.
 */
export interface TooltipContentProps {
  /** Content to display inside the tooltip */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
  /** Preferred side of the trigger (default: 'top') */
  side?: TooltipSide
  /** Distance from trigger in pixels (default: 4) */
  sideOffset?: number
  /** Alignment relative to trigger (default: 'center') */
  align?: TooltipAlign
  /** Offset from alignment in pixels (default: 0) */
  alignOffset?: number
  /** SDUI node ID for integration */
  nodeId?: string
  /** Collision boundary */
  collisionBoundary?: Element | null | Array<Element | null>
  /** Collision padding */
  collisionPadding?: number | Partial<Record<TooltipSide, number>>
  /** Arrow padding */
  arrowPadding?: number
  /** Sticky behavior */
  sticky?: 'partial' | 'always'
  /** Hide when detached from trigger */
  hideWhenDetached?: boolean
  /** Avoid collision with viewport edges */
  avoidCollisions?: boolean
  /** Force mount the content */
  forceMount?: true
  /** Event handler for escape key */
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  /** Event handler for pointer down outside */
  onPointerDownOutside?: (event: CustomEvent) => void
}

/**
 * TooltipArrow component props
 *
 * @description
 * Optional arrow indicator pointing to the trigger element.
 */
export interface TooltipArrowProps {
  /** Additional CSS classes */
  className?: string
  /** Arrow width (default: 11) */
  width?: number
  /** Arrow height (default: 5) */
  height?: number
}

/**
 * Legacy Tooltip props for backward compatibility
 *
 * @deprecated Use compound pattern instead
 * @description
 * Legacy props interface that supports simple usage pattern.
 * Use compound pattern (Tooltip.Root, Tooltip.Trigger, etc.) for new implementations.
 */
export interface LegacyTooltipProps extends TooltipProps {
  /** Content to display inside the tooltip */
  content: React.ReactNode
  /** Preferred side of the trigger (default: 'top') */
  side?: TooltipSide
  /** Distance from trigger in pixels (default: 4) */
  sideOffset?: number
  /** Alignment relative to trigger (default: 'center') */
  align?: TooltipAlign
  /** Offset from alignment in pixels (default: 0) */
  alignOffset?: number
  /** Skip delay when hovering between tooltips (default: 300) */
  skipDelayDuration?: number
  /** Show tooltip arrow (default: false) */
  showArrow?: boolean
  /** Additional CSS classes for content */
  className?: string
  /** SDUI node ID for integration */
  nodeId?: string
}

/**
 * Tooltip state schema for component state validation
 *
 * @description
 * Zod schema for validating Tooltip component state in SDUI.
 * Used with useSduiNodeSubscription to ensure type safety.
 */
export const tooltipStatesSchema = z.object({
  content: z.string().optional(),
  side: z.enum(['top', 'right', 'bottom', 'left']).optional(),
  sideOffset: z.number().optional(),
  align: z.enum(['start', 'center', 'end']).optional(),
  alignOffset: z.number().optional(),
  delayDuration: z.number().optional(),
  showArrow: z.boolean().optional(),
  open: z.boolean().optional(),
  defaultOpen: z.boolean().optional(),
  alwaysOpen: z.boolean().optional(),
})

export type TooltipState = z.infer<typeof tooltipStatesSchema>
