import React from 'react'

import { cn } from '../../lib/cn'
import { buttonVariants } from './button-variants'
import type { ButtonProps } from './types'

/**
 * Button component
 *
 * @description
 * A flexible, accessible button component built with Radix UI primitives.
 * Supports multiple variants, sizes, and integrates with SDUI template system.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Submit
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * // SDUI integration
 * <Button nodeId="button-1" eventId="submit-click">
 *   Submit
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      disabled = false,
      children,
      onClick,
      className,
      nodeId,
      eventId,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    // Handle keyboard events (Enter and Space)
    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      // Allow default behavior for Enter and Space (standard button behavior)
      // Only prevent default if disabled
      if (disabled && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault()
        return
      }

      // Call parent's onKeyDown if provided
      props.onKeyDown?.(event)
    }

    // Handle click events
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) {
        event.preventDefault()
        return
      }

      onClick?.(event)
    }

    // Get variant classes
    const variantClasses = buttonVariants({ variant, size })

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(variantClasses, className)}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'

