'use client'

import React, { useId, useMemo } from 'react'

import { cn } from '../../lib/cn'
import {
  RadioGroupContext,
  RadioGroupLegacyContext,
  useRadioGroupContext,
  useRadioGroupLegacyContext,
} from './provider/RadioGroupContext'
import type { RadioGroupProps } from './RadioGroupTypes'

/**
 * RadioGroup Root Component
 *
 * @description
 * Root component for RadioGroup compound pattern.
 * Provides Context for child components to inherit providerId.
 * Manages shared state (value, disabled, required, error, name).
 *
 * @example
 * ```tsx
 * <RadioGroup.Root id="radio-group-1" value={selectedValue} onValueChange={setSelectedValue}>
 *   <Radio.Root>
 *     <Radio.Label>Option 1</Radio.Label>
 *     <Radio.Radio value="option1" />
 *   </Radio.Root>
 * </RadioGroup.Root>
 * ```
 */
export const RadioGroupRoot = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      name: nameProp,
      value,
      defaultValue,
      onValueChange,
      disabled = false,
      required = false,
      error = false,
      nodeId,
      eventId,
      id,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    // Generate unique name if not provided
    const generatedName = useId()
    const groupName = nameProp ?? generatedName

    // Determine if controlled or uncontrolled
    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue)

    // Current value
    const currentValue = isControlled ? value : internalValue

    // Handle value change
    const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (!isControlled) {
          setInternalValue(newValue)
        }
        onValueChange?.(newValue)
      },
      [isControlled, onValueChange],
    )

    // Create context value for providerId inheritance (SDUI mode)
    // id is the SDUI node ID, which also serves as providerId
    const providerContextValue = useMemo(() => (id ? { providerId: id } : null), [id])

    // Create legacy context value for non-SDUI mode
    const legacyContextValue = useMemo(
      () => ({
        groupName,
        value: currentValue,
        onValueChange: handleValueChange,
        disabled,
        required,
        error,
      }),
      [groupName, currentValue, handleValueChange, disabled, required, error],
    )

    const content = (
      <div
        ref={ref}
        className={cn('flex flex-col gap-[var(--space-100)]', className)}
        data-node-id={nodeId}
        data-event-id={eventId}
        role="radiogroup"
        aria-required={required}
        aria-invalid={error}
        {...props}
      >
        {children}
      </div>
    )

    // Wrap with both contexts:
    // - providerId context for SDUI mode (if id is provided)
    // - legacy context for non-SDUI mode (always provided)
    let wrappedContent = (
      <RadioGroupLegacyContext.Provider value={legacyContextValue}>{content}</RadioGroupLegacyContext.Provider>
    )

    if (providerContextValue) {
      wrappedContent = (
        <RadioGroupContext.Provider value={providerContextValue}>
          <RadioGroupLegacyContext.Provider value={legacyContextValue}>{content}</RadioGroupLegacyContext.Provider>
        </RadioGroupContext.Provider>
      )
    }

    return wrappedContent
  },
)

RadioGroupRoot.displayName = 'RadioGroup.Root'

/**
 * RadioGroup Component (Legacy API - for backward compatibility)
 *
 * @description
 * Container component for managing multiple Radio buttons.
 * Ensures only one radio can be selected at a time within the group.
 * Provides shared state (disabled, required, error, name) to all child radios.
 *
 * @deprecated Use RadioGroup.Root for SDUI integration
 * @example
 * ```tsx
 * <RadioGroup
 *   name="option"
 *   value={selectedValue}
 *   onValueChange={setSelectedValue}
 * >
 *   <Radio.Root>
 *     <Radio.Label>Option 1</Radio.Label>
 *     <Radio.Radio value="option1" />
 *   </Radio.Root>
 * </RadioGroup>
 * ```
 */
export const RadioGroup = RadioGroupRoot
