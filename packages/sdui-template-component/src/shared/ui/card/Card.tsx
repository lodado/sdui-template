import { Slot } from '@radix-ui/react-slot'
import React from 'react'

import { cn } from '../../lib/cn'
import { cardVariants } from './card-variants'
import type { CardProps } from './types'

/**
 * Card component
 *
 * @description
 * Card component for creating container cards with optional title.
 * Supports design system specifications with rounded corners, shadow, and background color.
 * Integrates with SDUI template system.
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
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className,
      nodeId,
      eventId,
      title,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    // Get variant classes
    const variantClasses = cardVariants()

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
          {title && <h3 className="mb-4 text-lg font-bold text-[var(--color-text-default)]">{title}</h3>}
          {children}
        </Slot>
      )
    }

    return (
      <div
        ref={ref}
        className={mergedClassName}
        data-node-id={nodeId}
        data-event-id={eventId}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      >
        {title && <h3 className="mb-4 text-lg font-bold text-[var(--color-text-default)]">{title}</h3>}
        {children}
      </div>
    )
  },
)

Card.displayName = 'Card'
