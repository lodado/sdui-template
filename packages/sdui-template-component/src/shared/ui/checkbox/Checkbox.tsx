'use client'

import React, { useId, useMemo, useRef } from 'react'

import { useCheckboxHandlers } from '../../hooks/useCheckboxHandlers'
import { useCombinedRef } from '../../hooks/useCombinedRef'
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
        <div
          ref={ref}
          className={cn('flex items-center gap-[var(--space-100)]', className)}
          data-node-id={nodeId}
          data-event-id={eventId}
        >
          {children}
        </div>
      </CheckboxContext.Provider>
    )
  },
)

CheckboxRoot.displayName = 'Checkbox.Root'

/**
 * Check icon for checkbox checked state
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
 * Indeterminate icon (horizontal dash) for checkbox indeterminate state
 */
const IndeterminateIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M2.5 6H9.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

IndeterminateIcon.displayName = 'IndeterminateIcon'

/**
 * Checkbox Indicator Icon
 *
 * @description
 * Checkmark icon displayed when checkbox is checked.
 * Horizontal dash icon displayed when checkbox is indeterminate.
 */
const CheckboxIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { indeterminate?: boolean; checked?: boolean }
>(({ className, indeterminate = false, checked = false, ...props }, ref) => {
  // Only show indicator when checked or indeterminate
  if (!checked && !indeterminate) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn('absolute inset-0 flex items-center justify-center text-white pointer-events-none', className)}
      {...props}
    >
      {indeterminate ? (
        <IndeterminateIcon className="w-3 h-3" />
      ) : (
        <CheckIcon className="w-3 h-3" />
      )}
    </div>
  )
})

CheckboxIndicator.displayName = 'Checkbox.Indicator'

/**
 * Checkbox Checkbox Component
 *
 * @description
 * Native HTML checkbox implementation with full control.
 * Supports checked, unchecked, indeterminate, and disabled states.
 * Automatically connects to Label via Context.
 *
 * @example
 * ```tsx
 * <Checkbox.Checkbox checked={isChecked} onCheckedChange={setIsChecked} />
 * ```
 */
const CheckboxCheckbox = React.forwardRef<HTMLInputElement, CheckboxCheckboxProps>(
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
    const isError = context?.error ?? false
    const inputRef = useRef<HTMLInputElement>(null)

    // Combine external ref with internal ref
    const combinedRef = useCombinedRef(ref, inputRef)

    // Use provided id or context checkboxId
    const finalCheckboxId = id ?? context?.checkboxId

    // Determine if controlled or uncontrolled
    const isControlled = checked !== undefined
    const isChecked = checked ?? false

    // For uncontrolled mode, track internal checked state
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false)
    const actualChecked = isControlled ? isChecked : internalChecked

    // Controlled mode handlers
    const { handleChange: handleControlledChange, handleKeyDown: handleControlledKeyDown } =
      useCheckboxHandlers({
        checked: isChecked,
        disabled: isDisabled,
        onCheckedChange,
      })

    // Uncontrolled mode handlers
    const { handleChange: handleUncontrolledChangeBase, handleKeyDown: handleUncontrolledKeyDown } =
      useCheckboxHandlers({
        checked: internalChecked,
        disabled: isDisabled,
        onCheckedChange: (newChecked) => {
          setInternalChecked(newChecked)
          onCheckedChange?.(newChecked)
        },
      })

    // Combine handlers based on mode
    const handleChange = isControlled ? handleControlledChange : handleUncontrolledChangeBase
    const handleKeyDown = isControlled ? handleControlledKeyDown : handleUncontrolledKeyDown

    return (
      <div className="relative inline-flex">
        <input
          ref={combinedRef}
          type="checkbox"
          id={finalCheckboxId}
          name={name}
          {...(isControlled ? { checked: isChecked } : { defaultChecked })}
          disabled={isDisabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={cn(checkboxVariants({ error: isError }), className)}
          data-node-id={nodeId}
          data-event-id={eventId}
          data-indeterminate={indeterminate ? '' : undefined}
          data-error={isError ? '' : undefined}
          aria-checked={indeterminate ? 'mixed' : actualChecked}
          aria-disabled={isDisabled}
          {...props}
        />
        {/* Show indicator when checked or indeterminate */}
        <CheckboxIndicator indeterminate={indeterminate} checked={actualChecked} />
      </div>
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

export type { CheckboxCheckboxProps, CheckboxLabelProps, CheckboxRootProps }
