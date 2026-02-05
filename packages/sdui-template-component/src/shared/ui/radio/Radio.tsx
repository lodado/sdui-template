'use client'

import React, { useContext, useId, useMemo, useRef } from 'react'

import { useCombinedRef } from '../../hooks/useCombinedRef'
import { cn } from '../../lib/cn'
import { RadioContext, useRadioContext } from './provider/RadioContext'
import { useRadioGroupLegacyContext } from './provider/RadioGroupContext'
import { radioIndicatorVariants, radioVariants } from './radio-variants'
import type { RadioLabelProps, RadioRadioProps, RadioRootProps } from './types'

/**
 * Radio Root Component
 *
 * @description
 * Root component for Radio compound component pattern.
 * Provides Context to child components (Radio, Label).
 * Manages shared state (error, disabled, required, radioId, name).
 *
 * @example
 * ```tsx
 * <Radio.Root disabled={false} required={true} error={false} name="option">
 *   <Radio.Label>Option 1</Radio.Label>
 *   <Radio.Radio value="option1" checked={isChecked} onCheckedChange={setIsChecked} />
 * </Radio.Root>
 * ```
 */
const RadioRoot = React.forwardRef<HTMLDivElement, RadioRootProps>(
  ({ disabled, required, error, name, nodeId, eventId, id, className, children }, ref) => {
    // Check if inside RadioGroup legacy context (non-SDUI mode)
    const legacyGroupContext = useRadioGroupLegacyContext()
    
    // Use props, fallback to legacy context (non-SDUI mode), then default
    // Note: In SDUI mode, disabled/error/required come from provider's state via providerId subscription in RadioContainer
    const finalDisabled = disabled ?? legacyGroupContext?.disabled ?? false
    const finalRequired = required ?? legacyGroupContext?.required ?? false
    const finalError = error ?? legacyGroupContext?.error ?? false
    const finalName = name ?? legacyGroupContext?.groupName

    // Generate unique ID for label-radio connection
    const generatedId = useId()
    const radioId = id ?? generatedId

    // Create context value (memoized to prevent unnecessary re-renders)
    const contextValue = useMemo(
      () => ({
        radioId,
        error: finalError,
        disabled: finalDisabled,
        required: finalRequired,
        name: finalName,
      }),
      [radioId, finalError, finalDisabled, finalRequired, finalName],
    )

    return (
      <RadioContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn('flex items-center gap-[var(--space-100)]', className)}
          data-node-id={nodeId}
          data-event-id={eventId}
        >
          {children}
        </div>
      </RadioContext.Provider>
    )
  },
)

RadioRoot.displayName = 'Radio.Root'

/**
 * Radio Indicator Dot
 *
 * @description
 * Inner dot displayed when radio is checked.
 */
const RadioIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { checked?: boolean }
>(({ className, checked = false, ...props }, ref) => {
  // Only show indicator when checked
  if (!checked) {
    return null
  }

  return (
    <div
      ref={ref}
      className={cn(radioIndicatorVariants(), className)}
      {...props}
    />
  )
})

RadioIndicator.displayName = 'Radio.Indicator'

/**
 * Radio Radio Component
 *
 * @description
 * Native HTML radio implementation with full control.
 * Supports checked, unchecked, and disabled states.
 * Automatically connects to Label via Context.
 *
 * @example
 * ```tsx
 * <Radio.Radio value="option1" checked={isChecked} onCheckedChange={setIsChecked} />
 * ```
 */
const RadioRadio = React.forwardRef<HTMLInputElement, RadioRadioProps>(
  (
    {
      checked: checkedProp,
      defaultChecked,
      disabled,
      onCheckedChange,
      value,
      className,
      nodeId,
      eventId,
      id,
      name: nameProp,
      ...props
    },
    ref,
  ) => {
    const context = useContext(RadioContext)
    const legacyGroupContext = useRadioGroupLegacyContext()
    
    // Note: In SDUI mode, disabled/error state comes from provider's state via providerId subscription
    // In non-SDUI mode, legacyGroupContext provides disabled/error
    const isDisabled = disabled ?? context?.disabled ?? legacyGroupContext?.disabled ?? false
    const isError = context?.error ?? legacyGroupContext?.error ?? false
    const inputRef = useRef<HTMLInputElement>(null)

    // Combine external ref with internal ref
    const combinedRef = useCombinedRef(ref, inputRef)

    // Use provided id or context radioId
    const finalRadioId = id ?? context?.radioId

    // Use provided name, context name, or legacy group name
    // Note: In SDUI mode, name comes from provider's state via providerId subscription
    const finalName = nameProp ?? context?.name ?? legacyGroupContext?.groupName

    // Determine checked state:
    // - If in RadioGroup (legacy context): compare value with group's value
    // - If in SDUI mode: checked state is determined by providerId subscription in RadioRadioContainer
    // - Otherwise: use prop directly
    const isInGroup = legacyGroupContext !== null
    const isChecked = isInGroup
      ? legacyGroupContext.value === value
      : checkedProp ?? false

    // Handle change event
    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isDisabled) {
          if (isInGroup && legacyGroupContext?.onValueChange) {
            // In group (non-SDUI): notify group of value change
            legacyGroupContext.onValueChange(value)
          } else if (onCheckedChange) {
            // Standalone: use local callback
            onCheckedChange(e.target.checked)
          }
        }
      },
      [isDisabled, isInGroup, legacyGroupContext, value, onCheckedChange],
    )

    // Handle keyboard events (Space and Enter)
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          if (!isDisabled) {
            if (isInGroup && legacyGroupContext?.onValueChange && !isChecked) {
              legacyGroupContext.onValueChange(value)
            } else if (onCheckedChange && !isChecked) {
              onCheckedChange(true)
            }
          }
        }
      },
      [isChecked, isDisabled, isInGroup, legacyGroupContext, value, onCheckedChange],
    )

    return (
      <div className="relative inline-flex">
        <input
          ref={combinedRef}
          type="radio"
          id={finalRadioId}
          name={finalName}
          value={value}
          checked={isChecked}
          disabled={isDisabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={cn(radioVariants({ error: isError }), className)}
          data-node-id={nodeId}
          data-event-id={eventId}
          data-error={isError ? '' : undefined}
          aria-checked={isChecked}
          aria-disabled={isDisabled}
          {...props}
        />
        {/* Show indicator when checked */}
        <RadioIndicator checked={isChecked} />
      </div>
    )
  },
)

RadioRadio.displayName = 'Radio.Radio'

/**
 * Radio Label Component
 *
 * @description
 * Label component for Radio.
 * Automatically connects to radio via Context (htmlFor/id).
 * Displays required indicator and error styling.
 *
 * @example
 * ```tsx
 * <Radio.Label>Option 1</Radio.Label>
 * ```
 */
const RadioLabel = React.forwardRef<HTMLLabelElement, RadioLabelProps>(
  ({ children, className, ...props }, ref) => {
    const context = useContext(RadioContext)
    
    // Use context values if available
    // Note: In SDUI mode, error/required come from provider's state via providerId subscription
    const radioId = context?.radioId
    const error = context?.error ?? false
    const required = context?.required ?? false
    
    if (!radioId) {
      throw new Error('Radio.Label must be used within Radio.Root')
    }
    
    const labelId = `${radioId}-label`

    return (
      <label
        ref={ref}
        htmlFor={radioId}
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

RadioLabel.displayName = 'Radio.Label'

// ============================================
// Compound Component Export
// ============================================

/**
 * Radio compound component
 *
 * @description
 * Compound pattern for maximum flexibility.
 * Use Radio.Root, Radio.Radio, and Radio.Label together.
 *
 * @example
 * ```tsx
 * // Full compound pattern
 * <Radio.Root name="option">
 *   <Radio.Label>Option 1</Radio.Label>
 *   <Radio.Radio value="option1" checked={isChecked} onCheckedChange={setIsChecked} />
 * </Radio.Root>
 * ```
 */
export const Radio = {
  Root: RadioRoot,
  Radio: RadioRadio,
  Label: RadioLabel,
  Indicator: RadioIndicator,
}

export type { RadioLabelProps, RadioRadioProps, RadioRootProps }
