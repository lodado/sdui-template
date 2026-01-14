import { Slot } from '@radix-ui/react-slot'
import React from 'react'

import { cn } from '../../lib/cn'
import { buttonVariants } from './button-variants'
import type { ButtonProps, ButtonSize, ButtonStyle, ButtonType } from './types'

/**
 * Button component
 *
 * @description
 * Button component supporting design system specifications.
 * Supports buttonStyle (filled/outline/text), size (L/M/S), buttonType (primary/secondary).
 * Integrates with SDUI template system.
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
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild = false,
      buttonStyle = 'filled',
      size = 'M',
      buttonType = 'primary',
      disabled = false,
      children,
      onClick,
      className,
      nodeId,
      eventId,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    // Get variant classes
    const variantClasses = buttonVariants({
      style: buttonStyle,
      size,
      type: buttonType,
      disabled,
    })

    const mergedClassName = cn(variantClasses, className)

    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={mergedClassName}
          data-node-id={nodeId}
          data-event-id={eventId}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <button
        ref={ref}
        type={type || 'button'}
        disabled={disabled}
        onClick={onClick}
        className={mergedClassName}
        aria-disabled={disabled}
        data-node-id={nodeId}
        data-event-id={eventId}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
