import React, { useCallback, useState } from 'react'

import { cn } from '../../lib/cn'
import { toggleDotVariants, toggleIconVariants, toggleVariants } from './toggle-variants'
import type { ToggleProps } from './types'

/**
 * Check icon for checked state
 */
const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M2.5 6L5 8.5L9.5 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/**
 * Cross icon for unchecked state
 */
const CrossIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M3 3L9 9M9 3L3 9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/**
 * Loading spinner for loading state
 */
const LoadingSpinner = ({ className }: { className?: string }) => (
  <svg
    className={cn('animate-spin', className)}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M6 1a5 5 0 014.33 2.5l-1.3.75A3.5 3.5 0 006 2.5V1z"
    />
  </svg>
)

/**
 * Toggle component (ADS style)
 *
 * @description
 * Toggle/Switch component following Atlassian Design System specifications.
 * A toggle is used to view or switch between enabled or disabled states.
 *
 * @see https://atlassian.design/components/toggle/usage
 *
 * @example
 * ```tsx
 * // Controlled
 * <Toggle isChecked={isEnabled} onChange={setIsEnabled} label="Enable feature" />
 * ```
 *
 * @example
 * ```tsx
 * // Uncontrolled
 * <Toggle defaultChecked label="Dark mode" />
 * ```
 *
 * @example
 * ```tsx
 * // SDUI integration
 * <Toggle nodeId="toggle-1" eventId="feature-toggle" />
 * ```
 */
export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      isChecked: controlledChecked,
      defaultChecked = false,
      isDisabled = false,
      isLoading = false,
      size = 'regular',
      onChange,
      label,
      className,
      nodeId,
      eventId,
      id,
      name,
      ...props
    },
    ref,
  ) => {
    // Internal state for uncontrolled mode
    const [internalChecked, setInternalChecked] = useState(defaultChecked)

    // Use controlled value if provided, otherwise use internal state
    const isControlled = controlledChecked !== undefined
    const isChecked = isControlled ? controlledChecked : internalChecked

    // Handle toggle click
    const handleClick = useCallback(() => {
      if (isDisabled || isLoading) return

      const newChecked = !isChecked

      // Update internal state if uncontrolled
      if (!isControlled) {
        setInternalChecked(newChecked)
      }

      // Call onChange callback
      onChange?.(newChecked)
    }, [isChecked, isControlled, isDisabled, isLoading, onChange])

    // Handle keyboard interaction
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault()
          handleClick()
        }
      },
      [handleClick],
    )

    const isNonInteractive = isDisabled || isLoading

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        id={id}
        aria-checked={isChecked}
        aria-label={label}
        aria-disabled={isNonInteractive}
        aria-busy={isLoading || undefined}
        disabled={isNonInteractive}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          toggleVariants({ size, isChecked, isDisabled, isLoading }),
          className,
        )}
        data-node-id={nodeId}
        data-event-id={eventId}
        data-checked={isChecked || undefined}
        data-loading={isLoading || undefined}
        {...props}
      >
        {/* Check icon (left side, visible when checked) */}
        <span
          className={cn(
            toggleIconVariants({ size, position: 'check' }),
            isChecked ? 'opacity-100' : 'opacity-0',
          )}
        >
          {isLoading ? (
            <LoadingSpinner className="w-full h-full" />
          ) : (
            <CheckIcon className="w-full h-full" />
          )}
        </span>

        {/* Cross icon (right side, visible when unchecked) */}
        <span
          className={cn(
            toggleIconVariants({ size, position: 'cross' }),
            isChecked ? 'opacity-0' : 'opacity-100',
          )}
        >
          <CrossIcon className="w-full h-full" />
        </span>

        {/* Dot (thumb) */}
        <span
          className={toggleDotVariants({ size, isChecked })}
          aria-hidden="true"
        />

        {/* Hidden input for form integration */}
        {name && (
          <input
            type="hidden"
            name={name}
            value={isChecked ? 'true' : 'false'}
          />
        )}
      </button>
    )
  },
)

Toggle.displayName = 'Toggle'
