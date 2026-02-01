import React from 'react'

import { cn } from '../../lib/cn'
import { tagVariants } from './tag-variants'
import type { TagProps } from './types'

/**
 * Icon wrapper for consistent sizing
 */
const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center justify-center shrink-0 w-4 h-4 mr-0.5" aria-hidden="true">
    {children}
  </span>
)

/**
 * Tag component (ADS style)
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
export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ text, color = 'standard', iconBefore, className, ...props }, ref) => {
    return (
      <span ref={ref} className={cn(tagVariants({ color }), className)} {...props}>
        {iconBefore && <IconWrapper>{iconBefore}</IconWrapper>}
        <span>{text}</span>
      </span>
    )
  },
)

Tag.displayName = 'Tag'
