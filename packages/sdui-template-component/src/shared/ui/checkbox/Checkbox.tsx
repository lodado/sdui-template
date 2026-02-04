'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import React, { useId, useMemo } from 'react'

import { cn } from '../../lib/cn'
import { checkboxIndicatorVariants, checkboxVariants } from './checkbox-variants'
import { CheckboxContext, useCheckboxContext } from './CheckboxContext'
import type { CheckboxCheckboxProps, CheckboxLabelProps, CheckboxRootProps } from './types'

/**
 * Checkbox Root Component
 *
 * @description
 * Root component for Checkbox compound component pattern.
 * Provides Context to child components (Checkbox, Label).
 * Manages shared state (error, disabled, required, checkboxId).
 *
 * @example
 * ```tsx
 * <Checkbox.Root disabled={false} required={true} error={false}>
 *   <Checkbox.Label>Accept terms</Checkbox.Label>
 *   <Checkbox.Checkbox checked={isChecked} onCheckedChange={setIsChecked} />
 * </Checkbox.Root>
 * ```
 */
const CheckboxRoot = React.forwardRef<HTMLDivElement, CheckboxRootProps>(
  ({ disabled = false, required = false, error = false, nodeId, eventId, id, className, children }, ref) => {
    // Generate unique ID for label-checkbox connection
    const generatedId = useId()
    const checkboxId = id ?? generatedId

    // Create context value (memoized to prevent unnecessary re-renders)
    const contextValue = useMemo(
      () => ({
        checkboxId,
        error,
        disabled,
        required,
      }),
      [checkboxId, error, disabled, required],
    )

    return (
      <CheckboxContext.Provider value={contextValue}>
        <div ref={ref} className={cn('w-full h-full', className)} data-node-id={nodeId} data-event-id={eventId}>
          {children}
        </div>
      </CheckboxContext.Provider>
    )
  },
)

CheckboxRoot.displayName = 'Checkbox.Root'

/**
 * Check icon for checkbox checked/indeterminate state
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

CheckIcon.displayName = 'CheckIcon'

/**
 * Checkbox Indicator Icon
 *
 * @description
 * Checkmark icon displayed when checkbox is checked or indeterminate.
 */
const CheckboxIndicator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <CheckboxPrimitive.Indicator
        ref={ref}
        className={cn(checkboxIndicatorVariants(), className)}
        {...props}
      >
        <CheckIcon className="w-3 h-3" />
      </CheckboxPrimitive.Indicator>
    )
  },
)

CheckboxIndicator.displayName = 'Checkbox.Indicator'

/**
 * Checkbox Checkbox Component
 *
 * @description
 * Checkbox component built on Radix UI Checkbox.
 * Supports checked, unchecked, indeterminate, and disabled states.
 * Automatically connects to Label via Context.
 *
 * @example
 * ```tsx
 * <Checkbox.Checkbox checked={isChecked} onCheckedChange={setIsChecked} />
 * ```
 */
const CheckboxCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxCheckboxProps
>(
  (
    {
      checked,
      defaultChecked,
      indeterminate = false,
      disabled,
      onCheckedChange,
      className,
      nodeId,
      eventId,
      id,
      name,
      ...props
    },
    ref,
  ) => {
    const context = React.useContext(CheckboxContext)
    const isDisabled = disabled ?? context?.disabled ?? false

    // Use provided id or context checkboxId
    const finalCheckboxId = id ?? context?.checkboxId

    // Radix Checkbox doesn't support indeterminate directly
    // We set checked to false when indeterminate and use data-indeterminate attribute
    const checkedState = indeterminate ? false : checked

    return (
      <CheckboxPrimitive.Root
        ref={ref}
        id={finalCheckboxId}
        name={name}
        checked={checkedState}
        defaultChecked={defaultChecked}
        disabled={isDisabled}
        onCheckedChange={onCheckedChange}
        className={cn(checkboxVariants(), 'size-[14px]', className)}
        data-node-id={nodeId}
        data-event-id={eventId}
        data-indeterminate={indeterminate ? '' : undefined}
        {...props}
      >
        <CheckboxIndicator />
      </CheckboxPrimitive.Root>
    )
  },
)

CheckboxCheckbox.displayName = 'Checkbox.Checkbox'

/**
 * Checkbox Label Component
 *
 * @description
 * Label component for Checkbox.
 * Automatically connects to checkbox via Context (htmlFor/id).
 * Displays required indicator and error styling.
 *
 * @example
 * ```tsx
 * <Checkbox.Label>Accept terms and conditions</Checkbox.Label>
 * ```
 */
const CheckboxLabel = React.forwardRef<HTMLLabelElement, CheckboxLabelProps>(
  ({ children, className, ...props }, ref) => {
    const { checkboxId, error, required } = useCheckboxContext()
    const labelId = `${checkboxId}-label`

    return (
      <label
        ref={ref}
        htmlFor={checkboxId}
        id={labelId}
        className={cn(
          'text-sm leading-[1.429] text-[var(--color-text-default)] cursor-pointer',
          error && 'text-[var(--color-text-danger)]',
          className,
        )}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-[var(--color-text-danger)]">*</span>}
      </label>
    )
  },
)

CheckboxLabel.displayName = 'Checkbox.Label'

// ============================================
// Compound Component Export
// ============================================

/**
 * Checkbox compound component
 *
 * @description
 * Compound pattern for maximum flexibility.
 * Use Checkbox.Root, Checkbox.Checkbox, and Checkbox.Label together.
 *
 * @example
 * ```tsx
 * // Full compound pattern
 * <Checkbox.Root>
 *   <Checkbox.Label>Accept terms</Checkbox.Label>
 *   <Checkbox.Checkbox checked={isChecked} onCheckedChange={setIsChecked} />
 * </Checkbox.Root>
 * ```
 */
export const Checkbox = {
  Root: CheckboxRoot,
  Checkbox: CheckboxCheckbox,
  Label: CheckboxLabel,
  Indicator: CheckboxIndicator,
}

export type { CheckboxCheckboxProps, CheckboxLabelProps,CheckboxRootProps }
