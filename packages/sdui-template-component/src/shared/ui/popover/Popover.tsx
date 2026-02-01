'use client'

import * as PopoverPrimitive from '@radix-ui/react-popover'
import React, { createContext, useContext, useMemo } from 'react'

import { cn } from '../../lib/cn'
import { popoverCloseVariants, popoverContentVariants } from './popover-variants'
import type {
  PopoverArrowProps,
  PopoverCloseProps,
  PopoverContentProps,
  PopoverRootProps,
  PopoverTriggerProps,
} from './types'

// =============================================================================
// Icons
// =============================================================================

/**
 * Close icon (X) for popover close button
 */
const CloseIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn('w-4 h-4', className)}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12 4L4 12M4 4L12 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// =============================================================================
// Context (providerId inheritance)
// =============================================================================

interface PopoverContextValue {
  providerId: string
}

const PopoverContext = createContext<PopoverContextValue | null>(null)

/**
 * Hook to get providerId from Popover context
 * Used by child components when providerId is not explicitly provided in state
 */
export const usePopoverContext = () => useContext(PopoverContext)

// =============================================================================
// Compound Components
// =============================================================================

/**
 * Popover.Root - Context provider and state management
 * Provides PopoverContext for child components to inherit providerId
 */
const PopoverRoot = ({ id, children, ...props }: PopoverRootProps) => {
  const contextValue = useMemo(() => (id ? { providerId: id } : null), [id])

  const content = <PopoverPrimitive.Root {...props}>{children}</PopoverPrimitive.Root>

  // Wrap with context only if id is provided
  if (contextValue) {
    return <PopoverContext.Provider value={contextValue}>{content}</PopoverContext.Provider>
  }

  return content
}
PopoverRoot.displayName = 'Popover.Root'

/**
 * Popover.Trigger - Trigger element wrapper
 */
const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ children, asChild = true, className, ...props }, ref) => {
    return (
      <PopoverPrimitive.Trigger ref={ref} asChild={asChild} className={className} {...props}>
        {children}
      </PopoverPrimitive.Trigger>
    )
  },
)
PopoverTrigger.displayName = 'Popover.Trigger'

/**
 * Popover.Content - Main popover container (includes Portal)
 */
const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ size = 'medium', className, children, side = 'bottom', sideOffset = 4, align = 'start', ...props }, ref) => {
    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          side={side}
          sideOffset={sideOffset}
          align={align}
          className={cn(popoverContentVariants({ size }), className)}
          {...props}
        >
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    )
  },
)
PopoverContent.displayName = 'Popover.Content'

/**
 * Popover.Close - Close button (default: X icon)
 */
const PopoverClose = React.forwardRef<HTMLButtonElement, PopoverCloseProps>(
  ({ children, asChild, className, ...props }, ref) => {
    return (
      <PopoverPrimitive.Close
        ref={ref}
        asChild={asChild}
        className={cn(!asChild && popoverCloseVariants(), className)}
        aria-label="Close"
        {...props}
      >
        {children ?? <CloseIcon />}
      </PopoverPrimitive.Close>
    )
  },
)
PopoverClose.displayName = 'Popover.Close'

/**
 * Popover.Arrow - Arrow pointing to trigger
 */
const PopoverArrow = React.forwardRef<SVGSVGElement, PopoverArrowProps>(
  ({ width = 10, height = 5, className, ...props }, ref) => {
    return (
      <PopoverPrimitive.Arrow
        ref={ref}
        width={width}
        height={height}
        className={cn('fill-white', className)}
        {...props}
      />
    )
  },
)
PopoverArrow.displayName = 'Popover.Arrow'

// =============================================================================
// Compound Pattern Export
// =============================================================================

/**
 * Popover compound component
 *
 * @description
 * A popover component for displaying contextual content on trigger.
 * Uses Radix UI Popover primitive for full accessibility support.
 *
 * Features:
 * - Compound pattern for maximum flexibility
 * - Keyboard navigation (Escape to close)
 * - Focus trap and restoration
 * - ARIA attributes for screen readers
 * - Customizable through sub-components
 * - Automatic providerId inheritance from parent context
 *
 * @example
 * ```tsx
 * // Full compound pattern
 * <Popover.Root>
 *   <Popover.Trigger asChild>
 *     <Button>Open Popover</Button>
 *   </Popover.Trigger>
 *   <Popover.Content>
 *     <div>Content here...</div>
 *     <Popover.Close />
 *   </Popover.Content>
 * </Popover.Root>
 * ```
 */
export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Close: PopoverClose,
  Arrow: PopoverArrow,
}

// Named exports for individual components
export { PopoverArrow, PopoverClose, PopoverContent, PopoverRoot, PopoverTrigger }
