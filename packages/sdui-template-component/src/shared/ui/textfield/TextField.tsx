import React, { useId, useMemo } from 'react'

import { cn } from '../../lib/cn'
import {
  helpMessageVariants,
  inputTextVariants,
  labelVariants,
  textFieldVariants,
  wrapperVariants,
} from './textfield-variants'
import type { TextFieldContextValue } from './TextFieldContext'
import { TextFieldContext, useTextFieldContext } from './TextFieldContext'
import type {
  TextFieldHelpMessageProps,
  TextFieldInputProps,
  TextFieldLabelProps,
  TextFieldRootProps,
  TextFieldWrapperProps,
} from './types'

/**
 * TextField Root Component
 *
 * @description
 * Root component for TextField compound component pattern.
 * Provides Context to child components (Wrapper, Label, Input, HelpMessage).
 * Manages shared state (error, disabled, required, inputId, size, appearance).
 *
 * @example
 * ```tsx
 * <TextField error={true} errorMessage="Invalid email" size="default" appearance="standard">
 *   <TextField.Wrapper>
 *     <TextField.Label>Email</TextField.Label>
 *     <TextField.Input placeholder="Enter email" />
 *     <TextField.HelpMessage />
 *   </TextField.Wrapper>
 * </TextField>
 * ```
 */
const TextFieldRoot = React.forwardRef<HTMLDivElement, TextFieldRootProps>(
  (
    {
      error = false,
      errorMessage,
      helpMessage,
      disabled = false,
      required = false,
      size = 'default',
      appearance = 'standard',
      nodeId,
      eventId,
      id,
      className,
      children,
    },
    ref,
  ) => {
    // Generate unique ID for label-input connection
    const generatedId = useId()
    const inputId = id ?? generatedId

    // Create context value (memoized to prevent unnecessary re-renders)
    const contextValue: TextFieldContextValue = useMemo(
      () => ({
        inputId,
        error,
        disabled,
        required,
        errorMessage,
        helpMessage,
        size,
        appearance,
      }),
      [inputId, error, disabled, required, errorMessage, helpMessage, size, appearance],
    )

    return (
      <TextFieldContext.Provider value={contextValue}>
        <div ref={ref} className={cn('w-full h-full', className)} data-node-id={nodeId} data-event-id={eventId}>
          {children}
        </div>
      </TextFieldContext.Provider>
    )
  },
)

TextFieldRoot.displayName = 'TextField'

/**
 * TextField Wrapper Component
 *
 * @description
 * Layout container for TextField compound components.
 * Supports horizontal, vertical, and custom orientations.
 *
 * @example
 * ```tsx
 * <TextField.Wrapper orientation="horizontal">
 *   <TextField.Label>Email</TextField.Label>
 *   <TextField.Input />
 * </TextField.Wrapper>
 * ```
 */
const TextFieldWrapper = React.forwardRef<HTMLDivElement, TextFieldWrapperProps>(
  ({ orientation = 'vertical', className, children, ...props }, ref) => {
    const variantClasses = wrapperVariants({ orientation })

    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <div ref={ref} className={cn(variantClasses, className)} {...props}>
        {children}
      </div>
    )
  },
)

TextFieldWrapper.displayName = 'TextField.Wrapper'

/**
 * TextField Label Component
 *
 * @description
 * Label component for TextField.
 * Automatically connects to input via Context (htmlFor/id).
 * Displays required indicator and error styling.
 *
 * @example
 * ```tsx
 * <TextField.Label>Email</TextField.Label>
 * ```
 */
const TextFieldLabel = React.forwardRef<HTMLLabelElement, TextFieldLabelProps>(
  ({ children, className, ...props }, ref) => {
    const { inputId, error, required } = useTextFieldContext()
    const labelId = `${inputId}-label`
    const labelClasses = labelVariants({ error })

    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <label ref={ref} htmlFor={inputId} id={labelId} className={cn(labelClasses, className)} {...props}>
        {children}
        {required && <span className="ml-1 text-[var(--color-text-danger)]">*</span>}
      </label>
    )
  },
)

TextFieldLabel.displayName = 'TextField.Label'

/**
 * TextField Input Component
 *
 * @description
 * Input component for TextField.
 * Supports left/right icons, all standard input props.
 * Uses Context for error, disabled, size, and appearance states.
 *
 * @example
 * ```tsx
 * <TextField.Input
 *   placeholder="Enter email"
 *   type="email"
 *   leftIcon={<EmailIcon />}
 *   rightIcon={<ClearIcon />}
 *   onRightIconClick={handleClear}
 * />
 * ```
 */
const TextFieldInput = React.forwardRef<HTMLInputElement, TextFieldInputProps>(
  (
    {
      placeholder,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      leftIcon,
      rightIcon,
      onRightIconClick,
      type = 'text',
      maxLength,
      autocomplete,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const { inputId, error, disabled, required, helpMessage, errorMessage, size, appearance } = useTextFieldContext()
    const helpMessageId = helpMessage || errorMessage ? `${inputId}-help` : undefined
    const labelId = `${inputId}-label`

    // Use provided id or context inputId
    const finalInputId = id ?? inputId

    // Check if icons are present
    const hasLeftIcon = Boolean(leftIcon)
    const hasRightIcon = Boolean(rightIcon)

    // Get variant classes with new size and appearance variants
    const containerClasses = textFieldVariants({
      size,
      appearance,
      error,
      disabled,
      hasLeftIcon,
      hasRightIcon,
    })

    const inputClasses = inputTextVariants({ disabled })

    return (
      <div className={cn(containerClasses, className)}>
        {/* Left Icon */}
        {leftIcon && (
          <div className="flex size-4 shrink-0 items-center justify-center" aria-hidden="true">
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          id={finalInputId}
          type={type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          autoComplete={autocomplete}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={inputClasses}
          aria-invalid={error}
          aria-describedby={helpMessageId}
          aria-labelledby={labelId}
          aria-required={required}
          tabIndex={disabled ? -1 : undefined}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
        />

        {/* Right Icon */}
        {rightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            disabled={disabled}
            className="flex size-4 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 outline-none focus-visible:outline-none disabled:cursor-not-allowed"
            aria-label="Clear input"
            tabIndex={disabled ? -1 : 0}
          >
            {rightIcon}
          </button>
        )}
      </div>
    )
  },
)

TextFieldInput.displayName = 'TextField.Input'

/**
 * TextField HelpMessage Component
 *
 * @description
 * Help message or error message component for TextField.
 * Automatically displays errorMessage or helpMessage from Context.
 * Supports custom children for override.
 *
 * @example
 * ```tsx
 * <TextField.HelpMessage />
 * // or
 * <TextField.HelpMessage>Custom message</TextField.HelpMessage>
 * ```
 */
const TextFieldHelpMessage = React.forwardRef<HTMLDivElement, TextFieldHelpMessageProps>(
  ({ children, className, error: errorOverride, ...props }, ref) => {
    const { error, errorMessage, helpMessage, inputId } = useTextFieldContext()
    const helpMessageId = `${inputId}-help`

    // Determine which message to show
    const displayError = errorOverride ?? error
    const displayMessage = children ?? (displayError && errorMessage ? errorMessage : helpMessage)

    // Don't render if no message
    if (!displayMessage) {
      return null
    }

    const helpMessageClasses = helpMessageVariants({ error: displayError })

    return (
      <div
        ref={ref}
        id={helpMessageId}
        className={cn(helpMessageClasses, className)}
        role={displayError ? 'alert' : undefined}
        aria-live={displayError ? 'polite' : undefined}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      >
        {displayMessage}
      </div>
    )
  },
)

TextFieldHelpMessage.displayName = 'TextField.HelpMessage'

// Compound Component export
export const TextField = Object.assign(TextFieldRoot, {
  Wrapper: TextFieldWrapper,
  Label: TextFieldLabel,
  Input: TextFieldInput,
  HelpMessage: TextFieldHelpMessage,
})
