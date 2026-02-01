import React from 'react'

import { cn } from '../../lib/cn'
import { CheckIcon, CrossIcon, LoadingSpinner } from './icons'
import { toggleIconVariants } from './toggle-variants'
import type { ToggleSize } from './types'

interface ToggleIconsProps {
  size: ToggleSize
  iconDataState: 'checked' | 'unchecked' | undefined
  isLoading: boolean
}

const ICON_CLASS = 'w-full h-full'

/**
 * Status-based icon renderer for check area
 *
 * @description
 * Renders LoadingSpinner when loading, CheckIcon otherwise.
 */
const CheckAreaIcon = ({ isLoading }: { isLoading: boolean }) => {
  if (isLoading) {
    return <LoadingSpinner className={ICON_CLASS} />
  }
  return <CheckIcon className={ICON_CLASS} />
}

CheckAreaIcon.displayName = 'CheckAreaIcon'

/**
 * Check area icon component (visible when checked)
 *
 * @description
 * Renders the left-side icon area of the toggle.
 * Shows LoadingSpinner when loading, CheckIcon otherwise.
 */
export const ToggleCheckIcon = ({
  size,
  iconDataState,
  isLoading,
}: ToggleIconsProps) => (
  <span
    className={cn(
      toggleIconVariants({ size, position: 'check' }),
      'transition-opacity duration-200',
      'opacity-0 data-[state=checked]:opacity-100',
    )}
    data-state={iconDataState}
  >
    <CheckAreaIcon isLoading={isLoading} />
  </span>
)

ToggleCheckIcon.displayName = 'ToggleCheckIcon'

/**
 * Cross area icon component (visible when unchecked)
 *
 * @description
 * Renders the right-side icon area of the toggle.
 * Always shows CrossIcon.
 */
export const ToggleCrossIcon = ({
  size,
  iconDataState,
}: Omit<ToggleIconsProps, 'isLoading'>) => (
  <span
    className={cn(
      toggleIconVariants({ size, position: 'cross' }),
      'transition-opacity duration-200',
      'opacity-100 data-[state=checked]:opacity-0',
    )}
    data-state={iconDataState}
  >
    <CrossIcon className={ICON_CLASS} />
  </span>
)

ToggleCrossIcon.displayName = 'ToggleCrossIcon'
