import React from 'react'

import { cn } from '../../lib/cn'
import { tagRemoveButtonVariants, tagVariants } from './tag-variants'
import type { TagProps } from './types'

/**
 * Remove icon component for removable tags
 */
const RemoveIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

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
 * Supports:
 * - 11 color variants
 * - Link style with underline
 * - Removable with close button
 * - Icon before text
 *
 * @see https://atlassian.design/components/tag/usage
 *
 * @example
 * ```tsx
 * <Tag text="Label" color="blue" />
 * ```
 *
 * @example
 * ```tsx
 * // Removable tag
 * <Tag text="React" isRemovable onRemove={() => handleRemove('react')} />
 * ```
 *
 * @example
 * ```tsx
 * // Link tag
 * <Tag text="Documentation" isLink href="/docs" />
 * ```
 *
 * @example
 * ```tsx
 * // SDUI integration
 * <Tag nodeId="tag-1" eventId="tag-click" text="Label" />
 * ```
 */
export const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      text,
      color = 'standard',
      isRemovable = false,
      isLink = false,
      iconBefore,
      onRemove,
      onClick,
      href,
      className,
      nodeId,
      eventId,
      ...props
    },
    ref,
  ) => {
    const isClickable = Boolean(onClick || href)
    const variantClasses = tagVariants({
      color,
      isLink,
      isClickable,
    })

    const handleRemoveClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      onRemove?.()
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (isRemovable && onRemove) {
          e.preventDefault()
          onRemove()
        }
      }
    }

    const content = (
      <>
        {iconBefore && <IconWrapper>{iconBefore}</IconWrapper>}
        <span className={cn(isLink && 'underline')}>{text}</span>
        {isRemovable && (
          <button
            type="button"
            onClick={handleRemoveClick}
            className={tagRemoveButtonVariants({ color })}
            aria-label={`Remove ${text}`}
          >
            <RemoveIcon />
          </button>
        )}
      </>
    )

    // Link variant
    if (href) {
      return (
        <a
          href={href}
          onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
          className={cn(variantClasses, className)}
          data-node-id={nodeId}
          data-event-id={eventId}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </a>
      )
    }

    // Default span variant
    return (
      <span
        ref={ref}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable || isRemovable ? 0 : undefined}
        onClick={onClick as React.MouseEventHandler<HTMLSpanElement>}
        onKeyDown={handleKeyDown}
        className={cn(variantClasses, className)}
        data-node-id={nodeId}
        data-event-id={eventId}
        {...props}
      >
        {content}
      </span>
    )
  },
)

Tag.displayName = 'Tag'
