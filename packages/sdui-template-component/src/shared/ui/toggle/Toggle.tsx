'use client'

import * as SwitchPrimitive from '@radix-ui/react-switch'
import React from 'react'

import { cn } from '../../lib/cn'
import { toggleThumbVariants, toggleVariants } from './toggle-variants'
import { ToggleCheckIcon, ToggleCrossIcon } from './ToggleIcons'
import type { ToggleProps } from './types'
import { getIconDataState } from './utils'

/**
 * Toggle component (ADS style) - Built on Radix UI Switch
 *
 * @description
 * Toggle/Switch component following Atlassian Design System specifications.
 * A toggle is used to view or switch between enabled or disabled states.
 * Built on top of Radix UI's Switch primitive for accessibility and keyboard support.
 *
 * @see https://atlassian.design/components/toggle/usage
 * @see https://www.radix-ui.com/primitives/docs/components/switch
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
    const isNonInteractive = isDisabled || isLoading
    const isControlled = controlledChecked !== undefined
    const iconDataState = getIconDataState(isControlled, controlledChecked)

    const handleCheckedChange = (checked: boolean) => {
      if (isLoading) return
      onChange?.(checked)
    }

    return (
      <SwitchPrimitive.Root
        ref={ref}
        id={id}
        name={name}
        checked={controlledChecked}
        defaultChecked={defaultChecked}
        disabled={isNonInteractive}
        onCheckedChange={handleCheckedChange}
        aria-label={label}
        aria-busy={isLoading || undefined}
        className={cn(
          toggleVariants({ size, isDisabled, isLoading }),
          className,
        )}
        data-node-id={nodeId}
        data-event-id={eventId}
        data-loading={isLoading || undefined}
        {...props}
      >
        <ToggleCheckIcon
          size={size}
          iconDataState={iconDataState}
          isLoading={isLoading}
        />
        <ToggleCrossIcon
          size={size}
          iconDataState={iconDataState}
        />
        <SwitchPrimitive.Thumb className={toggleThumbVariants({ size })} />
      </SwitchPrimitive.Root>
    )
  },
)

Toggle.displayName = 'Toggle'
