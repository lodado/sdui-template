import React from 'react'

import { cn } from '../../lib/cn'
import { badgeVariants } from './badge-variants'
import type { BadgeProps } from './types'

/**
 * Badge component (ADS style)
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
export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ label, appearance = 'default', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ appearance }), className)}
        data-name="appearance=default"
        {...props}
      >
        <p
          className={[
            'font-[family-name:var(--🌮-font-family/body,\'Atlassian_Sans:Regular\',sans-serif)]',
            'leading-[var(--🌮-line-height/body-s,16px)]',
            'not-italic relative shrink-0',
            'text-center',
          ].join(' ')}
          style={{ fontFeatureSettings: "'liga' 0, 'calt' 0" }}
        >
          {label}
        </p>
      </div>
    )
  },
)

Badge.displayName = 'Badge'
