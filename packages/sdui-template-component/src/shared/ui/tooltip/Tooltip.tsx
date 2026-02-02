'use client'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import React from 'react'

import { cn } from '../../lib/cn'
import { tooltipArrowVariants, tooltipContentVariants } from './tooltip-variants'
import type {
  TooltipArrowProps,
  TooltipContentProps,
  TooltipPortalProps,
  TooltipProps,
  TooltipProviderProps,
  TooltipTriggerProps,
} from './types'

/**
 * TooltipProvider component
 *
 * @description
 * Provider component for global tooltip configuration.
 * Wraps the application to provide consistent tooltip behavior across all tooltips.
 *
 * @example
 * ```tsx
 * <Tooltip.Provider delayDuration={400}>
 *   <App />
 * </Tooltip.Provider>
 * ```
 */
const TooltipProvider = ({
  delayDuration = 300,
  skipDelayDuration = 300,
  disableHoverableContent = false,
  children,
}: TooltipProviderProps) => (
  <TooltipPrimitive.Provider
    delayDuration={delayDuration}
    skipDelayDuration={skipDelayDuration}
    disableHoverableContent={disableHoverableContent}
  >
    {children}
  </TooltipPrimitive.Provider>
)

TooltipProvider.displayName = 'Tooltip.Provider'

/**
 * TooltipRoot component (Compound Pattern)
 *
 * @description
 * Root component for the Tooltip compound pattern.
 * Controls the open/close state and delay timing.
 *
 * @example
 * ```tsx
 * <Tooltip.Root>
 *   <Tooltip.Trigger>
 *     <button>Hover me</button>
 *   </Tooltip.Trigger>
 *   <Tooltip.Portal>
 *     <Tooltip.Content>
 *       Tooltip content
 *       <Tooltip.Arrow />
 *     </Tooltip.Content>
 *   </Tooltip.Portal>
 * </Tooltip.Root>
 * ```
 */
const TooltipRoot = ({
  open,
  defaultOpen = false,
  onOpenChange,
  delayDuration,
  disableHoverableContent,
  children,
}: TooltipProps) => {
  const isControlled = open !== undefined

  return (
    <TooltipPrimitive.Root
      open={isControlled ? open : undefined}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      delayDuration={delayDuration}
      disableHoverableContent={disableHoverableContent}
    >
      {children}
    </TooltipPrimitive.Root>
  )
}

TooltipRoot.displayName = 'Tooltip.Root'

/**
 * TooltipTrigger component
 *
 * @description
 * The element that triggers the tooltip when hovered or focused.
 * Uses asChild pattern to merge props with child element.
 *
 * @example
 * ```tsx
 * <Tooltip.Trigger>
 *   <button>Hover me</button>
 * </Tooltip.Trigger>
 * ```
 */
const TooltipTrigger = React.forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  ({ asChild = true, children, className, nodeId, ...props }, ref) => (
    <TooltipPrimitive.Trigger ref={ref} asChild={asChild} className={className} data-node-id={nodeId} {...props}>
      {children}
    </TooltipPrimitive.Trigger>
  ),
)

TooltipTrigger.displayName = 'Tooltip.Trigger'

/**
 * TooltipPortal component
 *
 * @description
 * Portals the tooltip content to document.body to avoid z-index and overflow issues.
 *
 * @example
 * ```tsx
 * <Tooltip.Portal>
 *   <Tooltip.Content>...</Tooltip.Content>
 * </Tooltip.Portal>
 * ```
 */
const TooltipPortal = ({ children, container, forceMount }: TooltipPortalProps) => (
  <TooltipPrimitive.Portal container={container} forceMount={forceMount}>
    {children}
  </TooltipPrimitive.Portal>
)

TooltipPortal.displayName = 'Tooltip.Portal'

/**
 * TooltipContent component
 *
 * @description
 * The content that appears when the tooltip is open.
 * Styled according to ADS (Atlassian Design System) specifications.
 *
 * @example
 * ```tsx
 * <Tooltip.Content side="top" align="center">
 *   Tooltip text
 *   <Tooltip.Arrow />
 * </Tooltip.Content>
 * ```
 */
const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ children, className, side = 'top', sideOffset = 4, align = 'center', alignOffset = 0, nodeId, ...props }, ref) => (
    <TooltipPrimitive.Content
      ref={ref}
      side={side}
      sideOffset={sideOffset}
      align={align}
      alignOffset={alignOffset}
      className={cn(tooltipContentVariants(), className)}
      data-node-id={nodeId ? `${nodeId}-content` : undefined}
      {...props}
    >
      {children}
    </TooltipPrimitive.Content>
  ),
)

TooltipContent.displayName = 'Tooltip.Content'

/**
 * TooltipArrow component
 *
 * @description
 * Optional arrow indicator pointing to the trigger element.
 *
 * @example
 * ```tsx
 * <Tooltip.Content>
 *   Content
 *   <Tooltip.Arrow />
 * </Tooltip.Content>
 * ```
 */
const TooltipArrow = React.forwardRef<SVGSVGElement, TooltipArrowProps>(
  ({ className, width = 11, height = 5, ...props }, ref) => (
    <TooltipPrimitive.Arrow
      ref={ref}
      width={width}
      height={height}
      className={cn(tooltipArrowVariants(), className)}
      {...props}
    />
  ),
)

TooltipArrow.displayName = 'Tooltip.Arrow'

/**
 * Tooltip compound component (ADS style)
 *
 * @description
 * A floating, non-actionable label used to explain a user interface element or feature.
 * Displays information when hovering or focusing on the trigger element.
 *
 * Features:
 * - Dark background with white text (ADS design system)
 * - Configurable positioning (top/right/bottom/left)
 * - Configurable alignment (start/center/end)
 * - Adjustable delay duration
 * - Optional arrow indicator
 * - Accessible by default (keyboard navigation, screen reader support)
 * - SDUI integration via nodeId prop
 *
 * @example
 * ```tsx
 * // Compound Pattern Usage
 * <Tooltip.Provider>
 *   <Tooltip.Root>
 *     <Tooltip.Trigger>
 *       <button>+</button>
 *     </Tooltip.Trigger>
 *     <Tooltip.Portal>
 *       <Tooltip.Content side="top">
 *         Add to library
 *         <Tooltip.Arrow />
 *       </Tooltip.Content>
 *     </Tooltip.Portal>
 *   </Tooltip.Root>
 * </Tooltip.Provider>
 * ```
 *
 * @example
 * ```tsx
 * // Simple Usage with shorthand
 * <Tooltip content="Add to library">
 *   <button>+</button>
 * </Tooltip>
 * ```
 */
const Tooltip = Object.assign(TooltipRoot, {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Content: TooltipContent,
  Arrow: TooltipArrow,
})

export {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
}
