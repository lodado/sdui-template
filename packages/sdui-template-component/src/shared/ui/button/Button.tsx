import { Slot } from '@radix-ui/react-slot'
import React from 'react'

import { cn } from '../../lib/cn'
import { buttonVariants } from './button-variants'
import type { ButtonProps } from './types'

/**
 * Loading spinner component for button loading state
 */
const LoadingSpinner = () => (
  <svg
    className="animate-spin h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

/**
 * Icon wrapper for consistent sizing
 */
const IconWrapper = ({ children, position }: { children: React.ReactNode; position: 'before' | 'after' }) => (
  <span
    className={cn('inline-flex items-center justify-center shrink-0', position === 'before' ? 'w-4 h-4' : 'w-3 h-3')}
    aria-hidden="true"
  >
    {children}
  </span>
)

/**
 * Button content renderer
 */
const ButtonContent = ({
  isLoading,
  iconBefore,
  iconAfter,
  children,
}: {
  isLoading: boolean
  iconBefore?: React.ReactNode
  iconAfter?: React.ReactNode
  children?: React.ReactNode
}) => (
  <>
    {isLoading && <LoadingSpinner />}
    {!isLoading && iconBefore && <IconWrapper position="before">{iconBefore}</IconWrapper>}
    {children && <span className={cn(isLoading && 'opacity-0')}>{children}</span>}
    {!isLoading && iconAfter && <IconWrapper position="after">{iconAfter}</IconWrapper>}
  </>
)

/**
 * Button component (ADS style)
 *
 * @description
 * Button component following Atlassian Design System (ADS) specifications.
 * Supports appearance (default/primary/subtle/warning/danger), spacing (default/compact).
 * Includes loading state, selected state, and icon support.
 * Integrates with SDUI template system.
 *
 * @example
 * ```tsx
 * <Button appearance="primary" onClick={handleClick}>
 *   Submit
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * // With icons and loading state
 * <Button
 *   appearance="primary"
 *   iconBefore={<SearchIcon />}
 *   isLoading={isSubmitting}
 * >
 *   Search
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * // SDUI integration
 * <Button nodeId="button-1" eventId="submit-click" appearance="primary">
 *   Submit
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      asChild = false,
      appearance = 'default',
      spacing = 'default',
      isDisabled = false,
      isLoading = false,
      isSelected = false,
      iconBefore,
      iconAfter,
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
      appearance,
      spacing,
      isDisabled,
      isSelected,
      isLoading,
    })

    const mergedClassName = cn(variantClasses, className)

    // Determine if button should be non-interactive
    const isNonInteractive = isDisabled || isLoading

    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={mergedClassName}
          data-node-id={nodeId}
          data-event-id={eventId}
          data-loading={isLoading || undefined}
          data-selected={isSelected || undefined}
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
        disabled={isNonInteractive}
        onClick={onClick}
        className={mergedClassName}
        aria-disabled={isNonInteractive}
        aria-busy={isLoading || undefined}
        aria-pressed={isSelected || undefined}
        data-node-id={nodeId}
        data-event-id={eventId}
        data-loading={isLoading || undefined}
        data-selected={isSelected || undefined}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      >
        <ButtonContent isLoading={isLoading} iconBefore={iconBefore} iconAfter={iconAfter}>
          {children}
        </ButtonContent>
      </button>
    )
  },
)

Button.displayName = 'Button'
