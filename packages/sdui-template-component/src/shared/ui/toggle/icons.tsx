import React from 'react'

import { cn } from '../../lib/cn'

interface IconProps {
  className?: string
}

/**
 * Check icon for checked state
 */
export const CheckIcon = ({ className }: IconProps) => (
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

CheckIcon.displayName = 'CheckIcon'

/**
 * Cross icon for unchecked state
 */
export const CrossIcon = ({ className }: IconProps) => (
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

CrossIcon.displayName = 'CrossIcon'

/**
 * Loading spinner for loading state
 */
export const LoadingSpinner = ({ className }: IconProps) => (
  <svg
    className={cn('animate-spin', className)}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="6"
      cy="6"
      r="5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M6 1a5 5 0 014.33 2.5l-1.3.75A3.5 3.5 0 006 2.5V1z"
    />
  </svg>
)

LoadingSpinner.displayName = 'LoadingSpinner'

export type { IconProps }
